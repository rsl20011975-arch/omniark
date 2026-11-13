// 만들어진 파일 — 원본: 시각 연출 사전 아티팩트 d91. 직접 고치지 않는다 — 응용 팁 'bignum' 적용본
/* eslint-disable */
// @ts-nocheck

import { seg, canvas, rr } from "./helpers.js";
import { DV, EZ, bgFill, cap, dvBar, dvChip, dvHair, sstep, txt2, txtk, uiReset } from "./shared/common.js";
import { EN_COL } from "./shared/g86.js";

const E91=[
  {k:'num',n:'① 핵심 숫자',t0:.3,d:.5},{k:'title',n:'② 제목',t0:.8,d:.45},{k:'chart',n:'③ 차트',t0:.9,d:1.06},{k:'det',n:'④ 상세 3줄',t0:2.0,d:.7},{k:'src',n:'⑤ 출처',t0:2.8,d:.4}
];
const END91=Math.max(...E91.map(e=>e.t0+e.d));

const demo = {
  dur: 3.8, rest: 1.8, noCompare: false, levels: 0,
  mount(sp){sp.style.background='#080a10';return {ctx:canvas(sp)};},
  render(s,t,a){
    const c=s.ctx;uiReset(c);bgFill(c,'#0b0e16','#06080c');
    dvChip(c,a?'중요도 순서로 등장':'5개 요소가 동시에 등장',a?170:200,a?'#ffb27f':'#dfe5ee');
    const SX=16,SY=40,SW=400,SH=225,sp0=k=>a?E91.find(e=>e.k===k):{t0:.4,d:.4},P=(k,off)=>{const e=sp0(k);return seg(t,e.t0+(off||0),e.t0+e.d);};
    rr(c,SX,SY,SW,SH,10);c.fillStyle='#10141f';c.fill();c.strokeStyle='rgba(255,255,255,.12)';c.lineWidth=1;c.stroke();
    c.save();rr(c,SX,SY,SW,SH,10);c.clip();c.translate(SX,SY);
    /* ① 핵심 숫자 */
    {const u=P('num'),sc=a?.7+.3*EZ.outBack(u):1,mx=20,my=118;c.save();c.globalAlpha=a?sstep(0,.3,u):EZ.outQ(u);c.translate(mx,my);c.scale(Math.max(0,sc),Math.max(0,sc));c.translate(-mx,-my);txt2(c,'+86%',20,118,64,EN_COL.orange,700);txt2(c,'6개월 구독자 증가율',22,140,11,EN_COL.muted,500);c.restore();}
    /* ② 제목 */
    {const u=P('title'),e=EZ.outC(u);c.globalAlpha=a?sstep(0,.6,u):EZ.outQ(u);txt2(c,'구독자 증가 요인 (예시)',20,38+(a?10*(1-e):0),15,EN_COL.ink,700);c.globalAlpha=1;}
    /* ③ 차트 */
    {const e=sp0('chart'),vs=[30,48,62,86],x0=206;c.globalAlpha=a?sstep(e.t0,e.t0+.2,t):EZ.outQ(P('chart'));c.fillStyle='rgba(255,255,255,.2)';c.fillRect(196,170,188,1);c.globalAlpha=1;
      vs.forEach((v,i)=>{const u=a?EZ.outC(seg(t,e.t0+.2+i*.12,e.t0+.7+i*.12)):EZ.outQ(P('chart')),h=v*.93*u;dvBar(c,x0+i*44,170-h,30,h,4,i===3?DV.orange:DV.gray);c.globalAlpha=a?sstep(0,1,u):EZ.outQ(P('chart'));txtk(c,(i+1)+'월',x0+i*44+15,186,9.5,EN_COL.muted,'center');c.globalAlpha=1;});}
    /* ④ 상세 */
    ['· 쇼츠 유입 +42%','· 블로그 방문 +31%','· 재방문율 +18%'].forEach((tx,i)=>{const e=sp0('det'),u=a?seg(t,e.t0+i*.15,e.t0+i*.15+.4):P('det');c.globalAlpha=EZ.outC(u);txt2(c,tx,20,176+i*16+(a?8*(1-EZ.outC(u)):0),11.5,EN_COL.sec,500);c.globalAlpha=1;});
    /* ⑤ 출처 */
    {const u=P('src');c.globalAlpha=EZ.outQ(u);txtk(c,'출처: 예시 데이터',390,216,9.5,EN_COL.muted,'right');c.globalAlpha=1;}
    c.restore();
    /* 등장 일정표 */
    const TX=438,BX=516,K=30,rows=E91;
    txt2(c,'등장 일정표',TX,56,11.5,EN_COL.muted,600);
    for(let q=0;q<=3;q++){dvHair(c,BX+q*K,64,BX+q*K,64+rows.length*34,DV.grid);txtk(c,q+'초',BX+q*K,64+rows.length*34+14,9.5,EN_COL.muted,'center');}
    rows.forEach((e,i)=>{const y=84+i*34,s0=a?e.t0:.4,d=a?e.d:.4,hot=a&&i===0;txtk(c,e.n,TX,y+4,10,hot?'#ffd9b0':EN_COL.sec);c.fillStyle=hot?DV.orange:a?DV.blue:DV.gray;rr(c,BX+s0*K,y-6,Math.max(3,d*K),12,3);c.fill();});
    c.strokeStyle='rgba(255,255,255,.7)';c.lineWidth=1.2;c.beginPath();c.moveTo(BX+t*K,66);c.lineTo(BX+t*K,64+rows.length*34);c.stroke();
    txtk(c,a?'핵심 숫자 보임 '+E91[0].t0.toFixed(2)+'초(가장 먼저) · 전부 끝 '+END91.toFixed(2)+'초 · 중요도 ①→⑤ 순서':'5개 요소가 모두 0.40~0.80초에 동시 — 무엇이 핵심인지 신호가 없다(전부 끝 0.80초)',16,300,10,a?EN_COL.green:EN_COL.red);
    cap(c,a?'연출 후: 핵심 숫자 → 제목 → 차트 → 상세 → 출처 — 눈이 읽어야 할 순서로 하나씩 켜진다':'연출 전: 슬라이드 전체가 한꺼번에 나타남 — 눈이 어디부터 읽을지 모른다',16,350);
  }
};
export default demo;
