export interface ListeningScript {
  id: string;
  title: string;
  script: string;        // 日语原文
  translation: string;   // 中文翻译
  difficulty: "N5" | "N4" | "N3";
  questions: {
    question: string;
    options: string[];
    answer: number;
  }[];
}

export const listeningScripts: ListeningScript[] = [
  {
    id: "l-001",
    title: "明日の予定",
    difficulty: "N4",
    script: "明日は友達と映画を見に行きます。駅の前で午後2時に待ち合わせをしました。映画が終わったら、近くのレストランで晩ご飯を食べる予定です。",
    translation: "明天和朋友去看电影。约好下午2点在车站前碰头。看完电影后，计划在附近的餐厅吃晚饭。",
    questions: [
      {
        question: "明日、何をしますか。",
        options: ["買い物をする", "映画を見る", "図書館に行く", "旅行に行く"],
        answer: 1,
      },
      {
        question: "待ち合わせの時間は何時ですか。",
        options: ["午後1時", "午後2時", "午後3時", "午後4時"],
        answer: 1,
      },
    ],
  },
  {
    id: "l-002",
    title: "天気予報",
    difficulty: "N4",
    script: "今日の午後から雨が降るそうです。傘を持って出かけたほうがいいでしょう。明日は晴れる予定ですが、気温が下がるので、暖かい服を着てください。",
    translation: "据说今天下午开始下雨。最好带伞出门。明天预计会放晴，但气温会下降，请穿暖和的衣服。",
    questions: [
      {
        question: "今日の午後、どんな天気ですか。",
        options: ["晴れ", "曇り", "雨", "雪"],
        answer: 2,
      },
      {
        question: "明日、気をつけることは何ですか。",
        options: ["傘を持っていく", "早く起きる", "暖かい服を着る", "帽子をかぶる"],
        answer: 2,
      },
    ],
  },
];
