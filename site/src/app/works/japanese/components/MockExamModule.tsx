"use client";
import { useState, useEffect, useMemo } from "react";
import { motion } from "motion/react";
import { examConfig } from "../lib/data/exams";
import { grammarQuestions } from "../lib/data/grammar";
import { readings } from "../lib/data/readings";
import { useProgress } from "../hooks/useProgress";
import { addError } from "../lib/errorStore";

type AnswerMap = Record<string, number>; // questionId -> selected option index

export default function MockExamModule() {
  const [phase, setPhase] = useState<"ready" | "running" | "finished">("ready");
  const [timeLeft, setTimeLeft] = useState(examConfig.totalTime * 60);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [showParse, setShowParse] = useState(false);
  const { recordModuleAnswer } = useProgress();

  function genExam() {
    return {
      grammar: [...grammarQuestions].sort(() => Math.random() - 0.5).slice(0, 20),
      reading: [...readings].sort(() => Math.random() - 0.5).slice(0, 2),
    };
  }
  const [exam, setExam] = useState(() => genExam());

  // 倒计时
  useEffect(() => {
    if (phase !== "running") return;
    if (timeLeft <= 0) { setPhase("finished"); return; }
    const t = setInterval(() => setTimeLeft(p => {
      if (p <= 1) { setPhase("finished"); return 0; }
      return p - 1;
    }), 1000);
    return () => clearInterval(t);
  }, [phase]);

  // 计算分数
  const scoreResult = useMemo(() => {
    if (phase !== "finished" || !exam) return null;
    let grammarCorrect = 0;
    exam.grammar.forEach((q) => {
      if (answers[q.id] === q.answer) grammarCorrect++;
    });
    let readingCorrect = 0;
    exam.reading.forEach((r) => {
      r.questions.forEach((q, qi) => {
        if (answers[`${r.id}-q${qi}`] === q.answer) readingCorrect++;
      });
    });
    const grammarMax = exam.grammar.length;
    const readingMax = exam.reading.reduce((s, r) => s + r.questions.length, 0);
    const totalQuestions = grammarMax + readingMax;
    const totalCorrect = grammarCorrect + readingCorrect;
    return {
      total: Math.round(totalCorrect / totalQuestions * 100),
      grammar: { correct: grammarCorrect, total: grammarMax },
      reading: { correct: readingCorrect, total: readingMax },
    };
  }, [phase, answers, exam]);

  const startExam = () => {
    setExam(genExam());
    setAnswers({});
    setTimeLeft(examConfig.totalTime * 60);
    setPhase("running");
    setShowParse(false);
  };

  const submitExam = async () => {
    setPhase("finished");
    // 记录统计 + 错题入库
    for (const q of exam.grammar) {
      const userAns = answers[q.id];
      if (userAns !== undefined) {
        recordModuleAnswer("grammar", userAns === q.answer);
        if (userAns !== q.answer) {
          await addError({ questionId: q.id, module: "grammar", date: new Date().toISOString() });
        }
      }
    }
    for (const r of exam.reading) {
      for (let qi = 0; qi < r.questions.length; qi++) {
        const q = r.questions[qi];
        const userAns = answers[`${r.id}-q${qi}`];
        if (userAns !== undefined) {
          recordModuleAnswer("reading", userAns === q.answer);
          if (userAns !== q.answer) {
            await addError({ questionId: `${r.id}-q${qi}`, module: "reading", date: new Date().toISOString() });
          }
        }
      }
    }
  };

  const selectAnswer = (qid: string, oi: number) => {
    setAnswers(prev => ({ ...prev, [qid]: oi }));
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // ===== READY =====
  if (phase === "ready") {
    return (
      <div className="flex flex-col items-center gap-6 py-12 text-center">
        <div className="mb-2 h-14 w-14 rounded-2xl bg-[var(--accent-soft)] flex items-center justify-center">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--accent)]">
            <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
          </svg>
        </div>
        <div>
          <p className="text-xl font-bold text-[var(--text)]">真题模考</p>
          <p className="mt-2 text-sm text-[var(--text-muted)]">
            按四级题型比例组卷 · {examConfig.totalTime}分钟 · 语法{exam.grammar.length}题 + 阅读{exam.reading.length}篇
          </p>
        </div>
        <div className="text-left text-sm text-[var(--text-muted)] space-y-1">
          {examConfig.sections.map(s => (
            <p key={s.name}>· {s.name}: {s.questionCount}题 ({s.weight}分)</p>
          ))}
        </div>
        <button onClick={startExam}
          className="rounded-lg bg-[var(--accent)] px-8 py-3 text-base font-medium text-white transition-opacity hover:opacity-90">
          开始模考
        </button>
      </div>
    );
  }

  // ===== RUNNING =====
  if (phase === "running") {
    const answeredCount = Object.keys(answers).length;
    const totalQuestions = exam.grammar.length + exam.reading.reduce((s, r) => s + r.questions.length, 0);

    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <span className="text-sm text-[var(--text-muted)]">
            真题模考 · 已答 {answeredCount}/{totalQuestions}
          </span>
          <span className={`text-lg font-mono font-bold ${timeLeft < 300 ? "text-red-500" : "text-[var(--text)]"}`}>
            {formatTime(timeLeft)}
          </span>
        </div>

        {/* 语法题 */}
        <p className="text-sm font-medium text-[var(--text)]">一、文法（{exam.grammar.length}题）</p>
        <div className="space-y-4">
          {exam.grammar.map((q, qi) => (
            <div key={q.id} className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4">
              <p className="text-sm font-medium text-[var(--text)]">{qi + 1}. {q.question}</p>
              <div className="grid grid-cols-2 gap-2 mt-3">
                {q.options.map((opt, oi) => {
                  const selected = answers[q.id] === oi;
                  return (
                    <button key={oi} onClick={() => selectAnswer(q.id, oi)}
                      className={`rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                        selected
                          ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--text)]"
                          : "border-[var(--border)] text-[var(--text)] hover:border-[var(--accent)]"
                      }`}>
                      {String.fromCharCode(65 + oi)}. {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* 阅读题 */}
        <p className="text-sm font-medium text-[var(--text)]">二、読解（{exam.reading.length}篇）</p>
        {exam.reading.map((r, ri) => (
          <div key={r.id} className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-5">
            <h4 className="font-semibold text-[var(--text)] mb-2">{r.title}</h4>
            <p className="text-sm text-[var(--text)] leading-relaxed mb-4 whitespace-pre-wrap">{r.content}</p>
            {r.questions.map((q, qi) => (
              <div key={qi} className="mb-3 last:mb-0">
                <p className="text-sm font-medium text-[var(--text)] mb-2">{qi + 1}. {q.question}</p>
                <div className="grid grid-cols-2 gap-2">
                  {q.options.map((opt, oi) => {
                    const qid = `${r.id}-q${qi}`;
                    const selected = answers[qid] === oi;
                    return (
                      <button key={oi} onClick={() => selectAnswer(qid, oi)}
                        className={`rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                          selected
                            ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--text)]"
                            : "border-[var(--border)] text-[var(--text)] hover:border-[var(--accent)]"
                        }`}>
                        {String.fromCharCode(65 + oi)}. {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ))}

        <button onClick={submitExam}
          className="self-center rounded-lg bg-red-500 px-6 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90">
          交卷
        </button>
      </div>
    );
  }

  // ===== FINISHED =====
  const s = scoreResult;
  return (
    <div className="flex flex-col gap-6">
      {!showParse ? (
        <div className="flex flex-col items-center gap-6 py-12 text-center">
          <p className="text-3xl font-bold text-[var(--text)]">
            {s && s.total >= 60 ? "合格" : "加油"}
          </p>
          <p className="text-4xl font-bold text-[var(--accent)]">{s?.total ?? 0} 分</p>
          <p className="text-sm text-[var(--text-muted)]">
            {s && s.total >= 60 ? "恭喜，达到合格线！" : "差一点，继续加油！"}
          </p>
          {/* 分项统计 */}
          {s && (
            <div className="flex gap-4 text-sm">
              <span className="text-[var(--text-muted)]">
                文法 {s.grammar.correct}/{s.grammar.total}（{s.grammar.total > 0 ? Math.round(s.grammar.correct / s.grammar.total * 100) : 0}%）
              </span>
              <span className="text-[var(--text-muted)]">
                読解 {s.reading.correct}/{s.reading.total}（{s.reading.total > 0 ? Math.round(s.reading.correct / s.reading.total * 100) : 0}%）
              </span>
            </div>
          )}
          <div className="flex gap-3">
            <button onClick={startExam}
              className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm text-[var(--text)] hover:bg-[var(--bg-card)]">
              重新模考
            </button>
            <button onClick={() => setShowParse(true)}
              className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white">
              查看解析
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[var(--text)]">答卷解析</h3>
            <button onClick={() => setShowParse(false)}
              className="text-sm text-[var(--accent)]">返回成绩</button>
          </div>

          <p className="text-sm font-medium text-[var(--text)]">文法</p>
          {exam.grammar.map((q, qi) => {
            const userAns = answers[q.id];
            const isCorrect = userAns === q.answer;
            return (
              <details key={q.id} className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4">
                <summary className="flex cursor-pointer items-center justify-between gap-2">
                  <span className="text-sm font-medium text-[var(--text)]">{qi + 1}. {q.question}</span>
                  <span className={`text-xs font-medium ${isCorrect ? "text-green-600" : "text-red-500"}`}>
                    {isCorrect ? "正确" : userAns === undefined ? "未答" : "错误"}
                  </span>
                </summary>
                <div className="mt-3 text-sm border-t border-[var(--border)] pt-3">
                  <p className="text-[var(--text-muted)]">你的答案：{userAns !== undefined ? q.options[userAns] : "未作答"}</p>
                  <p className="text-green-600">正确答案：{q.options[q.answer]}</p>
                  <p className="mt-2 text-[var(--text-soft)]">{q.explanation}</p>
                </div>
              </details>
            );
          })}

          <p className="text-sm font-medium text-[var(--text)]">読解</p>
          {exam.reading.map((r) =>
            r.questions.map((q, qi) => {
              const qid = `${r.id}-q${qi}`;
              const userAns = answers[qid];
              const isCorrect = userAns === q.answer;
              return (
                <details key={qid} className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4">
                  <summary className="flex cursor-pointer items-center justify-between gap-2">
                    <span className="text-sm font-medium text-[var(--text)]">
                      {r.title} · Q{qi + 1}. {q.question}
                    </span>
                    <span className={`text-xs font-medium ${isCorrect ? "text-green-600" : "text-red-500"}`}>
                      {isCorrect ? "正确" : userAns === undefined ? "未答" : "错误"}
                    </span>
                  </summary>
                  <div className="mt-3 text-sm border-t border-[var(--border)] pt-3">
                    <p className="text-[var(--text-muted)]">你的答案：{userAns !== undefined ? q.options[userAns] : "未作答"}</p>
                    <p className="text-green-600">正确答案：{q.options[q.answer]}</p>
                  </div>
                </details>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
