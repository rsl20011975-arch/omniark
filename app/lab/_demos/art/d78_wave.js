// 만들어진 파일 — 원본: 시각 연출 사전 아티팩트 d78. 직접 고치지 않는다 — 응용 팁 'wave' 적용본
/* eslint-disable */
// @ts-nocheck

import { seg, canvas, rr } from "./helpers.js";
import { EZ, bgFill, cap, hash, sstep, txt2, txtk, txtm, uiReset } from "./shared/common.js";

const ST={C:10,R:4,SP:1.6,T0:.4,DU:.45};
const STP=[{n:'시작점부터',code:"from: 'start'"},{n:'가운데부터',code:"from: 'center'"},{n:'가장자리부터',code:"from: 'edges'"},{n:'무작위',code:"from: 'random'"}];
STP.forEach((p,pi)=>{
  const raw=[];for(let r=0;r<ST.R;r++)for(let q=0;q<ST.C;q++){
    const dc=Math.hypot(q-(ST.C-1)/2,r-(ST.R-1)/2);
    raw.push(pi===0?Math.hypot(q,r):pi===1?dc:pi===2?-dc:hash(q*7+3,r*5+1));}
  const mn=Math.min(...raw),mx=Math.max(...raw);p.d=raw.map(v=>(v-mn)/(mx-mn));
});

const demo = {
  dur: 3.2, rest: 1.6, noCompare: false, levels: 0,
  mount(sp){sp.style.background='#080a10';return {ctx:canvas(sp)};},
  render(s,t,a){
    const c=s.ctx;uiReset(c);bgFill(c,'#0b0e16','#06080c');
    STP.forEach((p,pi)=>{
      const px=14+(pi%2)*312,py=18+Math.floor(pi/2)*148;
      rr(c,px,py,300,138,10);c.fillStyle='rgba(255,255,255,.03)';c.fill();c.strokeStyle='rgba(255,255,255,.08)';c.lineWidth=1;c.stroke();
      txt2(c,p.n,px+12,py+17,12,a?'#f4efe4':'#9ba3ad',700);txtm(c,a?p.code:'동시에(stagger 없음)',px+288,py+17,8.5,a?'#ffb27f':'#6a7385','right');
      const gx=px+13,gy=py+26;
      for(let r=0;r<ST.R;r++)for(let q=0;q<ST.C;q++){
        const d=a?p.d[r*ST.C+q]:0,t0=ST.T0+d*ST.SP,u=seg(t,t0,t0+ST.DU);if(u<=.002)continue;
        const sc=Math.max(0,EZ.outBack(u)),al=sstep(0,.35,u),cx=gx+q*28+11,cy=gy+r*28+11,w=22*sc;
        if(w<2)continue;
        const cm=d<.5?[111+69*d*2,211-61*d*2,255]:[180+75*(d-.5)*2,150-12*(d-.5)*2,255-194*(d-.5)*2],R=a?Math.round(cm[0]):91,G=a?Math.round(cm[1]):101,Bc=a?Math.round(cm[2]):119;
        c.globalAlpha=al;const g=c.createLinearGradient(0,cy-w/2,0,cy+w/2);g.addColorStop(0,'rgb('+Math.min(255,R+50)+','+Math.min(255,G+50)+','+Math.min(255,Bc+50)+')');g.addColorStop(1,'rgb('+R+','+G+','+Bc+')');
        rr(c,cx-w/2,cy-w/2,w,w,5*sc);c.fillStyle=g;c.fill();c.strokeStyle='rgba(255,255,255,.25)';c.lineWidth=.8;rr(c,cx-w/2+.5,cy-w/2+.5,w-1,w-1,5*sc);c.stroke();c.globalAlpha=1;
      }
    });
    const n=ST.C*ST.R,ds=STP[1].d,first=a?Math.min(...ds)*ST.SP:0,last=a?Math.max(...ds)*ST.SP:0;
    txtk(c,a?'칸 '+n+'개 · 첫 칸 '+first.toFixed(2)+'초 → 마지막 칸 '+last.toFixed(2)+'초 · 칸당 평균 간격 '+(last/(n-1)).toFixed(3)+'초 · 한 칸의 등장 '+ST.DU+'초':'칸 '+n+'개가 모두 같은 시각(0.00초)에 등장 · 시선이 갈 곳이 없음',16,324,9,a?'#3ecf8e':'#ff7a70');
    cap(c,a?'연출 후: 같은 40칸, 같은 1.6초 — 순서(패턴)만 달라서 시선이 흐르는 방향이 달라진다':'연출 전: 40칸이 한꺼번에 튀어나옴 — 어디부터 봐야 할지 모름',16,350);
  }
};
export default demo;
