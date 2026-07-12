"use client";
import { useState, useCallback } from "react";
import { motion } from "motion/react";
import { listeningScripts } from "../lib/data/listening";
import { speakJapanese } from "../lib/tts";
import { useProgress } from "../hooks/useProgress";

export default function ListeningModule() {
  const [index, setIndex] = useState(0);
  const [played, setPlayed] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [answers, setAnswers] = useState<Map<number, number>>(new Map());
  const [submitted, setSubmitted] = useState(false);
  const [showScript, setShowScript] = useState(false);
  const [rate, setRate] = useState(1.0);
  const { markActivity } = useProgress();

  const script = listeningScripts[index % listeningScripts.length];

  const play = useCallback(async () => {
    setPlaying(true);
    await speakJapanese(script.script, rate);
    setPlaying(false);
    setPlayed(true);
  }, [script, rate]);

  const handleSelect = (qi: number, oi: number) => {
    if (submitted) return;
    const next = new Map(answers);
    next.set(qi, oi);
    setAnswers(next);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    markActivity();
  };

  const nextScript = () => {
    setIndex(i => i + 1);
    setPlayed(false);
    setAnswers(new Map());
    setSubmitted(false);
    setShowScript(false);
  };

  const correctCount = script.questions.filter((q, i) => answers.get(i) === q.answer).length;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4 text-sm text-[var(--text-muted)]">
        <span>🎧 听力</span>
        <span className="rounded-full bg-[var(--border-light)] px-2 py-0.5 text-xs">{script.difficulty}</span>
      </div>

      {/* 播放器 */}
      <div className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4">
        <button onClick={play} disabled={playing}
          className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white disabled:opacity-50">
          {playing ? "🔊 播放中..." : played ? "🔁 重播" : "🔊 播放"}
        </button>
        <select value={rate} onChange={e => setRate(Number(e.target.value))}
          className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] px-2 py-1.5 text-xs text-[var(--text)]">
          <option value={0.75}>×0.75 慢速</option>
          <option value={1.0}>×1.0 标准</option>
        </select>
      </div>

      {/* 题目（播放后才显示） */}
      {played && (
        <>
          {script.questions.map((q, qi) => (
            <div key={qi} className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-5">
              <p className="text-sm font-medium text-[var(--text)] mb-3">{qi + 1}. {q.question}</p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {q.options.map((opt, oi) => {
                  let cls = "border-[var(--border)]";
                  if (submitted) {
                    if (oi === q.answer) cls = "border-green-400 bg-green-50 dark:border-green-700 dark:bg-green-950";
                    else if (answers.get(qi) === oi) cls = "border-red-400 bg-red-50";
                  } else if (answers.get(qi) === oi) cls = "border-[var(--accent)] bg-[var(--accent-soft)]";
                  return (
                    <button key={oi} onClick={() => handleSelect(qi, oi)} disabled={submitted}
                      className={`rounded-lg border px-3 py-2 text-left text-sm transition-colors ${cls}`}>
                      {String.fromCharCode(65 + oi)}. {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {!submitted ? (
            <button onClick={handleSubmit} disabled={answers.size < script.questions.length}
              className="self-center rounded-lg bg-[var(--accent)] px-6 py-2.5 text-sm font-medium text-white disabled:opacity-50">
              提交答案
            </button>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <p className="text-lg font-semibold">得分: {correctCount} / {script.questions.length}</p>
              <button onClick={() => setShowScript(!showScript)}
                className="text-sm text-[var(--accent)] underline">
                {showScript ? "隐藏原文" : "显示原文"}
              </button>
              {showScript && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                  className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4 w-full">
                  <p className="text-sm text-[var(--text)]">{script.script}</p>
                  <p className="mt-2 text-xs text-[var(--text-muted)]">{script.translation}</p>
                </motion.div>
              )}
              <button onClick={nextScript} className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white">下一段</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
