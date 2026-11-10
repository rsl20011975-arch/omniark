// 만들어진 파일 — 원본: 시각 연출 사전 아티팩트 d50. 직접 고치지 않는다
/* eslint-disable */
// @ts-nocheck

import { rng, canvas, rr } from "./helpers.js";
import { TAU, cap, sstep, txt2, txtm, uiReset } from "./shared/common.js";
import { rgbs } from "./shared/g50.js";

function grScene(c){
  c.setTransform(2,0,0,2,0,0);
  const sg=c.createLinearGradient(0,0,0,220);sg.addColorStop(0,'#4166a8');sg.addColorStop(.55,'#c993b8');sg.addColorStop(1,'#ffc690');c.fillStyle=sg;c.fillRect(0,0,640,360);
  const sun=c.createRadialGradient(470,200,2,470,200,120);sun.addColorStop(0,'rgba(255,240,200,.95)');sun.addColorStop(.25,'rgba(255,200,130,.5)');sun.addColorStop(1,'rgba(255,190,120,0)');c.fillStyle=sun;c.fillRect(300,80,340,240);
  const r=rng(31);let x=-10;while(x<650){const w=24+r()*40,h=40+r()*80;c.fillStyle='#4a4a6c';c.fillRect(x,215-h,w,h+10);for(let wy=215-h+8;wy<210;wy+=9)for(let wx=x+4;wx<x+w-5;wx+=8)if(r()<.3){c.fillStyle='rgba(255,214,140,.8)';c.fillRect(wx,wy,3,4);}x+=w+r()*3;}
  c.fillStyle='#b24a3a';c.fillRect(0,150,150,100);c.fillStyle='#8a3328';for(let i=0;i<12;i++)c.fillRect(0,154+i*8,150,1);
  for(let i=0;i<8;i++){c.fillStyle=i%2?'#f2f0e8':'#1f9a9a';c.beginPath();c.moveTo(6+i*17,150);c.lineTo(23+i*17,150);c.lineTo(23+i*17-4,176);c.lineTo(6+i*17-4,176);c.closePath();c.fill();}
  c.fillStyle='#2a1a12';c.fillRect(24,190,34,60);c.fillStyle='#ffe0a0';c.fillRect(74,190,52,38);c.fillStyle='#8a3328';c.fillRect(98,190,2,38);
  [[560,170,38],[610,186,30],[520,186,28]].forEach(t=>{c.fillStyle='#4a2f22';c.fillRect(t[0]-3,t[1],6,40);c.fillStyle='#3f8a4c';c.beginPath();c.arc(t[0],t[1],t[2],0,TAU);c.fill();c.fillStyle='rgba(180,230,120,.35)';c.beginPath();c.arc(t[0]-8,t[1]-8,t[2]*.55,0,TAU);c.fill();});
  const ag=c.createLinearGradient(0,250,0,360);ag.addColorStop(0,'#555560');ag.addColorStop(1,'#2a2a32');c.fillStyle=ag;c.fillRect(0,250,640,110);
  c.fillStyle='rgba(255,200,140,.18)';c.fillRect(380,252,200,108);c.fillStyle='rgba(255,255,255,.5)';for(let i=0;i<6;i++)c.fillRect(30+i*110,330,56,4);
  c.fillStyle='#2a2a30';c.fillRect(300,120,4,134);c.fillStyle='#ffd985';c.beginPath();c.arc(302,118,6,0,TAU);c.fill();const lg=c.createRadialGradient(302,118,1,302,118,36);lg.addColorStop(0,'rgba(255,220,130,.7)');lg.addColorStop(1,'rgba(255,220,130,0)');c.fillStyle=lg;c.fillRect(262,78,80,80);
  c.fillStyle='rgba(0,0,0,.3)';c.beginPath();c.ellipse(236,300,40,7,0,0,TAU);c.fill();
  c.fillStyle='#2f4f8a';c.fillRect(222,262,12,38);c.fillRect(238,262,12,38);
  const jg=c.createLinearGradient(214,0,262,0);jg.addColorStop(0,'#f08a3a');jg.addColorStop(1,'#cf5f18');c.fillStyle=jg;rr(c,214,202,48,66,9);c.fill();
  c.fillStyle='#e0b08a';c.beginPath();c.arc(238,190,13,0,TAU);c.fill();c.fillStyle='#3a2216';c.beginPath();c.arc(238,186,13,Math.PI,TAU);c.fill();
  c.fillStyle='#1f9a9a';rr(c,254,236,22,28,4);c.fill();c.strokeStyle='#14686a';c.lineWidth=2;c.beginPath();c.moveTo(260,236);c.lineTo(248,214);c.stroke();
  c.fillStyle='#c9382c';rr(c,420,276,100,26,8);c.fill();rr(c,436,262,60,18,6);c.fill();c.fillStyle='rgba(20,28,48,.8)';rr(c,442,266,22,11,2);c.fill();rr(c,468,266,22,11,2);c.fill();c.fillStyle='#10131c';[[440,302],[500,302]].forEach(w=>{c.beginPath();c.arc(w[0],w[1],8,0,TAU);c.fill();});
}
const GR_LOOKS=[
  {n:'원본 · 그레이딩 없음',r:'색 보정 없음',ops:[]},
  {n:'골든 아워 · 따뜻하게',r:'overlay #FFAA50 35% · multiply #FFECD2 25%',ops:[['overlay',[255,170,80],.35],['multiply',[255,236,210],.25]]},
  {n:'블루 아워 · 차갑게',r:'overlay #4682FF 40% · 채도 15% 낮춤',ops:[['overlay',[70,130,255],.4],['multiply',[205,222,255],.22],['saturation',[128,128,128],.15]]},
  {n:'틸 & 오렌지 · 영화 룩',r:'overlay 틸 #007882 45% · soft-light 주황 #FF963C 55%',ops:[['overlay',[0,120,130],.45],['soft-light',[255,150,60],.55],['overlay','scene',.25]]},
  {n:'듀오톤 · 남색 → 살구',r:'채도 0 → multiply #FFD6AA → lighten #181C5A',ops:[['saturation',[128,128,128],1],['multiply',[255,214,170],1],['lighten',[24,28,90],1]]},
  {n:'흑백 · 높은 대비',r:'채도 0 → overlay(장면 자신) 60%',ops:[['saturation',[128,128,128],1],['overlay','scene',.6]]}
];
function grApply(c,scene,look,w){
  if(w<=.01)return;
  look.ops.forEach(o=>{c.globalCompositeOperation=o[0];c.globalAlpha=o[2]*w;if(o[1]==='scene')c.drawImage(scene,640,0,640,720,320,0,320,360);else{c.fillStyle=rgbs(o[1]);c.fillRect(320,0,320,360);}});
  c.globalCompositeOperation='source-over';c.globalAlpha=1;
}

const demo = {
  dur: 6.2, rest: 3.4, noCompare: false, levels: 0,
  mount(sp){sp.style.background='#0a0d14';const sc=document.createElement('canvas');sc.width=1280;sc.height=720;grScene(sc.getContext('2d'));return {ctx:canvas(sp),scene:sc};},
  render(s,t,a){
    const c=s.ctx;uiReset(c);c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';
    c.drawImage(s.scene,0,0,640,360);
    if(!a){cap(c,'연출 전: 색 보정 없이 촬영·제작된 그대로 → 분위기가 정해지지 않은 밋밋한 색',16,350);return;}
    const pos=(t-.5)/1.1,i=Math.max(0,Math.min(5,Math.floor(pos))),f=pos<0?0:(pos>=5?1:pos-i),wn=i<5&&pos>=0?sstep(.74,1,f):0;
    const cur=GR_LOOKS[pos<0?0:i],nxt=GR_LOOKS[Math.min(5,i+1)];
    c.save();c.beginPath();c.rect(320,0,320,360);c.clip();grApply(c,s.scene,cur,1-wn);grApply(c,s.scene,nxt,wn);c.restore();
    c.fillStyle='rgba(255,255,255,.9)';c.fillRect(319,0,2,360);c.beginPath();c.arc(320,180,11,0,TAU);c.fillStyle='#fff';c.fill();txt2(c,'◂ ▸',320,184,9,'#10141c',700,'center');
    rr(c,14,14,92,20,10);c.fillStyle='rgba(0,0,0,.6)';c.fill();txt2(c,'ORIGINAL',60,28,10,'#f4efe4',700,'center');
    const show=wn>.5?nxt:cur;rr(c,334,14,292,20,10);c.fillStyle='rgba(0,0,0,.6)';c.fill();txt2(c,show.n,480,28,11.5,'#ffb27f',700,'center');
    rr(c,334,300,292,24,6);c.fillStyle='rgba(0,0,0,.62)';c.fill();txtm(c,show.r,480,316,9.5,'#dfe5ee','center');
    cap(c,'왼쪽은 원본, 오른쪽은 색을 입힌 결과 · 룩이 1.1초마다 바뀜',16,350);
  }
};
export default demo;
