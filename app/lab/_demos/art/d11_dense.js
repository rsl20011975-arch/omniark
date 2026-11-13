// 만들어진 파일 — 원본: 시각 연출 사전 아티팩트 d11. 직접 고치지 않는다 — 응용 팁 'dense' 적용본
/* eslint-disable */
// @ts-nocheck

import { seg, E, rng, canvas } from "./helpers.js";
import { TAU, bgFill, cap, glowDot } from "./shared/common.js";
import { mixc } from "./shared/g11.js";

function sampleText(txt,size,step,max){
  const o=document.createElement('canvas');o.width=640;o.height=360;const x=o.getContext('2d');
  x.fillStyle='#fff';x.font='400 '+size+'px "Black Han Sans","Malgun Gothic",sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText(txt,320,172);
  const d=x.getImageData(0,0,640,360).data,P=[];
  for(let y=0;y<360;y+=step)for(let xx=0;xx<640;xx+=step)if(d[(y*640+xx)*4+3]>140)P.push([xx,y]);
  const r=rng(7);for(let i=P.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[P[i],P[j]]=[P[j],P[i]];}
  return P.slice(0,max);
}

const demo = {
  dur: 5, rest: 4.2, noCompare: false, levels: 0,
  mount(sp){
    sp.style.background='#080a10';
    return {ctx:canvas(sp),pts:null,fontOk:false};
  },
  render(s,t,a){
    const c=s.ctx;c.setTransform(2,0,0,2,0,0);
    const fOk=!!(document.fonts&&document.fonts.check('120px "Black Han Sans"'));
    if(!s.pts||(fOk&&!s.fontOk)){
      const T=sampleText('움직임',150,3,2700),r=rng(11);
      s.pts=T.map(p=>{const ang=r()*TAU,rad=170+r()*260;return {tx:p[0],ty:p[1],sx:320+Math.cos(ang)*rad*1.3,sy:180+Math.sin(ang)*rad*.8,d:p[0]/640*.9+r()*.25,ph:r()*TAU,z:r()};});
      s.fontOk=fOk;
    }
    bgFill(c,'#0a0d14','#06080c');
    if(!a){                                   /* 연출 전: 글자가 제자리에서 그냥 나타난다 */
      c.globalAlpha=E.outC(seg(t,.2,1));c.fillStyle='#ece7dc';c.font='400 150px "Black Han Sans","Malgun Gothic",sans-serif';c.textAlign='center';c.textBaseline='middle';c.fillText('움직임',320,172);
      c.globalAlpha=1;return;
    }
    c.globalCompositeOperation='lighter';
    const sw=E.inOutC(seg(t,3.4,4.4)),sx=-40+sw*720;          /* 다 모인 뒤 빛이 한 번 훑고 지나감 */
    s.pts.forEach(p=>{
      const st=.3+p.d*1.4,pr=E.outExpo(seg(t,st,st+1.3)),off=(1-pr)*Math.sin(p.ph+t*3.2)*26;
      let x=p.sx+(p.tx-p.sx)*pr+off*.6,y=p.sy+(p.ty-p.sy)*pr+off*.4*Math.cos(p.ph);
      if(pr>=1){x+=Math.sin(t*2.1+p.ph)*.5;y+=Math.cos(t*1.7+p.ph)*.5;}
      const col=mixc([70,170,255],[255,214,170],pr),lit=Math.exp(-Math.pow((x-sx)/46,2));
      glowDot(c,col,x,y,2.6-.9*pr+lit*2.2,.55+.4*pr+lit*.5);
    });
    const ul=E.outC(seg(t,3.0,4.0));                          /* 다 모이면 글자 바탕에 은은한 빛이 차올라 글자가 단단해 보인다 */
    if(ul>0){c.globalAlpha=.2*ul;c.fillStyle='rgb(255,214,170)';c.font='400 150px "Black Han Sans","Malgun Gothic",sans-serif';c.textAlign='center';c.textBaseline='middle';c.fillText('움직임',320,172);}
    c.globalAlpha=1;cap(c,'입자 '+s.pts.length+'개 · 도착 시간 순서 = 왼쪽→오른쪽',16,344);
  }
};
export default demo;
