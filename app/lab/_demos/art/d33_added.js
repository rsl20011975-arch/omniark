// 만들어진 파일 — 원본: 시각 연출 사전 아티팩트 d33. 직접 고치지 않는다 — 응용 팁 'added' 적용본
/* eslint-disable */
// @ts-nocheck

import { seg, E, rng, canvas, rr } from "./helpers.js";
import { UI_MONO, bgFill, cap, sstep, txtm, uiReset } from "./shared/common.js";
import { uiWin } from "./shared/g32.js";

const TM_K='#c792ea',TM_S='#9ece6a',TM_F='#7aa2f7',TM_P='#8b94a3',TM_I='#dfe5ee',TM_N='#ff9e64';
const TM_LINES=[
  [['import',TM_K],[' { render } from ',TM_I],["'./chart'",TM_S]],
  [],
  [['const',TM_K],[' data ',TM_I],['= ',TM_P],['await',TM_K],[' ',TM_I],['load',TM_F],['(',TM_P],["'sales.csv'",TM_S],[')',TM_P]],
  [['const',TM_K],[' best ',TM_I],['= ',TM_P],['data.sort',TM_F],['(byValue)[',TM_P],['0',TM_N],[']',TM_P]],
  [],
  [['render',TM_F],['(best, { accent: ',TM_P],["'#ff8a3d'",TM_S],[' })',TM_P]]
];
const TM_CMD='node build.js',TM_CT=(()=>{const r=rng(9);let t=2.3;return Array.from(TM_CMD,ch=>(t+=ch===' '?.2:.04+r()*.07));})();
const TM_ENTER=TM_CT[TM_CT.length-1]+.35,TM_OUT=[['load  sales.csv ........ 1,284 rows',TM_ENTER+.2],['sort  byValue ........... ok',TM_ENTER+.5],['render chart ............ ok',TM_ENTER+.8]];

const demo = {
  dur: 6.8, rest: 6.4, noCompare: false, levels: 0,
  mount(sp){sp.style.background='#080a10';return {ctx:canvas(sp)};},
  render(s,t,a){
    const c=s.ctx;uiReset(c);bgFill(c,'#0b0e16','#06080c');
    uiWin(c,20,44,310,250,'report.js');uiWin(c,342,44,278,250,'터미널');
    const LH=19,EY=98,fm='500 11.5px '+UI_MONO;
    /* 에디터 */
    TM_LINES.forEach((ln,k)=>{
      const y=EY+k*LH,top=y-14,st=.3+k*.2,p=a?E.outC(seg(t,st,st+.5)):1;
      const hl=a?sstep(1.7,2.0,t)*(1-sstep(2.4,2.7,t)):0,df=a?sstep(2.2,2.5,t):0;
      if(k===3&&hl>0){c.fillStyle='rgba(255,138,61,'+.1*hl+')';c.fillRect(21,top,308,LH);c.fillStyle='rgba(255,138,61,'+hl+')';c.fillRect(21,top,2,LH);}
      if(k===5&&df>0){c.fillStyle='rgba(62,207,142,'+.4*df+')';c.fillRect(21,top,308,LH);c.fillStyle='rgba(62,207,142,'+df+')';c.fillRect(21,top,2,LH);}
      c.globalAlpha=Math.min(1,p*2);txtm(c,k===5&&df>.5?'+':String(k+1),40,y,10.5,k===5&&df>.5?'#3ecf8e':(k===3&&hl>.3?'#ffb27f':'#4b5567'),'right');c.globalAlpha=1;
      if(!ln.length||p<=0)return;
      c.save();c.beginPath();c.rect(48,top,p*272,LH);c.clip();c.font=fm;let x=50;
      ln.forEach(tk=>{c.fillStyle=tk[1];c.textAlign='left';c.textBaseline='alphabetic';c.fillText(tk[0],x,y);x+=c.measureText(tk[0]).width;});c.restore();
    });
    /* 터미널 */
    const TX=354,TY=98,typed=a?TM_CT.filter(v=>v<=t).length:TM_CMD.length,blink=Math.floor(t*2)%2===0;
    const prompt=(y,cmdText)=>{txtm(c,'~/report',TX,y,11.5,'#7aa2f7');txtm(c,'$',TX+64,y,11.5,'#3ecf8e');if(cmdText)txtm(c,cmdText,TX+80,y,11.5,'#dfe5ee');};
    if(!a||t>2.5){prompt(TY,TM_CMD.slice(0,typed));
      const last=typed?TM_CT[typed-1]:2.5,show=!a||t<TM_ENTER?(t-last<.35||blink):false;
      if(show&&(!a||t<TM_ENTER)){c.fillStyle='#dfe5ee';c.fillRect(TX+80+typed*6.9,TY-11,7,14);}}
    TM_OUT.forEach((o,i)=>{if(a&&t<o[1])return;const al=a?E.outC(seg(t,o[1],o[1]+.18)):1;c.globalAlpha=al;txtm(c,o[0],TX,TY+(i+1)*LH,11.5,i<2?'#8b94a3':'#dfe5ee');c.globalAlpha=1;});
    const bt=TM_ENTER+1.1,pv=a?E.inOutC(seg(t,bt,bt+1.1)):1,by=TY+4*LH;
    if(!a||t>=bt-.1){c.globalAlpha=a?E.outC(seg(t,bt-.1,bt+.1)):1;txtm(c,'build',TX,by,11.5,'#8b94a3');rr(c,TX+46,by-8,150,6,3);c.fillStyle='#1c2331';c.fill();
      if(pv>0){rr(c,TX+46,by-8,Math.max(6,150*pv),6,3);c.fillStyle=pv>=1?'#3ecf8e':'#ff8a3d';c.fill();}txtm(c,Math.round(pv*100)+'%',TX+206,by,11.5,pv>=1?'#3ecf8e':'#dfe5ee');c.globalAlpha=1;}
    const dn=bt+1.25;
    if(!a||t>=dn){const al=a?E.outC(seg(t,dn,dn+.2)):1;c.globalAlpha=al;txtm(c,'✓ done in 1.8s',TX,TY+5*LH+4,11.5,'#3ecf8e');prompt(TY+7*LH,'');
      if(!a||blink){c.fillStyle='#dfe5ee';c.fillRect(TX+80,TY+7*LH-11,7,14);}c.globalAlpha=1;}
    cap(c,a?'줄 단위 와이프 → 현재 줄 강조 · 추가된 줄은 초록 → 명령은 사람처럼 불규칙하게 타이핑 → 출력 → 진행 바':'연출 전: 코드·명령·결과가 처음부터 전부 보임 → 어디를 봐야 하는지 알 수 없음',16,348);
  }
};
export default demo;
