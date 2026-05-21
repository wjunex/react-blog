# WJUN Blog

个人技术博客，记录开发笔记、生活随想和阶段性的想法。

## 技术栈

- **框架**：Next.js 16（App Router）
- **UI**：React 19 + Tailwind CSS v4
- **语言**：TypeScript
- **内容**：MDX（next-mdx-remote）+ rehype-highlight 代码高亮
- **部署**：Vercel

## 功能特性

- 文章 / 动态 / 归档 / 关于 多页面
- MDX 内容渲染，支持代码块语法高亮与一键复制
- 树形评论系统（嵌套回复、邮件提示、本地持久化、待审核乐观展示）
- 明暗主题切换
- 响应式布局（移动端汉堡菜单）
- 返回顶部
- 页面加载进度条
- Tooltip 悬浮提示

## 本地开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器（端口 8080）
pnpm dev

# 构建
pnpm build
```

打开 http://localhost:8080 查看。

## 目录结构

```
src/
├── api/            # API 请求层
├── app/            # Next.js App Router 页面
│   ├── about/      # 关于页
│   ├── archives/   # 归档页
│   ├── blog/       # 文章列表 & 详情
│   └── moments/    # 动态列表 & 详情
├── assets/         # 样式等静态资源
├── components/     # 通用组件
│   ├── Comment/    # 评论系统
│   └── List/       # 列表组件
├── layout/         # 布局组件（导航栏、页脚）
└── utils/          # 工具函数
```

## 待开发

- [ ] 新增接口控制是否展示评论区
- [ ] 新增文章详情页的目录组件
- [ ] 新增动态图片展示
- [ ] 完善点赞功能
- [ ] 完善文章标签系统
- [ ] 优化自动部署流程,使用阿里云镜像库
- [ ] 新增搜索功能、搜索结果页（方便展示同一分类或者标签的文章）