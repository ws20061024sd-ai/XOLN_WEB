export interface VocabCard {
  id: string;
  word: string;
  reading: string;
  meaning: string;
  partOfSpeech: string;
  example: string;
  exampleMeaning: string;
  jlptLevel: string;
}

export const vocabulary: VocabCard[] = [
  {
    id: "v-001",
    word: "降る",
    reading: "ふる",
    meaning: "下（雨/雪）",
    partOfSpeech: "五段動詞",
    example: "雨が降りそうです。",
    exampleMeaning: "看起来要下雨了。",
    jlptLevel: "N5",
  },
  {
    id: "v-002",
    word: "食べる",
    reading: "たべる",
    meaning: "吃",
    partOfSpeech: "一段動詞",
    example: "毎朝パンを食べます。",
    exampleMeaning: "每天早上吃面包。",
    jlptLevel: "N5",
  },
  {
    id: "v-003",
    word: "起きる",
    reading: "おきる",
    meaning: "起床；发生",
    partOfSpeech: "一段動詞",
    example: "毎日6時に起きます。",
    exampleMeaning: "每天六点起床。",
    jlptLevel: "N5",
  },
  {
    id: "v-004",
    word: "見る",
    reading: "みる",
    meaning: "看",
    partOfSpeech: "一段動詞",
    example: "テレビを見ます。",
    exampleMeaning: "看电视。",
    jlptLevel: "N5",
  },
  {
    id: "v-005",
    word: "来る",
    reading: "くる",
    meaning: "来",
    partOfSpeech: "カ変動詞",
    example: "友達が家に来ます。",
    exampleMeaning: "朋友来家里。",
    jlptLevel: "N5",
  },
  {
    id: "v-006",
    word: "する",
    reading: "する",
    meaning: "做",
    partOfSpeech: "サ変動詞",
    example: "宿題をします。",
    exampleMeaning: "做作业。",
    jlptLevel: "N5",
  },
  {
    id: "v-007",
    word: "買う",
    reading: "かう",
    meaning: "买",
    partOfSpeech: "五段動詞",
    example: "スーパーで野菜を買いました。",
    exampleMeaning: "在超市买了蔬菜。",
    jlptLevel: "N5",
  },
  {
    id: "v-008",
    word: "読む",
    reading: "よむ",
    meaning: "读",
    partOfSpeech: "五段動詞",
    example: "小説を読むのが好きです。",
    exampleMeaning: "喜欢读小说。",
    jlptLevel: "N5",
  },
  {
    id: "v-009",
    word: "書く",
    reading: "かく",
    meaning: "写",
    partOfSpeech: "五段動詞",
    example: "日記を書きます。",
    exampleMeaning: "写日记。",
    jlptLevel: "N5",
  },
  {
    id: "v-010",
    word: "話す",
    reading: "はなす",
    meaning: "说；谈",
    partOfSpeech: "五段動詞",
    example: "日本語で話しましょう。",
    exampleMeaning: "用日语说吧。",
    jlptLevel: "N5",
  },
];
