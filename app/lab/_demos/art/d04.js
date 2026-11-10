// 만들어진 파일 — 원본: 시각 연출 사전 아티팩트 d04. 직접 고치지 않는다
/* eslint-disable */
// @ts-nocheck

import { seg, lerp, E, el } from "./helpers.js";

const demo = {
  dur: 4.6, rest: 3.6, noCompare: false, levels: 0,
  mount(sp){
    const A=el('div','wp-a',sp,'<h4>2026 3분기 실적</h4><ul><li>매출이 증가함 (38%)</li><li>신규 고객이 늘어남</li><li>비용 절감 진행 중</li></ul>');
    const B=el('div','wp-b',sp,'<div class="e">2026 · Q3 매출 성장</div><div class="big">+38%</div><div class="cap">전년 같은 분기 대비 · 예시 데이터</div><svg width="200" height="90" viewBox="0 0 200 90" aria-hidden="true"><polyline points="0,80 30,72 60,74 90,58 120,52 150,34 180,20 200,8" fill="none" stroke="#ff8a3d" stroke-width="3" stroke-linejoin="round"/><circle cx="200" cy="8" r="0" fill="#ff8a3d"/></svg>');
    const line=el('div','wp-line',sp);el('div','wp-knob',line);
    const la=el('div','wp-lab',sp,'BEFORE');la.style.left='14px';
    const lb=el('div','wp-lab',sp,'AFTER');lb.style.right='14px';
    return {A,B,line,la,lb};
  },
  render(s,t,a){
    if(!a){
      const cut=t>=2;
      s.B.style.clipPath='none';s.B.style.display=cut?'block':'none';
      s.line.style.display='none';s.la.style.display='none';s.lb.style.display='none';return;
    }
    s.B.style.display='block';s.line.style.display='block';s.la.style.display='block';s.lb.style.display='block';
    let x=640;
    if(t<2.0)x=lerp(640,120,E.outC(seg(t,.6,2.0)));
    else x=lerp(120,320,E.inOutC(seg(t,2.4,3.2)));
    s.B.style.clipPath='inset(0 0 0 '+x.toFixed(1)+'px)';
    s.line.style.left=(x-1)+'px';s.line.style.opacity=seg(t,.5,.7);
    s.la.style.opacity=seg(t,3.2,3.5);s.lb.style.opacity=seg(t,3.2,3.5);
  }
};
export default demo;
