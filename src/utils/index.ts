/**
 * 格式化日期
 * @param value - 日期字符串
 * @param options - Intl.DateTimeFormatOptions
 * @returns 格式化后的日期字符串，或 null
 */
export function formatDate(
  value?: string,
  options?: Intl.DateTimeFormatOptions,
) {
  if (!value) {
    return null;
  }

  const date = new Date(value.replace(" ", "T"));

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...options,
  }).format(date);
}

/** 年月日格式 */
export const DATE_ONLY: Intl.DateTimeFormatOptions = {};

/** 年月日+时分格式 */
export const DATE_TIME: Intl.DateTimeFormatOptions = {
  hour: "2-digit",
  minute: "2-digit",
};

/** 年月日+时分+星期格式 */
export const DATE_TIME_WEEKDAY: Intl.DateTimeFormatOptions = {
  hour: "2-digit",
  minute: "2-digit",
  weekday: "short",
};

/**
 * 解析 searchParams 中的数字参数
 */
export function getQueryNumber(
  value: string | string[] | undefined,
  fallback: number,
) {
  const rawValue = Array.isArray(value) ? value[0] : value;
  const parsedValue = Number(rawValue);

  if (!Number.isInteger(parsedValue) || parsedValue < 1) {
    return fallback;
  }

  return parsedValue;
}

/**
 * 取出第一个大标题后剩余的文本
 */
export function removeFirstH1(markdown?: string | null) {
  if (!markdown) {
    return "";
  }

  return markdown.replace(/^\s*#\s+.+\n?/, "");
}

/** 提取 Markdown 纯文本（去除所有格式化符号） */
export function getPlainText(md: string) {
  return md
    .replace(/!\[.*?\]\(.*?\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/`{1,3}[^`]+`{1,3}/g, "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/[*_~#>]+/g, "")
    .replace(/^\s+/gm, "")
    .replace(/\n+/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

/** 从 Markdown 提取摘要（前 max 字，跳过标题行） */
export function getSummary(md: string, max = 200) {
  const text = md.split("\n").filter((l) => !/^#{1,6}\s/.test(l.trim())).join(" ");
  const plain = getPlainText(text);
  return plain.length <= max ? plain : `${plain.slice(0, max).trimEnd()}…`;
}

/** 提取 Markdown 中第一张图片 URL */
export function getFirstImage(md: string) {
  const m = md.match(/!\[.*?\]\((.*?)\)/);
  return m?.[1] || "";
}

import type { Tag } from "@/api/generated/models";

/** 按首字母排序标签（英文优先，中文拼音序） */
export function sortTagsByName(tags: Tag[]): Tag[] {
  return [...tags].sort((a, b) => {
    const na = a.name || "", nb = b.name || "";
    const aLatin = /^[a-zA-Z]/.test(na);
    const bLatin = /^[a-zA-Z]/.test(nb);
    if (aLatin && !bLatin) return -1;
    if (!aLatin && bLatin) return 1;
    return na.localeCompare(nb);
  });
}
