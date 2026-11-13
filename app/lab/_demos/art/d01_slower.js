// 만들어진 파일 — 원본: 시각 연출 사전 아티팩트 d01. 직접 고치지 않는다 — 응용 팁 'slower' 적용본
/* eslint-disable */
// @ts-nocheck

import { seg, E, el } from "./helpers.js";

const demo = {
  dur: 4.6, rest: 3.4, noCompare: false, levels: 7,
  mount(sp){
    sp.style.background='#0b0d10';
    const wrap=el('div','kt',sp);
    const lines=[[['평범한',0],['자막을',0]],[['광고처럼',1],['바꾸는',0]],[['5가지',2],['방법',0]]];
    const words=[];
    lines.forEach(ln=>{const L=el('div','kt-line',wrap);ln.forEach(([w,k])=>{const b=el('span','kt-w',L);const hl=k===1?el('span','kt-hl',b):null;const tx=el('span','kt-tx',b,w);words.push({b,tx,k,hl});});});
    const tag=el('div','kt-tag',sp,'EP.01 · 시선 집중');
    return {wrap,words,tag};
  },
  render(s,t,a,lv){
    if(!a){
      const p=seg(t,.3,.6);
      s.wrap.style.transform='none';
      s.words.forEach(w=>{w.b.style.opacity=p;w.b.style.transform='none';w.b.style.filter='none';w.tx.style.color='';if(w.hl)w.hl.style.transform='scaleX(0)';});
      s.tag.style.opacity=p;return;
    }
    const L=lv==null?7:lv;                      /* 만드는 순서 L단계까지 적용 */
    s.wrap.style.transform=L>=6?'scale('+(1+.04*E.outC(seg(t,0,4.4)))+')':'none';
    s.words.forEach((w,i)=>{
      const st=L>=2?.25+i*.45:.25,p=L>=3?E.outExpo(seg(t,st,st+.7)):1;
      w.b.style.opacity=seg(t,st,st+(L>=3?.25:.12));
      let sc=1;
      if(L>=5&&w.k===2){const q=seg(t,2.1,2.5);sc=1+.35*Math.sin(Math.PI*q);}
      w.b.style.transform='translateY('+((1-p)*60).toFixed(2)+'px) scale('+sc.toFixed(3)+')';
      w.b.style.filter='blur('+((1-p)*8).toFixed(2)+'px)';
      if(w.hl){const h=L>=4?E.outC(seg(t,1.6,2.0)):0;w.hl.style.transform='scaleX('+h+')';w.tx.style.color=h>.55?'#111':'';}
      if(w.k===2)w.tx.style.color=(L>=5&&t>2.1)?'var(--accent)':'';
    });
    s.tag.style.opacity=seg(t,2.6,3.0);
  }
};
export default demo;
