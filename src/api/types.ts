export type PageResult<T> = {
  records: T[];
  total: number;
  current?: number;
  size?: number;
  pages?: number;
};

export interface BlogListQueryParams {
  id?: string;
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
  createdTime: string;
  textCount?: number;
  views?: number;
  commentCount?: number;
  likes?: number;
}

export interface BlogComment {
  id?: string;
  slug: string;
  noteId?: string;
  parentId?: string;
  rootId?: string;

  replyUserId?: string;
  userId?: string;

  nickname?: string;
  email?: string;
  website?: string;
  avatar?: string;

  content: string;

  ipLocation?: string;

  /**
   * 回复目标用户昵称
   */
  replyNickname?: string;

  /**
   * 0-待审核 1-正常显示 3-隐藏
   */
  status?: number;

  likeCount?: number;
  replyCount?: number;

  createdTime?: string;

  /**
   * 子评论列表
   */
  children?: BlogComment[];
}

export interface TagItem {
  id: number | string;
  name: string;
}

export interface CategoryItem {
  id: number | string;
  name: string;
  type?: string;
  createdTime?: string;
  description?: string;
}

export interface BloggerInfo {
  username: string;
  avatar: string;
  signature?: string;
  intro?: string;  // html
}
