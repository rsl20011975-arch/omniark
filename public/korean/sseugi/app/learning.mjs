import {lessons,resolveLesson,variantOf,VARIANTS_PER_BASE} from './bank.mjs';
import {families,familyById} from './curriculum.mjs';
const KEY='sseugi-learning-v2';
export const skillNames={numbers:'수치 연결',direction:'변화 방향',period:'비교 시점',coverage:'대상 빠짐없이 쓰기',relation:'수치 관계',grounding:'자료에 근거하기',expression:'뜻이 통하는 문장',connection:'문장 연결'};
export function loadLearning(storage){try{const data=JSON.parse(storage.getItem(KEY)||'[]');return Array.isArray(data)?data.filter(valid).slice(-1000):[];}catch{return [];}}
function valid(r){return r&&typeof r.lesson==='string'&&/^[a-z0-9-]{1,40}$/.test(r.lesson)&&Object.hasOwn(skillNames,r.skill)&&Number.isFinite(r.at)&&['practice','independent','assisted','deferred'].includes(r.outcome)&&['local','ai'].includes(r.source);}
export function addLearning(rows,event,storage){const record={lesson:event.lesson,skill:event.skill,at:event.at??Date.now(),outcome:event.outcome,source:event.source};if(!valid(record))return rows;const next=[...rows,record].slice(-1000);try{storage.setItem(KEY,JSON.stringify(next));}catch{}return next;}
export function learningSummary(rows,now=Date.now()){
 return Object.entries(skillNames).map(([skill,name])=>{const events=rows.filter(r=>r.skill===skill);const latest=events.at(-1);const independent=events.filter(r=>r.outcome==='independent');const days=new Set(independent.map(r=>Math.floor(r.at/86400000))).size;const due=latest?latest.at+(latest.outcome==='independent'?(days>=2?3:1):0.25)*86400000:null;return {skill,name,source:latest?.source||null,practices:events.length,independent:independent.length,days,due,status:!latest?'아직 확인 전':latest.outcome==='deferred'?'판단 보류':latest.outcome==='practice'?'함께 연습 중':latest.outcome==='assisted'?'도움 받아 완성':days>=2?'다른 날에도 혼자 확인':'한 번 혼자 확인',ready:due!==null&&due<=now};});
}
export function chooseLesson(rows,lessons){const completed=new Set(rows.filter(r=>['independent','assisted'].includes(r.outcome)).map(r=>r.lesson));const last=rows.at(-1);return lessons.findIndex(l=>!completed.has(l.id)&&l.id!==last?.lesson)>=0?lessons.findIndex(l=>!completed.has(l.id)&&l.id!==last?.lesson):lessons.findIndex(l=>l.id!==last?.lesson);}

export function nextFocus(rows,now=Date.now()){const summaries=learningSummary(rows,now);return summaries.filter(s=>s.practices&&['판단 보류','함께 연습 중','도움 받아 완성'].includes(s.status)).sort((a,b)=>(a.due||0)-(b.due||0))[0]||summaries.filter(s=>s.ready).sort((a,b)=>a.due-b.due)[0]||null;}

const PROGRESS_KEY='sseugi-progress-v4';
export function loadProgress(storage){
 try{const data=JSON.parse(storage.getItem(PROGRESS_KEY)||'{}');if(!data||Array.isArray(data)||typeof data!=='object')return {};
  return Object.fromEntries(Object.entries(data).filter(([id,r])=>resolveLesson(id)&&r&&Number.isFinite(r.at)&&r.at>=0&&['practice','assisted','independent','deferred'].includes(r.outcome)&&Number.isInteger(r.attempts)&&r.attempts>=0).map(([id,r])=>[id,{at:r.at,outcome:r.outcome,attempts:r.attempts}]));
 }catch{return {};}
}
export function recordProgress(progress,id,outcome,attempts,storage,at=Date.now()){
 if(!resolveLesson(id)||!['practice','assisted','independent','deferred'].includes(outcome))return progress;
 const next={...progress,[id]:{at,outcome,attempts:Math.max(0,attempts|0)}};
 try{storage.setItem(PROGRESS_KEY,JSON.stringify(next));}catch{}return next;
}
export const isCompleted=r=>!!r&&['assisted','independent'].includes(r.outcome);
export function recommend(rows,progress,currentId,now=Date.now()){
 const current=resolveLesson(currentId),record=progress[currentId];
 const completed=Object.keys(progress).filter(id=>isCompleted(progress[id]));
 const recent=rows.at(-1),weak=recent&&['practice','assisted','deferred'].includes(recent.outcome)?recent.skill:null;
 // A difficult or assisted attempt gets another task at the same or lower level.
 if(current&&record&&record.outcome!=='independent'){
  const candidate=lessons.find(l=>l.type===current.type&&l.level<=current.level&&l.id!==currentId&&!isCompleted(progress[l.id])&&(!weak||l.focusSkills.includes(weak)))||variantOf(current.id,firstUnusedVariant(current.baseId,progress,currentId));
  return {id:candidate.id,reason:'reinforce',skill:weak};
 }
 // Return to an older skill with a different material, not the memorized answer.
 const latestByFamily=new Map();
 for(const [id,r] of Object.entries(progress)){const family=resolveLesson(id)?.type;if(family&&(!latestByFamily.has(family)||r.at>latestByFamily.get(family)[1].at))latestByFamily.set(family,[id,r]);}
 const due=[...latestByFamily.values()].filter(([id,r])=>id!==currentId&&isCompleted(r)&&now-r.at>=(r.outcome==='independent'?3:1)*86400000).sort((a,b)=>a[1].at-b[1].at);
 if(due.length){const base=resolveLesson(due[0][0]);const candidate=lessons.find(l=>l.type===base.type&&!isCompleted(progress[l.id])&&l.id!==currentId)||variantOf(base.id,firstUnusedVariant(base.baseId,progress,currentId));return {id:candidate.id,reason:'review'};}
 // Rotate unlocked families after independent work; never force 30 copies in a row.
 const eligible=families.filter(f=>!f.prerequisite||completed.some(id=>resolveLesson(id)?.type===f.prerequisite&&progress[id].outcome==='independent'));
 const currentIndex=eligible.findIndex(f=>f.id===current?.type);
 const ordered=[...eligible.slice(currentIndex+1),...eligible.slice(0,currentIndex+1)];
 for(const family of ordered){
  const independent=completed.filter(id=>resolveLesson(id)?.type===family.id&&progress[id].outcome==='independent').length;
  const level=Math.min(3,1+Math.floor(independent/3));
  const candidate=lessons.find(l=>l.type===family.id&&l.level<=level&&!isCompleted(progress[l.id])&&l.id!==currentId);
  if(candidate)return {id:candidate.id,reason:completed.length?'advance':'start'};
 }
 const next=lessons.find(l=>!isCompleted(progress[l.id])&&l.id!==currentId);
 if(next)return {id:next.id,reason:'advance'};
 const base=current||lessons[0];return {id:variantOf(base.id,firstUnusedVariant(base.baseId,progress,currentId)).id,reason:'variation'};
}
export function firstUnusedVariant(baseId,progress,excludeId=null){
 for(let n=1;n<=VARIANTS_PER_BASE;n++)if(variantOf(baseId,n).id!==excludeId&&!isCompleted(progress[variantOf(baseId,n).id]))return n;
 // Once all variants were practised, return the least recently practised one.
 return Array.from({length:VARIANTS_PER_BASE},(_,i)=>i+1).filter(n=>variantOf(baseId,n).id!==excludeId).sort((a,b)=>(progress[variantOf(baseId,a).id]?.at||0)-(progress[variantOf(baseId,b).id]?.at||0))[0];
}
