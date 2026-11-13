// 만들어진 파일 — 원본: 시각 연출 사전 아티팩트 d62. 직접 고치지 않는다 — 응용 팁 'num10' 적용본
/* eslint-disable */
// @ts-nocheck

import { seg, E, canvas, rr } from "./helpers.js";
import { TAU, UI_SANS, bgFill, bgLogo, cap, clipArt, sstep, txt2, txtm, uiCursor, uiReset } from "./shared/common.js";

const HK=[{n:'① 결과 먼저',t0:.4,rel:.3,col:[255,138,61]},{n:'② 질문',t0:2.3,rel:.9,col:[111,211,255]},{n:'③ 숫자',t0:4.2,rel:.5,col:[190,150,255]},{n:'④ 직접 체험',t0:6.1,rel:.8,col:[62,207,142]}],HK_LEN=1.8,HK_BEFORE=7.4;
function hkScene(c,i,u,t){
  c.fillStyle='#0a0d16';c.fillRect(0,0,640,252);
  if(i===0){const l=E.outC(seg(u,0,.3));
    c.globalAlpha=l;rr(c,56-30*(1-l),52,236,148,10);c.fillStyle='#2a2f3b';c.fill();c.fillStyle='#3a4254';[[72,76,150],[72,96,190],[72,116,120]].forEach(q=>{rr(c,q[0]-30*(1-l),q[1],q[2],8,4);c.fill();});txt2(c,'PPT 같은 결과',70-30*(1-l),186,12,'#9ba3ad',600);
    c.save();rr(c,344+30*(1-l),52,240,148,10);c.clip();clipArt(c,344+30*(1-l),52,240,148,3,t);c.restore();rr(c,344.5+30*(1-l),52.5,239,147,10);c.strokeStyle='#ff8a3d';c.lineWidth=1.6;c.stroke();txt2(c,'완성된 결과',360+30*(1-l),186,12,'#ffd9b0',700);
    c.globalAlpha=sstep(.12,.3,u);txt2(c,'→',318,134,34,'#ff8a3d',700,'center');c.globalAlpha=1;
    c.globalAlpha=E.outC(seg(u,.3,.5));txt2(c,'30초 만에 이렇게 바뀝니다',320,236,24,'#f4efe4',700,'center');c.globalAlpha=1;}
  if(i===1){const q='AI 영상은 왜 PPT처럼 보일까?',n=Math.floor(q.length*seg(u,0,.9)),pul=.5+.5*Math.sin(u*9);
    c.globalAlpha=.1+.06*pul;txt2(c,'?',320,230,220,'#6fd3ff',700,'center');c.globalAlpha=1;txt2(c,q.slice(0,n),320,140,32,'#f4efe4',700,'center');
    if(u<1.5&&Math.floor(u*4)%2===0||n<q.length){c.fillStyle='#6fd3ff';c.font='700 32px '+UI_SANS;c.textAlign='center';const w=c.measureText(q.slice(0,n)).width,w2=c.measureText(q).width;c.fillRect(320-w2/2+w+3,112,3,34);}
    if(u>.9){c.globalAlpha=sstep(.9,1.2,u);txt2(c,'대답을 듣고 싶어지는 질문',320,196,14,'#9ba3ad',600,'center');c.globalAlpha=1;}}
  if(i===2){const n=Math.round(30-20*E.outC(seg(u,0,.5))),fin=u>=.5;
    txt2(c,fin?'30초 → 10초':n+'초',320,170,fin?84:96,fin?'#d8bfff':'#f4efe4',700,'center');
    if(fin){c.globalAlpha=sstep(.5,.7,u);txt2(c,'영상 한 편을 만드는 데 걸리는 시간(예시)',320,214,14,'#9ba3ad',600,'center');c.globalAlpha=1;rr(c,276,86,88,3,2);c.fillStyle='#b49cff';c.fill();}}
  if(i===3){const px=520+(320-520)*E.inOutC(seg(u,0,.4)),py=300+(190-300)*E.inOutC(seg(u,0,.4)),press=u>.4&&u<.5;
    rr(c,230,150,180,44,12);c.fillStyle=press?'#2fae78':'#3ecf8e';c.fill();txt2(c,'프롬프트 실행',320,178,16,'#06210f',700,'center');
    if(u>.4&&u<.9){c.save();rr(c,230,150,180,44,12);c.clip();c.globalAlpha=.4*(1-(u-.4)/.5);c.fillStyle='#fff';c.beginPath();c.arc(320,172,120*E.outC((u-.4)/.5),0,TAU);c.fill();c.restore();}
    const rp=E.outC(seg(u,.5,.8));c.globalAlpha=rp;rr(c,170,206+(1-rp)*20,300,26,8);c.fillStyle='rgba(62,207,142,.18)';c.fill();txt2(c,'✓ 완성',184,224+(1-rp)*20,13,'#3ecf8e',700);txt2(c,'지금 직접 해 보세요',320,224+(1-rp)*20,13,'#f4efe4',700,'center');c.globalAlpha=1;
    if(u<.9)uiCursor(c,px,py,u>.4&&u<.5?.85:1);}
}

const demo = {
  dur: 8.2, rest: 1.5, noCompare: false, levels: 0,
  mount(sp){sp.style.background='#0a0d16';return {ctx:canvas(sp)};},
  render(s,t,a){
    const c=s.ctx;uiReset(c);bgFill(c,'#0b0e16','#06080c');
    let hi=-1;HK.forEach((h,i)=>{if(t>=h.t0&&t<h.t0+HK_LEN)hi=i;});
    c.save();c.beginPath();c.rect(0,0,640,252);c.clip();
    if(a){if(hi>=0)hkScene(c,hi,t-HK[hi].t0,t);else{c.fillStyle='#05060a';c.fillRect(0,0,640,252);}}
    else{ /* 연출 전: 인사 → 로고 → 안내 → 마지막에야 약속 */
      c.fillStyle='#0a0d16';c.fillRect(0,0,640,252);const lg=E.outC(seg(t,1.0,2.0));
      if(lg>0){c.globalAlpha=lg;bgLogo(c,320,96,28*lg,1,3);txt2(c,'OMNIARK',320,148,20,'#f4efe4',700,'center');c.globalAlpha=1;}
      const g='안녕하세요, 오늘은 영상 연출에 대해 이야기해 볼게요',n=Math.floor(g.length*seg(t,3.2,5.0));if(n>0)txt2(c,g.slice(0,n),320,196,17,'#dfe5ee',600,'center');
      ['오늘의 순서','① 배경 설명','② 용어 정리'].forEach((x,i)=>{const al=E.outC(seg(t,5.2+i*.4,5.6+i*.4));if(al>0&&t<7.2){c.globalAlpha=al;txt2(c,x,70,60+i*22,13,'#9ba3ad',600);c.globalAlpha=1;}});
      if(t>=HK_BEFORE){c.fillStyle='rgba(255,255,255,'+Math.max(0,.3-(t-HK_BEFORE)*1.5)+')';c.fillRect(0,0,640,252);txt2(c,'30초 만에 이렇게 바뀝니다',320,136,26,'#ff8a3d',700,'center');}}
    c.restore();
    /* 위쪽 이름표 */
    const nm=a?(hi>=0?HK[hi].n:'—'):(t<HK_BEFORE?'인사 · 로고 · 순서 안내':'약속(이제야)');
    rr(c,14,12,160,20,10);c.fillStyle='rgba(0,0,0,.65)';c.fill();txt2(c,nm,26,26,11.5,a&&hi>=0?'rgb('+HK[hi].col+')':'#dfe5ee',700);
    /* 핵심 약속이 보이는 시각 눈금자 */
    const X=q=>40+q*70,Y0=290;c.fillStyle='#0e121a';rr(c,24,Y0-26,592,64,8);c.fill();
    for(let q=0;q<=8;q++){c.fillStyle='#262e3d';c.fillRect(X(q),Y0,1,6);txtm(c,q+'s',X(q),Y0+16,8,'#5b6577','center');}
    c.fillStyle='#262e3d';c.fillRect(40,Y0-1,560,2);
    c.strokeStyle='#ff8a3d';c.setLineDash([3,3]);c.lineWidth=1.2;c.beginPath();c.moveTo(X(3),Y0-22);c.lineTo(X(3),Y0+8);c.stroke();c.setLineDash([]);txtm(c,'3초(경험칙)',X(3)+4,Y0-14,8.5,'#ffb27f');
    txtm(c,'핵심 약속이 처음 읽히는 시각',32,Y0-18,9,'#8b94a3');
    if(a){HK.forEach((h,i)=>{const on=hi===i||t>=h.t0+h.rel,cur=hi===i&&t-h.t0>=h.rel;c.fillStyle='rgba('+h.col+','+(on?1:.28)+')';c.beginPath();c.arc(X(h.rel),Y0,cur?6:4.2,0,TAU);c.fill();if(cur){c.strokeStyle='rgba('+h.col+',.6)';c.lineWidth=1.5;c.beginPath();c.arc(X(h.rel),Y0,10,0,TAU);c.stroke();}});
      txtm(c,'①0.3  ②0.9  ③0.5  ④0.8 초',612,Y0-18,9,'#3ecf8e','right');}
    else{const on=t>=HK_BEFORE;c.fillStyle='#ff5f57';c.beginPath();c.arc(X(HK_BEFORE),Y0,on?6:4,0,TAU);c.fill();txtm(c,on?'7.4초 — 3초 선을 한참 넘김 ✗':'아직 약속이 안 나옴…',612,Y0-18,9,'#ff7a70','right');}
    cap(c,a?'훅 4종의 약속이 모두 3초 안(경험칙)에 읽힘 · 1.8초씩 보여 줌':'연출 전: 인사·로고·순서 안내가 먼저 → 약속이 7.4초에야 나옴',16,350);
  }
};
export default demo;
