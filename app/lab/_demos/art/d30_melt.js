// 만들어진 파일 — 원본: 시각 연출 사전 아티팩트 d30. 직접 고치지 않는다 — 응용 팁 'melt' 적용본
/* eslint-disable */
// @ts-nocheck

import { seg, E, canvas } from "./helpers.js";
import { bgFill, cap, sstep, vn } from "./shared/common.js";

const LT={x0:40,x1:600,y0:70,y1:280,gw:81,gh:46};
function ltScene(s){
  const x=s.src.getContext('2d');x.clearRect(0,0,640,360);
  x.font='400 132px "Black Han Sans","Malgun Gothic",sans-serif';x.textAlign='center';x.textBaseline='middle';
  const tg=x.createLinearGradient(0,100,0,250);tg.addColorStop(0,'#fff3e2');tg.addColorStop(.55,'#ffb676');tg.addColorStop(1,'#ff7a30');
  x.lineJoin='round';x.strokeStyle='rgba(120,36,8,.9)';x.lineWidth=7;x.strokeText('액체 글자',320,172);x.fillStyle=tg;x.fillText('액체 글자',320,172);
  s.S=x.getImageData(0,0,640,360).data;
}

const demo = {
  dur: 5.6, rest: 0.9, noCompare: false, levels: 0,
  mount(sp){
    sp.style.background='#080a10';
    const src=document.createElement('canvas');src.width=640;src.height=360;
    const off=document.createElement('canvas');off.width=640;off.height=360;
    const octx=off.getContext('2d'),img=octx.createImageData(640,360);
    const glow=document.createElement('canvas');glow.width=160;glow.height=90;
    return {ctx:canvas(sp),src,off,octx,img,glow,gctx:glow.getContext('2d'),GX:new Float32Array(LT.gw*LT.gh),GY:new Float32Array(LT.gw*LT.gh),fontOk:false,S:null};
  },
  render(s,t,a){
    const fOk=!!(document.fonts&&document.fonts.check('120px "Black Han Sans"'));
    if(!s.S||(fOk&&!s.fontOk)){ltScene(s);s.fontOk=fOk;}
    const c=s.ctx;c.setTransform(2,0,0,2,0,0);c.globalCompositeOperation='source-over';c.globalAlpha=1;c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';
    const Am=60*Math.pow(1-seg(t,.1,2.9),2.2),Ah=3.4*sstep(3.2,3.8,t)*(1-sstep(5.0,5.5,t));
    bgFill(c,'#0a0d14','#06080c');
    c.strokeStyle='rgba(255,255,255,.035)';c.lineWidth=1;for(let y=8;y<360;y+=8){c.beginPath();c.moveTo(0,y+.5);c.lineTo(640,y+.5);c.stroke();}
    const gl=c.createRadialGradient(320,230,10,320,230,300);gl.addColorStop(0,'rgba(255,120,50,'+(.10+.22*sstep(3.2,3.8,t)*(1-sstep(5.0,5.5,t)))+')');gl.addColorStop(1,'rgba(255,120,50,0)');c.fillStyle=gl;c.fillRect(0,0,640,360);
    const al=E.outC(seg(t,0,.7));
    if(!a){                                   /* 연출 전: 글자가 가만히 나타났다 가만히 있다 */
      c.globalAlpha=al;c.drawImage(s.src,0,0,640,360);c.globalAlpha=1;
      cap(c,'연출 전: 글자가 제자리에서 그냥 나타나 가만히 있음',16,344);return;
    }
    const {gw,gh,x0,x1,y0,y1}=LT,GX=s.GX,GY=s.GY;
    for(let j=0;j<gh;j++)for(let i=0;i<gw;i++){
      const m=(vn(i*.16+t*.5,j*.16+3.1)-.5)*2+.5*(vn(i*.34,j*.34-t*.4+7)-.5)*2,m2=(vn(i*.16+11,j*.16-t*.45+1.7)-.5)*2+.5*(vn(i*.34+5,j*.34+t*.35)-.5)*2;
      const hz=(vn(i*.55,j*.30-t*2.6)-.5)*2,hz2=(vn(i*.5+9,j*.3-t*2.6+4)-.5)*2;
      GX[j*gw+i]=m*Am+hz*Ah;GY[j*gw+i]=m2*Am+hz2*Ah*.4;
    }
    const S=s.S,od=s.img.data;od.fill(0);
    for(let y=y0;y<y1;y++){
      const gy=y/8,iy=gy|0,fy=gy-iy,r0=iy*gw,r1=r0+gw;
      for(let x=x0;x<x1;x++){
        const gx=x/8,ix=gx|0,fx=gx-ix,w00=(1-fx)*(1-fy),w10=fx*(1-fy),w01=(1-fx)*fy,w11=fx*fy;
        const dx=GX[r0+ix]*w00+GX[r0+ix+1]*w10+GX[r1+ix]*w01+GX[r1+ix+1]*w11,dy=GY[r0+ix]*w00+GY[r0+ix+1]*w10+GY[r1+ix]*w01+GY[r1+ix+1]*w11;
        let sx=x-dx,sy=y-dy;if(sx<0||sy<0||sx>638.99||sy>358.99)continue;
        const jx=sx|0,jy=sy|0,ex=sx-jx,ey=sy-jy,p=(jy*640+jx)*4,q=p+2560,a00=S[p+3]*(1-ex)*(1-ey),a10=S[p+7]*ex*(1-ey),a01=S[q+3]*(1-ex)*ey,a11=S[q+7]*ex*ey,at=a00+a10+a01+a11;
        if(at<1)continue;
        const o=(y*640+x)*4;
        od[o]=(S[p]*a00+S[p+4]*a10+S[q]*a01+S[q+4]*a11)/at;od[o+1]=(S[p+1]*a00+S[p+5]*a10+S[q+1]*a01+S[q+5]*a11)/at;od[o+2]=(S[p+2]*a00+S[p+6]*a10+S[q+2]*a01+S[q+6]*a11)/at;od[o+3]=at;
      }
    }
    s.octx.putImageData(s.img,0,0);
    const gx=s.gctx;gx.clearRect(0,0,160,90);gx.drawImage(s.off,0,0,160,90);
    c.globalAlpha=al*.9;c.globalCompositeOperation='lighter';c.drawImage(s.glow,0,0,640,360);c.globalCompositeOperation='source-over';
    c.globalAlpha=al;c.drawImage(s.off,0,0,640,360);c.globalAlpha=1;
    cap(c,t<3.2?'변위 '+Math.round(Am)+'px → 0 (감속) · 노이즈 2겹이 천천히 흘러서 액체처럼 굳음':'열기 왜곡: 위로 흐르는 노이즈 · 최대 3px · 따뜻한 역광',16,344);
  }
};
export default demo;
