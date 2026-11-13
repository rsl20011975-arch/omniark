// 만들어진 파일 — 원본: 시각 연출 사전 아티팩트 분야 g17 도우미. 직접 고치지 않는다
/* eslint-disable */
// @ts-nocheck
import { box } from "../helpers.js";
import { TAU, cap } from "./common.js";
import * as THREE from "three";

const HAS3D=typeof THREE!=='undefined';
function makeEnv(renderer){
  const c=document.createElement('canvas');c.width=1024;c.height=512;const x=c.getContext('2d');
  const g=x.createLinearGradient(0,0,0,512);g.addColorStop(0,'#33405a');g.addColorStop(.5,'#1c2433');g.addColorStop(.52,'#141a26');g.addColorStop(1,'#0b0e15');
  x.fillStyle=g;x.fillRect(0,0,1024,512);
  const box=(cx,cy,w,h,col)=>{const gg=x.createLinearGradient(cx-w/2,0,cx+w/2,0);gg.addColorStop(0,'rgba(255,255,255,0)');gg.addColorStop(.2,col);gg.addColorStop(.8,col);gg.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=gg;x.fillRect(cx-w/2,cy-h/2,w,h);};
  box(256,150,300,110,'#fff3e0');box(768,170,220,90,'#bcd4ff');box(512,80,380,22,'#ffffff');box(130,340,200,60,'#9db4d8');box(640,360,260,50,'#ffd9b0');box(900,300,160,80,'#e8eefc');
  x.fillStyle='rgba(255,138,61,.5)';x.fillRect(0,250,1024,6);
  const tex=new THREE.CanvasTexture(c);tex.mapping=THREE.EquirectangularReflectionMapping;tex.encoding=THREE.sRGBEncoding;
  const pm=new THREE.PMREMGenerator(renderer);const env=pm.fromEquirectangular(tex).texture;pm.dispose();tex.dispose();return env;
}
function stage3d(sp,opt){
  opt=opt||{};
  const cv=document.createElement('canvas');cv.width=1280;cv.height=720;sp.appendChild(cv);
  const ov=document.createElement('canvas');ov.width=1280;ov.height=720;sp.appendChild(ov);
  const octx=ov.getContext('2d');
  if(!HAS3D){octx.fillStyle='#9ba3ad';octx.font='28px sans-serif';octx.fillText('three.js를 불러오지 못했습니다. 인터넷 연결을 확인하세요.',60,360);return {fail:true,octx};}
  const renderer=new THREE.WebGLRenderer({canvas:cv,antialias:true,preserveDrawingBuffer:true});
  renderer.setPixelRatio(1);renderer.setSize(1280,720,false);
  renderer.outputEncoding=THREE.sRGBEncoding;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=opt.exposure||1;
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.localClippingEnabled=true;
  const scene=new THREE.Scene();scene.background=new THREE.Color(opt.bg||0x0b0e13);
  const camera=new THREE.PerspectiveCamera(opt.fov||30,16/9,.1,100);
  scene.environment=makeEnv(renderer);
  return {renderer,scene,camera,octx};
}
function keyLight(scene,x,y,z,inten){
  const L=new THREE.DirectionalLight(0xfff0dc,inten);L.position.set(x,y,z);L.castShadow=true;
  L.shadow.mapSize.set(1024,1024);L.shadow.camera.left=-8;L.shadow.camera.right=8;L.shadow.camera.top=9;L.shadow.camera.bottom=-4;L.shadow.camera.far=40;L.shadow.bias=-.0004;L.shadow.radius=4;
  scene.add(L);return L;
}
function groundShadow(scene,r){                 /* 그림자만 받는 바닥 + 은은한 바닥 빛. 한 그룹으로 반환(켜고 끄기 쉽게) */
  const G=new THREE.Group();r=r||9;
  const m=new THREE.Mesh(new THREE.CircleGeometry(r,64),new THREE.ShadowMaterial({opacity:.45}));m.rotation.x=-Math.PI/2;m.receiveShadow=true;G.add(m);
  const cc=document.createElement('canvas');cc.width=cc.height=256;const x=cc.getContext('2d');const g=x.createRadialGradient(128,128,0,128,128,128);g.addColorStop(0,'rgba(70,82,104,.30)');g.addColorStop(.6,'rgba(70,82,104,.08)');g.addColorStop(1,'rgba(70,82,104,0)');x.fillStyle=g;x.fillRect(0,0,256,256);
  const pool=new THREE.Mesh(new THREE.CircleGeometry(r*.6,64),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(cc),transparent:true,depthWrite:false}));pool.rotation.x=-Math.PI/2;pool.position.y=-.002;G.add(pool);
  scene.add(G);return G;
}
const px3=(v,cam)=>{const p=v.clone().project(cam);return [(p.x*.5+.5)*640,(-p.y*.5+.5)*360];};
function callout(o,x,y,colX,title,sub,al,col){
  if(al<=0)return;const side=colX>x?1:-1;o.save();o.globalAlpha=al;o.strokeStyle=col||'rgba(236,231,220,.75)';o.fillStyle=col||'rgba(236,231,220,.9)';o.lineWidth=1;
  o.beginPath();o.moveTo(x,y);o.lineTo(colX,y);o.stroke();o.beginPath();o.arc(x,y,2.6,0,TAU);o.fill();
  o.textAlign=side>0?'left':'right';o.textBaseline='alphabetic';o.fillStyle='#ece7dc';o.font='700 13px "IBM Plex Sans KR","Malgun Gothic",sans-serif';o.fillText(title,colX+side*6,y-4);
  o.fillStyle='#9ba3ad';o.font='500 10.5px "IBM Plex Sans KR","Malgun Gothic",sans-serif';o.fillText(sub,colX+side*6,y+11);o.restore();
}
function tag3(o,txt){o.save();o.globalAlpha=.85;o.fillStyle='#9ba3ad';o.font='500 11px "IBM Plex Sans KR","Malgun Gothic",sans-serif';o.textAlign='left';o.fillText(txt,16,344);o.restore();}
function weaveTexture(){
  const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d');x.fillStyle='#3a424f';x.fillRect(0,0,128,128);
  for(let i=0;i<128;i+=4)for(let j=0;j<128;j+=4){const k=((i+j)/4)%2;x.fillStyle=k?'rgba(255,255,255,.10)':'rgba(0,0,0,.22)';x.fillRect(i,j,3,3);}
  const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(40,6);t.anisotropy=4;t.encoding=THREE.sRGBEncoding;return t;
}
function buildSpeaker(){
  const std=o=>new THREE.MeshStandardMaterial(o),S=m=>{m.castShadow=true;m.receiveShadow=true;return m;};
  const base=S(new THREE.Mesh(new THREE.CylinderGeometry(1.02,1.08,.2,64),std({color:0x1a1c21,roughness:.85,metalness:.05})));base.position.y=.1;
  const pcb=new THREE.Group();pcb.position.y=.3;
  const board=S(new THREE.Mesh(new THREE.CylinderGeometry(.82,.82,.05,64),std({color:0x1d6b45,roughness:.55,metalness:.1})));pcb.add(board);
  [[.3,.2,.28,.18,.06],[-.25,.25,.22,.22,.06],[.1,-.35,.3,.16,.06],[-.4,-.15,.16,.16,.05],[.45,-.1,.14,.2,.07]].forEach(([x,z,w,d,h])=>{const ch=S(new THREE.Mesh(new THREE.BoxGeometry(w,h,d),std({color:0x14161a,roughness:.4,metalness:.3})));ch.position.set(x,.055,z);pcb.add(ch);});
  for(let i=0;i<8;i++){const a=i/8*TAU,cap=S(new THREE.Mesh(new THREE.CylinderGeometry(.045,.045,.09,16),std({color:0xd8b25a,roughness:.3,metalness:.9})));cap.position.set(Math.cos(a)*.62,.07,Math.sin(a)*.62);pcb.add(cap);}
  const drv=new THREE.Group();drv.position.y=.7;
  const cone=S(new THREE.Mesh(new THREE.CylinderGeometry(.66,.28,.3,48,1,true),std({color:0x262a31,roughness:.55,metalness:.25,side:THREE.DoubleSide})));drv.add(cone);
  const rim=S(new THREE.Mesh(new THREE.TorusGeometry(.66,.05,16,64),std({color:0x9aa0aa,roughness:.3,metalness:.95})));rim.rotation.x=Math.PI/2;rim.position.y=.15;drv.add(rim);
  const dust=S(new THREE.Mesh(new THREE.SphereGeometry(.2,32,16,0,TAU,0,Math.PI/2),std({color:0x2d3138,roughness:.4,metalness:.5})));dust.position.y=-.15;dust.rotation.x=Math.PI;drv.add(dust);
  const magnet=S(new THREE.Mesh(new THREE.CylinderGeometry(.4,.4,.18,32),std({color:0x55595f,roughness:.4,metalness:.9})));magnet.position.y=-.24;drv.add(magnet);
  const body=S(new THREE.Mesh(new THREE.CylinderGeometry(.97,.97,1.5,96,1,true),std({color:0xffffff,map:weaveTexture(),roughness:.95,metalness:0,side:THREE.DoubleSide})));body.position.y=.95;
  const led=S(new THREE.Mesh(new THREE.TorusGeometry(.985,.03,16,96),std({color:0x2b1a0e,emissive:0xff8a3d,emissiveIntensity:1.7,roughness:.4})));led.rotation.x=Math.PI/2;led.position.y=1.66;
  const cap=new THREE.Group();cap.position.y=1.76;
  const disc=S(new THREE.Mesh(new THREE.CylinderGeometry(1,1,.13,96),std({color:0xc9ced6,roughness:.28,metalness:.95})));cap.add(disc);
  [-.45,0,.45].forEach((x,i)=>{const b=S(new THREE.Mesh(new THREE.CylinderGeometry(.11,.11,.025,32),std({color:0x14161a,roughness:.35,metalness:.4,emissive:i===1?0x3a2210:0x000000})));b.position.set(x,.075,0);cap.add(b);});
  const parts={cap,led,body,driver:drv,pcb,base};
  const G=new THREE.Group();Object.values(parts).forEach(p=>G.add(p));
  return {G,parts,home:{cap:1.76,led:1.66,body:.95,driver:.7,pcb:.3,base:.1}};
}

export { HAS3D, makeEnv, stage3d, keyLight, groundShadow, px3, callout, tag3, weaveTexture, buildSpeaker };
