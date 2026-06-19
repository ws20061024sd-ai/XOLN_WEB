---
title: "共创栏目上线"
date: "2026-05-30"
description: "读者投稿系统上线：支持 Markdown 写作、实时预览、审核发布，详情页附带评论功能。"
tags: ["共创", "投稿", "社区"]
order: 3
---

## 做了什么

- **共创栏目 `/community`**：读者可以投稿发表文章，像观念栏一样有独立列表和详情页
- **Markdown 写作**：投稿表单支持 Markdown 格式，附带语法速查，实时预览
- **评论联动**：每篇共创文章底部自动附带评论区（复用现有评论系统）
- **审核机制**：所有投稿默认待审核，管理面板"共创"Tab 一键通过/隐藏/删除
- **导航栏**新增"共创"入口（留言板后面）
- **首页**新增共创引导卡片

## 后端

- 新建 `community_posts` 表（title/author/content/tags/approved）
- 新增 API：`GET/POST /api/community`、`GET /api/community/:id`
- 管理接口：`GET/PATCH/DELETE /api/admin/community`

## 技术要点

- 共创文章存在 API 数据库而非本地 `.md` 文件，页面为客户端渲染（`useSearchParams` 切换列表与详情）
- 详情页通过 `?id=xxx` 定位，与 Next.js 静态导出兼容
- 复用 MarkdownRenderer 渲染正文，图片/视频/Bilibili/YouTube 无缝支持
