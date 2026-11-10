// 만들어진 파일 — 원본: 시각 연출 사전 아티팩트 d48. 직접 고치지 않는다 — 응용 팁 'zoom' 적용본
/* eslint-disable */
// @ts-nocheck

import { seg, E, rng, canvas, rr } from "./helpers.js";
import { cap, txt2, txtm, uiReset } from "./shared/common.js";

function azScene(c){
  c.setTransform(2,0,0,2,0,0);const sg=c.createLinearGradient(0,0,0,230);sg.addColorStop(0,'#14173a');sg.addColorStop(.5,'#5a3566');sg.addColorStop(1,'#f4a868');c.fillStyle=sg;c.fillRect(0,0,640,360);
  const r=rng(12);c.fillStyle='#fff';for(let i=0;i<70;i++){c.globalAlpha=.2+r()*.6;c.fillRect(r()*640,r()*120,1.2,1.2);}c.globalAlpha=1;
  const sun=c.createRadialGradient(330,222,2,330,222,110);sun.addColorStop(0,'rgba(255,240,200,1)');sun.addColorStop(.18,'rgba(255,200,130,.65)');sun.addColorStop(1,'rgba(255,170,100,0)');c.fillStyle=sun;c.fillRect(180,100,300,160);
  c.fillStyle='#3a2a50';c.beginPath();c.moveTo(0,215);c.lineTo(70,160);c.lineTo(130,200);c.lineTo(210,140);c.lineTo(290,206);c.lineTo(380,170);c.lineTo(470,210);c.lineTo(560,150);c.lineTo(640,200);c.lineTo(640,260);c.lineTo(0,260);c.fill();
  c.fillStyle='#2a1c3c';c.beginPath();c.moveTo(0,240);c.quadraticCurveTo(160,205,330,236);c.quadraticCurveTo(500,262,640,226);c.lineTo(640,360);c.lineTo(0,360);c.fill();
  c.fillStyle='#1c1228';c.beginPath();c.moveTo(0,285);c.quadraticCurveTo(200,248,420,282);c.quadraticCurveTo(540,296,640,268);c.lineTo(640,360);c.lineTo(0,360);c.fill();
  const pine=(x,y,h)=>{c.fillStyle='#0d0a18';c.beginPath();c.moveTo(x,y-h);c.lineTo(x-h*.28,y-h*.45);c.lineTo(x-h*.14,y-h*.45);c.lineTo(x-h*.34,y);c.lineTo(x+h*.34,y);c.lineTo(x+h*.14,y-h*.45);c.lineTo(x+h*.28,y-h*.45);c.closePath();c.fill();};
  [[48,300,86],[84,306,64],[560,298,92],[600,306,70],[246,262,40],[500,268,44]].forEach(q=>pine(q[0],q[1],q[2]));
  c.fillStyle='#e6a460';c.beginPath();c.moveTo(300,360);c.quadraticCurveTo(360,300,398,256);c.lineTo(410,256);c.quadraticCurveTo(380,310,380,360);c.fill();
  c.fillStyle='#4a2a1c';c.fillRect(372,198,52,34);c.fillStyle='#2e1a12';c.beginPath();c.moveTo(364,198);c.lineTo(432,198);c.lineTo(398,172);c.closePath();c.fill();c.fillStyle='#2e1a12';c.fillRect(412,172,8,16);
  const wg=c.createRadialGradient(392,212,1,392,212,34);wg.addColorStop(0,'rgba(255,220,140,.9)');wg.addColorStop(1,'rgba(255,200,120,0)');c.fillStyle=wg;c.fillRect(350,180,90,70);
  c.fillStyle='#ffe3a0';c.fillRect(385,206,14,12);c.fillStyle='#4a2a1c';c.fillRect(391.5,206,1.2,12);c.fillRect(385,211.5,14,1.2);c.fillStyle='#24120c';c.fillRect(408,210,10,22);
  c.strokeStyle='rgba(255,255,255,.18)';c.lineWidth=3;c.beginPath();c.moveTo(416,170);c.bezierCurveTo(408,156,426,150,418,134);c.stroke();
}

const demo = {
  dur: 6.2, rest: 5.4, noCompare: false, levels: 0,
  mount(sp){sp.style.background='#000';const sc=document.createElement('canvas');sc.width=1280;sc.height=720;azScene(sc.getContext('2d'));return {ctx:canvas(sp),scene:sc};},
  render(s,t,a){
    const c=s.ctx;uiReset(c);c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';
    const e1=a?E.inOutC(seg(t,.6,2.4)):1,z=a?2-1*e1:1,lb=a?E.outC(seg(t,2.6,3.4)):(t>=2.6?1:0),e2=a?E.inOutC(seg(t,3.9,5.0)):(t>=3.9?1:0);
    const h1=360-92*lb,fw=640+(202.5-640)*e2,fh=h1+(360-h1)*e2,fx=(640-fw)/2,fy=(360-fh)/2,rot=a?.1*(1-e1):0;
    const FX=(.62+(.5-.62)*e1)*(1-e2)+.62*e2,FY=(.6+(.5-.6)*e1)*(1-e2)+.55*e2;
    c.fillStyle='#000';c.fillRect(0,0,640,360);
    const sc=Math.max(fw/640,fh/360)*z*(1+.35*Math.abs(rot)),iw=640*sc,ih=360*sc;
    let dx=fx+fw/2-FX*iw,dy=fy+fh/2-FY*ih;dx=Math.min(fx,Math.max(fx+fw-iw,dx));dy=Math.min(fy,Math.max(fy+fh-ih,dy));
    c.save();c.beginPath();c.rect(fx,fy,fw,fh);c.clip();c.translate(fx+fw/2,fy+fh/2);c.rotate(rot);c.translate(-(fx+fw/2),-(fy+fh/2));c.drawImage(s.scene,dx,dy,iw,ih);c.restore();
    if(lb>0||e2>0){c.strokeStyle='rgba(255,255,255,.18)';c.lineWidth=1;c.strokeRect(fx+.5,fy+.5,fw-1,fh-1);}
    const ph=t<2.6?0:(t<3.9?1:2),names=['① 어웨이 줌 — 줌 아웃으로 상황 공개','② 레터박스 — 2.39:1 시네마 비율','③ 화면비 변경 — 9:16, 집으로 재구성'],al=a?1:1;
    rr(c,14,16,260,22,11);c.fillStyle='rgba(0,0,0,.65)';c.fill();txt2(c,names[ph],26,31,11.5,'#f4efe4',700);
    const ratio=fw/fh;txtm(c,'ZOOM ×'+z.toFixed(1)+'   ASPECT '+(Math.abs(ratio-640/360)<.02?'16:9':Math.abs(ratio-2.39)<.04?'2.39:1':Math.abs(ratio-.5625)<.01?'9:16':ratio.toFixed(2)),626,30,10,'#ffb27f','right');
    cap(c,a?'가까이서 시작 → 물러나며 공개 → 레터박스 → 9:16으로 재구성':'연출 전: 순서는 같지만 모두 컷으로 튐 → 부드럽게 이어지지 않음',16,350);
  }
};
export default demo;
