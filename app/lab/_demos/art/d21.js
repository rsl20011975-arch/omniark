// 만들어진 파일 — 원본: 시각 연출 사전 아티팩트 d21. 직접 고치지 않는다
/* eslint-disable */
// @ts-nocheck

import { seg, lerp, E, canvas } from "./helpers.js";
import { TAU, cap, txt2 } from "./shared/common.js";
import { HASGEO, SEOUL, drawPath, geo, noGeoMsg } from "./shared/g21.js";
import * as d3 from "d3-geo";

const demo = {
  dur: 6.5, rest: 5.6, noCompare: false, levels: 0,
  mount(sp){sp.style.background='#070a10';return {ctx:canvas(sp)};},
  render(s,t,a){
    const c=s.ctx;if(!HASGEO){noGeoMsg(c);return;}
    c.setTransform(2,0,0,2,0,0);c.fillStyle='#070a10';c.fillRect(0,0,640,360);const G=geo();
    if(!a){                                   /* 연출 전: 납작한 세계 지도, 한국은 점 하나 */
      const pr=d3.geoEquirectangular().fitExtent([[16,40],[624,320]],{type:'Sphere'}),path=d3.geoPath(pr,c);
      c.fillStyle='#252e3d';c.strokeStyle='#333f52';c.lineWidth=.5;G.countries.features.forEach(f=>{drawPath(c,path,f);c.fill();c.stroke();});
      const [x,y]=pr(SEOUL);c.fillStyle='#ff8a3d';c.beginPath();c.arc(x,y,2.6,0,TAU);c.fill();
      cap(c,'연출 전: 평면 세계 지도 · 한국은 점 하나',16,344);return;
    }
    const k=E.inOutExpo(seg(t,.5,3.0)),z=E.inOutExpo(seg(t,2.2,4.9));
    const lon=lerp(10,SEOUL[0]-.3,k),lat=lerp(18,SEOUL[1]-1.2,k),R=140*Math.pow(2300/140,z);
    const pr=d3.geoOrthographic().rotate([-lon,-lat]).translate([320,180]).scale(R).clipAngle(90),path=d3.geoPath(pr,c);
    if(z<.8){const ag=c.createRadialGradient(320,180,R*.96,320,180,R*1.28);ag.addColorStop(0,'rgba(90,150,255,'+(.35*(1-z/.8)).toFixed(3)+')');ag.addColorStop(1,'rgba(90,150,255,0)');c.fillStyle=ag;c.fillRect(0,0,640,360);}
    const og=c.createRadialGradient(250,120,R*.1,320,180,R);og.addColorStop(0,'#16233a');og.addColorStop(1,'#08101c');
    c.fillStyle=og;drawPath(c,path,{type:'Sphere'});c.fill();
    c.strokeStyle='rgba(140,170,220,.16)';c.lineWidth=.5;drawPath(c,path,G.grat);c.stroke();
    const lod=E.outC(seg(z,.52,.8));
    c.lineWidth=.5;
    G.countries.features.forEach(f=>{
      const isK=f.id==='410';
      if(isK){c.globalAlpha=1-lod;c.fillStyle='#ff8a3d';c.strokeStyle='#ffb27a';drawPath(c,path,f);c.fill();c.stroke();c.globalAlpha=1;return;}
      c.fillStyle='#283243';c.strokeStyle='#3a475c';drawPath(c,path,f);c.fill();c.stroke();
    });
    if(lod>0){
      c.globalAlpha=lod;c.lineWidth=.8;c.strokeStyle='#0b0e13';
      G.kr.features.forEach((f,i)=>{c.fillStyle=i%2?'#f08038':'#ff8a3d';drawPath(c,path,f);c.fill();c.stroke();});
      c.globalAlpha=1;
    }
    const [sx,sy]=pr(SEOUL);
    if(k>.9&&sx>-20&&sx<660){const pl=(((t-2.8)*1.1)%1+1)%1;const ra=2+pl*16*(R>800?1.6:1);
      c.globalAlpha=Math.max(0,.9-pl);c.strokeStyle='#fff';c.lineWidth=1;c.beginPath();c.arc(sx,sy,ra,0,TAU);c.stroke();c.globalAlpha=1;
      c.fillStyle='#fff';c.beginPath();c.arc(sx,sy,2.6,0,TAU);c.fill();
      const la=E.outC(seg(t,3.6,4.2));c.globalAlpha=la;c.strokeStyle='rgba(255,255,255,.7)';c.lineWidth=1;c.beginPath();c.moveTo(sx,sy);c.lineTo(sx+60,sy-46);c.lineTo(sx+120,sy-46);c.stroke();
      txt2(c,'서울',sx+66,sy-52,15,'#ffffff',700);txt2(c,'대한민국 · 시·도 경계',sx+66,sy-36,11,'#ffd9b8',500);c.globalAlpha=1;}
    const s1=1-E.outC(seg(z,.4,.6));if(s1>0){c.globalAlpha=s1;txt2(c,'지구',320,36,16,'#9ba3ad',700,'center');c.globalAlpha=1;}
    cap(c,'회전 2.5초(감속) → 줌 2.7초(지수) · 확대되면 시·도 경계로 교체(LOD)',16,344);
  }
};
export default demo;
