export interface ExamConfig {
  sections: {
    name: string;
    weight: number;   // 分值权重(%)
    questionCount: number;
    timeMinutes: number;
  }[];
  totalTime: number;
  totalScore: number;
}

export const examConfig: ExamConfig = {
  totalTime: 120,
  totalScore: 100,
  sections: [
    { name: "聴解", weight: 20, questionCount: 10, timeMinutes: 25 },
    { name: "文字と語彙", weight: 15, questionCount: 15, timeMinutes: 15 },
    { name: "文法", weight: 20, questionCount: 20, timeMinutes: 20 },
    { name: "読解", weight: 30, questionCount: 10, timeMinutes: 40 },
    { name: "翻訳と作文", weight: 15, questionCount: 3, timeMinutes: 20 },
  ],
};
