// 만들어진 파일 — 원본: 시각 연출 사전 아티팩트 d79. 직접 고치지 않는다 — 응용 팁 'dist' 적용본
/* eslint-disable */
// @ts-nocheck

import { seg, canvas, rr } from "./helpers.js";
import { bgFill, cap, ezMax, ezShadow, txt2, txtk, txtm, uiReset } from "./shared/common.js";
import { cbez, ezPlot, sprTable, tabAt } from "./shared/g74.js";

const F79=[
  {n:'부드럽게',en:'smooth',f:cbez(.4,0,.2,1),D:.5,css:'cubic-bezier(.4, 0, .2, 1)',col:'#6fd3ff'},
  {n:'경쾌하게',en:'snappy',f:cbez(.34,1.56,.64,1),D:.4,css:'cubic-bezier(.34, 1.56, .64, 1)',col:'#ffcf5a'},
  {n:'묵직하게',en:'heavy',f:cbez(.7,0,.3,1),D:.8,css:'cubic-bezier(.7, 0, .3, 1)',col:'#b49cff'},
  {n:'탄력 있게',en:'springy',spr:1,D:1.0,css:'spring k=200 c=12 m=1',col:'#ff7ab8'},
  {n:'날카롭게',en:'sharp',f:cbez(.19,1,.22,1),D:.25,css:'cubic-bezier(.19, 1, .22, 1)',col:'#3ecf8e'},
  {n:'고급스럽게',en:'elegant',f:cbez(.16,1,.3,1),D:.9,css:'cubic-bezier(.16, 1, .3, 1)',col:'#ff8a3d'}
];
const F79B={f:cbez(.25,.1,.25,1),D:.3,css:'ease = cubic-bezier(.25, .1, .25, 1)'};
(function(){const tab=sprTable(200,12,1,()=>1,1.0);F79[3].f=q=>tabAt(tab,q*1.0);F79.concat([F79B]).forEach(e=>{let pk=0;for(let i=0;i<400;i++){const d=(e.f((i+1)/400)-e.f(i/400))*400;if(Math.abs(d)>pk)pk=Math.abs(d);}e.pk=pk;e.ov=Math.max(0,ezMax(e.f)-1);});})();

const demo = {
  dur: 2.8, rest: 1.6, noCompare: false, levels: 0,
  mount(sp){sp.style.background='#080a10';return {ctx:canvas(sp)};},
  render(s,t,a){
    const c=s.ctx;uiReset(c);bgFill(c,'#0b0e16','#06080c');
    F79.forEach((e0,i)=>{
      const e=a?e0:F79B,px=14+(i%3)*208,py=16+Math.floor(i/3)*152,col=a?e0.col:'#8b94a3',u=seg(t,.4,.4+e.D),v=e.f(u);
      rr(c,px,py,200,142,10);c.fillStyle='rgba(255,255,255,.03)';c.fill();c.strokeStyle='rgba(255,255,255,.08)';c.lineWidth=1;c.stroke();
      txt2(c,e0.n,px+12,py+19,13,a?col:'#9ba3ad',700);txtm(c,e0.en,px+188,py+19,8.5,'#6a7385','right');
      /* 카드: v = 0 → 아래·투명, 1 → 제자리·불투명 */
      const cx=px+12,cw=118,ch=50,cy=py+44+(1-v)*56;
      c.save();c.beginPath();c.rect(px+2,py+28,196,86);c.clip();
      c.globalAlpha=Math.max(0,Math.min(1,v*1.7));ezShadow(c,cx+cw/2,cy+ch+6,cw*.45,5,.35);
      const g=c.createLinearGradient(0,cy,0,cy+ch);g.addColorStop(0,'#2a3040');g.addColorStop(1,'#181c28');rr(c,cx,cy,cw,ch,9);c.fillStyle=g;c.fill();c.strokeStyle='rgba(255,255,255,.16)';c.lineWidth=1;c.stroke();
      c.fillStyle=col;rr(c,cx+8,cy+8,4,ch-16,2);c.fill();
      txt2(c,'주문 완료',cx+20,cy+22,11.5,'#f4efe4',700);txt2(c,'내일 도착해요',cx+20,cy+38,9.5,'#9ba3ad',500);
      c.restore();c.globalAlpha=1;
      ezPlot(c,e.f,px+138,py+40,52,40,col,u);txtk(c,'곡선',px+138,py+36,7.5,'#6a7385');
      txtm(c,e.css,px+12,py+126,8,a?'#dfe5ee':'#8b94a3');
      txtk(c,e.D.toFixed(2)+'초 · 속도 ×'+e.pk.toFixed(1)+' · 넘침 +'+Math.round(e.ov*100)+'%',px+12,py+137,8,a&&e.ov>.001?'#ffb27f':'#6a7385');
    });
        txtk(c,a?'6가지 말 → 6가지 숫자. “부드럽게”라고만 쓰면 AI는 평균인 ease .3초를 고른다':'연출 전: 어떤 느낌을 말해도 똑같은 ease .3초 (속도 ×'+F79B.pk.toFixed(1)+', 넘침 +0%)',16,334,9,a?'#3ecf8e':'#ff7a70');
    cap(c,a?'연출 후: 느낌마다 곡선 · 시간 · 넘침을 숫자로 정해서 지시 — 같은 카드가 다른 인상':'연출 전: “자연스럽게”만 말하면 모든 카드가 기본값(ease .3초)으로 똑같이 움직임',16,350);
  }
};
export default demo;
