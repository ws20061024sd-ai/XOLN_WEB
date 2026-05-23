---
title: "后端 API 部署上线"
date: "2026-05-15"
description: "Lighthouse 服务器部署 Hono + SQLite API，12 个接口全部可用。"
tags: ["后端", "部署", "API"]
order: 4
---

## 做了什么

- 购买腾讯云 Lighthouse（2C1G，OpenCloudOS 8 + Docker 镜像）
- 公网 IP：193.112.220.113，域名：api.xolnxoln.cn
- 技术栈：Hono（API 框架）+ sql.js（纯 JS SQLite）+ Docker + Nginx
- 8 个公开接口：健康检查、评论获取/提交、统计记录/查询、联系表单
- CORS + 简易限流中间件
- 部署过程中遇到三个问题并解决：
  - **better-sqlite3 跨平台不兼容**：Mac ARM64 编译的二进制在 Linux x86_64 上跑不了 → 换成纯 JS 的 sql.js
  - **Docker 缓存不更新**：`restart` 不会加载新代码 → 必须 `up -d --build`
  - **HTTPS/HTTP 混用**：前端 `https` 调 `http` API 被浏览器拦截 → 统一 HTTP 开发

## 数据库

- SQLite 单文件存储（blog.db），Docker 卷挂载持久化
- 三张表：comments（评论）、pageviews（访问记录）、messages（联系消息）
