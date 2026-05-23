---
title: "项目初始化"
date: "2026-05-12"
description: "搭建 Next.js 16 项目，确立静态优先+渐进增强的架构方向。"
tags: ["架构", "初始化"]
order: 8
---

## 做了什么

- 使用 Next.js 16 + TypeScript + Tailwind CSS v4 初始化项目
- 配置 `output: 'export'` 静态导出模式，目标部署到腾讯云 COS
- 建立 7 个栏目：首页、关于、观念、作品、喜爱、更新日志、杂项
- 内容用 `.md` 文件管理，构建时渲染为静态 HTML
- 制定"先静后动"的渐进增强策略：Phase 1 纯静态，Phase 2 加 Lighthouse 后端
- 创建 11 份规划文档（docs/ 目录）
- 代码托管到 GitHub（ws20061024sd-ai/XOLN_WEB）

## 技术选型

| 层级 | 选择 |
|------|------|
| 框架 | Next.js 16 |
| 样式 | Tailwind CSS v4 |
| 内容 | Markdown + gray-matter frontmatter |
| 渲染 | 自写 MarkdownRenderer |
| 部署 | 腾讯云 COS |
