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
