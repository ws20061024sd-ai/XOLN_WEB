let finishCurrent: ((completed: boolean) => void) | null = null;

export function stopJapanese() {
  finishCurrent?.(false);
  if (typeof window !== "undefined") window.speechSynthesis?.cancel();
}

export function speakJapanese(text: string, rate = 1): Promise<boolean> {
  stopJapanese();
  return new Promise(resolve => {
    if (typeof window === "undefined" || !window.speechSynthesis) { resolve(false); return; }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ja-JP";
    utterance.rate = rate;
    const voice = window.speechSynthesis.getVoices().find(v => v.lang.startsWith("ja"));
    if (voice) utterance.voice = voice;
    let done = false;
    const finish = (completed: boolean) => {
      if (done) return;
      done = true;
      if (finishCurrent === finish) finishCurrent = null;
      clearTimeout(timeout);
      resolve(completed);
    };
    const timeout = setTimeout(() => { finish(false); window.speechSynthesis.cancel(); }, Math.max(30000, text.length * 1500));
    finishCurrent = finish;
    utterance.onend = () => finish(true);
    utterance.onerror = () => finish(false);
    try { window.speechSynthesis.speak(utterance); } catch { finish(false); }
  });
}
