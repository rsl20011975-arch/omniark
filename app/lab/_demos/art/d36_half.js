// 만들어진 파일 — 원본: 시각 연출 사전 아티팩트 d36. 직접 고치지 않는다 — 응용 팁 'half' 적용본
/* eslint-disable */
// @ts-nocheck

import { seg, E, canvas, rr } from "./helpers.js";
import { TAU, bgFill, cap, txt2, uiReset } from "./shared/common.js";
import { ckCheck } from "./shared/g32.js";

const UC={x:[18,225,432],w:190,y:46,h:218,T0:.6,T1:3.4,DIN:[.36,.52,.6],DOUT:[.24,.36,.4],LAB:['열기 180ms · 닫기 120ms','열기 260ms · 닫기 180ms','열기 300ms · 닫기 200ms'],ES:['easeOut / easeIn','easeOut(살짝 확대) / easeIn','easeOutBack / easeIn']};
function ucV(t,i,a){                                         /* 한 부품의 열림 정도(0~1) */
  if(!a)return (t>=UC.T0&&t<UC.T1)?1:0;
  if(t>=UC.T1)return Math.max(0,1-E.inC(seg(t,UC.T1,UC.T1+UC.DOUT[i])));
  return i===2?E.outBack(seg(t,UC.T0,UC.T0+UC.DIN[i])):E.outC(seg(t,UC.T0,UC.T0+UC.DIN[i]));
}

const demo = {
  dur: 5.6, rest: 2.4, noCompare: false, levels: 0,
  mount(sp){sp.style.background='#080a10';return {ctx:canvas(sp)};},
  render(s,t,a){
    const c=s.ctx;uiReset(c);bgFill(c,'#0b0e16','#06080c');
    const names=['① 드롭다운 메뉴','② 모달 창','③ 토스트 알림'];
    for(let i=0;i<3;i++){
      const X=UC.x[i],Y=UC.y,W=UC.w,H=UC.h,v=ucV(t,i,a);
      txt2(c,names[i],X,36,12,'#dfe5ee',700);
      c.save();c.shadowColor='rgba(0,0,0,.5)';c.shadowBlur=22;c.shadowOffsetY=8;rr(c,X,Y,W,H,10);c.fillStyle='#10141c';c.fill();c.restore();rr(c,X,Y,W,H,10);c.strokeStyle='#262e3d';c.lineWidth=1;c.stroke();
      c.save();rr(c,X,Y,W,H,10);c.clip();
      c.fillStyle='#161b26';c.fillRect(X,Y,W,24);[[10,70],[88,46]].forEach(b=>{rr(c,X+b[0],Y+9,b[1],6,3);c.fillStyle='#2a3446';c.fill();});
      for(let k=0;k<5;k++){rr(c,X+12,Y+40+k*24,W-24-(k%2)*40,8,4);c.fillStyle='#1a2030';c.fill();}
      if(i===0){
        rr(c,X+14,Y+34,104,28,7);c.fillStyle='#1b2230';c.fill();c.strokeStyle=v>.02?'#ff8a3d':'#2f3b50';c.stroke();txt2(c,'정렬 기준',X+26,Y+52,11.5,'#dfe5ee',600);txt2(c,v>.5?'▴':'▾',X+104,Y+52,10,'#8b94a3',600,'center');
        if(v>0){const mh=124,items=['최신순','인기순','이름순','가격순'];c.save();c.beginPath();c.rect(X+10,Y+66,140,mh*Math.min(1,v)+2);c.clip();
          c.globalAlpha=a?Math.min(1,v*1.6):1;c.save();c.shadowColor='rgba(0,0,0,.5)';c.shadowBlur=14;c.shadowOffsetY=6;rr(c,X+14,Y+66,128,mh,8);c.fillStyle='#1b2230';c.fill();c.restore();rr(c,X+14,Y+66,128,mh,8);c.strokeStyle='#2f3b50';c.stroke();
          items.forEach((nm,k)=>{const ia=a?E.outC(seg(t,UC.T0+.12+k*.1,UC.T0+.5+k*.1)):1,out=a&&t>=UC.T1?v:1;c.globalAlpha=ia*out;if(k===1&&(!a||(t>UC.T0+UC.DIN[0]+.3&&t<UC.T1))){rr(c,X+19,Y+66+31*1+4,118,26,6);c.fillStyle='rgba(255,138,61,.16)';c.fill();}
            txt2(c,nm,X+30,Y+66+k*31+23+(1-ia)*5,12,k===1&&(!a||t>UC.T0+UC.DIN[0]+.3)?'#ffb27f':'#dfe5ee',k===1?700:500);});
          c.restore();}
      }
      if(i===1&&v>0){c.fillStyle='rgba(0,0,0,'+.58*v+')';c.fillRect(X,Y,W,H);const sc=a?.9+.1*Math.min(1,v):1,cx=X+W/2,cy=Y+H/2+4;
        c.globalAlpha=a?Math.min(1,v*1.5):1;c.save();c.translate(cx,cy);c.scale(sc,sc);c.translate(-cx,-cy);c.shadowColor='rgba(0,0,0,.6)';c.shadowBlur=24;c.shadowOffsetY=10;rr(c,cx-70,cy-50,140,100,12);c.fillStyle='#1b2230';c.fill();c.restore();
        c.save();c.translate(cx,cy);c.scale(sc,sc);c.translate(-cx,-cy);rr(c,cx-70,cy-50,140,100,12);c.strokeStyle='#2f3b50';c.stroke();txt2(c,'삭제할까요?',cx,cy-20,13,'#dfe5ee',700,'center');txt2(c,'되돌릴 수 없어요',cx,cy-2,10.5,'#8b94a3',500,'center');
        rr(c,cx-58,cy+16,52,24,6);c.fillStyle='#262e3d';c.fill();txt2(c,'취소',cx-32,cy+32,11,'#dfe5ee',600,'center');rr(c,cx+4,cy+16,52,24,6);c.fillStyle='#ff8a3d';c.fill();txt2(c,'삭제',cx+30,cy+32,11,'#1a0f06',700,'center');c.restore();c.globalAlpha=1;}
      if(i===2&&v>0){const oy=(1-v)*(v>=0?44:0),al=a?Math.min(1,Math.max(0,v)*1.5):1;c.globalAlpha=al;c.save();c.shadowColor='rgba(0,0,0,.5)';c.shadowBlur=14;c.shadowOffsetY=5;rr(c,X+15,Y+H-52+oy,160,34,17);c.fillStyle='#1b2230';c.fill();c.restore();rr(c,X+15,Y+H-52+oy,160,34,17);c.strokeStyle='#2f3b50';c.stroke();
        c.fillStyle='#3ecf8e';c.beginPath();c.arc(X+34,Y+H-35+oy,8,0,TAU);c.fill();ckCheck(c,X+34,Y+H-35+oy,1,'#06210f',1.8);txt2(c,'저장했어요',X+50,Y+H-30+oy,12,'#dfe5ee',600);c.globalAlpha=1;}
      c.restore();
      /* 타임라인 막대 */
      const ty=Y+H+20,tx=X,tw=W,T=UC.T1+UC.DOUT[i]+.4,mp=x=>tx+tw*Math.min(1,x/T);
      c.fillStyle='#1a2030';c.fillRect(tx,ty,tw,6);c.fillStyle='#ff8a3d';c.fillRect(mp(UC.T0),ty,Math.max(2,mp(UC.T0+UC.DIN[i])-mp(UC.T0)),6);c.fillStyle='#6fd3ff';c.fillRect(mp(UC.T1),ty,Math.max(2,mp(UC.T1+UC.DOUT[i])-mp(UC.T1)),6);
      const ph=tx+tw*Math.min(1,t/T);c.fillStyle='#fff';c.fillRect(ph-1,ty-4,2,14);
      txt2(c,UC.LAB[i],X,ty+24,10.5,'#dfe5ee',600);txt2(c,UC.ES[i],X,ty+38,10,'#8b94a3',500);
    }
    cap(c,a?'화면에서는 읽을 수 있게 4배 느리게 · 실제 값은 아래 · 들어올 땐 감속, 나갈 땐 가속, 나갈 때가 더 짧게':'연출 전: 이동·확대·페이드 없이 툭 나타나고 툭 사라짐 · 세 부품이 같은 방식',16,350);
  }
};
export default demo;
