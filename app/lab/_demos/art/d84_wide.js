// 만들어진 파일 — 원본: 시각 연출 사전 아티팩트 d84. 직접 고치지 않는다 — 응용 팁 'wide' 적용본
/* eslint-disable */
// @ts-nocheck

import { seg, canvas, rr } from "./helpers.js";
import { DV, EZ, bgFill, cap, dvBar, dvChip, dvHair, sstep, txt2, txtk, uiReset } from "./shared/common.js";
import { dvComma, dvTri } from "./shared/g80.js";

const W84=(function(){
  const st=[{n:'시작',v:800,tot:1},{n:'신규 유입',v:420},{n:'이탈',v:-180},{n:'재구독',v:90},{n:'환불',v:-60},{n:'끝',tot:1}];let run=0;
  st.forEach((s,i)=>{if(s.tot&&i===0){run=s.v;s.from=0;s.to=run;}else if(s.tot){s.v=run;s.from=0;s.to=run;}else{s.from=run;run+=s.v;s.to=run;}});
  return {st,end:run,sum:st.filter(s=>!s.tot).reduce((p,q)=>p+q.v,0)};
})();

const demo = {
  dur: 5.2, rest: 1.8, noCompare: false, levels: 0,
  mount(sp){sp.style.background='#080a10';return {ctx:canvas(sp)};},
  render(s,t,a){
    const c=s.ctx;uiReset(c);bgFill(c,'#0b0e16','#06080c');
    const st=W84.st,PX=70,PITCH=90,BW=76,Y0=a?286:218,SY=a?.1615:.3;
    dvChip(c,a?'워터폴 (누적 흐름)':'증감만 막대 (기준선 0)',a?170:200,a?'#ffb27f':'#dfe5ee');
    txt2(c,'월 구독자 변화 (예시 데이터)',PX,52,10.5,DV.muted,600);
    if(a){[0,500,1000].forEach(v=>{const y=Y0-v*SY;dvHair(c,PX-6,y,PX+PITCH*5+BW+10,y,v?DV.grid:DV.axis);txtk(c,dvComma(v),PX-12,y+3.5,9.5,DV.muted,'right');});}
    else dvHair(c,PX-6,Y0,PX+PITCH*5+BW+10,Y0,DV.axis);
    st.forEach((s,i)=>{
      const ts=.4+i*.55,u=EZ.outC(seg(t,ts,ts+.45)),x=PX+i*PITCH;
      txtk(c,s.n,x+BW/2,a?Y0+16:310,10,DV.sec,'center');
      if(u<=0)return;
      if(!a){
        if(s.tot){if(i===0)txtk(c,'시작·끝은 없음',x+BW/2,Y0-6,9.5,'#6a7385','center');return;}
        const h=s.v*SY*u,col=s.v>0?DV.blue:DV.orangeD;
        if(s.v>0)dvBar(c,x,Y0-h,BW,h,4,col);else{c.fillStyle=col;rr(c,x,Y0,BW,-h,4);c.fill();c.fillRect(x,Y0,BW,Math.min(5,-h));}
        const ly=s.v>0?Y0-h-8:Y0-h+16;dvTri(c,x+10,ly-4,4,s.v>0,col);txt2(c,(s.v>0?'+':'−')+Math.abs(s.v),x+BW/2+6,ly,12,DV.ink,700,'center');return;
      }
      const lo=Math.min(s.from,s.from+(s.to-s.from)*u),hi=Math.max(s.from,s.from+(s.to-s.from)*u),col=s.tot?DV.blueL:s.v>0?DV.blue:DV.orangeD;
      dvBar(c,x,Y0-hi*SY,BW,(hi-lo)*SY,4,col);
      if(u>=1&&i<st.length-1){c.strokeStyle='rgba(255,255,255,.35)';c.lineWidth=1;c.beginPath();c.moveTo(x+BW,Y0-s.to*SY+.5);c.lineTo(x+PITCH,Y0-s.to*SY+.5);c.stroke();}
      if(u>=.6){const top=Y0-Math.max(s.from,s.to)*SY-8;c.globalAlpha=sstep(.6,1,u);
        if(s.tot)txt2(c,dvComma(s.v),x+BW/2,top,13,DV.ink,700,'center');
        else{dvTri(c,x+8,top-4,4,s.v>0,col);txt2(c,(s.v>0?'+':'−')+Math.abs(s.v),x+BW/2+6,top,12,DV.ink,700,'center');}
        c.globalAlpha=1;}
    });
    const eq='800 + 420 − 180 + 90 − 60 = '+dvComma(W84.end)+(W84.sum+800===W84.end?'  ✓ (합이 맞음)':'  ✗');
    if(a)c.globalAlpha=sstep(3.7,4.2,t);
    txtk(c,a?eq:'증감의 합 +'+W84.sum+' — 시작값(800)을 더해야 끝값이 나오는데 이 차트에는 둘 다 없다',16,334,10,a?'#3ecf8e':'#ff7a70');c.globalAlpha=1;
    cap(c,a?'연출 후: 막대가 이전 막대가 끝난 높이에서 떠서 올라가고(파랑) 내려가며(주황) 끝값에 도착':'연출 전: 증감만 0에서 그림 — 모두 합쳐 얼마가 됐는지는 머릿속에서 계산해야 한다',16,350);
  }
};
export default demo;
