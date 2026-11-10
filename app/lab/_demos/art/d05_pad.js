// 만들어진 파일 — 원본: 모션 연출 실습 사전 아티팩트 d05. 직접 고치지 않는다 — 응용 팁 'pad' 적용본
/* eslint-disable */
// @ts-nocheck
import { seg, lerp, E, el, box } from "./helpers.js";
const demo = {
  dur: 5.6, rest: 4.6, noCompare: false,
  mount(sp){
    const db=el('div','db',sp);
    box(db,'bx side',0,0,120,360);
    [60,92,124,156].forEach((y,i)=>box(db,'bx mi'+(i===0?' on':''),12,y,96,22));
    box(db,'bx hd',120,0,520,48);
    box(db,'ttl',140,13,200,24,'대시보드');
    box(db,'bx btn',540,10,84,28,'내보내기');
    [['방문자','8,420',136,150],['이번 달 매출','₩3.2M',298,150],['전환율','4.1%',460,164]].forEach(c=>box(db,'bx card',c[2],64,c[3],80,'<small>'+c[0]+'</small><b>'+c[1]+'</b>'));
    const ch=box(db,'bx chart',136,160,488,184);
    ch.innerHTML='<svg width="488" height="184" viewBox="0 0 488 184" aria-hidden="true"><polyline points="20,150 80,138 140,142 200,110 260,118 320,82 380,70 440,40 468,34" fill="none" stroke="#6fd3ff" stroke-width="2.5"/><line x1="20" y1="160" x2="468" y2="160" stroke="#2c3646"/></svg>';
    const spot=el('div','spot',db);
    const red=el('div','redbox',db);
    const call=el('div','callout',db);
    const T=[{x:298,y:64,w:150,h:80,l:'① 이번 달 매출부터 확인'},{x:136,y:160,w:488,h:184,l:'② 추이 그래프 읽기'},{x:540,y:10,w:84,h:28,l:'③ 내보내기 클릭'}];
    return {db,spot,red,call,T};
  },
  render(s,t,a){
    const T=s.T,pad=24;
    const idx=t<1.9?0:(t<3.5?1:2);
    if(!a){
      s.spot.style.display='none';s.db.style.transform='none';
      const on=t>.4;s.red.style.display=on?'block':'none';
      const r=T[idx];Object.assign(s.red.style,{left:(r.x-3)+'px',top:(r.y-3)+'px',width:(r.w+6)+'px',height:(r.h+6)+'px'});
      s.call.className='callout plain';s.call.style.display=on?'block':'none';s.call.style.opacity=1;s.call.textContent=r.l;
      const ly=idx===1?r.y-26:r.y+r.h+8;s.call.style.left=Math.min(r.x,480)+'px';s.call.style.top=ly+'px';return;
    }
    s.red.style.display='none';s.spot.style.display='block';s.call.className='callout';s.call.style.display='block';
    const F={x:0,y:0,w:640,h:360};
    const L=(A,B,p)=>({x:lerp(A.x,B.x,p),y:lerp(A.y,B.y,p),w:lerp(A.w,B.w,p),h:lerp(A.h,B.h,p)});
    let r;
    if(t<1.8)r=L(F,T[0],E.outC(seg(t,.2,.8)));
    else if(t<3.4)r=L(T[0],T[1],E.inOutC(seg(t,1.8,2.4)));
    else r=L(T[1],T[2],E.inOutC(seg(t,3.4,4.0)));
    const dim=.68*seg(t,.2,.6);
    Object.assign(s.spot.style,{left:(r.x-pad)+'px',top:(r.y-pad)+'px',width:(r.w+pad*2)+'px',height:(r.h+pad*2)+'px',boxShadow:'0 0 0 2000px rgba(4,7,11,'+dim.toFixed(3)+')'});
    s.spot.style.outlineColor='rgba(255,138,61,'+seg(t,.4,.8)+')';
    const cx=r.x+r.w/2,cy=r.y+r.h/2;
    s.db.style.transformOrigin=cx+'px '+cy+'px';
    s.db.style.transform='scale('+(1+.08*seg(t,.2,.8)*(idx===1&&t>2.2?.4:1))+')';
    const win=[[.9,1.8],[2.5,3.4],[4.1,9]][idx];
    const op=Math.min(seg(t,win[0],win[0]+.2),1-seg(t,win[1]-.15,win[1]));
    const tr=T[idx];s.call.textContent=tr.l;s.call.style.opacity=op;
    s.call.style.left=Math.min(tr.x,470)+'px';
    s.call.style.top=(idx===1?tr.y-pad-34:tr.y+tr.h+pad+8)+'px';
  }
};
export default demo;
