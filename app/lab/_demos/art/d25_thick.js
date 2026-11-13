// 만들어진 파일 — 원본: 시각 연출 사전 아티팩트 d25. 직접 고치지 않는다 — 응용 팁 'thick' 적용본
/* eslint-disable */
// @ts-nocheck

import { seg, lerp, E, canvas } from "./helpers.js";
import { LX, LY, TAU, cap, txt2 } from "./shared/common.js";

const LINE=[12,15,14,22,48,95,88,72,70,110,160,205];
const ANN=[{i:5,t:'쇼츠 업로드',s:'급증 시작',dy:-70},{i:7,t:'알고리즘 변경',s:'일시 하락',dy:48},{i:9,t:'블로그 연결',s:'회복·성장',dy:-82}];

const demo = {
  dur: 7, rest: 6.2, noCompare: false, levels: 0,
  mount(sp){sp.style.background='#0a0d14';return {ctx:canvas(sp)};},
  render(s,t,a){
    const c=s.ctx;c.setTransform(2,0,0,2,0,0);c.fillStyle='#0a0d14';c.fillRect(0,0,640,360);
    const p=a?E.inOutC(seg(t,.5,3.9)):1,fi=p*11,zm=a?E.inOutC(seg(t,4.6,6.0)):0;
    c.save();const cx=LX(11),cy=LY(205);c.translate(cx,cy);const zs=1+.14*zm;c.scale(zs,zs);c.translate(-cx,-cy+16*zm);
    c.strokeStyle='rgba(255,255,255,.07)';c.lineWidth=1;[0,50,100,150,200].forEach(v=>{c.beginPath();c.moveTo(60,LY(v));c.lineTo(610,LY(v));c.stroke();txt2(c,v+'',52,LY(v)+4,10,'#6b7788',500,'right');});
    for(let m=0;m<12;m++)txt2(c,(m+1)+'월',LX(m),316,9.5,'#6b7788',500,'center');
    const pts=LINE.map((v,i)=>[LX(i),LY(v)]);
    const upto=Math.min(11,fi),k=Math.floor(upto),f=upto-k;
    const draw=[];for(let i=0;i<=k;i++)draw.push(pts[i]);if(k<11)draw.push([lerp(pts[k][0],pts[k+1][0],f),lerp(pts[k][1],pts[k+1][1],f)]);
    const ag=c.createLinearGradient(0,60,0,300);ag.addColorStop(0,'rgba(255,138,61,.30)');ag.addColorStop(1,'rgba(255,138,61,0)');
    c.fillStyle=ag;c.beginPath();c.moveTo(draw[0][0],300);draw.forEach(q=>c.lineTo(q[0],q[1]));c.lineTo(draw[draw.length-1][0],300);c.closePath();c.fill();
    c.strokeStyle='#ff8a3d';c.lineWidth=6;c.lineJoin='round';c.beginPath();draw.forEach((q,i)=>i?c.lineTo(q[0],q[1]):c.moveTo(q[0],q[1]));c.stroke();
    pts.forEach((q,i)=>{const pp=a?E.outBack(seg(fi,i-.05,i+.35)):1;if(pp>0){c.fillStyle='#0a0d14';c.strokeStyle='#ff8a3d';c.lineWidth=2;c.beginPath();c.arc(q[0],q[1],3.4*pp,0,TAU);c.fill();c.stroke();}});
    if(a){
      ANN.forEach((n)=>{
        /* 선이 그 점에 닿는 시각(역산): p = n.i/11 → easing 의 역함수 대신, 점이 나타난 뒤 0.15초 */
        const reach=fi>=n.i-.02,al=reach?E.outC(seg(fi,n.i,n.i+.5)):0;
        if(al<=0)return;const q=pts[n.i],ly=q[1]+n.dy;
        c.save();c.globalAlpha=al;c.strokeStyle='rgba(236,231,220,.7)';c.lineWidth=1;c.setLineDash([3,3]);c.beginPath();c.moveTo(q[0],q[1]+(n.dy<0?-6:6));c.lineTo(q[0],ly);c.stroke();c.setLineDash([]);
        c.fillStyle='#161b24';c.strokeStyle='rgba(236,231,220,.5)';c.beginPath();c.rect(q[0]-52,ly-(n.dy<0?30:0),104,30,6);c.fill();c.stroke();
        txt2(c,n.t,q[0],ly-(n.dy<0?15:-0)+(n.dy<0?0:13),12,'#ece7dc',700,'center');txt2(c,n.s,q[0],ly-(n.dy<0?3:-0)+(n.dy<0?0:25),10,'#ffb27a',500,'center');c.restore();
      });
      const vp=E.outBack(seg(t,4.0,4.6)),cnt=Math.round(205*E.outExpo(seg(t,3.9,4.9)));
      if(vp>0){c.save();c.globalAlpha=Math.min(1,vp*2);c.translate(pts[11][0],pts[11][1]-18);c.scale(.8+.2*vp,.8+.2*vp);c.fillStyle='#ff8a3d';c.beginPath();c.rect(-26,-14,52,22,4);c.fill();txt2(c,cnt+'',0,2,14,'#0b0e13',700,'center');c.restore();
        c.save();c.globalAlpha=E.outC(seg(t,4.8,5.4));txt2(c,'1월의 17배',pts[11][0]-32,pts[11][1]-17,11,'#ffd9b8',700,'right');c.restore();}
    }
    c.restore();
    txt2(c,'월간 조회수(예시 데이터)',20,30,14,'#ece7dc',700);
    cap(c,a?'선 그리기 3.4초 → 사건마다 핀 → 마지막 점 확대·숫자 강조':'연출 전: 선 그래프만 있고 무슨 일이 있었는지 알 수 없음',16,350);
  }
};
export default demo;
