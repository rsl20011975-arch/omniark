// 만들어진 파일 — 원본: 시각 연출 사전 아티팩트 d87. 직접 고치지 않는다
/* eslint-disable */
// @ts-nocheck

import { seg, canvas, rr } from "./helpers.js";
import { DV, EZ, bgFill, cap, dvChip, dvHair, sstep, txtk, uiReset } from "./shared/common.js";
import { EN_COL, enCard } from "./shared/g86.js";

const X87={TA:1.7,AIN:.3,IND:.45,UP:24};
function x87(t,a){
  const exitD=a?.25:.5,tB=a?X87.TA+.12:X87.TA+exitD+.1,inP=t0=>{const q=seg(t,t0,t0+X87.IND);return {al:sstep(0,.6,q),dy:X87.UP*(1-EZ.outC(q))};};
  let A=inP(X87.AIN);const q=seg(t,X87.TA,X87.TA+exitD);
  if(q>0){const e=EZ.inC(q);A=a?{al:1-sstep(0,.6,q),dy:-12*e}:{al:1-q,dy:X87.UP*e};}
  return {A,B:inP(tB),exitD,tB,tFull:tB+X87.IND};
}

const demo = {
  dur: 3.6, rest: 1.6, noCompare: false, levels: 0,
  mount(sp){sp.style.background='#080a10';return {ctx:canvas(sp)};},
  render(s,t,a){
    const c=s.ctx;uiReset(c);bgFill(c,'#0b0e16','#06080c');const S=x87(t,a),SB=x87(0,false),SA=x87(0,true);
    dvChip(c,a?'퇴장: 0.25초 · 위로 12px':'퇴장: 등장과 똑같이 0.5초 · 도로 아래로',a?196:274,a?'#ffb27f':'#dfe5ee');
    const cw=220,ch=64,cx=210,cy=80;
    enCard(c,cx,cy+S.A.dy,cw,ch,EN_COL.green,S.A.al,'새 구독자 3명','방금 전 · 쇼츠에서 유입');
    enCard(c,cx,cy+S.B.dy,cw,ch,EN_COL.cyan,S.B.al,'댓글 12개 도착','1분 전 · 롱폼 영상');
    /* 타임라인 */
    const X0=96,K=140,Y1=216,Y2=254,bar=(row,t0,d,col,lab)=>{c.fillStyle=col;rr(c,X0+t0*K,row-8,d*K,16,4);c.fill();if(lab)txtk(c,lab,X0+t0*K+d*K/2,row-12,9.5,EN_COL.sec,'center');};
    rr(c,24,192,592,92,8);c.fillStyle='rgba(255,255,255,.03)';c.fill();
    for(let q=0;q<=3;q++){dvHair(c,X0+q*K,200,X0+q*K,274,DV.grid);txtk(c,q+'초',X0+q*K,296,9.5,EN_COL.muted,'center');}
    txtk(c,'알림 A',34,Y1+4,10.5,EN_COL.sec);txtk(c,'알림 B',34,Y2+4,10.5,EN_COL.sec);
    bar(Y1,X87.AIN,X87.IND,DV.blue,'등장 0.45초');bar(Y1,X87.AIN+X87.IND,X87.TA-X87.AIN-X87.IND,'#2c3445');bar(Y1,X87.TA,S.exitD,DV.orangeD,'퇴장 '+S.exitD.toFixed(2)+'초');
    bar(Y2,S.tB,X87.IND,DV.blue,'등장 0.45초');
    c.strokeStyle='rgba(255,255,255,.7)';c.lineWidth=1.2;c.beginPath();c.moveTo(X0+t*K,198);c.lineTo(X0+t*K,278);c.stroke();
    c.strokeStyle=EN_COL.orange;c.setLineDash([]);c.lineWidth=1.5;c.beginPath();c.moveTo(X0+S.tFull*K,Y2-12);c.lineTo(X0+S.tFull*K,Y2+12);c.stroke();txtk(c,'B 다 보임 '+S.tFull.toFixed(2)+'초',X0+S.tFull*K+6,Y2+4,10,'#ffb27f');
    txtk(c,a?'B가 다 보이는 시각 '+SA.tFull.toFixed(2)+'초(전 '+SB.tFull.toFixed(2)+'초) → 알림 1건당 '+(SB.tFull-SA.tFull).toFixed(2)+'초 단축 · 10건이면 '+((SB.tFull-SA.tFull)*10).toFixed(1)+'초':'B가 다 보이는 시각 '+SB.tFull.toFixed(2)+'초 — A가 완전히 사라지고 0.1초 뒤에야 B가 시작되어 기다리는 시간이 길다',16,326,10,a?EN_COL.green:EN_COL.red);
    cap(c,a?'연출 후: 나갈 때는 등장의 절반 길이로 가던 방향(위)으로 빠져나가고, B가 곧바로 이어 들어온다':'연출 전: 퇴장이 등장과 똑같이 느긋하게 같은 길로 되돌아가서 다음 알림을 기다리게 한다',16,350);
  }
};
export default demo;
