const assert=require('node:assert/strict');
const fs=require('node:fs');const path=require('node:path');const vm=require('node:vm');
const site=path.resolve(__dirname,'..');const ts=require(path.join(site,'node_modules/typescript'));
const dir=path.join(site,'src/app/works/japanese/lib');const store=new Map();
const storage={get:key=>store.has(key)?JSON.parse(store.get(key)):null,set:(key,v)=>store.set(key,JSON.stringify(v))};
const cache=new Map();
function load(file){
 if(file.endsWith('.json'))return JSON.parse(fs.readFileSync(file,'utf8'));
 if(cache.has(file))return cache.get(file);
 const module={exports:{}};
 const code=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2020,module:ts.ModuleKind.CommonJS,esModuleInterop:true}}).outputText;
 vm.runInNewContext(code,{module,exports:module.exports,require:name=>name.endsWith('/supabase')?{storage}:load(path.resolve(path.dirname(file),name)+(name.endsWith('.json')?'':'.ts')),Date,crypto:globalThis.crypto});
 cache.set(file,module.exports);return module.exports;
}
const review=load(path.join(dir,'reviewStore.ts'));
const now=Date.now();let state=review.schedule(undefined,true,true,now);
assert.equal(state.nextReview,now+86400000);
state=review.schedule(state,true,true,state.nextReview);assert.equal(state.successes,2);
assert.equal(review.schedule(state,true,false,now).successes,0,'guessing must not count as recall');
assert.equal(review.schedule(state,false,true,now).nextReview,now);
review.recordReview('one','grammar',true);review.recordReview('two','grammar',false);
assert.deepEqual(Array.from(review.reviewQueue([{id:'one'},{id:'fresh'},{id:'two'}],'grammar'),x=>x.id),['two','fresh']);
storage.set('cjt4_correct',['grammar:legacy']);assert.equal(review.reviewQueue([{id:'legacy'}],'grammar').length,1,'old correct answers must be eligible for delayed validation');
assert.equal(storage.get('attempts_v2').length,2);
const questions=load(path.join(dir,'data/grammar.ts')).grammarQuestions;
assert.equal(new Set(questions.map(q=>q.id)).size,questions.length);
for(const q of questions)assert.ok(q.answer>=0&&q.answer<q.options.length);
const q31=questions.find(q=>q.id==='g-031');assert.equal(q31.options[q31.answer],'褒められ');
const q343=questions.find(q=>q.id==='g-343');assert.equal(q343.options[q343.answer],'だ');
const tasks=JSON.parse(fs.readFileSync(path.join(site,'shared/study-content.json'),'utf8'));
assert.ok(!tasks.some(t=>t.id==='t-024'));
for(const task of tasks.filter(t=>t.type==='writing')){const len=Array.from(task.reference).length;assert.ok(len>=200&&len<=250,`${task.id}: ${len}`);assert.ok(task.prompt.includes('200—250'));}
assert.ok(!tasks.find(t=>t.id==='t-004').reference.includes('遅くまで寝ていた'));
console.log('PASS delayed reviews, guessing, due ordering and legacy eligibility');
console.log('PASS corrected questions, unique IDs and 200–250-character writing references');
