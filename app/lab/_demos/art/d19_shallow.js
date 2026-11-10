// 만들어진 파일 — 원본: 시각 연출 사전 아티팩트 d19. 직접 고치지 않는다 — 응용 팁 'shallow' 적용본
/* eslint-disable */
// @ts-nocheck

import { seg, E } from "./helpers.js";
import { TAU } from "./shared/common.js";
import { callout, px3, stage3d, tag3 } from "./shared/g17.js";
import * as THREE from "three";

function uiLayerTextures(){
  const mk=(draw)=>{const c=document.createElement('canvas');c.width=960;c.height=720;const x=c.getContext('2d');draw(x);return c;};
  const rr2=(x,px,py,w,h,r)=>{x.beginPath();x.moveTo(px+r,py);x.arcTo(px+w,py,px+w,py+h,r);x.arcTo(px+w,py+h,px,py+h,r);x.arcTo(px,py+h,px,py,r);x.arcTo(px,py,px+w,py,r);x.closePath();};
  const F='"IBM Plex Sans KR","Malgun Gothic",sans-serif',D='"Black Han Sans","Malgun Gothic",sans-serif';
  const bg=mk(x=>{const g=x.createLinearGradient(0,0,0,720);g.addColorStop(0,'#1b212c');g.addColorStop(1,'#0f131a');x.fillStyle=g;rr2(x,0,0,960,720,40);x.fill();
    x.strokeStyle='rgba(255,255,255,.05)';x.lineWidth=2;for(let i=80;i<960;i+=80){x.beginPath();x.moveTo(i,100);x.lineTo(i,720);x.stroke();}for(let j=140;j<720;j+=80){x.beginPath();x.moveTo(0,j);x.lineTo(960,j);x.stroke();}
    ['#ff5f57','#febc2e','#28c840'].forEach((c,i)=>{x.fillStyle=c;x.beginPath();x.arc(44+i*30,46,9,0,TAU);x.fill();});x.fillStyle='#ece7dc';x.font='700 34px '+F;x.fillText('월간 대시보드',150,58);});
  const chart=mk(x=>{x.fillStyle='rgba(255,255,255,.07)';rr2(x,40,110,600,420,26);x.fill();x.strokeStyle='rgba(255,255,255,.14)';x.lineWidth=2;x.stroke();
    x.fillStyle='#9ba3ad';x.font='500 24px '+F;x.fillText('월간 조회수 · 예시 데이터',70,160);
    const D2=[['7월',1200],['8월',2100],['9월',3400],['10월',6100],['11월',12800]];
    D2.forEach((d,i)=>{const h=d[1]/12800*260,bx=90+i*108;x.fillStyle=i===4?'#ff8a3d':'#4a5260';rr2(x,bx,500-h-34,70,h,8);x.fill();x.fillStyle='#9ba3ad';x.font='500 22px '+F;x.textAlign='center';x.fillText(d[0],bx+35,520);x.textAlign='left';});
    x.strokeStyle='rgba(255,255,255,.2)';x.beginPath();x.moveTo(70,466);x.lineTo(610,466);x.stroke();});
  const num=mk(x=>{x.fillStyle='rgba(255,255,255,.07)';rr2(x,680,110,240,200,26);x.fill();x.strokeStyle='rgba(255,255,255,.14)';x.lineWidth=2;x.stroke();
    x.fillStyle='#9ba3ad';x.font='500 22px '+F;x.fillText('11월 조회수',706,156);
    const g=x.createLinearGradient(0,170,0,260);g.addColorStop(0,'#ffe2c9');g.addColorStop(.5,'#ff8a3d');g.addColorStop(1,'#d4540c');x.fillStyle=g;x.font='400 76px '+D;x.fillText('12,800',702,250);
    x.fillStyle='#ff8a3d';rr2(x,706,268,110,36,18);x.fill();x.fillStyle='#0b0e13';x.font='700 22px '+F;x.fillText('+110%',724,293);});
  const ui=mk(x=>{
    [['기간 7~11월',60,580,260],['내보내기',340,580,200]].forEach(([tx,px,py,w])=>{x.strokeStyle='rgba(255,255,255,.35)';x.lineWidth=2;rr2(x,px,py,w,64,32);x.stroke();x.fillStyle='#ece7dc';x.font='500 26px '+F;x.textAlign='center';x.fillText(tx,px+w/2,py+41);x.textAlign='left';});
    x.fillStyle='#ff8a3d';rr2(x,600,580,300,64,32);x.fill();x.fillStyle='#0b0e13';x.font='700 28px '+F;x.textAlign='center';x.fillText('리포트 만들기',750,622);x.textAlign='left';
    x.fillStyle='#fff';x.strokeStyle='#0b0e13';x.lineWidth=3;x.beginPath();x.moveTo(820,560);x.lineTo(820,624);x.lineTo(836,610);x.lineTo(848,636);x.lineTo(860,630);x.lineTo(848,604);x.lineTo(868,602);x.closePath();x.fill();x.stroke();});
  return [bg,chart,num,ui];
}
const UI_Z=[0,.4,.8,1.2],UI_LAB=[['배경 패널','가장 아래 · 어두운 면'],['차트 카드','막대 5개 · 마지막만 주황'],['핵심 숫자','카운트업을 거는 대상'],['버튼 · 커서','클릭을 유도하는 맨 위층']];

const demo = {
  dur: 7, rest: 3.6, noCompare: false, levels: 0,
  mount(sp){
    sp.style.background='#0b0e13';
    const S=stage3d(sp,{bg:0x0b0e13});if(S.fail)return S;
    S.scene.environment=null;S.fontOk=false;S.layers=null;
    S.group=new THREE.Group();S.scene.add(S.group);
    return S;
  },
  render(s,t,a){
    if(s.fail)return;
    const {renderer,scene,camera,octx:o,group}=s;
    const fOk=!!(document.fonts&&document.fonts.check('700 30px "IBM Plex Sans KR"')&&document.fonts.check('76px "Black Han Sans"'));
    if(!s.layers||(fOk&&!s.fontOk)){
      if(s.layers){s.layers.forEach(m=>{group.remove(m.mesh);group.remove(m.edge);group.remove(m.shadow);});}
      const T=uiLayerTextures();
      s.layers=T.map((cv,i)=>{
        const tex=new THREE.CanvasTexture(cv);tex.encoding=THREE.sRGBEncoding;tex.anisotropy=4;
        const mesh=new THREE.Mesh(new THREE.PlaneGeometry(4,3),new THREE.MeshBasicMaterial({map:tex,transparent:true}));
        const edge=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.PlaneGeometry(4,3)),new THREE.LineBasicMaterial({color:[0x3a4352,0x6fd3ff,0xff8a3d,0xece7dc][i],transparent:true,opacity:.6}));
        const sc=document.createElement('canvas');sc.width=960;sc.height=720;const sx=sc.getContext('2d');sx.filter='blur(16px)';sx.globalAlpha=.9;sx.drawImage(cv,0,0);sx.globalCompositeOperation='source-in';sx.fillStyle='#000';sx.fillRect(0,0,960,720);
        const shadow=new THREE.Mesh(new THREE.PlaneGeometry(4,3),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(sc),transparent:true,opacity:.55,depthWrite:false}));
        group.add(mesh);group.add(edge);if(i>0)group.add(shadow);
        return {mesh,edge,shadow};
      });
      s.fontOk=fOk;
      if(!s.conn){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(new Float32Array(24),3));s.conn=new THREE.LineSegments(g,new THREE.LineBasicMaterial({color:0x8c96a3,transparent:true,opacity:.16}));group.add(s.conn);}
    }
    const ex=[0,1,2,3].map(i=>{if(!a)return 0;const e=E.outExpo(seg(t,.6+i*.15,1.8+i*.15)),r=E.inOutC(seg(t,4.9+(3-i)*.12,5.9+(3-i)*.12));return e*(1-r);});
    const mex=(ex[1]+ex[2]+ex[3])/3;
    s.layers.forEach((L,i)=>{const z=UI_Z[i]*ex[i];L.mesh.position.z=L.edge.position.z=z;L.shadow.position.set(.12*ex[i],-.12*ex[i],z-.02);L.shadow.material.opacity=.55*Math.min(1,ex[i]*2);});
    const pos=s.conn.geometry.attributes.position;[[-2,1.5],[2,1.5],[-2,-1.5],[2,-1.5]].forEach(([x,y],k)=>{pos.setXYZ(k*2,x,y,0);pos.setXYZ(k*2+1,x,y,UI_Z[3]*ex[3]);});pos.needsUpdate=true;s.conn.visible=mex>.02;
    group.rotation.set(.22*mex+(a?.03*Math.sin(t*.9):0),-.55*mex+(a?.08*Math.sin(t*.7):0),0);
    const dist=a?6.9+3.4*mex:6.9;camera.position.set(0,.25*mex,dist);camera.lookAt(0,0,UI_Z[3]*mex*.3);
    renderer.render(scene,camera);
    o.setTransform(2,0,0,2,0,0);o.clearRect(0,0,640,360);
    if(a){
      scene.updateMatrixWorld();const v=new THREE.Vector3();
      s.layers.forEach((L,i)=>{if(i===0)return;const anchors=[null,[-1.4,-.2],[1.6,.6],[1.5,-.85]][i];v.set(anchors[0],anchors[1],0);L.mesh.localToWorld(v);const [x,y]=px3(v,camera);
        const al=E.outC(seg(t,2.2+i*.18,2.6+i*.18))*(1-E.outC(seg(t,4.7+(3-i)*.08,5.1+(3-i)*.08)));callout(o,x,y,i===1?130:500,UI_LAB[i][0],UI_LAB[i][1],al,['','#6fd3ff','#ff8a3d','#ece7dc'][i]);});
    }
    tag3(o,a?'층별 분리(깊이 0.4씩) → 기울임 → 라벨 → 재조립 · 예시 데이터':'연출 전: 화면 캡처 한 장 · 예시 데이터');
  }
};
export default demo;
