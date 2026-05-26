# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## 项目概览

XOLN 个人博客网站（https://xolnxoln.cn）。前端 Next.js 16（`output: 'export'` 纯静态）托管在腾讯云 COS + CDN，后端 Hono API（sql.js 数据库）部署在腾讯云 Lighthouse。

**关键架构原则**：前端不感知后端是否存在——`API_BASE` 为空时动态功能静默降级。

**操作前必读**：`docs/` 下有 15 份指导文件，动手前先读 `docs/当前状态与待办.md` 和 `docs/开发审查清单.md`。

---

## 常用命令

```bash
# 本地开发（必须是 3099 端口）
cd site && npm run dev -- --port 3099

# 生产构建
cd site && npm run build

# 上传 COS（构建后）
cd site && COS_SECRET_ID=xxx COS_SECRET_KEY=xxx node upload.js

# 后端本地开发
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
│   ├── changelog/        # 更新日志（8 篇，按 order 排序）
│   ├── beliefs/          # 观念（6 篇：世界观/人生观/价值观/爱情/亲情/友情）
│   ├── works/            # 作品（3 篇）
│   ├── favorites/        # 喜爱（4 篇）
│   └── misc/             # 杂项
├── src/
│   ├── app/              # Next.js App Router 页面
│   │   ├── page.tsx      # 首页
│   │   ├── [section]/[slug]/page.tsx  # 列表+详情通用路由
│   │   ├── guestbook/    # 留言板
│   │   ├── countdown/    # 倒计时
│   │   ├── search/       # 搜索
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
│   │   ├── routes/        # comments/stats/contact/guestbook/admin
│   │   └── db/schema.ts   # SQLite 建表
│   ├── Dockerfile
│   └── docker-compose.yml
├── upload.js              # COS 上传脚本（读环境变量）
└── .env.local             # NEXT_PUBLIC_API_URL=https://api.xolnxoln.cn
```

**内容排序规则**：所有栏目若全部有 `order` 字段则按 order 升序排列；否则按 date 降序。changelog 中 order 越小越新，排在最前。

---

## 关键注意事项

### MarkdownRenderer 死循环
- `###` / `##` / `#` 单独出现（无空格无文本）会触发死循环——标题检查要求空格，但段落循环排除了 `#` 开头，导致该行无法被消费
- 含 `!bilibili[]()` / `!youtube[]()` / `!video[]()` 扩展语法
- 段落循环排除条件：`!` 开头、`` ``` ``、`> `、`- `、`* `、`|` 开头、空行

### 环境变量
- 改 `.env.local` 后必须重启 dev server
- 前端组件只能读 `NEXT_PUBLIC_` 前缀的变量
- 本地 `localhost:3099` 用 `http://api.xolnxoln.cn`，生产用 `https://api.xolnxoln.cn`

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

### 服务端部署
- 服务器 `193.112.220.113`，项目路径 `/srv/blog-api/`
- 更新必须 `docker compose up -d --build`（`restart` 不加载新文件）
- SSH 被阻断时用 Lighthouse WebShell
- 数据库 SQLite 单文件 `/srv/blog-api/data/blog.db`
