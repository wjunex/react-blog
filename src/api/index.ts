import { request } from "./fetcher";
import { BlogItem, BlogListQueryParams, PageResult } from "./types";

export function getBlogList(data: BlogListQueryParams) {
  return request<PageResult<BlogItem>>("/api/public/getList", {
    method: "POST",
    body: data,
    cache: "no-store",
  });
}

export function getBlogDetails(data: { id: string }) {
  return request<BlogItem>("/api/public/getDetails", {
    method: "POST",
    body: data,
    cache: "no-store",
  });
}
