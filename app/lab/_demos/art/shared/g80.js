// 만들어진 파일 — 원본: 시각 연출 사전 아티팩트 분야 g80 도우미. 직접 고치지 않는다
/* eslint-disable */
// @ts-nocheck


function dvComma(n){return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g,',');}
function dvTri(c,x,y,s,up,col){c.fillStyle=col;c.beginPath();if(up){c.moveTo(x,y-s);c.lineTo(x+s*1.05,y+s*.8);c.lineTo(x-s*1.05,y+s*.8);}else{c.moveTo(x,y+s);c.lineTo(x+s*1.05,y-s*.8);c.lineTo(x-s*1.05,y-s*.8);}c.closePath();c.fill();}

export { dvComma, dvTri };
