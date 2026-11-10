// 만들어진 파일 — 원본: 시각 연출 사전 아티팩트 d86. 직접 고치지 않는다
/* eslint-disable */
// @ts-nocheck

import { seg, canvas, rr } from "./helpers.js";
import { EZ, bgFill, cap, ezMax, sstep, txt2, txtk, uiReset } from "./shared/common.js";
import { EN_COL, enCard } from "./shared/g86.js";

const EN86=[
  {n:'페이드',use:'조용한 배경·보조 요소',p:'0.30초 · 이동 없음',D:.3,col:'#8b94a3',f:u=>({al:EZ.outQ(u)})},
  {n:'슬라이드 업',use:'목록·카드 (가장 무난)',p:'0.45초 · 아래 24px에서',D:.45,col:'#3ecf8e',f:u=>({al:sstep(0,.6,u),dy:24*(1-EZ.outC(u))})},
  {n:'스케일 인',use:'모달·팝업·툴팁',p:'0.40초 · 85% → 100%',D:.4,col:'#6fd3ff',f:u=>({al:sstep(0,.5,u),sc:.85+.15*EZ.outC(u)})},
  {n:'팝',use:'뱃지·버튼·강조 요소',p:'0.45초 · 60% → '+Math.round((.6+.4*ezMax(EZ.outBack))*100)+'% → 100%',D:.45,col:'#ffcf5a',f:u=>({al:sstep(0,.25,u),sc:.6+.4*EZ.outBack(u)})},
  {n:'블러 인',use:'제목·고급스러운 분위기',p:'0.60초 · 번짐 12px → 0',D:.6,col:'#b49cff',f:u=>({al:sstep(0,.7,u),blur:12*(1-EZ.outC(u)),sc:1.04-.04*EZ.outC(u)})},
  {n:'와이프',use:'이미지·제목 공개',p:'0.60초 · 왼쪽 → 오른쪽',D:.6,col:'#ff8a3d',f:u=>({clip:EZ.inOutC(u)})}
];

const demo = {
  dur: 2.8, rest: 1.6, noCompare: false, levels: 0,
  mount(sp){sp.style.background='#080a10';return {ctx:canvas(sp)};},
  render(s,t,a){
    const c=s.ctx;uiReset(c);bgFill(c,'#0b0e16','#06080c');
    EN86.forEach((e,i)=>{
      const px=14+(i%3)*208,py=16+Math.floor(i/3)*152,cw=150,ch=54,cx=px+25,cy=py+48;
      rr(c,px,py,200,142,10);c.fillStyle='rgba(255,255,255,.03)';c.fill();c.strokeStyle='rgba(255,255,255,.08)';c.lineWidth=1;c.stroke();
      txt2(c,a?e.n:'(효과 없음)',px+12,py+19,13,a?e.col:'#9ba3ad',700);
      const u=a?seg(t,.4,.4+e.D):(t>=.4?1:0),st=a?e.f(u):{al:u};
      c.save();c.beginPath();c.rect(px+2,py+30,196,84);c.clip();
      const mx=cx+cw/2,my=cy+ch/2;c.translate(mx,my+(st.dy||0));if(st.sc)c.scale(st.sc,st.sc);c.translate(-mx,-my);
      if(st.blur>.2)c.filter='blur('+st.blur.toFixed(1)+'px)';
      if(st.clip!==undefined){c.beginPath();c.rect(cx-8,cy-8,(cw+16)*st.clip,ch+30);c.clip();}
      enCard(c,cx,cy,cw,ch,a?e.col:'#8b94a3',st.al===undefined?1:st.al,'새 구독자 3명','방금 전 · 쇼츠에서 유입');
      c.filter='none';c.restore();
      txtk(c,a?e.use:'0초 · 갑자기 컷으로 나타남',px+12,py+122,10,a?EN_COL.sec:'#6a7385');
      txtk(c,a?e.p:'시작·끝 구별 없음',px+12,py+136,9.5,a?EN_COL.muted:'#6a7385');
    });
    cap(c,a?'연출 후: 같은 카드, 같은 위치 — 등장 방식 6가지가 용도별로 다른 인상을 만든다':'연출 전: 효과 없이 툭 — 요소가 “생겼다”는 신호가 없어 시선이 따라가지 못한다',16,350);
  }
};
export default demo;
