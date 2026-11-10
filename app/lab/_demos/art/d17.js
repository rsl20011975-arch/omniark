// 만들어진 파일 — 원본: 시각 연출 사전 아티팩트 d17. 직접 고치지 않는다
/* eslint-disable */
// @ts-nocheck

import { seg, E, el } from "./helpers.js";
import { buildSpeaker, callout, groundShadow, keyLight, px3, stage3d, tag3 } from "./shared/g17.js";
import * as THREE from "three";

const EXP={cap:4.3,led:3.5,body:2.4,driver:1.5,pcb:.75,base:0};
const EXP_ORDER=['cap','led','body','driver','pcb','base'];
const EXP_LABEL={cap:['터치 상단 캡','알루미늄 · 터치 버튼 3개'],led:['LED 링','상태를 빛으로 표시'],body:['패브릭 본체','소리가 통과하는 직물'],driver:['스피커 드라이버','소리를 내는 핵심 부품'],pcb:['회로 기판','연산·블루투스'],base:['고무 받침','미끄럼 방지']};

const demo = {
  dur: 7, rest: 3.9, noCompare: false, levels: 0,
  mount(sp){
    sp.style.background='#0b0e13';
    const S=stage3d(sp);if(S.fail)return S;
    keyLight(S.scene,5,10,6,2.3);const rim=new THREE.DirectionalLight(0x9cc0ff,1.4);rim.position.set(-6,4,-6);S.scene.add(rim);
    groundShadow(S.scene,9);
    const P=buildSpeaker();S.scene.add(P.G);S.P=P;return S;
  },
  render(s,t,a){
    if(s.fail)return;
    const {renderer,scene,camera,octx:o,P}=s;
    const prog={};let mean=0;
    EXP_ORDER.forEach((k,i)=>{
      let e=0;
      if(a){const ex=E.outExpo(seg(t,.7+i*.1,1.9+i*.1)),re=E.inOutC(seg(t,4.8+(5-i)*.1,5.9+(5-i)*.1));e=ex*(1-re);}
      prog[k]=e;mean+=e/6;
      P.parts[k].position.y=P.home[k]+EXP[k]*e;
    });
    const settle=a?-.05*Math.exp(-Math.max(0,t-6.0)*9)*Math.sin(Math.max(0,t-6.0)*28)*(t>6?1:0):0;P.G.position.y=settle;
    P.G.rotation.y=.5+t*(a?.5:.7);
    const dist=a?9.5+5*mean:9.5,cy=a?1.0+2.2*mean:1.0,az=.55+(a?.25*Math.sin(t*.5):0),el=a?.30+.08*mean:.3;
    camera.position.set(Math.sin(az)*dist*Math.cos(el),cy+Math.sin(el)*dist,Math.cos(az)*dist*Math.cos(el));camera.lookAt(0,cy,0);
    P.parts.led.material.emissiveIntensity=a?1.4+.7*Math.sin(t*5)+(t>6?.8*Math.exp(-(t-6)*4):0):1.7;
    renderer.render(scene,camera);
    o.setTransform(2,0,0,2,0,0);o.clearRect(0,0,640,360);
    if(a){
      scene.updateMatrixWorld();const v=new THREE.Vector3();
      EXP_ORDER.forEach((k,i)=>{
        P.parts[k].getWorldPosition(v);const [x,y]=px3(v,camera);
        const al=E.outC(seg(t,2.0+i*.16,2.4+i*.16))*(1-E.outC(seg(t,4.6+(5-i)*.08,5.0+(5-i)*.08)));
        const left=i%2===0;callout(o,x,y,left?150:490,EXP_LABEL[k][0],EXP_LABEL[k][1],al);
      });
    }
    tag3(o,a?'분해 → 라벨 → 조립 · 예시 제품(가상) · 부품 6개':'연출 전: 제품이 그냥 돌기만 함 · 예시 제품(가상)');
  }
};
export default demo;
