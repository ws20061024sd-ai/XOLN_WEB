# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## 项目概览

XOLN 个人博客网站（https://xolnxoln.cn）。前端 Next.js 16（`output: 'export'` 纯静态）托管在腾讯云 COS + CDN，后端 Hono API（sql.js 数据库）部署在腾讯云 Lighthouse。

**关键架构原则**：前端不感知后端是否在线——统一从 `src/lib/api.ts` 取 `API_BASE`，请求失败时降级或提示错误。

**操作前必读**：`docs/` 下有多份指导文件，动手前先读 `docs/当前状态与待办.md`、`docs/开发审查清单.md`；完整修改记录见 `docs/本次代码审查与修改报告_2026-08-17.md`。

---

## 常用命令

```bash
# 本地开发（必须是 3099 端口）
cd site && npm run dev -- --port 3099

# 生产构建
cd site && npm run build

# 上传 COS（构建后）
cd site && COS_SECRET_ID=xxx COS_SECRET_KEY=xxx node upload.js

# 上传量化仪表盘（量化项目生成 output 后）
cd site && COS_SECRET_ID=xxx COS_SECRET_KEY=xxx npm run upload:quant

# 后端本地开发（自动读取 server/.env）
cd site/server && npm run dev

# 后端构建
cd site/server && npm run build
```

---

## 架构

```
site/
├── content/              # Markdown 内容文件（前端读取渲染）
│   ├── about.md          # 单页
│   ├── changelog/        # 更新日志（14 篇，按 order 排序）
│   ├── beliefs/          # 观念（6 篇：世界观/人生观/价值观/爱情/亲情/友情）
│   ├── works/            # 作品（子目录=系列，201 篇文章；系列 _index.md 定义中文显示名）
│   ├── favorites/        # 喜爱（4 篇）
│   └── misc/             # 杂项
├── src/
│   ├── app/              # Next.js App Router 页面
│   │   ├── page.tsx      # 首页（Hero + 探索卡片 + 内容动态）
│   │   ├── [section]/[slug]/page.tsx  # 列表+详情通用路由
│   │   ├── guestbook/    # 留言板
│   │   ├── countdown/    # 倒计时
│   │   ├── search/       # 搜索
│   │   ├── community/    # 共创投稿
│   │   ├── apps/         # 应用（日语学习舱入口）
│   │   ├── works/[...path]/ # 作品 catch-all
│   │   └── admin/        # 管理面板
│   ├── components/
│   │   ├── MarkdownRenderer.tsx  # 自定义 Markdown 渲染器（零依赖）
│   │   ├── Header.tsx           # 导航栏（毛玻璃效果/移动端汉堡菜单）
│   │   ├── ScrollReveal.tsx     # 滚动动画（默认可见策略）
│   │   ├── ThemeScript.tsx      # 暗色模式防闪烁脚本
│   │   ├── PageTransition.tsx   # 路由切换动画
│   │   └── ContentUpdates.tsx   # 首页内容动态（时间线+展开）
│   ├── lib/
│   │   ├── content.ts     # .md 文件读取 + frontmatter 解析（gray-matter）
│   │   ├── api.ts         # API 调用层（API_BASE 解耦）
│   │   └── updates.ts     # 首页内容动态（git 提交历史扫描，仅服务端）
│   └── app/globals.css    # 完整设计系统（CSS 变量/暗色模式/动画/排版）
├── server/                # 后端 API（独立部署到 Lighthouse）
│   ├── src/
│   │   ├── index.ts       # Hono 入口（CORS/限流/路由注册）
│   │   ├── load-env.ts    # 开发环境加载 .env
│   │   ├── routes/        # comments/stats/contact/guestbook/community/admin
│   │   └── db/schema.ts   # SQLite 建表 + 原子落盘
│   ├── .env.example       # 管理密钥模板（.env 不入库）
│   ├── Dockerfile         # 多阶段构建（容器内 npm ci + tsc）
│   └── docker-compose.yml
├── upload.js              # COS 增量上传脚本（读环境变量）
├── upload-quant.js        # 量化仪表盘上传脚本
└── .env.local             # NEXT_PUBLIC_API_URL=https://api.xolnxoln.cn
```

**内容排序规则**：所有栏目若全部有 `order` 字段则按 order 升序排列；否则按 date 降序。changelog 中 order 越小越新，排在最前。作品栏目的目录排序：有 `order` 按 order 升序，无 order 按名称排在后面（文件排序规则不变）。

**作品系列显示名**：系列文件夹名保持英文（它决定 URL，评论 slug 依赖它，改中文会导致评论失联 + dev 模式路径 bug）；中文显示名/描述/排序写在系列目录内的 `_index.md` 里。`_` 开头的 `.md` 是元数据文件，不显示为文章、不进搜索索引、不进首页内容动态。

---

## 关键注意事项

### MarkdownRenderer 注意事项
- 历史上 `###` / `##` / `#` 单独出现（无空格无文本）曾触发死循环，已修复：段落收集循环不再排除 `#` 开头，合法标题会在前面被捕获
- 含 `!bilibili[]()` / `!youtube[]()` / `!video[]()` 扩展语法
- 段落循环排除条件：`!` 开头、`` ``` ``、`> `、`- `、`* `、`|` 开头、空行

### 环境变量
- 改 `.env.local` 后必须重启 dev server
- 前端组件只能读 `NEXT_PUBLIC_` 前缀的变量
- 前端 API 地址统一走 `src/lib/api.ts` 的 `API_BASE`
- 后端 `server/.env` 必须配置 `ADMIN_KEY`（≥12 位），未配置时拒绝启动

### Dev Server 诊断
本地 `localhost:3099` 打不开时：
1. `lsof -i :3099` 确认进程是否存在
2. `curl http://localhost:3099` 确认是否响应
3. 连接不响应 → `kill -9 PID && rm -rf .next && npm run dev -- --port 3099`

### COS 上传
- 桶 `xolnxoln-1431302682`，区域 `ap-guangzhou`
- 必须设 Content-Type（MIME 映射表在 upload.js 中）
- 上传后需手动刷新 CDN 缓存（腾讯云控制台）
- CDN 源站必须用 COS 网站端点（`cos-website`），不能用标准端点
- 量化仪表盘用 `npm run upload:quant` 单独上传到 `works/quant/`

### 服务端部署
- 服务器 `193.112.220.113`，项目路径 `/srv/blog-api/server/`
- 更新流程：上传 `server/` 源码 → 服务器 `docker compose up -d --build`（容器内编译，`restart` 不加载新代码）
- **数据库在 `/srv/blog-api/server/data/blog.db`**（旧备份在 `/srv/blog-api/data/blog.db`）
- SSH 被阻断时用 Lighthouse WebShell
- 管理密钥：`server/.env` 中的 `ADMIN_KEY`（本地与服务器保持一致，密钥不入库）
- 容器名是 `server-api-1`（不是 api-1）

### SSL 证书（两条线）
- **API**（`api.xolnxoln.cn`）：服务器上 Let's Encrypt，certbot 自动续期。曾因 8-21 过期导致整个 API 不可访问（页面像"数据丢失"），续期命令：`certbot renew --nginx && systemctl reload nginx`。注意：`xolnxoln.cn` 在服务器上的 LE 证书续期失败可忽略（前端走 CDN 证书）
- **前端**（`xolnxoln.cn`）：CDN TrustAsia 证书，腾讯云控制台手动续期（每 90 天）

### 首页内容动态机制
- 首页"内容动态"区块自动扫描 git 提交历史（`src/lib/updates.ts`，构建时执行）
- 每次 git 提交 → 重新构建上传 → 首页动态自动更新，无需手动维护
- 排除了 changelog 目录（那是技术方向）；works 下 title 为空的空模板自动跳过
- 重要：`updates.ts` 只在服务端用，不能 import 到客户端组件（child_process 会被 Turbopack 拒绝）
