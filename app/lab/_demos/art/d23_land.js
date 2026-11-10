// 만들어진 파일 — 원본: 시각 연출 사전 아티팩트 d23. 직접 고치지 않는다 — 응용 팁 'land' 적용본
/* eslint-disable */
// @ts-nocheck

import { seg, E, canvas } from "./helpers.js";
import { TAU, cap, glowDot, txt2 } from "./shared/common.js";
import { HASGEO, SEOUL, drawPath, geo, noGeoMsg } from "./shared/g21.js";
import * as d3 from "d3-geo";

const ARC_CITIES=[['도쿄',139.69,35.68],['싱가포르',103.82,1.35],['시드니',151.21,-33.87],['두바이',55.27,25.2],['런던',-0.13,51.51],['뉴욕',-74.01,40.71],['샌프란시스코',-122.42,37.77]];
function arcPoint(A,B,u,k){
  const mx=(A[0]+B[0])/2,my=(A[1]+B[1])/2,dx=B[0]-A[0],dy=B[1]-A[1],len=Math.hypot(dx,dy)||1;let nx=-dy/len,ny=dx/len;if(ny>0){nx=-nx;ny=-ny;}
  const C=[mx+nx*len*k,my+ny*len*k],a=(1-u)*(1-u),b=2*(1-u)*u,d=u*u;return [a*A[0]+b*C[0]+d*B[0],a*A[1]+b*C[1]+d*B[1]];
}

const demo = {
  dur: 6.5, rest: 5.6, noCompare: false, levels: 0,
  mount(sp){sp.style.background='#070a10';return {ctx:canvas(sp)};},
  render(s,t,a){
    const c=s.ctx;if(!HASGEO){noGeoMsg(c);return;}
    c.setTransform(2,0,0,2,0,0);c.fillStyle='#070a10';c.fillRect(0,0,640,360);const G=geo();
    const pr=d3.geoNaturalEarth1().fitExtent([[14,34],[626,336]],{type:'Sphere'}),path=d3.geoPath(pr,c);
    c.strokeStyle='#1b2434';c.lineWidth=.8;drawPath(c,path,{type:'Sphere'});c.stroke();
    c.fillStyle='#263349';c.strokeStyle='#3a4a66';c.lineWidth=.5;G.countries.features.forEach(f=>{drawPath(c,path,f);c.fill();c.stroke();});
    const S=pr(SEOUL),P=ARC_CITIES.map(x=>pr([x[1],x[2]]));
    if(!a){
      c.fillStyle='#6fd3ff';P.forEach(p=>{c.beginPath();c.arc(p[0],p[1],2.2,0,TAU);c.fill();});c.fillStyle='#ff8a3d';c.beginPath();c.arc(S[0],S[1],3,0,TAU);c.fill();
      cap(c,'연출 전: 점만 찍힌 지도 · 연결과 방향이 보이지 않음',16,344);return;
    }
    let arrived=0;
    ARC_CITIES.forEach((cc,i)=>{
      const st=.6+i*.3,p=E.outC(seg(t,st,st+1.3)),ta=st+1.3,N=36;
      for(let k=0;k<N;k++){const u0=k/N*p,u1=(k+1)/N*p,A=arcPoint(S,P[i],u0,.3),B=arcPoint(S,P[i],u1,.3);
        c.globalAlpha=p<1?.12+.7*(k/N):.12+.4*(k/N)+.25;c.strokeStyle='rgb(111,211,255)';c.lineWidth=1.4;c.beginPath();c.moveTo(A[0],A[1]);c.lineTo(B[0],B[1]);c.stroke();}
      c.globalAlpha=1;
      c.globalCompositeOperation='lighter';
      if(p>0&&p<1){const h=arcPoint(S,P[i],p,.3);glowDot(c,[160,225,255],h[0],h[1],8,.95);}
      if(t>=ta){arrived++;const ph=((t-ta)%1.6)/1.6;c.globalAlpha=(1-ph)*.7;c.strokeStyle='rgb(111,211,255)';c.lineWidth=1;c.beginPath();c.arc(P[i][0],P[i][1],2+ph*14,0,TAU);c.stroke();}
      c.globalCompositeOperation='source-over';c.globalAlpha=1;
      if(t>=ta){c.fillStyle='#bfeaff';c.beginPath();c.arc(P[i][0],P[i][1],2.4,0,TAU);c.fill();c.globalAlpha=E.outC(seg(t,ta,ta+.4));
        txt2(c,cc[0],P[i][0]+(P[i][0]>520?-6:6),P[i][1]-6,10.5,'#ece7dc',700,P[i][0]>520?'right':'left');c.globalAlpha=1;}
    });
    c.globalCompositeOperation='lighter';for(let j=0;j<2;j++){const ph=((t*.8)+j*.5)%1;c.globalAlpha=(1-ph)*.8;c.strokeStyle='rgb(255,138,61)';c.lineWidth=1.2;c.beginPath();c.arc(S[0],S[1],3+ph*20,0,TAU);c.stroke();}
    c.globalCompositeOperation='source-over';c.globalAlpha=1;c.fillStyle='#ff8a3d';c.beginPath();c.arc(S[0],S[1],3.6,0,TAU);c.fill();txt2(c,'서울',S[0]-8,S[1]+15,12,'#ffb27a',700,'right');
    txt2(c,'연결 '+arrived+'곳',20,28,15,'#ece7dc',700);txt2(c,'예시 데이터',20,44,10.5,'#9ba3ad');
    cap(c,'아크가 0.3초 간격으로 1.3초씩 뻗음 → 도착 고리 · 출발점(서울)만 주황',16,350);
  }
};
export default demo;
