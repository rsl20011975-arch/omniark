// 만들어진 파일 — 원본: 시각 연출 사전 아티팩트 d18. 직접 고치지 않는다 — 응용 팁 'rough' 적용본
/* eslint-disable */
// @ts-nocheck

import { seg, E } from "./helpers.js";
import { TAU } from "./shared/common.js";
import { groundShadow, keyLight, px3, stage3d, tag3 } from "./shared/g17.js";
import * as THREE from "three";

const demo = {
  dur: 6, rest: 3.4, noCompare: false, levels: 0,
  mount(sp){
    sp.style.background='#0b0e13';
    const S=stage3d(sp,{exposure:1.05});if(S.fail)return S;
    S.env=S.scene.environment;
    S.key=keyLight(S.scene,-5,7,6,2.4);S.rim=new THREE.DirectionalLight(0x9cc0ff,1.6);S.rim.position.set(5,3,-7);S.scene.add(S.rim);
    S.ground=groundShadow(S.scene,12);
    const geoms=[new THREE.SphereGeometry(.95,64,48),new THREE.CylinderGeometry(.85,.85,.5,64),new THREE.TorusKnotGeometry(.55,.2,200,32)];
    S.pbr=[new THREE.MeshStandardMaterial({color:0xffffff,metalness:1,roughness:.35}),new THREE.MeshPhysicalMaterial({color:0xff6a1e,roughness:.35,metalness:0,clearcoat:1,clearcoatRoughness:.08}),new THREE.MeshStandardMaterial({color:0xffc66a,metalness:1,roughness:.3})];
    S.flat=[0x9aa3b0,0xff8a3d,0xe0b050].map(c=>new THREE.MeshBasicMaterial({color:c}));
    S.meshes=geoms.map((g,i)=>{const m=new THREE.Mesh(g,S.pbr[i]);m.castShadow=true;m.receiveShadow=true;S.scene.add(m);return m;});
    S.meshes[0].position.set(-2.7,.95,0);S.meshes[1].position.set(0,.25,0);S.meshes[2].position.set(2.7,1.0,0);
    return S;
  },
  render(s,t,a){
    if(s.fail)return;
    const {renderer,scene,camera,octx:o}=s;
    s.meshes.forEach((m,i)=>{m.material=a?s.pbr[i]:s.flat[i];});
    scene.environment=a?s.env:null;s.ground.visible=a;s.key.visible=a;s.rim.visible=a;
    const ang=a?-1.0+2.0*E.inOutC(seg(t,.4,5.4)):0;           /* 키 라이트가 왼쪽에서 오른쪽으로 천천히 돈다 */
    s.key.position.set(Math.sin(ang)*7,7,Math.cos(ang)*7);
    s.meshes[2].rotation.set(0,t*.7,0);s.meshes[1].rotation.y=t*.35;
    const dist=a?11.5-2.2*E.inOutC(seg(t,0,6)):11.5,az=a?.12*Math.sin(t*.6):0;
    camera.position.set(Math.sin(az)*dist,2.6,Math.cos(az)*dist);camera.lookAt(0,.85,0);
    renderer.render(scene,camera);
    o.setTransform(2,0,0,2,0,0);o.clearRect(0,0,640,360);
    scene.updateMatrixWorld();
    const NAME=a?[['크롬','금속성 1 · 거칠기 0.35'],['유광 플라스틱','클리어코트 1 · 거칠기 0.35'],['새틴 골드','금속성 1 · 거칠기 0.3']]:[['단색','조명·반사·그림자 없음'],['단색','조명·반사·그림자 없음'],['단색','조명·반사·그림자 없음']];
    const v=new THREE.Vector3();
    s.meshes.forEach((m,i)=>{m.getWorldPosition(v);const [x]=px3(v,camera);const al=E.outC(seg(t,.9+i*.2,1.4+i*.2));
      o.save();o.globalAlpha=a?al:1;o.textAlign='center';o.fillStyle='#ece7dc';o.font='700 13px "IBM Plex Sans KR","Malgun Gothic",sans-serif';o.fillText(NAME[i][0],x,318);
      o.fillStyle='#9ba3ad';o.font='500 10px "IBM Plex Sans KR","Malgun Gothic",sans-serif';o.fillText(NAME[i][1],x,332);o.restore();});
    if(a){                                                     /* 키 라이트 방향 표시 */
      o.save();o.translate(40,50);o.strokeStyle='rgba(155,163,173,.6)';o.lineWidth=1;o.beginPath();o.arc(0,0,20,Math.PI,0);o.stroke();
      const ax=Math.sin(ang)*20,ay=-Math.cos(ang)*20;o.fillStyle='#ffd9aa';o.beginPath();o.arc(ax,ay,4.5,0,TAU);o.fill();
      o.fillStyle='#9ba3ad';o.font='500 10px "IBM Plex Sans KR","Malgun Gothic",sans-serif';o.textAlign='center';o.fillText('키 라이트 방향',0,16);o.restore();
    }
    tag3(o,a?'환경 반사 + 키 라이트(이동) + 림 라이트 + 그림자':'연출 전: 단색 도형 · 조명 없음');
  }
};
export default demo;
