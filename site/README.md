# 我的网站（xolnxoln.cn）

个人网站静态前端 + Hono API 后端。

## 目录结构

```
博客/
├── docs/                  # 项目文档、架构方案、部署清单
├── site/                  # Next.js 前端（静态导出到 out/）
│   ├── content/           # Markdown 内容
│   ├── server/            # Hono + sql.js API 后端
│   ├── upload.js          # 增量上传 out/ 到腾讯云 COS
│   └── upload-quant.js    # 上传量化仪表盘到 COS works/quant/
└── 废弃文件/              # 历史归档
```

## 本地开发

```bash
cd site
npm install
npm run dev -- --port 3099
```

环境变量放在 `site/.env.local`（前端）和 `site/server/.env`（后端，不入库）。

后端开发：

```bash
cd site/server
npm install
npm run dev        # 自动读取 .env；ADMIN_KEY 未配置会拒绝启动
```

## 构建与部署

```bash
cd site
npm run build                 # 生成 out/
node upload.js                # 增量上传前端到 COS
npm run upload:quant          # 量化仪表盘生成后同步上传
```

后端 Docker 多阶段构建：

```bash
cd site/server
cp .env.example .env          # 配置 ADMIN_KEY
docker compose up -d --build
```

详见 `docs/开发审查清单.md` 和 `docs/后端架构方案.md`。

## 管理面板

入口：页脚 `©` 或 `/admin`。密钥为 `server/.env` 中的 `ADMIN_KEY`，通过请求头 `x-admin-key` 校验。
