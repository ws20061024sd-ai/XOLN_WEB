"use client";
import { useState } from "react";
import { useProgress } from "../hooks/useProgress";
import { reviewOverview } from "../lib/reviewStore";

const TASKS = [
  { tab: "grammar", title: "把语法学扎实", description: "先做题，再看解析；不确定也如实记录。", minutes: 25, goal: 5, field: "grammar" as const, tag: "优先弱项", number: "01" },
  { tab: "flashcard", title: "回忆词义，也练读音", description: "先复习到期词，再学少量新词。", minutes: 10, goal: 10, field: "cards" as const, tag: "间隔复习", number: "02" },
  { tab: "listening", title: "戴上耳机，听一小段", description: "盲听 → 作答 → 对照原文 → 再听一遍。", minutes: 5, goal: 2, field: "listening" as const, tag: "需要耳机", number: "03" },
  { tab: "reading", title: "读懂一篇，找出依据", description: "读完再答题，留意指代和转折。", minutes: 15, goal: 2, field: "reading" as const, tag: "理解与输出", number: "04" },
];
export default function TodayModule({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const { getTodayCounts, moduleStats } = useProgress();
  const counts = getTodayCounts();
  const [audio, setAudio] = useState(true);
  const [review] = useState(reviewOverview);
  const tasks = TASKS.map(t => !audio && t.tab === "listening" ? { ...t, tab: "translate", title: "写一句自己的日语", description: "不方便听音时，改练翻译；听力留待耳机时间。", field: "translate" as const, tag: "静音可做", goal: 1 } : t);
  const completed = tasks.filter(t => counts[t.field] >= t.goal).length;
  const exportBackup = () => {
    const data: Record<string, unknown> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("cjt4_")) data[key] = localStorage.getItem(key);
    }
    const url = URL.createObjectURL(new Blob([JSON.stringify({ version: 2, exportedAt: new Date().toISOString(), data }, null, 2)], { type: "application/json" }));
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = "学习舱进度备份.json"; anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const grammarRate = moduleStats.grammar.total ? Math.round(moduleStats.grammar.correct / moduleStats.grammar.total * 100) : null;
  return (
    <div className="flex flex-col gap-7">
      <section className="overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--bg-card)]">
        <div className="grid gap-8 p-7 sm:p-9 md:grid-cols-[1fr_230px]">
          <div>
            <p className="text-xs font-medium tracking-[0.18em] text-[var(--accent)]">今日学习 · 约 60 分钟</p>
            <h2 className="mt-4 font-serif text-3xl leading-tight text-[var(--text)] sm:text-4xl">每天一小步，<br />把会的变成记得住的。</h2>
            <p className="mt-4 max-w-lg text-sm leading-7 text-[var(--text-muted)]">先补语法，再用几分钟练耳朵。任务可以自由调整，完成后再验证是否真正掌握。</p>
            <button onClick={() => onNavigate("grammar")} className="mt-6 rounded-xl bg-[var(--accent)] px-6 py-3 text-sm font-medium text-white">开始今天的语法练习 <span className="ml-3">→</span></button>
          </div>
          <div className="flex flex-col justify-center rounded-2xl bg-[var(--accent-soft)] p-6">
            <p className="text-xs text-[var(--text-muted)]">2027 年 6 月 · CJT4</p>
            <p className="mt-5 font-serif text-4xl text-[var(--accent)]">{completed}<span className="ml-1 text-lg text-[var(--text-muted)]">/ 4</span></p>
            <p className="mt-1 text-sm text-[var(--text)]">今日练习目标</p>
            <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-[var(--border)]"><div className="h-full rounded-full bg-[var(--accent)] transition-all" style={{ width: `${completed * 25}%` }} /></div>
            <p className="mt-4 text-xs leading-5 text-[var(--text-muted)]">完成量是练习记录，<br />不等同于考试准备程度。</p>
          </div>
        </div>
      </section>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h3 className="font-serif text-xl font-semibold">你的今日路线</h3><p className="mt-1 text-xs text-[var(--text-muted)]">四项练习约 55 分钟，余下 5 分钟回顾错因。</p></div>
        <label className="flex cursor-pointer items-center gap-2 rounded-full border border-[var(--border)] px-4 py-2 text-xs"><input type="checkbox" checked={audio} onChange={e => setAudio(e.target.checked)} className="accent-[var(--accent)]" />今天可以戴耳机</label>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {tasks.map(t => <button key={t.number} onClick={() => onNavigate(t.tab)} className="group rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-5 text-left transition hover:border-[var(--accent)] hover:shadow-sm">
          <div className="flex items-center justify-between"><span className="font-mono text-xs text-[var(--text-soft)]">{t.number} / {t.tag}</span><span className="text-xs text-[var(--text-muted)]">{t.minutes} 分钟</span></div>
          <h4 className="mt-4 text-lg font-medium">{t.title}</h4><p className="mt-2 text-xs leading-6 text-[var(--text-muted)]">{t.description}</p>
          <div className="mt-5 flex items-center justify-between text-xs"><span className={counts[t.field] >= t.goal ? "text-green-600" : "text-[var(--text-muted)]"}>{Math.min(counts[t.field], t.goal)} / {t.goal} 题{counts[t.field] >= t.goal ? " · 已完成" : ""}</span><span className="text-[var(--accent)]">去练习 →</span></div>
        </button>)}
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {[{label:"到期专项复习", value:`${review.due} 项`,note:"已经做过、今天需要再验证的题目"},{label:"语法练习正确率",value:grammarRate === null ? "待建立" : `${grammarRate}%`,note:"包括重复练习，不是四级预测分"},{label:"延迟复测记录",value:`${review.verified} 项`,note:"至少两次独立答对；继续用新题验证"}].map(item=><div key={item.label} className="rounded-xl border border-[var(--border)] p-4"><p className="text-xs text-[var(--text-muted)]">{item.label}</p><p className="mt-2 text-xl font-semibold">{item.value}</p><p className="mt-2 text-[11px] leading-5 text-[var(--text-soft)]">{item.note}</p></div>)}
      </div>
      <div className="flex justify-end"><button onClick={exportBackup} className="text-xs text-[var(--text-muted)] underline underline-offset-4">导出本机学习记录备份</button></div>
      <button onClick={() => onNavigate("exam")} className="flex items-center justify-between rounded-xl border border-[var(--border)] px-5 py-4 text-left"><div><p className="text-sm font-medium">先做一次真实水平诊断</p><p className="mt-1 text-xs text-[var(--text-muted)]">官方样卷、配套听力、各板块记录与独立测评说明</p></div><span className="text-[var(--accent)]">→</span></button>
    </div>
  );
}
