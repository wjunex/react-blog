export type PageResult<T> = {
  records: T[];
  total: number;
  current?: number;
  size?: number;
};

export interface BlogListQueryParams {
  id?: number;
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
  id: number;
  title: string;
  summary: string;
  content: string;
}
