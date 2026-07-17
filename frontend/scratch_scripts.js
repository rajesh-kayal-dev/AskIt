
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-2M6V79H761');



      (function(){
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        /* WebGL / Canvas petal field with graceful fallback */
        const canvas = document.getElementById('petalCanvas');
        const ctx = canvas.getContext('2d');
        let W, H, petals = [];

        function resize(){
          W = canvas.width = innerWidth * devicePixelRatio;
          H = canvas.height = innerHeight * devicePixelRatio;
        }

        resize();
        addEventListener('resize', resize);

        for(let i=0; i<70; i++){
          petals.push({
            x: Math.random(),
            y: Math.random(),
            r: 6 + Math.random() * 14,
            sp: 0.2 + Math.random() * 0.8,
            drift: Math.random() * Math.PI * 2,
            a: 0.3 + Math.random() * 0.5
          });
        }

        let petalDensity = 0, windAmt = 0;

        function drawPetals(t){
          ctx.clearRect(0, 0, W, H);
          for(const p of petals){
            const px = (p.x + Math.sin(t*0.0003*p.sp + p.drift)*0.04*(0.5+windAmt*2)) * W;
            const py = (((p.y + t*0.00004*p.sp) % 1)) * H;
            const size = p.r * devicePixelRatio * (0.7 + petalDensity*0.8);

            ctx.globalAlpha = p.a * petalDensity;
            const g = ctx.createRadialGradient(px, py, 0, px, py, size);
            g.addColorStop(0, 'rgba(247,196,218,0.9)');
            g.addColorStop(1, 'rgba(194,106,151,0)');

            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.ellipse(px, py, size, size*0.6, p.drift + t*0.0002, 0, Math.PI*2);
            ctx.fill();
          }
          ctx.globalAlpha = 1;
          requestAnimationFrame(drawPetals);
        }

        if(!reduce) requestAnimationFrame(drawPetals);

        /* Deterministic beat windows */
        const beats = [
          {el: document.querySelector('[data-beat="0"]'), s: 0.00, e: 0.10},
          {el: document.querySelector('[data-beat="1"]'), s: 0.11, e: 0.22},
          {el: document.querySelector('[data-beat="2"]'), s: 0.23, e: 0.33},
          {el: document.querySelector('[data-beat="3"]'), s: 0.34, e: 0.47},
          {el: document.querySelector('[data-beat="4"]'), s: 0.48, e: 0.64},
          {el: document.querySelector('[data-beat="5"]'), s: 0.65, e: 0.81},
          {el: document.querySelector('[data-beat="6"]'), s: 0.82, e: 1.00}
        ];

        function beatOpacity(p, s, e){
          const mid = (s+e)/2, span = (e-s);
          const fade = span*0.30;
          if(p < s || p > e) return 0;
          if(p < s+fade) return (p-s)/fade;
          if(p > e-fade) return (e-p)/fade;
          return 1;
        }

        /* Timeline dots */
        const dotRow = document.getElementById('dotRow');
        beats.forEach((b,i)=>{
          const d = document.createElement('span');
          d.style.cssText = 'width:0.5rem;height:0.5rem;border-radius:50%;background:rgba(255,255,255,0.25);transition:background .3s,transform .3s;cursor:pointer;';
          d.addEventListener('click',()=>{
            const sec = document.getElementById('cinematic');
            const top = sec.offsetTop + ((b.s+b.e)/2) * (sec.offsetHeight - innerHeight);
            scrollTo({top, behavior:'smooth'});
          });
          dotRow.appendChild(d);
          b.dot = d;
        });

        /* Velocity-aware render progress */
        const section = document.getElementById('cinematic');
        const bgLayer = document.getElementById('bgLayer');
        const midLayer = document.getElementById('midLayer');
        const bouquet = document.getElementById('bouquet');
        const grade = document.getElementById('gradeWash');
        const lbTop = document.getElementById('lbTop');
        const lbBot = document.getElementById('lbBot');
        const tlFill = document.getElementById('timelineFill');
        const timeLabel = document.getElementById('timeLabel');
        const DUR = 12.75;

        let rawP = 0, renderP = 0;

        function raf(){
          renderP += (rawP - renderP) * 0.10;
          const p = renderP;

          const scale = 1 + p*0.55 - Math.max(0, p-0.48)*0.35;
          const roll = p*4 - Math.max(0, p-0.65)*3;
          const fwd = p*-40;

          bouquet.style.transform = `scale(${scale}) rotate(${roll}deg) translateY(${fwd}px)`;
          bgLayer.style.transform = `scale(${1.1+p*0.15}) translateY(${p*-60}px)`;
          midLayer.style.transform = `translateY(${p*30}px)`;

          petalDensity = p < 0.48 ? p*0.3 : Math.min(1, (p-0.40)*2.2);
          windAmt = Math.max(0, (p-0.60))*1.4;

          grade.style.opacity = 0.4 + Math.sin(p*Math.PI)*0.5;

          let lb = 0;
          if(p < 0.06) lb = (p/0.06)*7;
          else if(p > 0.92) lb = 7 * (1-(p-0.92)/0.08);
          else lb = 7;

          lbTop.style.height = lb+'vh';
          lbBot.style.height = lb+'vh';

          tlFill.style.width = (p*100)+'%';
          timeLabel.textContent = (p*DUR).toFixed(2)+'s';

          beats.forEach(b=>{
            const o = beatOpacity(p, b.s, b.e);
            b.el.style.opacity = o.toFixed(3);
            b.el.style.transform = `translateY(${(1-o)*18}px)`;
            const active = p >= b.s && p <= b.e;
            b.dot.style.background = active ? '#f5b8d0' : 'rgba(255,255,255,0.25)';
            b.dot.style.transform = active ? 'scale(1.4)' : 'scale(1)';
          });

          requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        function updateScroll(){
          const rect = section.getBoundingClientRect();
          const travel = section.offsetHeight - innerHeight;
          const scrolled = Math.min(Math.max(-rect.top, 0), travel);
          rawP = travel > 0 ? scrolled/travel : 0;
          if(reduce) renderP = rawP;
        }

        addEventListener('scroll', updateScroll, {passive: true});
        updateScroll();

        /* GSAP masked staggered reveals */
        if(window.gsap && window.ScrollTrigger && !reduce){
          gsap.registerPlugin(ScrollTrigger);

          document.querySelectorAll('.reveal-line').forEach(line=>{
            const inner = line.firstElementChild;
            gsap.set(inner, {yPercent: 120});
            gsap.to(inner, {
              yPercent: 0,
              duration: 0.9,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: line,
                start: 'top 85%'
              }
            });
          });

          gsap.utils.toArray('.fade-card').forEach((c, i)=>{
            gsap.from(c, {
              opacity: 0,
              y: 40,
              duration: 0.7,
              ease: 'power2.out',
              delay: i*0.1,
              scrollTrigger: {
                trigger: c,
                start: 'top 88%'
              }
            });
          });

          gsap.to('#craftBg', {
            yPercent: 20,
            ease: 'none',
            scrollTrigger: {
              trigger: '#craft',
              start: 'top bottom',
              end: 'bottom top',
              scrub: true
            }
          });
        }
      })();
    


      (function () {
        function playVideo(video) {
          var promise = video.play();
          if (promise && typeof promise.catch === "function") {
            promise.catch(function () {});
          }
        }

        function setupVideo(video) {
          if (video.__auraVideoReady === true) return;
          video.__auraVideoReady = true;
          video.removeAttribute("data-aura-video-ready");
          video.removeAttribute("data-aura-video-played");
          video.muted = true;
          video.playsInline = true;

          var preset = video.dataset.auraVideoPreset || "loop-in-view";
          if (preset === "hover") {
            video.addEventListener("mouseenter", function () {
              playVideo(video);
            });
            video.addEventListener("mouseleave", function () {
              video.pause();
              video.currentTime = 0;
            });
            return;
          }

          if (!("IntersectionObserver" in window)) {
            playVideo(video);
            return;
          }

          var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
              if (entry.isIntersecting) {
                if (preset === "play-once" && video.__auraVideoPlayed === true) {
                  return;
                }
                playVideo(video);
              } else {
                video.pause();
              }
            });
          }, { threshold: 0.35 });

          if (preset === "play-once") {
            video.addEventListener("ended", function () {
              video.__auraVideoPlayed = true;
            }, { once: true });
          }

          observer.observe(video);
        }

        function setupVideos() {
          document
            .querySelectorAll("video[data-aura-video-preset]")
            .forEach(setupVideo);
        }

        if (document.readyState === "loading") {
          document.addEventListener("DOMContentLoaded", setupVideos);
        } else {
          setupVideos();
        }
      })();
    


      { "imports": { "three": "https://unpkg.com/three@0.160.0/build/three.module.js", "three/addons/": "https://unpkg.com/three@0.160.0/examples/jsm/" } }
    


      import * as THREE from 'three';
      import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
      import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
      import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
      const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
      const isMobile = matchMedia('(max-width: 768px)').matches;
      const canvas = document.getElementById('particlesBg');
      if (canvas) {
      const COUNT = isMobile ? 4000 : 12000;
      const rand = Math.random, gauss = () => (rand() + rand() + rand() - 1.5) * 0.8;
      const posArr = new Float32Array(COUNT * 3), ringId = new Float32Array(COUNT), seeds = new Float32Array(COUNT), scales = new Float32Array(COUNT);
      const rings = [{ r: 6.4, tx: -0.5, tz: 0 }, { r: 5.3, tx: 0.9, tz: 0.7 }, { r: 4.2, tx: 0.25, tz: -1.1 }];
      for (let i = 0; i < COUNT; i++) {
      const i3 = i * 3, pick = rand();
      seeds[i] = rand(); scales[i] = seeds[i] > 0.985 ? 2.4 : 0.5 + rand() * 0.9;
      if (pick < 0.12) { ringId[i] = 4; let x = gauss(), y = gauss(), z = gauss(); const n = Math.hypot(x, y, z) || 1, r = 7.5 + rand() * 5.5; posArr[i3] = x / n * r; posArr[i3 + 1] = y / n * r; posArr[i3 + 2] = z / n * r; continue; }
      if (pick < 0.24) { ringId[i] = 3; let x = gauss(), y = gauss(), z = gauss(); const n = Math.hypot(x, y, z) || 1, r = 1.7 * Math.cbrt(rand()); posArr[i3] = x / n * r; posArr[i3 + 1] = y / n * r; posArr[i3 + 2] = z / n * r; continue; }
      ringId[i] = i % 3; const ring = rings[i % 3], ang = rand() * Math.PI * 2;
      const x = Math.cos(ang) * ring.r + gauss() * 0.07, y = gauss() * 0.07, z = Math.sin(ang) * ring.r + gauss() * 0.07;
      let y2 = y * Math.cos(ring.tx) - z * Math.sin(ring.tx); const z2 = y * Math.sin(ring.tx) + z * Math.cos(ring.tx);
      const x2 = x * Math.cos(ring.tz) - y2 * Math.sin(ring.tz); y2 = x * Math.sin(ring.tz) + y2 * Math.cos(ring.tz);
      posArr[i3] = x2; posArr[i3 + 1] = y2; posArr[i3 + 2] = z2;
      }
      const SNOISE = `
      vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
      vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
      vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
      vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
      float snoise(vec3 v){const vec2 C=vec2(1.0/6.0,1.0/3.0);const vec4 D=vec4(0.0,0.5,1.0,2.0);vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.0-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;i=mod289(i);vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));float n_=0.142857142857;vec3 ns=n_*D.wyz-D.xzx;vec4 j=p-49.0*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.0*x_);vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.0-abs(x)-abs(y);vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);vec4 s0=floor(b0)*2.0+1.0;vec4 s1=floor(b1)*2.0+1.0;vec4 sh=-step(h,vec4(0.0));vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);m=m*m;return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));}`;
      const VERT = `attribute float aSeed;attribute float aScale;attribute float aRing;uniform float uTime;uniform float uSize;uniform float uPixelRatio;uniform vec3 uColor;uniform vec3 uCore;uniform vec3 uRing0;uniform vec3 uRing1;uniform vec3 uRing2;varying vec3 vColor;varying float vTwinkle;` + SNOISE + `
      void main(){
      vec3 pos=position;
      if(aRing<2.5){vec3 ax=aRing<0.5?normalize(vec3(1.0,0.18,0.0)):aRing<1.5?normalize(vec3(0.0,1.0,0.22)):normalize(vec3(0.25,0.0,1.0));float ang=uTime*(aRing<0.5?0.24:aRing<1.5?-0.38:0.55);float c=cos(ang),s=sin(ang);pos=pos*c+cross(ax,pos)*s+ax*dot(ax,pos)*(1.0-c);}
      vec3 np=pos*0.2+vec3(uTime*0.18)+aSeed*6.28;
      pos+=vec3(snoise(np),snoise(np+31.7),snoise(np+74.3))*0.13;
      pos.x+=sin(uTime*0.9+aSeed*40.0)*0.05;
      pos.y+=cos(uTime*0.7+aSeed*30.0)*0.05;
      vColor=uColor;
      if(aRing<2.5){vColor=aRing<0.5?uRing0:aRing<1.5?uRing1:uRing2;}
      vColor=mix(vColor,uCore,smoothstep(2.5,1.4,length(pos)));
      vColor=mix(vColor,vec3(1.0),step(0.985,aSeed)*0.9);
      vTwinkle=0.6+0.4*sin(uTime*(0.6+aSeed*1.8)+aSeed*20.0);
      vec4 mv=modelViewMatrix*vec4(pos,1.0);
      gl_PointSize=uSize*aScale*uPixelRatio*(12.0/-mv.z);
      gl_Position=projectionMatrix*mv;
      }`;
      const FRAG = `precision mediump float;uniform float uOpacity;varying vec3 vColor;varying float vTwinkle;
      void main(){float d=length(gl_PointCoord-0.5);float alpha=smoothstep(0.5,0.12,d);alpha+=smoothstep(0.12,0.0,d)*0.5;gl_FragColor=vec4(vColor,alpha*vTwinkle*uOpacity);}`;
      const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance' });
      const pr = Math.min(devicePixelRatio, isMobile ? 1.25 : 1.75);
      renderer.setPixelRatio(pr);
      renderer.setSize(innerWidth, innerHeight);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.1;
      const scene = new THREE.Scene();
      scene.background = new THREE.Color('#0a0a0c');
      const camera = new THREE.PerspectiveCamera(50, innerWidth / innerHeight, 0.1, 100);
      camera.position.z = 14.5;
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(posArr, 3));
      geo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));
      geo.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));
      geo.setAttribute('aRing', new THREE.BufferAttribute(ringId, 1));
      const uniforms = { uTime: { value: 0 }, uSize: { value: 3.0 }, uPixelRatio: { value: pr }, uOpacity: { value: 0.8 }, uColor: { value: new THREE.Color('#f5b8d0') }, uCore: { value: new THREE.Color('#ffd9e8') }, uRing0: { value: new THREE.Color('#c26a97') }, uRing1: { value: new THREE.Color('#f5b8d0') }, uRing2: { value: new THREE.Color('#ffe3ef') } };
      const mat = new THREE.ShaderMaterial({ uniforms, vertexShader: VERT, fragmentShader: FRAG, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
      const group = new THREE.Group();
      group.add(new THREE.Points(geo, mat));
      scene.add(group);
      let composer = null;
      if (!isMobile && !reduced) {
      composer = new EffectComposer(renderer);
      composer.addPass(new RenderPass(scene, camera));
      composer.addPass(new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), 0.85, 0.55, 0.12));
      }
      let mx = 0, my = 0, tmx = 0, tmy = 0;
      addEventListener('pointermove', (e) => { tmx = e.clientX / innerWidth - 0.5; tmy = e.clientY / innerHeight - 0.5; });
      const clock = new THREE.Clock();
      function frame() {
      const t = clock.getElapsedTime();
      uniforms.uTime.value = t;
      mx += (tmx - mx) * 0.04;
      my += (tmy - my) * 0.04;
      group.rotation.y = mx * 0.35 + t * 0.06 + Math.sin(t * 0.07) * 0.06;
      group.rotation.x = my * 0.22 + Math.sin(t * 0.23) * 0.1;
      composer ? composer.render() : renderer.render(scene, camera);
      requestAnimationFrame(frame);
      }
      if (reduced) { uniforms.uTime.value = 1; renderer.render(scene, camera); } else { requestAnimationFrame(frame); }
      addEventListener('resize', () => {
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(innerWidth, innerHeight);
      composer && composer.setSize(innerWidth, innerHeight);
      });
      }
    


      (function() {
        const cards = document.querySelectorAll('.fade-card');
        cards.forEach(card => {
          card.style.transformStyle = 'preserve-3d';
          const img = card.querySelector('.rounded-xl');
          const content = card.querySelector('.flex-grow');

          card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            card.style.transition = 'transform 0.1s ease-out';
            card.style.zIndex = '10';

            if (img) {
              img.style.transform = 'translateZ(30px)';
              img.style.transition = 'transform 0.1s ease-out';
            }
            if (content) {
              content.style.transform = 'translateZ(20px)';
              content.style.transition = 'transform 0.1s ease-out';
            }
          });

          card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            card.style.transition = 'transform 0.5s ease-out';
            card.style.zIndex = '1';

            if (img) {
              img.style.transform = 'translateZ(0px)';
              img.style.transition = 'transform 0.5s ease-out';
            }
            if (content) {
              content.style.transform = 'translateZ(0px)';
              content.style.transition = 'transform 0.5s ease-out';
            }
          });
        });
      })();
    


      (function(){function init(){if(!window.gsap||!window.ScrollTrigger)return;gsap.registerPlugin(ScrollTrigger);var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;if(reduce)return;var cards=gsap.utils.toArray('#collection .fade-card');if(cards.length){gsap.fromTo(cards,{x:function(i){return[-260,0,240][i]||0;},y:function(i){return[-80,120,-80][i]||0;},rotate:function(i){return[-14,0,14][i]||0;},scale:0.86,autoAlpha:0.4},{x:0,y:0,rotate:0,scale:1,autoAlpha:1,stagger:0.05,ease:'none',scrollTrigger:{trigger:'#collection',start:'top 80%',end:'top 20%',scrub:1}});}gsap.fromTo('#collection [data-scroll-word]',{y:'6vh',scale:1.04},{y:'-4vh',scale:0.99,ease:'none',scrollTrigger:{trigger:'#collection',start:'top bottom',end:'bottom top',scrub:1}});}if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',init);}else{init();}})();
    


      (function(){function init(){if(!window.gsap||!window.ScrollTrigger)return;gsap.registerPlugin(ScrollTrigger);var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;if(reduce)return;

      /* Parallax background layers on scroll */
      gsap.to('#bgLayer',{yPercent:18,ease:'none',scrollTrigger:{trigger:'#cinematic',start:'top top',end:'bottom top',scrub:1}});

      /* Integration cards staggered reveal with 3D tilt-in */
      gsap.utils.toArray('#integration .fade-card').forEach(function(c,i){gsap.fromTo(c,{y:60,rotateX:12,autoAlpha:0,transformPerspective:900},{y:0,rotateX:0,autoAlpha:1,duration:0.9,ease:'power3.out',scrollTrigger:{trigger:c,start:'top 88%'}});});

      /* Craft strip headline parallax drift */
      gsap.to('#craft .reveal-line',{yPercent:-15,ease:'none',scrollTrigger:{trigger:'#craft',start:'top bottom',end:'bottom top',scrub:1}});

      /* Manifesto words progressive reveal */
      var words=gsap.utils.toArray('#noema-manifesto span[style*="font-weight:800"]');
      if(words.length){gsap.fromTo(words,{autoAlpha:0.12,y:'0.4em'},{autoAlpha:1,y:'0em',ease:'none',stagger:0.4,scrollTrigger:{trigger:'#noema-manifesto',start:'top 70%',end:'center center',scrub:1}});}

      /* Board giant word parallax */
      gsap.to('#noema-board h2',{yPercent:-14,ease:'none',scrollTrigger:{trigger:'#noema-board',start:'top bottom',end:'bottom top',scrub:1}});
      gsap.utils.toArray('#noema-board article').forEach(function(a,i){gsap.fromTo(a,{y:70,autoAlpha:0},{y:0,autoAlpha:1,duration:0.8,ease:'power3.out',delay:i*0.08,scrollTrigger:{trigger:'#noema-board',start:'top 75%'}});});

      /* Support giant word parallax + cards */
      gsap.to('#noema-support h2',{yPercent:-12,ease:'none',scrollTrigger:{trigger:'#noema-support',start:'top bottom',end:'bottom top',scrub:1}});
      gsap.utils.toArray('#noema-support article').forEach(function(a,i){gsap.fromTo(a,{y:90,rotateX:8,autoAlpha:0,transformPerspective:900},{y:0,rotateX:0,autoAlpha:1,duration:0.9,ease:'power3.out',delay:i*0.1,scrollTrigger:{trigger:'#noema-support',start:'top 72%'}});});

      /* Footer fade-up */
      gsap.fromTo('footer > div',{y:40,autoAlpha:0},{y:0,autoAlpha:1,duration:0.8,ease:'power2.out',scrollTrigger:{trigger:'footer',start:'top 90%'}});

      /* Micro-interactions: magnetic nav + button hover */
      var mag=document.querySelectorAll('nav a, nav button, #craft a, #noema-support button, footer a');
      mag.forEach(function(el){el.style.willChange='transform';el.style.display=el.style.display||'inline-flex';el.addEventListener('mousemove',function(e){var r=el.getBoundingClientRect();var mx=(e.clientX-r.left-r.width/2)/r.width;var my=(e.clientY-r.top-r.height/2)/r.height;gsap.to(el,{x:mx*6,y:my*4,duration:0.4,ease:'power2.out'});});el.addEventListener('mouseleave',function(){gsap.to(el,{x:0,y:0,duration:0.5,ease:'elastic.out(1,0.4)'});});});

      /* Dot row hover pulse */
      document.querySelectorAll('#dotRow span').forEach(function(d){d.addEventListener('mouseenter',function(){gsap.to(d,{scale:1.8,duration:0.3,ease:'back.out(2)'});});d.addEventListener('mouseleave',function(){gsap.to(d,{scale:1,duration:0.3});});});
      }if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',init);}else{init();}})();
    