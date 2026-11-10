// 만들어진 파일 — 원본: 시각 연출 사전 아티팩트 d22. 직접 고치지 않는다
/* eslint-disable */
// @ts-nocheck

import { seg, lerp, E, canvas } from "./helpers.js";
import { cap, txt2 } from "./shared/common.js";
import { HASGEO, drawPath, geo, noGeoMsg } from "./shared/g21.js";
import * as d3 from "d3-geo";

const KR_VAL={'경기':100,'서울':94,'부산':61,'인천':58,'경남':52,'대구':47,'경북':44,'충남':41,'대전':40,'울산':38,'광주':35,'전남':33,'전북':31,'충북':30,'강원':27,'세종':22,'제주':20};
const KR_ORDER=Object.keys(KR_VAL).sort((a,b)=>KR_VAL[a]-KR_VAL[b]);

const demo = {
  dur: 6, rest: 5.2, noCompare: false, levels: 0,
  mount(sp){sp.style.background='#070a10';return {ctx:canvas(sp)};},
  render(s,t,a){
    const c=s.ctx;if(!HASGEO){noGeoMsg(c);return;}
    c.setTransform(2,0,0,2,0,0);c.fillStyle='#070a10';c.fillRect(0,0,640,360);const G=geo();
    if(!s.pr){s.pr=d3.geoMercator().fitExtent([[18,22],[340,342]],G.kr);s.ctr=s.pr(d3.geoCentroid(G.kr.features.find(f=>f.properties.name==='경기')));}   /* 투영·중심점은 한 번만 계산 */
    const pr=s.pr,path=d3.geoPath(pr,c);
    const ramp=v=>{const p=Math.pow(v/100,.8),a0=[36,48,68],b0=[255,138,61];return 'rgb('+a0.map((x,i)=>Math.round(x+(b0[i]-x)*p)).join(',')+')';};
    c.lineWidth=.8;c.strokeStyle='#0b0e13';
    G.kr.features.forEach(f=>{
      const nm=f.properties.name,v=KR_VAL[nm],idx=KR_ORDER.indexOf(nm);
      const st=.4+idx*.2,p=a?E.outC(seg(t,st,st+.5)):0;
      c.fillStyle=a?(p>0?ramp(lerp(0,v,p)):'#222b3a'):'#252e3d';
      drawPath(c,path,f);c.fill();c.stroke();
    });
    if(!a){cap(c,'연출 전: 지도만 있고 값을 읽을 수 없음 · 예시 데이터',16,344);return;}
    const top=G.kr.features.find(f=>f.properties.name==='경기'),tp=E.outC(seg(t,4.2,4.7));
    if(tp>0){c.save();c.globalAlpha=tp*(.6+.4*Math.sin(t*6));c.strokeStyle='#fff';c.lineWidth=1.6;drawPath(c,path,top);c.stroke();c.restore();}
    const ctr=s.ctr;const la=E.outC(seg(t,4.4,4.9));
    if(la>0){c.save();c.globalAlpha=la;c.strokeStyle='rgba(255,255,255,.8)';c.lineWidth=1;c.beginPath();c.moveTo(ctr[0],ctr[1]);c.lineTo(ctr[0]+42,ctr[1]-30);c.lineTo(372,ctr[1]-30);c.stroke();c.restore();}
    /* 오른쪽: 상위 5개 순위 막대 */
    txt2(c,'지역별 지표(예시)',380,46,14,'#ece7dc',700);txt2(c,'상위 5개 지역',380,62,11,'#9ba3ad',500);
    const T5=KR_ORDER.slice().reverse().slice(0,5);
    T5.forEach((nm,i)=>{
      const st=3.3+i*.22,p=E.outExpo(seg(t,st,st+.9)),y=92+i*40,v=KR_VAL[nm];
      txt2(c,nm,380,y+14,13,'#ece7dc',700);
      c.fillStyle='#1c2330';c.fillRect(430,y,176,18);
      c.fillStyle=i===0?'#ff8a3d':'#4a5260';c.fillRect(430,y,176*v/100*p,18);
      txt2(c,Math.round(v*p)+'',430+176*v/100*p+6,y+14,12,i===0?'#ffb27a':'#9ba3ad',700);
    });
    /* 범례 */
    const g=c.createLinearGradient(380,0,606,0);g.addColorStop(0,'rgb(36,48,68)');g.addColorStop(1,'rgb(255,138,61)');c.fillStyle=g;c.fillRect(380,312,226,8);
    txt2(c,'낮음',380,334,10,'#9ba3ad');txt2(c,'높음',606,334,10,'#9ba3ad',500,'right');
    const sum=Math.round(KR_ORDER.reduce((x,n)=>x+KR_VAL[n],0)*E.outExpo(seg(t,.4,3.9)));txt2(c,'전체 합계 '+sum,380,296,13,'#ffd9b8',700);
    cap(c,'값이 낮은 지역부터 0.2초 간격으로 켜짐 → 1위 강조 → 순위 막대 · 예시 데이터',16,344);
  }
};
export default demo;
