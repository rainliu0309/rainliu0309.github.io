(() => {
  "use strict";
  let layer = document.querySelector(".fluid-cursor-layer");
  let canvas = layer?.querySelector(".fluid-cursor-canvas");

  if (!layer || !canvas) {
    layer = document.createElement("div");
    layer.className = "fluid-cursor-layer";
    layer.setAttribute("aria-hidden", "true");

    canvas = document.createElement("canvas");
    canvas.className = "fluid-cursor-canvas";
    layer.appendChild(canvas);
    document.body.prepend(layer);
  }

  Object.assign(layer.style, {
    position: "fixed",
    zIndex: "0",
    inset: "0",
    width: "100%",
    height: "100%",
    pointerEvents: "none",
  });

  Object.assign(canvas.style, {
    display: "block",
    width: "100vw",
    height: "100vh",
    pointerEvents: "none",
  });

  document.body.style.isolation = "isolate";
  Array.from(document.body.children).forEach((element) => {
    if (
      element === layer ||
      element.tagName === "SCRIPT" ||
      element.tagName === "STYLE"
    ) {
      return;
    }

    const computedStyle = window.getComputedStyle(element);
    if (computedStyle.position === "static") {
      element.style.position = "relative";
    }
    if (computedStyle.zIndex === "auto") {
      element.style.zIndex = "1";
    }
  });

  const w = { current: canvas };
  const g = { current: null };
  const t = 128;
  const e = 512;
  const n = 512;
  const r = 3.5;
  const i = 2;
  const s = 0.1;
  const o = 20;
  const a = 3;
  const l = 0.08;
  const u = 2000;
  const c = true;
  const f = 10;
  const d = { r: 0, g: 0.02, b: 0.06 };
  const h = true;
  const v = false;
  const m = "#002FA7";
  const i1 = Object.defineProperty;
  const s1 = (target, key, value) => key in target ? i1(target, key, { enumerable: true, configurable: true, writable: true, value }) : (target[key] = value);
  const Mn = (target, key, value) => s1(target, typeof key !== "symbol" ? key + "" : key, value);
  const cleanup = (() => {if(!w.current)return;const p=w.current;let y=!0;function S(){this.id=-1,this.texcoordX=0,this.texcoordY=0,this.prevTexcoordX=0,this.prevTexcoordY=0,this.deltaX=0,this.deltaY=0,this.down=!1,this.moved=!1,this.color=[0,0,0]}const T={SIM_RESOLUTION:t,DYE_RESOLUTION:e,DENSITY_DISSIPATION:r,VELOCITY_DISSIPATION:i,PRESSURE:s,PRESSURE_ITERATIONS:o,CURL:a,SPLAT_RADIUS:l,SPLAT_FORCE:u,SHADING:c,COLOR_UPDATE_SPEED:f,RAINBOW_MODE:v,COLOR:m},C=[new S],{gl:x,ext:k}=A(p);k.supportLinearFiltering||(T.DYE_RESOLUTION=256,T.SHADING=!1);function A(E){const P={alpha:!0,depth:!1,stencil:!1,antialias:!1,preserveDrawingBuffer:!1};let D=E.getContext("webgl2",P);const L=!!D;L||(D=E.getContext("webgl",P)||E.getContext("experimental-webgl",P));let $,Q;L?(D.getExtension("EXT_color_buffer_float"),Q=D.getExtension("OES_texture_float_linear")):($=D.getExtension("OES_texture_half_float"),Q=D.getExtension("OES_texture_half_float_linear")),D.clearColor(0,0,0,1);const ee=L?D.HALF_FLOAT:$&&$.HALF_FLOAT_OES;let Oe,Ne,pn;return L?(Oe=R(D,D.RGBA16F,D.RGBA,ee),Ne=R(D,D.RG16F,D.RG,ee),pn=R(D,D.R16F,D.RED,ee)):(Oe=R(D,D.RGBA,D.RGBA,ee),Ne=R(D,D.RGBA,D.RGBA,ee),pn=R(D,D.RGBA,D.RGBA,ee)),{gl:D,ext:{formatRGBA:Oe,formatRG:Ne,formatR:pn,halfFloatTexType:ee,supportLinearFiltering:Q}}}function R(E,P,D,L){if(!z(E,P,D,L))switch(P){case E.R16F:return R(E,E.RG16F,E.RG,L);case E.RG16F:return R(E,E.RGBA16F,E.RGBA,L);default:return null}return{internalFormat:P,format:D}}function z(E,P,D,L){const $=E.createTexture();E.bindTexture(E.TEXTURE_2D,$),E.texParameteri(E.TEXTURE_2D,E.TEXTURE_MIN_FILTER,E.NEAREST),E.texParameteri(E.TEXTURE_2D,E.TEXTURE_MAG_FILTER,E.NEAREST),E.texParameteri(E.TEXTURE_2D,E.TEXTURE_WRAP_S,E.CLAMP_TO_EDGE),E.texParameteri(E.TEXTURE_2D,E.TEXTURE_WRAP_T,E.CLAMP_TO_EDGE),E.texImage2D(E.TEXTURE_2D,0,P,4,4,0,D,L,null);const Q=E.createFramebuffer();return E.bindFramebuffer(E.FRAMEBUFFER,Q),E.framebufferTexture2D(E.FRAMEBUFFER,E.COLOR_ATTACHMENT0,E.TEXTURE_2D,$,0),E.checkFramebufferStatus(E.FRAMEBUFFER)===E.FRAMEBUFFER_COMPLETE}class U{constructor(P,D){Mn(this,"vertexShader");Mn(this,"fragmentShaderSource");Mn(this,"programs");Mn(this,"activeProgram");Mn(this,"uniforms");this.vertexShader=P,this.fragmentShaderSource=D,this.programs=[],this.activeProgram=null,this.uniforms=[]}setKeywords(P){let D=0;for(let $=0;$<P.length;$++)D+=r1(P[$]);let L=this.programs[D];if(L==null){const $=W(x.FRAGMENT_SHADER,this.fragmentShaderSource,P);L=G(this.vertexShader,$),this.programs[D]=L}L!==this.activeProgram&&(this.uniforms=j(L),this.activeProgram=L)}bind(){x.useProgram(this.activeProgram)}}class I{constructor(P,D){Mn(this,"uniforms");Mn(this,"program");this.uniforms={},this.program=G(P,D),this.uniforms=j(this.program)}bind(){x.useProgram(this.program)}}function G(E,P){const D=x.createProgram();return x.attachShader(D,E),x.attachShader(D,P),x.linkProgram(D),x.getProgramParameter(D,x.LINK_STATUS)||console.trace(x.getProgramInfoLog(D)),D}function j(E){const P=[],D=x.getProgramParameter(E,x.ACTIVE_UNIFORMS);for(let L=0;L<D;L++){const $=x.getActiveUniform(E,L).name;P[$]=x.getUniformLocation(E,$)}return P}function W(E,P,D){P=ne(P,D);const L=x.createShader(E);return x.shaderSource(L,P),x.compileShader(L),x.getShaderParameter(L,x.COMPILE_STATUS)||console.trace(x.getShaderInfoLog(L)),L}function ne(E,P){if(!P)return E;let D="";return P.forEach(L=>{D+="#define "+L+`
`}),D+E}const M=W(x.VERTEX_SHADER,`
        precision highp float;
        attribute vec2 aPosition;
        varying vec2 vUv;
        varying vec2 vL;
        varying vec2 vR;
        varying vec2 vT;
        varying vec2 vB;
        uniform vec2 texelSize;
        void main () {
            vUv = aPosition * 0.5 + 0.5;
            vL = vUv - vec2(texelSize.x, 0.0);
            vR = vUv + vec2(texelSize.x, 0.0);
            vT = vUv + vec2(0.0, texelSize.y);
            vB = vUv - vec2(0.0, texelSize.y);
            gl_Position = vec4(aPosition, 0.0, 1.0);
        }
      `),O=W(x.FRAGMENT_SHADER,`
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        uniform sampler2D uTexture;
        void main () {
            gl_FragColor = texture2D(uTexture, vUv);
        }
      `),B=W(x.FRAGMENT_SHADER,`
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        uniform sampler2D uTexture;
        uniform float value;
        void main () {
            gl_FragColor = value * texture2D(uTexture, vUv);
        }
      `),Y=`
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uTexture;
      uniform sampler2D uDithering;
      uniform vec2 ditherScale;
      uniform vec2 texelSize;
      vec3 linearToGamma (vec3 color) {
          color = max(color, vec3(0));
          return max(1.055 * pow(color, vec3(0.416666667)) - 0.055, vec3(0));
      }
      void main () {
          vec3 c = texture2D(uTexture, vUv).rgb;
          #ifdef SHADING
              vec3 lc = texture2D(uTexture, vL).rgb;
              vec3 rc = texture2D(uTexture, vR).rgb;
              vec3 tc = texture2D(uTexture, vT).rgb;
              vec3 bc = texture2D(uTexture, vB).rgb;
              float dx = length(rc) - length(lc);
              float dy = length(tc) - length(bc);
              vec3 n = normalize(vec3(dx, dy, length(texelSize)));
              vec3 l = vec3(0.0, 0.0, 1.0);
              float diffuse = clamp(dot(n, l) + 0.7, 0.7, 1.0);
              c *= diffuse;
          #endif
          float a = max(c.r, max(c.g, c.b));
          gl_FragColor = vec4(c, a);
      }
    `,q=W(x.FRAGMENT_SHADER,`
        precision highp float;
        precision highp sampler2D;
        varying vec2 vUv;
        uniform sampler2D uTarget;
        uniform float aspectRatio;
        uniform vec3 color;
        uniform vec2 point;
        uniform float radius;
        void main () {
            vec2 p = vUv - point.xy;
            p.x *= aspectRatio;
            vec3 splat = exp(-dot(p, p) / radius) * color;
            vec3 base = texture2D(uTarget, vUv).xyz;
            gl_FragColor = vec4(base + splat, 1.0);
        }
      `),H=W(x.FRAGMENT_SHADER,`
        precision highp float;
        precision highp sampler2D;
        varying vec2 vUv;
        uniform sampler2D uVelocity;
        uniform sampler2D uSource;
        uniform vec2 texelSize;
        uniform vec2 dyeTexelSize;
        uniform float dt;
        uniform float dissipation;
        vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {
            vec2 st = uv / tsize - 0.5;
            vec2 iuv = floor(st);
            vec2 fuv = fract(st);
            vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);
            vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);
            vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);
            vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);
            return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
        }
        void main () {
            #ifdef MANUAL_FILTERING
                vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy * texelSize;
                vec4 result = bilerp(uSource, coord, dyeTexelSize);
            #else
                vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
                vec4 result = texture2D(uSource, coord);
            #endif
            float decay = 1.0 + dissipation * dt;
            gl_FragColor = result / decay;
        }
      `,k.supportLinearFiltering?void 0:["MANUAL_FILTERING"]),X=W(x.FRAGMENT_SHADER,`
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        varying highp vec2 vL;
        varying highp vec2 vR;
        varying highp vec2 vT;
        varying highp vec2 vB;
        uniform sampler2D uVelocity;
        void main () {
            float L = texture2D(uVelocity, vL).x;
            float R = texture2D(uVelocity, vR).x;
            float T = texture2D(uVelocity, vT).y;
            float B = texture2D(uVelocity, vB).y;
            vec2 C = texture2D(uVelocity, vUv).xy;
            if (vL.x < 0.0) { L = -C.x; }
            if (vR.x > 1.0) { R = -C.x; }
            if (vT.y > 1.0) { T = -C.y; }
            if (vB.y < 0.0) { B = -C.y; }
            float div = 0.5 * (R - L + T - B);
            gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
        }
      `),re=W(x.FRAGMENT_SHADER,`
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        varying highp vec2 vL;
        varying highp vec2 vR;
        varying highp vec2 vT;
        varying highp vec2 vB;
        uniform sampler2D uVelocity;
        void main () {
            float L = texture2D(uVelocity, vL).y;
            float R = texture2D(uVelocity, vR).y;
            float T = texture2D(uVelocity, vT).x;
            float B = texture2D(uVelocity, vB).x;
            float vorticity = R - L - T + B;
            gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
        }
      `),ue=W(x.FRAGMENT_SHADER,`
        precision highp float;
        precision highp sampler2D;
        varying vec2 vUv;
        varying vec2 vL;
        varying vec2 vR;
        varying vec2 vT;
        varying vec2 vB;
        uniform sampler2D uVelocity;
        uniform sampler2D uCurl;
        uniform float curl;
        uniform float dt;
        void main () {
            float L = texture2D(uCurl, vL).x;
            float R = texture2D(uCurl, vR).x;
            float T = texture2D(uCurl, vT).x;
            float B = texture2D(uCurl, vB).x;
            float C = texture2D(uCurl, vUv).x;
            vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
            force /= length(force) + 0.0001;
            force *= curl * C;
            force.y *= -1.0;
            vec2 velocity = texture2D(uVelocity, vUv).xy;
            velocity += force * dt;
            velocity = min(max(velocity, -1000.0), 1000.0);
            gl_FragColor = vec4(velocity, 0.0, 1.0);
        }
      `),We=W(x.FRAGMENT_SHADER,`
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        varying highp vec2 vL;
        varying highp vec2 vR;
        varying highp vec2 vT;
        varying highp vec2 vB;
        uniform sampler2D uPressure;
        uniform sampler2D uDivergence;
        void main () {
            float L = texture2D(uPressure, vL).x;
            float R = texture2D(uPressure, vR).x;
            float T = texture2D(uPressure, vT).x;
            float B = texture2D(uPressure, vB).x;
            float C = texture2D(uPressure, vUv).x;
            float divergence = texture2D(uDivergence, vUv).x;
            float pressure = (L + R + B + T - divergence) * 0.25;
            gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
        }
      `),qt=W(x.FRAGMENT_SHADER,`
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        varying highp vec2 vL;
        varying highp vec2 vR;
        varying highp vec2 vT;
        varying highp vec2 vB;
        uniform sampler2D uPressure;
        uniform sampler2D uVelocity;
        void main () {
            float L = texture2D(uPressure, vL).x;
            float R = texture2D(uPressure, vR).x;
            float T = texture2D(uPressure, vT).x;
            float B = texture2D(uPressure, vB).x;
            vec2 velocity = texture2D(uVelocity, vUv).xy;
            velocity.xy -= vec2(R - L, T - B);
            gl_FragColor = vec4(velocity, 0.0, 1.0);
        }
      `),$e=(x.bindBuffer(x.ARRAY_BUFFER,x.createBuffer()),x.bufferData(x.ARRAY_BUFFER,new Float32Array([-1,-1,-1,1,1,1,1,-1]),x.STATIC_DRAW),x.bindBuffer(x.ELEMENT_ARRAY_BUFFER,x.createBuffer()),x.bufferData(x.ELEMENT_ARRAY_BUFFER,new Uint16Array([0,1,2,0,2,3]),x.STATIC_DRAW),x.vertexAttribPointer(0,2,x.FLOAT,!1,0,0),x.enableVertexAttribArray(0),(E,P=!1)=>{E==null?(x.viewport(0,0,x.drawingBufferWidth,x.drawingBufferHeight),x.bindFramebuffer(x.FRAMEBUFFER,null)):(x.viewport(0,0,E.width,E.height),x.bindFramebuffer(x.FRAMEBUFFER,E.fbo)),P&&(x.clearColor(0,0,0,1),x.clear(x.COLOR_BUFFER_BIT)),x.drawElements(x.TRIANGLES,6,x.UNSIGNED_SHORT,0)});let rt,J,ml,gl,An;const Vd=new I(M,O),vl=new I(M,B),Dn=new I(M,q),zt=new I(M,H),yl=new I(M,X),xl=new I(M,re),Ur=new I(M,ue),oo=new I(M,We),ao=new I(M,qt),lo=new U(M,Y);function bd(){const E=$d(T.SIM_RESOLUTION),P=$d(T.DYE_RESOLUTION),D=k.halfFloatTexType,L=k.formatRGBA,$=k.formatRG,Q=k.formatR,ee=k.supportLinearFiltering?x.LINEAR:x.NEAREST;x.disable(x.BLEND),rt?rt=Id(rt,P.width,P.height,L.internalFormat,L.format,D,ee):rt=_l(P.width,P.height,L.internalFormat,L.format,D,ee),J?J=Id(J,E.width,E.height,$.internalFormat,$.format,D,ee):J=_l(E.width,E.height,$.internalFormat,$.format,D,ee),ml=Wr(E.width,E.height,Q.internalFormat,Q.format,D,x.NEAREST),gl=Wr(E.width,E.height,Q.internalFormat,Q.format,D,x.NEAREST),An=_l(E.width,E.height,Q.internalFormat,Q.format,D,x.NEAREST)}function Wr(E,P,D,L,$,Q){x.activeTexture(x.TEXTURE0);const ee=x.createTexture();x.bindTexture(x.TEXTURE_2D,ee),x.texParameteri(x.TEXTURE_2D,x.TEXTURE_MIN_FILTER,Q),x.texParameteri(x.TEXTURE_2D,x.TEXTURE_MAG_FILTER,Q),x.texParameteri(x.TEXTURE_2D,x.TEXTURE_WRAP_S,x.CLAMP_TO_EDGE),x.texParameteri(x.TEXTURE_2D,x.TEXTURE_WRAP_T,x.CLAMP_TO_EDGE),x.texImage2D(x.TEXTURE_2D,0,D,E,P,0,L,$,null);const Oe=x.createFramebuffer();x.bindFramebuffer(x.FRAMEBUFFER,Oe),x.framebufferTexture2D(x.FRAMEBUFFER,x.COLOR_ATTACHMENT0,x.TEXTURE_2D,ee,0),x.viewport(0,0,E,P),x.clear(x.COLOR_BUFFER_BIT);const Ne=1/E,pn=1/P;return{texture:ee,fbo:Oe,width:E,height:P,texelSizeX:Ne,texelSizeY:pn,attach($r){return x.activeTexture(x.TEXTURE0+$r),x.bindTexture(x.TEXTURE_2D,ee),$r}}}function _l(E,P,D,L,$,Q){let ee=Wr(E,P,D,L,$,Q),Oe=Wr(E,P,D,L,$,Q);return{width:E,height:P,texelSizeX:ee.texelSizeX,texelSizeY:ee.texelSizeY,get read(){return ee},set read(Ne){ee=Ne},get write(){return Oe},set write(Ne){Oe=Ne},swap(){const Ne=ee;ee=Oe,Oe=Ne}}}function Ix(E,P,D,L,$,Q,ee){const Oe=Wr(P,D,L,$,Q,ee);return Vd.bind(),x.uniform1i(Vd.uniforms.uTexture,E.attach(0)),$e(Oe),Oe}function Id(E,P,D,L,$,Q,ee){return E.width===P&&E.height===D||(E.read=Ix(E.read,P,D,L,$,Q,ee),E.write=Wr(P,D,L,$,Q,ee),E.width=P,E.height=D,E.texelSizeX=1/P,E.texelSizeY=1/D),E}function zx(){const E=[];T.SHADING&&E.push("SHADING"),lo.setKeywords(E)}zx(),bd();let zd=Date.now(),uo=0;function Bd(){if(!y)return;const E=Bx();Ux()&&bd(),Wx(E),$x(),Hx(E),Xx(null),g.current=requestAnimationFrame(Bd)}function Bx(){const E=Date.now();let P=(E-zd)/1e3;return P=Math.min(P,.016666),zd=E,P}function Ux(){const E=Jt(p.clientWidth),P=Jt(p.clientHeight);return p.width!==E||p.height!==P?(p.width=E,p.height=P,!0):!1}function Wx(E){uo+=E*T.COLOR_UPDATE_SPEED,uo>=1&&(uo=n1(uo,0,1),C.forEach(P=>{P.color=co()}))}function $x(){C.forEach(E=>{E.moved&&(E.moved=!1,Yx(E))})}function Hx(E){x.disable(x.BLEND),xl.bind(),x.uniform2f(xl.uniforms.texelSize,J.texelSizeX,J.texelSizeY),x.uniform1i(xl.uniforms.uVelocity,J.read.attach(0)),$e(gl),Ur.bind(),x.uniform2f(Ur.uniforms.texelSize,J.texelSizeX,J.texelSizeY),x.uniform1i(Ur.uniforms.uVelocity,J.read.attach(0)),x.uniform1i(Ur.uniforms.uCurl,gl.attach(1)),x.uniform1f(Ur.uniforms.curl,T.CURL),x.uniform1f(Ur.uniforms.dt,E),$e(J.write),J.swap(),yl.bind(),x.uniform2f(yl.uniforms.texelSize,J.texelSizeX,J.texelSizeY),x.uniform1i(yl.uniforms.uVelocity,J.read.attach(0)),$e(ml),vl.bind(),x.uniform1i(vl.uniforms.uTexture,An.read.attach(0)),x.uniform1f(vl.uniforms.value,T.PRESSURE),$e(An.write),An.swap(),oo.bind(),x.uniform2f(oo.uniforms.texelSize,J.texelSizeX,J.texelSizeY),x.uniform1i(oo.uniforms.uDivergence,ml.attach(0));for(let D=0;D<T.PRESSURE_ITERATIONS;D++)x.uniform1i(oo.uniforms.uPressure,An.read.attach(1)),$e(An.write),An.swap();ao.bind(),x.uniform2f(ao.uniforms.texelSize,J.texelSizeX,J.texelSizeY),x.uniform1i(ao.uniforms.uPressure,An.read.attach(0)),x.uniform1i(ao.uniforms.uVelocity,J.read.attach(1)),$e(J.write),J.swap(),zt.bind(),x.uniform2f(zt.uniforms.texelSize,J.texelSizeX,J.texelSizeY),k.supportLinearFiltering||x.uniform2f(zt.uniforms.dyeTexelSize,J.texelSizeX,J.texelSizeY);const P=J.read.attach(0);x.uniform1i(zt.uniforms.uVelocity,P),x.uniform1i(zt.uniforms.uSource,P),x.uniform1f(zt.uniforms.dt,E),x.uniform1f(zt.uniforms.dissipation,T.VELOCITY_DISSIPATION),$e(J.write),J.swap(),k.supportLinearFiltering||x.uniform2f(zt.uniforms.dyeTexelSize,rt.texelSizeX,rt.texelSizeY),x.uniform1i(zt.uniforms.uVelocity,J.read.attach(0)),x.uniform1i(zt.uniforms.uSource,rt.read.attach(1)),x.uniform1f(zt.uniforms.dissipation,T.DENSITY_DISSIPATION),$e(rt.write),rt.swap()}function Xx(E){x.blendFunc(x.ONE,x.ONE_MINUS_SRC_ALPHA),x.enable(x.BLEND),Gx(E)}function Gx(E){const P=x.drawingBufferWidth,D=x.drawingBufferHeight;lo.bind(),T.SHADING&&x.uniform2f(lo.uniforms.texelSize,1/P,1/D),x.uniform1i(lo.uniforms.uTexture,rt.read.attach(0)),$e(E)}function Yx(E){const P=E.deltaX*T.SPLAT_FORCE,D=E.deltaY*T.SPLAT_FORCE;Ud(E.texcoordX,E.texcoordY,P,D,E.color)}function Kx(E){const P=co();P.r*=10,P.g*=10,P.b*=10;const D=10*(Math.random()-.5),L=30*(Math.random()-.5);Ud(E.texcoordX,E.texcoordY,D,L,P)}function Ud(E,P,D,L,$){Dn.bind(),x.uniform1i(Dn.uniforms.uTarget,J.read.attach(0)),x.uniform1f(Dn.uniforms.aspectRatio,p.width/p.height),x.uniform2f(Dn.uniforms.point,E,P),x.uniform3f(Dn.uniforms.color,D,L,0),x.uniform1f(Dn.uniforms.radius,Qx(T.SPLAT_RADIUS/100)),$e(J.write),J.swap(),x.uniform1i(Dn.uniforms.uTarget,rt.read.attach(0)),x.uniform3f(Dn.uniforms.color,$.r,$.g,$.b),$e(rt.write),rt.swap()}function Qx(E){const P=p.width/p.height;return P>1&&(E*=P),E}function Wd(E,P,D,L){E.id=P,E.down=!0,E.moved=!1,E.texcoordX=D/p.width,E.texcoordY=1-L/p.height,E.prevTexcoordX=E.texcoordX,E.prevTexcoordY=E.texcoordY,E.deltaX=0,E.deltaY=0,E.color=co()}function wl(E,P,D,L){E.prevTexcoordX=E.texcoordX,E.prevTexcoordY=E.texcoordY,E.texcoordX=P/p.width,E.texcoordY=1-D/p.height,E.deltaX=qx(E.texcoordX-E.prevTexcoordX),E.deltaY=Jx(E.texcoordY-E.prevTexcoordY),E.moved=Math.abs(E.deltaX)>0||Math.abs(E.deltaY)>0,E.color=L}function Zx(E){E.down=!1}function qx(E){const P=p.width/p.height;return P<1&&(E*=P),E}function Jx(E){const P=p.width/p.height;return P>1&&(E/=P),E}function e1(E){let P=E.replace("#","");P.length===3&&(P=P[0]+P[0]+P[1]+P[1]+P[2]+P[2]);const D=parseInt(P.slice(0,2),16)/255,L=parseInt(P.slice(2,4),16)/255,$=parseInt(P.slice(4,6),16)/255;return{r:D*.15,g:L*.15,b:$*.15}}function co(){if(!T.RAINBOW_MODE)return e1(T.COLOR);const E=t1(Math.random(),1,1);return E.r*=.15,E.g*=.15,E.b*=.15,E}function t1(E,P,D){let L=0,$=0,Q=0;const ee=Math.floor(E*6),Oe=E*6-ee,Ne=D*(1-P),pn=D*(1-Oe*P),$r=D*(1-(1-Oe)*P);switch(ee%6){case 0:L=D,$=$r,Q=Ne;break;case 1:L=pn,$=D,Q=Ne;break;case 2:L=Ne,$=D,Q=$r;break;case 3:L=Ne,$=pn,Q=D;break;case 4:L=$r,$=Ne,Q=D;break;case 5:L=D,$=Ne,Q=pn;break}return{r:L,g:$,b:Q}}function n1(E,P,D){const L=D-P;return(E-P)%L+P}function $d(E){let P=x.drawingBufferWidth/x.drawingBufferHeight;P<1&&(P=1/P);const D=Math.round(E),L=Math.round(E*P);return x.drawingBufferWidth>x.drawingBufferHeight?{width:L,height:D}:{width:D,height:L}}function Jt(E){const P=window.devicePixelRatio||1;return Math.floor(E*P)}function r1(E){if(E.length===0)return 0;let P=0;for(let D=0;D<E.length;D++)P=(P<<5)-P+E.charCodeAt(D),P|=0;return P}function Hd(E){const P=C[0],D=Jt(E.clientX),L=Jt(E.clientY);Wd(P,-1,D,L),Kx(P)}let Xd=!1;function Gd(E){const P=C[0],D=Jt(E.clientX),L=Jt(E.clientY);if(Xd)wl(P,D,L,P.color);else{const $=co();wl(P,D,L,$),Xd=!0}}function Yd(E){const P=E.targetTouches,D=C[0];for(let L=0;L<P.length;L++){const $=Jt(P[L].clientX),Q=Jt(P[L].clientY);Wd(D,P[L].identifier,$,Q)}}function Kd(E){const P=E.targetTouches,D=C[0];for(let L=0;L<P.length;L++){const $=Jt(P[L].clientX),Q=Jt(P[L].clientY);wl(D,$,Q,D.color)}}function Qd(E){const P=E.changedTouches,D=C[0];for(let L=0;L<P.length;L++)Zx(D)}return window.addEventListener("mousedown",Hd),window.addEventListener("mousemove",Gd),window.addEventListener("touchstart",Yd),window.addEventListener("touchmove",Kd,!1),window.addEventListener("touchend",Qd),Bd(),()=>{y=!1,g.current&&(cancelAnimationFrame(g.current),g.current=null),window.removeEventListener("mousedown",Hd),window.removeEventListener("mousemove",Gd),window.removeEventListener("touchstart",Yd),window.removeEventListener("touchmove",Kd),window.removeEventListener("touchend",Qd)}})();
  if (typeof cleanup === "function") window.addEventListener("pagehide", cleanup, { once: true });
})();
