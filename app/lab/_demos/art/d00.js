// 만들어진 파일 — 원본: 시각 연출 사전 아티팩트 d00. 직접 고치지 않는다
/* eslint-disable */
// @ts-nocheck

import { seg, E, el } from "./helpers.js";

const demo = {
  dur: 2.4, rest: 1.6, noCompare: true, levels: 0,
  mount(sp){
    sp.style.background='#0b0e12';
    const rows=[['직선','linear',E.lin],['감속','ease-out',E.outC],['가속→감속','ease-in-out',E.inOutC],['살짝 넘쳤다 복귀','back-out',E.outBack]];
    return {rows:rows.map((r,i)=>{
      const row=el('div','ez-row',sp);row.style.top=(36+i*74)+'px';
      el('div','ez-l',row,r[0]+'<small>'+r[1]+'</small>');
      el('div','ez-track',row);
      const gs=[];for(let k=0;k<=12;k++){const g=el('div','ez-g',row);g.style.left=(160+r[2](k/12)*420)+'px';gs.push(g);}
      const d=el('div','ez-dot',row);
      return {f:r[2],d,gs};
    })};
  },
  render(s,t){
    const p=seg(t,.2,1.4);
    s.rows.forEach(r=>{r.d.style.left=(160+r.f(p)*420)+'px';r.gs.forEach((g,k)=>{g.style.background=(k/12<=p)?'#8c949e':'#2f3640';});});
  }
};
export default demo;
