import React from "react";

function parseInline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let remaining = text;

  // 处理行内元素：**加粗**、*斜体*、`代码`、[链接](url)
  while (remaining.length > 0) {
    const boldMatch = remaining.match(/^(.*?)\*\*(.+?)\*\*/);
    const italicMatch = remaining.match(/^(.*?)\*(.+?)\*/);
    const codeMatch = remaining.match(/^(.*?)`(.+?)`/);
    const linkMatch = remaining.match(/^(.*?)\[(.+?)\]\((.+?)\)/);

    const matches = [
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
          React.createElement(
            "a",
            { href: m[3], key: parts.length },
            m[2]
          )
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

    // 代码块
    if (trimmed.startsWith("```")) {
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip end ```
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
