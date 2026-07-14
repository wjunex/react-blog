import { getAccessToken } from "@/lib/token";

const BASE = process.env.NEXT_PUBLIC_API_BASE!;

const API_BASE =
  typeof window === "undefined"
    ? BASE
    : BASE === "http://localhost:3000"
      ? ""
      : BASE;

type Method = "GET" | "POST" | "PUT" | "DELETE";

export interface RequestOptions {
  method?: Method;
  headers?: Record<string, string>;
  body?: unknown;
  cache?: RequestCache;
  next?: { revalidate?: number };
}

// ── auth header ──

async function getAuthHeader(): Promise<Record<string, string>> {
  if (typeof window === "undefined") {
    try {
      const { cookies } = await import("next/headers");
      const cookieStore = await cookies();
      const token = cookieStore.get("accessToken")?.value;
      if (token) return { Authorization: `Bearer ${token}` };
    } catch {
      // cookies() unavailable (e.g., build time or client context)
    }
    return {};
  }

  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ── refresh logic (client only) ──

let refreshPromise: Promise<boolean> | null = null;

async function tryRefresh(): Promise<boolean> {
  // Already refreshing — wait for the existing attempt
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const { getRefreshToken, setTokens } = await import("@/lib/token");
      const refreshToken = getRefreshToken();
      if (!refreshToken) return false;

      const res = await fetch(`${API_BASE}/api/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      const json = await res.json();
      if (json.code === 200) {
        setTokens(json.data.accessToken, json.data.refreshToken);
        return true;
      }
      return false;
    } catch {
      return false;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

// ── request ──

export async function request<T>(
  url: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = "GET", headers = {}, body, cache, next } = options;

  async function doFetch() {
    const authHeader = await getAuthHeader();
    const isAuthed = "Authorization" in authHeader;

    let cacheOption: object = {};
    if (isAuthed) {
      cacheOption = { cache: "no-store" };
    } else if (next) {
      cacheOption = { next };
    } else if (cache) {
      cacheOption = { cache };
    }

    const isFormData = body instanceof FormData;

    const mergedHeaders: Record<string, string> = {
      ...authHeader,
      ...headers,
    };
    if (isFormData) {
      delete mergedHeaders["Content-Type"];
      delete mergedHeaders["content-type"];
    } else {
      mergedHeaders["Content-Type"] = "application/json";
    }

    return fetch(`${API_BASE}${url}`, {
      method,
      headers: mergedHeaders,
      body: isFormData ? (body as FormData) : (body ? JSON.stringify(body) : undefined),
      ...cacheOption,
    });
  }

  let res = await doFetch();

  // 401 interceptor (client only — server can't persist refreshed tokens)
  if (res.status === 401 && typeof window !== "undefined") {
    const refreshed = await tryRefresh();
    if (refreshed) {
      res = await doFetch();
    } else {
      const { clearTokens } = await import("@/lib/token");
      clearTokens();
      window.location.href = "/login";
      throw new Error("登录已过期，请重新登录");
    }
  }

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`API Error: ${res.status} - ${errorText}`);
  }

  const json = await res.json();

  if (json.code !== 200) {
    throw new Error(json.msg || "API Error");
  }

  return json.data as T;
}
