const API_BASE = process.env.NEXT_PUBLIC_API_BASE!;

type Method = "GET" | "POST" | "PUT" | "DELETE";

export interface RequestOptions {
  method?: Method;
  headers?: Record<string, string>;
  body?: unknown;
  cache?: RequestCache;
  revalidate?: number;
  next?: { revalidate?: number };
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
    revalidate,
    next,
  } = options;

  const res = await fetch(`${API_BASE}${url}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,

    // Next.js 专用缓存策略
    cache,
    next: next ? { revalidate: next.revalidate } : revalidate ? { revalidate } : undefined,
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
