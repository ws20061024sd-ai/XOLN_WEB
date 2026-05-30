---
title: "留言板 + 管理面板完善"
date: "2026-05-18"
description: "新增留言板页面和 API，管理面板补齐留言管理，API 全面启用 HTTPS。"
tags: ["留言板", "管理", "HTTPS"]
order: 3
---

## 留言板 `/guestbook`

- 新增留言板页面：留言列表 + 提交表单
- API：`GET /api/guestbook`（获取留言）、`POST /api/guestbook`（提交留言）
- 数据库新建 guestbook 表（author/content/approved/created_at）
- 导航栏新增"留言板"入口，首页新增留言板卡片
- GuestbookClient 改用 `NEXT_PUBLIC_API_URL` 环境变量，与评论系统保持一致

## 管理面板完善

- 新增"留言管理"Tab：查看所有留言、删除留言
- 修复构建错误：AdminPanel 的 tabs 数组漏加 `"guestbook"` 导致 TypeScript 编译失败，页面无法生成
- 管理接口 `/api/admin/guestbook` 及删除接口上线

## API 安全升级

- API 全面启用 HTTPS（Let's Encrypt 证书 + certbot 自动续期）
- CORS 配置完善：允许 PATCH/DELETE/OPTIONS 方法，允许自定义头 `x-admin-key`
- 管理面板生产环境自动使用 `https://api.xolnxoln.cn`
