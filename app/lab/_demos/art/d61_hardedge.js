// 만들어진 파일 — 원본: 시각 연출 사전 아티팩트 d61. 직접 고치지 않는다 — 응용 팁 'hardedge' 적용본
/* eslint-disable */
// @ts-nocheck

import { seg, E, rng, canvas, rr } from "./helpers.js";
import { TAU, bgFill, cap, sstep, txt2, txtm, uiReset } from "./shared/common.js";

const KY={W:400,H:224,ready:false};
function kyBuild(){
  const mk=(w,h)=>{const o=document.createElement('canvas');o.width=w;o.height=h;return o;};
  const W=KY.W,H=KY.H,subC=mk(W,H),sx=subC.getContext('2d');
  sx.fillStyle='#e07a2a';sx.beginPath();sx.moveTo(150,224);sx.lineTo(154,146);sx.quadraticCurveTo(200,128,246,146);sx.lineTo(250,224);sx.closePath();sx.fill();
  sx.fillStyle='#d9a07a';sx.fillRect(190,116,20,26);sx.beginPath();sx.arc(200,92,32,0,TAU);sx.fill();
  sx.fillStyle='#2a1810';sx.beginPath();sx.arc(200,86,33,Math.PI*1.04,Math.PI*1.96);sx.lineTo(228,84);sx.quadraticCurveTo(200,66,172,84);sx.closePath();sx.fill();
  const r=rng(77);sx.lineCap='round';for(let i=0;i<70;i++){const an=Math.PI*(1.0+r()*1.0),len=8+r()*20,bx=200+Math.cos(an)*32,by=88+Math.sin(an)*33;sx.strokeStyle='rgba(42,24,16,'+(.5+r()*.4)+')';sx.lineWidth=.8+r()*.5;sx.beginPath();sx.moveTo(bx,by);sx.quadraticCurveTo(bx+Math.cos(an)*len*.6+(r()-.5)*6,by+Math.sin(an)*len*.6,bx+Math.cos(an)*len,by+Math.sin(an)*len+(r()-.5)*6);sx.stroke();}
  sx.fillStyle='#3a2216';sx.fillRect(186,100,6,3);sx.fillRect(208,100,6,3);
  const sd=sx.getImageData(0,0,W,H).data,sub=new Uint8Array(W*H);for(let i=0;i<W*H;i++){const al=sd[i*4+3];sub[i]=al>200?1:(al>14?2:0);}
  const srcC=mk(W,H),px=srcC.getContext('2d');
  px.fillStyle='rgb(22,172,62)';px.fillRect(0,0,W,H);const lg=px.createRadialGradient(200,100,10,200,100,260);lg.addColorStop(0,'rgba(60,220,100,.45)');lg.addColorStop(1,'rgba(0,70,30,.3)');px.fillStyle=lg;px.fillRect(0,0,W,H);
  px.fillStyle='rgba(0,70,30,.32)';px.beginPath();px.ellipse(200,214,120,16,0,0,TAU);px.fill();
  px.drawImage(subC,0,0);
  const id=px.getImageData(0,0,W,H),d=id.data,rn=rng(3),spill=new Uint8Array(W*H);
  for(let i=0;i<W*H;i++){const nz=(rn()-.5)*14;if(sub[i]!==1){d[i*4]=Math.max(0,Math.min(255,d[i*4]+nz*.4));d[i*4+1]=Math.max(0,Math.min(255,d[i*4+1]+nz));d[i*4+2]=Math.max(0,Math.min(255,d[i*4+2]+nz*.5));}}
  const o=d.slice();
  for(let y=2;y<H-2;y++)for(let x=2;x<W-2;x++){const i=y*W+x;if(sub[i]!==1)continue;let n=0;for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++)if(sub[(y+dy)*W+x+dx]===0)n++;if(n>0){const sp=n/25;spill[i]=Math.min(255,n*10);o[i*4]=Math.max(0,o[i*4]-20*sp);o[i*4+1]=Math.min(255,o[i*4+1]+80*sp);o[i*4+2]=Math.max(0,o[i*4+2]-20*sp);}}
  px.putImageData(new ImageData(o,W,H),0,0);
  const sdat=o,G=new Int16Array(W*H);for(let i=0;i<W*H;i++)G[i]=sdat[i*4+1]-Math.max(sdat[i*4],sdat[i*4+2]);
  const bgC=mk(W,H),bx=bgC.getContext('2d');const bg=bx.createLinearGradient(0,0,0,H);bg.addColorStop(0,'#2a4a8a');bg.addColorStop(.6,'#c8789a');bg.addColorStop(1,'#ffb878');bx.fillStyle=bg;bx.fillRect(0,0,W,H);
  const rb=rng(9);let xx=0;while(xx<W){const bw=26+rb()*40,bh=60+rb()*100;bx.fillStyle='#1c1c40';bx.fillRect(xx,170-bh,bw,bh+60);for(let wy=170-bh+6;wy<166;wy+=9)for(let wx=xx+4;wx<xx+bw-5;wx+=8)if(rb()<.4){bx.fillStyle='rgba(255,214,140,.85)';bx.fillRect(wx,wy,3,4);}xx+=bw+2;}
  const bgd=bx.getImageData(0,0,W,H).data;
  return {src:srcC,sdat:sdat,sub,spill,G,bgd,W,H,mc:mk(W,H),cc:mk(W,H)};
}

const demo = {
  dur: 6.2, rest: 5.6, noCompare: false, levels: 0,
  mount(sp){sp.style.background='#080a10';return {ctx:canvas(sp),K:null};},
  render(s,t,a){
    if(!s.K)s.K=kyBuild();const K=s.K,c=s.ctx;uiReset(c);bgFill(c,'#0b0e16','#06080c');
    const tol=a?.15+.8*E.inOutC(seg(t,1.0,2.6)):.15,fea=a?.1*E.inOutC(seg(t,2.6,3.8)):0,dsp=a?.9*E.inOutC(seg(t,3.6,4.8)):0;
    const t0=115+(40-115)*tol,wd=3+(50-3)*fea,W=K.W,H=K.H,G=K.G,sd=K.sdat,bd=K.bgd,sub=K.sub,sp2=K.spill;
    const mi=K.mc.getContext('2d'),ci=K.cc.getContext('2d'),mdat=mi.createImageData(W,H),cdat=ci.createImageData(W,H),md=mdat.data,cd=cdat.data;
    let bgT=0,bgL=0,sT=0,hole=0,eN=0,eEx=0,stN=0,stK=0;
    for(let i=0;i<W*H;i++){
      const gr=G[i],kb=sstep(t0,t0+wd,gr),af=1-kb,o=i*4,r=sd[o],g=sd[o+1],b=sd[o+2],ex=Math.max(0,g-(r+b)/2),g2=g-dsp*ex;
      const v=af*255;md[o]=md[o+1]=md[o+2]=v;md[o+3]=255;
      cd[o]=r*af+bd[o]*kb;cd[o+1]=g2*af+bd[o+1]*kb;cd[o+2]=b*af+bd[o+2]*kb;cd[o+3]=255;
      const sv=sub[i];if(sv===0){bgT++;if(af>.1)bgL++;}else if(sv===1){sT++;if(af<.9)hole++;if(sp2[i]>0&&af>.3){eN++;eEx+=Math.max(0,g2-Math.max(r,b));}}else{stN++;if(af>.3)stK++;}
    }
    mi.putImageData(mdat,0,0);ci.putImageData(cdat,0,0);c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';
    const PX=[8,220,432],PY=36,PW=200,PH=112,tl=['① 촬영 원본(초록 배경)','② 매트(흰색 = 남김)','③ 합성 결과'];
    [K.src,K.mc,K.cc].forEach((cv,i)=>{txt2(c,tl[i],PX[i],PY-8,11,'#dfe5ee',700);c.save();rr(c,PX[i],PY,PW,PH,8);c.clip();c.drawImage(cv,PX[i],PY,PW,PH);c.restore();rr(c,PX[i]+.5,PY+.5,PW-1,PH-1,8);c.strokeStyle='#262e3d';c.lineWidth=1;c.stroke();});
    /* 조절 막대 */
    const sl=[['허용치(얼마나 초록이면 지우나)',tol,'#6fd3ff'],['가장자리 부드럽게(페더)',fea,'#b49cff'],['초록 번짐 제거(디스필)',dsp/.9,'#3ecf8e']];
    sl.forEach((q,i)=>{const y=186+i*40;txt2(c,q[0],14,y-8,11,'#dfe5ee',600);rr(c,14,y,224,6,3);c.fillStyle='#1a2030';c.fill();rr(c,14,y,Math.max(6,224*q[1]),6,3);c.fillStyle=q[2];c.fill();c.fillStyle='#fff';c.beginPath();c.arc(14+224*q[1],y+3,6,0,TAU);c.fill();txtm(c,Math.round(q[1]*100)+'%',250,y+8,10,'#dfe5ee');});
    /* 실제 측정값 */
    const left=bgL/bgT*100,loss=hole/sT*100,keep=stN?stK/stN*100:0,fr=eN?eEx/eN:0;
    txt2(c,'결과 점검(화면에서 직접 센 값)',330,170,11.5,'#dfe5ee',700);
    [['배경이 남은 비율',left,'낮을수록 좋음',left<2],['피사체 속 구멍',loss,'낮을수록 좋음',loss<2],['머리카락 남은 비율',keep,'높을수록 좋음',keep>40],['테두리의 초록 기운',fr,'낮을수록 좋음',fr<8]].forEach((m,i)=>{const y=190+i*34,ok=m[3];txt2(c,m[0],330,y,10.5,'#9ba3ad',600);rr(c,330,y+6,200,6,3);c.fillStyle='#1a2030';c.fill();rr(c,330,y+6,Math.max(4,200*Math.min(1,m[1]/(i===3?60:100))),6,3);c.fillStyle=ok?'#3ecf8e':'#ff5f57';c.fill();txtm(c,(i===3?m[1].toFixed(0):m[1].toFixed(1)+'%'),540,y+13,10,ok?'#3ecf8e':'#ff7a70');txt2(c,ok?'✓':'✗',612,y+13,12,ok?'#3ecf8e':'#ff7a70',700);});
    cap(c,a?'허용치로 배경 지움 → 페더로 가장자리 부드럽게 → 디스필로 초록 번짐 제거':'연출 전: 한 가지 값으로만 지움 → 배경이 남고 가장자리 처리가 없음',16,350);
  }
};
export default demo;
