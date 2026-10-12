"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./page.module.css";

type Item = { title: string; type: string; unit: string; columns: string[]; rows: { name: string; values: number[] }[]; prompt: string; model: string; facts: string[][]; hint: string };
type Focus = "subject" | "number" | "relationship";
type Profile = { completed: number[]; attempts: number; focus: Record<Focus, number> };
const emptyProfile: Profile = { completed: [], attempts: 0, focus: { subject: 0, number: 0, relationship: 0 } };
const profileKey = "sseugi-public-coach-v1";

const items: Item[] = [
  { title:"Library loans", type:"Change", unit:"loans", columns:["2022","2025"], rows:[{name:"E-books",values:[20,50]},{name:"Printed books",values:[80,60]}], prompt:"Write two Korean sentences. Include both years, values, and directions.", model:"전자책 대출은 2022년 20건에서 2025년 50건으로 증가했다. 종이책 대출은 같은 기간 80건에서 60건으로 감소했다.", facts:[["전자책","20","50","증가"],["종이책","80","60","감소"]], hint:"Use 에서 for the starting value and 으로 for the ending value." },
  { title:"Weekend classes", type:"Highest and lowest", unit:"people", columns:["2025"], rows:[{name:"Cooking",values:[48]},{name:"Photography",values:[31]},{name:"Drawing",values:[21]}], prompt:"State the highest and lowest values in two Korean sentences.", model:"2025년에 요리 수업은 48명으로 가장 높았다. 그림 수업은 21명으로 가장 낮았다.", facts:[["요리","48","가장 높"],["그림","21","가장 낮"]], hint:"가장 높았다 and 가장 낮았다 are useful comparison endings." },
  { title:"Transport choices", type:"Share", unit:"%", columns:["2025"], rows:[{name:"Bus",values:[48]},{name:"Subway",values:[31]},{name:"Bicycle",values:[21]}], prompt:"Describe the largest and smallest shares in Korean.", model:"버스의 비율은 48%로 가장 컸다. 자전거의 비율은 21%로 가장 작았다.", facts:[["버스","48","가장 컸"],["자전거","21","가장 작"]], hint:"For a percentage, write 비율 and the % sign or 퍼센트." },
  { title:"Museum visitors", type:"Trend", unit:"visitors", columns:["2022","2023","2024"], rows:[{name:"Visitors",values:[30,55,42]}], prompt:"Explain both changes and identify the peak year in three sentences.", model:"방문객 수는 2022년 30명에서 2023년 55명으로 증가했다. 2023년 55명에서 2024년 42명으로 감소했다. 2023년의 방문객 수가 가장 높았다.", facts:[["2022","30","2023","55","증가"],["2023","55","2024","42","감소"],["2023","55","가장 높"]], hint:"Treat each interval separately before naming the highest point." },
  { title:"Community centre visits", type:"Difference", unit:"visits", columns:["2025"], rows:[{name:"Gym",values:[67]},{name:"Pool",values:[42]}], prompt:"Give both values, then the difference, in three sentences.", model:"체육관 이용은 67건이었다. 수영장 이용은 42건이었다. 두 시설의 차이는 25건이었다.", facts:[["체육관","67"],["수영장","42"],["차이","25"]], hint:"Subtract the smaller value from the larger one." },
  { title:"Book club attendance", type:"No change", unit:"people", columns:["2022","2025"], rows:[{name:"Novel club",values:[40,40]},{name:"Poetry club",values:[25,38]}], prompt:"Describe the unchanged row and the changing row.", model:"소설 모임은 2022년과 2025년에 모두 40명으로 동일했다. 시 모임은 25명에서 38명으로 증가했다.", facts:[["소설","40","동일"],["시","25","38","증가"]], hint:"Equal endpoints support 동일했다 or 변화가 없었다." },
  { title:"Two neighbourhoods", type:"Groups", unit:"people", columns:["Area A","Area B"], rows:[{name:"Korean class",values:[28,44]},{name:"Computer class",values:[51,35]}], prompt:"Compare the two groups for both rows.", model:"한국어 수업은 A지역이 28명, B지역이 44명으로 B지역이 더 높았다. 컴퓨터 수업은 A지역이 51명, B지역이 35명으로 A지역이 더 높았다.", facts:[["한국어","28","44","B"],["컴퓨터","51","35","A"]], hint:"The columns are groups, not years. Do not write 증가했다." },
  { title:"Programme growth", type:"Larger increase", unit:"registrations", columns:["2022","2025"], rows:[{name:"Language course",values:[30,65]},{name:"Art course",values:[50,72]}], prompt:"Describe both changes and say which increase was larger.", model:"언어 수업은 30명에서 65명으로 증가했다. 미술 수업은 50명에서 72명으로 증가했다. 언어 수업의 증가 폭은 35명으로 더 컸다.", facts:[["언어","30","65","증가"],["미술","50","72","증가"],["언어","35","더 컸"]], hint:"Compare each increase, not just the final values." },
  { title:"Seasonal orders", type:"Reversal", unit:"orders", columns:["2022","2025"], rows:[{name:"Online",values:[36,68]},{name:"In-store",values:[60,55]}], prompt:"Compare the two items in each year and explain the reversal.", model:"2022년에는 매장 주문이 60건으로 온라인 주문 36건보다 높았다. 2025년에는 온라인 주문이 68건으로 매장 주문 55건보다 높았다. 두 주문 방식의 순위가 바뀌었다.", facts:[["2022","매장","60","온라인","36"],["2025","온라인","68","매장","55"],["순위","바뀌"]], hint:"State the comparison once for each year before using 순위가 바뀌었다." },
  { title:"Workshop summary", type:"Short paragraph", unit:"people", columns:["2025"], rows:[{name:"Design",values:[62]},{name:"Writing",values:[47]},{name:"Coding",values:[29]}], prompt:"Write four sentences: introduce the chart, highest, lowest, and the gap.", model:"이 자료는 2025년 워크숍 참가 현황을 보여준다. 디자인 수업은 62명으로 가장 높았다. 코딩 수업은 29명으로 가장 낮았다. 두 수업의 차이는 33명이었다.", facts:[["2025","워크숍"],["디자인","62","가장 높"],["코딩","29","가장 낮"],["차이","33"]], hint:"A short paragraph has one job per sentence. Do not add causes that the chart cannot show." },
];

const normalize=(text:string)=>text.normalize("NFKC").replace(/\s/g,"").replace(/퍼센트/g,"%").replace(/늘었다|늘어났다/g,"증가").replace(/줄었다|줄어들었다/g,"감소");
const has=(answer:string,word:string)=>normalize(answer).includes(normalize(word));

export default function SseugiPractice(){
 const [index,setIndex]=useState(0),[answer,setAnswer]=useState(""),[result,setResult]=useState<"idle"|"pass"|"review">("idle"),[hint,setHint]=useState(false),[showModel,setShowModel]=useState(false),[profile,setProfile]=useState<Profile>(emptyProfile),[ready,setReady]=useState(false);
 const item=items[index];
 const complete=useMemo(()=>item.facts.every(group=>group.every(word=>has(answer,word))),[answer,item]);
 const missing=useMemo(()=>item.facts.flat().filter(word=>!has(answer,word)),[answer,item]);
 const focus=useMemo<Focus>(()=>{
   if(missing.some(word=>/^\d+$/.test(word))) return "number";
   if(missing.some(word=>["증가","감소","동일","가장 높","가장 낮","가장 컸","가장 작","더 컸","바뀌","차이"].some(signal=>word.includes(signal)))) return "relationship";
   return "subject";
 },[missing]);
 const focusLabel: Record<Focus,string>={subject:"the subject",number:"the numbers",relationship:"the comparison"};
 const persist=(next:Profile)=>{setProfile(next);try{localStorage.setItem(profileKey,JSON.stringify(next));}catch{}};
 useEffect(()=>{try{const saved=JSON.parse(localStorage.getItem(profileKey)||"null");if(saved&&Array.isArray(saved.completed)&&Number.isInteger(saved.attempts)&&saved.focus&&["subject","number","relationship"].every(key=>Number.isInteger(saved.focus[key])))setProfile({completed:saved.completed.filter((n:number)=>Number.isInteger(n)&&n>=0&&n<items.length),attempts:saved.attempts,focus:saved.focus});}catch{}setReady(true);},[]);
 const check=()=>{const passed=complete;const next={...profile,attempts:profile.attempts+1,completed:passed?[...new Set([...profile.completed,index])]:profile.completed,focus:{...profile.focus,[focus]:profile.focus[focus]+(passed?0:1)}};persist(next);setResult(passed?"pass":"review");};
 const next=()=>{const priority:Record<Focus,number[]>={number:[4,0,3,7],subject:[6,9,1],relationship:[1,2,8,5]};const biggest=(Object.keys(profile.focus) as Focus[]).sort((a,b)=>profile.focus[b]-profile.focus[a])[0];const candidate=priority[biggest].find(n=>!profile.completed.includes(n)&&n!==index)??items.findIndex((_,n)=>!profile.completed.includes(n)&&n!==index);setIndex(candidate>=0?candidate:(index+1)%items.length);setAnswer("");setResult("idle");setHint(false);setShowModel(false);window.scrollTo({top:0,behavior:"smooth"});};
 return <>
   <section className={styles.academicLab}>
    <p className={styles.eyebrow}>OPTIONAL ACADEMIC WRITING LAB</p><p className={styles.status}>Free browser-only practice · no account</p>
    <h2>Describe data in Korean.</h2>
    <p className={styles.intro}>For learners who also need charts and reports: read a small chart, write what it shows, then check the evidence. Your answer stays in this browser.</p>
    <a className={styles.secondary} href="#practice">Open the data-writing lab</a>
   </section>
   <section id="practice" className={styles.practice} aria-labelledby="practice-title">
    <div className={styles.lessonHeader}><div><p className={styles.eyebrow}>LESSON {String(index+1).padStart(2,"0")} / {items.length}</p><h2 id="practice-title">{item.type}: {item.title}</h2><p>{item.prompt}</p></div><div className={styles.progress}><span className={styles.badge}>{item.unit}</span><small>{ready?`${profile.completed.length} of ${items.length} completed in this browser`:"Preparing your practice path"}</small></div></div>
    <div className={styles.grid}><article className={styles.material}><h3>Read the evidence</h3><table><caption>{item.title} practice data</caption><thead><tr><th>Item</th>{item.columns.map(c=><th key={c}>{c}</th>)}</tr></thead><tbody>{item.rows.map(row=><tr key={row.name}><th>{row.name}</th>{row.values.map((v,i)=><td key={i}>{v}{item.unit==="%"?"%":""}</td>)}</tr>)}</tbody></table><p className={styles.note}>Fictional data for practice. Use only the evidence shown here.</p></article>
     <article className={styles.writer}><h3>Write in Korean</h3><textarea value={answer} onChange={e=>{setAnswer(e.target.value);setResult("idle");}} maxLength={1500} placeholder="한국어로 설명해 보세요." aria-label="Your Korean answer"/><div className={styles.count}>{answer.length} / 1500</div><div className={styles.actions}><button type="button" className={styles.secondary} onClick={()=>setHint(true)}>Hint</button><button type="button" className={styles.primary} onClick={check}>Check evidence →</button></div>
     {hint&&<aside className={styles.hint}><strong>Hint</strong><p>{item.hint}</p></aside>}
     {result==="pass"&&<aside className={styles.success}><strong>You included the key evidence.</strong><p>This checks required facts only. It does not grade every part of your Korean. Your next practice will use your browser-only progress to choose a useful contrast.</p><button type="button" className={styles.primary} onClick={next}>Personalized next practice →</button></aside>}
     {result==="review"&&<aside className={styles.review}><strong>Start with {focusLabel[focus]}.</strong><p>For this attempt, the evidence checker could not find: {missing.join(", ")}. Different correct Korean expressions are possible, so this is a guide rather than a grammar verdict.</p><button type="button" className={styles.linkButton} onClick={()=>setShowModel(!showModel)}>{showModel?"Hide example":"See one example"}</button>{showModel&&<p lang="ko" className={styles.model}>{item.model}</p>}</aside>}
     </article></div>
   </section>
   <section className={styles.scope}><div><p className={styles.eyebrow}>WHAT THIS IS</p><h2>A free starting point for Korean data writing.</h2></div><div><p>This public version includes ten focused task types: changes, rankings, proportions, trends, differences, unchanged values, group comparisons, larger increases, reversals, and short paragraphs.</p><p>It does not create a TOPIK score or claim to assess every Korean sentence. No account is required and answers are not stored or sent to an AI provider. Only content-free completion and focus counts remain in this browser to choose the next practice.</p></div></section>
 </>;
}
