// 만들어진 파일 — 원본: 시각 연출 사전 아티팩트 d03. 직접 고치지 않는다 — 응용 팁 'stagger' 적용본
/* eslint-disable */
// @ts-nocheck

import { seg, E, el, fmt } from "./helpers.js";

const demo = {
  dur: 4.6, rest: 3.6, noCompare: false, levels: 0,
  mount(sp){
    sp.style.background='#0d1015';
    const D=[['7월',1200],['8월',2100],['9월',3400],['10월',6100],['11월',12800]];
    el('div','ch-lab',sp,'11월 월간 조회수 · 예시 데이터');
    const num=el('div','ch-num',sp,'0');
    const badge=el('div','ch-badge',sp,'+110%');
    const base=el('div','ch-base',sp);
    const bars=D.map((d,i)=>{
      const x=80+i*92,h=d[1]/12800*200;
      const b=el('div','ch-bar',sp);b.style.left=x+'px';b.style.height=h+'px';b.style.bottom='60px';
      const v=el('div','ch-val',sp,fmt(d[1]));v.style.left=(x-10)+'px';v.style.top=(300-h-24)+'px';
      const m=el('div','ch-mo',sp,d[0]);m.style.left=(x-10)+'px';
      return {b,v,h,last:i===4};
    });
    return {num,badge,base,bars};
  },
  render(s,t,a){
    if(!a){
      s.base.style.transform='none';
      s.bars.forEach(o=>{o.b.style.transform='none';o.b.style.background='#6b7480';o.b.style.opacity=1;o.v.style.opacity=1;});
      s.num.textContent='12,800';s.badge.style.transform='none';s.badge.style.opacity=1;return;
    }
    s.base.style.transform='scaleX('+E.outC(seg(t,.2,.6))+')';
    const dim=E.inOutC(seg(t,2.7,3.1));
    s.bars.forEach((o,i)=>{
      const st=.5+i*.25,p=E.outC(seg(t,st,st+.8));
      o.b.style.transform='scaleY('+p+')';
      o.b.style.background=o.last?'var(--accent)':'#4a5260';
      o.b.style.opacity=o.last?1:1-.5*dim;
      o.v.style.opacity=o.last?seg(t,1.1,1.3):seg(t,st+.6,st+.8)*(1-.5*dim);
      if(o.last)o.v.textContent=fmt(12800*E.outExpo(seg(t,1.1,2.6)));
    });
    s.num.textContent=fmt(12800*E.outExpo(seg(t,1.1,2.6)));
    const b=seg(t,2.5,2.9);
    s.badge.style.opacity=b>0?1:0;s.badge.style.transform='scale('+(b>0?E.outBack(b):0)+')';
  }
};
export default demo;
