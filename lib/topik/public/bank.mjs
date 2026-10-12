import {topics,families,familyById} from './curriculum.mjs';
export const BANK_VERSION='4';
export const VARIANTS_PER_BASE=20;
const batchim=s=>{const c=s.at(-1).charCodeAt(0)-0xac00;return c>=0&&c<=11171&&c%28!==0;};
const p=(s,a='은',b='는')=>s+(batchim(s)&&!(a==='으로'&&(s.at(-1).charCodeAt(0)-0xac00)%28===8)?a:b);
const n=(v,u)=>`${v}${u}`;
const consonantUnit=u=>u==='kg'||batchim(u);
const toValue=(v,u)=>`${n(v,u)}${consonantUnit(u)?'으로':'로'}`;
const past=(v,u)=>`${n(v,u)}${consonantUnit(u)?'이었다':'였다'}`;
const rotate=(a,k)=>a.slice(k%a.length).concat(a.slice(0,k%a.length));
function claim(kind,subject,forms,numbers,extra={}){return {kind,subject,forms,numbers,...extra};}
function change(name,from,to,years,unit){
 const dir=to>from?'증가':to<from?'감소':'동일';
 if(dir==='동일')return claim('stable',name,[`${p(name)} ${years[0]}년과 ${years[1]}년에 모두 ${toValue(from,unit)} 동일했다`,`${p(name)} ${years[0]}년과 ${years[1]}년에 ${toValue(from,unit)} 변화가 없었다`],[from],{years,unit,from,to});
 const verb=dir==='증가'?'늘었다':'줄었다';
 return claim('direction',name,[`${p(name)} ${years[0]}년 ${n(from,unit)}에서 ${years[1]}년 ${toValue(to,unit)} ${dir}했다`,`${years[0]}년 ${n(from,unit)}${consonantUnit(unit)?'이었던':'였던'} ${p(name)} ${years[1]}년 ${toValue(to,unit)} ${verb}`],[from,to],{years,unit,from,to});
}
function extreme(item,year,unit,high,share=false){
 const rel=share?(high?'컸다':'작았다'):(high?'높았다':'낮았다');
 return claim('relation',item.name,[`${year}년 ${share?`${item.name}의 비율은`:p(item.name)} ${toValue(item.value,unit)} 가장 ${rel}`,`${year}년에 가장 ${high?'높은':'낮은'} ${share?'비율을 차지한':'값을 보인'} 항목은 ${p(item.name,'으로','로')} ${past(item.value,unit)}`],[item.value],{years:[year],unit,relation:high?'high':'low'});
}
function valueClaim(item,year,unit){return claim('numbers',item.name,[`${year}년 ${item.name}의 수치는 ${past(item.value,unit)}`,`${p(item.name)} ${year}년에 ${past(item.value,unit)}`],[item.value],{years:[year],unit});}
function gapClaim(a,b,gap,unit){return claim('calculation',`${a}·${b}`,[`${p(a,'과','와')} ${b}의 차이는 ${past(gap,unit)}`,`두 항목의 차이는 ${past(gap,unit)}`],[gap],{unit});}

function make(family,topicIndex,variant=0){
 const f=familyById[family],topic=topics[topicIndex];
 if(!f||!topic||!Number.isInteger(variant)||variant<0||variant>VARIANTS_PER_BASE)return null;
 const k=topicIndex+variant*7,scale=10+(topicIndex%3)*5,unit=topic.unit;
 const names=rotate(topic.names,(topicIndex+variant)%3),[a,b,c]=names;
 const base=40+topicIndex*3+variant*11,step=10+(k%7)*3;
 const years=[2021+variant%3,2024+variant%3],year=years[1];
 let columns=[],rows=[],claims=[],instruction,chartKind='bars';
 if(['change','stable','delta','reverse'].includes(family)){
  let av=[base,base+step],bv=[base+scale*3,base+scale*3-step-2];
  if(family==='change'){
   const shape=k%4;if(shape===1)av=[base+step,base];if(shape===2)bv=[base+scale*3,base+scale*3+step+5];if(shape===3){av=[base+step,base];bv=[base+scale*3,base+scale*3+step+5];}
  }
  if(family==='stable'){if(k%2)bv=[base+scale*3,base+scale*3];else av=[base,base];}
  if(family==='delta'){av=[base,base+step+scale];bv=[base+scale*3,base+scale*3+step];if(k%2){av=[base,base+step];bv=[base+scale*3,base+scale*3+step+scale];}}
  if(family==='reverse'){av=[base,base+scale*5];bv=[base+scale*3,base+scale*4];if(k%2)[av,bv]=[bv,av];}
  columns=years.map(String);rows=[{name:a,values:av},{name:b,values:bv}];
  if(family==='reverse'){
   claims=years.map((y,i)=>{const high=av[i]>bv[i]?a:b,low=high===a?b:a,hv=high===a?av[i]:bv[i],lv=low===a?av[i]:bv[i];return claim('comparison',`${a}·${b}`,[`${y}년에는 ${p(high,'이','가')} ${toValue(hv,unit)} ${n(lv,unit)}인 ${low}보다 높았다`,`${y}년에는 ${p(low,'이','가')} ${toValue(lv,unit)} ${n(hv,unit)}인 ${high}보다 낮았다`],[hv,lv],{years:[y],unit,high,low});});
   claims.push(claim('relation',`${a}·${b}`,['두 항목의 순위가 역전되었다','두 항목의 순위가 바뀌었다'],[]));
   instruction={en:'Compare the items in each year, then explain the reversal in three sentences.',ko:'두 시점의 우위를 각각 비교한 뒤 순위의 역전을 세 문장으로 설명하세요.'};
  }else{
   claims=rows.map(r=>change(r.name,...r.values,years,unit));
   if(family==='delta'){const d=rows.map(r=>r.values[1]-r.values[0]),index=d[0]>d[1]?0:1;claims.push(claim('calculation',rows[index].name,[`${rows[index].name}의 증가 폭은 ${toValue(d[index],unit)} 더 컸다`,`${rows[index].name}의 증가량은 ${toValue(d[index],unit)} 더 많았다`],[d[index]],{unit}));}
   instruction={en:family==='delta'?'Report both changes, then name the item with the larger absolute increase and give its increase.':'Describe both rows with the time points, values and whether each changed.',ko:family==='delta'?'두 대상의 변화를 쓰고, 증가 폭이 더 큰 항목과 그 증가량을 설명하세요.':'두 대상의 시점·수치와 변화 여부를 설명하세요.'};
  }
 }else if(['ranking','share','gap','paragraph'].includes(family)){
  let vals=family==='share'?[48+k%10,31-k%7,0]:[base+step*3,base+step,base];if(family==='share')vals[2]=100-vals[0]-vals[1];
  vals=rotate(vals,k%3);const items=names.map((name,i)=>({name,value:vals[i]}));
  if(family==='gap')items.splice(2,1);
  columns=[String(year)];rows=items.map(x=>({name:x.name,values:[x.value]}));
  const sorted=[...items].sort((x,y)=>y.value-x.value),top=sorted[0],bottom=sorted.at(-1),u=family==='share'?'%':unit;
  claims=family==='gap'?items.map(x=>valueClaim(x,year,u)):[extreme(top,year,u,true,family==='share'),extreme(bottom,year,u,false,family==='share')];
  if(['gap','paragraph'].includes(family))claims.push(gapClaim(top.name,bottom.name,top.value-bottom.value,u));
  if(family==='paragraph')claims.unshift(claim('introduction',topic.title,[`이 자료는 ${year}년의 ${topic.title} 현황을 보여준다`,`${year}년의 ${topic.title} 현황을 나타낸 자료이다`],[],{years:[year]}));
  if(family==='share')chartKind='share';
  instruction={en:family==='gap'?'Report both values and their absolute difference in three sentences.':family==='paragraph'?'Write four sentences: introduce the material, report the highest and lowest values, then compare their gap.':`Describe the largest and smallest ${family==='share'?'shares':'values'} with their time point and numbers.`,ko:family==='gap'?'두 항목의 수치와 절대적인 차이를 세 문장으로 쓰세요.':family==='paragraph'?'자료 소개, 최고값, 최저값, 그 격차를 네 문장으로 쓰세요.':`${family==='share'?'비율':'수치'}이 가장 큰 항목과 작은 항목을 시점과 함께 설명하세요.`};
 }else if(family==='trend'){
  const ys=[years[0],years[0]+1,years[1]],shapes=[[base,base+step*2,base+step],[base+step*2,base,base+step],[base,base+step,base+step*3],[base+step*3,base+step,base]],vals=shapes[k%4];
  columns=ys.map(String);rows=[{name:a,values:vals}];chartKind='line';
  const ix=vals.indexOf(Math.max(...vals));
  claims=[change(a,vals[0],vals[1],ys.slice(0,2),unit),change(a,vals[1],vals[2],ys.slice(1),unit),claim('relation',a,[`세 시점 중 ${ys[ix]}년의 ${p(a)} ${toValue(vals[ix],unit)} 가장 높았다`,`${a}의 수치는 ${ys[ix]}년에 ${toValue(vals[ix],unit)} 가장 높았다`],[vals[ix]],{years:[ys[ix]],unit,relation:'high'})];
  instruction={en:'Describe the two intervals separately, then name the peak year and value. Use three sentences.',ko:'두 구간의 변화를 각각 설명하고 최고 시점과 수치를 밝히세요. 세 문장으로 씁니다.'};
 }else if(family==='groups'){
  columns=['A집단','B집단'];rows=[{name:a,values:[base,base+step]},{name:b,values:[base+step*2,base+step]}];if(k%2)rows.forEach(r=>r.values.reverse());
  claims=rows.map(r=>{const high=r.values[0]>r.values[1]?'A집단':'B집단';return claim('comparison',r.name,[`${year}년 ${p(r.name)} A집단이 ${n(r.values[0],unit)}, B집단이 ${toValue(r.values[1],unit)} ${p(high,'이','가')} 높았다`,`${year}년 ${r.name}의 수치는 A집단 ${n(r.values[0],unit)}, B집단 ${toValue(r.values[1],unit)} ${p(high,'이','가')} 더 컸다`],r.values,{years:[year],unit,high});});
  instruction={en:'Compare the two groups for each item in the same year. State both values and the group with the larger value.',ko:'같은 해의 두 집단을 항목별로 비교하세요. 두 수치와 더 큰 값을 가진 집단을 밝히세요.'};
 }
 const baseId=`b4-${family}-${String(topicIndex+1).padStart(2,'0')}`,id=variant?`${baseId}-v${String(variant).padStart(2,'0')}`:baseId;
 const repairClaim=claims.find(c=>c.numbers.length), repairNumber=repairClaim.numbers[0];
 const repairSentence=repairClaim.forms[0].replace(`${repairNumber}${repairClaim.unit}`,`${repairNumber+7}${repairClaim.unit}`);
 const level=1+Math.floor(topicIndex/10),measure=family==='share'?'%':unit;
 const model=claims.map(c=>c.forms[0]+'.').join(' '),alternative=claims.map(c=>c.forms.at(-1)+'.').join(' ');
 return {repairSentence,id,baseId,variant,type:family,level,title:f.name.ko,context:`${topic.title}${family==='share'?' 구성 비율':''}`,unit:measure,year,columns,rows,chartKind,claims,model,alternative,instruction,task:instruction.ko,focusSkills:f.skills,sentenceCount:claims.length,starter:claims[0].forms[0].replace(/\d+/g,'___'),hints:[f.notes[0],f.notes[1],f.expressions],trap:f.trap,fictional:true};
}
export const lessons=families.flatMap(f=>topics.map((_,i)=>make(f.id,i)));
const lookup=new Map(lessons.map(l=>[l.id,l]));
export function resolveLesson(id){
 if(typeof id!=='string')return null;
 if(lookup.has(id))return lookup.get(id);
 const m=/^b4-([a-z]+)-(\d{2})-v(\d{2})$/.exec(id);if(!m)return null;
 const base=lookup.get(`b4-${m[1]}-${m[2]}`),variant=Number(m[3]);return base&&variant>=1&&variant<=VARIANTS_PER_BASE?make(m[1],Number(m[2])-1,variant):null;
}
export function variantOf(id,index){const base=resolveLesson(id);return base?make(base.type,Number(base.baseId.split('-').at(-1))-1,index):null;}
export function inspectMaterial(l){
 const problems=[];
 if(!l||!l.rows.length||!l.claims.length)return ['Missing content'];
 for(const row of l.rows)if(row.values.length!==l.columns.length||row.values.some(v=>!Number.isFinite(v)||v<0))problems.push('Invalid table');
 if(l.type==='share'&&l.rows.reduce((sum,r)=>sum+r.values[0],0)!==100)problems.push('Shares must sum to 100');
 if(new Set(l.rows.map(r=>r.name)).size!==l.rows.length)problems.push('Duplicate subjects');
 if(l.type==='reverse'&&(l.rows[0].values[0]-l.rows[1].values[0])*(l.rows[0].values[1]-l.rows[1].values[1])>=0)problems.push('No reversal');
 if(l.type==='stable'&&!l.rows.some(r=>r.values[0]===r.values[1]))problems.push('No unchanged row');
 if(l.type==='delta'&&l.rows.some(r=>r.values[1]<=r.values[0]))problems.push('Increase expected');
 return problems;
}
