// 만들어진 파일 — 원본: 시각 연출 사전 아티팩트 d88. 직접 고치지 않는다 — 응용 팁 'bignum' 적용본
/* eslint-disable */
// @ts-nocheck

import { seg, canvas } from "./helpers.js";
import { EZ, UI_SANS, bgFill, cap, dvChip, sstep, txt2, txtk, uiReset } from "./shared/common.js";
import { EN_COL } from "./shared/g86.js";

const T88={L:['AI 영상이','PPT처럼 보이는 이유'],W:['Claude에게','시키면','모든','요소가','멈춰','있습니다'],C:'30초 → 3초'.split('')};
function w88(c,words,size,weight,gap){c.font=weight+' '+size+'px '+UI_SANS;let x=0;return words.map(w=>{const wd=c.measureText(w).width,r={w,x,wd};x+=wd+gap;return r;});}
const SC88=(function(){const ls=T88.L.map((_,i)=>[.4+i*.15,.6]),ws=T88.W.map((_,i)=>[1.3+i*.07,.4]),cs=T88.C.map((_,i)=>[2.0+i*.05,.45]),all=ls.concat(ws,cs);return {ls,ws,cs,n:all.length,end:Math.max(...all.map(q=>q[0]+q[1])),first:Math.min(...all.map(q=>q[0]))};})();

const demo = {
  dur: 4, rest: 1.6, noCompare: false, levels: 0,
  mount(sp){sp.style.background='#080a10';return {ctx:canvas(sp)};},
  render(s,t,a){
    const c=s.ctx;uiReset(c);bgFill(c,'#0b0e16','#06080c');
    dvChip(c,a?'줄 · 단어 · 글자 단위':'한 덩어리가 한꺼번에',a?170:196,a?'#ffb27f':'#dfe5ee');
    const WL=w88(c,T88.W,16,500,5),CL=(()=>{c.font='700 64px '+UI_SANS;let x=0;return T88.C.map(ch=>{const wd=c.measureText(ch).width,r={ch,x,wd};x+=wd;return r;});})();
    const cCol=i=>i<3?EN_COL.ink:i<6?'#8b94a3':EN_COL.orange;
    if(a){
      T88.L.forEach((ln,i)=>{const [t0,d]=SC88.ls[i],u=EZ.outC(seg(t,t0,t0+d)),y=102+i*46;c.save();c.beginPath();c.rect(40,y-38,560,52);c.clip();txt2(c,ln,40,y+(1-u)*52,36,EN_COL.ink,700);c.restore();});
      WL.forEach((w,i)=>{const [t0,d]=SC88.ws[i],u=EZ.outC(seg(t,t0,t0+d));c.globalAlpha=u;txt2(c,w.w,40+w.x,196+10*(1-u),16,EN_COL.sec,500);c.globalAlpha=1;});
      CL.forEach((q,i)=>{const [t0,d]=SC88.cs[i],u=seg(t,t0,t0+d);if(u<=0)return;const sc=.4+.6*EZ.outBack(u),mx=40+q.x+q.wd/2,my=270-20;c.save();c.globalAlpha=sstep(0,.4,u);c.translate(mx,my);c.scale(Math.max(0,sc),Math.max(0,sc));c.translate(-mx,-my);txt2(c,q.ch,40+q.x,270,64,cCol(i),700);c.restore();});
    }else{
      const al=EZ.outQ(seg(t,.4,1.0));c.globalAlpha=al;T88.L.forEach((ln,i)=>txt2(c,ln,40,102+i*46,36,EN_COL.ink,700));WL.forEach(w=>txt2(c,w.w,40+w.x,196,16,EN_COL.sec,500));CL.forEach((q,i)=>txt2(c,q.ch,40+q.x,270,64,cCol(i),700));c.globalAlpha=1;
    }
    [['줄 단위 · 마스크 라이즈',96,'줄 2개'],['단어 단위 · 떠오르며 페이드',190,'단어 6개'],['글자 단위 · 팝',262,'글자 8개']].forEach(r=>{c.globalAlpha=a?1:.4;txtk(c,r[0],626,r[1]-14,10,EN_COL.muted,'right');txtk(c,r[2],626,r[1],10,a?EN_COL.orange:EN_COL.muted,'right');c.globalAlpha=1;});
    txtk(c,a?'등장 단위 '+SC88.n+'개 · 첫 단위 '+SC88.first.toFixed(2)+'초에 시작 · 전부 끝 '+SC88.end.toFixed(2)+'초 — 전체는 더 오래 걸리지만 읽는 순서가 생긴다':'덩어리 1개가 0.40~1.00초에 한꺼번에 — 어디부터 읽을지 순서가 없다',16,326,10,a?EN_COL.green:EN_COL.red);
    cap(c,a?'연출 후: 줄은 마스크 속에서 솟아오르고, 단어는 차례로 떠오르고, 핵심 숫자는 글자마다 튄다':'연출 전: 제목·설명·숫자가 한 덩어리로 페이드 — 눈이 어디부터 가야 할지 모른다',16,350);
  }
};
export default demo;
