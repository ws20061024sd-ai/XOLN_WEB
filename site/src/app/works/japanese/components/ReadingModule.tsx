"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { readings, type ReadingPassage } from "../lib/data/readings";
import { useProgress } from "../hooks/useProgress";
import { addErrors } from "../lib/errorStore";
import { getAvailable, markCorrect } from "../lib/correctStore";

export default function ReadingModule() {
  const [index, setIndex] = useState(0);
  const [showQuestions, setShowQuestions] = useState(false);
  const [answers, setAnswers] = useState<Map<number, number>>(new Map());
  const [submitted, setSubmitted] = useState(false);
  const { recordModuleAnswer } = useProgress();

  const available = useMemo(() =>
    getAvailable(readings, "reading").sort(() => Math.random() - 0.5),
  []);
  const passage: ReadingPassage | undefined = available.length > 0 ? available[index % available.length] : undefined;

  const handleSelect = (qi: number, oi: number) => {
    if (submitted) return;
    const next = new Map(answers);
    next.set(qi, oi);
    setAnswers(next);
  };

  const handleSubmit = async () => {
    if (!passage) return;
    setSubmitted(true);
    const errors: { questionId: string; module: "reading"; date: string }[] = [];
    let allCorrect = true;
    for (let qi = 0; qi < passage.questions.length; qi++) {
      const correct = answers.get(qi) === passage.questions[qi].answer;
      recordModuleAnswer("reading", correct);
      if (!correct) {
        allCorrect = false;
        errors.push({
          questionId: `${passage.id}-q${qi}`,
          module: "reading" as const,
          date: new Date().toISOString(),
        });
      }
    }
    if (allCorrect) markCorrect(passage.id, "reading");
    if (errors.length > 0) await addErrors(errors);
  };

  const nextPassage = () => {
    setIndex(i => i + 1);
    setShowQuestions(false);
    setAnswers(new Map());
    setSubmitted(false);
  };

  if (!passage) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-3 h-12 w-12 rounded-full bg-[var(--accent-soft)] flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[var(--accent)]">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </div>
        <p className="text-lg font-medium text-[var(--text)]">阅读全部完成</p>
        <p className="mt-1 text-sm text-[var(--text-muted)]">所有文章都已答对</p>
      </div>
    );
  }

  const correctCount = passage.questions.filter((q, i) => answers.get(i) === q.answer).length;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4 text-sm text-[var(--text-muted)]">
        <span className="font-medium text-[var(--text)]">阅读</span>
        <span className="rounded-full bg-[var(--border-light)] px-2 py-0.5 text-xs">{passage.difficulty}</span>
        <span>剩余 {available.length} 篇</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={passage.id + (showQuestions ? "q" : "p")} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-5">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-6">
            <h3 className="font-semibold text-[var(--text)] mb-3">{passage.title}</h3>
            <p className="text-[var(--text)] leading-relaxed whitespace-pre-wrap">{passage.content}</p>
          </div>

          {!showQuestions ? (
            <button onClick={() => setShowQuestions(true)}
              className="self-center rounded-lg bg-[var(--accent)] px-6 py-2.5 text-sm font-medium text-white">
              开始答题
            </button>
          ) : (
            <>
              {passage.questions.map((q, qi) => (
                <div key={qi} className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-5">
                  <p className="text-sm font-medium text-[var(--text)] mb-3">{qi + 1}. {q.question}</p>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {q.options.map((opt, oi) => {
                      let cls = "border-[var(--border)]";
                      if (submitted) {
                        if (oi === q.answer) cls = "border-green-400 bg-green-50 dark:border-green-700 dark:bg-green-950";
                        else if (answers.get(qi) === oi && oi !== q.answer) cls = "border-red-400 bg-red-50";
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
                <button onClick={handleSubmit} disabled={answers.size < passage.questions.length}
                  className="self-center rounded-lg bg-[var(--accent)] px-6 py-2.5 text-sm font-medium text-white disabled:opacity-50">
                  提交答案
                </button>
              ) : (
                <div className="text-center">
                  <p className="text-lg font-semibold text-[var(--text)]">得分: {correctCount} / {passage.questions.length}</p>
                  <button onClick={nextPassage} className="mt-3 rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white">下一篇</button>
                </div>
              )}
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
