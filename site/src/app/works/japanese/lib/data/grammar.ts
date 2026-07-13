export interface GrammarQuestion {
  id: string;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
  knowledgePoint: string;
  jlptLevel: string;
}

export const grammarQuestions: GrammarQuestion[] = [
  // ===== 助詞 =====
  { id:"g-001", question:"私（　　）学生です。", options:["は","が","を","に"], answer:0, explanation:"「は」提示主题。が强调主语，を表宾语，に表时间/对象。", knowledgePoint:"助詞·は（主題）", jlptLevel:"N5" },
  { id:"g-002", question:"先生は学生（　　）日本語を教えます。", options:["を","に","が","で"], answer:1, explanation:"教える的对象用「に」。学生に教える=教给学生。", knowledgePoint:"助詞·に（対象）", jlptLevel:"N5" },
  { id:"g-003", question:"バス（　　）学校に行きます。", options:["を","が","で","に"], answer:2, explanation:"交通工具+で表手段。バスで行く=坐公交去。", knowledgePoint:"助詞·で（手段）", jlptLevel:"N5" },
  { id:"g-004", question:"公園（　　）散歩します。", options:["で","に","を","が"], answer:2, explanation:"移动动词经过的场所用「を」。公園を散歩する=在公园散步。", knowledgePoint:"助詞·を（移動）", jlptLevel:"N5" },
  { id:"g-005", question:"ここ（　　）タバコを吸わないでください。", options:["に","で","を","が"], answer:1, explanation:"动作发生场所用「で」。ここで吸う=在这里抽。に表存在/方向。", knowledgePoint:"助詞·で（場所）", jlptLevel:"N5" },
  { id:"g-006", question:"兄は私（　　）背が高いです。", options:["より","ほど","まで","から"], answer:0, explanation:"比较句中「より」表比较基准。兄は私より高い=哥哥比我高。", knowledgePoint:"助詞·より（比較）", jlptLevel:"N4" },

  // ===== 動詞活用 =====
  { id:"g-010", question:"昨日、友達に（　　　）。", options:["会った","会います","会う","会って"], answer:0, explanation:"「昨日」是过去时间，需用过去式タ形。会う→会った。", knowledgePoint:"動詞·タ形（過去）", jlptLevel:"N5" },
  { id:"g-011", question:"宿題を（　　　）から、テレビを見ます。", options:["する","して","した","します"], answer:1, explanation:"〜てから表先后顺序：做完作业之后（再看电视）。する→して（テ形）。", knowledgePoint:"動詞·テ形（順序）", jlptLevel:"N5" },
  { id:"g-012", question:"辞書を（　　　）ください。", options:["貸す","貸し","貸して","貸せ"], answer:2, explanation:"请求他人做事用「〜てください」。貸す→貸して+ください=请借给我。", knowledgePoint:"動詞·テ形（依頼）", jlptLevel:"N5" },
  { id:"g-013", question:"この薬は食後に（　　　）なければなりません。", options:["飲む","飲み","飲ま","飲め"], answer:2, explanation:"なければなりません接ない形。飲む→飲まない→飲ま+なければなりません=必须喝。", knowledgePoint:"動詞·ナイ形（義務）", jlptLevel:"N4" },
  { id:"g-014", question:"この本はもう（　　　）しまいました。", options:["読む","読み","読んで","読んだ"], answer:2, explanation:"〜てしまう表动作完成/遗憾。読む→読んで+しまう→読んでしまいました=已经读完了。", knowledgePoint:"動詞·テ形（完了）", jlptLevel:"N4" },
  { id:"g-015", question:"ここで写真を（　　　）はいけません。", options:["撮る","撮り","撮って","撮った"], answer:2, explanation:"〜てはいけません表禁止。撮る→撮って+はいけません=不可以拍照。", knowledgePoint:"動詞·テ形（禁止）", jlptLevel:"N4" },
  { id:"g-016", question:"ドアにカギが（　　　）あります。", options:["かける","かけ","かけて","かけた"], answer:2, explanation:"〜てある表人为动作结果的状态持续。かける→かけて+ある=锁着。", knowledgePoint:"動詞·テ形（状態）", jlptLevel:"N4" },

  // ===== 形容詞 =====
  { id:"g-020", question:"このケーキは（　　　）おいしいです。", options:["とても","あまり","ぜんぜん","ちょっと"], answer:0, explanation:"とても修饰形容词表程度高。あまり/ぜんぜん需接否定。", knowledgePoint:"程度副詞", jlptLevel:"N5" },
  { id:"g-021", question:"昨日のテストは（　　　）です。", options:["難しい","難しかった","難しく","難し"], answer:1, explanation:"昨日是过去，イ形容词过去式：難しい→難しかった。", knowledgePoint:"イ形容詞·過去", jlptLevel:"N5" },
  { id:"g-022", question:"もう少し（　　　）してください。", options:["静か","静かに","静かな","静かで"], answer:1, explanation:"ナ形容词修饰动词用に形。静か+に+する=弄安静。", knowledgePoint:"ナ形容詞·連用形", jlptLevel:"N5" },
  { id:"g-023", question:"この部屋は（　　　）なりました。", options:["明るい","明るく","明るいに","明るさ"], answer:1, explanation:"イ形容词+なる表变化。明るい→明るく+なる=变亮了。", knowledgePoint:"イ形容詞·変化", jlptLevel:"N4" },
  { id:"g-024", question:"部屋を（　　　）してください。", options:["きれい","きれいに","きれいな","きれいで"], answer:1, explanation:"ナ形容词+にする表人为改变。きれい+に+する=弄干净。", knowledgePoint:"ナ形容詞·変化", jlptLevel:"N4" },

  // ===== 可能·受身·使役·使役受身 =====
  { id:"g-030", question:"私は日本語が（　　　）ます。", options:["話す","話し","話せ","話さ"], answer:2, explanation:"可能态：五段动词→え段+る。話す→話せる→話せます=会说。", knowledgePoint:"可能形", jlptLevel:"N4" },
  { id:"g-031", question:"先生に（　　　）ました。", options:["褒めた","褒められた","褒めさせた","褒めたかった"], answer:1, explanation:"被动态表被动。褒める→褒められる→褒められました=被老师表扬了。", knowledgePoint:"受身形", jlptLevel:"N4" },
  { id:"g-032", question:"母は子供に野菜を（　　　）。", options:["食べた","食べられた","食べさせた","食べなかった"], answer:2, explanation:"使役态表让/使。食べる→食べさせる→食べさせた=让孩子吃蔬菜。", knowledgePoint:"使役形", jlptLevel:"N4" },
  { id:"g-033", question:"嫌いな野菜を（　　　）ました。", options:["食べ","食べられ","食べさせられ","食べたい"], answer:2, explanation:"使役被动态=被迫。食べる→食べさせられる=被逼着吃（讨厌的蔬菜）。", knowledgePoint:"使役受身形", jlptLevel:"N4" },

  // ===== 条件表現 =====
  { id:"g-040", question:"時間が（　　　）ば、旅行に行きたいです。", options:["ある","あり","あれ","あって"], answer:2, explanation:"ば形条件：五段动词→え段+ば。ある→あれ+ば=如果有时间。", knowledgePoint:"条件·ば形", jlptLevel:"N4" },
  { id:"g-041", question:"春に（　　　）、桜が咲きます。", options:["なる","なると","なれば","なったら"], answer:1, explanation:"「と」表恒常条件（一…就…）。春になると=一到春天。", knowledgePoint:"条件·と", jlptLevel:"N4" },
  { id:"g-042", question:"安（　　　）買います。", options:["いと","ければ","かったら","くて"], answer:2, explanation:"たら条件最常用。安い→安かったら=如果便宜就买。", knowledgePoint:"条件·たら", jlptLevel:"N4" },
  { id:"g-043", question:"雨なら、試合は（　　　）。", options:["中止だ","中止する","中止した","中止だった"], answer:0, explanation:"なら前接名词，表承接话题。雨なら中止だ=如果是雨就取消。", knowledgePoint:"条件·なら", jlptLevel:"N4" },

  // ===== 敬語 =====
  { id:"g-050", question:"社長はもう（　　　）。", options:["帰った","お帰りになった","帰られました","お帰りしました"], answer:1, explanation:"尊敬语：お+ます形+になる。帰る→お帰りになる=社长已经回去了。", knowledgePoint:"敬語·尊敬", jlptLevel:"N4" },
  { id:"g-051", question:"私は明日（　　　）。", options:["休みます","お休みします","休まれます","お休みになる"], answer:1, explanation:"谦让语：お+ます形+する。休む→お休みします=我明天请假。", knowledgePoint:"敬語·謙譲", jlptLevel:"N4" },
  { id:"g-052", question:"少々（　　　）ください。", options:["待つ","待ち","お待ち","待って"], answer:2, explanation:"お+ます形+ください是尊敬请求。待つ→お待ちください=请稍等。", knowledgePoint:"敬語·依頼", jlptLevel:"N4" },

  // ===== 授受関係 =====
  { id:"g-060", question:"友達がプレゼントを（　　　）。", options:["くれた","あげた","もらった","やった"], answer:0, explanation:"别人给我/我这边的人用くれる。友達がくれた=朋友给了我。", knowledgePoint:"授受·くれる", jlptLevel:"N4" },
  { id:"g-061", question:"私は友達にプレゼントを（　　　）。", options:["くれた","あげた","もらった","いただいた"], answer:1, explanation:"我给别人用あげる。友達にあげた=我给了朋友。", knowledgePoint:"授受·あげる", jlptLevel:"N4" },
  { id:"g-062", question:"先生に本を（　　　）ました。", options:["くれ","あげ","もらい","やり"], answer:2, explanation:"从别人那里得到用もらう。先生にもらった=从老师那里得到了。", knowledgePoint:"授受·もらう", jlptLevel:"N4" },
  { id:"g-063", question:"課長に資料を（　　　）。", options:["くれた","あげた","いただいた","さしあげた"], answer:2, explanation:"从上级得到，もらう→いただく（自谦）。課長にいただいた=从科长那里得到了。", knowledgePoint:"授受·いただく", jlptLevel:"N4" },
  { id:"g-064", question:"社長に資料を（　　　）。", options:["あげた","さしあげた","いただいた","もらった"], answer:1, explanation:"给上级，あげる→さしあげる。社長にさしあげた=给了社长。", knowledgePoint:"授受·さしあげる", jlptLevel:"N4" },

  // ===== 様態·伝聞·推量 =====
  { id:"g-070", question:"雨が（　　　）そうだ。", options:["降る","降り","降ら","降って"], answer:1, explanation:"そうだ表样态接ます形去ます。降る→降ります→降り+そうだ=看起来要下雨。降る+そうだ是传闻不是样态。", knowledgePoint:"様態·そうだ", jlptLevel:"N4" },
  { id:"g-071", question:"天気予報によると、明日は雨だ（　　　）。", options:["そうだ","ようだ","らしい","みたい"], answer:0, explanation:"传闻そうだ前接简体。雨だ+そうだ=据天气预报说明天有雨。", knowledgePoint:"伝聞·そうだ", jlptLevel:"N4" },
  { id:"g-072", question:"彼は学生の（　　　）。", options:["そうだ","ようだ","らしい","はずだ"], answer:1, explanation:"ようだ表推测/比喻。学生のようだ=看起来像学生。名词+の+ようだ。", knowledgePoint:"推量·ようだ", jlptLevel:"N4" },
  { id:"g-073", question:"噂によると、彼は来月結婚する（　　　）。", options:["そうだ","ようだ","らしい","はずだ"], answer:2, explanation:"らしい表有根据的推测或传闻。結婚する+らしい=据说他要结婚。", knowledgePoint:"推量·らしい", jlptLevel:"N4" },

  // ===== 複合文法 =====
  { id:"g-080", question:"彼は何も知らない（　　　）だ。", options:["こと","もの","はず","わけ"], answer:2, explanation:"はずだ表理应如此。知らない+はずだ=他应该不知道。", knowledgePoint:"複合·はずだ", jlptLevel:"N4" },
  { id:"g-081", question:"もう少しで遅刻する（　　　）だった。", options:["ところ","こと","もの","はず"], answer:0, explanation:"〜ところだった表差一点就…。遅刻するところだった=差点迟到。", knowledgePoint:"複合·ところだ", jlptLevel:"N4" },
  { id:"g-082", question:"努力した（　　　）、合格できた。", options:["おかげで","せいで","ために","ように"], answer:0, explanation:"〜おかげで表多亏了（正面结果）。努力したおかげで=多亏了努力。", knowledgePoint:"複合·おかげで", jlptLevel:"N4" },
  { id:"g-083", question:"授業中に寝てしまった（　　　）、先生に怒られた。", options:["おかげで","せいで","ために","から"], answer:1, explanation:"〜せいで表因为…（负面结果）。寝てしまったせいで=因为睡着了被骂了。", knowledgePoint:"複合·せいで", jlptLevel:"N4" },
  { id:"g-084", question:"遅刻しない（　　　）早めに出かけよう。", options:["ために","ように","ことに","もので"], answer:1, explanation:"〜ように表为了（接非意志动词/否定）。遅刻しないように=为了不迟到。", knowledgePoint:"目的·ように", jlptLevel:"N4" },
  { id:"g-085", question:"日本語を勉強する（　　　）、日本に来ました。", options:["ように","ために","ことに","せいで"], answer:1, explanation:"〜ために表目的（接意志动词）。勉強するために=为了学日语。", knowledgePoint:"目的·ために", jlptLevel:"N4" },
  { id:"g-086", question:"明日試験があるので、今夜は勉強（　　　）。", options:["しない","しよう","するな","しなければならない"], answer:3, explanation:"〜なければならない表必须。勉強しなければならない=必须学习。", knowledgePoint:"義務·なければならない", jlptLevel:"N4" },
  { id:"g-087", question:"彼は怒っている（　　　）、一言も話さなかった。", options:["ように","みたいで","らしく","そうに"], answer:2, explanation:"らしく表有根据的推测。怒っているらしく=好像生气了（根据他不说话推断）。", knowledgePoint:"複合·らしく", jlptLevel:"N4" },
  { id:"g-088", question:"この本を読めば読む（　　　）面白くなる。", options:["ほど","だけ","まで","より"], answer:0, explanation:"〜ば〜ほど表越…越…。読めば読むほど=越读越有趣。", knowledgePoint:"複合·ほど", jlptLevel:"N3" },
  { id:"g-089", question:"日本語が（　　　）につれて、日本の文化にも興味を持つようになった。", options:["上手","上手な","上手になる","上手になった"], answer:2, explanation:"〜につれて表随着变化。上手になる+につれて=随着变好。", knowledgePoint:"複合·につれて", jlptLevel:"N3" },
  { id:"g-090", question:"彼はまるで何も（　　　）かのように振る舞った。", options:["知らない","知らなかった","知っている","知っていた"], answer:1, explanation:"まるで〜かのように表好像…一样（与事实相反）。知らなかったかのように=好像什么都不知道似的。注意用过去式。", knowledgePoint:"複合·かのように", jlptLevel:"N3" },
];
