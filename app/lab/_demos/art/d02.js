// 만들어진 파일 — 원본: 시각 연출 사전 아티팩트 d02. 직접 고치지 않는다
/* eslint-disable */
// @ts-nocheck

import { seg, E, el } from "./helpers.js";

const demo = {
  dur: 4.2, rest: 3.2, noCompare: false, levels: 0,
  mount(sp){
    sp.style.background='#0e1117';
    const word=el('div','mr-word',sp,'MOTION');
    const bar=el('div','mr-bar',sp);
    const sb=el('div','mr-subbox',sp);const sub=el('div','mr-sub',sb,'가렸다가 드러내면, 시선이 따라온다');
    const ul=el('div','mr-ul',sp);
    const st=el('div','mr-st',sp);
    return {word,bar,sub,ul,st};
  },
  render(s,t,a){
    const W=s.word.offsetWidth||420;
    if(!a){
      const p=seg(t,.4,.8);
      s.word.style.clipPath='none';s.word.style.opacity=p;
      s.bar.style.opacity=0;s.sub.style.transform='none';s.sub.style.opacity=p;
      s.ul.style.transform='scaleX(1)';s.ul.style.opacity=p;
      s.st.textContent=t<.4?'빈 화면':(t<.8?'페이드 인':'완성');return;
    }
    const p=E.inOutC(seg(t,.4,1.6));
    s.word.style.opacity=1;
    s.word.style.clipPath='inset(-10px '+((1-p)*100).toFixed(2)+'% -10px 0)';
    const g=E.outC(seg(t,.1,.35))*(1-E.inC(seg(t,1.6,1.9)));
    s.bar.style.opacity=g>0?1:0;
    s.bar.style.left=(60+p*W-3)+'px';
    s.bar.style.transform='scaleY('+g+')';
    const q=E.outExpo(seg(t,1.8,2.5));
    s.sub.style.opacity=1;s.sub.style.transform='translateY('+((1-q)*110).toFixed(1)+'%)';
    s.ul.style.opacity=1;s.ul.style.transform='scaleX('+E.inOutC(seg(t,2.4,3.0))+')';
    s.st.textContent=t<.4?'가려진 상태':(t<1.6?'드러나는 중 — 막대가 지나간 곳만 보임':'완성');
  }
};
export default demo;
