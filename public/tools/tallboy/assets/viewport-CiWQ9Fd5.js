import{r as e,s as t}from"./camera-DP3TmLa5.js";import{O as n,c as r,d as i,k as a,l as o,m as s,p as c,u as l}from"./shade-CM9JSkLS.js";import{u}from"./post-B2MXs789.js";import{At as d,Mt as f}from"./post-BkTK3jtl.js";import{j as p,l as m}from"./wind-B5CoEmuI.js";import{$ as h,B as ee,C as g,E as te,G as _,H as ne,T as v,U as y,Ut as b,Wt as x,X as S,_n as C,a as re,bn as ie,c as w,cn as ae,en as oe,g as se,gn as ce,h as le,i as ue,s as de,u as T,ut as fe,vn as pe,y as me}from"./three.core-DWw0_KSo.js";import{A as he,Ct as ge,D as _e,Dt as ve,E as ye,Et as be,F as xe,M as Se,N as Ce,O as we,Ot as Te,P as Ee,Q as De,St as Oe,Tt as ke,U as Ae,W as je,X as Me,Y as Ne,Z as Pe,a as Fe,bt as Ie,c as Le,d as Re,f as ze,gt as Be,ht as Ve,i as He,j as Ue,k as We,l as Ge,n as Ke,o as qe,p as Je,r as Ye,s as Xe,t as Ze,u as Qe,wt as $e,xt as et,yt as tt}from"./index-47ni6VQk.js";var E=.4;function D(e,t=2){let n=Math.max(.5,t),r=e.params.target,i=r[0]??0,a=r[1]??0,o=e.ray(e.w/2,e.h/2),s=o.d[2];if(Math.abs(s)>1e-4){let t=-o.o[2]/s;(t>0||e.proj===`ortho`)&&(i=o.o[0]+o.d[0]*t,a=o.o[1]+o.d[1]*t)}if(e.proj===`persp`){let t=Math.max(1,e.params.distance),r=t*3*n;return{cx:i,cy:a,fade:r,quad:Math.max(r,t*400),aa:1}}let c=Math.max(.001,e.params.density),l=Math.max(.2,Math.abs(Math.sin(e.params.pitch*Math.PI/180))),u=Math.hypot(e.w/c/2,e.h/c/2/l)*n;return{cx:i,cy:a,fade:u,quad:u,aa:0}}var O=`
precision highp float;
precision highp int;
precision highp sampler2D;
uniform sampler2D uSrc;
uniform int uScale;
uniform float uScan;
uniform float uGridOn;
uniform mat3 uHome; // canvas px (x, y, 1) -> ground (X, Y, W) homogeneous
uniform vec3 uQuad;
uniform float uFade;
uniform float uCell;
uniform float uOpacity;
uniform float uAA;
uniform vec3 uGridCol;
uniform vec3 uAxisX;
uniform vec3 uAxisY;
out vec4 outColor;

// Distance to the nearest line of period p through the origin (per axis).
vec2 lineDist(vec2 w, float p) {
  return abs(fract(w / p + 0.5) - 0.5) * p;
}

// Coverage of a line at distance d. Ortho (hard): 1 when the pixel's footprint along the
// dominant screen step holds the line (a clean 1-pixel staircase, never a gap). Persp
// (AA): tent over one pixel of the true screen-space width. One kind per shader variant:
// a CPU WebGL runs every instruction of a fragment, taken branch or not (uAA stays for
// the layout; it is 0 in ortho and 1 in persp, where mix() picked one side exactly).
#ifdef GRID_ORTHO
vec2 cover(vec2 d, vec2 fw, vec2 fl) {
  return step(d, fw * 0.5 - 1e-4);
}
#else
vec2 cover(vec2 d, vec2 fw, vec2 fl) {
  return clamp(1.0 - d / fl, 0.0, 1.0);
}
#endif

// Pixel footprint on the ground: fw per axis along the dominant screen step, fl its true
// length; x = minor line visibility, y = major level blend t, z = major period pk.
#ifdef GRID_ORTHO
// ortho: the map is affine, all of it is constant (computed on the CPU)
uniform vec2 uFw;
uniform vec2 uFl;
uniform vec3 uLevels;
#endif
vec3 levels(float f) {
  float kf = log2(max(16.0 * f / uCell, 1.0));
  float k = floor(kf);
  return vec3(smoothstep(5.0, 9.0, 1.0 / f) * 0.35, kf - k, uCell * exp2(k));
}

// Grid colour (straight alpha) at ground point w; a = 0 off the grid.
vec4 grid(vec2 w, vec2 fw, vec2 fl, vec3 lv) {
  float dc = length(w - uQuad.xy);
  if (dc >= uFade && dc >= uQuad.z) return vec4(0.0);
  float minorVis = lv.x;
  float t = lv.y;
  float pk = lv.z;
  // most pixels are between lines: one cheap test against the densest level and the axes
  // (both line kinds reach at most one pixel footprint) before the full evaluation
  vec2 lim = max(fw, fl);
  vec2 d0 = lineDist(w, pk);
  vec2 aw = abs(w);
  if (minorVis <= 0.0 && all(greaterThanEqual(d0, lim)) && all(greaterThanEqual(aw, lim)))
    return vec4(0.0);
  float fade = 1.0 - smoothstep(0.55, 1.0, dc / uFade);
  float axisFade = 1.0 - smoothstep(0.8, 1.0, dc / uQuad.z);
  vec2 l0 = cover(d0, fw, fl);
  vec2 l1 = cover(lineDist(w, pk * 2.0), fw, fl);
  float ma = max(max(l1.x, l1.y), max(l0.x, l0.y) * (1.0 - smoothstep(0.0, 1.0, t)));
  float a = ma;
  if (minorVis > 0.0) {
    vec2 mi = cover(lineDist(w, 1.0), fw, fl);
    a = max(max(mi.x, mi.y) * minorVis, ma);
  }
  a *= fade;
  vec3 col = uGridCol;
#ifdef GRID_ORTHO
  vec2 ax = step(aw.yx, fw.yx * 0.5);
#else
  vec2 ax = clamp(1.0 - aw.yx / fl.yx, 0.0, 1.0);
#endif
  float axA = max(ax.x, ax.y) * 0.9 * axisFade;
  if (axA > a * 0.5 && axA > 0.01) {
    col = ax.x >= ax.y ? uAxisX : uAxisY;
    a = max(a, axA);
  }
  return vec4(col, a * uOpacity);
}

void main() {
  ivec2 q = ivec2(gl_FragCoord.xy);
  ivec2 p = q / uScale;
  outColor = texelFetch(uSrc, p, 0);
  if (uScan > 0.0) {
    bool dark = uScale == 1 ? (q.y & 1) == 1 : (q.y % uScale) < max(1, uScale / 3);
    if (dark) outColor.rgb = floor(outColor.rgb * 255.0 * (1.0 - uScan) + 0.5) / 255.0;
  }
  // an opaque pixel (the building, the terrain): the grid under it would not show, skip
  if (uGridOn < 0.5 || outColor.a >= 0.999) return;
  // the ground point under this pixel: a homography (W = 1 / clip w, > 0 in front of the
  // eye; constant in ortho), its derivatives in closed form (no dFdx: early outs above)
#ifdef GRID_ORTHO
  vec2 w = (uHome * vec3(gl_FragCoord.xy, 1.0)).xy;
  vec4 g = grid(w, uFw, uFl, uLevels);
#else
  vec3 h = uHome * vec3(gl_FragCoord.xy, 1.0);
  if (h.z <= 1e-12) return;
  vec2 w = h.xy / h.z;
  vec2 dx = (uHome[0].xy - w * uHome[0].z) / h.z;
  vec2 dy = (uHome[1].xy - w * uHome[1].z) / h.z;
  vec2 fw = max(max(abs(dx), abs(dy)), vec2(1e-5));
  vec2 fl = max(vec2(length(vec2(dx.x, dy.x)), length(vec2(dx.y, dy.y))), vec2(1e-5));
  vec4 g = grid(w, fw, fl, levels(max(fw.x, fw.y)));
#endif
  if (g.a <= 0.004) return;
  // grid under the frame (straight alpha "over")
  float sa = outColor.a;
  float oa = sa + g.a * (1.0 - sa);
  outColor = vec4((outColor.rgb * sa + g.rgb * g.a * (1.0 - sa)) / max(oa, 1e-6), oa);
}
`;O.replace(`precision highp float;`,`#define GRID_ORTHO 1
precision highp float;`);var nt=O.slice(0,O.indexOf(`void main() {`)).concat(`void main() {
  outColor = vec4(0.0);
#ifdef GRID_ORTHO
  vec2 w = (uHome * vec3(gl_FragCoord.xy, 1.0)).xy;
  vec4 g = grid(w, uFw, uFl, uLevels);
#else
  vec3 h = uHome * vec3(gl_FragCoord.xy, 1.0);
  if (h.z <= 1e-12) return;
  vec2 w = h.xy / h.z;
  vec2 dx = (uHome[0].xy - w * uHome[0].z) / h.z;
  vec2 dy = (uHome[1].xy - w * uHome[1].z) / h.z;
  vec2 fw = max(max(abs(dx), abs(dy)), vec2(1e-5));
  vec2 fl = max(vec2(length(vec2(dx.x, dy.x)), length(vec2(dx.y, dy.y))), vec2(1e-5));
  vec4 g = grid(w, fw, fl, levels(max(fw.x, fw.y)));
#endif
  outColor = g;
}
`),rt=nt.replace(`precision highp float;`,`#define GRID_ORTHO 1
precision highp float;`),it=`
precision highp float;
precision highp int;
precision highp sampler2D;
uniform sampler2D uSrc;
uniform sampler2D uGridTex;
uniform int uScale;
uniform float uScan;
out vec4 outColor;
void main() {
  ivec2 q = ivec2(gl_FragCoord.xy);
  ivec2 p = q / uScale;
  outColor = texelFetch(uSrc, p, 0);
  if (uScan > 0.0) {
    bool dark = uScale == 1 ? (q.y & 1) == 1 : (q.y % uScale) < max(1, uScale / 3);
    if (dark) outColor.rgb = floor(outColor.rgb * 255.0 * (1.0 - uScan) + 0.5) / 255.0;
  }
  // an opaque pixel (the building, the terrain): the grid under it would not show
  if (outColor.a >= 0.999) return;
  vec4 g = texelFetch(uGridTex, q, 0);
  if (g.a <= 0.004) return;
  // grid under the frame (straight alpha "over")
  float sa = outColor.a;
  float oa = sa + g.a * (1.0 - sa);
  outColor = vec4((outColor.rgb * sa + g.rgb * g.a * (1.0 - sa)) / max(oa, 1e-6), oa);
}
`;function at(e,t,n=new y){let r=(t,n)=>e[n*4+t],i=new y().set(r(0,0),r(0,1),r(0,3),r(1,0),r(1,1),r(1,3),r(3,0),r(3,1),r(3,3)),a=Math.max(1,t.w),o=Math.max(1,t.h),s=new y().set(2/a,0,-1,0,2/o,-1,0,0,1);return Math.abs(i.determinant())<1e-20?n.set(0,0,0,0,0,0,0,0,0):n.copy(i.invert()).multiply(s)}var ot={line:[.55,.58,.65],axisX:[.86,.38,.38],axisY:[.42,.78,.42]};function st(){let e=e=>new C(e[0],e[1],e[2]),t={uGridOn:{value:0},uHome:{value:new y},uFw:{value:new ce(1,1)},uFl:{value:new ce(1,1)},uLevels:{value:new C(0,0,8)},uQuad:{value:new C(0,0,128)},uFade:{value:128},uAA:{value:0},uCell:{value:8},uOpacity:{value:E},uGridCol:{value:e(ot.line)},uAxisX:{value:e(ot.axisX)},uAxisY:{value:e(ot.axisY)}},n=2;return{uniforms:t,get visible(){return t.uGridOn.value>.5},set visible(e){t.uGridOn.value=+!!e},update(e){t.uCell.value=Math.max(1,Math.round(e.cell)),n=e.distance??2,t.uOpacity.value=Math.min(1,Math.max(0,e.opacity))},follow(e,r,i){let a=D(e,n);t.uQuad.value.set(a.cx,a.cy,a.quad),t.uFade.value=a.fade,t.uAA.value=a.aa;let o=at(r.elements,i,t.uHome.value).elements,s=Math.max(Math.abs(o[0]),Math.abs(o[3]),1e-5),c=Math.max(Math.abs(o[1]),Math.abs(o[4]),1e-5);t.uFw.value.set(s,c),t.uFl.value.set(Math.max(Math.hypot(o[0],o[3]),1e-5),Math.max(Math.hypot(o[1],o[4]),1e-5));let l=Math.max(s,c),u=Math.log2(Math.max(16*l/t.uCell.value,1)),d=Math.floor(u);t.uLevels.value.set(((e,t,n)=>{let r=Math.min(1,Math.max(0,(n-e)/(t-e)));return r*r*(3-2*r)})(5,9,1/l)*.35,u-d,t.uCell.value*2**d)},setColors(e,n,r){t.uGridCol.value.set(e[0],e[1],e[2]),t.uAxisX.value.set(n[0],n[1],n[2]),t.uAxisY.value.set(r[0],r[1],r[2])}}}var ct=[[`position`,3],[`uv`,2],[`face`,1],[`exI`,3]];function lt(e){return{cap:e,count:0,position:new Float32Array(e*3),uv:new Float32Array(e*2),face:new Float32Array(e),exI:new Float32Array(e*3)}}var ut=Symbol.for(`tallboy.scene.sameTris`),dt=Symbol.for(`tallboy.scene.serial`);function ft(e,t){let n=e[ut],r=t?t[dt]:void 0;return n&&r!==void 0&&n.prev===r?n.ranges:null}function pt(e,t,n){let{pos:r,uv:i,idx:a,triFace:o}=e,s=o.length,c=Math.max(3,s*3),l=!!t&&t.cap>=c&&t.cap<=c*4,u=l?t:lt(Math.ceil(c*1.25)),d=!l,f=u.position,p=u.uv,m=u.face,h=u.exI,ee=1/0,g=-1,te=1/0,_=-1,ne=1/0,v=-1,y=1/0,b=-1,x=l&&n?n:null,S=0;for(let e=0;e<s;e++){if(x&&S<x.length&&e>=x[S]){e=Math.min(s,x[S+1])-1,S+=2;continue}let t=o[e],n=a[e*3],c=a[e*3+1],l=a[e*3+2];for(let a=0;a<3;a++){let o=a===0?n:a===1?c:l,s=e*3+a,u=s*3,d=f[u],x=f[u+1],S=f[u+2];f[u]=r[o*3],f[u+1]=r[o*3+1],f[u+2]=r[o*3+2],(f[u]!==d||f[u+1]!==x||f[u+2]!==S)&&(u<ee&&(ee=u),g=u+3);let C=s*2,re=p[C],ie=p[C+1];p[C]=i[o*2],p[C+1]=i[o*2+1],(p[C]!==re||p[C+1]!==ie)&&(C<te&&(te=C),_=C+2),m[s]!==t&&(m[s]=t,s<ne&&(ne=s),v=s+1),(h[u]!==n||h[u+1]!==c||h[u+2]!==l)&&(h[u]=n,h[u+1]=c,h[u+2]=l,u<y&&(y=u),b=u+3)}}u.count=s*3;let C=(e,t)=>t<0?{lo:0,hi:0,fresh:d}:{lo:e,hi:t,fresh:d};return{buf:u,dirty:{position:C(ee,g),uv:C(te,_),face:C(ne,v),exI:C(y,b)}}}var mt=256,k=1<<22,ht=1024;function gt(e,t,n){let r=Math.max(1,e),i=Math.min(ht,r),a=Math.ceil(r/ht);return n&&n.width===i&&n.height===a?n:{width:i,height:a,data:new Float32Array(i*a*t)}}function _t(e,t){let{pos:n,uv:r}=e,i=Math.floor(n.length/3),a=gt(i*2,4,t),o=a!==t,s=a.data,c=1/0,l=-1;for(let e=0;e<i;e++){let t=e*8,i=s[t],a=s[t+1],o=s[t+2],u=s[t+3],d=s[t+4];s[t]=n[e*3],s[t+1]=n[e*3+1],s[t+2]=n[e*3+2],s[t+3]=r[e*2],s[t+4]=r[e*2+1],(s[t]!==i||s[t+1]!==a||s[t+2]!==o||s[t+3]!==u||s[t+4]!==d)&&(t<c&&(c=t),l=t+8)}return{tex:a,dirty:{lo:l<0?0:c,hi:l<0?0:l,fresh:o}}}function vt(e,t,n){let r=Math.max(1,Math.ceil(e/2)),i=gt(r+Math.max(1,Math.ceil(t/4)),4,n?.modeAt===r?n.tex:null),a=n&&n.sx.length>=e,o=i.data;return{tex:i,modeAt:r,snap:{width:i.width,height:i.height,data:o.subarray(0,r*4)},mode:{width:i.width,height:i.height,data:o.subarray(r*4,r*4+Math.max(1,t))},sx:a?n.sx:new Float64Array(e),sy:a?n.sy:new Float64Array(e)}}var yt=e=>Math.floor(e*mt+.5);function bt(e,t,n){let{pos:r,idx:i,triFace:a}=e,o=n.mode.data,s=a.length,c=1/0,l=-1;if(t.proj===`persp`){for(let e=0;e<s;e++)o[e]!==0&&(o[e]=0,e<c&&(c=e),l=e+1);return{ortho:!1,mode:{lo:l<0?0:c,hi:l<0?0:l,fresh:!1}}}let u=Math.floor(r.length/3),d=n.sx,f=n.sy,p=n.snap.data;for(let e=0;e<u;e++){let n=t.project(r[e*3],r[e*3+1],r[e*3+2]),i=yt(n[0]),a=yt(n[1]);d[e]=i,f[e]=a,p[e*2]=i,p[e*2+1]=a}for(let e=0;e<s;e++){let t=i[e*3],n=i[e*3+1],r=i[e*3+2],a=d[t],s=f[t],u=d[n],p=f[n],m=d[r],h=f[r],ee=(u-a)*(h-s)-(p-s)*(m-a),g=ee>0?1:ee<0?-1:2;(Math.abs(a)>=k||Math.abs(s)>=k||Math.abs(u)>=k||Math.abs(p)>=k||Math.abs(m)>=k||Math.abs(h)>=k)&&(g=0),o[e]!==g&&(o[e]=g,e<c&&(c=e),l=e+1)}return{ortho:!0,mode:{lo:l<0?0:c,hi:l<0?0:l,fresh:!1}}}var xt=1024;function A(e){let t=Math.max(1,e),n=Math.min(xt,t),r=Math.ceil(t/xt);return{width:n,height:r,data:new Float32Array(n*r*4)}}function St(e,t,n={}){let{L:a,K:l,amb:u}=s(n),d=A(e.length*4),f=d.data,p=new Map;for(let n=0;n<e.length;n++){let i=e[n],s=t[n]??1,c=typeof s==`number`?[s,s,s]:s,u=[0,0,0];for(let e=0;e<3;e++){let t=c[e],n=p.get(t);n===void 0&&(n=p.size*l*l,p.set(t,n)),u[e]=n}let d=r(i),m=o(i.normal[0],i.normal[1],i.normal[2],a,l),h=n*4*4;f[h]=d[0],f[h+1]=d[1],f[h+2]=d[2],f[h+3]=u[0],f[h+4]=d[3],f[h+5]=d[4],f[h+6]=d[5],f[h+7]=m,f[h+8]=d[6],f[h+9]=d[7],f[h+10]=d[8],f[h+11]=u[1],f[h+12]=u[2]}let m=Math.max(1,p.size*l*l),h=new Uint8Array(256*m);for(let[e,t]of p)for(let n=0;n<l;n++)for(let r=0;r<l;r++)h.set(i(c(e,n,r,l,u)),(t+n*l+r)*256);return{faces:d,lut:{rows:m,data:h},K:l,L:a}}function Ct(e){let t=u(e),n=A(t.length);for(let e=0;e<t.length;e++)n.data[e*4]=t[e];return n}function wt(e){let t=e.getContext();for(let n of[t.UNPACK_ROW_LENGTH,t.UNPACK_SKIP_PIXELS,t.UNPACK_SKIP_ROWS,t.UNPACK_IMAGE_HEIGHT,t.UNPACK_SKIP_IMAGES])e.state.pixelStorei(n,0)}var Tt=96;function j(e,t){let n=e.properties.get(t);return n.__version!==void 0&&n.__version===t.version}function Et(e,t,n,r){if(!r.fresh&&r.hi<=r.lo)return;let i=t.image,a=i.width*n,o=Math.floor(r.lo/a),s=Math.ceil(r.hi/a);if(r.fresh||n!==4||!j(e,t)||s-o>Tt){t.clearUpdateRanges(),t.needsUpdate=!0;return}for(let e=o;e<s;e++)t.addUpdateRange(e*i.width*4,i.width*4);t.needsUpdate=!0}function Dt(e,t){if(t.fresh){e.clearUpdateRanges(),e.needsUpdate=!0;return}t.hi<=t.lo||(e.addUpdateRange(t.lo,t.hi-t.lo),e.needsUpdate=!0)}var Ot=2048;function kt(e,t,n,r){let i=new le(r,e,t,n);return i.format=fe,i.type=ae,i.magFilter=S,i.minFilter=S,i.generateMipmaps=!1,i.flipY=!1,i.unpackAlignment=1,i.needsUpdate=!0,{tex:i,w:e,pageH:t,pages:n,data:r,lastUploaded:n}}function At(e,t,n,r){if(e===t)return!1;let i=r-n;if(n%4==0&&i%4==0&&e.byteOffset%4==0&&t.byteOffset%4==0){let r=new Uint32Array(e.buffer,e.byteOffset+n,i/4),a=new Uint32Array(t.buffer,t.byteOffset+n,i/4);for(let e=0;e<r.length;e++)if(r[e]!==a[e])return!1;return!0}for(let i=n;i<r;i++)if(e[i]!==t[i])return!1;return!0}function jt(e,t){if(!e)return!1;let n=e.properties.get(t);return n.__version!==void 0&&n.__version===t.version}function Mt(e,t,n,r=Ot){let i=Math.max(1,n.w),a=Math.max(1,n.h),o=a<=r?a:r,s=Math.ceil(a/o),c=i*o*4,l=s===1&&n.data.length===c;if(!t||t.w!==i||t.pageH!==o||t.pages!==s){t?.tex.dispose();let e;return l?e=n.data:(e=new Uint8Array(c*s),e.set(n.data.subarray(0,Math.min(n.data.length,e.length)))),kt(i,o,s,e)}let u=!jt(e,t.tex),d=n.data.length,f=0;if(l)(u||!At(t.data,n.data,0,c))&&(f=1),t.data=n.data,t.tex.image.data=n.data;else for(let e=0;e<s;e++){let r=e*c,i=Math.min(d,r+c);(u||!At(t.data,n.data,r,i))&&(t.data.set(n.data.subarray(r,i),r),f++,u||t.tex.addLayerUpdate(e))}return t.lastUploaded=u?s:f,u?(t.tex.clearLayerUpdates(),t.tex.needsUpdate=!0):f>0&&(l&&t.tex.clearLayerUpdates(),t.tex.needsUpdate=!0),t}function Nt(){return kt(1,1,1,new Uint8Array(4))}var Pt=`// px 1x view: the exact CPU image (row 0 = top) drawn over the low-res target; empty
// pixels keep what is below (the floor grid).
precision highp float;
precision highp int;
precision highp sampler2D;
uniform sampler2D uImage;
uniform float uTargetH;
out vec4 outColor;
void main() {
  ivec2 p = ivec2(int(gl_FragCoord.x), int(uTargetH - gl_FragCoord.y));
  vec4 c = texelFetch(uImage, p, 0);
  if (c.a == 0.0) discard;
  outColor = c;
}
`,Ft=`// Outline post pass (GLSL ES 3.0): the GPU twin of engine Post.outline with mode "both",
// width 1, darken 0.5 and \`groups\` = surfaceGroups (render.ts renderFrame opts.outline).
//   outer: an empty pixel next to a non-empty one takes its FIRST non-empty neighbour in
//          the engine order right, left, down, up (image rows, y down) darkened, alpha 255;
//   inner: a non-empty pixel next to a non-empty pixel of ANOTHER group darkens itself.
// Every read is the unmodified building image, as in the engine. Depth is copied so the
// overlays drawn afterwards still hide behind the building.
precision highp float;
precision highp int;
precision highp sampler2D;

uniform sampler2D uColor; // building colours (low-res target)
uniform sampler2D uIds; // id pass: r = face index + 1
uniform sampler2D uDepth; // building depth
uniform sampler2D uGroups; // r = surface group per face value

out vec4 outColor;

const int TABLE_W = 1024;

int faceAt(ivec2 q) {
  return int(texelFetch(uIds, q, 0).r + 0.5);
}

int groupOf(int f) {
  return int(texelFetch(uGroups, ivec2(f % TABLE_W, f / TABLE_W), 0).r + 0.5);
}

vec4 darken(vec4 c) {
  return vec4(floor(c.rgb * 255.0 * 0.5 + 0.5) / 255.0, c.a);
}

void main() {
  ivec2 q = ivec2(gl_FragCoord.xy);
  ivec2 size = textureSize(uIds, 0);
  gl_FragDepth = texelFetch(uDepth, q, 0).r;
  vec4 c = texelFetch(uColor, q, 0);
  // right, left, down (GL y - 1), up (GL y + 1)
  ivec2 nb[4] = ivec2[4](ivec2(1, 0), ivec2(-1, 0), ivec2(0, -1), ivec2(0, 1));
  int fk = faceAt(q);
  if (fk == 0) {
    for (int i = 0; i < 4; i++) {
      ivec2 r = q + nb[i];
      if (r.x < 0 || r.y < 0 || r.x >= size.x || r.y >= size.y) continue;
      if (faceAt(r) != 0) {
        vec4 s = darken(texelFetch(uColor, r, 0));
        outColor = vec4(s.rgb, 1.0);
        return;
      }
    }
    outColor = c;
    return;
  }
  int gk = groupOf(fk);
  for (int i = 0; i < 4; i++) {
    ivec2 r = q + nb[i];
    if (r.x < 0 || r.y < 0 || r.x >= size.x || r.y >= size.y) continue;
    int fn = faceAt(r);
    if (fn != 0 && fn != fk && groupOf(fn) != gk) {
      outColor = darken(c);
      return;
    }
  }
  outColor = c;
}
`;T.enabled=!1;var It=1,Lt=12;function Rt(e){let t=new se(e.data,e.w,e.h,fe);return M(t),t.needsUpdate=!0,t}function M(e){e.magFilter=S,e.minFilter=S,e.generateMipmaps=!1,e.flipY=!1,e.wrapS=w,e.wrapT=w}function N(e){let t=new se(e.data,e.width,e.height,fe,g);return M(t),t.needsUpdate=!0,t}function zt(e){let t=new se(e.data,e.width,e.height,fe,g);return M(t),t.needsUpdate=!0,t}function Bt(e,t,n){let r=new se(e,t,n,fe,ae);return M(r),r.needsUpdate=!0,r}function Vt(e){let t=new se(e.data,256,e.rows,x,ae);return M(t),t.unpackAlignment=1,t.needsUpdate=!0,t}function P(e,t){if(!e||e===t||e.byteLength!==t.byteLength)return!1;let n=e.byteLength;if(e.byteOffset%4==0&&t.byteOffset%4==0&&n%4==0){let r=new Uint32Array(e.buffer,e.byteOffset,n/4),i=new Uint32Array(t.buffer,t.byteOffset,n/4);for(let e=0;e<r.length;e++)if(r[e]!==i[e])return!1;return!0}let r=new Uint8Array(e.buffer,e.byteOffset,n),i=new Uint8Array(t.buffer,t.byteOffset,n);for(let e=0;e<n;e++)if(r[e]!==i[e])return!1;return!0}function Ht(e,t,n,r,i,a=!1){if(e&&e.image.width===n&&e.image.height===r){let t=a&&P(e.image.data,i);return e.image.data=i,t||(e.needsUpdate=!0),e}return e?.dispose(),t()}var Ut={w:1,h:1,data:new Uint8Array(4)};function F(r,i={}){let o=new je({canvas:r,antialias:!1,alpha:!0,premultipliedAlpha:!1,preserveDrawingBuffer:!0,powerPreference:`high-performance`});o.setPixelRatio(1),o.outputColorSpace=ee,o.setClearColor(0,0),wt(o),r.style.imageRendering=`pixelated`,r.style.touchAction=`none`;let s=Math.min(Lt,Math.max(It,Math.floor(i.scale??3))),c=r.clientWidth||300,u=r.clientHeight||150,y={w:1,h:1,scale:s},x={night:!1,shading:`facing`,px1x:!1,grid:!1,outline:!1,effects:f(),...i.view},w=i.camera?Ie(i.camera):t(`iso21`),le=!!i.camera,T=e(w,1,1),E=null,D=null,O=null,at=null,lt=null,ut=null,dt=0,mt=null,k=null,ht=0,gt=0,yt=1,xt=-1,A=!1,Tt=e=>{let t=new ie(1,1,{type:e?g:ae,format:fe,magFilter:S,minFilter:S,generateMipmaps:!1,depthBuffer:!0,stencilBuffer:!1,samples:0});return t.depthTexture=new me(1,1,g),t},j=Tt(!1),Ot=Tt(!0),kt=Tt(!1),At=Tt(!1),jt=Tt(!1),M=j,P=!1,F=Nt(),Wt=Nt(),Gt=Nt(),Kt=null,I=null,L=Ke([]),qt=Vt(L),Jt=null,Yt=null,Xt=N({width:1,height:1,data:new Float32Array(4)}),Zt=null,Qt=N({width:1,height:1,data:new Float32Array(4)}),$t=``,en=0,tn=N({width:1,height:1,data:new Float32Array(4)}),nn=Nt(),rn=N({width:1,height:1,data:new Float32Array(4)}),an=null,on=N({width:1,height:1,data:new Float32Array(4)}),sn=!1,cn=Bt(new Uint8Array(4),1,1),ln=null,un=``,dn=()=>({width:1,height:1,data:new Float32Array(4)}),fn=zt(dn()),R=zt(dn()),z={uExV:{value:fn},uExS:{value:R},uExModeAt:{value:0},uXrayPass:{value:0},uFaces:{value:Xt},uFaceDyn:{value:Qt},uAtlas:{value:F.tex},uWindows:{value:Wt.tex},uNight:{value:Gt.tex},uRoomAtlas:{value:F.tex},uPageH:{value:1},uRoomPageH:{value:1},uLut:{value:qt},uRooms:{value:tn},uVariantsAt:{value:0},uNormalLutRow0:{value:0},uInterior:{value:0},uNightMode:{value:0},uLampFrame:{value:-1},uPersp:{value:0},uRoomW:{value:8},uDepth:{value:6},uOffset:{value:0},uGlass:{value:new pe},uLightMix:{value:.7},uLightMixInv:{value:1-.7},uRamp:{value:1},uHaloK:{value:0},uGlassK:{value:0},uCamR:{value:new C},uCamU:{value:new C},uCamF:{value:new C},uCamK:{value:new pe},uTargetH:{value:1},uTarget:{value:new ce(1,1)},uNormals:{value:nn.tex},uNormalFaces:{value:rn},uNormalMode:{value:0},uBandK:{value:4},uSunL:{value:new C(0,0,1)},uRampTone:{value:0},uRampProbe:{value:1},uRampHash:{value:cn},uRampTabRow0:{value:1}},B=new b({glslVersion:v,vertexShader:Re,fragmentShader:ze,uniforms:z,side:2,depthFunc:2,blending:0}),pn=new b({glslVersion:v,vertexShader:Re,fragmentShader:ze,uniforms:{...z,uXrayPass:{value:0}},defines:{ID_PASS:``},side:2,depthFunc:2,blending:0}),V=new oe,H=new de;H.matrixAutoUpdate=!1,H.matrixWorldAutoUpdate=!1;let U=new re,W=new _(U,B);W.frustumCulled=!1,W.renderOrder=-2,W.matrixAutoUpdate=!1,V.add(W);let mn={...z,uXrayPass:{value:2}},hn=new b({glslVersion:v,vertexShader:Re,fragmentShader:ze,uniforms:mn,side:2,depthFunc:2,depthWrite:!1,blending:5,blendSrc:213,blendDst:214}),G=new _(U,hn);G.frustumCulled=!1,G.renderOrder=-1.5,G.matrixAutoUpdate=!1,G.visible=!1,V.add(G);let gn=0,_n=0;function vn(){let e=x.xrayLayers,t=D;if(!t||!e||e.length===0)return!1;let n=`${_n}|${e.join(`,`)}`;if(n!==un){un=n;let r=new Set(e),i=new Uint8Array(t.refs.length);for(let e=0;e<t.refs.length;e++)r.has(t.refs[e].layer)&&(i[e]=1);ln=i,Y=!0}return!0}let yn=new oe,bn=new _(U,pn);bn.frustumCulled=!1,bn.matrixAutoUpdate=!1,yn.add(bn);let xn=st(),Sn=xn,Cn=new re;Cn.setAttribute(`position`,new ue(new Float32Array([-1,-1,0,3,-1,0,-1,3,0]),3));let K=We(Re,ze,{...z,uXrayPass:{value:0}},Cn);K.mesh.geometry=U;let wn=Rt(Ut),Tn={uImage:{value:wn},uTargetH:{value:1}},q=new _(Cn,new b({glslVersion:v,vertexShader:xe,fragmentShader:Pt,uniforms:Tn,depthTest:!1,depthWrite:!1,blending:0}));q.frustumCulled=!1,q.renderOrder=-1,q.visible=!1,V.add(q);let En=new te;En.name=`overlayRoot`,V.add(En);let Dn=new oe,On=new te;On.name=`screenRoot`,Dn.add(On);let kn={uSceneDepth:{value:j.depthTexture},uScale:{value:s}},An=new oe,jn=new h,Mn={uSrc:{value:j.texture},uScale:{value:s},uScan:{value:0},...xn.uniforms,uGridTex:{value:null}},J=null,Nn=null,Pn=!1,Fn=!1,In=e=>new b({glslVersion:v,vertexShader:xe,fragmentShader:e,uniforms:Mn,depthTest:!1,depthWrite:!1,blending:0}),Ln=In(Qe),Rn=In(it),zn=In(nt),Bn=In(rt),Vn=new ie(1,1,{type:g,format:fe,magFilter:S,minFilter:S,generateMipmaps:!1,depthBuffer:!1,stencilBuffer:!1});Mn.uGridTex.value=Vn.texture;let Hn=``,Un=0,Wn=new _(Cn,Ln);Wn.frustumCulled=!1,An.add(Wn);function Gn(e){if(o.setRenderTarget(null),!Sn.visible)return Ln;let t=y.w*s,n=y.h*s,r=xn.uniforms,i=[+!!e,t,n,...r.uHome.value.elements,...r.uFw.value.toArray(),...r.uFl.value.toArray(),...r.uLevels.value.toArray(),...r.uQuad.value.toArray(),r.uFade.value,r.uCell.value,r.uOpacity.value,r.uAA.value,...r.uGridCol.value.toArray(),...r.uAxisX.value.toArray(),...r.uAxisY.value.toArray()].join(`,`);return i!==Hn&&(Hn=i,Un++,(Vn.width!==t||Vn.height!==n)&&Vn.setSize(t,n),Wn.material=e?zn:Bn,o.setRenderTarget(Vn),o.render(An,jn),o.setRenderTarget(null)),Rn}let Kn=new oe,qn={uColor:{value:j.texture},uIds:{value:Ot.texture},uDepth:{value:j.depthTexture},uGroups:{value:on}},Jn=new _(Cn,new b({glslVersion:v,vertexShader:xe,fragmentShader:Ft,uniforms:qn,depthTest:!0,depthWrite:!0,depthFunc:1,blending:0}));Jn.frustumCulled=!1,Kn.add(Jn);let Y=!0,Yn=null,Xn=!0,Zn=null,X=0,Qn=!1,$n=0,Z=null,er=new Set,tr=new Set;function nr(){ht++,mt=null}function rr(){let e=Ie(w);for(let t of tr)t(e)}function ir(){nr(),T=e(w,y.w,y.h);let[t,n]=tt(T,E);gt=t,yt=n;let r=ke(T,t,n);H.projectionMatrix.fromArray(Array.from(r)),lr(),H.projectionMatrixInverse.copy(H.projectionMatrix).invert(),z.uPersp.value=+(T.proj===`persp`),z.uCamR.value.fromArray(T.right),z.uCamU.value.fromArray(T.up),z.uCamF.value.fromArray(T.forward),z.uCamK.value.set(T.cx0,T.cy0,T.focal||1,T.heightScale),z.uTargetH.value=y.h,z.uTarget.value.set(y.w,y.h),Tn.uTargetH.value=y.h,Y=!0,Xn=!0,en++}function ar(){Y=!1;let e=D;if(!e)return;let t=or(e),n=x.sun?{...e.shading??{},sun:[t[0],t[1],t[2]]}:void 0,r=Le(e,{night:x.night,shading:x.shading,...n?{look:n}:{}}),i=Fe(e.mesh,T,r);if(L=Ye(i),sn){let t=St(e.mesh.faces,i,l({look:r.look}));rn.dispose(),rn=N(t.faces),an=t.lut,z.uNormalFaces.value=rn,z.uBandK.value=t.K,z.uSunL.value.set(t.L[0],t.L[1],t.L[2])}z.uNormalMode.value=+!!sn;let a=L;if(sn&&an){let e=new Uint8Array((L.rows+an.rows)*256);e.set(L.data.subarray(0,L.rows*256)),e.set(an.data.subarray(0,an.rows*256),L.rows*256),a={rows:L.rows+an.rows,data:e,rowOf:L.rowOf}}if(z.uNormalLutRow0.value=L.rows,qt=Ht(qt,()=>Vt(a),256,a.rows,a.data),z.uLut.value=qt,I??=He(e),!Jt||Yt?.sc!==e||Yt.rooms!==I){let t=Ze(e,I,Jt);t.st.table===Jt?.table?Et(o,Xt,4,t.dirty):(Xt.dispose(),Xt=N(t.st.table),z.uFaces.value=Xt),Jt=t.st,Yt={sc:e,rooms:I}}let s=Xe(e,i,r);if(s){let e=s.tones.hashTable(),t=s.tones.rowTable(),n=new Uint8Array(e.data.length+t.data.length);n.set(e.data),n.set(t.data,e.data.length);let r=e.height+t.height;cn=Ht(cn,()=>Bt(n,e.width,r),e.width,r,n,!0),z.uRampHash.value=cn,z.uRampTabRow0.value=e.height,z.uRampProbe.value=e.probe}z.uRampTone.value=+!!s;let c=qe(e,T,Jt,i,L,Zt,s?.rows??null,ln);c.table===Zt?Et(o,Qt,4,c.dirty):(Qt.dispose(),Qt=N(c.table),z.uFaceDyn.value=Qt),Zt=c.table,z.uNightMode.value=+!!x.night}function or(e){let t=x.sun;return t&&t.length>=3?t:n(e.shading).sun}function sr(e){I=He(e),tn.dispose();let t=Ge(I.rooms,I.variants);tn=N(t.table),z.uRooms.value=tn,z.uVariantsAt.value=t.at;let n=e.rooms?.settings;if(z.uInterior.value=n?.enabled&&I.count>0?1:0,n){let e=n.lightMix??.7;e=Math.min(1,Math.max(0,e)),z.uRoomW.value=n.roomW,z.uDepth.value=n.depth,z.uOffset.value=n.offset??0;let t=n.glass??[0,0,0,0];z.uGlass.value.set(t[0],t[1],t[2],t[3]),z.uLightMix.value=e,z.uLightMixInv.value=1-e;let r=a(n);z.uRamp.value=+!!r.ramp,z.uHaloK.value=r.haloK,z.uGlassK.value=r.glassK}}function cr(e){let t=!e.rooms||e.rooms.atlas===e.atlas;F=Mt(o,F,e.atlas),Wt=Mt(o,Wt,e.windows),Gt=Mt(o,Gt,e.night);let n=F;t?(Kt?.tex.dispose(),Kt=null):(Kt=Mt(o,Kt,e.rooms.atlas),n=Kt),z.uAtlas.value=F.tex,z.uWindows.value=Wt.tex,z.uNight.value=Gt.tex,z.uRoomAtlas.value=n.tex,z.uPageH.value=F.pageH,z.uRoomPageH.value=n.pageH;let r=e.normals??null;sn=!!r&&r.w===e.atlas.w&&r.h===e.atlas.h,nn=Mt(o,nn,sn?r:Ut),z.uNormals.value=nn.tex,dt=F.lastUploaded+Wt.lastUploaded+Gt.lastUploaded+nn.lastUploaded,sr(e)}function lr(){let e=D;if(!e||!O)return;let t=bt(e.mesh,T,O);if(t.ortho)Et(o,R,4,{lo:0,hi:0,fresh:!0});else{let e=O.modeAt*4;Et(o,R,4,{lo:e+t.mode.lo,hi:e+t.mode.hi,fresh:!1})}}function ur(e){let t=lt,{buf:n,dirty:r}=pt(e.mesh,lt,ft(e,ut));lt=n,ut=e;let i=!1;if(n!==t){let e=new re;for(let[t,r]of ct)e.setAttribute(t,new ue(n[t],r));U.dispose(),U=e,W.geometry=e,G.geometry=e,bn.geometry=e,K.mesh.geometry=e,i=!0}else for(let[e]of ct){let t=r[e];t.hi>t.lo&&(i=!0),Dt(U.getAttribute(e),t)}U.drawRange.count!==n.count&&(i=!0),U.setDrawRange(0,n.count);let a=_t(e.mesh,at);a.tex===at?Et(o,fn,4,a.dirty):(fn.dispose(),fn=zt(a.tex),z.uExV.value=fn),a.dirty.hi>a.dirty.lo&&(i=!0),at=a.tex;let s=vt(Math.floor(e.mesh.pos.length/3),e.mesh.triFace.length,O);(!O||s.tex!==O.tex)&&(R.dispose(),R=zt(s.tex),z.uExS.value=R),z.uExModeAt.value=s.modeAt,O=s,i&&gn++,_n++,on.dispose(),on=N(Ct(e.mesh.faces)),qn.uGroups.value=on}function dr(){xn.update({cell:x.gridCell??8,opacity:x.gridOpacity??.4,distance:x.gridDistance}),xn.setColors(Ae(`--tb-border-control`,ot.line),Ae(`--tb-danger`,ot.axisX),Ae(`--tb-success`,ot.axisY))}function fr(){let e=mt,t=x.px1x&&!!e&&xt===ht&&e.w===y.w&&e.h===y.h;q.visible=t,B.colorWrite===t&&(B.colorWrite=!t,B.needsUpdate=!0),t&&e&&e!==k&&(wn=Ht(wn,()=>Rt(e),e.w,e.h,e.data),Tn.uImage.value=wn,k=e)}function pr(){let e=x.hour;if(e===void 0||x.px1x||P&&!Pn||!D)return mr();let t=performance.now(),n=x,r=Pe(e,De(n.sun)),i=Me(r);Fn=!0;let a;try{let e=(e,t)=>(x={...n,night:e,sun:t},Y=!0,mr(),_r(M));a=Ne({sun:i.sun?e(!1,r.sun):null,moon:i.moon?e(!1,r.moonDir):null,night:i.night?e(!0,r.moonDir):null},r)}finally{Fn=!1,x=n,Y=!0}if(!a)return mr();Nn=a;let{w:c,h:l,data:u}=a;(!J||J.image.width!==c||J.image.height!==l)&&(J?.dispose(),J=new se(new Uint8Array(c*l*4),c,l),J.magFilter=S,J.minFilter=S,J.generateMipmaps=!1);let f=J.image.data;for(let e=0;e<l;e++)f.set(u.subarray(e*c*4,(e+1)*c*4),(l-1-e)*c*4);if(J.needsUpdate=!0,!P){Mn.uScan.value=x.effects&&d(x.effects)?K.scanlines(x.effects):0,Mn.uSrc.value=J,Mn.uScale.value=s,Wn.material=Gn(T.proj===`persp`),o.render(An,jn),hr(),$n++;for(let e of er)e()}return performance.now()-t}function mr(){let e=performance.now();if(Qn||A)return 0;W.visible=!!D;let t=!x.px1x&&x.xray&&x.xray>0&&x.xray<1?x.xray:0,n=t>0&&!!D&&vn(),r=t>0&&!n,i=!!D&&D!==Yn;i&&(Yn=D);let a=i?Be():0;Y&&ar(),i&&Ve(`view: tables`,a),B.blending=r?5:0,B.blendSrc=213,B.blendDst=214,B.blendAlpha=t,B.depthWrite=!r,z.uXrayPass.value=+!!n,hn.blendAlpha=t,G.visible=n,Sn.visible=x.grid&&!x.px1x&&!P,Sn.visible&&xn.follow(T,H.projectionMatrix,{w:y.w*s,h:y.h*s}),fr(),En.visible=!P&&!q.visible;let c=x.outline&&!!D&&!q.visible,l=x.effects??null,u=d(l)&&!!D&&!x.px1x&&!q.visible;if(z.uLampFrame.value=Ue(l,performance.now()/1e3),br(),c||u){c&&(o.setRenderTarget(Ot),o.clear(!0,!0,!1),o.render(yn,H),Xn=!0);let e=En.visible;En.visible=!1,o.setRenderTarget(j),o.clear(!0,!0,!1),o.render(V,H),En.visible=e;let t=j;if(c&&(o.setRenderTarget(kt),o.clear(!0,!0,!1),o.render(Kn,jn),t=kt),u&&l){if(D){let e=or(D),t=!!l.wind?.on,n=`${_n}|${e.join(`,`)}|${l.reflection.on?en:`-`}|${t}`;if(n!==$t){$t=n;let r=t?m(D):null;K.setFaces(D.mesh.faces,T,e,p(D),r)}}(l.shadows.on||l.godrays.on)&&D&&K.updateShadowMap(o,U,gn,E,or(D)),o.setRenderTarget(At),o.clear(!0,!0,!1),o.render(K.scene,H),K.setPost(t,At,l,{w:y.w,h:y.h,night:x.night,near:gt,far:yt,persp:T.proj===`persp`,clipToWorld:H.projectionMatrixInverse,groundZ:E?E[2]:0,topZ:E?E[5]:0,sun:D?or(D):null,time:yr(l)||Ce(l)||Se(l)||Ee(l)?performance.now()/1e3:0}),o.setRenderTarget(jt),o.clear(!0,!0,!1),o.render(K.postScene,jn),t=jt}o.setRenderTarget(t);let n=o.autoClear;o.autoClear=!1,W.visible=!1;let r=G.visible;G.visible=!1,o.render(V,H),W.visible=!0,G.visible=r,o.autoClear=n,M=t}else o.setRenderTarget(j),o.clear(!0,!0,!1),o.render(V,H),M=j;if(Fn)return 0;Mn.uScan.value=u&&l?K.scanlines(l):0,Mn.uSrc.value=M.texture,Mn.uScale.value=s,Wn.material=Gn(T.proj===`persp`),o.render(An,jn),hr(),$n++;let f=performance.now()-e;i&&Ve(`view: first frame of the scene`,e);for(let e of er)e();return f}function hr(){if(P||q.visible||On.children.length===0)return;kn.uScale.value=s;let e=o.autoClear;o.autoClear=!1,o.render(Dn,H),o.autoClear=e}function gr(){pr();let e=o.getContext(),t=y.w*s,n=y.h*s,r=new Uint8Array(t*n*4);o.setRenderTarget(null),e.readPixels(0,0,t,n,e.RGBA,e.UNSIGNED_BYTE,r);let i=new Uint8Array(t*n*4);for(let e=0;e<n;e++)i.set(r.subarray(e*t*4,(e+1)*t*4),(n-1-e)*t*4);return{w:t,h:n,data:i}}function _r(e){let{w:t,h:n}=y,r=new Uint8Array(t*n*4);o.readRenderTargetPixels(e,0,0,t,n,r);let i=new Uint8Array(t*n*4);for(let e=0;e<n;e++)i.set(r.subarray(e*t*4,(e+1)*t*4),(n-1-e)*t*4);return{w:t,h:n,data:i}}let Q=null,vr=0;function yr(e){return!!e&&d(e)&&e.fog.on&&e.fog.banks&&e.fog.animated&&!x.px1x}function br(){let e=(Ce(x.effects)||Se(x.effects)||Ee(x.effects)||he(x.effects))&&!x.px1x,t=(yr(x.effects)||e)&&!!D,n=e?12:8;t&&Q&&vr!==n&&(clearInterval(Q),Q=null),vr=n,t&&!Q?Q=setInterval(()=>$(),1e3/n):!t&&Q&&(clearInterval(Q),Q=null)}function $(){X||Qn||A||(X=requestAnimationFrame(()=>{X=0,pr()}))}function xr(){if(Qn||A)return;Y&&ar(),o.setRenderTarget(Ot),o.clear(!0,!0,!1),D&&o.render(yn,H);let e=new Float32Array(y.w*y.h*4);o.readRenderTargetPixels(Ot,0,0,y.w,y.h,e),o.setRenderTarget(null),Zn=e,Xn=!1}function Sr(){return(Xn||!Zn)&&xr(),Xn?null:Zn}function Cr(){let{w:e,h:t}=be(c,u,s);y.w=e,y.h=t,y.scale=s,o.setSize(e*s,t*s,!1),r.style.width=`${e*s}px`,r.style.height=`${t*s}px`,j.setSize(e,t),Ot.setSize(e,t),kt.setSize(e,t),At.setSize(e,t),jt.setSize(e,t),ir()}function wr(e){let t=Math.min(Lt,Math.max(It,Math.floor(e)));t!==s&&(s=t,Cr(),rr(),$())}function Tr(e){w=Ie(e),ir(),rr(),$()}function Er(){E&&Tr($e(w,E,y.w,y.h))}let Dr=ye({params:()=>w,setParams:Tr,size:()=>y,scale:()=>s,setScale:wr,bounds:()=>E,orbitSpeed:()=>Je.orbit,zoomSpeed:()=>Je.zoom}),Or=null,kr=-1;function Ar(e){let t=r.getBoundingClientRect(),n=e.clientX-t.left,i=e.clientY-t.top,[a,o]=Oe(n,i,s);return{x:n,y:i,px:a,py:o,button:e.button,buttons:e.buttons,shift:e.shiftKey,ctrl:e.ctrlKey||e.metaKey,alt:e.altKey}}function jr(e){try{r.setPointerCapture(e)}catch{}}function Mr(e){try{r.hasPointerCapture(e)&&r.releasePointerCapture(e)}catch{}}let Nr=e=>({button:e.button,shiftKey:e.shiftKey,altKey:e.altKey,ctrlKey:e.ctrlKey,metaKey:e.metaKey});function Pr(e){if(kr!==-1)return;let t=e.button===2&&!!Z?.wantsRightButton,n=!t&&_e(we.scheme,e)!==null;if(!n&&(e.button===0&&Z||t)){e.preventDefault(),kr=e.button,jr(e.pointerId),Z?.down?.(Ar(e));return}if(n){e.preventDefault();let t=r.getBoundingClientRect();Dr.down({...Nr(e),x:e.clientX-t.left,y:e.clientY-t.top})&&(Or={id:e.pointerId},jr(e.pointerId))}}function Fr(e){if(Or&&e.pointerId===Or.id){let t=r.getBoundingClientRect();Dr.move({x:e.clientX-t.left,y:e.clientY-t.top});return}Z?.move?.(Ar(e))}function Ir(e){if(Or&&e.pointerId===Or.id){Or=null,Dr.up(),Mr(e.pointerId);return}kr!==-1&&e.button===kr&&(kr=-1,Mr(e.pointerId),Z?.up?.(Ar(e)))}function Lr(){kr!==-1&&(kr=-1,Z?.cancel?.())}function Rr(){Or=null,Dr.cancel(),Lr()}function zr(e){e.key===`Escape`&&Lr()}function Br(e){e.preventDefault();let t=r.getBoundingClientRect();Dr.wheel(e.deltaY,e.clientX-t.left,e.clientY-t.top)}let Vr=e=>e.preventDefault();function Hr(e){e.preventDefault(),Qn=!0,X&&cancelAnimationFrame(X),X=0}function Ur(){Qn=!1,wt(o),Y=!0,Xn=!0;for(let e of[F,Wt,Gt,Kt,nn])e&&(e.tex.clearLayerUpdates(),e.tex.needsUpdate=!0);for(let e of[qt,Xt,Qt,fn,R])e.clearUpdateRanges(),e.needsUpdate=!0;for(let e of Object.values(U.attributes))e.clearUpdateRanges(),e.needsUpdate=!0;tn.needsUpdate=!0;for(let e of[rn,on])e.needsUpdate=!0;wn.needsUpdate=!0,Hn=``,k=null,$()}r.addEventListener(`pointerdown`,Pr),r.addEventListener(`pointermove`,Fr),r.addEventListener(`pointerup`,Ir),r.addEventListener(`pointercancel`,Rr),r.addEventListener(`wheel`,Br,{passive:!1}),r.addEventListener(`contextmenu`,Vr),r.addEventListener(`webglcontextlost`,Hr),r.addEventListener(`webglcontextrestored`,Ur),window.addEventListener(`keydown`,zr),window.addEventListener(`blur`,Lr),Cr();try{let e=Be(),t=new oe,n=[B,Ln,Rn,zn,Bn],r=K.mesh.material;r instanceof ne&&n.push(r);for(let e of K.postScene.children){let t=e.material;t instanceof ne&&n.push(t)}for(let e of n){let n=new _(Cn,e);n.frustumCulled=!1,t.add(n)}o.compile(t,jn),o.getContext().flush(),Ve(`view: start shader compile`,e)}catch{}let Wr={canvas:r,three:{renderer:o,scene:V,camera:H,overlayRoot:En,screenRoot:On,screenUniforms:kn},size:y,setScene(e){if(A)return;nr();let t=ve(e.mesh.pos),n=!!E&&!!t&&t.every((e,t)=>e===E[t]);D=e,E=t;let r=Be();ur(e),Ve(`view: geometry`,r),r=Be(),cr(e),Ve(`view: textures and rooms`,r),n||dr(),!le&&E?(le=!0,w=$e(w,E,y.w,y.h),ir(),rr()):ir(),$()},updateTextures(e){A||(nr(),D=e,cr(e),Y=!0,Xn=!0,$())},getCamera:()=>Ie(w),setCamera:e=>Tr(e),rotateStep(e){Tr(Te(w,e,y.w,y.h))},frameAll:Er,setView(e){let t={...x,...e};(t.night!==x.night||t.shading!==x.shading||!!t.outline!=!!x.outline)&&nr();let n=e=>e.gridDistance,r=t.gridCell!==x.gridCell||t.gridOpacity!==x.gridOpacity||n(t)!==n(x);x=t,r&&dr(),Y=!0,$()},getView:()=>({...x}),setExactImage(e,t){let n=!!e&&(t===void 0||t===ht);return mt=n?e:null,xt=ht,k=null,x.px1x&&$(),n},get exactVersion(){return ht},pick(e,t){let n=D;if(!n)return null;let[r,i]=Oe(e,t,s);if(r<0||i<0||r>=y.w||i>=y.h)return null;let a=Sr();if(!a)return null;let o=((y.h-1-i)*y.w+r)*4,c=Math.round(a[o]);if(c<=0)return null;let l=c-1,u=n.refs[l],d=n.mesh.faces[l];if(!u||!d)return null;let f=a[o+1],p=a[o+2];return{faceIndex:l,ref:u,u:f,v:p,texel:[Math.floor(f)+u.u0,Math.floor(p)+u.v0],world:ge(d,f,p),normal:[d.normal[0],d.normal[1],d.normal[2]]}},ray(e,t){let[n,r]=et(e,t,s);return T.ray(n,r)},project(e){let t=T.project(e[0],e[1],e[2]);return[t[0]*s,t[1]*s]},setTool(e){e!==Z&&(Lr(),Z=e,r.style.cursor=e?.cursor??``)},requestRender:$,onRender(e){return er.add(e),()=>er.delete(e)},onCameraChange(e){return tr.add(e),()=>tr.delete(e)},resize(e,t){c=e,u=t,Cr(),rr(),$()},setScale:wr,render(){pr()},dispose(){if(!A){Lr(),Z=null,A=!0,X&&cancelAnimationFrame(X),X=0,r.removeEventListener(`pointerdown`,Pr),r.removeEventListener(`pointermove`,Fr),r.removeEventListener(`pointerup`,Ir),r.removeEventListener(`pointercancel`,Rr),r.removeEventListener(`wheel`,Br),r.removeEventListener(`contextmenu`,Vr),r.removeEventListener(`webglcontextlost`,Hr),r.removeEventListener(`webglcontextrestored`,Ur),window.removeEventListener(`keydown`,zr),window.removeEventListener(`blur`,Lr);for(let e of[F,Wt,Gt,Kt,nn])e?.tex.dispose();J?.dispose();for(let e of[qt,Xt,Qt,cn])e.dispose();tn.dispose();for(let e of[rn,on])e.dispose();hn.dispose(),Jn.material.dispose(),wn.dispose();for(let e of[fn,R])e.dispose();U.dispose(),Cn.dispose(),B.dispose(),pn.dispose(),q.material.dispose(),Ln.dispose(),Rn.dispose(),zn.dispose(),Bn.dispose(),Vn.dispose(),K.dispose(),Q&&clearInterval(Q),Q=null;for(let e of[j,Ot,kt,At,jt])e.depthTexture?.dispose(),e.dispose();Zn=null,D=null,mt=null,k=null,o.dispose(),er.clear(),tr.clear()}},debug:{renderNow:pr,readFx(){return _r(At)},readColor(){return _r(M)},readScreen:gr,readScene(){P=!0;try{return pr(),_r(M)}finally{P=!1,pr()}},readIds(){let{w:e,h:t}=y;xr();let n=Zn??new Float32Array(e*t*4),r=new Int32Array(e*t),i=new Float32Array(e*t),a=new Float32Array(e*t);for(let o=0;o<t;o++)for(let s=0;s<e;s++){let c=(o*e+s)*4,l=(t-1-o)*e+s;r[l]=Math.round(n[c]),i[l]=n[c+1],a[l]=n[c+2]}return{w:e,h:t,face:r,u:i,v:a}},get contextLost(){return Qn},updateTablesNow(){Y&&ar()},gpuStats(){return{pagesUploaded:dt,geometryVersion:gn,drawCap:lt?.cap??0,drawCount:lt?.count??0,gridDraws:Un}},get frames(){return $n}}};return dr(),Object.assign(Wr.debug??{},{readDusk:()=>{P=!0,Pn=!0,Nn=null;try{return pr(),Nn??_r(M)}finally{P=!1,Pn=!1,pr()}},facadeTextureUnits:()=>{let e=o.getContext(),t=new Set([e.SAMPLER_2D,e.SAMPLER_3D,e.SAMPLER_CUBE,e.SAMPLER_2D_SHADOW,e.SAMPLER_2D_ARRAY,e.SAMPLER_2D_ARRAY_SHADOW,e.SAMPLER_CUBE_SHADOW,e.INT_SAMPLER_2D,e.INT_SAMPLER_3D,e.INT_SAMPLER_CUBE,e.INT_SAMPLER_2D_ARRAY,e.UNSIGNED_INT_SAMPLER_2D,e.UNSIGNED_INT_SAMPLER_3D,e.UNSIGNED_INT_SAMPLER_CUBE,e.UNSIGNED_INT_SAMPLER_2D_ARRAY]),n=0;for(let r of o.info.programs??[]){let i=r.program,a=e.getProgramParameter(i,e.ACTIVE_UNIFORMS),o=0,s=!1;for(let n=0;n<a;n++){let r=e.getActiveUniform(i,n);r&&(r.name===`uFaceDyn`&&(s=!0),t.has(r.type)&&(o+=r.size))}s&&(n=Math.max(n,o))}return n}}),Wr}export{F as createViewport};