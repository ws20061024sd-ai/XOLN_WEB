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
│   ├── changelog/        # 更新日志（12 篇，按 order 排序）
│   ├── beliefs/          # 观念（6 篇：世界观/人生观/价值观/爱情/亲情/友情）
│   ├── works/            # 作品（子目录=系列，201 篇文章）
│   ├── favorites/        # 喜爱（4 篇）
│   └── misc/             # 杂项
├── src/
│   ├── app/              # Next.js App Router 页面
│   │   ├── page.tsx      # 首页
│   │   ├── [section]/[slug]/page.tsx  # 列表+详情通用路由
│   │   ├── guestbook/    # 留言板
│   │   ├── countdown/    # 倒计时
│   │   ├── search/       # 搜索
│   │   ├── community/    # 共创投稿
│   │   ├── works/[...path]/ # 作品 catch-all
│   │   └── admin/        # 管理面板
│   ├── components/
│   │   ├── MarkdownRenderer.tsx  # 自定义 Markdown 渲染器（零依赖）
│   │   ├── Header.tsx           # 导航栏（毛玻璃效果/移动端汉堡菜单）
│   │   ├── ScrollReveal.tsx     # 滚动动画（默认可见策略）
│   │   ├── ThemeScript.tsx      # 暗色模式防闪烁脚本
│   │   └── PageTransition.tsx   # 路由切换动画
│   ├── lib/
│   │   ├── content.ts     # .md 文件读取 + frontmatter 解析（gray-matter）
│   │   └── api.ts         # API 调用层（API_BASE 解耦）
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

**内容排序规则**：所有栏目若全部有 `order` 字段则按 order 升序排列；否则按 date 降序。changelog 中 order 越小越新，排在最前。

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
- **首次切换新目录时**：旧数据库在 `/srv/blog-api/data/blog.db`，需复制到 `/srv/blog-api/server/data/blog.db` 再启动
- SSH 被阻断时用 Lighthouse WebShell
- 数据库 SQLite 单文件 `/srv/blog-api/server/data/blog.db`
- 管理密钥：`server/.env` 中的 `ADMIN_KEY`，前后端管理面板使用同一个密钥
