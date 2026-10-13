// Runtime regression checks with controlled storage/network and a minimal hook harness.
// Run: node review-tests/regression.cjs /absolute/path/to/site
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const site = path.resolve(process.argv[2] || path.join(__dirname, '..')); 
const ts = require(path.join(site, 'node_modules/typescript'));
const root = path.join(site, 'src/app/works/japanese');
const flush = async () => { for (let i = 0; i < 10; i++) await Promise.resolve(); };
function harness(mocks = {}) {
  let cursor = 0;
  const slots = [], effects = [], values = new Map(), timers = [], intervals = [];
  const storage = {get: k => values.get(k) ?? null, set: (k,v) => values.set(k,v)};
  const localStorage = {getItem: k => values.get(k) ?? null, setItem: (k,v) => values.set(k,v), removeItem:k=>values.delete(k)};
  const React = {
    useState(initial) { const i=cursor++; if (!(i in slots)) slots[i]=typeof initial==='function'?initial():initial; return [slots[i], v=>{ slots[i]=typeof v==='function'?v(slots[i]):v; }]; },
    useRef(initial) { const i=cursor++; return slots[i] ??= {current:initial}; },
    useCallback:f=>f, useMemo:f=>f(),
    useEffect(f,deps) { const i=cursor++; if (!slots[i] || deps.some((d,j)=>d!==slots[i][j])) { slots[i]=deps; effects.push(f); } },
    createContext:()=>({Provider:'Provider'}),useContext:()=>null,
  };
  const cache=new Map();
  function load(file) {
    if (file in mocks) return mocks[file];
    if (file.endsWith(".json")) return JSON.parse(fs.readFileSync(path.resolve(root, file), "utf8"));
    if (cache.has(file)) return cache.get(file);
    const filename=['.tsx','.ts'].map(ext=>path.join(root,file+ext)).find(fs.existsSync);
    const module={exports:{}}; cache.set(file,module.exports);
    const code=ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{esModuleInterop:true,target:ts.ScriptTarget.ES2020,module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText;
    const requireMock = name => name==='motion/react'?{motion:{div:'div'}}:name==='react'?React:name==='react/jsx-runtime'?{jsx:(type,props)=>({type,props}),jsxs:(type,props)=>({type,props})}:name.startsWith('.')?load(path.posix.normalize(path.posix.join(path.posix.dirname(file),name))):require(name);
    vm.runInNewContext(code,{module,exports:module.exports,require:requireMock,window:{localStorage},localStorage,document:{visibilityState:'visible',addEventListener(){},removeEventListener(){}},setInterval:f=>{intervals.push(f);return intervals.length;},clearInterval(){},setTimeout:f=>{timers.push(f);return timers.length;},clearTimeout(){},console,Date,Map,Set,Promise});
    cache.set(file,module.exports); return module.exports;
  }
  return {load, storage, values, timers, intervals, render(fn){cursor=0;const result=fn(); while(effects.length)effects.shift()();return result;}};
}
(async()=>{
  let release;const network=new Promise(resolve=>release=resolve);
  const errors=harness({'lib/supabase':{storage:null,saveError:()=>network,loadErrors:async()=>null}});
  // Install storage on the mock before importing the store.
  const errorMocks={storage:errors.storage,saveError:()=>network,loadErrors:async()=>null};
  const e=harness({'lib/supabase':errorMocks});
  const store=e.load('lib/errorStore');
  const pending=store.addErrors([{questionId:'g-1',module:'grammar',date:'2026-10-13'}]);
  assert.equal(errors.storage.get('cjt4_errors')[0].count,1,'mistake must persist before network resolves');
  release();await pending;
  await store.addError({questionId:'g-1',module:'grammar',date:'2026-10-13'});
  assert.equal(errors.storage.get('cjt4_errors')[0].count,2);
  console.log('PASS offline-first mistakes and repeat counting');

  const vocabulary=Array.from({length:30},(_,i)=>({id:`v-${i}`,meaning:i<2?'same':`meaning-${i}`}));
  const h=harness({'lib/supabase':{storage:null,loadCardStates:async()=>null,saveCardState:async()=>{}},'lib/data/vocabulary':{vocabulary}});
  // Use a second harness sharing this storage in its network mock.
  const f=harness({'lib/supabase':{storage:h.storage,loadCardStates:async()=>h.storage.get("card_states"),saveCardState:async()=>{}},'lib/data/vocabulary':{vocabulary}});
  h.storage.set('flashcard_new_words',{date:new Date().toDateString(),ids:Array.from({length:9},(_,i)=>`old-${i}`)});
  const hook=f.load('hooks/useFlashcards').useFlashcards;
  f.render(hook);await flush();let cards=f.render(hook);
  assert.equal(cards.queueLength,20,'continuous learning has no daily new-word cap');
  assert.equal(new Set(cards.options).size,cards.options.length,'option meanings must be unique');
  cards.checkAnswer(cards.currentCard.meaning);f.render(hook);
  assert.equal(h.storage.get('flashcard_new_words').ids.length,10);
  const f2=harness({'lib/supabase':{storage:h.storage,loadCardStates:async()=>h.storage.get("card_states"),saveCardState:async()=>{}},'lib/data/vocabulary':{vocabulary}});
  const hook2=f2.load('hooks/useFlashcards').useFlashcards;f2.render(hook2);await flush();
  assert.equal(f2.render(hook2).queueLength,20,'remaining new words stay available after remount');
  let continuous = f.render(hook);
  if (continuous.lastResult !== null) { continuous.nextCard(); f.render(hook); }
  for (let i=0;i<35;i++) {
    continuous=f.render(hook); assert.ok(continuous.currentCard, 'continuous study cannot stop at the end of a batch');
    continuous.checkAnswer(continuous.correctAnswer);
    continuous=f.render(hook);continuous.nextCard();f.render(hook);
  }
  assert.ok(Object.values(h.storage.get('card_states')).every(state=>state.level <= 1), 'same-session free practice must not fast-forward review levels');
  console.log('PASS continuous learning across remount and unique options');

  let resolveCloud;
  const p=harness({'lib/supabase':{loadProgress:()=>new Promise(r=>resolveCloud=r),saveProgress:async()=>{}}});
  const Provider=p.load('hooks/useProgress').ProgressProvider;
  const render=()=>p.render(()=>Provider({children:null})).props.value;
  const initial=render();initial.recordModuleAnswer('grammar',true);
  resolveCloud({lastActive:new Date().toISOString().slice(0,10),daily:{cardsReviewed:20,streakDays:4,totalMinutes:12},modules:Object.fromEntries(['grammar','reading','listening','flashcard','translate'].map(k=>[k,{total:5,correct:3}]))});
  await flush();const merged=render();
  assert.equal(merged.moduleStats.grammar.total,6,'cloud hydration must retain an answer made during loading');
  assert.equal(merged.moduleStats.grammar.correct,4);
  assert.equal(merged.stats.cardsReviewed,21);
  assert.equal(merged.stats.totalMinutes,12,'answering must not invent a minute');
  console.log('PASS cloud hydration retains live answers and no fake study time');

  const failed=harness({'lib/supabase':{loadProgress:async()=>{throw new Error('offline')},saveProgress:async()=>{throw new Error('must not upload')}}});
  const FailProvider=failed.load('hooks/useProgress').ProgressProvider;
  failed.render(()=>FailProvider({children:null}));await flush();failed.render(()=>FailProvider({children:null}));
  assert.equal(failed.values.get('cjt4_progress_cloud_pending'),'true','failed cloud read must remain pending across reload');
  assert.ok(failed.values.has('cjt4_progress'),'offline work must remain persistable');
  console.log('PASS failed cloud hydration records pending recovery');
  let uploads=0;
  const offline=harness({'lib/supabase':{loadProgress:async()=>{throw Error('offline')},saveProgress:async()=>{uploads++;}}});
  const OfflineProvider=offline.load('hooks/useProgress').ProgressProvider;
  offline.render(()=>OfflineProvider({children:null}));await flush();offline.render(()=>OfflineProvider({children:null}));
  offline.timers.forEach(t=>t());assert.equal(uploads,0,'failed hydration must block cloud writes');
  console.log('PASS failed cloud hydration cannot overwrite remote totals');

  const recorded=[], mistakes=[];
  const exam=harness({
    'hooks/useProgress':{useProgress:()=>({recordModuleAnswer:(...args)=>recorded.push(args)})},
    'lib/errorStore':{addErrors:async records=>mistakes.push(...records)},
  });
  const Exam=exam.load('components/MockExamModule').default;
  const elements=node=> !node || typeof node!=='object'?[]:[node,...[node.props?.children].flat(Infinity).flatMap(elements)];
  const start=elements(exam.render(Exam)).find(n=>n.type==='button' && n.props.children==='开始模考');
  start.props.onClick();const running=exam.render(Exam);
  const oldNow=Date.now;Date.now=()=>oldNow()+3*60*60*1000;
  try { exam.intervals.at(-1)(); } finally { Date.now=oldNow; }
  assert.ok(recorded.length>=20,'timeout must record the full paper');
  assert.equal(mistakes.length,recorded.length,'unanswered questions must enter error book');
  const count=recorded.length;exam.intervals.at(-1)();assert.equal(recorded.length,count,'finishing twice must not duplicate results');
  assert.ok(elements(exam.render(Exam)).some(n=>n.type==='button' && n.props.children==='再练一卷'));
  assert.ok(running);
  console.log('PASS timeout submits once and includes unanswered mistakes');

})().catch(error=>{console.error(error);process.exitCode=1;});
