import {lessons,resolveLesson} from './bank.mjs';
export {lessons,resolveLesson};

// This is a bounded evidence checker, not a free-form Korean grader.
// Every sentence must match a supported grounded claim before local completion.
export function normalizeClaim(text){return text.normalize('NFKC').trim().replace(/^(?:반면|한편|또한|그리고)\s+/,'').replace(/[\s,]/g,'').replace(/퍼센트/g,'%').replace(/킬로그램/g,'kg').replace(/증가하였다|늘었다|늘어났다/g,'증가했다').replace(/감소하였다|줄었다|줄어들었다/g,'감소했다').replace(/동일하였다/g,'동일했다').replace(/역전되었다/g,'바뀌었다').replace(/[.。]$/,'');}
const splitSentences=text=>text.split(/(?<!\d)\.|\.(?!\d)|[。!\n]+/).map(s=>s.trim()).filter(Boolean);
const numberShape=s=>s.replace(/\d+(?:\.\d+)?/g,'#');
const directionShape=s=>s.replace(/증가했다|감소했다/g,'DIRECTION');
function diagnose(sentence,claim){
 const norm=normalizeClaim(sentence);
 for(const form of claim.forms){
  const expected=normalizeClaim(form);
  if(numberShape(norm)===numberShape(expected)){
   const years=[...sentence.matchAll(/(\d{4})\s*년/g)].map(m=>Number(m[1]));
   const expectedYears=[...form.matchAll(/(\d{4})\s*년/g)].map(m=>Number(m[1]));
   if(JSON.stringify(years)!==JSON.stringify(expectedYears))return {kind:'period',fact:claim.subject,years:expectedYears};
   return {kind:'numbers',fact:claim.subject,values:claim.numbers,unit:claim.unit};
  }
  if(claim.kind==='direction'&&directionShape(norm)===directionShape(expected))return {kind:'direction',fact:claim.subject,from:claim.from,to:claim.to,unit:claim.unit};
 }
 return null;
}
export function analyze(value,lesson){
 if(typeof value!=='string'||value.trim().length<5)return {type:'empty'};
 if(value.length>1500)return {type:'long'};
 if(!lesson?.claims)return {type:'review',issues:[{kind:'uncertain'}],facts:[]};
 const text=value.normalize('NFKC'),sentences=splitSentences(text),remaining=new Set(lesson.claims.map((_,i)=>i)),unmatched=[],matched=[];
 for(const sentence of sentences){
  const normalized=normalizeClaim(sentence);
  const index=[...remaining].find(i=>lesson.claims[i].forms.some(f=>normalizeClaim(f)===normalized));
  if(index!==undefined){remaining.delete(index);matched.push(index);}else unmatched.push(sentence);
 }
 const issues=[];
 if(/때문|덕분|탓에|영향으로|원인은|이유는|좋아해서|싫어해서/.test(text))issues.push({kind:'cause'});
 if(/[?？]|아마|일 것이다|할 것이다|일까/.test(text))issues.push({kind:'uncertain',fact:'question-or-prediction'});
 for(const sentence of unmatched){
  const diagnosed=[...remaining].map(i=>diagnose(sentence,lesson.claims[i])).find(Boolean);
  if(diagnosed)issues.push(diagnosed);else issues.push({kind:'uncertain',fact:'unrecognized-claim'});
 }
 for(const index of remaining){
  const claim=lesson.claims[index];
  if(!unmatched.length||!text.includes(claim.subject.split('·')[0]))issues.push({kind:'missing',fact:claim.subject});
 }
 if(remaining.size&&!issues.length)issues.push({kind:'uncertain'});
 const priority={direction:0,numbers:1,period:2,missing:3,cause:4,uncertain:5};issues.sort((a,b)=>priority[a.kind]-priority[b.kind]);
 return {type:!issues.length&&!remaining.size?'pass':'review',issues,facts:matched.map(i=>lesson.claims[i].subject),matched:matched.length,total:lesson.claims.length,scope:'supported-chart-claims-only'};
}
export function initialState(){return {lesson:0,lessonId:null,phase:'write',support:0,attempts:0,issue:null,probe:null,probeMisses:0,challenge:false,evidence:[],completed:false};}
export function currentLesson(state){return resolveLesson(state.lessonId)||lessons[state.lesson]||lessons[0];}
export function transition(state,event){
 const s=structuredClone(state),lesson=currentLesson(s);
 if(['HELP','SUBMIT'].includes(event.type)&&['success','complete'].includes(s.phase))return s;
 if(event.type==='HELP'){s.support=Math.max(s.support,event.level);return s;}
 if(event.type==='CHALLENGE'){s.challenge=true;s.phase='challenge';return s;}
 if(event.type==='RESUME'){s.phase='write';s.challenge=false;s.issue=null;return s;}
 if(event.type==='SUBMIT'){
  const result=analyze(event.text,lesson);s.attempts++;
  if(['empty','long'].includes(result.type))return {...s,message:result.type};
  s.message=null;
  if(result.type==='pass'){
   s.phase='success';s.issue=null;s.probe=null;s.evidence=s.evidence.filter(e=>e.lesson!==lesson.id);
   s.evidence.push({lesson:lesson.id,support:s.support,attempts:s.attempts,at:Date.now(),skills:lesson.focusSkills,independent:s.support===0,scope:'bounded-facts-only'});
  }else{s.issue=result.issues[0];s.phase='review';s.support=Math.max(s.support,1);s.probe=null;}
  return s;
 }
 if(event.type==='PROBE'&&s.issue?.kind==='direction'){s.probe=event.answer===(s.issue.to>s.issue.from?'up':'down')?'correct':'incorrect';if(s.probe==='incorrect'){s.probeMisses++;s.support=Math.max(s.support,2);}return s;}
 if(event.type==='NEXT'&&s.phase==='success'){s.phase='complete';s.completed=true;}
 return s;
}
export function saveEvidence(evidence,storage){try{storage.setItem('sseugi-evidence-v1',JSON.stringify(evidence.slice(-1000).map(({lesson,support,attempts,at,independent,scope,skills})=>({lesson,support,attempts,at,independent,scope,skills}))));}catch{}}
export function loadEvidence(storage){try{const data=JSON.parse(storage.getItem('sseugi-evidence-v1')||'[]');return Array.isArray(data)?data.filter(e=>e&&typeof e.lesson==='string'&&Number.isFinite(e.at)&&Number.isInteger(e.support)&&e.support>=0&&e.support<=3&&e.scope==='bounded-facts-only').slice(-1000):[];}catch{return [];}}
