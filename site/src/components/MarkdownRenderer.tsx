import React from "react";

function parseInline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let remaining = text;

  while (remaining.length > 0) {
    // 图片 ![...](...) 必须在链接 [...] 之前匹配
    const imageMatch = remaining.match(/^(.*?)!\[(.+?)\]\((.+?)\)/);
    const boldMatch = remaining.match(/^(.*?)\*\*(.+?)\*\*/);
    const italicMatch = remaining.match(/^(.*?)(?<!\*)\*(?!\*)(.+?)\*(?!\*)/);
    const codeMatch = remaining.match(/^(.*?)`(.+?)`/);
    const linkMatch = remaining.match(/^(.*?)\[(.+?)\]\((.+?)\)/);

    const matches = [
      { match: imageMatch, type: "image" as const },
      { match: boldMatch, type: "bold" as const },
      { match: italicMatch, type: "italic" as const },
      { match: codeMatch, type: "code" as const },
      { match: linkMatch, type: "link" as const },
    ].filter((m) => m.match);

    if (matches.length === 0) {
      parts.push(remaining);
      break;
    }

    const earliest = matches.reduce((best, curr) => {
      const bestIdx = best.match?.[1]?.length ?? Infinity;
      const currIdx = curr.match?.[1]?.length ?? Infinity;
      return currIdx < bestIdx ? curr : best;
    });

    const m = earliest.match!;
    if (m[1]) parts.push(m[1]);

    switch (earliest.type) {
      case "image":
        parts.push(
          React.createElement("img", {
            key: parts.length,
            src: m[3],
            alt: m[2],
            loading: "lazy",
          })
        );
        remaining = m.input!.slice(m.index! + m[0].length);
        break;
      case "bold":
        parts.push(React.createElement("strong", { key: parts.length }, m[2]));
        remaining = m.input!.slice(m.index! + m[0].length);
        break;
      case "italic":
        parts.push(React.createElement("em", { key: parts.length }, m[2]));
        remaining = m.input!.slice(m.index! + m[0].length);
        break;
      case "code":
        parts.push(React.createElement("code", { key: parts.length }, m[2]));
        remaining = m.input!.slice(m.index! + m[0].length);
        break;
      case "link":
        parts.push(
          React.createElement("a", { href: m[3], key: parts.length }, m[2])
        );
        remaining = m.input!.slice(m.index! + m[0].length);
        break;
    }
  }

  return parts;
}

export function MarkdownRenderer({ content }: { content: string }) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // 空行
    if (!trimmed) {
      i++;
      continue;
    }

    // ===== 媒体元素 =====

    // Bilibili 嵌入: !bilibili[title](BVid)
    const biliMatch = trimmed.match(/^!bilibili\[(.*?)\]\((.*?)\)$/);
    if (biliMatch) {
      const bvid = biliMatch[2];
      elements.push(
        <figure key={elements.length} className="my-8">
          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
            <iframe
              src={`https://player.bilibili.com/player.html?bvid=${bvid}&page=1&high_quality=1`}
              scrolling="no"
              frameBorder="0"
              allowFullScreen
              className="absolute inset-0 h-full w-full rounded-lg"
            />
          </div>
          {biliMatch[1] && (
            <figcaption className="mt-2 text-center text-sm text-[var(--text-muted)]">
              {biliMatch[1]}
            </figcaption>
          )}
        </figure>
      );
      i++;
      continue;
    }

    // YouTube 嵌入: !youtube[title](videoId)
    const ytMatch = trimmed.match(/^!youtube\[(.*?)\]\((.*?)\)$/);
    if (ytMatch) {
      elements.push(
        <figure key={elements.length} className="my-8">
          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
            <iframe
              src={`https://www.youtube.com/embed/${ytMatch[2]}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 h-full w-full rounded-lg"
            />
          </div>
          {ytMatch[1] && (
            <figcaption className="mt-2 text-center text-sm text-[var(--text-muted)]">
              {ytMatch[1]}
            </figcaption>
          )}
        </figure>
      );
      i++;
      continue;
    }

    // 本地/远程视频: !video[poster标题](url)
    const videoMatch = trimmed.match(/^!video\[(.*?)\]\((.*?)\)$/);
    if (videoMatch) {
      elements.push(
        <figure key={elements.length} className="my-8">
          <video
            controls
            preload="metadata"
            className="w-full rounded-lg"
            poster={videoMatch[1] !== "无" ? undefined : undefined}
          >
            <source src={videoMatch[2]} />
            你的浏览器不支持视频播放。
          </video>
        </figure>
      );
      i++;
      continue;
    }

    // 独立图片: ![alt](url)  占整行时渲染为 figure
    const imageMatch = trimmed.match(/^!\[(.*?)\]\((.+?)\)$/);
    if (imageMatch) {
      elements.push(
        <figure key={elements.length} className="my-8">
          <img
            src={imageMatch[2]}
            alt={imageMatch[1]}
            loading="lazy"
            className="w-full rounded-lg"
          />
          {imageMatch[1] && (
            <figcaption className="mt-2 text-center text-sm text-[var(--text-muted)]">
              {imageMatch[1]}
            </figcaption>
          )}
        </figure>
      );
      i++;
      continue;
    }

    // ===== 原有元素 =====

    // 代码块：匹配开 fence 的 backtick 数量，防止嵌套 fence 提前关闭
    const fenceMatch = trimmed.match(/^(`{3,})/);
    if (fenceMatch) {
      const fenceLen = fenceMatch[1].length;
      const codeLines: string[] = [];
      i++;
      while (i < lines.length) {
        const endMatch = lines[i].trim().match(/^(`{3,})/);
        if (endMatch && endMatch[1].length >= fenceLen) {
          i++; // skip closing fence
          break;
        }
        codeLines.push(lines[i]);
        i++;
      }
      elements.push(
        <pre key={elements.length}>
          <code>{codeLines.join("\n")}</code>
        </pre>
      );
      continue;
    }

    // 标题
    if (trimmed.startsWith("### ")) {
      elements.push(
        <h3 key={elements.length}>{parseInline(trimmed.slice(4))}</h3>
      );
      i++;
      continue;
    }
    if (trimmed.startsWith("## ")) {
      elements.push(
        <h2 key={elements.length}>{parseInline(trimmed.slice(3))}</h2>
      );
      i++;
      continue;
    }
    if (trimmed.startsWith("# ")) {
      elements.push(
        <h1 key={elements.length}>{parseInline(trimmed.slice(2))}</h1>
      );
      i++;
      continue;
    }

    // 引用
    if (trimmed.startsWith("> ")) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("> ")) {
        quoteLines.push(lines[i].trim().slice(2));
        i++;
      }
      elements.push(
        <blockquote key={elements.length}>
          {quoteLines.map((ql, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <br />}
              {parseInline(ql)}
            </React.Fragment>
          ))}
        </blockquote>
      );
      continue;
    }

    // 无序列表
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      const listItems: string[] = [];
      while (
        i < lines.length &&
        (lines[i].trim().startsWith("- ") ||
          lines[i].trim().startsWith("* "))
      ) {
        listItems.push(lines[i].trim().slice(2));
        i++;
      }
      elements.push(
        <ul key={elements.length}>
          {listItems.map((item, idx) => (
            <li key={idx}>{parseInline(item)}</li>
          ))}
        </ul>
      );
      continue;
    }

    // 分割线
    if (trimmed === "---" || trimmed === "***") {
      elements.push(<hr key={elements.length} />);
      i++;
      continue;
    }

    // 表格
    if (trimmed.startsWith("|")) {
      const tableRows: string[][] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        tableRows.push(
          lines[i]
            .trim()
            .split("|")
            .map((c) => c.trim())
            .filter(Boolean)
        );
        i++;
      }
      if (tableRows.length >= 2) {
        const header = tableRows[0];
        const body = tableRows.slice(2); // skip separator row
        elements.push(
          <table key={elements.length}>
            <thead>
              <tr>
                {header.map((h, idx) => (
                  <th key={idx}>{parseInline(h)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {body.map((row, rIdx) => (
                <tr key={rIdx}>
                  {row.map((cell, cIdx) => (
                    <td key={cIdx}>{parseInline(cell)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        );
      }
      continue;
    }

    // 段落：收集连续的非特殊行
    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].trim().startsWith("#") &&
      !lines[i].trim().startsWith("!") &&
      !lines[i].trim().startsWith("```") &&
      !lines[i].trim().startsWith("> ") &&
      !lines[i].trim().startsWith("- ") &&
      !lines[i].trim().startsWith("* ") &&
      !lines[i].trim().startsWith("|")
    ) {
      paraLines.push(lines[i]);
      i++;
    }
    if (paraLines.length > 0) {
      elements.push(
        <p key={elements.length}>{parseInline(paraLines.join(" "))}</p>
      );
    }
  }

  return <>{elements}</>;
}
