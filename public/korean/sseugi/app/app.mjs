import {lessons,analyze,initialState,transition,currentLesson,saveEvidence,loadEvidence} from './engine.mjs';
import {resolveLesson,variantOf,VARIANTS_PER_BASE} from './bank.mjs';
import {families,familyById,coreLessons,phases} from './curriculum.mjs';
import {createCoach} from './ai.mjs';
import {loadLearning,addLearning,learningSummary,loadProgress,recordProgress,isCompleted,recommend,firstUnusedVariant} from './learning.mjs';
const app=document.querySelector('#app');
let storage;try{storage=window.localStorage;}catch{storage={getItem:()=>null,setItem:()=>{}};}
let language='en';try{language=storage.getItem('sseugi-language')==='ko'?'ko':'en';}catch{}
const t=(en,ko)=>language==='ko'?ko:en;
const tr=value=>typeof value==='string'?value:value[language];
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let state=initialState(),learning=loadLearning(storage),progress=loadProgress(storage);
state.evidence=loadEvidence(storage);
let view='library',draft='',notice='',showModel=false,showAlternate=false,hintStep=0,materialOpen=true,aiMode=false,pause=false,selectedFamily='change',selectedLevel='all',stage=null,coreId=null;
const sessions=new Map();
let aiAttempted=false;
const skillNames={numbers:['Numbers','수치 연결'],direction:['Direction','변화 방향'],period:['Time points','시점 연결'],coverage:['Required evidence','필수 정보'],relation:['Comparisons','수치 관계'],grounding:['Grounding','근거'],expression:['Expression','표현'],connection:['Connection','문장 연결']};
const nameFor=s=>t(...(skillNames[s]||['Writing','쓰기']));
let coreDone={};try{const saved=JSON.parse(storage.getItem('sseugi-core-v4')||'{}');if(saved&&typeof saved==='object'&&!Array.isArray(saved))coreDone=Object.fromEntries(Object.entries(saved).filter(([id,at])=>coreLessons.some(c=>c.id===id)&&Number.isFinite(at)));}catch{}
function markOutcome(outcome,source,skills=currentLesson(state).focusSkills){
 const l=currentLesson(state);
 for(const skill of skills)learning=addLearning(learning,{lesson:l.id,skill,outcome,source},storage);
 progress=recordProgress(progress,l.id,outcome,state.attempts,storage);
 if(coreId&&['assisted','independent'].includes(outcome)){coreDone={...coreDone,[coreId]:Date.now()};try{storage.setItem('sseugi-core-v4',JSON.stringify(coreDone));}catch{}}
}
const ai=createCoach({t,getLanguage:()=>language,getLesson:()=>currentLesson(state),getAnswer:()=>draft,getProfile:()=>learningSummary(learning).filter(s=>s.practices).map(s=>({skill:s.skill,status:s.status,independent:s.independent})),onChange:()=>render(),onMode:()=>{aiMode=false;},onHelp:()=>{state.support=Math.max(state.support,1);},onResult:(result,intent)=>{
 if(result.retracted||(intent==='challenge'&&result.action==='defer')){state.phase='write';markOutcome('deferred','ai',[result.skill]);}
 if(intent==='assess'){
  state.attempts++;
  if(result.action==='complete'){state.phase='success';state.issue=null;markOutcome(state.support?'assisted':'independent','ai',[...new Set([...currentLesson(state).focusSkills,'grounding','expression'])]);}
  else{state.phase='review';markOutcome(result.action==='defer'?'deferred':'practice','ai',[result.skill]);}
 }
}});
function remember(){sessions.set(currentLesson(state).id,{state:structuredClone(state),draft,stage,coreId,showModel,showAlternate,hintStep});}
function openLesson(id,newStage=null){
 if(ai.pending)return;const lesson=resolveLesson(id);if(!lesson)return;
 remember();ai.reset();aiAttempted=false;const previous=sessions.get(id);
 if(previous&&newStage===null){({state,draft,stage,coreId,showModel,showAlternate,hintStep}=previous);}
 else{state={...initialState(),lessonId:id,evidence:state.evidence,support:newStage!==null&&newStage<3?1:0};draft='';stage=newStage;coreId=newStage===null?null:`${lesson.type}-step-${newStage+1}`;showModel=false;showAlternate=false;hintStep=0;}
 view='lesson';pause=false;notice='';materialOpen=true;render();window.scrollTo({top:0,behavior:'instant'});
}
function focusArea(id){const el=document.getElementById(id);el?.scrollIntoView({block:'center',behavior:'instant'});el?.focus({preventScroll:true});}
function dispatch(event){state=transition(state,event);saveEvidence(state.evidence,storage);render();}
function reasonText(reason){return t(...({reinforce:['A smaller step on the same skill','같은 능력을 한 단계 더 연습'],review:['A fresh material for spaced review','새 자료로 간격 복습'],advance:['Apply your skills to a new task','다른 과제로 확장'],variation:['Another version of this task','같은 과제의 새로운 자료'],start:['Start with one clear explanation','한 가지 설명부터 시작']}[reason]||['Next practice','다음 연습']));}
function library(){
 const plan=recommend(learning,progress,currentLesson(state).id),next=resolveLesson(plan.id),family=familyById[selectedFamily];
 const completed=lessons.filter(l=>isCompleted(progress[l.id])).length,doneCore=Object.keys(coreDone).length;
 const bank=lessons.filter(l=>l.type===selectedFamily&&(selectedLevel==='all'||l.level===Number(selectedLevel)));
 return `<section class="page-heading"><div class="eyebrow">KOREAN WRITING LAB</div><h1>${t('Learn a skill. Use it in your own words.','설명법을 배우고, 내 문장으로 써 보세요.')}</h1><p>${t('Short lessons, original practice data, and new versions for another try.','짧은 수업과 기본 자료, 재도전용 새 자료를 연결했습니다.')}</p></section><div class="bank-stats"><div><strong>40</strong><span>${t('core lessons','핵심 수업')} · ${doneCore}/40</span></div><div><strong>300</strong><span>${t('base materials','기본 자료')} · ${completed}/300</span></div><div><strong>6,000</strong><span>${t('additional data variations','추가 자료 변형')}</span></div></div><section class="next-card card"><div><span class="eyebrow">${t('YOUR NEXT STEP','다음 학습')}</span><h2>${esc(tr(familyById[next.type].name))}</h2><p>${reasonText(plan.reason)} · ${esc(next.context)}</p></div><button class="primary" data-action="open" data-id="${next.id}">${t('Start practice','연습 시작')} →</button></section><section class="catalog card"><h2>${t('Choose a skill','설명 유형 선택')}</h2><div class="family-tabs">${families.map(f=>`<button data-action="family" data-id="${f.id}" aria-pressed="${f.id===selectedFamily}">${esc(tr(f.name))}</button>`).join('')}</div><div class="core-grid">${coreLessons.filter(c=>c.family===selectedFamily).map(c=>`<article><span class="mini-label">${c.stage+1} / 4 ${coreDone[c.id]?'· ✓':''}</span><h3>${esc(tr(c.title))}</h3><p>${esc(tr(c.note))}</p><button class="secondary" data-action="core" data-stage="${c.stage}">${t('Open lesson','수업 열기')} →</button></article>`).join('')}</div><p class="scope">${esc(tr(family.trap))}</p></section><section class="bank-list"><div class="bank-title"><h2>${t('Practice bank','문제은행')} · ${esc(tr(family.name))}</h2><label>${t('Practice step','연습 단계')} <select id="bank-level"><option value="all" ${selectedLevel==='all'?'selected':''}>${t('All','전체')}</option>${[1,2,3].map(n=>`<option value="${n}" ${selectedLevel===String(n)?'selected':''}>${n}</option>`).join('')}</select></label></div><p class="scope">${t('Fictional practice data built from 30 contexts and 10 task families. Variations change the data; they are not additional teaching topics.','30개 맥락과 10개 과제로 구성한 가상 연습 자료입니다. 추가 변형은 수치와 배열을 바꾸며, 새로운 수업 주제와는 구분합니다.')}</p><div class="material-grid">${bank.map(l=>`<button class="material-choice card" data-action="open" data-id="${l.id}"><span>${l.baseId.split('-').at(-1)} · ${t('Step','단계')} ${l.level}${isCompleted(progress[l.id])?' · ✓':''}</span><strong>${esc(l.context)}</strong><small>${l.sentenceCount}${t(' sentences','문장')} · ${esc(l.unit)}</small></button>`).join('')}</div></section>`;
}
function chart(l){
 const W=600,H=300,left=55,right=580,top=30,bottom=235,values=l.rows.flatMap(r=>r.values),max=Math.ceil(Math.max(...values)/10)*10,scale=v=>bottom-v/max*(bottom-top),colors=['first','second','third'];
 let marks='';
 if(l.chartKind==='share'){
  let x=left;marks=l.rows.map((r,i)=>{const width=r.values[0]/100*(right-left),s=`<rect class="series-${colors[i]}" x="${x}" y="80" width="${width}" height="65"/><text x="${x+width/2}" y="120" class="share-value">${r.values[0]}%</text>`;x+=width;return s;}).join('');
  marks+=l.rows.map((r,i)=>`<text x="${left}" y="${185+i*28}" class="chart-label share-label">${esc(r.name)} · ${r.values[0]}%</text>`).join('');
 }else{
  marks=[0,.5,1].map(f=>`<line x1="${left}" x2="${right}" y1="${scale(max*f)}" y2="${scale(max*f)}" class="gridline"/><text x="${left-10}" y="${scale(max*f)+5}" class="axis-label">${max*f}</text>`).join('');
  if(l.chartKind==='line'){
   const xs=l.columns.map((_,i)=>left+35+i*(right-left-70)/(l.columns.length-1));
   marks+=`<polyline class="trend-line" points="${xs.map((x,i)=>`${x},${scale(l.rows[0].values[i])}`).join(' ')}"/>`;
   marks+=xs.map((x,i)=>`<circle class="series-second" cx="${x}" cy="${scale(l.rows[0].values[i])}" r="5"/><text x="${x}" y="${scale(l.rows[0].values[i])-12}" class="value-label">${l.rows[0].values[i]}</text><text x="${x}" y="${bottom+30}" class="chart-label">${l.columns[i]}</text>`).join('');
  }else{
   const groupWidth=(right-left)/l.rows.length;
   marks+=l.rows.map((r,index)=>{
    const center=left+groupWidth*(index+.5),width=Math.min(42,groupWidth/(r.values.length+2));
    return r.values.map((v,j)=>{const x=center+(j-r.values.length/2)*width;return `<rect class="series-${colors[j]}" x="${x}" y="${scale(v)}" width="${width-5}" height="${bottom-scale(v)}" rx="3"/><text x="${x+(width-5)/2}" y="${scale(v)-9}" class="value-label">${v}</text>`;}).join('')+`<text x="${center}" y="${bottom+30}" class="chart-label">${esc(r.name)}</text>`;
   }).join('');
  }
 }
 return `<svg class="data-chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(l.context)}"><title>${esc(l.context)} — ${esc(l.rows.map(r=>`${r.name}: ${r.values.join(', ')} ${l.unit}`).join('; '))}</title>${marks}</svg>`;
}
function material(l){return `<details class="material card" id="material" ${materialOpen?'open':''}><summary><span class="eyebrow">${t('01 · READ THE DATA','01 · 자료 읽기')}</span><strong lang="ko">${esc(l.context)}</strong><span class="disclosure">⌄</span></summary><div class="material-content"><div class="legend">${l.columns.map((c,i)=>`<span><i class="key series-${['first','second','third'][i]}"></i>${esc(c)}</span>`).join('')}<small>${t('Unit','단위')}: ${esc(l.unit)}${l.type==='groups'?` · ${l.year}`:''}</small></div>${chart(l)}<table><caption class="sr-only">${t('Exact chart values','자료의 정확한 수치')}</caption><thead><tr><th>${t('Item','항목')}</th>${l.columns.map(c=>`<th>${esc(c)}</th>`).join('')}</tr></thead><tbody>${l.rows.map(r=>`<tr><th scope="row">${esc(r.name)}</th>${r.values.map(v=>`<td>${v}${esc(l.unit)}</td>`).join('')}</tr>`).join('')}</tbody></table><p class="material-note">${t('Fictional data for practice. Use the evidence shown here.','연습용 가상 자료입니다. 표시된 근거로 설명하세요.')}${l.type==='groups'?t(' A and B are two separate groups in the same year.',' A와 B는 같은 해의 서로 다른 집단입니다.'):''}</p><button class="secondary full mobile-write" data-action="write">${t('Ready to write','작성하기')} →</button></div></details>`;}
function teaching(l){if(stage===null)return '';const core=coreLessons.find(c=>c.id===coreId);return `<section class="teaching card"><div class="eyebrow">${stage+1} / 4 · ${esc(tr(familyById[l.type].name))}</div><h2>${esc(tr(phases[stage]))}</h2><p>${esc(tr(core.note))}</p>${stage===2?`<p class="mini-label">${t('Deliberately incorrect example — find the wrong value, then write the full answer below.','일부러 틀린 예시입니다. 잘못된 수치를 찾아 고친 뒤, 아래에 전체 답안을 쓰세요.')}</p><blockquote lang="ko">${esc(l.repairSentence)}.</blockquote><p class="teaching-trap">${esc(tr(l.trap))}</p>`:''}<small>${t('Apply this point to the material below.','아래 자료에 이번 설명법을 적용해 보세요.')}</small></section>`;}
function hints(l){if(!hintStep&&!showModel)return '';return `<section class="hint-box"><span class="mini-label">${showModel?t('Example answer · support used','예시 답안 · 도움 사용'):t(`Hint ${hintStep} of 3`,`힌트 ${hintStep}/3`)}</span><p ${showModel?'lang="ko"':''}>${esc(showModel?(showAlternate?l.alternative:l.model):tr(l.hints[hintStep-1]))}</p>${showModel?`<button class="text-btn" data-action="alternate">${t('See another accepted expression','다른 표현도 보기')}</button>`:''}<small>${t('Your next independent attempt uses a different material.','다음 혼자 적용하기에서는 다른 자료를 사용합니다.')}</small></section>`;}
function feedback(l){
 if(aiMode&&(aiAttempted||ai.result||ai.pending))return ai.card();
 let title=t('Start with the evidence.','근거부터 써 보세요.'),body=t('Describe the requested facts. The basic checker recognises supported sentence patterns; other valid expressions may need AI review.','요구한 사실을 설명해 보세요. 기본 확인은 지원하는 문장 구조를 인식하며, 다른 올바른 표현은 AI 검토가 필요할 수 있습니다.'),buttons='';
 const i=state.issue;
 if(state.phase==='success'){title=t('The requested facts are connected.','필요한 사실이 연결됐어요.');body=t('The supported fact checks passed. This is not a grammar grade or test score.','확인 가능한 사실 조건을 충족했습니다. 문법 전체 평가나 시험 점수는 아닙니다.');buttons=`<button class="primary full" data-action="next">${t('Choose the next step','다음 학습으로')} →</button>`;}
 else if(state.phase==='challenge'){title=t('Judgment is paused.','판단을 보류했어요.');body=t('An unrecognised expression is not a confirmed error. Keep your wording or ask the AI coach when connected.','인식하지 못한 표현을 확정된 오류로 기록하지 않습니다. 내 표현을 유지하거나 연결된 AI 코치에게 물어볼 수 있어요.');buttons=`<button class="secondary full" data-action="resume">${t('Return to writing','작성으로 돌아가기')}</button>`;}
 else if(i){
  if(i.kind==='numbers'){title=t('Check the value and its unit.','수치와 단위를 확인해 보세요.');body=t(`${i.fact}: expected evidence ${i.values?.join(' → ')} ${i.unit||''}.`,`${i.fact}: 확인할 수치는 ${i.values?.join(' → ')} ${i.unit||''}입니다.`);}
  else if(i.kind==='period'){title=t('Reconnect the years and values.','연도와 수치를 다시 연결해 보세요.');body=t(`This statement needs ${i.years.join(', ')}.`,`이 내용에는 ${i.years.join(', ')}년이 연결되어야 합니다.`);}
  else if(i.kind==='direction'){title=t('Which way did the value move?','어느 방향으로 변했나요?');body=`${i.fact}: ${i.from} → ${i.to} ${i.unit}`;buttons=`<div class="choices"><button data-action="probe" data-value="up">${t('Increase','증가')}</button><button data-action="probe" data-value="down">${t('Decrease','감소')}</button></div>${state.probe?`<p>${state.probe==='correct'?t('Yes. Now revise the sentence.','맞아요. 이제 문장을 고쳐 보세요.'):t('Compare the start and end values once more.','처음과 끝의 크기를 다시 비교해 보세요.')}</p>`:''}`;}
  else if(i.kind==='missing'){title=t('One part of the task is missing.','필요한 설명이 빠져 있어요.');body=t(`Check the instruction for ${i.fact}.`,`과제에서 요구한 ${i.fact} 설명을 확인해 보세요.`);}
  else if(i.kind==='cause'){title=t('Use only a supported reason.','이유에도 근거가 필요해요.');body=t('This material supplies values, but it does not supply a cause.','이 자료에는 수치가 있지만 그 원인은 제시되어 있지 않습니다.');}
  else{title=t('This wording needs another look.','이 표현은 더 살펴봐야 해요.');body=t('The local checker has not confirmed this phrasing. It has not marked your Korean wrong. Compare a hint, revise, or use AI help if connected.','기본 확인으로 이 표현을 확정하지 못했습니다. 한국어가 틀렸다는 뜻은 아닙니다. 힌트를 비교하거나 문장을 고치고, 연결된 AI 도움을 사용할 수 있어요.');}
  buttons+=`<button class="text-btn" data-action="challenge">${t('I disagree with the feedback','피드백에 동의하지 않아요')}</button>`;
 }
 return `<aside class="coach card"><div class="coach-top"><span class="avatar">쓰</span><div><strong>${t('Your writing guide','나의 쓰기 안내')}</strong><small>${t('Basic · no API request','기본 · API 호출 없음')}</small></div></div><div id="feedback" tabindex="-1" aria-live="polite"><h2>${esc(title)}</h2><p>${esc(body)}</p>${buttons}</div></aside>`;
}
function lessonView(){const l=currentLesson(state);return `<div class="lesson-heading"><div><div class="eyebrow">${esc(tr(familyById[l.type].name))} · ${l.variant?t(`Variation ${l.variant}`,`추가 변형 ${l.variant}`):t(`Base material ${l.baseId.split('-').at(-1)}`,`기본 자료 ${l.baseId.split('-').at(-1)}`)}</div><h1>${t('Make the relationship clear.','자료의 관계를 분명하게.')}</h1><p>${esc(tr(l.instruction))}</p></div><button class="quiet" data-action="library">${t('Back to the course','수업 목록')}</button></div>${teaching(l)}${ai.enabled?`<div class="feedback-mode"><div><strong>${t('Use AI when needed','필요한 경우 AI 도움')}</strong><p>${t('Known fact checks are handled locally. Unrecognised wording goes to AI only when this is enabled.','확인 가능한 사실은 기본 기능으로 처리합니다. 이 기능을 켜면 인식하지 못한 표현을 AI가 검토합니다.')}</p></div><button class="secondary" data-action="ai-toggle" aria-pressed="${aiMode}" ${ai.pending?'disabled':''}>${aiMode?t('AI help on','AI 도움 켜짐'):t('AI help off','AI 도움 꺼짐')}</button></div>`:''}<div class="workspace">${material(l)}<div class="work-stack"><section class="writing card"><div class="writing-head"><h2>${t('Your explanation','나의 설명')}</h2><span class="pill">${l.sentenceCount}${t(' sentences','문장')} · ${t('Step','단계')} ${l.level}</span></div><label class="sr-only" for="answer">${t('Your Korean answer','나의 한국어 답안')}</label><textarea id="answer" lang="ko" maxlength="1500" placeholder="${esc(l.rows[0].name)}…" ${state.phase==='success'||ai.pending?'readonly':''}>${esc(draft)}</textarea><div class="editor-meta"><span>${t('Your draft stays in this tab until a reload.','새로고침 전까지 이 탭에서 답안을 유지합니다.')}</span><span id="count">${draft.length} / 1500</span></div><div class="help-row"><button data-action="hint" ${ai.pending?'disabled':''}>${t('Next hint','단계별 힌트')} ${Math.min(hintStep+1,3)}/3</button><button data-action="model" ${ai.pending?'disabled':''}>${t('Example answer','예시 답안')}</button></div>${hints(l)}${notice?`<p class="notice">${esc(notice)}</p>`:''}<div class="writing-actions"><span>Ctrl / ⌘ + Enter</span><button class="primary" data-action="submit" ${ai.pending||state.phase==='success'?'disabled':''}>${ai.pending?t('Reading…','읽는 중…'):state.phase==='success'?t('Completed ✓','완료 ✓'):t('Check my writing','내 글 확인')} →</button></div></section>${feedback(l)}</div></div>`;}
function completion(){const plan=recommend(learning,progress,currentLesson(state).id),next=resolveLesson(plan.id);return `<section class="completion card"><span class="eyebrow">${t('ONE STEP COMPLETE','한 단계 완료')}</span><h1>${t('Now try it in a new context.','새로운 자료에서도 써 보세요.')}</h1><p>${state.support?t('You used support. Another small step helps you apply the skill yourself.','도움을 받아 완성했습니다. 작은 단계로 다시 적용하며 혼자 쓰는 힘을 길러요.'):t('You completed this task independently. The next task extends or revisits your practice.','이번 과제를 혼자 완성했습니다. 다음 과제로 설명법을 넓히거나 복습해요.')}</p><p>${reasonText(plan.reason)}<br>${esc(tr(familyById[next.type].name))} · ${esc(next.context)}</p><div class="actions"><button class="primary" data-action="open" data-id="${next.id}">${t('Recommended next task','추천 문제')} →</button><button class="secondary" data-action="variant">${t('New data, same skill','같은 유형의 새 자료')}</button><button class="quiet" data-action="library">${t('Browse the course','수업 목록')}</button></div></section>`;}
function records(){const summary=learningSummary(learning);return `<div class="page-heading"><h1>${t('Your practice history','나의 학습 기록')}</h1><p>${t('Records describe practice, not a test score or proven mastery. Your answers are not stored.','연습 기록이며 시험 점수나 숙달 판정이 아닙니다. 답안 내용은 저장하지 않습니다.')}</p></div><div class="record-grid">${summary.map(s=>`<article class="card record"><h2>${esc(nameFor(s.skill))}</h2><p>${s.practices}${t(' recent practice records','개의 최근 연습 기록')} · ${s.independent}${t(' independent','회 혼자 완성')}</p><span class="pill">${s.ready?t('Ready to revisit','다시 연습할 시간'):t('Keep practising','연습 중')}</span></article>`).join('')}</div><button class="primary" data-action="library">${t('Choose another task','다음 과제 선택')}</button>`;}
function render(){
 document.documentElement.lang=language;
 document.querySelector('[data-action="lesson"]').textContent=t('My practice','내 연습');document.querySelector('[data-action="records"]').textContent=t('Progress','학습 기록');document.querySelector('[data-action="library"]').textContent=t('Course','수업 목록');
 const lang=document.querySelector('#language');lang.textContent=t('한국어','English');lang.disabled=ai.pending;
 document.querySelector('#footer-tagline').textContent=t('Small steps. Your own Korean words.','작은 문장부터, 혼자 쓰는 힘까지.');
 document.querySelector('#about-button').textContent=t('About this course','수업 안내');
 document.querySelector('#operator-entry').innerHTML='';
 document.querySelectorAll('.nav').forEach(el=>el.classList.toggle('active',el.dataset.action===view));
 app.innerHTML=view==='library'?library():view==='records'?records():state.phase==='complete'?completion():lessonView();
 document.querySelector('#answer')?.addEventListener('input',e=>{draft=e.target.value;document.querySelector('#count').textContent=`${draft.length} / 1500`;});
 document.querySelector('#material')?.addEventListener('toggle',e=>{materialOpen=e.target.open;});
 document.querySelector('#bank-level')?.addEventListener('change',e=>{selectedLevel=e.target.value;render();});
}
async function submit(){
 if(ai.pending||state.phase==='success')return;
 const l=currentLesson(state),result=analyze(draft,l);
 if(['empty','long'].includes(result.type)){notice=t('Write a Korean explanation of 5–1500 characters.','5~1500자의 한국어 설명을 써 주세요.');render();return;}
 notice='';
 if(aiMode&&ai.enabled&&result.issues?.some(i=>i.kind==='uncertain')){aiAttempted=true;await ai.ask();return;}
 aiAttempted=false;ai.reset();state=transition(state,{type:'SUBMIT',text:draft});saveEvidence(state.evidence,storage);
 if(state.phase==='success')markOutcome(state.support?'assisted':'independent','local');
 else{const kind=state.issue.kind,skill=({missing:'coverage',cause:'grounding',uncertain:'expression'})[kind]||kind;markOutcome(kind==='uncertain'?'deferred':'practice','local',[skill]);}
 render();focusArea('feedback');
}
document.addEventListener('click',e=>{
 const b=e.target.closest('[data-action]');if(!b||b.disabled)return;const action=b.dataset.action;
 if(ai.pending&&!['records','lesson','library'].includes(action))return;
 if(action==='open'){openLesson(b.dataset.id);return;}
 if(action==='core'){const s=Number(b.dataset.stage),options=lessons.filter(l=>l.type===selectedFamily);const candidate=options.find(l=>!isCompleted(progress[l.id]))||options[0];openLesson(candidate.id,s);return;}
 if(action==='family'){selectedFamily=b.dataset.id;render();return;}
 if(['library','records','lesson'].includes(action)){view=action;render();return;}
 if(action==='language'){language=language==='en'?'ko':'en';try{storage.setItem('sseugi-language',language);}catch{}render();return;}
 if(action==='submit'){submit();return;}
 if(action==='hint'){hintStep=Math.min(3,hintStep+1);dispatch({type:'HELP',level:2});return;}
 if(action==='model'){showModel=true;dispatch({type:'HELP',level:3});return;}
 if(action==='alternate'){showAlternate=!showAlternate;render();return;}
 if(action==='next'){state.phase='complete';render();window.scrollTo({top:0});return;}
 if(action==='variant'){const l=currentLesson(state),v=firstUnusedVariant(l.baseId,progress);openLesson(variantOf(l.id,v).id);return;}
 if(action==='probe'){dispatch({type:'PROBE',answer:b.dataset.value});return;}
 if(action==='challenge'){markOutcome('deferred','local',['expression']);dispatch({type:'CHALLENGE'});return;}
 if(action==='resume'){dispatch({type:'RESUME'});return;}
 if(action==='write'){if(matchMedia('(max-width:700px)').matches)document.querySelector('#material')?.removeAttribute('open');focusArea('answer');return;}
 if(action==='ai-toggle'){aiMode=!aiMode;ai.reset();render();return;}
 if(action==='about'){const dialog=document.querySelector('#about');dialog.innerHTML=`<form method="dialog"><button class="close" aria-label="Close">×</button></form><h2>${t('Chart explanations, one skill at a time','자료 설명을 한 가지씩')}</h2><p>${t('40 short lessons in 10 families, 300 base exercises, and 6,000 deterministic data variations. All data is fictional. A variation is a new practice dataset, not a new teaching topic.','10개 유형의 짧은 수업 40개, 기본 문제 300개, 규칙으로 구성하는 추가 자료 6,000개입니다. 모든 자료는 가상입니다. 변형 자료는 새 수업 주제가 아니라 추가 연습입니다.')}</p><p>${t('Basic feedback covers supported factual sentence patterns. It cannot grade arbitrary Korean or award TOPIK scores. Optional AI help can review other expressions; it can also be mistaken.','기본 피드백은 지원하는 문장 구조의 사실을 확인합니다. 자유로운 한국어 전체를 채점하거나 TOPIK 점수를 주지 않습니다. 선택한 AI 도움은 다른 표현을 검토하며, 오류가 있을 수 있습니다.')}</p><p>${t('Answers and chat stay in this tab. Content-free practice records and language preferences stay in your browser.','답안과 대화는 이 탭에만 남습니다. 답안 내용이 없는 학습 기록과 언어 설정만 브라우저에 저장됩니다.')}</p>`;dialog.showModal();}
});
document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key==='Enter'&&e.target.id==='answer'){e.preventDefault();submit();}});
render();ai.refresh();
