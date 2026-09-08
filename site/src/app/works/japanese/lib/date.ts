// 本地时区日期工具
//
// 注意：`new Date().toISOString()` 返回的是 UTC 时间。在东八区（UTC+8），
// 凌晨 0:00–7:59 的 toISOString 日期仍是"昨天"，会导致每日日志/打卡/错题日期错位一天。
// 所有按天记录的日期（dailyLog key、错题 date、今日目标）必须用本文件函数。
//
// Supabase 时间戳列（next_review / created_at）存的是时刻，不在此列，继续用 toISOString。

export function formatLocalDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function todayLocalDate(): string {
  return formatLocalDate(new Date());
}
