import tasks from "../../../../../../shared/study-content.json";
export interface TranslateTask { id: string; type: "ja2zh" | "zh2ja" | "writing"; prompt: string; reference: string; hint?: string; }
// One content source is shared by the client and authenticated feedback server.
export const translateTasks = tasks as TranslateTask[];
