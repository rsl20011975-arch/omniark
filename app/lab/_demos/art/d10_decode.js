// 만들어진 파일 — 원본: 시각 연출 사전 아티팩트 d10. 직접 고치지 않는다 — 응용 팁 'decode' 적용본
/* eslint-disable */
// @ts-nocheck

import { seg, lerp, E, canvas } from "./helpers.js";
import { TAU } from "./shared/common.js";

const demo = {
  dur: 5.6, rest: 4.4, noCompare: false, levels: 0,
  mount(sp){return {ctx:canvas(sp)};},
  render(s,t,a){
    const c=s.ctx;c.setTransform(2,0,0,2,0,0);
    const CY='111,211,255',cx=220,cy=180,TAU=Math.PI*2;
    c.fillStyle='#05080c';c.fillRect(0,0,640,360);
    const col=al=>'rgba('+CY+','+al+')';
    c.lineWidth=1;
    [40,80,120,150].forEach((r,i)=>{const p=a?E.outC(seg(t,.2+i*.15,.9+i*.15)):1;if(p<=0)return;c.setLineDash(i%2?[4,6]:[]);c.strokeStyle=col(i===3?.8:.45);c.beginPath();c.arc(cx,cy,r,-Math.PI/2,-Math.PI/2+TAU*p);c.stroke();});
    c.setLineDash([]);
    const tk=a?Math.floor(72*seg(t,.8,1.4)):72;
    for(let i=0;i<tk;i++){const an=i/72*TAU,L=i%6===0?10:4;c.strokeStyle=col(i%6===0?.8:.4);c.beginPath();c.moveTo(cx+Math.cos(an)*158,cy+Math.sin(an)*158);c.lineTo(cx+Math.cos(an)*(158+L),cy+Math.sin(an)*(158+L));c.stroke();}
    if(a){const rot=t*.4;c.strokeStyle=col(.6*seg(t,1,1.4));c.lineWidth=3;for(let k=0;k<3;k++){c.beginPath();c.arc(cx,cy,174,rot+k*TAU/3,rot+k*TAU/3+.6);c.stroke();}c.lineWidth=1;}
    c.strokeStyle=col(.25);c.beginPath();c.moveTo(cx-150,cy);c.lineTo(cx+150,cy);c.moveTo(cx,cy-150);c.lineTo(cx,cy+150);c.stroke();
    const start=-Math.PI/2,W=2.2;
    const trav=a?Math.max(0,(t-1.2)*W):0;const sa=start+trav;
    if(!a||t>1.2){
      if(a){for(let k=0;k<24;k++){const a0=sa-k*(1.05/24);c.fillStyle=col((.32*(1-k/24)).toFixed(3));c.beginPath();c.moveTo(cx,cy);c.arc(cx,cy,150,a0-.046,a0);c.closePath();c.fill();}}
      c.strokeStyle=col(.95);c.beginPath();c.moveTo(cx,cy);c.lineTo(cx+Math.cos(sa)*150,cy+Math.sin(sa)*150);c.stroke();
    }
    const blips=[[.8,70],[2.6,110],[4.4,135]];
    blips.forEach((b,i)=>{
      let al=.8;
      if(a){const rel=((b[0]-start)%TAU+TAU)%TAU;if(trav<rel)al=0;else{const since=((trav-rel)%TAU)/W;al=Math.exp(-since*1.1);}}
      const x=cx+Math.cos(b[0])*b[1],y=cy+Math.sin(b[0])*b[1];
      if(al>0.01){c.fillStyle='rgba(255,138,61,'+al.toFixed(3)+')';c.beginPath();c.arc(x,y,4,0,7);c.fill();c.strokeStyle='rgba(255,138,61,'+(al*.4).toFixed(3)+')';c.beginPath();c.arc(x,y,9,0,7);c.stroke();}
      if(i===1){const lp=a?E.outC(seg(t,3.2,3.7)):1;if(lp>0){const sz=lerp(60,16,lp);c.strokeStyle='rgba(255,138,61,'+Math.min(1,lp*1.5)+')';c.lineWidth=2;const k=8;[[-1,-1],[1,-1],[1,1],[-1,1]].forEach(([dx,dy])=>{c.beginPath();c.moveTo(x+dx*sz,y+dy*sz-dy*k);c.lineTo(x+dx*sz,y+dy*sz);c.lineTo(x+dx*sz-dx*k,y+dy*sz);c.stroke();});c.lineWidth=1;
        const blink=a?(t<3.9?(Math.floor(t*10)%2?1:.3):1):1;c.globalAlpha=lp*blink;c.fillStyle='#ffb27f';c.font='500 11px "JetBrains Mono", monospace';c.fillText('TARGET 02 LOCKED',x+22,y-12);c.globalAlpha=1;}}
    });
    const lines=['SYS.STATUS   ONLINE','SCAN.RANGE   12.4 KM','OBJECTS      03','SIGNAL       ████░'];
    const glyph='▮▯/<>01#%&$';
    c.font='500 12px "JetBrains Mono", monospace';
    lines.forEach((ln,i)=>{
      const st=.6+i*.6;let out='';
      const rev=a?Math.floor(ln.length*seg(t,st,st+.6)):ln.length;
      const show=a?t>st:true;
      if(!show)return;
      for(let j=0;j<ln.length;j++){if(j<rev||ln[j]===' ')out+=ln[j];else{const h=Math.abs(Math.sin((Math.floor(t*30)+1)*(j+3)*(i+7)*12.9898))*43758.5453;out+=glyph[Math.floor(h)%glyph.length];}}
      c.fillStyle=col(j0(i));c.fillText(out,420,80+i*24);
    });
    function j0(i){return i===2?1:.85;}
    c.strokeStyle=col(.35);c.strokeRect(410,58,200,100);
    for(let i=0;i<14;i++){const h=a?14+12*Math.sin(t*3+i*.7)+8*Math.sin(t*5.3+i):14+8*Math.sin(i*.9);c.fillStyle=col(.55);c.fillRect(420+i*13,300-h,8,h);}
    c.fillStyle=col(.6);c.font='10px "JetBrains Mono", monospace';c.fillText('FREQ.ANALYSIS',420,318);
    c.strokeStyle=col(.7);c.lineWidth=2;const K=16;[[12,12,1,1],[628,12,-1,1],[628,348,-1,-1],[12,348,1,-1]].forEach(([x,y,dx,dy])=>{c.beginPath();c.moveTo(x,y+dy*K);c.lineTo(x,y);c.lineTo(x+dx*K,y);c.stroke();});c.lineWidth=1;
  }
};
export default demo;
