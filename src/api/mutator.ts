import { request } from './fetcher';

export const customInstance = <T>(config: {
  url: string;
  method: string;
  params?: Record<string, unknown>;
  data?: unknown;
  headers?: Record<string, string>;
}): Promise<T> => {
  let url: string = config.url;

  // Append query params for GET/DELETE requests
  if (config.params) {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(config.params)) {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    }
    const qs = searchParams.toString();
    if (qs) url += `?${qs}`;
  }

  return request<T>(url, {
    method: config.method as 'GET' | 'POST' | 'PUT' | 'DELETE',
    body: config.data,
    headers: config.headers,
  });
};
