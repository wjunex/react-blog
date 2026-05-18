import { request } from "./fetcher";
import {
  BlogComment,
  BlogItem,
  BlogListQueryParams,
  PageResult,
} from "./types";

export function getBlogList(data: BlogListQueryParams) {
  return request<PageResult<BlogItem>>("/api/public/getList", {
    method: "POST",
    body: data,
    cache: "no-store",
  });
}

export function getMomentList(data: { pageNum?: number; pageSize?: number }) {
  return request<PageResult<BlogItem>>("/api/public/getMomentList", {
    method: "POST",
    body: data,
    cache: "no-store",
  });
}

export function getBlogDetails(data: { slug?: string; id?: string }) {
  return request<BlogItem>("/api/public/getDetails", {
    method: "POST",
    body: data,
    cache: "no-store",
  });
}

export function getMomentsDetails(data: { id: string }) {
  return request<BlogItem>("/api/public/getMomentsDetails", {
    method: "POST",
    body: data,
    cache: "no-store",
  });
}

export function getBlogCommentTree(data: { slug?: string; id?: string }) {
  return request<BlogComment[]>("/api/public/comment/getTree", {
    method: "POST",
    body: data,
    cache: "no-store",
  });
}

export function addBlogComment(data: BlogComment) {
  return request<BlogComment>("/api/public/comment/add", {
    method: "POST",
    body: data,
    cache: "no-store",
  });
}
