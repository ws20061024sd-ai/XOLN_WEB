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
  // ===== 尊他·謙讓·丁寧 補充 =====
  { id:"g-101", question:"お客様、どうぞこちらに（　　　）ください。", options:["お座り","お座って","お座りして","座られて"], answer:0, explanation:"尊敬语请求：お+ます形+ください。座る→座ります→お座りください=请坐。", knowledgePoint:"敬語·お〜ください", jlptLevel:"N4" },
  { id:"g-102", question:"部長は今、会議に（　　　）います。", options:["出て","出られて","お出でになって","お出て"], answer:2, explanation:"尊敬语：お+ます形+になる。出る→お出でになる→お出でになっています=部长正在开会。", knowledgePoint:"敬語·お〜になる", jlptLevel:"N4" },
  { id:"g-103", question:"私が（　　　）ますので、ご安心ください。", options:["やり","いたし","なさい","され"], answer:1, explanation:"谦让语：する→いたす。私がいたします=我来做。", knowledgePoint:"敬語·いたす", jlptLevel:"N4" },
  // ===== 自他動詞·補助動詞 =====
  { id:"g-120", question:"ドアが（　　　）います。", options:["開けて","開いて","開けって","開くって"], answer:1, explanation:"自动词表状态。開く（自动）→開いている=门开着。開ける（他动）→開けてある=（被人）开着。", knowledgePoint:"自他動詞·ている", jlptLevel:"N4" },
  { id:"g-121", question:"冷蔵庫にビールが（　　　）あります。", options:["冷やす","冷やして","冷やし","冷え"], answer:1, explanation:"他动词+てある表人为状态。冷やす→冷やしてある=冰着。", knowledgePoint:"補助·てある", jlptLevel:"N4" },
  { id:"g-122", question:"ちょっと（　　　）みてください。", options:["食べ","食べて","食べた","食べる"], answer:1, explanation:"〜てみる表尝试。食べてみる=尝尝看。", knowledgePoint:"補助·てみる", jlptLevel:"N4" },
  { id:"g-123", question:"毎日ジョギングを（　　　）います。", options:["して","する","した","し"], answer:0, explanation:"〜ている表习惯。ジョギングをしている=有在跑步。", knowledgePoint:"補助·ている", jlptLevel:"N4" },
  { id:"g-124", question:"友達が駅まで（　　　）くれました。", options:["送って","送られて","送らせて","送り"], answer:0, explanation:"〜てくれる表别人为我做。送ってくれた=送了我。", knowledgePoint:"授受·てくれる", jlptLevel:"N4" },
  { id:"g-125", question:"母に料理を（　　　）もらいました。", options:["作って","作られて","作らせて","作り"], answer:0, explanation:"〜てもらう表请别人做。作ってもらった=让妈妈做了。", knowledgePoint:"授受·てもらう", jlptLevel:"N4" },
  { id:"g-126", question:"友達の宿題を（　　　）あげました。", options:["手伝って","手伝われて","手伝わせて","手伝い"], answer:0, explanation:"〜てあげる表我为别人做。手伝ってあげた=帮了朋友。", knowledgePoint:"授受·てあげる", jlptLevel:"N4" },
  { id:"g-127", question:"一緒に（　　　）か。", options:["行く","行こう","行きます","行って"], answer:1, explanation:"意向形（〜う）表劝诱。行こうか=一起去吧？", knowledgePoint:"意向形", jlptLevel:"N4" },
  { id:"g-128", question:"もう遅いから、（　　　）ほうがいい。", options:["帰る","帰った","帰ります","帰って"], answer:1, explanation:"〜たほうがいい表建议。帰ったほうがいい=最好回去。", knowledgePoint:"助言·たほうがいい", jlptLevel:"N4" },
  { id:"g-129", question:"ここで（　　　）な。", options:["吸う","吸い","吸え","吸って"], answer:0, explanation:"〜な表禁止。吸うな=别抽烟。", knowledgePoint:"禁止·な", jlptLevel:"N4" },
  // ===== 比較·程度 =====
  { id:"g-150", question:"彼は私（　　　）若く見えます。", options:["より","ほど","だけ","まで"], answer:0, explanation:"より表比较基准。私より若い=比我年轻。", knowledgePoint:"比較·より", jlptLevel:"N5" },
  { id:"g-151", question:"彼（　　　）親切な人に会ったことがない。", options:["より","ほど","こそ","さえ"], answer:1, explanation:"〜ほど〜ない表否定最高级。彼ほど親切な人はいない=没有比他更热心的了。", knowledgePoint:"比較·ほど", jlptLevel:"N4" },
  { id:"g-152", question:"雨の（　　　）、運動会は中止になった。", options:["ため","せい","おかげ","わけ"], answer:0, explanation:"〜ため表客观原因。雨のため=因为下雨。", knowledgePoint:"原因·ため", jlptLevel:"N4" },
  { id:"g-153", question:"薬を飲んだ（　　　）、熱が下がった。", options:["せいで","おかげで","ために","ように"], answer:1, explanation:"おかげで表正面原因。薬のおかげで=多亏了药。", knowledgePoint:"原因·おかげで", jlptLevel:"N4" },
  { id:"g-154", question:"彼は来月結婚する（　　　）だ。", options:["そう","よう","らしい","みたい"], answer:0, explanation:"传闻そうだ前接简体形。結婚するそうだ=听说他要结婚。", knowledgePoint:"伝聞·そうだ", jlptLevel:"N4" },
  { id:"g-155", question:"今日は（　　　）雨が降りそうです。", options:["今にも","もう","もうすぐ","さっき"], answer:0, explanation:"今にも+そうだ=眼看就要…。今にも降りそうだ=眼看就要下雨了。", knowledgePoint:"様態·今にも", jlptLevel:"N4" },
  { id:"g-156", question:"彼女は（　　　）泣き出しそうな顔をしている。", options:["今にも","もう","すぐ","さっき"], answer:0, explanation:"今にも+そうだ=眼看就要…。今にも泣き出しそう=眼看就要哭出来了。", knowledgePoint:"様態·今にも", jlptLevel:"N4" },
  // ===== 受身·使役 補充 =====
  { id:"g-180", question:"先生に名前を（　　　）ました。", options:["呼んだ","呼ばれ","呼ばれられ","呼んで"], answer:1, explanation:"被动态。呼ぶ→呼ばれる→呼ばれました=被老师叫了名字。", knowledgePoint:"受身·直接", jlptLevel:"N4" },
  { id:"g-181", question:"雨に（　　　）て、服が濡れた。", options:["降ら","降られ","降らせ","降り"], answer:1, explanation:"受害被动（迷惑の受身）。雨に降られて=被雨淋了（受害）。", knowledgePoint:"受身·迷惑", jlptLevel:"N4" },
  { id:"g-182", question:"母は私に部屋を（　　　）。", options:["掃除した","掃除させた","掃除された","掃除できた"], answer:1, explanation:"使役。掃除する→掃除させる→掃除させた=妈妈让我打扫房间。", knowledgePoint:"使役", jlptLevel:"N4" },
  { id:"g-183", question:"毎日、母に野菜を（　　　）ます。", options:["食べ","食べられ","食べさせられ","食べたい"], answer:2, explanation:"使役被动=被迫。食べさせられる=被逼着吃。", knowledgePoint:"使役受身", jlptLevel:"N4" },
  // ===== 可能 補充 =====
  { id:"g-185", question:"漢字がなかなか（　　　）ません。", options:["覚え","覚えられ","覚えさせ","覚えよう"], answer:1, explanation:"可能态。覚える→覚えられる=记不住。", knowledgePoint:"可能·一段", jlptLevel:"N4" },
  { id:"g-186", question:"この魚は（　　　）ますか。", options:["食べ","食べられ","食べさせ","食べよう"], answer:1, explanation:"可能态。食べる→食べられる=能吃吗。注意与被动同形。", knowledgePoint:"可能·一段", jlptLevel:"N4" },
  { id:"g-187", question:"一人で病院に（　　　）ますか。", options:["行き","行け","行かれ","行か"], answer:1, explanation:"五段可能态。行く→行ける=能去吗。", knowledgePoint:"可能·五段", jlptLevel:"N4" },
  // ===== 形式名詞 =====
  { id:"g-190", question:"趣味は映画を見る（　　　）です。", options:["の","こと","もの","ところ"], answer:1, explanation:"こと表抽象事物。趣味は〜こと=爱好是…。", knowledgePoint:"形式名詞·こと", jlptLevel:"N4" },
  { id:"g-191", question:"彼が来る（　　　）を知っていますか。", options:["の","こと","もの","ところ"], answer:1, explanation:"知っている的对象用こと。〜ことを知っている=知道…。", knowledgePoint:"形式名詞·こと", jlptLevel:"N4" },
  { id:"g-192", question:"星が光っている（　　　）が見える。", options:["の","こと","もの","ところ"], answer:0, explanation:"感官动词（見える/聞こえる）的对象用の。光っているのが見える=能看到星星在发光。", knowledgePoint:"形式名詞·の", jlptLevel:"N4" },
  { id:"g-193", question:"大切な（　　　）は諦めないことだ。", options:["の","こと","もの","ところ"], answer:1, explanation:"〜ことは〜ことだ句型。大切なことは=重要的是。", knowledgePoint:"形式名詞·こと", jlptLevel:"N4" },
  { id:"g-194", question:"若い（　　　）は何でもできる。", options:["の","こと","もの","うち"], answer:2, explanation:"〜うちに表在…期间。若いうちに=趁着年轻。", knowledgePoint:"形式名詞·うち", jlptLevel:"N4" },
  { id:"g-195", question:"ちょうど出かけようとした（　　　）、電話が鳴った。", options:["の","こと","もの","ところ"], answer:3, explanation:"〜ところ表正要做…的时候。出かけようとしたところ=正要出门的时候。", knowledgePoint:"形式名詞·ところ", jlptLevel:"N4" },
  // ===== 接続 =====
  { id:"g-200", question:"雨が降った（　　　）、試合は行われた。", options:["のに","けど","ので","から"], answer:0, explanation:"〜のに表逆接（却/居然）。雨が降ったのに=虽然下雨了却。", knowledgePoint:"接続·のに", jlptLevel:"N4" },
  { id:"g-201", question:"その店は高い（　　　）、サービスが悪い。", options:["し","が","のに","から"], answer:0, explanation:"〜し表并列理由。高いしサービスも悪い=又贵服务又差。", knowledgePoint:"接続·し", jlptLevel:"N4" },
  { id:"g-202", question:"遊んで（　　　）いないで、勉強しなさい。", options:["ばかり","だけ","しか","のみ"], answer:0, explanation:"〜てばかり表净是/光是做…。遊んでばかり=光玩。", knowledgePoint:"接続·ばかり", jlptLevel:"N4" },
  { id:"g-203", question:"彼は忙しい（　　　）、毎日残業している。", options:["らしく","ように","そうに","みたく"], answer:0, explanation:"らしく表有根据的推测。忙しいらしく=好像很忙（根据他每天加班）。", knowledgePoint:"接続·らしく", jlptLevel:"N4" },
  // ===== 副詞·程度 =====
  { id:"g-210", question:"この映画は（　　　）面白くなかった。", options:["あまり","とても","たいへん","よく"], answer:0, explanation:"あまり+否定=不太…。あまり面白くなかった=不太有趣。", knowledgePoint:"副詞·あまり", jlptLevel:"N5" },
  { id:"g-211", question:"宿題を（　　　）忘れてしまった。", options:["全部","とても","あまり","ちょっと"], answer:0, explanation:"全部+肯定=全都。全部忘れた=全忘了。", knowledgePoint:"副詞·全部", jlptLevel:"N5" },
  { id:"g-212", question:"（　　　）待ってください。", options:["ちょっと","とても","あまり","ぜんぜん"], answer:0, explanation:"ちょっと=稍微/一下。ちょっと待って=等一下。", knowledgePoint:"副詞·ちょっと", jlptLevel:"N5" },
  { id:"g-213", question:"（　　　）準備はできました。", options:["もう","まだ","ずっと","ときどき"], answer:0, explanation:"もう表已经。もう準備できた=已经准备好了。", knowledgePoint:"副詞·もう", jlptLevel:"N5" },
  { id:"g-214", question:"彼は（　　　）来ていません。", options:["もう","まだ","ずっと","いつも"], answer:1, explanation:"まだ+否定=还没。まだ来ていない=还没来。", knowledgePoint:"副詞·まだ", jlptLevel:"N5" },
  // ===== 助詞 補充 =====
  { id:"g-220", question:"電車（　　　）降りる。", options:["を","に","で","から"], answer:0, explanation:"从交通工具下来用を。電車を降りる=下电车。", knowledgePoint:"助詞·を（降車）", jlptLevel:"N5" },
  { id:"g-221", question:"9時（　　　）会議が始まります。", options:["に","で","を","が"], answer:0, explanation:"具体时间点+に。9時に=在9点。", knowledgePoint:"助詞·に（時間）", jlptLevel:"N5" },
  { id:"g-222", question:"友達（　　　）いっしょに帰った。", options:["と","に","を","で"], answer:0, explanation:"一起做某事的人用と。友達と=和朋友一起。", knowledgePoint:"助詞·と（同伴）", jlptLevel:"N5" },
  { id:"g-223", question:"誕生日は5月10日（　　　）終わります。", options:["に","で","まで","から"], answer:1, explanation:"时间截止用で。5月10日で終わる=到5月10日结束。", knowledgePoint:"助詞·で（期限）", jlptLevel:"N4" },
  // ===== 連体修飾 =====
  { id:"g-230", question:"机の上に（　　　）本は私のです。", options:["ある","いる","おく","いく"], answer:0, explanation:"ある表无生命存在。机の上にある本=在桌上的书。", knowledgePoint:"連体·ある", jlptLevel:"N5" },
  { id:"g-231", question:"（　　　）人は誰ですか。", options:["歌う","歌っている","歌った","歌って"], answer:1, explanation:"ている作定语表正在进行。歌っている人=正在唱歌的人。", knowledgePoint:"連体·ている", jlptLevel:"N4" },
  { id:"g-232", question:"これは昨日（　　　）ケーキです。", options:["食べる","食べた","食べている","食べよう"], answer:1, explanation:"过去式作定语。昨日食べたケーキ=昨天吃的蛋糕。", knowledgePoint:"連体·た形", jlptLevel:"N5" },

  { id:"g-240", question:"メモを（　　　）おいてください。", options:["書く","書き","書いて","書いた"], answer:2, explanation:"〜ておく表事先做。書いておく=先写好。", knowledgePoint:"補助·ておく", jlptLevel:"N4" },
  { id:"g-241", question:"日本語がだんだん（　　　）きた。", options:["話す","話し","話して","話せる"], answer:2, explanation:"〜てくる表变化开始。話してきた=渐渐会说了。", knowledgePoint:"補助·てくる", jlptLevel:"N4" },
  { id:"g-242", question:"これからも勉強を（　　　）いく。", options:["続ける","続け","続けて","続けた"], answer:2, explanation:"〜ていく表持续下去。続けていく=继续下去。", knowledgePoint:"補助·ていく", jlptLevel:"N4" },
  { id:"g-243", question:"彼は何も（　　　）ずに帰った。", options:["言う","言い","言って","言わ"], answer:3, explanation:"〜ずに=〜ないで。言わずに=什么都没说就。", knowledgePoint:"補助·ずに", jlptLevel:"N4" },
  { id:"g-250", question:"一生懸命勉強した。（　　　）合格。", options:["だから","しかし","ところで","または"], answer:0, explanation:"だから表原因→结果。", knowledgePoint:"接続·だから", jlptLevel:"N5" },
  { id:"g-251", question:"彼は優秀だ。（　　　）性格に問題が。", options:["だから","しかし","すると","つまり"], answer:1, explanation:"しかし表逆接。", knowledgePoint:"接続·しかし", jlptLevel:"N5" },
  { id:"g-252", question:"まず材料準備。（　　　）作り始め。", options:["だから","しかし","それから","ところで"], answer:2, explanation:"それから表先后顺序。", knowledgePoint:"接続·それから", jlptLevel:"N5" },
  { id:"g-253", question:"彼はケチだ。（　　　）無駄遣いしないだけ。", options:["しかし","だから","つまり","ところで"], answer:2, explanation:"つまり表换句话说。", knowledgePoint:"接続·つまり", jlptLevel:"N4" },
  { id:"g-254", question:"（　　　）今日はここまでにしよう。", options:["しかし","だから","それでは","つまり"], answer:2, explanation:"それでは表转换话题。", knowledgePoint:"接続·それでは", jlptLevel:"N4" },
  { id:"g-260", question:"明日の試験、大丈夫（　　　）。", options:["か","よ","ね","な"], answer:2, explanation:"ね表确认。大丈夫ね？=没问题吧？", knowledgePoint:"終助詞·ね", jlptLevel:"N5" },
  { id:"g-261", question:"早く行かないと遅れる（　　　）。", options:["ね","よ","か","な"], answer:1, explanation:"よ表提醒/告知。遅れるよ=会迟到的哦。", knowledgePoint:"終助詞·よ", jlptLevel:"N5" },
  { id:"g-262", question:"彼、本当に来る（　　　）。", options:["ね","よ","か","かな"], answer:3, explanation:"かな表自言自语/疑问。", knowledgePoint:"終助詞·かな", jlptLevel:"N4" },
  { id:"g-270", question:"日本語を勉強する（　　　）は楽しい。", options:["の","こと","もの","ところ"], answer:0, explanation:"形容心情用の。勉強するのは楽しい=学习很快乐。", knowledgePoint:"名詞化·の", jlptLevel:"N4" },
  { id:"g-280", question:"パンを三（　　　）買った。", options:["本","枚","個","杯"], answer:2, explanation:"パン用個。三個=三个。", knowledgePoint:"助数詞·個", jlptLevel:"N5" },
  { id:"g-281", question:"コーヒーを二（　　　）ください。", options:["本","枚","個","杯"], answer:3, explanation:"杯=饮料量词。", knowledgePoint:"助数詞·杯", jlptLevel:"N5" },
  { id:"g-282", question:"1（　　　）に2回ジムに行く。", options:["日","週","月","年"], answer:1, explanation:"〜に〜回表频率。週に2回=每周两次。", knowledgePoint:"頻度·に", jlptLevel:"N4" },
  { id:"g-290", question:"昨日は水（　　　）飲まなかった。", options:["だけ","しか","のみ","ばかり"], answer:1, explanation:"しか+否定表限定。水しか飲まなかった=只喝了水。", knowledgePoint:"限定·しか", jlptLevel:"N4" },
  { id:"g-291", question:"彼はゲーム（　　　）している。", options:["だけ","しか","のみ","ばかり"], answer:3, explanation:"ばかり表光是。ゲームばかり=光打游戏。", knowledgePoint:"限定·ばかり", jlptLevel:"N4" },
  { id:"g-292", question:"この店は会員（　　　）入れます。", options:["しか","だけ","のみ","さえ"], answer:1, explanation:"だけ表肯定限定。会員だけ=只有会员。", knowledgePoint:"限定·だけ", jlptLevel:"N4" },
  { id:"g-300", question:"10年後空気はもっと（　　　）だろう。", options:["汚かった","汚い","汚くなる","汚れ"], answer:2, explanation:"イ形+なる表变化+だろう表推测。", knowledgePoint:"推量·だろう", jlptLevel:"N4" },
  { id:"g-301", question:"彼は来ない（　　　）だ。", options:["そう","よう","みたい","らしい"], answer:1, explanation:"ようだ表推测（书面）。", knowledgePoint:"推量·ようだ", jlptLevel:"N4" },
  { id:"g-302", question:"外は雪が（　　　）みたいだ。", options:["降る","降って","降った","降っている"], answer:3, explanation:"みたいだ表推测（口语）。", knowledgePoint:"推量·みたいだ", jlptLevel:"N4" },
  { id:"g-310", question:"彼は（　　　）天才だと思う。", options:["まったく","なかなか","けっして","ほとんど"], answer:0, explanation:"まったく+名词=简直是。", knowledgePoint:"副詞·まったく", jlptLevel:"N4" },
  { id:"g-311", question:"この料理は（　　　）美味しい。", options:["なかなか","まったく","けっして","ほとんど"], answer:0, explanation:"なかなか+肯定=相当。", knowledgePoint:"副詞·なかなか", jlptLevel:"N4" },
  { id:"g-312", question:"宿題を（　　　）忘れた。", options:["さっぱり","すっかり","はっきり","ゆっくり"], answer:1, explanation:"すっかり=完全。すっかり忘れた=彻底忘了。", knowledgePoint:"副詞·すっかり", jlptLevel:"N4" },
  { id:"g-313", question:"意味が（　　　）わからない。", options:["さっぱり","すっかり","はっきり","ゆっくり"], answer:0, explanation:"さっぱり+否定=完全（不）。", knowledgePoint:"副詞·さっぱり", jlptLevel:"N4" },
  { id:"g-314", question:"（　　　）答えを書いてください。", options:["さっぱり","すっかり","はっきり","ゆっくり"], answer:2, explanation:"はっきり=清楚地。", knowledgePoint:"副詞·はっきり", jlptLevel:"N4" },
  { id:"g-320", question:"熱がある（　　　）会社に行った。", options:["くせに","のに","から","ので"], answer:1, explanation:"のに表逆接/意外。熱があるのに=明明发烧却。", knowledgePoint:"逆接·のに", jlptLevel:"N4" },
  { id:"g-321", question:"彼はお金がない（　　　）高級品を買う。", options:["くせに","のに","から","ので"], answer:0, explanation:"くせに表不满。", knowledgePoint:"逆接·くせに", jlptLevel:"N3" },
  { id:"g-322", question:"ラーメンは高い（　　　）だ。", options:["もの","こと","わけ","はず"], answer:0, explanation:"〜ものだ表感慨。高いものだ=确实贵啊。", knowledgePoint:"終助·ものだ", jlptLevel:"N4" },
  { id:"g-323", question:"学生は勉強する（　　　）だ。", options:["もの","こと","べき","はず"], answer:2, explanation:"〜べきだ表应该。", knowledgePoint:"助言·べきだ", jlptLevel:"N3" },
  { id:"g-324", question:"彼は仕事を（　　　）つもりだ。", options:["やめる","やめた","やめている","やめよう"], answer:0, explanation:"〜つもりだ表打算。动词原形接续。", knowledgePoint:"意志·つもり", jlptLevel:"N4" },
  { id:"g-325", question:"子供の（　　　）笑顔に癒された。", options:["そうな","ような","らしい","みたい"], answer:1, explanation:"〜ような+名词表比喻。", knowledgePoint:"比喩·ような", jlptLevel:"N4" },

  { id:"g-340", question:"雨が（　　　）そうだから傘を持っていこう。", options:["降る","降り","降ら","降って"], answer:1, explanation:"样态そうだ接ます形。降りそう=看起来要下雨。", knowledgePoint:"様態·そうだ", jlptLevel:"N4" },
  { id:"g-341", question:"この料理は（　　　）そうに見えるが実は簡単だ。", options:["難し","難しい","難しく","難しかった"], answer:0, explanation:"イ形词干+そう=看起来…。難しそう=看起来难。", knowledgePoint:"様態·そうだ（イ形）", jlptLevel:"N4" },
  { id:"g-342", question:"彼女はとても（　　　）そうに話している。", options:["楽し","楽しい","楽しく","楽しかった"], answer:0, explanation:"イ形词干+そうに+动词。楽しそうに話す=开心地说着。", knowledgePoint:"様態·そうに", jlptLevel:"N4" },
  { id:"g-343", question:"その話は本当（　　　）そうだ。", options:["な","に","の","だ"], answer:0, explanation:"传闻そうだ前接简体。ナ形词干+だ→本当だ+そうだ。", knowledgePoint:"伝聞·そうだ", jlptLevel:"N4" },
  { id:"g-350", question:"彼が来るか（　　　）わからない。", options:["どうか","なにか","どこか","だれか"], answer:0, explanation:"〜かどうか表是否。来るかどうか=来不来/是否会来。", knowledgePoint:"疑問·かどうか", jlptLevel:"N4" },
  { id:"g-351", question:"何を（　　　）いいか迷っている。", options:["する","したら","すれば","して"], answer:2, explanation:"〜ばいい表建议。何をすればいい=做什么好呢。", knowledgePoint:"助言·ばいい", jlptLevel:"N4" },
  { id:"g-352", question:"もっと早く（　　　）よかったのに。", options:["言う","言えば","言ったら","言って"], answer:1, explanation:"〜ばよかった表后悔。早く言えばよかった=早点说就好了。", knowledgePoint:"後悔·ばよかった", jlptLevel:"N4" },
  { id:"g-353", question:"天気が（　　　）いいほど散歩が気持ちいい。", options:["良い","良ければ","良かったら","良く"], answer:1, explanation:"〜ば〜ほど表越…越…。天気が良ければ良いほど=天气越好。", knowledgePoint:"比較·ば〜ほど", jlptLevel:"N3" },
  { id:"g-354", question:"これは簡単（　　　）見えるが実は難しい。", options:["そうに","ように","らしく","みたく"], answer:1, explanation:"〜ように見える表看上去像。簡単に見える=看上去简单。", knowledgePoint:"推量·ように見える", jlptLevel:"N4" },
  { id:"g-355", question:"彼の話を聞いていると、まるで自分が（　　　）かのような気分になる。", options:["体験した","体験する","体験している","体験しよう"], answer:0, explanation:"まるで〜かのよう=好像…一样（与事实相反用过去式）。体験したかのような=好像亲身经历过一样。", knowledgePoint:"比喩·かのよう", jlptLevel:"N3" },
  { id:"g-356", question:"この問題は難しすぎて、私には（　　　）。", options:["解ける","解けた","解けそうにない","解けそうだ"], answer:2, explanation:"〜そうにない表没有迹象。解けそうにない=看起来解不开。", knowledgePoint:"様態·そうにない", jlptLevel:"N4" },
  { id:"g-357", question:"彼は怒った（　　　）部屋を出て行った。", options:["そうに","ように","らしく","みたく"], answer:0, explanation:"〜そうに表样态。怒ったそうに=好像生气了的样子（描述外表）。", knowledgePoint:"様態·そうに", jlptLevel:"N4" },
  { id:"g-358", question:"言いたい（　　　）言ってください。", options:["だけ","しか","ばかり","ほど"], answer:0, explanation:"〜だけ表充分/尽情。言いたいだけ=想说多少说多少。", knowledgePoint:"限定·だけ", jlptLevel:"N4" },
  { id:"g-359", question:"考えれば考える（　　　）わからなくなる。", options:["だけ","ほど","まで","より"], answer:0, explanation:"〜ば〜だけ表成正比。考えれば考えるだけ=越想越。", knowledgePoint:"比例·だけ", jlptLevel:"N3" },
  { id:"g-360", question:"この本は読めば読む（　　　）面白い。", options:["だけ","ほど","まで","より"], answer:1, explanation:"〜ば〜ほど表越…越…。読めば読むほど=越读越。", knowledgePoint:"比較·ほど", jlptLevel:"N3" },
  { id:"g-361", question:"努力した（　　　）合格できなかった。", options:["のに","から","ので","けど"], answer:0, explanation:"のに表逆接（虽然…却…）。努力したのに=虽然努力了却。", knowledgePoint:"逆接·のに", jlptLevel:"N4" },
  { id:"g-362", question:"値段が高い（　　　）かえって売れている。", options:["のに","から","ので","だけ"], answer:0, explanation:"のに表意外。高いのに反而热销。", knowledgePoint:"逆接·のに", jlptLevel:"N4" },
  { id:"g-363", question:"天気予報（　　　）明日は晴れだそうだ。", options:["について","によると","によって","に対して"], answer:1, explanation:"〜によると表信息来源。天気予報によると=根据天气预报。", knowledgePoint:"情報源·によると", jlptLevel:"N4" },
  { id:"g-364", question:"この町は10年前（　　　）大きく変わった。", options:["に比べて","によって","について","に対して"], answer:0, explanation:"〜に比べて表比较。10年前に比べて=与10年前相比。", knowledgePoint:"比較·に比べて", jlptLevel:"N4" },
  { id:"g-365", question:"日本の文化（　　　）どう思いますか。", options:["について","によると","によって","に対して"], answer:0, explanation:"〜について表关于。日本の文化について=关于日本文化。", knowledgePoint:"対象·について", jlptLevel:"N4" },
  { id:"g-366", question:"国（　　　）習慣が違う。", options:["について","によって","によると","に対して"], answer:1, explanation:"〜によって表因…而异。国によって違う=因国家不同而异。", knowledgePoint:"原因·によって", jlptLevel:"N4" },
  { id:"g-367", question:"この映画は子供（　　　）面白いかもしれない。", options:["について","によって","にとって","に対して"], answer:2, explanation:"〜にとって表对于…来说。子供にとって=对孩子来说。", knowledgePoint:"立場·にとって", jlptLevel:"N4" },
  { id:"g-368", question:"先生（　　　）失礼なことを言ってはいけません。", options:["について","によって","にとって","に対して"], answer:3, explanation:"〜に対して表对…（对象）。先生に対して=对老师。", knowledgePoint:"対象·に対して", jlptLevel:"N4" },
  { id:"g-369", question:"日本語を勉強する（　　　）日本に来た。", options:["ために","ように","ことに","せいで"], answer:0, explanation:"〜ために表目的（意志动词）。勉強するために=为了学习。", knowledgePoint:"目的·ために", jlptLevel:"N4" },
  { id:"g-370", question:"風邪を引いた（　　　）学校を休んだ。", options:["おかげで","せいで","ために","から"], answer:2, explanation:"〜ために表原因（客观）。風邪を引いたために=因为感冒。", knowledgePoint:"原因·ために", jlptLevel:"N4" },
  { id:"g-371", question:"この店のラーメンは（　　　）美味しい。", options:["また","まだ","まず","まあ"], answer:3, explanation:"まあ=还行/还算。まあ美味しい=还算好吃（勉强肯定）。", knowledgePoint:"副詞·まあ", jlptLevel:"N4" },
  { id:"g-372", question:"宿題は（　　　）終わったから心配しないで。", options:["もう","まだ","ずっと","すぐ"], answer:0, explanation:"もう表已经。もう終わった=已经做完了。", knowledgePoint:"副詞·もう", jlptLevel:"N5" },
  { id:"g-373", question:"彼は（　　　）来るはずです。", options:["もう","まだ","もうすぐ","さっき"], answer:2, explanation:"もうすぐ表马上/不久。もうすぐ来る=马上就来。", knowledgePoint:"副詞·もうすぐ", jlptLevel:"N4" },

];
