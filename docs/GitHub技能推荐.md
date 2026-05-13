# GitHub 技能推荐

## GitHub Actions（CI/CD 自动化）

### 构建与部署

| Action | 用途 |
|------|------|
| [actions/checkout](https://github.com/actions/checkout) | 拉取仓库代码，所有 workflow 的第一步 |
| [actions/setup-node](https://github.com/actions/setup-node) | 安装 Node.js，可指定版本、缓存 npm/pnpm |
| [actions/cache](https://github.com/actions/cache) | 缓存 `node_modules`、`.next/cache`，加速构建 |
| [actions/upload-pages-artifact](https://github.com/actions/upload-pages-artifact) | 构建产物打包，配合 GitHub Pages 用 |
| [actions/deploy-pages](https://github.com/actions/deploy-pages) | 部署到 GitHub Pages |
| [peaceiris/actions-gh-pages](https://github.com/peaceiris/actions-gh-pages) | 把构建产物推到 gh-pages 分支 |
| [JamesIves/github-pages-deploy-action](https://github.com/JamesIves/github-pages-deploy-action) | 同上，社区最流行的 Pages 部署 Action |
| [TencentCloud/cos-action](https://github.com/TencentCloud/cos-action) | 腾讯云官方 COS 上传 Action，替代手动 COSCMD |

### 代码质量

| Action | 用途 |
|------|------|
| [actions/setup-node](https://github.com/actions/setup-node) + `npm run lint` | 提交前自动 ESLint/Prettier 检查 |
| [reviewdog/action-eslint](https://github.com/reviewdog/action-eslint) | ESLint 结果以 PR 评论形式展示 |
| [lycheeverse/lychee-action](https://github.com/lycheeverse/lychee-action) | 检测 Markdown 中的死链接 |
| [tcort/markdown-link-check](https://github.com/tcort/markdown-link-check) | 同上，Markdown 链接检查 |
| [markdownlint/markdownlint](https://github.com/markdownlint/markdownlint) | Markdown 格式规范检查 |

### 定时与自动化

| Action | 用途 |
|------|------|
| [google-github-actions/release-please](https://github.com/google-github-actions/release-please) | 自动生成 CHANGELOG + Release PR |
| [peter-evans/create-pull-request](https://github.com/peter-evans/create-pull-request) | 脚本修改文件后自动创建 PR |
| [stefanzweifel/git-auto-commit-action](https://github.com/stefanzweifel/git-auto-commit-action) | 自动提交 diff（如构建产物变更） |
| [lannonbr/vscode-action](https://github.com/lannonbr/vscode-action) | 在 CI 中用 VS Code 做自动化 |

### 通知与发布

| Action | 用途 |
|------|------|
| [slackapi/slack-github-action](https://github.com/slackapi/slack-github-action) | 构建结果发 Slack |
| [Ilshidur/action-discord](https://github.com/Ilshidur/action-discord) | 构建结果发 Discord |
| [softprops/action-gh-release](https://github.com/softprops/action-gh-release) | 自动创建 GitHub Release |
| [ncipollo/release-action](https://github.com/ncipollo/release-action) | 同上，功能更全 |

---

## 博客专用 Workflow 示例

### 1. 构建 + 部署到 COS

```yaml
# .github/workflows/deploy.yml
name: Deploy to COS

on:
  push:
    branches: [main]
  workflow_dispatch:  # 允许手动触发

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - run: npm ci
      - run: npm run build   # next build → out/

      - name: Upload to COS
        uses: TencentCloud/cos-action@v1
        with:
          secret_id: ${{ secrets.COS_SECRET_ID }}
          secret_key: ${{ secrets.COS_SECRET_KEY }}
          cos_bucket: ${{ secrets.COS_BUCKET }}
          cos_region: ${{ secrets.COS_REGION }}
          local_path: out/
          remote_path: /
          clean: true          # 删除 COS 上多余文件
```

### 2. 定时检查死链接

```yaml
# .github/workflows/link-check.yml
name: Check Dead Links

on:
  schedule:
    - cron: '37 8 * * 1'   # 每周一早 8 点

jobs:
  link-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: lycheeverse/lychee-action@v1
        with:
          args: '--base . --no-progress content/**/*.mdx'
          fail: true
```

### 3. 草稿自动发布

```yaml
# .github/workflows/publish-drafts.yml
# 定时将 draft: true 的文章批量改为 draft: false
name: Publish Drafts

on:
  schedule:
    - cron: '17 9 * * 6'   # 每周六早 9 点
  workflow_dispatch:
    inputs:
      slug:
        description: '指定文章 slug（留空则发布所有）'

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: |
          # 用 sed 批量修改 frontmatter 中的 draft: true → draft: false
          find content/ -name '*.mdx' -exec sed -i 's/^draft: true$/draft: false/' {} \;
      - uses: stefanzweifel/git-auto-commit-action@v5
        with:
          commit_message: 'chore: publish scheduled drafts'
      # 提交后会触发 deploy workflow
```

---

## GitHub Apps & 集成

### 博客场景常用

| App | 用途 |
|------|------|
| [Giscus](https://github.com/apps/giscus) | 基于 Discussions 的评论系统，需安装到仓库 |
| [ImgBot](https://github.com/apps/imgbot) | 自动优化图片（压缩、转 WebP），给仓库提 PR |
| [Stale](https://github.com/apps/stale) | 自动关闭长期未活动的 Issue/Discussion |
| [WakaTime](https://github.com/apps/wakatime) | 编码时间统计，挂到 README 展示 |
| [GitHub Readme Stats](https://github.com/anuraghazra/github-readme-stats) | README 动态统计卡片（不是 App，是外部服务） |

### 项目管理

| App | 用途 |
|------|------|
| [GitHub Projects](https://github.com/features/issues) | 内置看板，管理文章写作计划（todolist 式） |
| [Linear](https://linear.app) | 专业项目管理，和 GitHub 双向同步 |
| [ZenHub](https://www.zenhub.com) | 浏览器扩展，在 GitHub 上加看板/燃尽图 |

---

## GitHub CLI (`gh`)

```bash
# 仓库管理
gh repo create blog --public --push --source .
gh repo view --web                     # 浏览器打开仓库

# Issues / Discussions
gh issue create --title "新文章想法" --body "想写一篇关于xxx的文章"
gh issue list --label "writing"
gh discussion list

# PR 操作
gh pr create --title "新文章: xxx" --body "请review"
gh pr merge --squash

# API 调用（GraphQL）
gh api graphql -f query='
  query {
    repository(owner: "me", name: "blog") {
      discussions(first: 10) {
        nodes { title, body }
      }
    }
  }'

# Release
gh release create v1.0.0 --generate-notes

# 环境变量/密钥管理
gh secret set COS_SECRET_ID --body "xxx"
gh variable set COS_REGION --body "ap-guangzhou"
```

---

## 网页美观化（GitHub 开源项目）

### CSS / 动效库

| 项目 | 用途 |
|------|------|
| [animate.css](https://github.com/animate-css/animate.css) | 最经典的 CSS 动画库，一行 class 加动效，即插即用 |
| [hover.css](https://github.com/IanLunn/Hover) | 专门做 hover 效果的 CSS3 库，按钮/图标/链接全覆盖 |
| [csstype](https://github.com/frenic/csstype) | TypeScript 的 CSS 类型定义，写 CSS-in-JS 时有补全 |
| [magic.css](https://github.com/miniMAC/magic) | 比 animate.css 更花哨的特效动画合集 |
| [loading.io](https://github.com/loadingio/css-spinner) | 纯 CSS loading spinner，几十种风格 |
| [three.js](https://github.com/mrdoob/three.js) | WebGL 3D 库，做粒子背景/3D 交互（博客慎用，影响性能） |

### Tailwind 生态（社区扩展）

| 项目 | 用途 |
|------|------|
| [tailwindcss-animate](https://github.com/jamiebuilds/tailwindcss-animate) | Tailwind 动画预设，一行 class 完成进入/退出动画 |
| [tailwindcss-typography](https://github.com/tailwindlabs/tailwindcss-typography) | Tailwind 官方排版插件（`prose` 类） |
| [daisyUI](https://github.com/saadeghi/daisyui) | Tailwind 组件库，按钮/卡片/导航等开箱即用 |
| [tailwindcss-animated](https://github.com/new-data-services/tailwindcss-animated) | 另一个 Tailwind 动效插件，和 animate.css 思路不同 |
| [preline](https://github.com/htmlstreamofficial/preline) | Tailwind UI 组件集，比 daisyUI 更偏企业风格 |
| [flowbite](https://github.com/themesberg/flowbite) | Tailwind 组件库，设计质量高，有 Figma 设计稿 |

### 背景 / 图案 / 纹理

| 项目 | 用途 |
|------|------|
| [pattern.css](https://github.com/bansal-io/pattern.css) | 纯 CSS 背景图案（圆点/网格/条纹），零 JS |
| [particles.js](https://github.com/VincentGarreau/particles.js) | 粒子动画背景，经典且轻量 |
| [tsparticles](https://github.com/tsparticles/tsparticles) | particles.js 的现代替代，TS 重写，功能更强 |
| [hero-patterns](https://heropatterns.com) | SVG 背景图案生成器，可直接复制 SVG/CSS |
| [haikei](https://github.com/haikei/app) | SVG 波浪/渐变/网格生成器（开源前端） |
| [bg.ibelick](https://bg.ibelick.com) | 代码化背景生成，复制即用 |

### 渐变 / 阴影

| 项目 | 用途 |
|------|------|
| [uiGradients](https://github.com/ghosh/uiGradients) | 渐变配色集合，350+ 种现成渐变 |
| [gradient-king](https://github.com/saviomartin/gradient-king) | 渐变推荐引擎，按色系分类 |
| [shadows](https://github.com/brumm/afang) | 精美阴影 CSS 代码合集，即复制即用 |
| [neumorphism.io](https://neumorphism.io) | 新拟态阴影生成器（软 UI 风格） |
| [glass-ui](https://ui.glass/generator) | 毛玻璃效果 CSS 生成器 |

### 排版美化

| 项目 | 用途 |
|------|------|
| [typography.js](https://github.com/KyleAMathews/typography.js) | Gatsby 生态的排版引擎，独立也可用 |
| [FitText.js](https://github.com/davatron5000/FitText.js) | 让标题自适应宽度，适合大屏 hero 标题 |
| [underline.js](https://github.com/wentin/underlineJS) | 花式下划线效果 |
| [lettering.js](https://github.com/davatron5000/Lettering.js) | 逐字控制 CSS，做文字特效 |

### 滚动与视差

| 项目 | 用途 |
|------|------|
| [AOS](https://github.com/michalsnik/aos) | Animate On Scroll——滚动到元素时才触发动画 |
| [scrollreveal](https://github.com/jlmakes/scrollreveal) | 同上，更轻量、API 更简洁 |
| [locomotive-scroll](https://github.com/locomotivemtl/locomotive-scroll) | 平滑滚动 + 视差效果，体验极好 |
| [simpleParallax](https://github.com/geosigno/simpleParallax.js) | 图片视差，极简 API |
| [rellax](https://github.com/dixonandmoe/rellax) | 最轻的视差库（仅 1KB），纯 vanilla JS |

### 代码展示美化

| 项目 | 用途 |
|------|------|
| [shiki](https://github.com/shikijs/shiki) | VS Code 同款语法高亮引擎，rehype-pretty-code 的底层 |
| [prism](https://github.com/PrismJS/prism) | 最老牌的语法高亮，插件生态丰富（行号/工具栏/复制） |
| [highlight.js](https://github.com/highlightjs/highlight.js) | 自动语言检测，主题多，上手快 |
| [carbon](https://github.com/carbon-app/carbon) | 代码转精美截图，适合社交媒体分享 |
| [code-surfer](https://github.com/pomber/code-surfer) | MDX 代码滚动动画，做技术文章演示用 |

### 图片 / 媒体优化

| 项目 | 用途 |
|------|------|
| [sharp](https://github.com/lovell/sharp) | Node.js 图片处理（压缩/格式转换/缩略图），比 ImageMagick 快 4-5 倍 |
| [squoosh](https://github.com/GoogleChromeLabs/squoosh) | Google 出品，浏览器端图片压缩/格式对比 |
| [lazysizes](https://github.com/aFarkas/lazysizes) | 懒加载库，图片/iframe/背景图都支持，无需配置 |
| [vanilla-lazyload](https://github.com/verlok/vanilla-lazyload) | 纯 JS 懒加载，支持 LQIP（低质量占位图） |
| [blurhash](https://github.com/woltapp/blurhash) | 图片占位符算法，模糊 Hash 字符串 → 模糊占位图 |

### 整体 UI 脚手架

| 项目 | 用途 |
|------|------|
| [next.js](https://github.com/vercel/next.js) | 你的主力框架 |
| [shadcn/ui](https://github.com/shadcn-ui/ui) | 基于 Radix UI + Tailwind 的组件集，代码即源码 |
| [radix-ui](https://github.com/radix-ui/primitives) | 无样式 React 组件原语（Dialog/Popover/Tooltip），shadcn/ui 的底层 |
| [headlessui](https://github.com/tailwindlabs/headlessui) | Tailwind 团队的无样式组件库 |
| [nextui](https://github.com/nextui-org/nextui) | React UI 库，设计现代，适合管理后台 |

---

## 视觉设计（GitHub 开源项目）

### 配色 / 色板

| 项目 | 用途 |
|------|------|
| [open-color](https://github.com/yeun/open-color) | 开源色板，10 种主色 × 10 级灰度，设计系统级品质 |
| [tailwindcss/colors](https://github.com/tailwindlabs/tailwindcss) | Tailwind 内置 22 套色板源码，直接复用色值 |
| [radix-colors](https://github.com/radix-ui/colors) | 自动暗色模式适配的色板系统，亮/暗一套变量 |
| [color-namer](https://github.com/color-namer/color-namer) | 输入 hex → 返回最接近的颜色名称 |
| [chroma.js](https://github.com/gka/chroma.js) | JS 颜色处理库，调亮度/饱和度/混合/渐变计算 |
| [color2k](https://github.com/ricokahler/color2k) | 最轻的颜色处理库（<2KB），满足日常所需 |
| [culori](https://github.com/Evercoder/culori) | 全面的颜色库，支持 OKLCH/OKLab 等现代色彩空间 |

### 字体 / 排版工具

| 项目 | 用途 |
|------|------|
| [fontsource](https://github.com/fontsource/fontsource) | Google Fonts 的 npm 包版本，next/font 默认来源 |
| [modern-font-stacks](https://github.com/system-fonts/modern-font-stacks) | 按风格分类的系统字体栈，不加载外部字体也能好看 |
| [fontaine](https://github.com/danielroe/fontaine) | 字体回退度量校准，消除 FOUT 布局偏移 |
| [capsize](https://github.com/seek-oss/capsize) | 精确裁剪字体上下留白，让文字与设计稿像素对齐 |
| [typescale](https://typescale.com) | 排版比例预览（1.25/1.333/1.5），选好直接复制 CSS |
| [typewolf](https://www.typewolf.com) | 字体搭配灵感（不是开源工具，是参考资源） |

### 设计系统 / 设计令牌

| 项目 | 用途 |
|------|------|
| [style-dictionary](https://github.com/amzn/style-dictionary) | Amazon 出品，设计令牌（JSON）→ 多平台代码（CSS/JS/Android/iOS） |
| [cobalt](https://github.com/drwpow/cobalt) | 下一代设计令牌管理，支持 DTCG 规范，比 style-dictionary 更现代 |
| [theo](https://github.com/salesforce-ux/theo) | Salesforce 的设计令牌转换器 |
| [figma-tokens](https://github.com/six7/figma-tokens) | Figma 插件，设计令牌双向同步到 GitHub |
| [design-tokens-plugin](https://github.com/lukasoppermann/design-tokens) | Figma → GitHub → 代码,设计令牌工作流 |

### Figma 开源工具

| 项目 | 用途 |
|------|------|
| [figma-api](https://github.com/figma/figma-api-demo) | Figma REST API 官方示例 |
| [figma-export](https://github.com/marcomontalbano/figma-export) | 自动导出 Figma 设计稿中的图标/图片 |
| [figlet](https://github.com/figlet/figlet) | Figma → 代码生成器（实验性） |
| [figma-plugin-ds](https://github.com/thomas-lowry/figma-plugin-ds) | Figma 插件 UI 组件库，开发自己的 Figma 插件用 |

### 响应式 / 布局

| 项目 | 用途 |
|------|------|
| [browser-framework](https://github.com/murtuzaalisurti/browser-framework) | 用 CSS Grid 模拟浏览器窗口，做截图演示 |
| [css-grid-generator](https://github.com/sdras/cssgridgenerator) | Vue 写的 CSS Grid 可视化生成器 |
| [layoutit-grid](https://github.com/Leniolabs/layoutit-grid) | CSS Grid 拖拽生成器 |
| [flexboxfroggy](https://github.com/thomaspark/flexboxfroggy) | Flexbox 学习游戏（顺便掌握 flex 布局） |
| [griddy](https://github.com/drewconley/griddy) | CSS Grid 学习工具 |

### 可访问性（A11Y）

| 项目 | 用途 |
|------|------|
| [axe-core](https://github.com/dequelabs/axe-core) | 可访问性检测引擎，Google Chrome Lighthouse 底层也是它 |
| [pa11y](https://github.com/pa11y/pa11y) | 命令行 A11Y 检测，适合 CI 集成 |
| [color-contrast-checker](https://github.com/nickp/color-contrast-checker) | WCAG 对比度检查，配色时顺手验证 |
| [tota11y](https://github.com/Khan/tota11y) | Khan Academy 出品的可访问性可视化工具 |
| [eslint-plugin-jsx-a11y](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y) | JSX 可访问性 lint 规则，写组件时实时提示 |
| [react-aria](https://github.com/adobe/react-spectrum) | Adobe 出品，React 无障碍组件 Hook 集合 |

### CSS 框架 / 方法论

| 项目 | 用途 |
|------|------|
| [open-props](https://github.com/argyleink/open-props) | CSS 自定义属性集合（颜色/阴影/动画/缓动），设计师级预设 |
| [water.css](https://github.com/kognise/water.css) | 纯 classless CSS，引入即美化原生 HTML 元素 |
| [pico.css](https://github.com/picocss/pico) | 极简 classless CSS 框架，暗色模式内置 |
| [new.css](https://github.com/xz/new.css) | 仅 4.5KB，只写 HTML 就能好看 |
| [missing.css](https://github.com/bigskysoftware/missing.css) | htmx 团队出品，补足 HTML 默认样式的设计缺陷 |

### 设计工具集

| 项目 | 用途 |
|------|------|
| [penpot](https://github.com/penpot/penpot) | 开源 Figma 替代品，浏览器端设计工具 |
| [storybook](https://github.com/storybookjs/storybook) | UI 组件开发环境，隔离调试组件设计 |
| [chromatic](https://www.chromatic.com) | Storybook 团队做的 UI 视觉回归测试（和 GitHub PR 集成） |
| [percy](https://percy.io) | 视觉回归测试，截屏对比变更（已有 BrowserStack 收购） |

---

## GitHub Pages 相关

| 工具 | 用途 |
|------|------|
| [GitHub Pages](https://pages.github.com) | 免费静态托管，支持自定义域名 + HTTPS |
| [Jekyll](https://jekyllrb.com) | GitHub Pages 原生支持的静态生成器（Ruby） |
| [github/pages-gem](https://github.com/github/pages-gem) | GitHub Pages 本地调试环境 |
| [Custom GitHub Actions for Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site) | 不用 Jekyll，用自定义 Action 部署任意静态站点 |

> 你的场景用 COS 而非 GitHub Pages（国内访问更快），所以这部分了解即可。

---

## 安全与密钥管理

| 工具 | 用途 |
|------|------|
| [GitHub Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets) | 存储 COS_SECRET_ID / COS_SECRET_KEY 等敏感信息 |
| [GitHub Variables](https://docs.github.com/en/actions/learn-github-actions/variables) | 存储非敏感配置（COS_REGION 等） |
| [git-crypt](https://github.com/AGWA/git-crypt) | Git 透明加密，适合保护文章草稿（但个人博客基本不需要） |
| [step-security/harden-runner](https://github.com/step-security/harden-runner) | 加固 GitHub Actions Runner 安全性 |

---

## 你需要的 GitHub 最小组合

```
仓库     1 个公开仓库（blog）
分支     main（唯一分支，个人项目不需要 PR 流程）
Actions  1 个 deploy workflow（push → build → COS）
Apps     Giscus（Phase 1 评论）
Secrets  COS_SECRET_ID / COS_SECRET_KEY / COS_BUCKET / COS_REGION
CLI      gh（日常 `gh issue create` 记录文章想法）
```
