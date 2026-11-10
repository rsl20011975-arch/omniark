// 만들어진 파일 — 원본: 시각 연출 사전 아티팩트 d31. 직접 고치지 않는다
/* eslint-disable */
// @ts-nocheck

import { seg, E, rng, canvas } from "./helpers.js";
import { cap, sstep, vn } from "./shared/common.js";

const IK={W:320,H:180,ox:100,oy:125};
function inkScenes(s){
  const mk=(draw)=>{const o=document.createElement('canvas');o.width=1280;o.height=720;const x=o.getContext('2d');x.setTransform(2,0,0,2,0,0);draw(x);return o;};
  const F='"Black Han Sans","Malgun Gothic",sans-serif',G='"IBM Plex Sans KR","Malgun Gothic",sans-serif';
  s.A=mk(x=>{
    x.fillStyle='#f0e7d6';x.fillRect(0,0,640,360);
    const r=rng(5);x.fillStyle='rgba(120,80,40,.07)';for(let i=0;i<2600;i++)x.fillRect(r()*640,r()*360,1,1);
    x.fillStyle='#d3c8b2';[[70,230,300],[70,252,220],[70,274,260]].forEach(q=>x.fillRect(q[0],q[1],q[2],8));
    x.fillStyle='#9a8466';x.font='600 14px '+G;x.textAlign='left';x.fillText('AI에게 시켰더니',70,96);
    x.fillStyle='#8b7f6c';x.font='400 70px '+F;x.fillText('밋밋한 화면',70,170);
  });
  s.B=mk(x=>{
    const g=x.createLinearGradient(0,0,0,360);g.addColorStop(0,'#101c33');g.addColorStop(1,'#070c18');x.fillStyle=g;x.fillRect(0,0,640,360);
    x.fillStyle='#ff8a3d';x.fillRect(70,214,160,7);
    x.fillStyle='#8fa2c4';x.font='600 14px '+G;x.textAlign='left';x.fillText('이렇게 바꿨더니',70,96);
    x.fillStyle='#f4efe4';x.font='400 70px '+F;x.fillText('전문가처럼',70,170);
    x.fillStyle='#a9b6cf';x.font='500 16px '+G;x.fillText('잉크처럼 번지며 장면이 넘어간다',70,252);
  });
}

const demo = {
  dur: 5.2, rest: 2.3, noCompare: false, levels: 0,
  mount(sp){
    sp.style.background='#f0e7d6';
    const mkc=(w,h)=>{const o=document.createElement('canvas');o.width=w;o.height=h;return o;};
    const W=IK.W,H=IK.H,T=new Float32Array(W*H),dmax=Math.hypot(Math.max(IK.ox,W-IK.ox),Math.max(IK.oy,H-IK.oy));
    let mn=1e9,mx=-1e9;
    for(let y=0;y<H;y++)for(let x=0;x<W;x++){
      const d=Math.hypot(x-IK.ox,y-IK.oy)/dmax,n=.55*vn(x*.045,y*.045)+.28*vn(x*.1+11,y*.1)+.12*vn(x*.22+5,y*.22+9)+.05*vn(x*.5,y*.5),v=d*.78+(n-.5)*.5;
      T[y*W+x]=v;if(v<mn)mn=v;if(v>mx)mx=v;
    }
    for(let i=0;i<T.length;i++)T[i]=(T[i]-mn)/(mx-mn);
    const mc=mkc(W,H),rc=mkc(W,H);
    return {ctx:canvas(sp),T,mc,rc,mctx:mc.getContext('2d'),rctx:rc.getContext('2d'),mimg:mc.getContext('2d').createImageData(W,H),rimg:rc.getContext('2d').createImageData(W,H),tmp:mkc(1280,720),A:null,fontOk:false};
  },
  render(s,t,a){
    const fOk=!!(document.fonts&&document.fonts.check('120px "Black Han Sans"'));
    if(!s.A||(fOk&&!s.fontOk)){inkScenes(s);s.fontOk=fOk;}
    const c=s.ctx;c.setTransform(2,0,0,2,0,0);c.globalCompositeOperation='source-over';c.globalAlpha=1;c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';
    const u=seg(t,.8,3.6);
    c.drawImage(s.A,0,0,640,360);
    if(!a){                                   /* 연출 전: 장면 B가 투명도만 올라오는 크로스페이드 */
      c.globalAlpha=E.inOutC(u);c.drawImage(s.B,0,0,640,360);c.globalAlpha=1;
      cap(c,'연출 전: 투명도만 바꾸는 크로스페이드 · 두 화면이 겹쳐 흐릿하게 섞임',16,344);return;
    }
    const W=IK.W,H=IK.H,T=s.T,p=-.05+1.15*E.inOutC(u),md=s.mimg.data,rd=s.rimg.data,rf=sstep(0,.06,p)*(1-sstep(.97,1.08,p));
    for(let i=0;i<W*H;i++){
      const v=T[i],m=1-sstep(p-.012,p+.012,v),dd=(v-(p+.02))/.026,rim=.92*Math.exp(-dd*dd)*rf,o=i*4;
      md[o]=md[o+1]=md[o+2]=255;md[o+3]=m*255;
      rd[o]=12;rd[o+1]=16;rd[o+2]=28;rd[o+3]=rim*255;
    }
    s.mctx.putImageData(s.mimg,0,0);s.rctx.putImageData(s.rimg,0,0);
    const x=s.tmp.getContext('2d');x.setTransform(1,0,0,1,0,0);x.globalCompositeOperation='source-over';x.clearRect(0,0,1280,720);x.drawImage(s.B,0,0);
    x.globalCompositeOperation='destination-in';x.imageSmoothingEnabled=true;x.imageSmoothingQuality='high';x.drawImage(s.mc,0,0,1280,720);x.globalCompositeOperation='source-over';
    c.drawImage(s.tmp,0,0,640,360);c.drawImage(s.rc,0,0,640,360);
    cap(c,'노이즈 지도 T < p 인 곳만 새 장면 · 경계에 번지는 잉크 띠 · p: 0→1 (천천히 시작, 천천히 끝)',16,350);
  }
};
export default demo;
