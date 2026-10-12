/* WebGL galaxy: local, dependency-free, visibility-aware. */
export function startGalaxy(){
const host=document.querySelector('.hero-art');if(!host)return;
host.setAttribute('role','img');host.setAttribute('aria-label','반짝이는 우주 공간의 나선형 빛줄기를 따라 항해하는 옴니아크 방주');
const canvas=document.createElement('canvas');canvas.className='galaxy-canvas';canvas.setAttribute('aria-hidden','true');host.prepend(canvas);
const ark=document.createElement('img');ark.src='/studio-assets/brand.png';ark.alt='';ark.className='galaxy-ark';ark.setAttribute('aria-hidden','true');host.append(ark);
const gl=canvas.getContext('webgl',{alpha:true,antialias:false,powerPreference:'low-power'});
if(!gl){host.classList.add('galaxy-fallback');return;}
const vs=`attribute vec3 position;attribute vec4 color;attribute float size;attribute float kind;
uniform float time;uniform float aspect;uniform float pixelRatio;uniform float scale;varying vec4 tint;varying float jewel;varying float planet;
vec3 curve(float u,float lane){float r=.75+.075*sin(2.*u+lane*.60);float tilt=(lane-2.)*.17;float z=sin(u)*r;return vec3(cos(u)*r,z*sin(tilt)+.105*sin(2.*u+lane*.72)+(lane-2.)*.025,z*cos(tilt));}
void main(){vec3 p=position;jewel=kind>1.5&&kind<2.5?1.:0.;planet=kind>2.5?1.:0.;
if(kind>1.5){p=curve(position.x+(kind>2.5?time*.11:0.),position.y);p.y+=position.z;}
float a=kind<.5||kind>1.5?.144:0.;p.xz=mat2(cos(a),sin(a),-sin(a),cos(a))*p.xz;
float yy=p.z*.50+p.y*.866;float zz=p.z*.866-p.y*.50;
vec2 q=mat2(.94,.342,-.342,.94)*vec2(p.x,yy);float depth=4./(4.-zz);
gl_Position=vec4(q.x*scale*depth*1.14,q.y*scale*aspect*depth-.06,0.,1.);
gl_PointSize=min(100.,size*pixelRatio*depth);float twinkle=kind>.5?.58+.42*sin(time*(.65+fract(position.x)*.5)+position.x*17.+position.y*9.):1.;float depthLight=mix(.30,1.2,smoothstep(-.85,.85,zz));tint=vec4(color.rgb,color.a*twinkle*depthLight);}`;
const fs=`precision mediump float;varying vec4 tint;varying float jewel;varying float planet;
void main(){vec2 p=(gl_PointCoord-.5)*2.;float d=length(p);if(d>1.)discard;
if(planet>.5){vec3 normal=vec3(p.x,-p.y,sqrt(max(0.,1.-d*d)));float light=max(0.,dot(normal,normalize(vec3(-.7,.8,1.))));float rim=pow(1.-normal.z,3.);vec3 c=tint.rgb*(.12+.88*light)+vec3(.5,.45,.8)*rim*.25;gl_FragColor=vec4(c,(1.-smoothstep(.94,1.,d)));return;}
float light=exp(-d*d*8.)*(1.-smoothstep(.75,1.,d));
if(jewel>.5){float rays=(exp(-abs(p.x)*65.)+exp(-abs(p.y)*65.))*pow(1.-d,2.);light+=rays*.65;light+=exp(-d*d*65.)*.5;}
gl_FragColor=vec4(mix(tint.rgb,vec3(1.),exp(-d*d*70.)*.5*jewel),tint.a*light);}`;
function shader(type,src){const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s;}
let program;try{program=gl.createProgram();gl.attachShader(program,shader(gl.VERTEX_SHADER,vs));gl.attachShader(program,shader(gl.FRAGMENT_SHADER,fs));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error('Galaxy link failed');}catch(error){console.warn(error);host.classList.add('galaxy-fallback');return;}
gl.useProgram(program);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE);gl.clearColor(0,0,0,0);
let seed=417;const rnd=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
const data=[];function point(x,y,z,r,g,b,alpha,size,kind=0){data.push(x,y,z,r,g,b,alpha,size,kind);}


// Five fine luminous strands; all travellers and the ark follow these same curves.
function curve(u,lane){const r=.75+.075*Math.sin(2*u+lane*.60);const tilt=(lane-2)*.17,z=Math.sin(u)*r;return {x:Math.cos(u)*r,y:z*Math.sin(tilt)+.105*Math.sin(2*u+lane*.72)+(lane-2)*.025,z:z*Math.cos(tilt)};}
function palette(u){const f=(Math.sin(u)+1)/2;return [.30+f*.48,.48-f*.16,1];}
for(let lane=0;lane<5;lane++){
 for(let i=0;i<2200;i++){const u=i/2200*Math.PI*2,p=curve(u,lane),c=palette(u);point(p.x,p.y,p.z,...c,.22+(lane===2?.13:0),1.25);}
 // A very soft halo around each fine strand, not a solid tube.
 for(let i=0;i<450;i++){const u=i/450*Math.PI*2,p=curve(u,lane),c=palette(u);point(p.x,p.y,p.z,...c,.012,7);}
}
for(let i=0;i<850;i++){const u=rnd()*Math.PI*2,lane=Math.floor(rnd()*5),p=curve(u,lane),c=palette(u);point(p.x+(rnd()-.5)*.18,p.y+(rnd()-.5)*.20,p.z+(rnd()-.5)*.16,...c,.18+rnd()*.48,.7+rnd()*2.1);}
for(let i=0;i<32;i++){const u=rnd()*Math.PI*2,lane=Math.floor(rnd()*5),c=palette(u);point(u,lane,0,...c,.65,10+rnd()*18,2);point(u,lane,0,...c,.16,30+rnd()*16,2);}
for(let i=0;i<200;i++){point((rnd()-.5)*2.8,(rnd()-.5)*1.8,(rnd()-.5)*2.6,.66,.76,1,.2+rnd()*.35,.7+rnd()*1.8,1);}
// Only three small, shaded planets leave the composition airy.
point(1.8,0,0,.60,.53,.84,1,32,3);
point(3.7,3,0,.34,.56,.78,1,20,3);
point(5.2,1,0,.81,.72,.70,1,12,3);
const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(data),gl.STATIC_DRAW);
let offset=0;for(const [name,n] of [['position',3],['color',4],['size',1],['kind',1]]){const loc=gl.getAttribLocation(program,name);gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,n,gl.FLOAT,false,36,offset*4);offset+=n;}
const uniforms=Object.fromEntries(['time','aspect','pixelRatio','scale'].map(n=>[n,gl.getUniformLocation(program,n)]));
let width=1,height=1,scale=.8,frame=0,previous=0,time=8,visible=true,lost=false;
const reduce=matchMedia('(prefers-reduced-motion: reduce)');
function project(u){const p=curve(u,2),a=.144,x=p.x*Math.cos(a)-p.z*Math.sin(a),z=p.x*Math.sin(a)+p.z*Math.cos(a),yy=z*.50+p.y*.866,depth=4/(4-z*.866+p.y*.50);return {x:(1+(x*.94-yy*.342)*scale*depth*1.14)*width/2,y:(1-((x*.342+yy*.94)*scale*width/height*depth-.06))*height/2,depth};}
function draw(){if(lost)return;gl.clear(gl.COLOR_BUFFER_BIT);gl.uniform1f(uniforms.time,time);gl.uniform1f(uniforms.aspect,width/height);gl.uniform1f(uniforms.scale,scale);gl.drawArrays(gl.POINTS,0,data.length/9);
const p=project(time*.11),next=project(time*.11+.02),bank=Math.atan2(next.y-p.y,next.x-p.x);
ark.style.left=p.x+'px';ark.style.top=p.y+'px';ark.style.transform=`translate(-50%,-50%) rotate(${Math.sin(bank)*16}deg) scale(${p.depth})`;ark.style.opacity=String(.75+(p.depth-.8)*.6);}
function resize(){const rect=host.getBoundingClientRect();width=Math.max(1,rect.width);height=Math.max(1,rect.height);const dpr=Math.min(devicePixelRatio||1,1.75);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);scale=Math.min(.88,height/width*1.15);gl.viewport(0,0,canvas.width,canvas.height);gl.uniform1f(uniforms.pixelRatio,dpr);draw();}
function tick(now){frame=0;if(!visible||document.hidden||reduce.matches||lost){previous=0;return;}if(previous)time+=Math.min((now-previous)/1000,.05);previous=now;draw();frame=requestAnimationFrame(tick);}
function stop(){cancelAnimationFrame(frame);frame=0;previous=0;}
function start(){if(!frame&&visible&&!document.hidden&&!reduce.matches&&!lost)frame=requestAnimationFrame(tick);}
const ro=new ResizeObserver(resize);ro.observe(host);const io=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;visible?start():stop();},{threshold:.02});io.observe(host);
const visibility=()=>document.hidden?stop():start(),motion=()=>{stop();draw();start();};document.addEventListener('visibilitychange',visibility);reduce.addEventListener('change',motion);
canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();lost=true;stop();host.classList.add('galaxy-fallback');});
resize();start();
return ()=>{stop();ro.disconnect();io.disconnect();document.removeEventListener('visibilitychange',visibility);reduce.removeEventListener('change',motion);canvas.remove();ark.remove();gl.deleteBuffer(buffer);gl.deleteProgram(program);};
}