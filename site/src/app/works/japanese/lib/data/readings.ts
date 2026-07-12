export interface ReadingPassage {
  id: string;
  title: string;
  content: string;
  difficulty: "N5" | "N4" | "N3";
  questions: {
    question: string;
    options: string[];
    answer: number;
  }[];
}

export const readings: ReadingPassage[] = [
  {
    id: "r-001",
    title: "日本のコンビニ",
    difficulty: "N4",
    content: "日本のコンビニエンスストアは24時間営業で、食べ物や飲み物だけでなく、ATMやコピー機もあります。最近では、高齢者の見守りサービスを行うコンビニも増えています。また、宅配便の受付や公共料金の支払いもできるため、日本人の生活に欠かせない存在となっています。",
    questions: [
      {
        question: "日本のコンビニにないものはどれですか。",
        options: ["食べ物", "薬", "ATM", "コピー機"],
        answer: 1,
      },
      {
        question: "最近のコンビニの新しいサービスは何ですか。",
        options: ["24時間営業", "食べ物の販売", "高齢者の見守り", "ATMの設置"],
        answer: 2,
      },
    ],
  },
  {
    id: "r-002",
    title: "花火大会",
    difficulty: "N4",
    content: "日本では夏になると、各地で花火大会が開かれます。浴衣を着て花火を見に行くのは日本の夏の風物詩です。花火大会の日はとても混雑するため、早めに場所を取っておくことが大切です。また、屋台で焼きそばやたこ焼きなどを買って食べるのも楽しみの一つです。",
    questions: [
      {
        question: "花火大会の日に大切なことは何ですか。",
        options: ["浴衣を買うこと", "早めに場所を取ること", "友達を誘うこと", "写真を撮ること"],
        answer: 1,
      },
      {
        question: "屋台で買えるものは何ですか。",
        options: ["寿司と刺身", "焼きそばとたこ焼き", "ラーメンと餃子", "カレーとナン"],
        answer: 1,
      },
    ],
  },
];
