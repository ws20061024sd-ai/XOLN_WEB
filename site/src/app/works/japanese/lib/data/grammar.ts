export interface GrammarQuestion {
  id: string;
  question: string;
  options: string[];
  answer: number; // 0-based index
  explanation: string;
  knowledgePoint: string;
  jlptLevel: string;
}

export const grammarQuestions: GrammarQuestion[] = [
  {
    id: "g-001",
    question: "雨が（　　　）そうだ。",
    options: ["降る", "降り", "降ら", "降って"],
    answer: 1,
    explanation: "「そうだ」表“样态”（看起来要…）时接ます形去掉ます。降る→降ります→降り+そうだ=降りそうだ（看起来要下雨）。A错：动词原形+そうだ是传闻。C、D错：不存在此接续。",
    knowledgePoint: "助動詞·そうだ（様態）",
    jlptLevel: "N4",
  },
  {
    id: "g-002",
    question: "このケーキは（　　　）おいしいです。",
    options: ["とても", "あまり", "ぜんぜん", "ちょっと"],
    answer: 0,
    explanation: "「とても」修饰形容词表示程度很高（非常好吃）。B「あまり」和C「ぜんぜん」需接否定。D「ちょっと」意为“有点”，但不如A自然。",
    knowledgePoint: "程度副詞",
    jlptLevel: "N5",
  },
  {
    id: "g-003",
    question: "昨日、友達に（　　　）。",
    options: ["会った", "会います", "会う", "会って"],
    answer: 0,
    explanation: "「昨日」是过去时间，需要用过去式。会う→会った（タ形，简体过去）。B是ます形现在，C是原形，D是テ形不能直接结句。",
    knowledgePoint: "動詞·タ形（過去）",
    jlptLevel: "N5",
  },
  {
    id: "g-004",
    question: "先生は学生（　　　）日本語を教えます。",
    options: ["を", "に", "が", "で"],
    answer: 1,
    explanation: "授受关系中，教える的对象用「に」标记。「学生に教える」=教给学生。A「を」标记动作对象，C「が」标记主语，D「で」标记手段/场所。",
    knowledgePoint: "助詞·に（対象）",
    jlptLevel: "N5",
  },
  {
    id: "g-005",
    question: "もう少し（　　　）してください。",
    options: ["静か", "静かに", "静かな", "静かで"],
    answer: 1,
    explanation: "形容动词修饰动词时用「に」形。静か+に+する=静かにする（使安静）。A是词干，C是连体形修饰名词，D是テ形表示并列。",
    knowledgePoint: "形容動詞·連用形",
    jlptLevel: "N5",
  },
  {
    id: "g-006",
    question: "彼はもう（　　　）かもしれません。",
    options: ["帰る", "帰った", "帰ります", "帰って"],
    answer: 1,
    explanation: "「かもしれない」前接简体形。表示“已经回去了”需要用过去式「帰った」+かもしれない。A是现在时（回去），C和D不能直接接かもしれない。",
    knowledgePoint: "推量表現·かもしれない",
    jlptLevel: "N4",
  },
  {
    id: "g-007",
    question: "この問題は難しくて（　　　）。",
    options: ["わかりません", "わからなかった", "わからない", "わかる"],
    answer: 2,
    explanation: "「〜て」表示原因理由时，后面接状态描述。难→所以不懂（现在时）。「難しくてわからない」=因为难所以不懂。A是敬体不合适，B是过去式，D是肯定。",
    knowledgePoint: "テ形·原因理由",
    jlptLevel: "N4",
  },
  {
    id: "g-008",
    question: "先生に（　　　）本をいただきました。",
    options: ["くれる", "あげる", "もらう", "さしあげる"],
    answer: 2,
    explanation: "从老师那里获得书，用「もらう」。いただく是もらう的谦让语。整句：从老师那里收到了书。A是别人给我，B是我给别人，D是あげる的谦让语。",
    knowledgePoint: "授受動詞·もらう/いただく",
    jlptLevel: "N4",
  },
  {
    id: "g-009",
    question: "時間が（　　　）ば、旅行に行きたいです。",
    options: ["ある", "あり", "あれ", "あって"],
    answer: 2,
    explanation: "「ば」形条件：五段动词→え段+ば。ある→あれ+ば=あれば（如果有）。A是原形，B是ます形词干，D是テ形。",
    knowledgePoint: "条件表現·ば形",
    jlptLevel: "N4",
  },
  {
    id: "g-010",
    question: "この薬は食後に（　　　）なければなりません。",
    options: ["飲む", "飲み", "飲ま", "飲め"],
    answer: 2,
    explanation: "「なければなりません」前接ない形（去掉ない）。飲む→飲まない→飲ま+なければなりません=必须喝。A是原形，B是ます形词干，D是命令形。",
    knowledgePoint: "義務表現·なければならない",
    jlptLevel: "N4",
  },
];
