import { request } from "./fetcher";
import {
  BlogComment,
  BlogItem,
  BlogListQueryParams,
  PageResult,
  CategoryItem,
  TagItem,
  BloggerInfo,
  TokenResponse,
} from "./types";

// ── 列表类数据（变更频率低，使用缓存 + 增量更新） ──

export function getBlogList(data: BlogListQueryParams) {
  return request<PageResult<BlogItem>>("/api/public/list", {
    method: "POST",
    body: data,
    next: { revalidate: 300 }, // 5 分钟 ISR
  });
}

export function getMomentList(data: { pageNum?: number; pageSize?: number }) {
  return request<PageResult<BlogItem>>("/api/public/moment-list", {
    method: "POST",
    body: data,
    next: { revalidate: 300 }, // 5 分钟 ISR
  });
}

export function getCategoryList() {
  return request<CategoryItem[]>("/api/public/category-list", {
    method: "POST",
    body: {},
    next: { revalidate: 600 }, // 10 分钟
  });
}

export function getTagList() {
  return request<TagItem[]>("/api/public/tag-list", {
    method: "POST",
    body: {},
    next: { revalidate: 600 }, // 10 分钟
  });
}

export function getListByYear() {
  return request<{ [year: number]: BlogItem[] }>("/api/public/list-by-year", {
    method: "POST",
    body: {},
    next: { revalidate: 600 }, // 10 分钟（归档数据几乎不变）
  });
}

// ── 博主信息（全局复用，ISR 缓存） ──

export function getBloggerInfo() {
  return request<BloggerInfo>("/api/public/user-info", {
    method: "POST",
    body: {},
    next: { revalidate: 600 },
  });
}

// ── 详情类数据（使用 ISR） ──

export function getBlogDetails(data: { slug?: string; id?: string }) {
  return request<BlogItem>("/api/public/detail", {
    method: "POST",
    body: data,
    next: { revalidate: 600 }, // 10 分钟增量更新
  });
}

// ── 认证相关（不缓存） ──

export function login(data: { phone: string; password: string }) {
  return request<TokenResponse>("/api/auth/login", {
    method: "POST",
    body: data,
    cache: "no-store",
  });
}

export function refreshToken(data: { refreshToken: string }) {
  return request<TokenResponse>("/api/auth/refresh", {
    method: "POST",
    body: data,
    cache: "no-store",
  });
}

export function logoutFromServer(data: { refreshToken: string }) {
  return request<null>("/api/auth/logout", {
    method: "POST",
    body: data,
    cache: "no-store",
  });
}

// ── 发布类（需登录，不缓存） ──

export function saveNote(data: { content: string }) {
  return request<null>("/api/note/save", {
    method: "POST",
    body: { ...data, type: 2, isPublish: true },
    cache: "no-store",
  });
}

// ── 评论类数据（实时性要求高，不缓存） ──

export function getBlogCommentTree(data: { slug?: string; id?: string }) {
  return request<BlogComment[]>("/api/public/comment/tree", {
    method: "POST",
    body: data,
    cache: "no-store",
  });
}

export function addBlogComment(data: BlogComment) {
  return request<BlogComment>("/api/public/comment/save", {
    method: "POST",
    body: data,
    cache: "no-store",
  });
}
