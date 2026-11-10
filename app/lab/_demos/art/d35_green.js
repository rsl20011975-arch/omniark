// 만들어진 파일 — 원본: 시각 연출 사전 아티팩트 d35. 직접 고치지 않는다 — 응용 팁 'green' 적용본
/* eslint-disable */
// @ts-nocheck

import { seg, E, canvas } from "./helpers.js";
import { TAU, cap, fuBr, glowDot, sstep, txtm, uiReset } from "./shared/common.js";

const FU={cy:'150,255,160',or:'255,138,61'};
const FU_PK=41,FU_Y=Array.from({length:60},(_,i)=>.5+.2*Math.sin(i*.28)+.1*Math.sin(i*.9+1)+.3*Math.exp(-Math.pow((i-FU_PK)/4,2)));
function fuHex(r,k){return ((Math.imul(r*7+k*13+11,2654435761)>>>8)&255).toString(16).toUpperCase().padStart(2,'0');}

const demo = {
  dur: 6, rest: 4.4, noCompare: false, levels: 0,
  mount(sp){sp.style.background='#05080c';return {ctx:canvas(sp)};},
  render(s,t,a){
    const c=s.ctx;uiReset(c);c.fillStyle='#05080c';c.fillRect(0,0,640,360);
    const col=al=>'rgba('+FU.cy+','+al+')',ap=i=>a?E.outC(seg(t,.3+.2*i,.8+.2*i)):1;
    const panels=[[28,40,180,170],[220,40,210,170],[442,40,174,280],[28,222,402,98]];
    /* 헤더 */
    const hd=a?E.outC(seg(t,.1,.6)):1;c.globalAlpha=hd;txtm(c,'SYS // ANALYTICS 02',28,28,10,col(.9));txtm(c,a?'T+'+(t<10?'0':'')+t.toFixed(1)+' s':'T+00.0 s',616,28,10,col(.6),'right');
    c.strokeStyle=col(.25);c.lineWidth=1;c.beginPath();c.moveTo(150,24);c.lineTo(500,24);c.stroke();c.globalAlpha=1;
    panels.forEach((p,i)=>{const k=ap(i);c.globalAlpha=1;c.fillStyle=col(a?.045*k:.05);c.fillRect(p[0],p[1],p[2],p[3]);
      if(a){c.strokeStyle=col(.18*k);c.lineWidth=1;c.strokeRect(p[0]+.5,p[1]+.5,p[2],p[3]);fuBr(c,p[0],p[1],p[2],p[3],k,col(.95));}else{c.strokeStyle=col(.3);c.lineWidth=1;c.strokeRect(p[0]+.5,p[1]+.5,p[2],p[3]);}});
    /* 1. 원형 게이지 */
    {const k=ap(0),cx=118,cy=132,A0=Math.PI*.75,SP=Math.PI*1.5,v=a?E.outExpo(seg(t,1,2.7)):1;const val=.87*v;
      c.globalAlpha=k;txtm(c,'LOAD',40,58,9,col(.8));
      c.lineWidth=a?7:4;c.strokeStyle=col(.16);c.beginPath();c.arc(cx,cy,48,A0,A0+SP);c.stroke();
      c.strokeStyle=a?col(1):col(.7);c.beginPath();c.arc(cx,cy,48,A0,A0+SP*val);c.stroke();
      if(a){const tipA=A0+SP*val;if(v>.02){c.globalCompositeOperation='lighter';glowDot(c,[150,255,160],cx+Math.cos(tipA)*48,cy+Math.sin(tipA)*48,13,.9*k);c.globalCompositeOperation='source-over';}c.globalAlpha=k;
        const nt=Math.round(54*E.outC(seg(t,.6,1.5)));for(let i=0;i<=54;i++){if(i>nt)break;const an=A0+SP*i/54,L=i%9===0?8:4;c.strokeStyle=col(i%9===0?.85:.4);c.lineWidth=1;c.beginPath();c.moveTo(cx+Math.cos(an)*60,cy+Math.sin(an)*60);c.lineTo(cx+Math.cos(an)*(60+L),cy+Math.sin(an)*(60+L));c.stroke();}
        c.setLineDash([3,5]);c.lineDashOffset=-t*9;c.strokeStyle=col(.35);c.lineWidth=1;c.beginPath();c.arc(cx,cy,36,0,TAU);c.stroke();c.setLineDash([]);}
      txtm(c,String(Math.round(87*(a?v:1))),cx,cy+10,30,a?'#d8f3ff':col(.9),'center');txtm(c,'% NOMINAL',cx,cy+28,9,col(.7),'center');c.globalAlpha=1;}
    /* 2. 선 차트 */
    {const k=ap(1),X0=234,X1=418,Y0=84,Y1=190,p=a?E.inOutC(seg(t,1.1,3.2)):1,idx=p*59;c.globalAlpha=k;txtm(c,'THROUGHPUT',232,58,9,col(.8));
      c.strokeStyle=col(.12);c.lineWidth=1;if(a)c.setLineDash([2,4]);for(let i=0;i<=4;i++){const y=Y0+(Y1-Y0)*i/4;c.beginPath();c.moveTo(X0,y);c.lineTo(X1,y);c.stroke();}for(let i=0;i<=6;i++){const x=X0+(X1-X0)*i/6;c.beginPath();c.moveTo(x,Y0);c.lineTo(x,Y1);c.stroke();}c.setLineDash([]);
      const pt=i=>[X0+(X1-X0)*i/59,Y1-(Y1-Y0)*(FU_Y[Math.floor(i)]*(1-(i%1))+FU_Y[Math.min(59,Math.floor(i)+1)]*(i%1))/1.05];
      const ptsN=Math.floor(idx);c.beginPath();c.moveTo(X0,Y1);for(let i=0;i<=ptsN;i++){const q=pt(i);c.lineTo(q[0],q[1]);}const hq=pt(Math.min(59,idx));c.lineTo(hq[0],hq[1]);c.lineTo(hq[0],Y1);c.closePath();
      if(a){const g=c.createLinearGradient(0,Y0,0,Y1);g.addColorStop(0,col(.28));g.addColorStop(1,col(0));c.fillStyle=g;c.fill();}
      c.beginPath();for(let i=0;i<=ptsN;i++){const q=pt(i);i?c.lineTo(q[0],q[1]):c.moveTo(q[0],q[1]);}c.lineTo(hq[0],hq[1]);c.strokeStyle=col(a?1:.75);c.lineWidth=a?1.8:1.2;c.stroke();
      if(a&&p>.01&&p<1){c.globalCompositeOperation='lighter';glowDot(c,[150,255,160],hq[0],hq[1],12,.95);c.globalCompositeOperation='source-over';c.globalAlpha=k;}
      if(idx>=FU_PK){const q=pt(FU_PK),pa=a?E.outC((idx-FU_PK)/5):1;c.globalAlpha=k*pa;c.strokeStyle='rgb('+FU.or+')';c.lineWidth=1.4;const s2=9;fuBr(c,q[0]-s2,q[1]-s2,s2*2,s2*2,1,'rgb('+FU.or+')');txtm(c,'PEAK 94',q[0]+14,q[1]-17,10,'rgb(255,178,127)');}
      c.globalAlpha=1;}
    /* 3. 16진수 데이터 흐름 */
    {const k=ap(2);c.globalAlpha=k;txtm(c,'DATA STREAM',454,58,9,col(.8));
      c.save();c.beginPath();c.rect(442,62,174,258);c.clip();const off=a?t*22:0,r0=Math.floor(off/12)-1;
      for(let r=r0;r<r0+25;r++){const y=70+(r-off/12)*12+12,al=a?sstep(62,92,y)*(1-sstep(292,318,y)):.8;if(al<=.01)continue;
        const hot=r%11===0;c.globalAlpha=k*al*(hot?1:.62);const addr='0x'+(r*8&0xffff).toString(16).toUpperCase().padStart(4,'0');
        txtm(c,addr,454,y,9.5,hot?'rgb('+FU.or+')':col(.7));let row='';for(let b=0;b<8;b++)row+=fuHex(r,b)+' ';txtm(c,row,500,y,9.5,hot?'rgb(255,178,127)':col(.95));}
      c.restore();c.globalAlpha=1;}
    /* 4. 신호 막대 */
    {const k=ap(3);c.globalAlpha=k;txtm(c,'SIGNAL',40,240,9,col(.8));
      for(let i=0;i<32;i++){const x=40+i*12.1,base=a?.3+.7*Math.abs(Math.sin(t*2.1+i*.7)*Math.sin(t*.9+i*1.3+1)):.55,h=base*66*(a?E.outC(seg(t,.9+i*.02,1.5+i*.02)):1);
        c.fillStyle=col(a?.7:.5);c.fillRect(x,308-h,8,h);if(a){c.fillStyle='rgba(216,243,255,.9)';c.fillRect(x,308-h,8,2);}}
      c.globalAlpha=1;}
    if(a){const sy=-20+400*E.inOutC(seg(t,.1,1.3));if(sy>-10&&sy<372){c.globalCompositeOperation='lighter';const g=c.createLinearGradient(0,sy-26,0,sy+2);g.addColorStop(0,col(0));g.addColorStop(1,col(.3));c.fillStyle=g;c.fillRect(0,sy-26,640,28);c.fillStyle=col(.9);c.fillRect(0,sy,640,1.2);c.globalCompositeOperation='source-over';}}
    cap(c,a?'꺾쇠가 뻗고 패널이 차례로 켜짐 → 스캔선 → 게이지(감속)·차트(왼→오 그려짐)·데이터 흐름·신호 막대가 함께 움직임':'연출 전: 같은 칸에 숫자와 선만 있음 · 움직이는 곳이 없음',16,350);
  }
};
export default demo;
