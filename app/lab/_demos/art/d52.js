// 만들어진 파일 — 원본: 시각 연출 사전 아티팩트 d52. 직접 고치지 않는다
/* eslint-disable */
// @ts-nocheck

import { seg, E, rng, canvas, rr } from "./helpers.js";
import { TAU, TY_DISP, cap, txt2, uiReset } from "./shared/common.js";

function glPrep(src,tm,r){                              /* 흐림 단계 이미지를 프레임당 한 번만 만든다 */
  if(r<.6)return {l0:0,fr:0,top:0};
  const lv=Math.min(4,Math.log2(1+r*.5)),l0=Math.floor(lv),fr=lv-l0,top=Math.min(4,l0+1);
  let cur=src;for(let l=1;l<=top;l++){const t2=tm[l-1],x=t2.getContext('2d');x.globalCompositeOperation='copy';x.imageSmoothingEnabled=true;x.imageSmoothingQuality='high';x.drawImage(cur,0,0,t2.width,t2.height);cur=t2;}
  return {l0,fr,top};
}
function glDraw(c,src,tm,f){const im=l=>l===0?src:tm[l-1];c.drawImage(im(f.l0),0,0,640,360);if(f.fr>.02&&f.top>f.l0){c.globalAlpha=f.fr;c.drawImage(im(f.top),0,0,640,360);c.globalAlpha=1;}}
function glBg(c,t){
  c.setTransform(1,0,0,1,0,0);const g=c.createLinearGradient(0,0,0,360);g.addColorStop(0,'#14102c');g.addColorStop(1,'#0a0c18');c.fillStyle=g;c.fillRect(0,0,640,360);
  [[120,110,150,[255,120,60],.7,.9],[480,90,130,[120,90,255],.6,1.1],[330,260,170,[60,200,255],.55,.8],[560,280,110,[255,90,170],.6,1.3]].forEach((b,i)=>{
    const x=b[0]+60*Math.sin(t*.45*b[5]+i*1.7),y=b[1]+36*Math.cos(t*.5*b[5]+i),rg=c.createRadialGradient(x,y,2,x,y,b[2]);rg.addColorStop(0,'rgba('+b[3]+','+b[4]+')');rg.addColorStop(1,'rgba('+b[3]+',0)');c.fillStyle=rg;c.fillRect(x-b[2],y-b[2],b[2]*2,b[2]*2);});
  c.strokeStyle='rgba(255,255,255,.12)';c.lineWidth=1;for(let x=0;x<640;x+=32){c.beginPath();c.moveTo(x+.5,0);c.lineTo(x+.5,360);c.stroke();}for(let y=0;y<360;y+=32){c.beginPath();c.moveTo(0,y+.5);c.lineTo(640,y+.5);c.stroke();}
  c.font='400 64px '+TY_DISP;c.textAlign='left';c.textBaseline='alphabetic';c.lineWidth=2;c.strokeStyle='rgba(255,255,255,.55)';c.strokeText('BACKGROUND',34,180);c.strokeText('SHARP LINES',150,300);
  c.fillStyle='rgba(255,255,255,.85)';[[60,50,6],[300,64,4],[420,200,5],[580,150,7]].forEach(d=>{c.beginPath();c.arc(d[0],d[1],d[2],0,TAU);c.fill();});
}

const demo = {
  dur: 5.2, rest: 3.6, noCompare: false, levels: 0,
  mount(sp){sp.style.background='#0a0c18';const mk=(w,h)=>{const o=document.createElement('canvas');o.width=w;o.height=h;return o;};
    const bg=mk(640,360),nz=mk(96,96),nx=nz.getContext('2d'),img=nx.createImageData(96,96),r=rng(8);for(let i=0;i<96*96;i++){const v=r()*255;img.data[i*4]=img.data[i*4+1]=img.data[i*4+2]=v;img.data[i*4+3]=255;}nx.putImageData(img,0,0);
    return {ctx:canvas(sp),bg,bgx:bg.getContext('2d'),tm:[mk(320,180),mk(160,90),mk(80,45),mk(40,23)],nz};},
  render(s,t,a){
    const c=s.ctx;uiReset(c);c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';
    glBg(s.bgx,t);c.drawImage(s.bg,0,0,640,360);
    const frost=a?E.inOutC(seg(t,.9,2.4)):0,gf=a?glPrep(s.bg,s.tm,frost*14):null,cards=[{x:70+40*Math.sin(t*.5),y:62+16*Math.cos(t*.6),w:256,h:158,k:0},{x:318+30*Math.cos(t*.45),y:176+14*Math.sin(t*.55),w:256,h:140,k:1}];
    cards.forEach(cd=>{
      c.save();c.shadowColor='rgba(0,0,0,'+(a?.5:.35)+')';c.shadowBlur=a?30:14;c.shadowOffsetY=a?14:6;rr(c,cd.x,cd.y,cd.w,cd.h,16);c.fillStyle=a?'rgba(255,255,255,.08)':'#2a2f3b';c.fill();c.restore();
      if(a){c.save();rr(c,cd.x,cd.y,cd.w,cd.h,16);c.clip();glDraw(c,s.bg,s.tm,gf);
        c.fillStyle='rgba(255,255,255,'+(.04+.1*frost)+')';c.fillRect(cd.x,cd.y,cd.w,cd.h);
        const hg=c.createLinearGradient(cd.x,cd.y,cd.x+cd.w,cd.y+cd.h);hg.addColorStop(0,'rgba(255,255,255,.22)');hg.addColorStop(.45,'rgba(255,255,255,.02)');hg.addColorStop(1,'rgba(255,255,255,.08)');c.fillStyle=hg;c.fillRect(cd.x,cd.y,cd.w,cd.h);
        c.globalAlpha=.07*frost;c.fillStyle=c.createPattern(s.nz,'repeat');c.fillRect(cd.x,cd.y,cd.w,cd.h);c.globalAlpha=1;
        if(cd.k===0&&t>3.0&&t<4.4){const sx=cd.x-80+(cd.w+200)*E.inOutC(seg(t,3.0,4.4)),sg=c.createLinearGradient(sx-50,0,sx+50,0);sg.addColorStop(0,'rgba(255,255,255,0)');sg.addColorStop(.5,'rgba(255,255,255,.35)');sg.addColorStop(1,'rgba(255,255,255,0)');c.save();c.translate(cd.x+cd.w/2,cd.y+cd.h/2);c.rotate(.35);c.translate(-(cd.x+cd.w/2),-(cd.y+cd.h/2));c.fillStyle=sg;c.fillRect(sx-50,cd.y-80,100,cd.h+160);c.restore();}
        c.restore();
        const bgd=c.createLinearGradient(cd.x,cd.y,cd.x+cd.w,cd.y+cd.h);bgd.addColorStop(0,'rgba(255,255,255,.7)');bgd.addColorStop(.5,'rgba(255,255,255,.12)');bgd.addColorStop(1,'rgba(255,255,255,.35)');rr(c,cd.x+.5,cd.y+.5,cd.w-1,cd.h-1,16);c.strokeStyle=bgd;c.lineWidth=1.2;c.stroke();
      }else{rr(c,cd.x+.5,cd.y+.5,cd.w-1,cd.h-1,16);c.strokeStyle='#3a4254';c.lineWidth=1;c.stroke();}
      const tc=a?'#ffffff':'#dfe5ee';
      if(cd.k===0){txt2(c,'글래스 카드',cd.x+22,cd.y+40,19,tc,700);txt2(c,'뒤 배경이 은은하게 비쳐요',cd.x+22,cd.y+64,12,a?'rgba(255,255,255,.82)':'#9ba3ad',500);
        [[cd.x+22,cd.y+90,150],[cd.x+22,cd.y+108,200],[cd.x+22,cd.y+126,110]].forEach(l=>{rr(c,l[0],l[1],l[2],7,3.5);c.fillStyle=a?'rgba(255,255,255,.35)':'#3a4254';c.fill();});}
      else{txt2(c,'오늘 조회수',cd.x+22,cd.y+38,12,a?'rgba(255,255,255,.8)':'#9ba3ad',600);txt2(c,'1,284,300',cd.x+22,cd.y+84,34,tc,700);txt2(c,'+12.4%  지난달 대비',cd.x+22,cd.y+112,12.5,a?'#ffd6aa':'#8b94a3',600);}
    });
    cap(c,a?'흐림 0 → 14px · 반투명 칠 · 모서리 빛 · 입자 · 빛 줄기가 한 번 지나감':'연출 전: 불투명 회색 카드 → 뒤 배경과 분리되지만 깊이·투명감이 없음',16,350);
  }
};
export default demo;
