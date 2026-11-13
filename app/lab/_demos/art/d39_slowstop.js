// 만들어진 파일 — 원본: 시각 연출 사전 아티팩트 d39. 직접 고치지 않는다 — 응용 팁 'slowstop' 적용본
/* eslint-disable */
// @ts-nocheck

import { seg, E, canvas, rr } from "./helpers.js";
import { bgFill, cap, txt2, uiReset } from "./shared/common.js";

const OD={digits:[1,2,8,4,3,0,0],cw:44,chh:66,gap:6,comma:16,RS:58};
const OD_TOK=(()=>{const t=[];[0,'c',1,2,3,'c',4,5,6].forEach(v=>t.push(v==='c'?{c:1}:{i:v}));return t;})();
function odPos(i,t){const stop=1.4+i*.3,u=seg(t,.5,stop),tr=(2+i%3)*10+OD.digits[i];let p=tr*E.outC(u);if(t>stop){const k=t-stop;p+=.14*Math.exp(-k*9)*Math.sin(k*26);}return p;}

const demo = {
  dur: 4.2, rest: 3.6, noCompare: false, levels: 0,
  mount(sp){sp.style.background='#080a10';return {ctx:canvas(sp)};},
  render(s,t,a){
    const c=s.ctx;uiReset(c);bgFill(c,'#0b0e16','#06080c');
    const widths=OD_TOK.map(k=>k.c?OD.comma:OD.cw),tot=widths.reduce((p,q)=>p+q,0)+OD.gap*(OD_TOK.length-1),x0=320-tot/2,y0=150;
    txt2(c,'누적 조회수',x0,y0-16,15,'#8b94a3',600);
    if(!a){const n=Math.round(1284300*E.outC(seg(t,.5,2.4)));txt2(c,n.toLocaleString('en-US'),320,y0+62,58,'#f4efe4',700,'center');txt2(c,'회',x0+tot+8,y0+62,20,'#8b94a3',600);
      cap(c,'연출 전: 숫자가 같은 자리에서 값만 바뀜 → 자릿수마다 폭이 흔들리고 어디가 움직이는지 안 보임',16,344);return;}
    let x=x0,allDone=true;
    OD_TOK.forEach((k,ti)=>{
      if(k.c){txt2(c,',',x+OD.comma/2,y0+OD.chh-12,34,'#8b94a3',700,'center');x+=OD.comma+OD.gap;return;}
      const i=k.i,p=odPos(i,t),stop=1.4+i*.3;if(t<stop+.35)allDone=false;
      const v=(p-odPos(i,t-.025))/.025,m=Math.min(15,Math.abs(v)*.016*OD.RS*.9);
      c.save();rr(c,x,y0,OD.cw,OD.chh,9);c.fillStyle='#10141c';c.fill();c.clip();
      for(let kk=Math.floor(p)-2;kk<=Math.floor(p)+3;kk++){const dig=((kk%10)+10)%10,cy=y0+OD.chh/2+(kk-p)*OD.RS+15;
        if(m>2.5){c.globalAlpha=.2;[-1,1].forEach(sg=>txt2(c,String(dig),x+OD.cw/2,cy+sg*m,46,'#f4efe4',700,'center'));c.globalAlpha=.7;}
        txt2(c,String(dig),x+OD.cw/2,cy,46,'#f4efe4',700,'center');c.globalAlpha=1;}
      const g=c.createLinearGradient(0,y0,0,y0+OD.chh);g.addColorStop(0,'rgba(8,10,16,.95)');g.addColorStop(.3,'rgba(8,10,16,0)');g.addColorStop(.7,'rgba(8,10,16,0)');g.addColorStop(1,'rgba(8,10,16,.95)');c.fillStyle=g;c.fillRect(x,y0,OD.cw,OD.chh);c.restore();
      rr(c,x,y0,OD.cw,OD.chh,9);c.strokeStyle='#262e3d';c.lineWidth=1;c.stroke();x+=OD.cw+OD.gap;
    });
    txt2(c,'회',x0+tot+8,y0+OD.chh-8,20,'#8b94a3',600);
    const fin=E.outC(seg(t,3.6,4.2));if(fin>0){c.fillStyle='rgba(255,138,61,.95)';c.fillRect(320-tot/2*fin,y0+OD.chh+14,tot*fin,2);txt2(c,'+ 12.4%  지난달 대비',320,y0+OD.chh+42,14,'#ffb27f',600,'center');}
    cap(c,'자릿수마다 멈추는 시각이 0.3초씩 다름 · 감속 + 작은 반동 · 빠를 땐 흐림',16,344);
  }
};
export default demo;
