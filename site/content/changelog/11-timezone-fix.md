---
title: "时区修复与管理面板优化"
date: "2026-06-04"
description: "SQLite 时间统一修正为北京时间，管理面板连接修复。"
tags: ["修复", "时区", "管理面板"]
order: 1
---

## 时区修复

- **根因**：SQLite `CURRENT_TIMESTAMP` 默认 UTC，比北京时间慢 8 小时，导致评论/留言/共创/页面统计所有时间不对
- **修复**：所有 INSERT 语句显式写 `datetime('now', '+8 hours')`，统计查询用 `date('now', '+8 hours')`
- **纠偏**：第一次修复只改了建表默认值，但 `CREATE TABLE IF NOT EXISTS` 不修改已有表，第二次改成 INSERT 时显式指定才彻底解决
- **历史数据**：两次迁移修正已有记录

## 管理面板

- **根因**：AdminPanel 在 localhost 环境走 `http://api.xolnxoln.cn`，但 API 服务器 HTTP 端口已关闭，导致本地管理面板永远连接不上
- **修复**：统一改为 `https://api.xolnxoln.cn`
