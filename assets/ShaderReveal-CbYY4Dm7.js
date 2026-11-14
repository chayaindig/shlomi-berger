import{r as v,j as Ae}from"./index-B9ku2ZRZ.js";import{T as Le,V as n,C as b,L as D,W as Ie,a as Ve,S as C,b as k,R as M,M as F,P as E,H as Be,F as Oe,c as He,d as Ne,A as Xe}from"./three.module-w-bv2ayr.js";const je=({frontImage:A,backImage:L,mouseForce:I=50,cursorSize:T=250,resolution:V=.5,isViscous:B=!0,viscous:O=30,iterationsViscous:H=24,iterationsPoisson:N=28,dt:X=.014,BFECC:Y=!0,isBounce:W=!1,autoDemo:j=!0,autoSpeed:G=.55,autoIntensity:$=2.2,takeoverDuration:q=.25,autoResumeDelay:J=1200,autoRampDuration:K=.6,revealStrength:Q=.75,revealSoftness:Z=1,style:ce,className:ue=""})=>{const P=v.useRef(null),h=v.useRef(null),U=v.useRef(null),z=v.useRef(null),x=v.useRef(null),R=v.useRef(null),ee=v.useRef(!0),g=v.useRef(null),w=v.useRef(null);return v.useEffect(()=>{const f=P.current;if(!f)return;let te=!1;class le{constructor(){this.width=0,this.height=0,this.aspect=1,this.pixelRatio=1,this.container=null,this.renderer=null,this.clock=null,this.time=0,this.delta=0}init(e){this.container=e,this.pixelRatio=Math.min(window.devicePixelRatio||1,2),this.resize(),this.renderer=new Ie({antialias:!0,alpha:!0}),this.renderer.autoClear=!0,this.renderer.setClearColor(0,0),this.renderer.setPixelRatio(this.pixelRatio),this.renderer.setSize(this.width,this.height);const t=this.renderer.domElement;t.style.width="100%",t.style.height="100%",t.style.display="block",t.style.borderRadius="inherit",this.clock=new Ve,this.clock.start()}resize(){if(!this.container)return;const e=this.container.getBoundingClientRect();this.width=Math.max(1,Math.floor(e.width)),this.height=Math.max(1,Math.floor(e.height)),this.aspect=this.width/this.height,this.renderer&&this.renderer.setSize(this.width,this.height,!1)}update(){this.clock&&(this.delta=this.clock.getDelta(),this.time+=this.delta)}}const o=new le;class he{constructor(){this.coords=new n(0,0),this.coords_old=new n(0,0),this.diff=new n(0,0),this.container=null,this.docTarget=null,this.listenerTarget=null,this.isHoverInside=!1,this.hasUserControl=!1,this.isAutoActive=!1,this.autoIntensity=2,this.takeoverActive=!1,this.takeoverStartTime=0,this.takeoverDuration=.25,this.takeoverFrom=new n,this.takeoverTo=new n,this.onInteract=null,this._onMouseMove=this.onDocumentMouseMove.bind(this),this._onTouchStart=this.onDocumentTouchStart.bind(this),this._onTouchMove=this.onDocumentTouchMove.bind(this),this._onTouchEnd=this.onTouchEnd.bind(this),this._onDocumentLeave=this.onDocumentLeave.bind(this)}init(e){var i,s;this.container=e,this.docTarget=e.ownerDocument||null;const t=((i=this.docTarget)==null?void 0:i.defaultView)||(typeof window<"u"?window:null);t&&(this.listenerTarget=t,this.listenerTarget.addEventListener("mousemove",this._onMouseMove),this.listenerTarget.addEventListener("touchstart",this._onTouchStart,{passive:!0}),this.listenerTarget.addEventListener("touchmove",this._onTouchMove,{passive:!0}),this.listenerTarget.addEventListener("touchend",this._onTouchEnd),(s=this.docTarget)==null||s.addEventListener("mouseleave",this._onDocumentLeave))}dispose(){this.listenerTarget&&(this.listenerTarget.removeEventListener("mousemove",this._onMouseMove),this.listenerTarget.removeEventListener("touchstart",this._onTouchStart),this.listenerTarget.removeEventListener("touchmove",this._onTouchMove),this.listenerTarget.removeEventListener("touchend",this._onTouchEnd)),this.docTarget&&this.docTarget.removeEventListener("mouseleave",this._onDocumentLeave),this.listenerTarget=null,this.docTarget=null,this.container=null}isPointInside(e,t){if(!this.container)return!1;const i=this.container.getBoundingClientRect();return i.width===0||i.height===0?!1:e>=i.left&&e<=i.right&&t>=i.top&&t<=i.bottom}updateHoverState(e,t){return this.isHoverInside=this.isPointInside(e,t),this.isHoverInside}setCoordsFromClient(e,t){if(!this.container)return;const i=this.container.getBoundingClientRect();if(i.width===0||i.height===0)return;const s=(e-i.left)/i.width,r=(t-i.top)/i.height;this.coords.set(s*2-1,-(r*2-1))}setNormalized(e,t){this.coords.set(e,t)}onDocumentMouseMove(e){if(this.updateHoverState(e.clientX,e.clientY)){if(this.onInteract&&this.onInteract(),this.isAutoActive&&!this.hasUserControl&&!this.takeoverActive){if(!this.container)return;const t=this.container.getBoundingClientRect(),i=(e.clientX-t.left)/t.width,s=(e.clientY-t.top)/t.height;this.takeoverFrom.copy(this.coords),this.takeoverTo.set(i*2-1,-(s*2-1)),this.takeoverStartTime=performance.now(),this.takeoverActive=!0,this.hasUserControl=!0,this.isAutoActive=!1;return}this.setCoordsFromClient(e.clientX,e.clientY),this.hasUserControl=!0}}onDocumentTouchStart(e){if(e.touches.length!==1)return;const t=e.touches[0];this.updateHoverState(t.clientX,t.clientY)&&(this.onInteract&&this.onInteract(),this.setCoordsFromClient(t.clientX,t.clientY),this.hasUserControl=!0)}onDocumentTouchMove(e){if(e.touches.length!==1)return;const t=e.touches[0];this.updateHoverState(t.clientX,t.clientY)&&(this.onInteract&&this.onInteract(),this.setCoordsFromClient(t.clientX,t.clientY))}onTouchEnd(){this.isHoverInside=!1}onDocumentLeave(){this.isHoverInside=!1}update(){if(this.takeoverActive){const e=(performance.now()-this.takeoverStartTime)/(this.takeoverDuration*1e3);if(e>=1)this.takeoverActive=!1,this.coords.copy(this.takeoverTo),this.coords_old.copy(this.coords),this.diff.set(0,0);else{const t=e*e*(3-2*e);this.coords.copy(this.takeoverFrom).lerp(this.takeoverTo,t)}}this.diff.subVectors(this.coords,this.coords_old),this.coords_old.copy(this.coords)}}const u=new he;class ve{constructor(e,t,i){this.active=!0,this.current=new n,this.target=new n,this.lastTime=performance.now(),this.activationTime=performance.now(),this.margin=.2,this._tmpDir=new n,this.mouse=e,this.manager=t,this.enabled=i.enabled,this.speed=i.speed,this.resumeDelay=i.resumeDelay||3e3,this.rampDurationMs=(i.rampDuration||0)*1e3;const s=Math.random;this.current.set((s()*2-1)*(1-this.margin),(s()*2-1)*(1-this.margin)),this.pickNewTarget();const r=this._tmpDir.subVectors(this.target,this.current).normalize(),c=.05;this.mouse.coords_old.set(this.current.x-r.x*c,this.current.y-r.y*c),this.mouse.setNormalized(this.current.x,this.current.y),this.mouse.isAutoActive=!0}pickNewTarget(){const e=Math.random;this.target.set((e()*2-1)*(1-this.margin),(e()*2-1)*(1-this.margin))}forceStop(){this.active=!1,this.mouse.isAutoActive=!1}update(){if(!this.enabled)return;const e=performance.now();if(e-this.manager.lastUserInteraction<this.resumeDelay){this.active&&this.forceStop();return}if(this.mouse.isHoverInside){this.active&&this.forceStop();return}this.active||(this.active=!0,this.current.copy(this.mouse.coords),this.lastTime=e,this.activationTime=e,this.pickNewTarget()),this.mouse.isAutoActive=!0;let i=(e-this.lastTime)/1e3;this.lastTime=e,i>.2&&(i=.016);const s=this._tmpDir.subVectors(this.target,this.current),r=s.length();if(r<.01){this.pickNewTarget();return}s.normalize();let c=1;if(this.rampDurationMs>0){const d=Math.min(1,(e-this.activationTime)/this.rampDurationMs);c=d*d*(3-2*d)}const l=this.speed*i,y=Math.min(l*c,r);this.current.addScaledVector(s,y),this.mouse.setNormalized(this.current.x,this.current.y)}}const p=`
      precision highp float;
      attribute vec3 position;
      varying vec2 vUv;
      uniform vec2 boundarySpace;
      void main() {
        vec3 pos = position;
        vec2 scale = 1.0 - boundarySpace * 2.0;
        pos.xy = pos.xy * scale;
        vUv = vec2(0.5) + pos.xy * 0.5;
        gl_Position = vec4(pos, 1.0);
      }
    `,de=`
      precision highp float;
      attribute vec3 position;
      attribute vec2 uv;
      varying vec2 vUv;
      uniform vec2 center;
      uniform vec2 scale;
      uniform vec2 px;
      void main() {
        vec2 pos = position.xy * scale * 2.0 * px + center;
        vUv = uv;
        gl_Position = vec4(pos, 0.0, 1.0);
      }
    `,fe=`
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D velocity;
      uniform float dt;
      uniform bool isBFECC;
      uniform vec2 fboSize;
      uniform vec2 px;

      void main() {
        vec2 ratio = max(fboSize.x, fboSize.y) / fboSize;

        if (!isBFECC) {
          vec2 vel = texture2D(velocity, vUv).xy;
          vec2 uv2 = vUv - vel * dt * ratio;
          vec2 newVel = texture2D(velocity, uv2).xy;
          gl_FragColor = vec4(newVel, 0.0, 0.0);
        } else {
          vec2 spot_new = vUv;
          vec2 vel_old = texture2D(velocity, vUv).xy;
          vec2 spot_old = spot_new - vel_old * dt * ratio;
          vec2 vel_new1 = texture2D(velocity, spot_old).xy;
          vec2 spot_new2 = spot_old + vel_new1 * dt * ratio;
          vec2 error = spot_new2 - spot_new;
          vec2 spot_new3 = spot_new - error / 2.0;
          vec2 vel_2 = texture2D(velocity, spot_new3).xy;
          vec2 spot_old2 = spot_new3 - vel_2 * dt * ratio;
          vec2 newVel2 = texture2D(velocity, spot_old2).xy;
          gl_FragColor = vec4(newVel2, 0.0, 0.0);
        }
      }
    `,pe=`
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D velocity;
      uniform float dt;
      uniform vec2 px;

      void main() {
        float x0 = texture2D(velocity, vUv - vec2(px.x, 0.0)).x;
        float x1 = texture2D(velocity, vUv + vec2(px.x, 0.0)).x;
        float y0 = texture2D(velocity, vUv - vec2(0.0, px.y)).y;
        float y1 = texture2D(velocity, vUv + vec2(0.0, px.y)).y;
        float divergence = (x1 - x0 + y1 - y0) * 0.5;
        gl_FragColor = vec4(divergence / dt);
      }
    `,me=`
      precision highp float;
      varying vec2 vUv;
      uniform vec2 force;
      uniform vec2 center;
      uniform vec2 scale;
      uniform vec2 px;

      void main() {
        vec2 circle = (vUv - 0.5) * 2.0;
        float d = 1.0 - min(length(circle), 1.0);
        d *= d;
        gl_FragColor = vec4(force * d, 0.0, 1.0);
      }
    `,ye=`
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D pressure;
      uniform sampler2D divergence;
      uniform vec2 px;

      void main() {
        float p0 = texture2D(pressure, vUv + vec2(px.x * 2.0, 0.0)).r;
        float p1 = texture2D(pressure, vUv - vec2(px.x * 2.0, 0.0)).r;
        float p2 = texture2D(pressure, vUv + vec2(0.0, px.y * 2.0)).r;
        float p3 = texture2D(pressure, vUv - vec2(0.0, px.y * 2.0)).r;
        float div = texture2D(divergence, vUv).r;
        float newP = (p0 + p1 + p2 + p3) / 4.0 - div;
        gl_FragColor = vec4(newP);
      }
    `,xe=`
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D pressure;
      uniform sampler2D velocity;
      uniform vec2 px;
      uniform float dt;

      void main() {
        float step = 1.0;
        float p0 = texture2D(pressure, vUv + vec2(px.x * step, 0.0)).r;
        float p1 = texture2D(pressure, vUv - vec2(px.x * step, 0.0)).r;
        float p2 = texture2D(pressure, vUv + vec2(0.0, px.y * step)).r;
        float p3 = texture2D(pressure, vUv - vec2(0.0, px.y * step)).r;
        vec2 v = texture2D(velocity, vUv).xy;
        vec2 gradP = vec2(p0 - p1, p2 - p3) * 0.5;
        v = v - gradP * dt;
        gl_FragColor = vec4(v, 0.0, 1.0);
      }
    `,ge=`
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D velocity;
      uniform sampler2D velocity_new;
      uniform float v;
      uniform vec2 px;
      uniform float dt;

      void main() {
        vec2 old = texture2D(velocity, vUv).xy;
        vec2 new0 = texture2D(velocity_new, vUv + vec2(px.x * 2.0, 0.0)).xy;
        vec2 new1 = texture2D(velocity_new, vUv - vec2(px.x * 2.0, 0.0)).xy;
        vec2 new2 = texture2D(velocity_new, vUv + vec2(0.0, px.y * 2.0)).xy;
        vec2 new3 = texture2D(velocity_new, vUv - vec2(0.0, px.y * 2.0)).xy;
        vec2 newv = 4.0 * old + v * dt * (new0 + new1 + new2 + new3);
        newv /= 4.0 * (1.0 + v * dt);
        gl_FragColor = vec4(newv, 0.0, 0.0);
      }
    `,we=`
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D tDye;
      uniform sampler2D tVelocity;
      uniform float dt;
      uniform vec2 fboSize;
      uniform float dissipation;

      void main() {
        vec2 ratio = max(fboSize.x, fboSize.y) / fboSize;
        vec2 vel = texture2D(tVelocity, vUv).xy;
        vec2 coord = vUv - vel * dt * ratio;
        vec4 dye = texture2D(tDye, coord);
        dye *= dissipation;
        gl_FragColor = dye;
      }
    `,_e=`
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D tDye;
      uniform vec2 center;
      uniform float radius;
      uniform float strength;

      void main() {
        vec4 base = texture2D(tDye, vUv);

        float dist = length(vUv - center);
        float r = radius;
        float falloff = exp(- (dist * dist) / (r * r + 1e-6));

        float added = strength * falloff;
        float v = clamp(base.r + added, 0.0, 1.0);

        gl_FragColor = vec4(v, v, v, 1.0);
      }
    `,Se=`
      precision highp float;
      varying vec2 vUv;

      uniform sampler2D frontTex;
      uniform sampler2D backTex;
      uniform sampler2D tDye;

      uniform float revealStrength;
      uniform float revealSoftness;

      uniform vec2 frontTexResolution;
      uniform vec2 backTexResolution;
      uniform vec2 canvasResolution;

      vec2 getCoverUv(vec2 uv, vec2 texRes, vec2 canvasRes) {
        vec2 ratio = vec2(
          min((canvasRes.x / canvasRes.y) / (texRes.x / texRes.y), 1.0),
          min((canvasRes.y / canvasRes.x) / (texRes.y / texRes.x), 1.0)
        );

        vec2 newUv = vec2(
          uv.x * ratio.x + (1.0 - ratio.x) * 0.5,
          uv.y * ratio.y + (1.0 - ratio.y) * 0.5
        );

        return newUv;
      }

      void main() {
        float dye = texture2D(tDye, vUv).r;

        float m = dye * revealStrength;
        float mask = smoothstep(0.0, revealSoftness, m);
        mask = clamp(mask, 0.0, 1.0);

        vec2 frontUv = getCoverUv(vUv, frontTexResolution, canvasResolution);
        vec2 backUv = getCoverUv(vUv, backTexResolution, canvasResolution);

        vec4 front = texture2D(frontTex, frontUv);
        vec4 back = texture2D(backTex, backUv);

        vec4 color = mix(front, back, mask);
        float alpha = max(color.a, max(front.a, back.a));

        gl_FragColor = vec4(color.rgb, alpha);
      }
    `;class m{constructor(e){var t;this.scene=null,this.camera=null,this.material=null,this.geometry=null,this.plane=null,this.props=e||{},this.uniforms=(t=this.props.material)==null?void 0:t.uniforms}init(...e){this.scene=new C,this.camera=new k,this.uniforms&&(this.material=new M(this.props.material),this.geometry=new E(2,2),this.plane=new F(this.geometry,this.material),this.scene.add(this.plane))}update(...e){!o.renderer||!this.scene||!this.camera||(o.renderer.setRenderTarget(this.props.output||null),o.renderer.render(this.scene,this.camera),o.renderer.setRenderTarget(null))}}class be extends m{constructor(e){super({material:{vertexShader:p,fragmentShader:fe,uniforms:{boundarySpace:{value:e.cellScale},px:{value:e.cellScale},fboSize:{value:e.fboSize},velocity:{value:e.src.texture},dt:{value:e.dt},isBFECC:{value:!0}}},output:e.dst}),this.uniforms=this.props.material.uniforms,this.init()}update(e){if(!e){super.update();return}this.uniforms&&(typeof e.dt=="number"&&(this.uniforms.dt.value=e.dt),typeof e.BFECC=="boolean"&&(this.uniforms.isBFECC.value=e.BFECC),super.update())}}class De extends m{constructor(e){super({output:e.dst}),this.init(e)}init(e){this.scene=new C,this.camera=new k;const t=new E(1,1),i=new M({vertexShader:de,fragmentShader:me,blending:Xe,depthWrite:!1,uniforms:{px:{value:e.cellScale},force:{value:new n(0,0)},center:{value:new n(0,0)},scale:{value:new n(e.cursor_size,e.cursor_size)}}});this.mouseMesh=new F(t,i),this.scene.add(this.mouseMesh)}update(e){if(!e)return;const t=this.mouseMesh.material.uniforms,i=e.mouse_force||20,s=e.cellScale||new n,r=e.cursor_size||100,c=u.diff.x/2*i,l=u.diff.y/2*i,y=r*s.x,d=r*s.y,_=Math.min(Math.max(u.coords.x,-1+y+s.x*2),1-y-s.x*2),S=Math.min(Math.max(u.coords.y,-1+d+s.y*2),1-d-s.y*2);t.force.value.set(c,l),t.center.value.set(_,S),t.scale.value.set(r,r),super.update()}}class Te extends m{constructor(e){super({material:{vertexShader:p,fragmentShader:ge,uniforms:{boundarySpace:{value:e.boundarySpace},velocity:{value:e.src.texture},velocity_new:{value:e.dst_.texture},v:{value:e.viscous},px:{value:e.cellScale},dt:{value:e.dt}}},output:e.dst,output0:e.dst_,output1:e.dst}),this.init()}update(e){if(!e)return null;if(!this.uniforms)return;const t=e.viscous??30,i=e.iterations??32,s=e.dt??.014;this.uniforms.v.value=t;let r=null,c=null;for(let l=0;l<i;l++)l%2===0?(r=this.props.output0,c=this.props.output1):(r=this.props.output1,c=this.props.output0),r&&(this.uniforms.velocity_new.value=r.texture,this.props.output=c,this.uniforms.dt.value=s,super.update());return c}}class Ue extends m{constructor(e){super({material:{vertexShader:p,fragmentShader:pe,uniforms:{boundarySpace:{value:e.boundarySpace},velocity:{value:e.src.texture},px:{value:e.cellScale},dt:{value:e.dt}}},output:e.dst}),this.init()}update(e){!e||!e.vel||(this.uniforms&&(this.uniforms.velocity.value=e.vel.texture),super.update())}}class ze extends m{constructor(e){super({material:{vertexShader:p,fragmentShader:ye,uniforms:{boundarySpace:{value:e.boundarySpace},pressure:{value:e.dst_.texture},divergence:{value:e.src.texture},px:{value:e.cellScale}}},output:e.dst,output0:e.dst_,output1:e.dst}),this.init()}update(e){if(!e)return null;let t,i;const s=e.iterations??32;t=this.props.output0,i=this.props.output1;for(let r=0;r<s;r++)r%2===0?(t=this.props.output0,i=this.props.output1):(t=this.props.output1,i=this.props.output0),t&&(this.uniforms&&(this.uniforms.pressure.value=t.texture),this.props.output=i,super.update());return i||null}}class Re extends m{constructor(e){super({material:{vertexShader:p,fragmentShader:xe,uniforms:{boundarySpace:{value:e.boundarySpace},pressure:{value:e.src_p.texture},velocity:{value:e.src_v.texture},px:{value:e.cellScale},dt:{value:e.dt}}},output:e.dst}),this.init()}update(e){!e||!e.vel||!e.pressure||(this.uniforms&&(this.uniforms.velocity.value=e.vel.texture,this.uniforms.pressure.value=e.pressure.texture),super.update())}}class Ce extends m{constructor(e){super({material:{vertexShader:p,fragmentShader:we,uniforms:{boundarySpace:{value:e.cellScale},tDye:{value:e.src.texture},tVelocity:{value:e.velocity.texture},dt:{value:e.dt},fboSize:{value:e.fboSize},dissipation:{value:e.dissipation}}},output:e.dst}),this.init()}update(e){!e||!e.src||!e.velocity||this.uniforms&&(this.uniforms.tDye.value=e.src.texture,this.uniforms.tVelocity.value=e.velocity.texture,this.uniforms.dt.value=e.dt,this.uniforms.dissipation.value=e.dissipation,super.update())}}class ke extends m{constructor(e){super({material:{vertexShader:p,fragmentShader:_e,uniforms:{boundarySpace:{value:e.cellScale},tDye:{value:e.src.texture},center:{value:new n(.5,.5)},radius:{value:e.radius},strength:{value:e.strength}}},output:e.dst}),this.init()}update(e){if(!e||!e.src||!this.uniforms)return;const t=this.uniforms;t.tDye.value=e.src.texture;const i=new n((u.coords.x+1)*.5,(u.coords.y+1)*.5);t.center.value.copy(i),t.radius.value=e.radius,t.strength.value=e.strength,super.update()}}class Me{constructor(e){this.fbos={vel_0:null,vel_1:null,vel_viscous0:null,vel_viscous1:null,div:null,pressure_0:null,pressure_1:null,dye_0:null,dye_1:null},this.fboSize=new n,this.cellScale=new n,this.boundarySpace=new n,this.dyeDissipation=.985,this.options={iterations_poisson:N,iterations_viscous:H,mouse_force:I,resolution:V,cursor_size:T,viscous:O,isBounce:W,dt:X,isViscous:B,BFECC:Y,...e},this.init()}getFloatType(){return/(iPad|iPhone|iPod)/i.test(navigator.userAgent)?Be:Oe}calcSize(){const e=Math.max(1,Math.round(this.options.resolution*o.width)),t=Math.max(1,Math.round(this.options.resolution*o.height));this.cellScale.set(1/e,1/t),this.fboSize.set(e,t)}createAllFBO(){const t={type:this.getFloatType(),depthBuffer:!1,stencilBuffer:!1,minFilter:D,magFilter:D,wrapS:b,wrapT:b};for(const i of Object.keys(this.fbos))this.fbos[i]=new He(this.fboSize.x,this.fboSize.y,t)}createShaderPasses(){this.advection=new be({cellScale:this.cellScale,fboSize:this.fboSize,dt:this.options.dt,src:this.fbos.vel_0,dst:this.fbos.vel_1}),this.externalForce=new De({cellScale:this.cellScale,cursor_size:this.options.cursor_size,dst:this.fbos.vel_1}),this.viscousPass=new Te({cellScale:this.cellScale,boundarySpace:this.boundarySpace,viscous:this.options.viscous,src:this.fbos.vel_1,dst:this.fbos.vel_viscous1,dst_:this.fbos.vel_viscous0,dt:this.options.dt}),this.divergence=new Ue({cellScale:this.cellScale,boundarySpace:this.boundarySpace,src:this.fbos.vel_viscous0,dst:this.fbos.div,dt:this.options.dt}),this.poisson=new ze({cellScale:this.cellScale,boundarySpace:this.boundarySpace,src:this.fbos.div,dst:this.fbos.pressure_1,dst_:this.fbos.pressure_0}),this.pressure=new Re({cellScale:this.cellScale,boundarySpace:this.boundarySpace,src_p:this.fbos.pressure_0,src_v:this.fbos.vel_viscous0,dst:this.fbos.vel_0,dt:this.options.dt}),this.dyeAdvection=new Ce({cellScale:this.cellScale,src:this.fbos.dye_0,velocity:this.fbos.vel_0,dt:this.options.dt,fboSize:this.fboSize,dissipation:this.dyeDissipation,dst:this.fbos.dye_1}),this.dyeSplat=new ke({cellScale:this.cellScale,src:this.fbos.dye_1,radius:.25,strength:1,dst:this.fbos.dye_0})}init(){this.calcSize(),this.createAllFBO(),this.createShaderPasses()}resize(){this.calcSize();for(const e of Object.keys(this.fbos))this.fbos[e].setSize(this.fboSize.x,this.fboSize.y)}update(){this.options.isBounce?this.boundarySpace.set(0,0):this.boundarySpace.copy(this.cellScale),this.advection.update({dt:this.options.dt,BFECC:this.options.BFECC}),this.externalForce.update({mouse_force:this.options.mouse_force,cellScale:this.cellScale,cursor_size:this.options.cursor_size});let e=this.fbos.vel_1;this.options.isViscous&&(e=this.viscousPass.update({viscous:this.options.viscous,iterations:this.options.iterations_viscous,dt:this.options.dt})),this.divergence.update({vel:e||this.fbos.vel_1});const t=this.poisson.update({iterations:this.options.iterations_poisson});this.pressure.update({vel:e||this.fbos.vel_1,pressure:t||this.fbos.pressure_0}),this.dyeAdvection.update({src:this.fbos.dye_0,velocity:this.fbos.vel_0,dt:this.options.dt,dissipation:this.dyeDissipation});const i=u.diff.length(),s=.08,r=.3,c=s*(T/120),l=r*Ne.clamp(i*1.8,.4,3);this.dyeSplat.update({src:this.fbos.dye_1,radius:c,strength:l,cellScale:this.cellScale})}}class Fe{constructor(e,t){var s,r,c,l,y,d,_,S,re,oe,ne,ae;this.simulation=new Me,this.scene=new C,this.camera=new k,this.uniforms={frontTex:{value:e},backTex:{value:t},tDye:{value:this.simulation.fbos.dye_0.texture},boundarySpace:{value:new n},revealStrength:{value:Q},revealSoftness:{value:Z},frontTexResolution:{value:new n(((s=e.image)==null?void 0:s.width)||((c=(r=e.source)==null?void 0:r.data)==null?void 0:c.width)||1,((l=e.image)==null?void 0:l.height)||((d=(y=e.source)==null?void 0:y.data)==null?void 0:d.height)||1)},backTexResolution:{value:new n(((_=t.image)==null?void 0:_.width)||((re=(S=t.source)==null?void 0:S.data)==null?void 0:re.width)||1,((oe=t.image)==null?void 0:oe.height)||((ae=(ne=t.source)==null?void 0:ne.data)==null?void 0:ae.height)||1)},canvasResolution:{value:new n(o.width,o.height)}};const i=new M({vertexShader:p,fragmentShader:Se,transparent:!0,depthWrite:!1,uniforms:this.uniforms});this.mesh=new F(new E(2,2),i),this.scene.add(this.mesh)}resize(){this.simulation.resize(),this.uniforms.canvasResolution.value.set(o.width,o.height)}update(){this.simulation.update()}render(){o.renderer&&(o.renderer.setRenderTarget(null),o.renderer.render(this.scene,this.camera))}}class Ee{constructor(e){this.lastUserInteraction=performance.now()-1e4,this.running=!1,this._loop=this.loop.bind(this),this._resize=this.resize.bind(this),this.props=e,o.init(e.$wrapper),u.init(e.$wrapper),u.autoIntensity=$,u.takeoverDuration=q,u.onInteract=()=>{this.lastUserInteraction=performance.now(),this.autoDriver&&this.autoDriver.forceStop()},this.init(),window.addEventListener("resize",this._resize),this._onVisibility=()=>{document.hidden?this.pause():ee.current&&this.start()},document.addEventListener("visibilitychange",this._onVisibility)}init(){if(o.renderer){if(this.props.$wrapper.prepend(o.renderer.domElement),this.output=new Fe(this.props.frontTex,this.props.backTex),this.autoDriver=new ve(u,this,{enabled:j,speed:G,resumeDelay:J,rampDuration:K}),this.autoDriver&&this.autoDriver.enabled)for(let e=0;e<3;e++)this.autoDriver.update(),u.update(),this.output.update();this.start()}}resize(){o.resize(),this.output.resize()}render(){this.autoDriver&&this.autoDriver.update(),u.update(),o.update(),this.output.update(),this.output.render()}loop(){this.running&&(this.render(),x.current=requestAnimationFrame(this._loop))}start(){this.running||(this.running=!0,this._loop())}pause(){this.running=!1,x.current!=null&&(cancelAnimationFrame(x.current),x.current=null)}dispose(){try{if(window.removeEventListener("resize",this._resize),this._onVisibility&&document.removeEventListener("visibilitychange",this._onVisibility),u.dispose(),o.renderer){const e=o.renderer.domElement;e&&e.parentNode&&e.parentNode.removeChild(e),o.renderer.dispose()}this.output.mesh.geometry.dispose(),this.output.mesh.material.dispose()}catch{}}}f.style.position=f.style.position||"relative",f.style.overflow=f.style.overflow||"hidden";const ie=new Le;ie.crossOrigin="anonymous";const se=a=>new Promise((e,t)=>{ie.load(a,i=>{i.wrapS=b,i.wrapT=b,i.minFilter=D,i.magFilter=D,e(i)},void 0,i=>t(i))});return(async()=>{try{const[a,e]=await Promise.all([se(A),se(L)]);if(te){a.dispose(),e.dispose();return}g.current=a,w.current=e;const t=new Ee({$wrapper:f,frontTex:a,backTex:e});t.start(),h.current=t;const i=new IntersectionObserver(r=>{const c=r[0],l=c.isIntersecting&&c.intersectionRatio>0;ee.current=l,h.current&&(l&&!document.hidden?h.current.start():h.current.pause())},{threshold:[0,.01,.1]});i.observe(f),z.current=i;const s=new ResizeObserver(()=>{h.current&&(R.current&&cancelAnimationFrame(R.current),R.current=requestAnimationFrame(()=>{h.current&&h.current.resize()}))});s.observe(f),U.current=s}catch{}})(),()=>{if(te=!0,x.current!=null&&cancelAnimationFrame(x.current),U.current)try{U.current.disconnect()}catch{}if(z.current)try{z.current.disconnect()}catch{}h.current&&h.current.dispose(),h.current=null,g.current&&(g.current.dispose(),g.current=null),w.current&&(w.current.dispose(),w.current=null)}},[A,L,I,T,V,B,O,H,N,X,Y,W,j,G,$,q,J,K,Q,Z]),Ae.jsx("div",{ref:P,className:`relative w-full h-full overflow-hidden ${ue||""}`,style:ce})};export{je as default};
