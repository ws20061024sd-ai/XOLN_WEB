---
title: "视觉设计实现"
date: "2026-05-14"
description: "暖白配色、衬线标题、几何装饰、毛玻璃卡片、滚动动画。"
tags: ["设计", "动画"]
order: 10
---

## 做了什么

- 暖白配色方案：背景 `#fafaf8`，蓝色强调 `#2563eb`
- 字体系统：标题衬线（Noto Serif SC），正文无衬线（Inter / Noto Sans SC），代码等宽（JetBrains Mono）
- Hero 区域几何装饰：模糊色块 + 网格线背景
- 首页栏目卡片改为毛玻璃风格（`backdrop-filter: blur`）
- 全站噪点纹理底纹
- ScrollReveal 组件：滚动到视口时元素淡入登场
- PageTransition 组件：栏目切换时淡入过渡
- 卡片悬浮微交互：上移 + 阴影加深 + 图标弹跳
- 按钮波纹点击效果
- 页脚随机中外名言（14 条）
- 装饰性分割线（渐变横线 + 居中标签）
- 图片支持 `![描述](地址)` + 懒加载
- 视频支持 `!video`、`!bilibili`、`!youtube`
- 修复 ScrollReveal 默认透明度导致内容不可见的 bug
- 新增 MD 语法测试页（/misc/md-test）
