// 만들어진 파일 — 원본: 시각 연출 사전 아티팩트 d75. 직접 고치지 않는다 — 응용 팁 'stiff' 적용본
/* eslint-disable */
// @ts-nocheck

import { seg, canvas, rr } from "./helpers.js";
import { EZ, TAU, bgFill, cap, ezBall, ezShadow, txt2, txtk, txtm, uiReset } from "./shared/common.js";
import { ezPlot, sprTable, tabAt } from "./shared/g74.js";

const S75={k:300,c:22,m:1,X0:120,X1:520,X2:260,tA:.5,tB:1.0,D:3.4,Z:[.3,.64,1,2.3],built:null};
function s75build(){
  if(S75.built)return S75.built;
  const tg=(S75.X2-S75.X0)/(S75.X1-S75.X0),N=Math.ceil(S75.D*240)+2,Ea=new Float32Array(N),q1=EZ.outC(seg(S75.tB,S75.tA,S75.tA+1));
  for(let i=0;i<N;i++){const t=i/240;Ea[i]=t<S75.tA?0:t<S75.tB?EZ.outC(seg(t,S75.tA,S75.tA+1)):q1+(tg-q1)*EZ.outC(seg(t,S75.tB,S75.tB+1));}
  const S=sprTable(S75.k,S75.c,S75.m,t=>t<S75.tA?0:t<S75.tB?1:tg,S75.D);
  const dz=S75.Z.map(z=>sprTable(S75.k,2*z*Math.sqrt(S75.k*S75.m),S75.m,()=>1,1.6));
  const vel=A=>{const v=new Float32Array(N);for(let i=1;i<N;i++)v[i]=(A[i]-A[i-1])*240*(S75.X1-S75.X0);return v;};
  const vE=vel(Ea),vS=vel(S),jmp=v=>{let m=0;for(let i=Math.round(.9*240);i<=Math.round(1.1*240);i++)m=Math.max(m,Math.abs(v[i+1]-v[i]));return m;};
  return S75.built={E:Ea,S,dz,vE,vS,jE:jmp(vE),jS:jmp(vS),tg};
}

const demo = {
  dur: 3.4, rest: 1.6, noCompare: false, levels: 0,
  mount(sp){sp.style.background='#080a10';return {ctx:canvas(sp)};},
  render(s,t,a){
    const c=s.ctx;uiReset(c);bgFill(c,'#0b0e16','#06080c');const B=s75build();
    const pos=a?B.S:B.E,vel=a?B.vS:B.vE,oth=a?B.vE:B.vS,col=a?'#ff8a3d':'#8b94a3';
    const val=tabAt(pos,t),bx=S75.X0+val*(S75.X1-S75.X0),tgx=t<S75.tA?S75.X0:t<S75.tB?S75.X1:S75.X2,ty=74;
    /* 이름표 */
    rr(c,14,12,a?206:208,20,10);c.fillStyle='rgba(0,0,0,.65)';c.fill();txt2(c,a?'스프링: 힘으로 계산 (ζ = 0.64)':'이징: 시간 정해진 곡선으로 계산',26,26,11.5,a?'#ffb27f':'#dfe5ee',700);
    txtk(c,a?'k = '+S75.k+' · c = '+S75.c+' · m = '+S75.m:'새 목표가 오면 곡선을 처음부터 다시 시작',616,26,9,'#8b94a3','right');
    /* 레일 + 목표 링 */
    c.strokeStyle='rgba(255,255,255,.14)';c.lineWidth=1;c.beginPath();c.moveTo(S75.X0,ty+.5);c.lineTo(S75.X1,ty+.5);c.stroke();
    [S75.X0,S75.X2,S75.X1].forEach(x=>{c.fillStyle='rgba(255,255,255,.2)';c.fillRect(x-.5,ty-5,1,10);});
    const pul=Math.max(0,1-(t-(t>=S75.tB?S75.tB:S75.tA))/.5),ring=15+8*pul*(t>=S75.tA);
    c.strokeStyle='#6fd3ff';c.lineWidth=1.5;c.setLineDash([3,3]);c.beginPath();c.arc(tgx,ty,ring,0,TAU);c.stroke();c.setLineDash([]);txtk(c,'목표',tgx,ty-24,8.5,'#6fd3ff','center');
    for(let k=6;k>=1;k--){const gx=S75.X0+tabAt(pos,t-k*.045)*(S75.X1-S75.X0);ezBall(c,gx,ty,12-k*.7,col,(1-k/7)*.45);}
    ezShadow(c,bx,ty+17,14,4,.4);ezBall(c,bx,ty,12,col);
    txtm(c,'x = '+Math.round(bx),bx,ty+36,8.5,'#9ba3ad','center');
    /* 속도 그래프 */
    const PX=40,PW=560,PY=116,PH=104,mid=PY+PH/2,k0=(PH/2-8)/1300,gx=tt=>PX+tt/S75.D*PW,gy=v=>mid-v*k0;
    rr(c,PX-8,PY-4,PW+16,PH+8,8);c.fillStyle='rgba(255,255,255,.035)';c.fill();
    c.strokeStyle='rgba(255,255,255,.14)';c.lineWidth=1;c.beginPath();c.moveTo(PX,mid+.5);c.lineTo(PX+PW,mid+.5);c.stroke();
    txtk(c,'속도 (px/초)',PX,PY+8,8.5,'#8b94a3');txtk(c,'+',PX-5,PY+14,9,'#5b6577','right');txtk(c,'−',PX-5,PY+PH-6,9,'#5b6577','right');
    const trace=(arr,cc,lw,dash,upto)=>{c.save();if(upto!==undefined){c.beginPath();c.rect(PX-2,PY-4,gx(upto)-PX+2,PH+8);c.clip();}c.strokeStyle=cc;c.lineWidth=lw;c.setLineDash(dash||[]);c.beginPath();for(let i=0;i<arr.length;i+=2){const x=gx(i/240),y=gy(arr[i]);i?c.lineTo(x,y):c.moveTo(x,y);}c.stroke();c.restore();};
    trace(oth,'rgba(255,255,255,.18)',1.2,[3,3]);trace(vel,col+'55',1.4);trace(vel,col,2,null,t);
    c.strokeStyle='rgba(111,211,255,.5)';c.setLineDash([2,3]);c.beginPath();c.moveTo(gx(S75.tB)+.5,PY);c.lineTo(gx(S75.tB)+.5,PY+PH);c.stroke();c.setLineDash([]);txtk(c,'목표가 바뀐 순간',gx(S75.tB)+4,PY+PH-4,8,'#6fd3ff');
    const ti=Math.min(vel.length-1,Math.round(t*240));c.fillStyle='#fff';c.beginPath();c.arc(gx(t),gy(vel[ti]),3,0,TAU);c.fill();
    if(!a&&t>S75.tB){const i=Math.round(S75.tB*240),y0=gy(vel[i]),y1=gy(vel[i+1]);c.strokeStyle='#ff5f57';c.lineWidth=2.5;c.beginPath();c.moveTo(gx(S75.tB),y0);c.lineTo(gx(S75.tB),y1);c.stroke();}
    const jm=a?B.jS:B.jE;txtk(c,'1/240초 사이 최대 속도 변화  '+Math.round(jm)+' px/s'+(a?'  (이어짐)':'  (끊김)'),PX+PW-4,PY+14,9,a?'#3ecf8e':'#ff7a70','right');
    txtk(c,'점선 = '+(a?'이징':'스프링')+' 방식의 같은 구간',PX+PW-4,PY+26,8,'#6a7385','right');
    /* 감쇠 비율 4종 */
    txt2(c,'같은 스프링(k=300)에서 감쇠(c)만 바꾼 4종 — 가로 = 시간 1.6초',PX,242,10.5,'#9ba3ad',600);
    const names=['ζ 0.3 통통 튄다','ζ 0.64 이 예제','ζ 1.0 딱 맞게 멈춤','ζ 2.3 느리게 따라옴'],cols=['#ff7ab8','#ff8a3d','#3ecf8e','#6fd3ff'];
    names.forEach((n,i)=>{const x=PX+i*142;ezPlot(c,q=>tabAt(B.dz[i],q*1.6),x,250,130,52,cols[i],undefined);if(i===1){c.strokeStyle='#ff8a3d';c.lineWidth=1.2;c.strokeRect(x-.5,249.5,131,53);}
      const u2=Math.min(1,Math.max(0,(t-S75.tA)/1.6));if(t>S75.tA){const v=tabAt(B.dz[i],u2*1.6);c.fillStyle='#fff';c.beginPath();c.arc(x+u2*130,250+52-Math.max(0,Math.min(1.3,v))/1.3*52,2.4,0,TAU);c.fill();}
      txtk(c,n,x,316,8.5,cols[i]);});
    cap(c,a?'연출 후: 스프링은 새 목표가 와도 지금 속도에서 이어서 방향을 바꾼다 — 속도 그래프가 끊기지 않음':'연출 전: 이징은 새 목표가 오면 곡선을 처음부터 다시 시작 — 속도가 한 번에 바뀌어 툭 끊김',16,350);
  }
};
export default demo;
