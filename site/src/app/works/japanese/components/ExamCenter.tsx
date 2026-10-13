"use client";
import { useState } from "react";
import { storage } from "../lib/supabase";
import { todayLocalDate } from "../lib/date";
import MockExamModule from "./MockExamModule";

const SECTIONS = [{key:"listening",name:"听力",max:15,time:15},{key:"vocab",name:"文字与词语",max:15,time:10},{key:"grammar",name:"语法",max:20,time:10},{key:"reading",name:"阅读",max:30,time:50},{key:"translation",name:"日译汉",max:10,time:15},{key:"writing",name:"作文",max:10,time:20}];
interface ExamRecord { id:string; date:string; name:string; scores:Record<string,number>; mode:string; subjective:string; }
const PDF="https://www.neea.edu.cn/res/Home/2304/c9be2343532610fa7c6700e7b1074ae9.pdf";
const AUDIO="https://cet.neea.edu.cn/res/Home/2304/321e977cf3a5f751fe51c1092d3bc02f.mp3";
export default function ExamCenter() {
  const [practice,setPractice]=useState(false);
  const [records,setRecords]=useState<ExamRecord[]>(()=>storage.get<ExamRecord[]>("exams_v2") ?? []);
  const [scores,setScores]=useState<Record<string,string>>({});
  const [name,setName]=useState("官方新版样卷");
  const [mode,setMode]=useState("分段诊断");
  const [subjective,setSubjective]=useState("尚未批改");
  const [notice,setNotice]=useState("");
  const [error,setError]=useState("");
  if(practice) return <div><button onClick={()=>setPractice(false)} className="mb-5 text-sm text-[var(--accent)]">← 返回测评中心</button><MockExamModule /></div>;
  const save=()=>{
    const required=subjective==="尚未批改"?SECTIONS.slice(0,4):SECTIONS;
    if(!name.trim() || required.some(s=>scores[s.key]===undefined || scores[s.key].trim()==="" || !Number.isFinite(Number(scores[s.key])) || Number(scores[s.key])<0 || Number(scores[s.key])>s.max)) {setError("请填写试卷名称和各板块有效得分；未批改主观题可以留空。");return;}
    const values=Object.fromEntries(required.map(s=>[s.key,Number(scores[s.key])]));
    const record={id:crypto.randomUUID(),date:todayLocalDate(),name:name.trim().slice(0,100),scores:values,mode,subjective};
    const next=[record,...records].slice(0,100);storage.set("exams_v2",next);setRecords(next);setError("");setNotice("诊断记录已保存到本机。下一步按丢分最多的板块补练。");
  };
  return <div className="flex flex-col gap-6">
    <div><p className="text-xs tracking-widest text-[var(--accent)]">ASSESSMENT</p><h2 className="mt-2 font-serif text-3xl">从一次真实诊断开始</h2><p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">完整卷 88 题、120 分钟。首次独立作答与重复练习分开记录，主观题未批改时只记录客观分。</p></div>
    <div className="grid gap-4 md:grid-cols-2">
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6"><p className="text-xs text-[var(--accent)]">官方资源 · 2024 年起适用</p><h3 className="mt-3 text-lg font-semibold">新版样卷与标准答案</h3><p className="mt-3 text-xs leading-6 text-[var(--text-muted)]">PDF 实际第 142—161 页是四级样卷，162—168 页是听力稿，169—171 页是答案。先做题，再看答案。</p><a href={PDF} target="_blank" rel="noreferrer" className="mt-5 inline-block rounded-lg bg-[var(--accent)] px-4 py-2.5 text-sm text-white">打开官方试卷 ↗</a></section>
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6"><p className="text-xs text-[var(--accent)]">配套音频 · 约 15 分 28 秒</p><h3 className="mt-3 text-lg font-semibold">用官方听力建立基线</h3><p className="mt-3 text-xs leading-6 text-[var(--text-muted)]">戴耳机，在正常浏览器打开。正式诊断只听一遍；分段练习可重听，但不能算完整模考成绩。</p><a href={AUDIO} target="_blank" rel="noreferrer" className="mt-5 inline-block rounded-lg border border-[var(--border)] px-4 py-2.5 text-sm">打开官方听力 ↗</a></section>
    </div>
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">{SECTIONS.map(s=><div key={s.key} className="rounded-xl border border-[var(--border)] p-3 text-center"><p className="text-xs text-[var(--text-muted)]">{s.name}</p><p className="mt-2 text-lg font-semibold">{s.max}<span className="text-xs font-normal"> 分</span></p><p className="mt-1 text-[10px] text-[var(--text-soft)]">{s.time} 分钟</p></div>)}</div>
    <section className="rounded-2xl border border-[var(--border)] p-6"><h3 className="text-lg font-semibold">记录这次诊断</h3><div className="mt-4 grid gap-3 sm:grid-cols-3"><label className="text-xs">试卷名称<input aria-label="试卷名称" value={name} onChange={e=>{setName(e.target.value);setNotice("");}} className="mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-2.5" /></label><label className="text-xs">作答方式<select aria-label="作答方式" value={mode} onChange={e=>{setMode(e.target.value);setNotice("");}} className="mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-2.5">{["分段诊断","首次完整限时","已见卷复测"].map(v=><option key={v}>{v}</option>)}</select></label><label className="text-xs">主观题评分<select aria-label="主观题评分" value={subjective} onChange={e=>{setSubjective(e.target.value);setNotice("");}} className="mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-2.5">{["尚未批改","人工评分","AI估分"].map(v=><option key={v}>{v}</option>)}</select></label></div><div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-6">{SECTIONS.map((s,i)=><label key={s.key} className="text-xs">{s.name} / {s.max}<input aria-label={`${s.name}得分`} type="number" step="0.5" min={0} max={s.max} disabled={i>=4 && subjective==="尚未批改"} value={scores[s.key] ?? ""} onChange={e=>{setScores({...scores,[s.key]:e.target.value});setNotice("");}} className="mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-2.5 disabled:opacity-40" /></label>)}</div><button onClick={save} className="mt-5 rounded-lg bg-[var(--accent)] px-5 py-2.5 text-sm text-white">保存诊断记录</button>{error&&<p role="alert" className="mt-3 text-xs text-red-500">{error}</p>}{notice&&<p role="status" className="mt-3 text-xs text-green-600">{notice}</p>}</section>
    {records.length>0&&<section><h3 className="mb-3 text-lg font-semibold">诊断历史</h3><div className="flex flex-col gap-2">{records.map(r=><div key={r.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--border)] p-4"><div><p className="text-sm font-medium">{r.name}</p><p className="mt-1 text-xs text-[var(--text-muted)]">{r.date} · {r.mode} · {r.subjective}</p></div><p className="font-mono text-lg">{Object.values(r.scores).reduce((a,b)=>a+b,0)}<span className="text-xs text-[var(--text-muted)]"> / {r.subjective==="尚未批改"?"80 客观分":"100"}{r.subjective==="AI估分"?"（含估分）":""}</span></p></div>)}</div></section>}
    <button onClick={()=>setPractice(true)} className="rounded-xl border border-[var(--border)] p-4 text-left"><p className="text-sm font-medium">语法 + 阅读综合练习 →</p><p className="mt-2 text-xs text-[var(--text-muted)]">随机组卷帮助查漏补缺，成绩只代表这次专项练习。</p></button>
  </div>;
}
