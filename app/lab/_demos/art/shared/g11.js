// 만들어진 파일 — 원본: 시각 연출 사전 아티팩트 분야 g11 도우미. 직접 고치지 않는다
/* eslint-disable */
// @ts-nocheck


const q16=v=>Math.max(0,Math.min(255,Math.round(v/16)*16));
const mixc=(a,b,p)=>[q16(a[0]+(b[0]-a[0])*p),q16(a[1]+(b[1]-a[1])*p),q16(a[2]+(b[2]-a[2])*p)];

export { q16, mixc };
