// 记录已答对的题目 ID，避免它们再次出现
const KEY = "cjt4_correct";

function loadSet(key: string): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(key);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch { return new Set(); }
}

function saveSet(key: string, set: Set<string>) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify([...set]));
  } catch {}
}

// 获取可用题目（排除已答对的）
export function getAvailable<T extends { id: string }>(
  items: T[],
  module: "grammar" | "reading" | "listening"
): T[] {
  const correctSet = loadSet(KEY);
  return items.filter(item => !correctSet.has(`${module}:${item.id}`));
}

// 标记为答对
export function markCorrect(id: string, module: "grammar" | "reading" | "listening") {
  const set = loadSet(KEY);
  set.add(`${module}:${id}`);
  saveSet(KEY, set);
}
