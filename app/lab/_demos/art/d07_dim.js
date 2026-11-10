// 만들어진 파일 — 원본: 모션 연출 실습 사전 아티팩트 d07. 직접 고치지 않는다 — 응용 팁 'dim' 적용본
/* eslint-disable */
// @ts-nocheck
import { seg, lerp, E, el } from "./helpers.js";
const demo = {
  dur: 5.4, rest: 2.8, noCompare: false,
  mount(sp){
    sp.style.background='#0f141b';
    const hd=el('div','ct-h',sp,'추천 상품');
    const C=[['무선 이어폰','129,000원','linear-gradient(135deg,#3a4b6b,#1c2433)'],['스마트 워치','249,000원','linear-gradient(135deg,#ff9a52,#b0422a)'],['블루투스 스피커','89,000원','linear-gradient(135deg,#3a6b5e,#1b2f2a)']];
    const others=[];let sel=null;
    C.forEach((d,i)=>{
      const card=el('div','ct-card',sp);
      const img=el('div','ct-img',card);img.style.background=d[2];
      const ci=el('i',null,img);
      const nm=el('div','ct-nm',card,d[0]);const pr=el('div','ct-pr',card,d[1]);
      if(i===1){sel={card,img,ci,nm,pr};card.style.zIndex=3;}
      else{Object.assign(card.style,{left:(30+i*200)+'px',top:'70px',width:'180px',height:'230px'});Object.assign(img.style,{width:'180px',height:'140px'});Object.assign(ci.style,{left:'55px',top:'35px',width:'70px',height:'70px'});Object.assign(nm.style,{left:'14px',top:'152px',fontSize:'16px'});Object.assign(pr.style,{left:'14px',top:'180px',fontSize:'14px'});others.push(card);}
    });
    const desc=el('div','ct-desc',sel.card,'하루 종일 쓰는 시계는 가벼워야 합니다. 32g 알루미늄 바디, 최대 7일 배터리, 수면·심박 측정 지원.');
    const btn=el('div','ct-btn',sel.card,'구매하기');
    const x=el('div','ct-x',sel.card,'✕');
    const rip=el('div','ct-rip',sp);
    return {hd,others,sel,det:[desc,btn,x],rip};
  },
  render(s,t,a){
    let p,q;
    if(a){p=t<3.8?E.inOutC(seg(t,.6,1.5)):1-E.inOutC(seg(t,3.8,4.6));}
    else{p=(t>=1.2&&t<3.8)?1:0;}
    const S=s.sel;
    const R=k=>lerp(k[0],k[1],p);
    Object.assign(S.card.style,{left:R([230,0])+'px',top:R([70,0])+'px',width:R([180,640])+'px',height:R([230,360])+'px',borderRadius:R([16,0])+'px'});
    Object.assign(S.img.style,{width:R([180,320])+'px',height:R([140,360])+'px'});
    Object.assign(S.ci.style,{left:R([55,90])+'px',top:R([35,110])+'px',width:R([70,140])+'px',height:R([70,140])+'px'});
    Object.assign(S.nm.style,{left:R([14,344])+'px',top:R([152,44])+'px',fontSize:R([16,28])+'px'});
    Object.assign(S.pr.style,{left:R([14,344])+'px',top:R([180,92])+'px',fontSize:R([14,18])+'px'});
    s.others.forEach(o=>{o.style.opacity=1-.5*p;o.style.transform='scale('+(1-.06*p)+')';});
    s.hd.style.opacity=1-p;
    s.det.forEach((d,i)=>{
      if(a){q=E.outC(seg(t,1.4+i*.12,1.9+i*.12))*(1-seg(t,3.6,3.85));}else q=p;
      d.style.opacity=q;d.style.transform='translateY('+((1-q)*16).toFixed(1)+'px)';
    });
    if(a&&t>.2&&t<.75){const r=seg(t,.2,.75);s.rip.style.display='block';Object.assign(s.rip.style,{left:(320-30)+'px',top:(160-30)+'px',opacity:1-r,transform:'scale('+(.4+r*1.2)+')'});}
    else s.rip.style.display='none';
  }
};
export default demo;
