// 만들어진 파일 — 원본: 시각 연출 사전 아티팩트 d16. 직접 고치지 않는다 — 응용 팁 'split' 적용본
/* eslint-disable */
// @ts-nocheck

import { seg, E, canvas } from "./helpers.js";
import { bgFill, cap, hash } from "./shared/common.js";

function glitchLayers(){
  const w=document.createElement('canvas');w.width=1280;w.height=720;const x=w.getContext('2d');
  x.fillStyle='#fff';x.font='400 230px "Black Han Sans","Malgun Gothic",sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText('연출 효과',640,350);
  const tint=col=>{const t=document.createElement('canvas');t.width=1280;t.height=720;const y=t.getContext('2d');y.drawImage(w,0,0);y.globalCompositeOperation='source-in';y.fillStyle=col;y.fillRect(0,0,1280,720);return t;};
  return {R:tint('#ff2a3a'),G:tint('#2aff7a'),B:tint('#2a7aff')};
}
const GLB=[[.9,1.2],[2.0,2.35],[3.2,3.45],[4.15,4.3]];

const demo = {
  dur: 5, rest: 3.3, noCompare: false, levels: 0,
  mount(sp){
    sp.style.background='#05060a';
    return {ctx:canvas(sp),L:null,fontOk:false};
  },
  render(s,t,a){
    const c=s.ctx;c.setTransform(2,0,0,2,0,0);
    const fOk=!!(document.fonts&&document.fonts.check('120px "Black Han Sans"'));
    if(!s.L||(fOk&&!s.fontOk)){s.L=glitchLayers();s.fontOk=fOk;}
    bgFill(c,'#080a10','#05060a');
    const pop=E.outBack(seg(t,.1,.6));
    if(!a){                                   /* 연출 전: 글자가 제자리에 가만히 있다 */
      c.globalCompositeOperation='source-over';c.globalAlpha=E.outC(seg(t,.1,.5));c.fillStyle='#ece7dc';c.font='400 115px "Black Han Sans","Malgun Gothic",sans-serif';c.textAlign='center';c.textBaseline='middle';c.fillText('연출 효과',320,175);
      c.globalAlpha=1;cap(c,'연출 전: 어긋남·찢김·스캔라인 없음',16,344);return;
    }
    const f=Math.floor(t*24),inB=GLB.some(b=>t>=b[0]&&t<b[1]),I=inB?.35+.65*hash(f,1):0;
    const amt=.8+I*10;                          /* RGB 어긋남(640px 기준 px) */
    c.globalCompositeOperation='lighter';
    c.globalAlpha=Math.min(1,pop*1.4)*(.92+.08*hash(f,2));
    const bandH=14,y0=96,y1=250;
    [['R',-1],['G',0],['B',1]].forEach(([k,dir])=>{
      if(!inB){c.drawImage(s.L[k],dir*amt,0,640,360);return;}
      for(let by=0;by<360;by+=bandH){
        const inText=by>=y0&&by<y1,ox=inText?(hash(f,by)-.5)*30*I:0;
        c.drawImage(s.L[k],0,by*2,1280,bandH*2,dir*amt+ox,by,640,bandH);
      }
    });
    if(inB){ for(let i=0;i<2;i++){const ty=100+hash(f,5+i)*150;c.globalAlpha=.5*I;c.fillStyle='#fff';c.fillRect(hash(f,9+i)*200,ty,200+hash(f,11+i)*300,1.5);} }
    c.globalCompositeOperation='source-over';c.globalAlpha=.2;c.fillStyle='#000';
    for(let y=0;y<360;y+=2)c.fillRect(0,y,640,1);                       /* 스캔라인 */
    const rb=((t*70)%440)-40;c.globalAlpha=.05;c.fillStyle='#fff';c.fillRect(0,rb,640,40);
    c.globalAlpha=1;cap(c,'RGB 어긋남 ±'+amt.toFixed(1)+'px · '+(inB?'줄 찢김 ON':'대기')+' · 스캔라인 항상',16,344);
  }
};
export default demo;
