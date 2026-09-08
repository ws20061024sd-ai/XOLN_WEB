export interface ExamConfig {
  totalTime: number;
  /** 真考各板块名称与分值权重（%），仅用于备考信息展示，模拟卷未按此组卷 */
  sections: { name: string; weight: number }[];
}

export const examConfig: ExamConfig = {
  totalTime: 120, // 与真考一致
  sections: [
    { name: "聴解", weight: 20 },
    { name: "文字と語彙", weight: 15 },
    { name: "文法", weight: 20 },
    { name: "読解", weight: 30 },
    { name: "翻訳と作文", weight: 15 },
  ],
};
