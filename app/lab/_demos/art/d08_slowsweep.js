// 만들어진 파일 — 원본: 시각 연출 사전 아티팩트 d08. 직접 고치지 않는다 — 응용 팁 'slowsweep' 적용본
/* eslint-disable */
// @ts-nocheck

import { seg, lerp, E, rng, canvas, rr } from "./helpers.js";

const demo = {
  dur: 5.2, rest: 4.4, noCompare: false, levels: 0,
  mount(sp){
    const ctx=canvas(sp);const r=rng(42);
    const dust=[];for(let i=0;i<40;i++)dust.push({x:280+r()*240,y:r()*360,s:.6+r()*1.6,v:5+r()*10,ph:r()*6.28});
    return {ctx,dust};
  },
  render(s,t,a){
    const c=s.ctx;c.setTransform(2,0,0,2,0,0);
    const BX=410,BY=282;
    const bodyPath=()=>{rr(c,-58,-150,116,150,22);};
    const drawBottle=(glow)=>{
      c.save();bodyPath();
      const g=c.createLinearGradient(-58,0,58,0);g.addColorStop(0,'rgba(120,52,12,.95)');g.addColorStop(.35,'rgba(214,128,40,.92)');g.addColorStop(.7,'rgba(190,98,24,.95)');g.addColorStop(1,'rgba(90,38,8,.97)');
      c.fillStyle=g;c.fill();c.clip();
      c.fillStyle='rgba(255,226,170,.18)';c.fillRect(-58,-150,116,34);
      c.fillStyle='rgba(255,255,255,.35)';rr(c,-46,-138,7,118,4);c.fill();
      c.fillStyle='#efe4cf';rr(c,-30,-92,60,40,3);c.fill();
      c.fillStyle='#4a2a10';c.font='bold 14px "JetBrains Mono", monospace';c.textAlign='center';c.fillText('N°7',0,-67);c.textAlign='left';
      c.restore();
      c.fillStyle='#6b3a14';c.fillRect(-16,-168,32,20);
      c.save();rr(c,-32,-214,64,48,6);const m=c.createLinearGradient(-32,0,32,0);m.addColorStop(0,'#141414');m.addColorStop(.45,'#5a5a5a');m.addColorStop(.55,'#2a2a2a');m.addColorStop(1,'#0c0c0c');c.fillStyle=m;c.fill();c.restore();
      c.fillStyle='#c9a35a';c.fillRect(-32,-176,64,4);
      if(glow>0){c.save();bodyPath();c.strokeStyle='rgba(255,205,140,'+(.55*glow)+')';c.lineWidth=1.5;c.stroke();c.restore();}
    };
    if(!a){
      c.fillStyle='#8b9097';c.fillRect(0,0,640,360);
      c.save();c.translate(BX,BY);c.fillStyle='rgba(0,0,0,.25)';c.beginPath();c.ellipse(0,2,64,8,0,0,7);c.fill();drawBottle(0);c.restore();
      if(t>.4){c.fillStyle='#fff';c.font='bold 32px Arial, sans-serif';c.fillText('AMBER NO.7',60,180);c.font='16px Arial, sans-serif';c.fillText('새로운 향의 시작',62,210);}
      return;
    }
    const L=E.inOutC(seg(t,.2,1.4));
    c.fillStyle='#0a0705';c.fillRect(0,0,640,360);
    const z=lerp(.92,1.04,E.outC(seg(t,0,5)));
    c.save();c.translate(BX,230);c.scale(z,z);c.translate(-BX,-230);
    const rg=c.createRadialGradient(BX,180,10,BX,180,270);rg.addColorStop(0,'rgba(255,150,60,'+(.5*L)+')');rg.addColorStop(.5,'rgba(140,60,20,'+(.25*L)+')');rg.addColorStop(1,'rgba(10,7,5,0)');c.fillStyle=rg;c.fillRect(-100,-100,840,560);
    c.fillStyle='rgba(30,18,10,'+(.9*L)+')';c.fillRect(-100,BY,840,200);
    c.save();c.translate(BX,BY);c.scale(1,-1);c.globalAlpha=.16*L;drawBottle(0);c.restore();
    const fg=c.createLinearGradient(0,BY,0,BY+90);fg.addColorStop(0,'rgba(10,7,5,.1)');fg.addColorStop(1,'rgba(10,7,5,1)');c.fillStyle=fg;c.fillRect(-100,BY,840,200);
    c.save();c.translate(BX,BY);c.fillStyle='rgba(0,0,0,.6)';c.beginPath();c.ellipse(0,1,70,7,0,0,7);c.fill();drawBottle(L);
    const sw=seg(t,1.4,3.4);
    if(sw>0&&sw<1){c.save();bodyPath();c.clip();c.globalCompositeOperation='lighter';const sx=lerp(-130,130,E.inOutC(sw));c.translate(sx,-75);c.rotate(.35);const bg=c.createLinearGradient(-18,0,18,0);bg.addColorStop(0,'rgba(255,240,210,0)');bg.addColorStop(.5,'rgba(255,240,210,.75)');bg.addColorStop(1,'rgba(255,240,210,0)');c.fillStyle=bg;c.fillRect(-18,-200,36,400);c.restore();}
    c.restore();
    s.dust.forEach(d=>{const y=((d.y-t*d.v)%360+360)%360;const x=d.x+Math.sin(t*.8+d.ph)*6;const dist=Math.hypot(x-BX,y-180)/200;const al=L*Math.max(0,1-dist)*(.5+.5*Math.sin(t*2+d.ph));c.fillStyle='rgba(255,220,170,'+(al*.8).toFixed(3)+')';c.beginPath();c.arc(x,y,d.s,0,7);c.fill();});
    c.restore();
    const tp=E.outC(seg(t,2.4,3.4));
    if(tp>0){c.save();c.globalAlpha=tp;c.fillStyle='#f6eadb';c.font='44px "Black Han Sans", sans-serif';const sp=lerp(22,5,tp);let x=60;for(const ch of 'AMBER NO.7'){c.fillText(ch,x,182);x+=c.measureText(ch).width+sp;}c.restore();}
    const tq=E.outC(seg(t,3.0,3.8));
    if(tq>0){c.save();c.globalAlpha=tq;c.fillStyle='#d9b88f';c.font='500 16px "IBM Plex Sans KR", sans-serif';c.fillText('새로운 향의 시작',62,214+(1-tq)*10);c.restore();}
  }
};
export default demo;
