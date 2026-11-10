// 만들어진 파일 — 원본: 시각 연출 사전 아티팩트 d24. 직접 고치지 않는다 — 응용 팁 'faster' 적용본
/* eslint-disable */
// @ts-nocheck

import { seg, lerp, E, canvas } from "./helpers.js";
import { cap, txt2 } from "./shared/common.js";

const RACE={names:['A 채널','B 채널','C 채널','D 채널','E 채널'],months:['7월','8월','9월','10월','11월','12월'],
  v:[[80,95,110,118,122,125],[40,60,100,135,160,190],[95,100,102,104,105,106],[20,35,70,120,175,230],[60,58,55,70,90,150]]};
const raceVal=(i,tm)=>{const k=Math.min(4,Math.floor(tm)),f=Math.min(1,tm-k),e=f*f*(3-2*f);return lerp(RACE.v[i][k],RACE.v[i][k+1],e);};
function raceFrame(tm){
  const v=RACE.names.map((_,i)=>raceVal(i,tm)),mx=Math.max.apply(null,v)*1.1,w=mx*.008;
  const rank=v.map((vi,i)=>v.reduce((s,vj,j)=>j===i?s:s+1/(1+Math.exp(-(vj-vi)/w)),0));
  return {v,mx,rank};
}

const demo = {
  dur: 7.6, rest: 7, noCompare: false, levels: 0,
  mount(sp){sp.style.background='#0a0d14';return {ctx:canvas(sp)};},
  render(s,t,a){
    const c=s.ctx;c.setTransform(2,0,0,2,0,0);c.fillStyle='#0a0d14';c.fillRect(0,0,640,360);
    const tm=a?5*seg(t,.6,4.6):5,F=raceFrame(tm),W=380,X0=128;
    txt2(c,'채널별 월간 조회수(예시 데이터)',20,30,14,'#ece7dc',700);
    c.strokeStyle='rgba(255,255,255,.06)';c.lineWidth=1;for(let g=0;g<=4;g++){const x=X0+W*g/4;c.beginPath();c.moveTo(x,50);c.lineTo(x,318);c.stroke();}
    const order=F.v.map((v,i)=>i);
    order.forEach(i=>{
      const y=62+F.rank[i]*50,w=F.v[i]/F.mx*W,lead=a?Math.max(0,Math.min(1,1-F.rank[i]*2)):(F.rank[i]<.5?1:0);
      const r=Math.round(74+(255-74)*lead),g=Math.round(82+(138-82)*lead),b=Math.round(96+(61-96)*lead);
      c.fillStyle='rgb('+r+','+g+','+b+')';c.fillRect(X0,y,w,34);
      txt2(c,RACE.names[i],X0-8,y+22,13,lead>.5?'#ffd9b8':'#ece7dc',700,'right');
      txt2(c,Math.round(F.v[i])+'',X0+w+8,y+22,13,lead>.5?'#ffb27a':'#9ba3ad',700);
    });
    const mi=Math.min(5,Math.round(tm));txt2(c,RACE.months[mi],612,330,a?40:28,a?'rgba(255,255,255,.18)':'rgba(255,255,255,.12)',700,'right');
    if(a){const lead=F.rank.indexOf(Math.min.apply(null,F.rank));const pp=E.outBack(seg(t,6.7,7.2));
      if(pp>0){c.save();c.globalAlpha=Math.min(1,pp*2);c.translate(548,32);c.scale(.8+.2*pp,.8+.2*pp);c.fillStyle='#ff8a3d';c.fillRect(-64,-18,128,28);txt2(c,RACE.names[lead]+' 1위',0,2,14,'#0b0e13',700,'center');c.restore();}}
    cap(c,a?'월별 값을 부드럽게 이어 붙이고 순위도 연속으로 바꿈 · 1위만 주황':'연출 전: 마지막 달의 결과만 정지 화면으로',16,350);
  }
};
export default demo;
