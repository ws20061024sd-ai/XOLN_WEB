---
title: "列表+详情架构重构"
date: "2026-05-14"
description: "所有栏目拆分为列表页+详情页，引入 frontmatter 元数据和 order 排序。"
tags: ["架构", "重构"]
order: 4
---

## 做了什么

- **架构重构**：5 个栏目（观念/作品/喜爱/更新/杂项）从单页拆分为列表页 + 详情页
- **Frontmatter 系统**：每篇 `.md` 文件顶部用 YAML 写元数据（title/date/description/tags/order）
- **Order 排序**：所有栏目统一用 `order` 字段控制文章顺序
- **ContentList 组件**：可复用的列表页组件，显示标题+简介+日期+标签
- **ContentDetail 组件**：可复用的详情页组件，含返回链接
- 关于页保持单页不变
- 导航栏更新：杂项移到页脚，加搜索图标
- 搜索页 `/search` 上线：客户端模糊搜索，逐字匹配

## 内容组织

```
content/
├── about.md          ← 单页
├── beliefs/          ← 6 篇（世界观/人生观/价值观/爱情/亲情/友情）
├── works/            ← 3 篇
├── favorites/        ← 4 篇（电影/音乐/书籍/活动）
├── changelog/        ← 更新日志
└── misc/             ← 杂项（含 MD 测试）
```

## 前端路由

```
/about             单页
/beliefs           列表
/beliefs/[slug]    详情
/works             列表
/works/[slug]      详情
...（其余栏目同理）
/search            搜索
```
