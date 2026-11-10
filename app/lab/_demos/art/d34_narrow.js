// 만들어진 파일 — 원본: 시각 연출 사전 아티팩트 d34. 직접 고치지 않는다 — 응용 팁 'narrow' 적용본
/* eslint-disable */
// @ts-nocheck

import { seg, E, canvas, rr } from "./helpers.js";
import { TAU, UI_SANS, bgFill, cap, clamp01, txt2, uiReset } from "./shared/common.js";

const CH_TXT={u1:'이번 달 매출 보고서, 영상으로 만들어줘',a1:'좋아요. 숫자는 카운트업으로 보여 주고, 가장 큰 지역 하나만 주황으로 강조할게요.',u2:'좋아, 그걸로 해줘'};
function chWrap(c,text,maxW){const out=[],starts=[];let cur='',pos=0,st=0;
  text.split(' ').forEach((w,i)=>{const tst=cur?cur+' '+w:w;if(c.measureText(tst).width>maxW&&cur){out.push(cur);starts.push(st);st=pos;cur=w;}else cur=tst;pos+=w.length+1;});
  if(cur){out.push(cur);starts.push(st);}return {lines:out,starts};}

const demo = {
  dur: 6.8, rest: 6.4, noCompare: false, levels: 0,
  mount(sp){sp.style.background='#080a10';return {ctx:canvas(sp)};},
  render(s,t,a){
    const c=s.ctx;uiReset(c);bgFill(c,'#0b0e16','#06080c');
    const X=120,Y=44,W=400,H=246,AT=Y+46,AB=Y+H-10;
    c.save();c.shadowColor='rgba(0,0,0,.55)';c.shadowBlur=36;c.shadowOffsetY=14;rr(c,X,Y,W,H,14);c.fillStyle='#10141c';c.fill();c.restore();rr(c,X,Y,W,H,14);c.strokeStyle='#262e3d';c.lineWidth=1;c.stroke();
    c.save();rr(c,X,Y,W,H,14);c.clip();c.fillStyle='#161b26';c.fillRect(X,Y,W,36);c.fillStyle='#262e3d';c.fillRect(X,Y+36,W,1);c.restore();
    const ag=c.createLinearGradient(X+14,Y+8,X+34,Y+28);ag.addColorStop(0,'#ffb27f');ag.addColorStop(1,'#ff6a1e');c.fillStyle=ag;c.beginPath();c.arc(X+26,Y+18,10,0,TAU);c.fill();
    txt2(c,'AI 어시스턴트',X+44,Y+16,12,'#dfe5ee',600);c.fillStyle='#3ecf8e';c.beginPath();c.arc(X+47,Y+26,2.4,0,TAU);c.fill();txt2(c,'온라인',X+54,Y+29,9.5,'#8b94a3',500);
    c.font='500 14.5px '+UI_SANS;const LHc=21,PAD=12;
    const u1=chWrap(c,CH_TXT.u1,150),a1=chWrap(c,CH_TXT.a1,215),u2=chWrap(c,CH_TXT.u2,230);
    const wOf=L=>Math.max(...L.lines.map(l=>c.measureText(l).width))+PAD*2;
    const TS=2.6,N=CH_TXT.a1.length,n=a?Math.max(0,Math.min(N,Math.floor(22*(t-TS)+1.2*Math.sin((t-TS)*6)))):N,tEnd=TS+N/22;
    /* 말풍선 높이 계산(줄이 늘 때 부드럽게) */
    const ap=(t0,d)=>a?E.outC(seg(t,t0,t0+(d||.35))):(t>=.5?1:0);
    const hU1=(u1.lines.length*LHc+16),hU2=(u2.lines.length*LHc+16);
    let a1Lines=a1.lines.length,a1H;
    if(a){let L=0;a1.starts.forEach((st,i)=>{if(n>st)L=i+1;});const fr=L>0?E.outC(clamp01((n-a1.starts[L-1])/5)):0;a1H=t<TS?36:Math.max(36,(Math.max(0,L-1)+fr)*LHc+16);}else a1H=a1Lines*LHc+16;
    const dotsOn=a?(t>=1.4&&t<TS+.05):false,a1Vis=a?ap(1.4,.3):ap(.5,0.01),chipP=ap(4.9,.4),u2P=ap(5.6,.35),GAP=10;
    const items=[{k:'u1',h:hU1,p:ap(.5)},{k:'a1',h:a1H,p:a1Vis},{k:'chip',h:30,p:chipP},{k:'u2',h:hU2,p:u2P}];
    let tot=0;items.forEach(it=>{it.top=tot;tot+=(it.h+GAP)*it.p;});
    const scroll=Math.max(0,tot-(AB-AT)+4);
    c.save();c.beginPath();c.rect(X+1,AT-4,W-2,AB-AT+4);c.clip();
    items.forEach(it=>{
      if(it.p<=0)return;const y=AT+it.top-scroll,al=Math.min(1,it.p*1.6),oy=(1-it.p)*14;
      c.globalAlpha=al;
      if(it.k==='u1'||it.k==='u2'){const L=it.k==='u1'?u1:u2,w=wOf(L),h=it.h,x=X+W-14-w+(1-it.p)*24;rr(c,x,y+oy,w,h,14);const g=c.createLinearGradient(x,y,x,y+h);g.addColorStop(0,'#ff9c58');g.addColorStop(1,'#ff7a30');c.fillStyle=g;c.fill();
        L.lines.forEach((l,i)=>txt2(c,l,x+PAD,y+oy+PAD+14+i*LHc-2,14.5,'#1a0f06',600));}
      else if(it.k==='a1'){const bx=X+14+30,w=dotsOn||(a&&t<TS+.25)?(dotsOn?58:58+(wOf(a1)-58)*E.outC(seg(t,TS,TS+.25))):wOf(a1),h=it.h;
        c.fillStyle=ag;c.beginPath();c.arc(X+26+4,y+oy+16,10,0,TAU);c.fill();
        rr(c,bx,y+oy,w,h,14);c.fillStyle='#1b2230';c.fill();c.strokeStyle='#2a3446';c.stroke();
        if(dotsOn){for(let i=0;i<3;i++){const b=Math.max(0,Math.sin(t*7-i*.9));c.fillStyle='rgba(223,229,238,'+(.45+.45*b)+')';c.beginPath();c.arc(bx+18+i*11,y+oy+18-4*b,3.1,0,TAU);c.fill();}}
        else a1.lines.forEach((l,i)=>{const seen=a1.starts[i]<n||!a;if(!seen)return;const part=a?l.slice(0,Math.max(0,n-a1.starts[i])):l;txt2(c,part,bx+PAD,y+oy+PAD+14+i*LHc-2,14.5,'#dfe5ee',500);});
        if(a&&!dotsOn&&t>=TS&&t<tEnd+.2){const li=Math.max(0,a1.starts.findIndex((st,i)=>n<=(a1.starts[i+1]??1e9)&&n>st));const ln=a1.lines[Math.max(0,li)]||'',cx2=bx+PAD+c.measureText(ln.slice(0,Math.max(0,n-a1.starts[Math.max(0,li)]))).width;
          if(Math.floor(t*4)%2===0){c.fillStyle='#ff8a3d';c.fillRect(cx2+1,y+oy+PAD+2+Math.max(0,li)*LHc,2,15);}}}
      else if(it.k==='chip'){const w=156,x=X+14+30,sc=a?.9+.1*E.outBack(it.p):1,cx=x+w/2,cy=y+15;c.save();c.translate(cx,cy);c.scale(sc,sc);c.translate(-cx,-cy);rr(c,x,y,w,30,15);c.fillStyle='rgba(255,138,61,.14)';c.fill();c.strokeStyle='#ff8a3d';c.lineWidth=1.2;c.stroke();
        txt2(c,'▶  미리보기 만들기',cx,y+20,12.5,'#ffb27f',700,'center');c.restore();}
      c.globalAlpha=1;
    });
    const fg=c.createLinearGradient(0,AT-4,0,AT+18);fg.addColorStop(0,'rgba(16,20,28,1)');fg.addColorStop(1,'rgba(16,20,28,0)');c.fillStyle=fg;c.fillRect(X+1,AT-4,W-2,22);
    c.restore();
    cap(c,a?'타이핑 점(물결 시차) → 글자 스트리밍(초당 약 22자) → 줄이 늘 때만 말풍선이 부드럽게 커짐 → 쌓이면 스크롤':'연출 전: 말풍선이 통째로 한꺼번에 나타남 → 누가 언제 말했는지, 응답이 오는 과정이 안 보임',16,348);
  }
};
export default demo;
