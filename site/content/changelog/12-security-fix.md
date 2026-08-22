---
title: "安全修复与部署流程加固"
date: "2026-08-17"
description: "修复管理接口鉴权失效、上传 manifest 误标、数据库写盘等问题，Docker 改为多阶段构建。"
tags: ["安全", "部署", "后端", "修复"]
order: 1
---

## 本次修复

- **管理接口鉴权**：修复子路由中间件路径错误，`/api/admin/*` 现在必须携带 `x-admin-key`；`ADMIN_KEY` 改为必填环境变量，未配置时服务拒绝启动
- **密钥管理**：新增 `server/.env.example`，`.env` 不入库
- **数据库可靠性**：sql.js 初始化改为复用同一个 Promise，避免并发创建多个实例；写盘改为临时文件 + rename 原子替换
- **Docker 部署**：Dockerfile 改为多阶段构建，容器内编译源码，不再依赖手工 scp dist；端口只绑定 127.0.0.1
- **上传脚本**：upload.js 部分失败时不再把失败文件写入 manifest，下次运行自动重试；新增 upload-quant.js 同步量化仪表盘
- **前端健壮性**：统一 API_BASE，修复表单网络异常卡死、社区详情 404 误判、作品评论 slug 冲突

## 部署提醒

后端代码更新后需要上传 `server/` 源码并在服务器执行：

```bash
cd /srv/blog-api/server
docker compose up -d --build
```

服务器上的 `server/.env` 需要配置与本地一致的 `ADMIN_KEY`。
