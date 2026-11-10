// 만들어진 파일 — 원본: 시각 연출 사전 아티팩트 d26. 직접 고치지 않는다 — 응용 팁 'blue' 적용본
/* eslint-disable */
// @ts-nocheck

import { seg, lerp, E, canvas } from "./helpers.js";
import { TAU, bgFill, cap, mixrgb, sstep } from "./shared/common.js";

const MB_W=320,MB_H=180,MB_CELL=2;
const MB_WOB=[[1.5,.08],[2.6,-.09],[3.52,.05],[3.62,.05],[3.7,.04]];
const MB_DROPS=[{x:-22,vx:-46,vy:-330,r:15},{x:2,vx:10,vy:-430,r:11},{x:26,vx:62,vy:-375,r:9}];
function mbBlobs(t){
  const m=E.inOutC(seg(t,.4,1.7)),B=[];
  let wob=1;MB_WOB.forEach(w=>{if(t>w[0]){const u=t-w[0];wob+=w[1]*Math.exp(-4.5*u)*Math.sin(24*u);}});
  const ax=lerp(150,308,m),bx=lerp(500,332,m),ay=lerp(212,205,m),by=lerp(214,205,m);
  B.push([ax,ay,44*wob],[bx,by,36*wob]);
  MB_DROPS.forEach(d=>{
    const t0=2.6,u=t-t0;if(u<0)return;
    const g=900,x=320+d.x+d.vx*u,y=160+d.vy*u+.5*g*u*u;
    if(y>182&&u>.15)return;                                     /* 몸통에 떨어지면 필드가 합쳐져 사라짐 */
    const vy=d.vy+g*u,sp=Math.min(1,Math.abs(vy)/430);
    B.push([x,y,d.r]);
    B.push([x-d.vx*.03,y-vy*.03,d.r*(.35+.35*sp)]);             /* 빠르면 뒤에 작은 방울을 붙여 물방울 꼬리 */
  });
  return B;
}

const demo = {
  dur: 5, rest: 4.6, noCompare: false, levels: 0,
  mount(sp){
    sp.style.background='#070a10';
    const off=document.createElement('canvas');off.width=MB_W;off.height=MB_H;
    return {ctx:canvas(sp),off,octx:off.getContext('2d'),img:off.getContext('2d').createImageData(MB_W,MB_H),F:new Float32Array(MB_W*MB_H),Z:new Float32Array(MB_W*MB_H)};
  },
  render(s,t,a){
    const c=s.ctx;c.setTransform(2,0,0,2,0,0);c.globalCompositeOperation='source-over';c.globalAlpha=1;
    bgFill(c,'#0a0d14','#06080c');
    const bg=c.createRadialGradient(320,205,10,320,205,230);bg.addColorStop(0,'rgba(50,140,255,.16)');bg.addColorStop(1,'rgba(50,140,255,0)');c.fillStyle=bg;c.fillRect(0,0,640,360);
    const B=mbBlobs(t);
    if(!a){                                   /* 연출 전: 원을 겹쳐 그리기만 한다. 경계가 딱딱하고 목이 생기지 않는다 */
      c.fillStyle='#ff8a3d';B.forEach(b=>{if(b[2]<4)return;c.beginPath();c.arc(b[0],b[1],b[2],0,TAU);c.fill();});
      cap(c,'연출 전: 원 몇 개를 겹쳐 그림 · 닿아도 목이 안 생기고 빛도 없음',16,344);return;
    }
    const W=MB_W,H=MB_H,F=s.F,Z=s.Z,cs=MB_CELL;
    for(let y=0;y<H;y++){const py=(y+.5)*cs;for(let x=0;x<W;x++){const px=(x+.5)*cs;let f=0;
      for(let k=0;k<B.length;k++){const b=B[k],dx=px-b[0],dy=py-b[1];f+=b[2]*b[2]/(dx*dx+dy*dy+1);}
      const i=y*W+x;F[i]=f;Z[i]=f>1?Math.sqrt(1-1/f):0;}}
    const D=s.img.data,L=[-.42,-.62,.66],Ll=Math.hypot(L[0],L[1],L[2]);
    for(let y=0;y<H;y++)for(let x=0;x<W;x++){
      const i=y*W+x,o=i*4,f=F[i];
      if(f<.84||x<1||y<1||x>W-2||y>H-2){D[o+3]=0;continue;}
      const dzx=(Z[i+1]-Z[i-1])/(2*cs),dzy=(Z[i+W]-Z[i-W])/(2*cs);
      let nx=-46*dzx,ny=-46*dzy,nz=1;const nl=Math.hypot(nx,ny,nz);nx/=nl;ny/=nl;nz/=nl;
      const dif=Math.max(0,(nx*L[0]+ny*L[1]+nz*L[2])/Ll),hx=L[0]/Ll,hy=L[1]/Ll,hz=L[2]/Ll+1,hl=Math.hypot(hx,hy,hz);
      const sp=Math.pow(Math.max(0,(nx*hx+ny*hy+nz*hz)/hl),48),rim=Math.pow(1-nz,2.4),z=Z[i];
      const base=mixrgb([140,220,255],[20,110,190],Math.pow(z,.7));
      const lit=.42+.62*dif;
      D[o]=Math.min(255,base[0]*lit+255*sp*.95+120*rim*.35);D[o+1]=Math.min(255,base[1]*lit+235*sp*.95+200*rim*.35);D[o+2]=Math.min(255,base[2]*lit+215*sp*.9+255*rim*.35);
      D[o+3]=255*sstep(.88,1.1,f);
    }
    s.octx.putImageData(s.img,0,0);
    c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';
    c.shadowColor='rgba(0,0,0,.55)';c.shadowBlur=26;c.shadowOffsetY=16;
    c.drawImage(s.off,0,0,640,360);
    c.shadowColor='transparent';c.shadowBlur=0;c.shadowOffsetY=0;
    cap(c,'필드 합 ≥ 1 인 곳만 액체 · 가까워지면 목(neck)이 저절로 생김 · 방울 '+(B.length>2?'분리 중':'2개'),16,344);
  }
};
export default demo;
