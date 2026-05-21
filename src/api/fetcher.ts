const API_BASE = process.env.NEXT_PUBLIC_API_BASE!;

type Method = "GET" | "POST" | "PUT" | "DELETE";

export interface RequestOptions {
  method?: Method;
  headers?: Record<string, string>;
  body?: unknown;
  cache?: RequestCache;
  next?: { revalidate?: number };
}

async function getAuthHeader() {
  try {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (token) return { Authorization: `Bearer ${token}` };
  } catch {
    // cookies() unavailable outside server context (e.g. generateStaticParams)
  }
  return {};
}

export async function request<T>(
  url: string,
  options: RequestOptions = {},
): Promise<T> {
  const {
    method = "GET",
    headers = {},
    body = {},
    cache,
    next,
  } = options;

  const authHeader = await getAuthHeader();

  const res = await fetch(`${API_BASE}${url}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...authHeader,
      ...headers,
    } as Record<string, string>,
    body: body ? JSON.stringify(body) : undefined,
    ...(next ? { next } : cache ? { cache } : {}),
  });

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
