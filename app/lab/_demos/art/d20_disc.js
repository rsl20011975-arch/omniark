// 만들어진 파일 — 원본: 시각 연출 사전 아티팩트 d20. 직접 고치지 않는다 — 응용 팁 'disc' 적용본
/* eslint-disable */
// @ts-nocheck

import { seg, E } from "./helpers.js";
import { buildSpeaker, groundShadow, keyLight, stage3d, tag3 } from "./shared/g17.js";
import * as THREE from "three";

const demo = {
  dur: 6, rest: 4.4, noCompare: false, levels: 0,
  mount(sp){
    sp.style.background='#0b0e13';
    const S=stage3d(sp);if(S.fail)return S;
    keyLight(S.scene,5,10,6,2.3);const rim=new THREE.DirectionalLight(0x9cc0ff,1.4);rim.position.set(-6,4,-6);S.scene.add(rim);
    S.ground=groundShadow(S.scene,9);
    const P=buildSpeaker();S.P=P;S.scene.add(P.G);
    S.pBelow=new THREE.Plane(new THREE.Vector3(0,-1,0),0);S.pAbove=new THREE.Plane(new THREE.Vector3(0,1,0),0);
    P.G.traverse(m=>{if(m.isMesh){const ms=Array.isArray(m.material)?m.material:[m.material];ms.forEach(x=>{x.clippingPlanes=[S.pBelow];x.clipShadows=true;});}});
    S.wireMat=new THREE.MeshBasicMaterial({color:0x6fd3ff,wireframe:true,transparent:true,opacity:.5,clippingPlanes:[S.pAbove]});
    S.W=P.G.clone(true);S.W.traverse(m=>{if(m.isMesh){m.material=S.wireMat;m.castShadow=false;m.receiveShadow=false;}});S.scene.add(S.W);
    S.ringMat=new THREE.MeshBasicMaterial({color:0x6fd3ff,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false});
    S.ring=new THREE.Mesh(new THREE.TorusGeometry(1.35,.018,8,160),S.ringMat);S.ring.rotation.x=Math.PI/2;S.scene.add(S.ring);
    S.disc=new THREE.Mesh(new THREE.RingGeometry(.2,1.5,96),new THREE.MeshBasicMaterial({color:0x6fd3ff,transparent:true,opacity:.5,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide}));S.disc.rotation.x=-Math.PI/2;S.scene.add(S.disc);
    return S;
  },
  render(s,t,a){
    if(s.fail)return;
    const {renderer,scene,camera,octx:o,P}=s;
    const p=a?E.inOutC(seg(t,.6,3.6)):1,h=-.1+2.1*p;
    s.pBelow.constant=a?h:99;s.pAbove.constant=a?-h:-99;
    const scanning=a&&t>=.6&&t<3.8;
    s.ring.visible=s.disc.visible=a&&t<4.2;
    s.ring.position.y=s.disc.position.y=h;
    const fade=1-E.outC(seg(t,3.6,4.2));s.ringMat.opacity=fade;s.disc.material.opacity=.5*fade;
    s.wireMat.opacity=a?.5*(1-E.outC(seg(t,3.8,4.8))):0;s.W.visible=a;
    const ry=.6+t*.45;P.G.rotation.y=s.W.rotation.y=ry;
    const dist=a?10.5-1.6*E.inOutC(seg(t,0,6)):10,az=.5+(a?.3*Math.sin(t*.55):0);
    camera.position.set(Math.sin(az)*dist*.95,3.4,Math.cos(az)*dist*.95);camera.lookAt(0,.95,0);
    P.parts.led.material.emissiveIntensity=a?(h>1.66?1.4+.5*Math.sin(t*5):0.2):1.7;
    renderer.render(scene,camera);
    o.setTransform(2,0,0,2,0,0);o.clearRect(0,0,640,360);
    if(a){                                                       /* HUD: 스캔 진행률 */
      const pct=Math.round(100*Math.min(1,Math.max(0,(h+.1)/2.1)));
      o.save();o.fillStyle='#6fd3ff';o.font='700 13px "IBM Plex Sans KR","Malgun Gothic",sans-serif';o.fillText((t<.6?'스캔 준비 ':(scanning?'스캔 중 ':'스캔 완료 '))+pct+'%',20,36);
      o.fillStyle='rgba(111,211,255,.2)';o.fillRect(20,44,150,4);o.fillStyle='#6fd3ff';o.fillRect(20,44,150*pct/100,4);o.restore();
    }
    tag3(o,a?'선(와이어프레임) → 스캔 평면이 지나가며 실물로 · 예시 제품(가상)':'연출 전: 완성품이 그냥 나타남 · 예시 제품(가상)');
  }
};
export default demo;
