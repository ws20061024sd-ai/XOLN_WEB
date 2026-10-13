"use client";
import { useState, useEffect, useRef } from "react";
import { translateTasks, type TranslateTask } from "../lib/data/translate";
import { useProgress } from "../hooks/useProgress";
import { storage, supabase } from "../lib/supabase";

const LABELS = { ja2zh: "日译汉", zh2ja: "日语输出", writing: "作文" };
const API = `${(process.env.NEXT_PUBLIC_API_URL ?? "https://api.xolnxoln.cn").replace(/\/$/, "")}/api/study`;
interface Draft { text: string; feedback?: string; requestId?: string; }
function DraftEditor({ task, index, onNext, onType }: { task: TranslateTask; index: number; onNext: () => void; onType: (type: TranslateTask["type"]) => void }) {
  const type = task.type;
  const [text,setText]=useState(()=>storage.get<Draft>(`draft_${task.id}`)?.text ?? "");
  const [showRef,setShowRef]=useState(false);
  const [feedback,setFeedback]=useState(()=>storage.get<Draft>(`draft_${task.id}`)?.feedback ?? "");
  const [busy,setBusy]=useState(false);
  const [notice,setNotice]=useState("");
  const [email,setEmail]=useState("");
  const [login,setLogin]=useState(false);
  const [ready,setReady]=useState<boolean | null>(null);
  const mounted=useRef(true);
  const savedRef=useRef(false);
  const controller=useRef<AbortController | null>(null);
  const {recordModuleAnswer}=useProgress();
  useEffect(()=>{
    let cancelled=false;
    fetch(`${API}/status`).then(r=>r.ok?r.json():null).then(data=>{if(!cancelled)setReady(Boolean(data?.configured));}).catch(()=>{if(!cancelled)setReady(false);});
    return ()=>{cancelled=true;};
  },[]);
  useEffect(()=>{
    mounted.current = true;
    return ()=>{ mounted.current = false; controller.current?.abort(); };
  },[]);
  const update=(value:string)=>{setText(value);setFeedback("");storage.set(`draft_${task.id}`,{text:value});};
  const submit=()=>{
    if(!text.trim())return;
    setShowRef(true);
    if(!savedRef.current){recordModuleAnswer("translate",true);savedRef.current=true;}
  };
  const grade=async()=>{
    if(!text.trim()||busy)return;
    if(!ready){setNotice("AI服务尚未配置或暂时不可用。草稿已经保存在本机，可先查看参考内容。");return;}
    const {data}=supabase?await supabase.auth.getSession():{data:{session:null}};
    if(!data.session){setLogin(true);setNotice("请用个人账号登录后批改，避免其他访客使用你的AI额度。");return;}
    const id=task.id;setBusy(true);setNotice("");controller.current?.abort();const abort=new AbortController();controller.current=abort;
    const saved=storage.get<Draft>(`draft_${id}`);
    const requestId=saved?.text===text && saved.requestId?saved.requestId:crypto.randomUUID();
    storage.set(`draft_${id}`,{text,requestId});
    const timeout=setTimeout(()=>abort.abort(),55000);
    try{
      const response=await fetch(`${API}/feedback`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${data.session.access_token}`},body:JSON.stringify({taskId:id,draft:text,requestId}),signal:abort.signal});
      const result=await response.json();
      if(!response.ok)throw new Error(typeof result.error==="string"?result.error:"批改暂时失败，草稿已保留。");
      if(typeof result.feedback!=="string")throw new Error("批改结果格式异常，草稿已保留。");
      storage.set(`draft_${id}`,{text,feedback:result.feedback,requestId});
      if(mounted.current){setFeedback(result.feedback);setShowRef(true);}
    }catch(error){if(mounted.current)setNotice(error instanceof Error && error.name!=="AbortError"?error.message:"请求超时或已取消，草稿仍在本机。下次查询会使用同一个请求编号。");}
    finally{clearTimeout(timeout);if(mounted.current)setBusy(false);}
  };
  const signIn=async()=>{
    if(!supabase || !email.trim()){setNotice("请填写邮箱；个人登录还需要配置Supabase。");return;}
    const {error}=await supabase.auth.signInWithOtp({email:email.trim(),options:{emailRedirectTo:window.location.href}});
    setNotice(error?"登录邮件未能发送，请检查邮箱或个人登录配置。":"登录链接已发到邮箱。登录后回到这里，草稿仍会保留。");
  };
  const characters=Array.from(text.replace(/\s/g,"")).length;
  return <div className="flex flex-col gap-5">
    <div><p className="text-xs tracking-widest text-[var(--accent)]">WRITE · REVISE · LEARN</p><h2 className="mt-2 font-serif text-2xl">把想表达的，写清楚。</h2><p className="mt-2 text-sm text-[var(--text-muted)]">先写自己的答案，再对照与修改。草稿自动保存在这台设备。</p></div>
    <div className="flex flex-wrap gap-2">{(Object.keys(LABELS) as TranslateTask["type"][]).map(t=><button key={t} disabled={busy} onClick={()=>onType(t)} className={`rounded-full border px-4 py-2 text-sm ${type===t?"border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]":"border-[var(--border)]"}`}>{LABELS[t]}</button>)}</div>
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6"><p className="mb-3 text-xs text-[var(--text-muted)]">练习 {index % translateTasks.filter(t=>t.type===type).length+1} · {type==="writing"?"200—250字 / 正式写作20分钟":type==="zh2ja"?"语法输出专项，不计入正式翻译板块":"理解原意，允许不同自然译法"}</p><p className="text-base leading-8">{task.prompt}</p>{task.hint&&<details className="mt-4 text-xs text-[var(--text-muted)]"><summary className="cursor-pointer">需要一个提示？</summary><p className="mt-2">{task.hint}</p></details>}</div>
    <textarea aria-label="我的译文或作文" value={text} onChange={e=>update(e.target.value)} disabled={busy} maxLength={4000} rows={type==="writing"?9:5} placeholder={type==="writing"?"在这里写自己的日语作文…":"先独立写出你的译文…"} className="w-full resize-y rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-5 text-sm leading-7 focus:border-[var(--accent)] focus:outline-none" />
    <div className="flex flex-wrap items-center justify-between gap-3"><p className={`text-xs ${type==="writing"&&(characters<200||characters>250)?"text-orange-500":"text-[var(--text-muted)]"}`}>{characters} 字{type==="writing"?" · 建议200—250字（界面计数不替代答题纸格数）":" · 已自动保存"}</p><div className="flex gap-2"><button disabled={!text.trim()||busy} onClick={submit} className="rounded-lg border border-[var(--border)] px-4 py-2.5 text-sm disabled:opacity-40">对照参考</button><button disabled={!text.trim()||busy} onClick={grade} className="rounded-lg bg-[var(--accent)] px-4 py-2.5 text-sm text-white disabled:opacity-40">{busy?"正在认真批改…":"AI批改"}</button></div></div>
    {ready===false&&<p className="text-xs text-[var(--text-muted)]">DeepSeek接入已准备，服务端配置完成后可批改；当前仍可保存、对照与修改。</p>}
    {notice&&<p role="status" className="rounded-xl bg-[var(--accent-soft)] p-4 text-xs leading-6">{notice}</p>}
    {login&&<div className="flex flex-wrap gap-2"><input aria-label="登录邮箱" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="你的登录邮箱" className="min-w-0 flex-1 rounded-lg border border-[var(--border)] bg-[var(--bg-card)] px-3 py-2 text-sm" /><button onClick={signIn} className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm">发送登录链接</button></div>}
    {feedback&&<section className="rounded-2xl border border-[var(--accent)] p-5"><h3 className="text-sm font-semibold text-[var(--accent)]">AI修改建议 · 供学习参考</h3><p className="mt-3 whitespace-pre-wrap text-sm leading-7">{feedback}</p><p className="mt-4 text-xs text-[var(--text-muted)]">逐条修改自己的稿件；修改后再批改，不用整篇替换成范文。</p></section>}
    {showRef&&<section className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-5"><h3 className="text-xs font-medium text-[var(--accent)]">参考{type==="writing"?"范文":"译文"} · 表达方式不唯一</h3><p className="mt-3 text-sm leading-8">{task.reference}</p><p className="mt-4 text-xs leading-6 text-[var(--text-muted)]">自检：意思是否一致？助词与动词形式是否正确？语句是否衔接？{type==="writing"?"是否切题并达到字数要求？":""}</p></section>}
    <button disabled={busy} onClick={onNext} className="self-end rounded-lg border border-[var(--border)] px-4 py-2 text-sm">下一项练习 →</button>
  </div>;
}

export default function TranslateModule() {
  const [index, setIndex] = useState(0);
  const [type, setType] = useState<TranslateTask["type"]>("ja2zh");
  const filtered = translateTasks.filter(task => task.type === type);
  const task = filtered[index % filtered.length];
  return <DraftEditor key={task.id} task={task} index={index} onNext={() => setIndex(i => i + 1)} onType={value => { setType(value); setIndex(0); }} />;
}
