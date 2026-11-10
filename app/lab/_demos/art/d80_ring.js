// 만들어진 파일 — 원본: 시각 연출 사전 아티팩트 d80. 직접 고치지 않는다 — 응용 팁 'ring' 적용본
/* eslint-disable */
// @ts-nocheck

import { seg, canvas } from "./helpers.js";
import { DV, EZ, TAU, bgFill, cap, dvBar, dvChip, dvHair, txt2, txtk, uiReset } from "./shared/common.js";

const P80=[['검색',31],['유튜브',24],['인스타',17],['스레드',11],['직접',9],['기타',8]];
const C80=['#3987e5','#d95926','#1baf7a','#eda100','#e87ba4','#6250d6'];

const demo = {
  dur: 4.4, rest: 1.6, noCompare: false, levels: 0,
  mount(sp){sp.style.background='#080a10';return {ctx:canvas(sp)};},
  render(s,t,a){
    const c=s.ctx;uiReset(c);bgFill(c,'#0b0e16','#06080c');
    dvChip(c,a?'막대(순위) + 링(한 숫자)':'파이 (조각 6개 · 색 6개)',a?196:206,a?'#ffb27f':'#dfe5ee');
    if(!a){
      const cx=320,cy=190,R=96,sw=360*seg(t,.4,1.9);let a0=-90;
      P80.forEach((p,i)=>{const a1=a0+p[1]*3.6,end=Math.min(a1,-90+sw);
        if(end>a0){c.beginPath();c.moveTo(cx,cy);c.arc(cx,cy,R,a0*Math.PI/180,end*Math.PI/180);c.closePath();c.fillStyle=C80[i];c.fill();c.strokeStyle=DV.surf;c.lineWidth=2;c.stroke();}
        if(-90+sw>=a1-.5){const m=(a0+a1)/2*Math.PI/180,lx=cx+(R+14)*Math.cos(m),ly=cy+(R+14)*Math.sin(m);txt2(c,p[0]+' '+p[1]+'%',lx,ly+4,11.5,'#dfe5ee',600,Math.cos(m)>=0?'left':'right');}
        a0=a1;});
    }else{
      const X0=88,W=232,MX=31,Y0=72,PI=32;
      txt2(c,'유입 경로 비중 (예시 데이터)',24,52,11,DV.muted,600);
      [10,20,30].forEach(v=>{const x=X0+v/MX*W;dvHair(c,x,Y0-8,x,Y0+6*PI-10);txtk(c,v+'%',x,Y0-12,9.5,DV.muted,'center');});
      dvHair(c,X0,Y0-8,X0,Y0+6*PI-10,DV.axis);
      P80.forEach((p,i)=>{const y=Y0+i*PI,e=EZ.outC(seg(t,.4+i*.12,1.0+i*.12)),w=p[1]/MX*W*e,hot=i===0;
        txt2(c,p[0],X0-10,y+12,12,hot?'#ffd9b0':DV.sec,hot?700:500,'right');dvBar(c,X0,y,w,16,4,hot?DV.orange:DV.gray);
        if(hot&&e>=1)txt2(c,p[1]+'%',X0+w+8,y+13,12,'#ffb27f',700);});
      const rx=520,ry=160,R=80,e=EZ.outC(seg(t,.6,2.0)),pct=72;
      txt2(c,'목표 달성률 (예시)',rx,52,11,DV.muted,600,'center');
      c.lineWidth=22;c.strokeStyle='#202737';c.beginPath();c.arc(rx,ry,R,0,TAU);c.stroke();
      if(e>0){c.lineCap='round';c.strokeStyle=DV.orange;c.beginPath();c.arc(rx,ry,R,-Math.PI/2,-Math.PI/2+TAU*pct/100*e);c.stroke();c.lineCap='butt';}
      txt2(c,Math.round(pct*e)+'%',rx,ry+11,32,DV.ink,700,'center');txt2(c,'7,200 / 10,000명',rx,ry+R+34,11.5,DV.sec,500,'center');
    }
    const ang=(P80[4][1]-P80[5][1])*3.6,px=(P80[4][1]-P80[5][1])/31*232;
    txtk(c,a?'가장 가까운 두 값(9%와 8%)의 차이 → 파이는 각도 '+ang.toFixed(1)+'° · 막대는 길이 '+px.toFixed(1)+'px · 강조는 1개':'가장 가까운 두 값(9%와 8%)의 차이는 파이에서 각도 '+ang.toFixed(1)+'°뿐 · 색 6개 · 글자 6개',16,330,10,a?'#3ecf8e':'#ff7a70');
    cap(c,a?'연출 후: 순위는 한 줄 막대로 비교하고 가장 큰 것만 주황, 한 숫자(달성률)는 링 하나로':'연출 전: 비슷한 값의 파이 — 어느 조각이 더 큰지, 순위가 어떤지 읽기 어렵다',16,350);
  }
};
export default demo;
