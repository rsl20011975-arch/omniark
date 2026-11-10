// 만들어진 파일 — 원본: 시각 연출 사전 아티팩트 d76. 직접 고치지 않는다 — 응용 팁 'over' 적용본
/* eslint-disable */
// @ts-nocheck

import { seg, canvas, rr } from "./helpers.js";
import { EZ, TAU, bgFill, cap, ezBall, ezShadow, txt2, txtk, uiReset } from "./shared/common.js";
import { cbez, sprTable, tabAt } from "./shared/g74.js";

const Q76={X0:110,X1:500,T0:.5,T1:1.9,D:3.4,FY:150,BW:54};
const B76=cbez(.68,-.65,.27,1.9);
function q76build(){
  if(Q76.built)return Q76.built;
  const N=Math.ceil(Q76.D*240)+2,Bv=new Float32Array(N);
  for(let i=0;i<N;i++)Bv[i]=B76(seg(i/240,Q76.T0,Q76.T1));
  const fol=sprTable(70,6,1,t=>B76(seg(t,Q76.T0,Q76.T1)),Q76.D);
  let mn=0,mx=0,iMin=0,iMax=0;for(let i=0;i<N;i++){if(Bv[i]<mn){mn=Bv[i];iMin=i;}if(Bv[i]>mx){mx=Bv[i];iMax=i;}}
  let tAnt=Q76.T0;for(let i=iMin;i<N;i++){if(Bv[i]>=0){tAnt=i/240;break;}}
  let tCross=tAnt;for(let i=iMin;i<N;i++){if(Bv[i]>=1){tCross=i/240;break;}}
  const W=Q76.X1-Q76.X0;let lag=0;for(let i=0;i<N;i++)lag=Math.max(lag,Math.abs(fol[i]-Bv[i])*W*.25);
  return Q76.built={Bv,fol,dip:-mn*W,ov:(mx-1)*W,tAnt,tCross,lag:Math.min(34,lag)};
}
function q76box(c,B,t,a){
  const W=Q76.X1-Q76.X0,Bn=a?tabAt(B.Bv,t):seg(t,Q76.T0,Q76.T1);
  const bn=a?Bn:EZ.linear(Bn),x=Q76.X0+bn*W,vv=a?(tabAt(B.Bv,t+.008)-tabAt(B.Bv,t-.008))/.016*W:(Q76.X1-Q76.X0)/(Q76.T1-Q76.T0)*(t>Q76.T0&&t<Q76.T1?1:0);
  const stretch=a?Math.min(.3,Math.abs(vv)/2600):0;
  const dipN=a?Math.max(0,-Bn)/(B.dip/W):0,sq=a?Math.min(1,dipN)*.2:0;
  let sx=1+stretch+sq*.5,sy=1/(1+stretch)*(1-sq);
  const FY=Q76.FY,bw=Q76.BW,lean=a?Math.max(-.12,Math.min(.12,vv/7000)):0;
  ezShadow(c,x,FY+3,bw*.62*sx,7,a?.5:.45);
  c.save();c.translate(x,FY);c.rotate(lean);c.scale(sx,sy);
  const g=c.createLinearGradient(0,-bw,0,0);g.addColorStop(0,a?'#ffa35e':'#aab1bd');g.addColorStop(1,a?'#d9611a':'#5c6371');
  rr(c,-bw/2,-bw,bw,bw,12);c.fillStyle=g;c.fill();
  const h=c.createLinearGradient(-bw/2,0,bw/2,0);h.addColorStop(0,'rgba(255,255,255,.28)');h.addColorStop(.35,'rgba(255,255,255,0)');h.addColorStop(1,'rgba(0,0,0,.28)');rr(c,-bw/2,-bw,bw,bw,12);c.fillStyle=h;c.fill();
  c.strokeStyle='rgba(255,255,255,.25)';c.lineWidth=1;rr(c,-bw/2+1,-bw+1,bw-2,bw-2,11);c.stroke();
  const look=a?Math.max(-1,Math.min(1,vv/1200)):0;[-10,10].forEach(ex=>{c.fillStyle='#fff';c.beginPath();c.ellipse(ex,-bw*.58,6,7,0,0,TAU);c.fill();c.fillStyle='#1a1d27';c.beginPath();c.arc(ex+look*2.6,-bw*.58,3.1,0,TAU);c.fill();});
  c.restore();
  /* 안테나: 몸통을 늦게 따라오는 꼬리 */
  const topY=FY-bw*sy*Math.cos(lean),lagPx=a?Math.max(-34,Math.min(34,(tabAt(B.fol,t)-Bn)*W*.25)):0,tipX=x+lagPx-lean*bw,tipY=topY-44;
  c.strokeStyle=a?'#e8edf6':'#9aa2af';c.lineWidth=2.4;c.lineCap='round';c.beginPath();c.moveTo(x,topY+3);c.quadraticCurveTo(x+lagPx*.15,topY-24,tipX,tipY);c.stroke();c.lineCap='butt';
  ezBall(c,tipX,tipY,6,a?'#6fd3ff':'#8b94a3');
  return {x,Bn,lagPx};
}

const demo = {
  dur: 3.4, rest: 1.6, noCompare: false, levels: 0,
  mount(sp){sp.style.background='#080a10';return {ctx:canvas(sp)};},
  render(s,t,a){
    const c=s.ctx;uiReset(c);bgFill(c,'#0d111a','#06080c');const B=q76build(),FY=Q76.FY;
    /* 바닥 */
    const fg=c.createLinearGradient(0,FY,0,198);fg.addColorStop(0,'#1a2030');fg.addColorStop(1,'#0a0d14');c.fillStyle=fg;c.fillRect(0,FY,640,48);c.fillStyle='rgba(255,255,255,.12)';c.fillRect(0,FY,640,1);
    [Q76.X0,Q76.X1].forEach(x=>{c.fillStyle='rgba(255,255,255,.16)';c.fillRect(x-.5,FY+1,1,8);});txtk(c,'출발',Q76.X0,FY+20,8.5,'#6a7385','center');txtk(c,'도착',Q76.X1,FY+20,8.5,'#6a7385','center');
    rr(c,14,12,a?190:196,20,10);c.fillStyle='rgba(0,0,0,.65)';c.fill();txt2(c,a?'예비동작 + 팔로스루 + 겹침':'그냥 미끄러져 이동 (등속)',26,26,11.5,a?'#ffb27f':'#dfe5ee',700);
    const R=q76box(c,B,t,a);
    /* 아래 그래프: 위치 대 시간 */
    const PX=40,PW=560,PY=214,PH=70,W=Q76.X1-Q76.X0,gx=tt=>PX+tt/Q76.D*PW,gy=n=>PY+PH-(n+.18)/1.36*PH;
    rr(c,PX-8,PY-14,PW+16,PH+54,8);c.fillStyle='rgba(255,255,255,.035)';c.fill();
    [0,1].forEach(n=>{c.strokeStyle='rgba(255,255,255,.18)';c.lineWidth=1;c.setLineDash([2,3]);c.beginPath();c.moveTo(PX,gy(n)+.5);c.lineTo(PX+PW,gy(n)+.5);c.stroke();c.setLineDash([]);});
    txtk(c,'출발선',PX-4,gy(0)+3,8,'#5b6577','right');txtk(c,'도착선',PX-4,gy(1)+3,8,'#5b6577','right');
    if(a){[[Q76.T0,B.tAnt,'255,138,61','예비동작'],[B.tAnt,B.tCross,'111,211,255','이동'],[B.tCross,Q76.T1+.45,'190,150,255','넘침→안착']].forEach(p=>{c.fillStyle='rgba('+p[2]+',.12)';c.fillRect(gx(p[0]),PY-8,gx(p[1])-gx(p[0]),PH+16);txtk(c,p[3],(gx(p[0])+gx(p[1]))/2,PY+PH+22,8.5,'rgb('+p[2]+')','center');});}
    const curve=(arr,sc,cc,lw)=>{c.strokeStyle=cc;c.lineWidth=lw;c.beginPath();for(let i=0;i<arr.length;i+=3){const x=gx(i/240),y=gy(arr[i]*sc);i?c.lineTo(x,y):c.moveTo(x,y);}c.stroke();};
    const lin=new Float32Array(B.Bv.length);for(let i=0;i<lin.length;i++)lin[i]=seg(i/240,Q76.T0,Q76.T1);
    curve(a?B.Bv:lin,1,a?'#ff8a3d':'#8b94a3',2);if(a)curve(B.fol,1,'rgba(111,211,255,.8)',1.4);
    const ti=Math.min(B.Bv.length-1,Math.round(t*240));c.fillStyle='#fff';c.beginPath();c.arc(gx(t),gy(a?B.Bv[ti]:lin[ti]),3,0,TAU);c.fill();
    txtk(c,'몸통 위치',PX+PW,PY-2,8.5,a?'#ff8a3d':'#8b94a3','right');if(a)txtk(c,'안테나 끝(늦게 따라옴)',PX+PW,PY+9,8.5,'#6fd3ff','right');
    txtk(c,a?'예비동작 '+Math.round(B.dip)+'px · 넘침 '+Math.round(B.ov)+'px · 안테나 지연 최대 '+Math.round(B.lag)+'px':'예비동작 0px · 넘침 0px · 안테나 지연 0px',PX,PY+PH+36,9,a?'#3ecf8e':'#ff7a70');
    cap(c,a?'연출 후: 뒤로 살짝 웅크렸다가(예비동작) 튀어 나가고, 지나쳤다가 돌아오며(팔로스루) 안테나는 늦게 따라온다':'연출 전: 준비도 여운도 없이 같은 속도로 미끄러져 도착 — 기계적',16,350);
  }
};
export default demo;
