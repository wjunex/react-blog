export type PageResult<T> = {
  records: T[];
  total: number;
  current?: number;
  size?: number;
  pages?: number;
};

export interface BlogListQueryParams {
  id?: number;
  slug?: string;
  title?: string;
  image?: string;
  summary?: string;
  type?: number;
  categoryId?: number;
  categoryType?: string;
  isDelete?: boolean;
  isPublish?: boolean;
  isEdit?: boolean;
  createdTime?: string;
  updatedTime?: string;
  startTime?: string;
  endTime?: string;
  content?: string;
  tagId?: string;
  pageNum?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: string;
}

export interface BlogItem {
  id: number | string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  categoryName?: string;
  createdTime?: string;
  textCount?: number;
  views?: number;
}
