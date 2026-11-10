// 만들어진 파일 — 원본: 시각 연출 사전 아티팩트 d38. 직접 고치지 않는다 — 응용 팁 'bigpop' 적용본
/* eslint-disable */
// @ts-nocheck

import { seg, E, canvas } from "./helpers.js";
import { TY_DISP, bgFill, cap, hash, mixrgb, txtm, tyDraw, tyLay, uiReset } from "./shared/common.js";

const SC_TXT='숨겨진 연출을 해독하다',SC_POOL='가나다라마바사아자차카타파하거너더러머버서어저처커터퍼허고노도로모보소오조초코토포호구누두루무부수우주추쿠투푸후그느드르므브스으즈츠크트프흐0123456789#%&@?!<>/|=+*',SC_ASCII='0123456789#%&@?!<>/|=+*ABCDEF';
const SC_LOCK=[...SC_TXT].map((_,i)=>.9+i*.14+hash(i,3)*.1),SC_N=[...SC_TXT].filter(ch=>ch!==' ').length,SC_END=Math.max(...SC_LOCK);

const demo = {
  dur: 4.2, rest: 3.6, noCompare: false, levels: 0,
  mount(sp){sp.style.background='#05080c';return {ctx:canvas(sp)};},
  render(s,t,a){
    const c=s.ctx;uiReset(c);bgFill(c,'#080c14','#04060a');
    const font='400 56px '+TY_DISP,L=tyLay(c,SC_TXT,font,320,2),y=200;
    if(!a){c.globalAlpha=E.outC(seg(t,.3,1.1));L.forEach(o=>tyDraw(c,o.ch,o.x,y,font,'#f4efe4'));c.globalAlpha=1;
      cap(c,'연출 전: 글자가 제자리에서 그냥 나타남 → 읽는 순서도, 완성되는 순간도 느껴지지 않음',16,344);return;}
    for(let r=0;r<2;r++){let q='';const f=Math.floor(t*9)+r*7;for(let k=0;k<46;k++)q+=SC_ASCII[Math.floor(hash(k+r*50,f)*SC_ASCII.length)];txtm(c,q,20,118+r*150,11,'rgba(111,211,255,.13)');}
    let head=-1,locked=0;
    L.forEach((o,i)=>{
      if(o.ch===' ')return;const lk=SC_LOCK[i];
      if(t>=lk)locked++;else if(head<0&&t>=.4)head=i;
      if(t<.4)return;
      if(t<lk){const f=Math.floor(t*16),rc=SC_POOL[Math.floor(hash(i*3.1,f)*SC_POOL.length)];c.font=font;const w2=c.measureText(rc).width;
        tyDraw(c,rc,o.x+(o.w-w2)/2,y,font,'rgba(111,211,255,'+(.45+.4*hash(i,f+9))+')');}
      else{const u=seg(t,lk,lk+.2),sc=1.8-.8*E.outC(u),cx=o.x+o.w/2,col=mixrgb([255,255,255],[244,239,228],u).map(Math.round);
        c.save();c.translate(cx,y-16);c.scale(sc,sc);c.translate(-cx,-(y-16));
        if(u<1){c.shadowColor='rgba(255,170,100,'+(1-u)*.9+')';c.shadowBlur=18*(1-u);}
        tyDraw(c,o.ch,o.x,y,font,'rgb('+col+')');c.restore();c.shadowColor='transparent';c.shadowBlur=0;}
    });
    if(head>=0&&Math.floor(t*10)%2===0){const o=L[head];c.fillStyle='#ff8a3d';c.fillRect(o.x,y+12,o.w,3);}
    const done=locked>=SC_N;txtm(c,done?'DECODED  OK':'DECODE '+locked+'/'+SC_N,320,278,11,done?'#3ecf8e':'rgba(111,211,255,.85)','center');
    const ul=E.outC(seg(t,SC_END+.1,SC_END+.7));if(ul>0){c.fillStyle='rgba(255,138,61,.9)';c.fillRect(320-250*ul,226,500*ul,2);}
    cap(c,'글자마다 0.14초 간격으로 확정 · 확정 때 한 번 튀고 제 색으로 · 주황 막대 = 해독 중',16,344);
  }
};
export default demo;
