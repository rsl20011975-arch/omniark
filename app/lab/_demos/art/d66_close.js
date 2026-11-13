// 만들어진 파일 — 원본: 시각 연출 사전 아티팩트 d66. 직접 고치지 않는다 — 응용 팁 'close' 적용본
/* eslint-disable */
// @ts-nocheck

import { seg, E, canvas, rr } from "./helpers.js";
import { TAU, bgFill, cap, txt2, txtm, uiReset } from "./shared/common.js";

const QZ={v:[78,87,83],n:['A','B','C']};

const demo = {
  dur: 5.8, rest: 4.8, noCompare: false, levels: 0,
  mount(sp){sp.style.background='#080a10';return {ctx:canvas(sp)};},
  render(s,t,a){
    const c=s.ctx;uiReset(c);bgFill(c,'#0b0e16','#06080c');
    const qa=a?E.outC(seg(t,.2,.7)):1,rev=a?seg(t,3.6,5.0):1,BX=[130,290,450],BW=100,BY=252,BH=104;
    c.globalAlpha=qa;rr(c,40,24,70,22,11);c.fillStyle='rgba(255,138,61,.2)';c.fill();txt2(c,'퀴즈',75,39,12,'#ffb27f',700,'center');txt2(c,'세 막대 중 가장 높게 나올 것은?',40,72,24,'#f4efe4',700);c.globalAlpha=1;
    c.strokeStyle='#262e3d';c.lineWidth=1;c.beginPath();c.moveTo(80,BY+.5);c.lineTo(580,BY+.5);c.stroke();
    let win=1;
    QZ.v.forEach((v,i)=>{
      const r=a?E.outC(seg(rev,i*.18,i*.18+.6)):1,h=BH*(v/100)*r,x=BX[i];
      if(!a||rev<=0||r<=0){ /* 아직 숨겨진 막대 */
        c.setLineDash([5,5]);c.strokeStyle='#3a4254';c.lineWidth=1.4;rr(c,x,BY-BH,BW,BH,8);c.stroke();c.setLineDash([]);txt2(c,'?',x+BW/2,BY-BH/2+14,40,'#4a5266',700,'center');}
      if(!a||r>0){const isW=i===win,g=c.createLinearGradient(0,BY-h,0,BY);g.addColorStop(0,isW?'#ffb27f':'#5a6478');g.addColorStop(1,isW?'#d9601c':'#2f3646');rr(c,x,BY-h,BW,h,8);c.fillStyle=g;c.fill();
        if(r>.2){c.globalAlpha=Math.min(1,r*1.4);txtm(c,String(Math.round(v*r)),x+BW/2,BY-h-8,13,isW?'#ffd9b0':'#9ba3ad','center');c.globalAlpha=1;}}
      c.fillStyle=a&&rev>.6&&i!==win?'#5b6577':'#dfe5ee';c.beginPath();c.arc(x+BW/2,BY+20,13,0,TAU);c.fillStyle=a&&rev>.8&&i===win?'#ff8a3d':'#1a2030';c.fill();c.strokeStyle='#3a4254';c.lineWidth=1;c.stroke();txt2(c,QZ.n[i],x+BW/2,BY+25,13,a&&rev>.8&&i===win?'#1a0f06':'#dfe5ee',700,'center');
    });
    if(a){
      /* 생각할 시간 카운트다운 */
      if(t>=.8&&t<3.6){const th=3.6-t,cnt=Math.ceil(th),pr=th/2.8;c.strokeStyle='#262e3d';c.lineWidth=5;c.beginPath();c.arc(574,56,22,0,TAU);c.stroke();c.strokeStyle='#6fd3ff';c.lineCap='round';c.beginPath();c.arc(574,56,22,-Math.PI/2,-Math.PI/2+TAU*pr);c.stroke();c.lineCap='butt';txt2(c,String(cnt),574,64,22,'#f4efe4',700,'center');
        c.globalAlpha=.6+.4*Math.sin(t*5);txt2(c,'먼저 예측해 보세요',40,106,15,'#6fd3ff',700);c.globalAlpha=1;}
      if(rev>.7){const w=E.outBack(seg(rev,.7,1));c.save();c.translate(BX[win]+BW/2,BY-BH*QZ.v[win]/100-44);c.scale(w,w);rr(c,-34,-12,68,24,12);c.fillStyle='#ff8a3d';c.fill();txt2(c,'정답 ✓',0,5,13,'#1a0f06',700,'center');c.restore();
        c.globalAlpha=E.outC(seg(rev,.8,1));txt2(c,'정답은 B — 예상과 같았나요? (값은 예시)',320,318,15,'#ffd9b0',700,'center');c.globalAlpha=1;}
    }else{txt2(c,'정답은 B (값은 예시) — 질문과 동시에 공개',320,318,15,'#ffd9b0',700,'center');rr(c,BX[win]+BW/2-34,BY-BH*.87-56,68,24,12);c.fillStyle='#ff8a3d';c.fill();txt2(c,'정답 ✓',BX[win]+BW/2,BY-BH*.87-39,13,'#1a0f06',700,'center');}
    cap(c,a?'질문 → 3초 생각할 시간(카운트다운) → 막대가 차례로 올라오며 공개':'연출 전: 질문과 정답이 동시에 보임 → 시청자가 예측해 볼 틈이 없음',16,350);
  }
};
export default demo;
