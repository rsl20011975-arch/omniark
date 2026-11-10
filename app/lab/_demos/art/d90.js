// 만들어진 파일 — 원본: 시각 연출 사전 아티팩트 d90. 직접 고치지 않는다
/* eslint-disable */
// @ts-nocheck

import { seg, canvas, rr } from "./helpers.js";
import { EZ, TAU, bgFill, cap, dvHair, ezShadow, sstep, txt2, txtk, uiReset } from "./shared/common.js";
import { EN_COL, enCard } from "./shared/g86.js";

const B90=(function(){const N=4000,h=[];for(let i=0;i<=N;i++)h.push(1-EZ.outBounce(i/N));const pk=[];for(let i=1;i<N;i++){if(h[i]>h[i-1]&&h[i]>=h[i+1]&&h[i]>.002&&i/N>.3)pk.push(h[i]);}return {pk};})();

const demo = {
  dur: 3, rest: 1.6, noCompare: false, levels: 0,
  mount(sp){sp.style.background='#080a10';return {ctx:canvas(sp)};},
  render(s,t,a){
    const c=s.ctx;uiReset(c);bgFill(c,'#0b0e16','#06080c');const names=['드롭 + 바운스','플립','스핀 인','언폴드'],subs=['무게 있는 오브젝트','앞뒤가 있는 카드(공개)','아이콘·로고','패널·메뉴 펼침'];
    const DIST=72,cols=['#ff8a3d','#b49cff','#3ecf8e','#6fd3ff'];
    names.forEach((nm,i)=>{
      const px=14+(i%2)*312,py=18+Math.floor(i/2)*148,cx=px+150;
      rr(c,px,py,300,138,10);c.fillStyle='rgba(255,255,255,.03)';c.fill();c.strokeStyle='rgba(255,255,255,.08)';c.lineWidth=1;c.stroke();
      txt2(c,a?nm:nm+' (효과 없음)',px+12,py+19,13,a?cols[i]:'#9ba3ad',700);txtk(c,subs[i],px+288,py+19,9.5,EN_COL.muted,'right');
      let live='';const al0=a?1:EZ.outQ(seg(t,.4,.7));
      if(i===0){
        const fy=py+108,u=seg(t,.4,1.3),h=a?DIST*(1-EZ.outBounce(u)):0,hp=a?DIST*(1-EZ.outBounce(Math.max(0,u-.012))):0,spd=Math.abs(h-hp)/(.012*.9),sq=a?.22*Math.max(0,1-h/7)*Math.min(1,spd/150):0,bw=36,bh=36;
        dvHair(c,px+20,fy,px+280,fy,'rgba(255,255,255,.18)');
        const k=1-h/DIST;ezShadow(c,cx,fy+3,(14+12*k)*(a?1:1.3),4+2*k,a?.5*k+.08:.45);
        c.save();c.globalAlpha=a?sstep(0,.08,u):al0;c.translate(cx,fy-h);c.scale(1+sq*.9,1-sq);const g=c.createLinearGradient(0,-bh,0,0);g.addColorStop(0,'#ffa35e');g.addColorStop(1,'#d9611a');rr(c,-bw/2,-bh,bw,bh,8);c.fillStyle=g;c.fill();c.strokeStyle='rgba(255,255,255,.25)';c.lineWidth=1;c.stroke();c.restore();
        live=a?'높이 '+Math.round(h)+'px · 튕김 '+B90.pk.length+'번(높이 '+B90.pk.map(q=>Math.round(q*DIST)).join('→')+'px)':'떨어지는 움직임 없음';
      }
      if(i===1){
        const u=a?EZ.outC(seg(t,.4,1.2)):1,th=Math.PI*(1-u),sx=Math.cos(th),w=130,h=78,x0=cx-w/2,y0=py+34;
        c.save();c.globalAlpha=a?sstep(0,.12,seg(t,.4,1.2)):al0;c.translate(cx,y0+h/2);c.scale(Math.max(.01,Math.abs(sx)),1+.05*(1-Math.abs(sx)));c.translate(-cx,-(y0+h/2));
        if(sx<0){const g=c.createLinearGradient(0,y0,0,y0+h);g.addColorStop(0,'#3a4258');g.addColorStop(1,'#232838');rr(c,x0,y0,w,h,10);c.fillStyle=g;c.fill();c.strokeStyle='rgba(255,255,255,.2)';c.stroke();txt2(c,'?',cx,y0+h/2+13,38,'#8b94a3',700,'center');}
        else{enCard(c,x0,y0,w,h,EN_COL.violet,1,'AI 영상 완성','PPT → 모션');}
        c.fillStyle='rgba(0,0,0,'+(.4*(1-Math.abs(sx)))+')';rr(c,x0,y0,w,h,10);c.fill();c.restore();
        live=a?'각도 '+Math.round(th*180/Math.PI)+'° → 0° · '+(sx<0?'뒷면':'앞면'):'뒤집힘 없음';
      }
      if(i===2){
        const u=a?seg(t,.4,1.2):1,ang=a?TAU*(1-EZ.outC(u)):0,sc=a?Math.max(0,EZ.outBack(u)):1,ys=py+72;
        ezShadow(c,cx,ys+38,26*sc,5*sc,.4);
        c.save();c.globalAlpha=a?sstep(0,.2,u):al0;c.translate(cx,ys);c.rotate(ang);c.scale(sc,sc);const g=c.createLinearGradient(0,-28,0,28);g.addColorStop(0,'#4be0a0');g.addColorStop(1,'#1d9a66');rr(c,-28,-28,56,56,14);c.fillStyle=g;c.fill();c.strokeStyle='rgba(255,255,255,.28)';c.lineWidth=1;c.stroke();
        c.fillStyle='#fff';c.beginPath();c.moveTo(-8,-13);c.lineTo(14,0);c.lineTo(-8,13);c.closePath();c.fill();c.restore();
        live=a?'각도 '+Math.round(ang*180/Math.PI)+'° · 크기 '+Math.round(sc*100)+'%':'회전·크기 변화 없음';
      }
      if(i===3){
        const u=a?EZ.outC(seg(t,.4,1.0)):1,ph=Math.PI/2*(1-u),cs=Math.cos(ph),w=160,h=80,x0=cx-w/2,y0=py+32;
        c.save();c.globalAlpha=a?sstep(0,.15,seg(t,.4,1.0)):al0;c.translate(0,y0);c.scale(1,Math.max(.02,cs));c.translate(0,-y0);
        enCard(c,x0,y0,w,h,EN_COL.cyan,1,'이번 달 성과','구독자 +86%');
        c.fillStyle='rgba(0,0,0,'+(.5*Math.sin(ph))+')';rr(c,x0,y0,w,h,10);c.fill();c.restore();
        live=a?'각도 '+Math.round(ph*180/Math.PI)+'° → 0° · 높이 '+Math.round(cs*100)+'%':'펼쳐짐 없음';
      }
      txtk(c,live,px+12,py+132,9.5,a?EN_COL.muted:'#6a7385');
    });
    cap(c,a?'연출 후: 무게(드롭)·앞뒤(플립)·회전(스핀)·펼침(언폴드)이 등장에 물리적 이유를 준다':'연출 전: 같은 물건들이 효과 없이 나타남 — 무게도 방향도 느껴지지 않는다',16,350);
  }
};
export default demo;
