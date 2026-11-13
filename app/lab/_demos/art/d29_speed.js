// 만들어진 파일 — 원본: 시각 연출 사전 아티팩트 d29. 직접 고치지 않는다 — 응용 팁 'speed' 적용본
/* eslint-disable */
// @ts-nocheck

import { canvas } from "./helpers.js";
import { TAU, cap } from "./shared/common.js";

const RP_DROPS=[{t:.9,x:210,y:150},{t:2.0,x:440,y:215},{t:3.0,x:330,y:112}];
const RP_W=640,RP_H=360;
function rpScene(s){
  const x=s.src.getContext('2d');
  const g=x.createLinearGradient(0,0,0,360);g.addColorStop(0,'#0f4558');g.addColorStop(1,'#08202f');x.fillStyle=g;x.fillRect(0,0,640,360);
  x.strokeStyle='rgba(255,255,255,.14)';x.lineWidth=1;
  for(let i=0;i<=640;i+=32){x.beginPath();x.moveTo(i+.5,0);x.lineTo(i+.5,360);x.stroke();}
  for(let j=0;j<=360;j+=32){x.beginPath();x.moveTo(0,j+.5);x.lineTo(640,j+.5);x.stroke();}
  x.font='400 150px "Black Han Sans","Malgun Gothic",sans-serif';x.textAlign='center';x.textBaseline='middle';
  const tg=x.createLinearGradient(0,100,0,260);tg.addColorStop(0,'#fff7ea');tg.addColorStop(1,'#ffb27a');x.fillStyle=tg;x.fillText('물결',320,170);
  x.fillStyle='#ff8a3d';x.fillRect(254,252,132,5);
  x.font='600 13px "IBM Plex Sans KR","Malgun Gothic",sans-serif';x.fillStyle='rgba(236,231,220,.8)';x.fillText('RIPPLE · 파문이 번지는 화면',320,282);
  s.S=x.getImageData(0,0,640,360).data;s.S32=new Uint32Array(s.S.buffer.slice(0));
}

const demo = {
  dur: 5.4, rest: 3.2, noCompare: false, levels: 0,
  mount(sp){
    sp.style.background='#08202f';
    const src=document.createElement('canvas');src.width=640;src.height=360;
    const off=document.createElement('canvas');off.width=640;off.height=360;
    const octx=off.getContext('2d'),img=octx.createImageData(640,360);
    return {ctx:canvas(sp),src,off,octx,img,out32:new Uint32Array(img.data.buffer),DX:new Float32Array(640*360),DY:new Float32Array(640*360),SH:new Float32Array(640*360),fontOk:false,S:null};
  },
  render(s,t,a){
    const fOk=!!(document.fonts&&document.fonts.check('120px "Black Han Sans"'));
    if(!s.S||(fOk&&!s.fontOk)){rpScene(s);s.fontOk=fOk;}
    const c=s.ctx;c.setTransform(2,0,0,2,0,0);c.globalCompositeOperation='source-over';c.globalAlpha=1;c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';
    const dropAnim=()=>RP_DROPS.forEach(d=>{                      /* 떨어지는 물방울 + 닿는 순간 빛 */
      const f=(t-(d.t-.26))/.26;
      if(f>0&&f<1){const yy=d.y-110*(1-f*f);c.globalAlpha=.9;c.fillStyle='#e8f8ff';c.beginPath();c.ellipse(d.x,yy,3,3+9*f,0,0,TAU);c.fill();}
      const u=t-d.t;if(u>0&&u<.5){c.globalAlpha=(1-u/.5)*.9;c.strokeStyle='#e8f8ff';c.lineWidth=1.6;c.beginPath();c.ellipse(d.x,d.y,4+u*38,(4+u*38)*.75,0,0,TAU);c.stroke();}
      c.globalAlpha=1;
    });
    if(!a){                                   /* 연출 전: 화면은 가만히 있고 동심원 선만 번진다 */
      c.drawImage(s.src,0,0,640,360);
      RP_DROPS.forEach(d=>{const u=t-d.t;if(u<=0)return;for(let j=0;j<3;j++){const uu=u-j*.28;if(uu<=0||uu>2)continue;c.globalAlpha=(1-uu/2)*.8;c.strokeStyle='#e8f8ff';c.lineWidth=1.4;c.beginPath();c.arc(d.x,d.y,uu*150,0,TAU);c.stroke();}});
      c.globalAlpha=1;cap(c,'연출 전: 동심원 선만 번짐 · 화면 자체는 그대로 · 빛과 굴절이 없음',16,344);return;
    }
    const W=RP_W,H=RP_H,DX=s.DX,DY=s.DY,SH=s.SH;DX.fill(0);DY.fill(0);SH.fill(0);
    let X0=W,X1=0,Y0=H,Y1=0;const k=TAU/28,Lw=60;
    RP_DROPS.forEach(d=>{
      const u=t-d.t;if(u<=0)return;const R=80*u;if(R>760)return;
      const A=3.6*Math.exp(-.45*u)/Math.sqrt(1+R/60),x0=Math.max(0,Math.floor(d.x-R-Lw*1.7)),x1=Math.min(W-1,Math.ceil(d.x+R+Lw*1.7)),y0=Math.max(0,Math.floor(d.y-R-Lw*1.7)),y1=Math.min(H-1,Math.ceil(d.y+R+Lw*1.7));
      if(A<.12)return;
      X0=Math.min(X0,x0);X1=Math.max(X1,x1);Y0=Math.min(Y0,y0);Y1=Math.max(Y1,y1);
      const Ro=R+Lw*1.7,Ri=Math.max(0,R-Lw*1.7);
      for(let y=y0;y<=y1;y++){
        const dy=y-d.y,o2=Ro*Ro-dy*dy;if(o2<=0)continue;
        const wo=Math.sqrt(o2),i2=Ri*Ri-dy*dy,wi=i2>0?Math.sqrt(i2):0;
        for(let side=0;side<2;side++){
          const a0=side?d.x+(wi||1):d.x-wo,a1=side?d.x+wo:d.x-wi,xa=Math.max(x0,Math.ceil(a0)),xb=Math.min(x1,Math.floor(a1));
          for(let x=xa;x<=xb;x++){
            const dx=x-d.x,r=Math.sqrt(dx*dx+dy*dy),dr=r-R;
            const env=Math.exp(-(dr/Lw)*(dr/Lw)),h=A*env*Math.cos(k*dr),sl=-A*env*k*Math.sin(k*dr),inv=1/(r+1e-3),ux=dx*inv,uy=dy*inv,i=y*W+x;
            DX[i]+=ux*h;DY[i]+=uy*h;SH[i]+=sl*(ux*-.55+uy*-.83)*-40;
          }
        }
      }
    });
    const S=s.S,out=s.out32;out.set(s.S32);const od=s.img.data;
    if(X1>=X0){
      for(let y=Y0;y<=Y1;y++)for(let x=X0;x<=X1;x++){
        const i=y*W+x,ddx=DX[i],ddy=DY[i],sh=SH[i];if(ddx===0&&ddy===0&&sh===0)continue;
        let sx=x+ddx,sy=y+ddy;sx=sx<0?0:(sx>638.99?638.99:sx);sy=sy<0?0:(sy>358.99?358.99:sy);
        const ix=sx|0,iy=sy|0,fx=sx-ix,fy=sy-iy,p=(iy*W+ix)*4,q=p+W*4,w00=(1-fx)*(1-fy),w10=fx*(1-fy),w01=(1-fx)*fy,w11=fx*fy;
        let r=S[p]*w00+S[p+4]*w10+S[q]*w01+S[q+4]*w11+sh,g=S[p+1]*w00+S[p+5]*w10+S[q+1]*w01+S[q+5]*w11+sh,b=S[p+2]*w00+S[p+6]*w10+S[q+2]*w01+S[q+6]*w11+sh*1.1;
        r=r<0?0:(r>255?255:r);g=g<0?0:(g>255?255:g);b=b<0?0:(b>255?255:b);
        out[i]=(255<<24)|((b|0)<<16)|((g|0)<<8)|(r|0);
      }
    }
    s.octx.putImageData(s.img,0,0);c.drawImage(s.off,0,0,640,360);
    dropAnim();
    const n=RP_DROPS.filter(d=>t>d.t).length;
    cap(c,'물결 높이 h = A·cos(k(r−R)) → 픽셀을 밀고(굴절) 경사로 밝기를 더함(빛) · 물방울 '+n+'/3',16,344);
  }
};
export default demo;
