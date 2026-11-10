// 만들어진 파일 — 원본: 시각 연출 사전 아티팩트 d85. 직접 고치지 않는다 — 응용 팁 'bignum' 적용본
/* eslint-disable */
// @ts-nocheck

import { seg, rng, canvas, rr } from "./helpers.js";
import { DV, EZ, TAU, bgFill, cap, dvChip, dvHair, sstep, txt2, txtk, uiReset } from "./shared/common.js";
import { dvComma, dvTri } from "./shared/g80.js";

const M85=[
  {n:'구독자',base:1200,tr:.18,nz:.012,fmt:v=>dvComma(v),good:1},
  {n:'조회수',base:5200,tr:.35,nz:.08,fmt:v=>dvComma(v),good:1},
  {n:'평균 시청',base:142,tr:.08,nz:.02,fmt:v=>Math.round(v)+'초',good:1},
  {n:'클릭률',base:4.2,tr:-.06,nz:.03,fmt:v=>v.toFixed(1)+'%',good:1},
  {n:'댓글',base:86,tr:.22,nz:.1,fmt:v=>dvComma(v),good:1},
  {n:'이탈률',base:38,tr:-.12,nz:.02,fmt:v=>v.toFixed(0)+'%',good:-1}
];
M85.forEach((m,i)=>{const r=rng(30+i),S=[];for(let k=0;k<30;k++)S.push(m.base*(1+m.tr*k/29+m.nz*(r()-.5)*2+.03*Math.sin(k*.6+i)));m.S=S;m.first=S[0];m.last=S[29];m.delta=(m.last-m.first)/m.first;const mn=Math.min(...S),mx=Math.max(...S);m.N=S.map(v=>(v-mn)/(mx-mn));});
const C85=['#3987e5','#d95926','#1baf7a','#eda100','#e87ba4','#6250d6'];
const X85=(function(){let n=0;for(let i=0;i<6;i++)for(let j=i+1;j<6;j++){let sg=0;for(let k=0;k<30;k++){const d=M85[i].N[k]-M85[j].N[k];const s=d>0?1:d<0?-1:0;if(s&&sg&&s!==sg)n++;if(s)sg=s;}}return n;})();

const demo = {
  dur: 4.4, rest: 1.6, noCompare: false, levels: 0,
  mount(sp){sp.style.background='#080a10';return {ctx:canvas(sp)};},
  render(s,t,a){
    const c=s.ctx;uiReset(c);bgFill(c,'#0b0e16','#06080c');
    dvChip(c,a?'KPI 타일 6칸 (작은 다중 그래프)':'한 차트에 선 6개',a?232:162,a?'#ffb27f':'#dfe5ee');
    if(!a){
      const CX=44,CY=58,CW=560,CH=204,p=EZ.outC(seg(t,.4,2.2));
      [0,.25,.5,.75,1].forEach(v=>dvHair(c,CX,CY+CH-v*CH,CX+CW,CY+CH-v*CH,v?DV.grid:DV.axis));
      txtk(c,'각 지표를 0~1로 맞춰 겹침',CX,CY-10,9.5,DV.muted);
      M85.forEach((m,i)=>{c.strokeStyle=C85[i];c.lineWidth=1.8;c.lineJoin='round';c.beginPath();const n=29*p;for(let k=0;k<=Math.floor(n);k++){const x=CX+k/29*CW,y=CY+CH-m.N[k]*CH;k?c.lineTo(x,y):c.moveTo(x,y);}if(n%1>0&&Math.floor(n)<29){const k=Math.floor(n),f=n%1,v=m.N[k]+(m.N[k+1]-m.N[k])*f;c.lineTo(CX+(k+f)/29*CW,CY+CH-v*CH);}c.stroke();});
      M85.forEach((m,i)=>{const x=44+i*94;c.fillStyle=C85[i];c.beginPath();c.arc(x,292,4.5,0,TAU);c.fill();txtk(c,m.n,x+9,296,10,DV.sec);});
    }else{
      M85.forEach((m,i)=>{
        const x=14+(i%3)*208,y=40+Math.floor(i/3)*146,ts=.3+i*.12;
        rr(c,x,y,198,136,10);c.fillStyle='rgba(255,255,255,.035)';c.fill();c.strokeStyle='rgba(255,255,255,.08)';c.lineWidth=1;c.stroke();
        txt2(c,m.n,x+14,y+23,11.5,DV.muted,600);
        const cu=EZ.outC(seg(t,ts,ts+1)),val=m.last*cu;txt2(c,m.fmt(val),x+14,y+60,36,DV.ink,700);
        const up=m.delta>0,good=m.delta*m.good>0,dc=good?'#3ecf8e':DV.bad;
        if(cu>=1||t>ts+.6){c.globalAlpha=sstep(ts+.6,ts+1,t);dvTri(c,x+19,y+75,4.4,up,dc);txt2(c,(up?'+':'−')+Math.abs(m.delta*100).toFixed(1)+'%',x+30,y+80,12,dc,700);txtk(c,'30일',x+172,y+80,9.5,DV.muted,'right');c.globalAlpha=1;}
        const sx=x+14,sw=170,sy=y+92,sh=32,pr=EZ.outC(seg(t,ts+.2,ts+1.4)),n=29*pr,pt=k=>[sx+k/29*sw,sy+sh-m.N[k]*sh];
        c.beginPath();for(let k=0;k<=Math.floor(n);k++){const q=pt(k);k?c.lineTo(q[0],q[1]):c.moveTo(q[0],q[1]);}
        let ex=pt(0)[0],ey=pt(0)[1];const k0=Math.floor(n);if(n%1>0&&k0<29){const q0=pt(k0),q1=pt(k0+1);ex=q0[0]+(q1[0]-q0[0])*(n%1);ey=q0[1]+(q1[1]-q0[1])*(n%1);c.lineTo(ex,ey);}else{const q=pt(Math.min(29,k0));ex=q[0];ey=q[1];}
        c.strokeStyle=DV.blue;c.lineWidth=2;c.lineJoin='round';c.stroke();
        c.lineTo(ex,sy+sh+2);c.lineTo(sx,sy+sh+2);c.closePath();const g=c.createLinearGradient(0,sy,0,sy+sh);g.addColorStop(0,'rgba(57,135,229,.28)');g.addColorStop(1,'rgba(57,135,229,0)');c.fillStyle=g;c.fill();
        if(pr>0){c.fillStyle=DV.orange;c.strokeStyle=DV.surf;c.lineWidth=2;c.beginPath();c.arc(ex,ey,3.6,0,TAU);c.stroke();c.fill();}
      });
    }
    txtk(c,a?'칸 6개 · 선이 엇갈리는 곳 0번 · 숫자 6개 + 변화율 6개 · 선 색은 파랑 한 가지 · 마지막 점만 주황':'6개 선이 서로 '+X85+'번 엇갈림 — 색 6개 범례를 오가며 읽어야 하고, 어느 지표가 어떤지 한 번에 안 읽힘',16,334,10,a?'#3ecf8e':'#ff7a70');
    cap(c,a?'연출 후: 지표마다 자기 칸 — 큰 숫자, 증감(▲▼ + 글자), 그 밑에 30일 흐름 한 줄':'연출 전: 지표 6개를 한 차트에 겹침 — 선이 엇갈려 스파게티가 된다',16,350);
  }
};
export default demo;
