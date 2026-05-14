---
title: "Markdown 语法测试"
date: "2025-01-15"
description: "对照源码学习 Markdown 语法的测试页面。"
tags: ["测试", "Markdown"]
order: 1
---

> 打开 `site/content/misc/md-test.md` 对比源码，边看边学。
> 左边 VS Code 里的 Markdown 源码 → 右边浏览器里的渲染效果。

---

## 标题测试

# 一级标题（最大）
## 二级标题
### 三级标题

---

## 段落和换行

这是第一个段落。多个连续的行会自动合并成一段。
即使你手动换行，只要中间没有空行。

上面和下面是两个段落，因为中间空了一行。

---

## 文字样式

这是**加粗文字**，这是*斜体文字*。

也可以 __加粗__ 和 _斜体_。

也可以连用：***又粗又斜的文字***。

这是`行内代码`的展示。

---

## 超链接

### 站外链接

[点击访问 GitHub](https://github.com)

### 站内链接

[回到首页](/)

[查看关于页](/about)

[查看作品列表](/works)

---

## 列表

### 无序列表

- 这是第一项
- 这是第二项
- 这是第三项
  - 嵌套子项（前面空两格）
  - 嵌套子项二

### 有序列表

1. 第一步
2. 第二步
3. 第三步

---

## 引用

> 这是一段引用文字。
> 
> 引用里可以有**加粗**和*斜体*。
> 
> 引用里也可以有链接：[回到首页](/)

---

## 分割线

上面是一段文字。

---

上面三个 `-` 就是分割线。

---

## 代码

### 行内代码

在段落中可以使用 `const greeting = "你好世界"` 这样的行内代码。

### 代码块

```javascript
function greet(name) {
  const message = `Hello, ${name}!`;
  console.log(message);
  return message;
}

greet("世界");
```

```python
def calculate(x, y):
    result = x + y
    return result
```

---

## 表格

| 姓名 | 年龄 | 城市 |
|------|------|------|
| 张三 | 25 | 北京 |
| 李四 | 30 | 上海 |
| 王五 | 28 | 深圳 |

---

## 图片

### 远程图片

![Unsplash 示例山脉](https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80)

### 本地图片

![网站占位图](/images/placeholder.svg)

---

## 视频

### Bilibili 视频

!bilibili[B站测试视频](BV1GJ411x7h7)

### YouTube 视频

!youtube[YouTube 测试视频](dQw4w9WgXcQ)

---

## 测试完毕

以上就是 Markdown 所有常用语法的实际渲染效果。对照这个文件（`content/misc/md-test.md`）和浏览器中的页面学习 Markdown 写法。
