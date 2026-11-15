// 만들어진 파일 — 원본: 시각 연출 사전 아티팩트 공용 도우미. 직접 고치지 않는다
/* eslint-disable */
// @ts-nocheck
import { rng, rr } from "../helpers.js";

const TAU=Math.PI*2;
const _spr={};
function spr(rgb){                         /* 부드러운 빛 알갱이(64px). 색마다 한 번만 만든다 */
  const k=rgb.join(',');if(_spr[k])return _spr[k];
  const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d');
  const g=x.createRadialGradient(32,32,0,32,32,32);
  g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.18,'rgba('+k+',.95)');g.addColorStop(.5,'rgba('+k+',.28)');g.addColorStop(1,'rgba('+k+',0)');
  x.fillStyle=g;x.fillRect(0,0,64,64);return _spr[k]=c;
}
function glowDot(c,rgb,x,y,r,a){c.globalAlpha=Math.max(0,Math.min(1,a));c.drawImage(spr(rgb),x-r,y-r,r*2,r*2);}
function hash(a,b){return Math.abs(Math.sin(a*12.9898+b*78.233)*43758.5453)%1;}
function bgFill(c,top,bot){const g=c.createLinearGradient(0,0,0,360);g.addColorStop(0,top);g.addColorStop(1,bot);c.globalCompositeOperation='source-over';c.globalAlpha=1;c.fillStyle=g;c.fillRect(0,0,640,360);}
function cap(c,txt,x,y){c.globalCompositeOperation='source-over';c.globalAlpha=.92;c.fillStyle='#aeb6c0';c.font='500 13px "IBM Plex Sans KR","Malgun Gothic",sans-serif';c.textAlign='left';c.textBaseline='alphabetic';c.fillText(txt,x,y);c.globalAlpha=1;}
function bolt(seed,x0,y0,x1,y1,depth,rough){
  const r=rng(seed);let pts=[[x0,y0],[x1,y1]];
  for(let d=0;d<depth;d++){const n=[];for(let i=0;i<pts.length-1;i++){const [ax,ay]=pts[i],[bx,by]=pts[i+1],mx=(ax+bx)/2,my=(ay+by)/2,L=Math.hypot(bx-ax,by-ay);
    const nx=-(by-ay)/L,ny=(bx-ax)/L,off=(r()-.5)*L*rough;n.push([ax,ay],[mx+nx*off,my+ny*off]);}n.push(pts[pts.length-1]);pts=n;}
  return pts;
}
function txt2(c,s,x,y,size,col,w,al){c.save();c.fillStyle=col;c.font=(w||500)+' '+size+'px "IBM Plex Sans KR","Malgun Gothic",sans-serif';c.textAlign=al||'left';c.textBaseline='alphabetic';c.fillText(s,x,y);c.restore();}
const LX=i=>70+i*48.2,LY=v=>300-v/220*240;
const clamp01=v=>Math.max(0,Math.min(1,v));
const sstep=(a,b,x)=>{const u=clamp01((x-a)/(b-a));return u*u*(3-2*u);};
const mixrgb=(a,b,p)=>[a[0]+(b[0]-a[0])*p,a[1]+(b[1]-a[1])*p,a[2]+(b[2]-a[2])*p];
function vh(ix,iy){let h=Math.imul(ix,374761393)^Math.imul(iy,668265263);h=Math.imul(h^(h>>>13),1274126177);return ((h^(h>>>16))>>>0)/4294967296;}
function vn(x,y){const ix=Math.floor(x),iy=Math.floor(y),fx=x-ix,fy=y-iy,u=fx*fx*(3-2*fx),v=fy*fy*(3-2*fy),a=vh(ix,iy),b=vh(ix+1,iy),c=vh(ix,iy+1),d=vh(ix+1,iy+1);return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v;}
const UI_SANS='"IBM Plex Sans KR","Malgun Gothic",sans-serif',UI_MONO='"JetBrains Mono","Malgun Gothic",monospace';
function txtm(c,s,x,y,size,col,al){c.save();c.fillStyle=col;c.font='500 '+size+'px '+UI_MONO;c.textAlign=al||'left';c.textBaseline='alphabetic';c.fillText(s,x,y);c.restore();}
function uiReset(c){c.setTransform(2,0,0,2,0,0);c.globalAlpha=1;c.globalCompositeOperation='source-over';c.shadowColor='transparent';c.shadowBlur=0;c.shadowOffsetY=0;c.setLineDash([]);}
const UI_CUR=[[0,0],[0,17],[4.2,13.2],[7,19.5],[9.8,18.3],[7,12.2],[12.2,12]];
function uiCursor(c,x,y,sc){c.save();c.translate(x,y);c.scale(sc,sc);c.shadowColor='rgba(0,0,0,.5)';c.shadowBlur=6;c.shadowOffsetY=2;c.beginPath();UI_CUR.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();c.fillStyle='#fff';c.fill();c.shadowColor='transparent';c.lineWidth=1.2;c.strokeStyle='#10141c';c.stroke();c.restore();}
function fuBr(c,x,y,w,h,p,col){                          /* 모서리 꺾쇠: 진행 p(0~1)만큼 뻗는다 */
  const L=Math.min(w,h)*.16+4;c.strokeStyle=col;c.lineWidth=1.4;
  [[x,y,1,1],[x+w,y,-1,1],[x+w,y+h,-1,-1],[x,y+h,1,-1]].forEach(k=>{c.beginPath();c.moveTo(k[0]+k[2]*L*p,k[1]);c.lineTo(k[0],k[1]);c.lineTo(k[0],k[1]+k[3]*L*p);c.stroke();});
}
const TY_DISP='"Black Han Sans","Malgun Gothic",sans-serif';
function tyLay(c,text,font,cx,track){                    /* 글자별 가로 위치(가운데 정렬) */
  c.font=font;const tr=track||0,chars=[...text],ws=chars.map(ch=>c.measureText(ch).width);
  const tot=ws.reduce((p,q)=>p+q,0)+tr*(chars.length-1);let x=cx-tot/2;
  return chars.map((ch,i)=>{const o={ch,x,w:ws[i]};x+=ws[i]+tr;return o;});
}
function tyDraw(c,ch,x,y,font,col){c.font=font;c.fillStyle=col;c.textAlign='left';c.textBaseline='alphabetic';c.fillText(ch,x,y);}
const PL={bad:[[255,120,160],[255,210,80],[110,220,150],[90,170,255],[190,130,255]],good:[[16,20,28],[27,34,48],[255,138,61],[27,34,48],[27,34,48]],bw:[.2,.2,.2,.2,.2],gw:[.6,.3,.1,0,0]};
function clipArt(c,x,y,w,h,k,t){
  c.save();c.beginPath();c.rect(x,y,w,h);c.clip();c.translate(x,y);c.scale(w/320,h/180);
  if(k===0){const g=c.createLinearGradient(0,0,0,110);g.addColorStop(0,'#2a1c5a');g.addColorStop(.6,'#c8566a');g.addColorStop(1,'#ffb070');c.fillStyle=g;c.fillRect(0,0,320,180);
    const sg=c.createRadialGradient(160,104,2,160,104,70);sg.addColorStop(0,'rgba(255,240,200,1)');sg.addColorStop(.25,'rgba(255,190,120,.6)');sg.addColorStop(1,'rgba(255,170,100,0)');c.fillStyle=sg;c.fillRect(60,30,200,150);
    c.fillStyle='#17102e';c.fillRect(0,108,320,72);for(let i=0;i<9;i++){const yy=114+i*8;c.strokeStyle='rgba(255,190,130,'+(.5-i*.045)+')';c.lineWidth=1.4;c.beginPath();for(let xx=0;xx<=320;xx+=8){const yv=yy+Math.sin(xx*.05+t*1.6+i)*1.8;xx?c.lineTo(xx,yv):c.moveTo(xx,yv);}c.stroke();}
    const bx=((t*18)%380)-30;c.fillStyle='#0b0818';c.beginPath();c.moveTo(bx,112);c.lineTo(bx+24,112);c.lineTo(bx+20,118);c.lineTo(bx+4,118);c.closePath();c.fill();c.beginPath();c.moveTo(bx+12,92);c.lineTo(bx+12,111);c.lineTo(bx+24,111);c.closePath();c.fill();}
  else if(k===1){const g=c.createLinearGradient(0,0,0,180);g.addColorStop(0,'#0a1030');g.addColorStop(1,'#1c1c48');c.fillStyle=g;c.fillRect(0,0,320,180);
    const r=rng(5);let bx=-6;while(bx<326){const bw=22+r()*28,bh=50+r()*80;c.fillStyle='#10132e';c.fillRect(bx,150-bh,bw,bh+40);for(let wy=150-bh+6;wy<146;wy+=9)for(let wx=bx+4;wx<bx+bw-5;wx+=8){const on=hash(wx*.31,wy*.17)>.55&&Math.sin(t*2+wx+wy)>-.7;if(on){c.fillStyle='rgba(255,214,140,.8)';c.fillRect(wx,wy,3,4);}}bx+=bw+2;}
    c.fillStyle='#0a0c1e';c.fillRect(0,150,320,30);const cx=((t*70)%420)-50;c.fillStyle='rgba(255,90,90,.9)';c.fillRect(cx,160,16,5);const lg=c.createLinearGradient(cx-60,0,cx,0);lg.addColorStop(0,'rgba(255,90,90,0)');lg.addColorStop(1,'rgba(255,90,90,.6)');c.fillStyle=lg;c.fillRect(cx-60,162,60,2);}
  else if(k===2){const g=c.createLinearGradient(0,0,0,180);g.addColorStop(0,'#143a2c');g.addColorStop(1,'#071a14');c.fillStyle=g;c.fillRect(0,0,320,180);
    for(let row=0;row<3;row++){c.fillStyle='rgba('+(10+row*8)+','+(60+row*28)+','+(40+row*14)+',1)';for(let i=0;i<9;i++){const bx=i*40+row*13+Math.sin(t*.8+i+row)*2,by=170-row*20,hh=70+row*16;c.beginPath();c.moveTo(bx,by-hh);c.lineTo(bx-18-row*2,by);c.lineTo(bx+18+row*2,by);c.closePath();c.fill();}}
    for(let i=0;i<14;i++){const fx=hash(i,1)*320+Math.sin(t*.9+i)*8,fy=40+hash(i,2)*110+Math.cos(t*.7+i)*6,al=Math.max(0,Math.sin(t*2.2+i*1.7));c.fillStyle='rgba(210,255,140,'+al+')';c.beginPath();c.arc(fx,fy,1.8,0,TAU);c.fill();}}
  else{c.fillStyle='#120a2e';c.fillRect(0,0,320,180);const sg=c.createRadialGradient(160,90,4,160,90,50);sg.addColorStop(0,'rgba(255,110,200,.95)');sg.addColorStop(1,'rgba(255,110,200,0)');c.fillStyle=sg;c.fillRect(90,30,140,120);c.fillStyle='#ff7ac8';c.beginPath();c.arc(160,86,26,Math.PI,TAU);c.fill();
    c.fillStyle='#120a2e';c.fillRect(0,96,320,84);c.strokeStyle='rgba(110,211,255,.7)';c.lineWidth=1;for(let i=-10;i<=10;i++){c.beginPath();c.moveTo(160+i*6,96);c.lineTo(160+i*46,180);c.stroke();}
    for(let i=0;i<9;i++){const z=((i+t*1.2)%9)/9,yy=96+Math.pow(z,2.2)*84;c.strokeStyle='rgba(110,211,255,'+(.2+z*.6)+')';c.beginPath();c.moveTo(0,yy);c.lineTo(320,yy);c.stroke();}}
  c.restore();
}
function bgLogo(c,x,y,r,al,lw){c.save();c.globalAlpha=al;c.strokeStyle='#ff8a3d';c.lineWidth=lw||3;c.beginPath();c.arc(x,y,r,0,TAU);c.stroke();const g=c.createRadialGradient(x-r*.3,y-r*.3,1,x,y,r*.6);g.addColorStop(0,'#ffd9b0');g.addColorStop(1,'#ff8a3d');c.fillStyle=g;c.beginPath();c.arc(x,y,r*.46,0,TAU);c.fill();c.restore();}
const AC={X0:30,X1:610,Y0:54,Y1:178,P:[[0,.12],[.1,.22],[.25,.36],[.38,.5],[.5,.64],[.58,.46],[.75,.78],[.9,.97],[1,.3]],
  U:[.04,.18,.34,.5,.68,.84,.96],UF:[.07,.21,.36,.5,.64,.79,.93],N:['훅','문제 제시','첫 시도','반전(중간점)','위기','해결','요약·CTA']};
function txtk(c,s,x,y,size,col,al){txt2(c,s,x,y,Math.max(size,9.5),col,500,al);}
const EZ={
  linear:x=>x,inQ:x=>x*x,outQ:x=>1-(1-x)*(1-x),inOutQ:x=>x<.5?2*x*x:1-Math.pow(-2*x+2,2)/2,
  inC:x=>x*x*x,outC:x=>1-Math.pow(1-x,3),inOutC:x=>x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2,
  outExpo:x=>x>=1?1:1-Math.pow(2,-10*x),
  outBack:x=>{const c1=1.70158,c3=c1+1;return 1+c3*Math.pow(x-1,3)+c1*Math.pow(x-1,2);},
  outElastic:x=>x<=0?0:x>=1?1:Math.pow(2,-10*x)*Math.sin((x*10-.75)*(2*Math.PI)/3)+1,
  outBounce:x=>{const n1=7.5625,d1=2.75;if(x<1/d1)return n1*x*x;if(x<2/d1)return n1*(x-=1.5/d1)*x+.75;if(x<2.5/d1)return n1*(x-=2.25/d1)*x+.9375;return n1*(x-=2.625/d1)*x+.984375;}
};
function ezMax(fn){let m=0;for(let i=0;i<=200;i++)m=Math.max(m,fn(i/200));return m;}
function ezBall(c,x,y,r,col,al){c.save();c.globalAlpha*=(al===undefined?1:al);const g=c.createRadialGradient(x-r*.35,y-r*.4,r*.08,x,y,r);g.addColorStop(0,'rgba(255,255,255,.95)');g.addColorStop(.28,col);g.addColorStop(1,'rgba(0,0,0,.55)');c.fillStyle=col;c.beginPath();c.arc(x,y,r,0,TAU);c.fill();c.fillStyle=g;c.fill();c.restore();}
function ezShadow(c,x,y,rx,ry,a){c.save();c.translate(x,y);c.scale(1,ry/rx);const g=c.createRadialGradient(0,0,0,0,0,rx);g.addColorStop(0,'rgba(0,0,0,'+a+')');g.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=g;c.beginPath();c.arc(0,0,rx,0,TAU);c.fill();c.restore();}
const DV={grid:'rgba(255,255,255,.07)',axis:'rgba(255,255,255,.24)',muted:'#8b94a3',sec:'#c3c2b7',ink:'#f4efe4',gray:'#5a6578',blue:'#3987e5',blueL:'#86b6ef',orange:'#ff8a3d',orangeD:'#d95926',good:'#0ca30c',bad:'#e66767',surf:'#0b0e16'};
function dvHair(c,x1,y1,x2,y2,col){c.strokeStyle=col||DV.grid;c.lineWidth=1;c.beginPath();c.moveTo(x1,y1+.5);c.lineTo(x2,y2+.5);c.stroke();}
function dvBar(c,x,y,w,h,r,col){if(w<=.5||h<=.5)return;c.fillStyle=col;rr(c,x,y,w,h,Math.min(r,w/2,h/2));c.fill();c.fillRect(x,y,Math.min(r+1,w),h);}
function dvChip(c,txt,w,col,x,y){rr(c,x||14,y||12,w,20,10);c.fillStyle='rgba(0,0,0,.65)';c.fill();txt2(c,txt,(x||14)+12,(y||12)+14,11.5,col,700);}

export { TAU, _spr, spr, glowDot, hash, bgFill, cap, bolt, txt2, LX, LY, clamp01, sstep, mixrgb, vh, vn, UI_SANS, UI_MONO, txtm, uiReset, UI_CUR, uiCursor, fuBr, TY_DISP, tyLay, tyDraw, PL, clipArt, bgLogo, AC, txtk, EZ, ezMax, ezBall, ezShadow, DV, dvHair, dvBar, dvChip };
