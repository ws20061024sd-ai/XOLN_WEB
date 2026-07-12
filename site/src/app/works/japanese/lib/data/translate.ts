export interface TranslateTask {
  id: string;
  type: "ja2zh" | "zh2ja" | "writing";
  prompt: string;
  reference: string;
  hint?: string;
}

export const translateTasks: TranslateTask[] = [
  {
    id: "t-001",
    type: "ja2zh",
    prompt: "環境問題は、一国だけでなく、世界中の国々が協力して取り組む必要があります。",
    reference: "环境问题不仅是一个国家的事，需要世界各国共同努力。",
  },
  {
    id: "t-002",
    type: "zh2ja",
    prompt: "因为昨天睡得太晚，今天早上没能起床。",
    reference: "昨日遅くまで寝ていたので、今朝起きられませんでした。",
    hint: "使用可能态「〜られる」",
  },
  {
    id: "t-003",
    type: "writing",
    prompt: "请以「私の一日」为题，用日语写一篇约150字的短文。提示：可以写你的作息、学习、兴趣爱好等。",
    reference: "私は毎朝7時に起きます。朝ごはんを食べてから、学校に行きます。午前中は授業を受けます。昼休みに友達と食堂で昼ごはんを食べます。午後の授業が終わったら、図書館で勉強します。夜は家で宿題をして、11時ごろ寝ます。充実した毎日を過ごしています。",
  },
];
