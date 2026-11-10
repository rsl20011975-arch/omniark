// 만들어진 파일 — 원본: 모션 연출 실습 사전 아티팩트 d06. 직접 고치지 않는다 — 응용 팁 'haze' 적용본
/* eslint-disable */
// @ts-nocheck
import { seg, E, rng, canvas } from "./helpers.js";
const demo = {
  dur: 5.4, rest: 4.6, noCompare: false,
  mount(sp){
    const ctx=canvas(sp);
    const ridge=(seed,base,amp,f)=>{const r=rng(seed);const ph=[r()*6.28,r()*6.28,r()*6.28];const pts=[];for(let x=-320;x<=1120;x+=8)pts.push([x,base-amp*(.55*Math.sin(x*f+ph[0])+.3*Math.sin(x*f*2.3+ph[1])+.15*Math.sin(x*f*5.1+ph[2]))]);return pts;};
    const r=rng(7);const trees=[];for(let x=-320;x<1120;x+=26+r()*46)trees.push([x,46+r()*80]);
    return {ctx,far:ridge(3,190,40,.006),mid:ridge(11,240,34,.009),near:ridge(21,292,26,.013),trees};
  },
  render(s,t,a){
    const c=s.ctx;c.setTransform(2,0,0,2,0,0);
    const p=E.inOutC(seg(t,0,4.8));const cam=p*160,z=1+.08*p;
    const fill=(pts,col)=>{c.beginPath();c.moveTo(pts[0][0],420);pts.forEach(q=>c.lineTo(q[0],q[1]));c.lineTo(pts[pts.length-1][0],420);c.closePath();c.fillStyle=col;c.fill();};
    const layer=(speed,fn)=>{const sp=a?speed:.45;const zl=a?1+(z-1)*(.3+speed):z;c.save();c.translate(320,200);c.scale(zl,zl);c.translate(-320-cam*sp,-200);fn();c.restore();};
    layer(.05,()=>{const g=c.createLinearGradient(0,0,0,300);g.addColorStop(0,'#3d3f78');g.addColorStop(.6,'#c76f6a');g.addColorStop(1,'#f2b27a');c.fillStyle=g;c.fillRect(-400,-100,1600,600);});
    layer(.08,()=>{const g=c.createRadialGradient(470,150,0,470,150,120);g.addColorStop(0,'rgba(255,220,160,.9)');g.addColorStop(.3,'rgba(255,200,140,.35)');g.addColorStop(1,'rgba(255,200,140,0)');c.fillStyle=g;c.fillRect(300,0,360,320);c.beginPath();c.arc(470,150,30,0,7);c.fillStyle='#ffe2b0';c.fill();});
    const fog=(y,alpha)=>{const g=c.createLinearGradient(0,y-40,0,y+30);g.addColorStop(0,'rgba(240,170,130,0)');g.addColorStop(.6,'rgba(240,170,130,'+alpha+')');g.addColorStop(1,'rgba(240,170,130,0)');c.fillStyle=g;c.fillRect(-400,y-40,1600,70);};
    layer(.2,()=>{fill(s.far,'#b78e98');if(a)fog(210,.35);});
    layer(.45,()=>{fill(s.mid,'#7d5c7a');if(a)fog(258,.22);});
    const tp=a?E.outC(seg(t,1.0,1.8)):(t>.5?1:0);
    layer(.6,()=>{c.globalAlpha=tp;c.fillStyle='#fff';c.font='30px "Black Han Sans", sans-serif';c.fillText('한 장의 사진이 공간이 될 때',200+(a?(1-tp)*-20:0),214);c.globalAlpha=1;});
    layer(.8,()=>fill(s.near,'#2e2440'));
    layer(1.3,()=>{c.fillStyle='#140f1d';s.trees.forEach(([x,h])=>{c.beginPath();c.moveTo(x,370);c.lineTo(x+h*.32,370-h);c.lineTo(x+h*.64,370);c.fill();c.beginPath();c.moveTo(x+h*.06,370-h*.45);c.lineTo(x+h*.32,370-h*1.25);c.lineTo(x+h*.58,370-h*.45);c.fill();});c.fillRect(-400,350,1600,40);});
    c.fillStyle='rgba(255,255,255,.55)';c.font='11px "JetBrains Mono", monospace';c.fillText(a?'레이어 6장 · 속도 0.05 ~ 1.3':'한 장 전체가 같은 속도로 이동',16,22);
  }
};
export default demo;
