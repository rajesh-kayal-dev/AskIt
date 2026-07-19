
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth/hooks/useAuth';
import { initLandingAnimations, cleanupLandingAnimations } from '../utils/landingScripts';
import '../assets/styles/LandingPage.css';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'iconify-icon': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & { icon?: string; width?: string; height?: string; };
    }
  }
}

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const initialized = useRef(false);

  const handleGetStarted = () => {
    navigate('/login');
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (!isAuthenticated) {
      initLandingAnimations();
      return () => {
        cleanupLandingAnimations();
      };
    }
  }, [isAuthenticated]);

  const agents = [
    {
      title: 'Smart Q&A Agent',
      description: 'Instant, context-aware answers from your knowledge base.',
      price: 'Free tier',
      image: 'https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/4dd5a8b0-2d0d-44eb-ae24-75a4345db5ac_3840w.png',
      transition: 'transform 0.5s ease-out'
    },
    {
      title: 'Document Analyzer',
      description: 'Upload docs, ask anything — get pinpoint answers instantly.',
      price: 'Pro plan',
      image: 'https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/d898f02c-0397-49fe-9aca-cab19a5582c5_3840w.png',
      transition: 'transform 0.5s ease-out'
    },
    {
      title: 'Team Knowledge Hub',
      description: 'Shared AI workspace — every answer your team has ever found.',
      price: 'Team plan',
      image: 'https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/25d0ce5e-7521-4346-900f-d2ff2902bd46_3840w.png',
      transition: 'transform 0.1s ease-out'
    }
  ];

  if (isAuthenticated) return null;

  return (
    <div 
      className="landing-container text-[#f4f2ef] font-sans antialiased selection:bg-[#f5b8d0]/20 selection:text-white"
    >
      
    <canvas id="particlesBg" aria-hidden="true" style={{ position: 'fixed', inset: '0px', zIndex: -1, pointerEvents: 'none', display: 'block' }} className=""></canvas>
    {/*  Top Nav  */}
    <header style={{ 'position': 'fixed', 'top': '0', 'left': '0', 'right': '0', 'zIndex': '60', 'backdropFilter': 'blur(12px)', 'background': 'rgba(10,10,12,0.55)', 'borderBottom': '1px solid rgba(255,255,255,0.06)' }} className="">
      <nav className="mx-auto flex items-center justify-between px-6 py-4 max-w-[77.5rem]">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium tracking-tighter uppercase text-white">
            AskIT
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-[#b8b4ae]">
          <a href="#cinematic" className="hover:text-white transition-colors duration-300" style={{ 'willChange': 'transform', 'display': 'inline-flex' }}>
            How It Works
          </a>
          <a href="#collection" className="hover:text-white transition-colors duration-300" style={{ 'willChange': 'transform', 'display': 'inline-flex' }}>
            Features
          </a>
          <a href="#craft" className="hover:text-white transition-colors duration-300" style={{ 'willChange': 'transform', 'display': 'inline-flex' }}>
            Technology
          </a>
        </div>
        <button className="text-sm font-normal px-4 py-1.5 rounded-full bg-[#ededed] text-[#1a1a1a] hover:bg-white transition-colors shadow-[inset_0_1px_0_rgba(255,255,255,0.8),_0_2px_4px_rgba(0,0,0,0.1)]" style={{ 'willChange': 'transform', 'display': 'inline-flex' }} onClick={handleGetStarted}>Get Started</button>
      </nav>
    </header>

    {/*  CINEMATIC PINNED SECTION  */}
    <section style={{ 'position': 'relative', 'height': '820vh' }} className="" id="cinematic">
      <div style={{ 'position': 'sticky', 'top': '0px', 'height': '100vh', 'width': '100%', 'overflow': 'hidden' }} className="" id="pinStage">
        
        {/*  WebGL / Canvas petal layer  */}
        <canvas style={{ 'position': 'absolute', 'inset': '0', 'width': '100%', 'height': '100%', 'zIndex': '5', 'opacity': '0.85' }} width="2880" height="2048" className="" id="petalCanvas"></canvas>

        {/*  Parallax visual layers  */}
        <div id="visualWrap" style={{ 'position': 'absolute', 'inset': '0px', 'zIndex': '1', 'willChange': 'transform' }} className="">
          <div id="bgLayer" style={{ 'position': 'absolute', 'inset': '-8%', 'backgroundSize': 'cover', 'backgroundPosition': 'center center', 'filter': 'saturate(0.7) brightness(0.55)', 'willChange': 'transform', 'overflow': 'hidden', 'isolation': 'isolate' }} className=""></div>
          <div style={{ 'position': 'absolute', 'inset': '0px', 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'center', 'willChange': 'transform' }} className="" id="midLayer">
            
            <div className="anim-scroll-aura-emrgurr6g15xfazn2" style={{ 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'center', 'width': '100%', 'height': '100%' }}>
              <div className="anim-float-aura-emrgurr6g15xfazn2" style={{ 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'center' }}>
                <div id="bouquet" className="z-40 relative" style={{ 'width': 'min(56vw, 40rem)', 'aspectRatio': '16 / 11', 'backgroundImage': 'url(\'/assets/landing/bouquet.png\')', 'backgroundSize': 'contain', 'backgroundRepeat': 'no-repeat', 'backgroundPosition': 'center center', 'willChange': 'transform', 'zIndex': '40' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/*  Color grade wash  */}
        <div id="gradeWash" style={{ 'position': 'absolute', 'inset': '0px', 'zIndex': '6', 'pointerEvents': 'none', 'background': 'radial-gradient(circle at 50% 45%, rgba(245, 184, 208, 0.1), rgba(10, 10, 12, 0.75) 70%)', 'mixBlendMode': 'screen' }} className=""></div>

        {/*  Letterbox bars  */}
        <div id="lbTop" style={{ 'position': 'absolute', 'top': '0px', 'left': '0px', 'right': '0px', 'height': '0.000314vh', 'background': 'rgb(0, 0, 0)', 'zIndex': '20', 'willChange': 'height' }} className=""></div>
        <div id="lbBot" style={{ 'position': 'absolute', 'bottom': '0px', 'left': '0px', 'right': '0px', 'height': '0.000314vh', 'background': 'rgb(0, 0, 0)', 'zIndex': '20', 'willChange': 'height' }} className=""></div>

        {/*  Corner brackets frame  */}
        <div style={{ 'position': 'absolute', 'inset': '1.5rem', 'zIndex': '30', 'pointerEvents': 'none' }} className="">
          <span style={{ 'position': 'absolute', 'top': '0', 'left': '0', 'width': '1.375rem', 'height': '1.375rem', 'borderTop': '1px solid rgba(255,255,255,0.25)', 'borderLeft': '1px solid rgba(255,255,255,0.25)' }}></span>
          <span style={{ 'position': 'absolute', 'top': '0', 'right': '0', 'width': '1.375rem', 'height': '1.375rem', 'borderTop': '1px solid rgba(255,255,255,0.25)', 'borderRight': '1px solid rgba(255,255,255,0.25)' }}></span>
          <span style={{ 'position': 'absolute', 'bottom': '0', 'left': '0', 'width': '1.375rem', 'height': '1.375rem', 'borderBottom': '1px solid rgba(255,255,255,0.25)', 'borderLeft': '1px solid rgba(255,255,255,0.25)' }}></span>
          <span style={{ 'position': 'absolute', 'bottom': '0', 'right': '0', 'width': '1.375rem', 'height': '1.375rem', 'borderBottom': '1px solid rgba(255,255,255,0.25)', 'borderRight': '1px solid rgba(255,255,255,0.25)' }}></span>
        </div>

        {/*  Copy beats  */}
        <div style={{ 'position': 'absolute', 'inset': '0px', 'zIndex': '40', 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'center', 'pointerEvents': 'none' }} className="">
          <div className="beat flex flex-col items-center" data-beat="0" style={{ 'position': 'absolute', 'textAlign': 'center', 'padding': '0 1.5rem', 'opacity': '0' }}>
            <p className="text-xs uppercase" style={{ 'letterSpacing': '0.35rem', 'color': '#f5b8d0', 'marginBottom': '1rem' }}>
              Version 1.0
            </p>
            <h1 className="tracking-tight" style={{ 'fontSize': 'clamp(2.5rem,8vw,6rem)', 'lineHeight': '0.95', 'fontWeight': '500' }}>
              Your Questions,
              <br />
              Instantly Answered
            </h1>
          </div>
          <div className="beat flex flex-col items-center" data-beat="1" style={{ 'position': 'absolute', 'textAlign': 'center', 'padding': '0 1.5rem', 'opacity': '0' }}>
            <h2 className="tracking-tight" style={{ 'fontSize': 'clamp(2.125rem,7vw,5rem)', 'lineHeight': '1', 'fontWeight': '500' }}>
              Ask Anything
            </h2>
            <p className="text-sm mt-4 text-[#c9c4bd]" style={{ 'maxWidth': '27.5rem' }}>
              Type your question in plain English — AskIT understands context and delivers precise answers.
            </p>
          </div>
          <div className="beat flex flex-col items-center" data-beat="2" style={{ 'position': 'absolute', 'textAlign': 'center', 'padding': '0 1.5rem', 'opacity': '0' }}>
            <p className="text-xs uppercase" style={{ 'letterSpacing': '0.3rem', 'color': '#f5b8d0', 'marginBottom': '0.75rem' }}>
              AI Understanding
            </p>
            <h2 className="tracking-tight" style={{ 'fontSize': 'clamp(2.125rem,7vw,5rem)', 'lineHeight': '1', 'fontWeight': '500' }}>
              Deep Context
            </h2>
          </div>
          <div className="beat flex flex-col items-center" data-beat="3" style={{ 'position': 'absolute', 'textAlign': 'center', 'padding': '0 1.5rem', 'opacity': '0' }}>
            <h2 className="tracking-tight" style={{ 'fontSize': 'clamp(2.125rem,7vw,5rem)', 'lineHeight': '1', 'fontWeight': '500' }}>
              Your Knowledge Base
            </h2>
            <p className="text-sm mt-4 text-[#c9c4bd]" style={{ 'maxWidth': '26.25rem' }}>
              Connect documents, wikis, and data sources. AskIT learns from everything you share.
            </p>
          </div>
          <div className="beat flex flex-col items-center" data-beat="4" style={{ 'position': 'absolute', 'textAlign': 'center', 'padding': '0 1.5rem', 'opacity': '0' }}>
            <p className="text-xs uppercase" style={{ 'letterSpacing': '0.3rem', 'color': '#f5b8d0', 'marginBottom': '0.75rem' }}>
              Instant Results
            </p>
            <h2 className="tracking-tight" style={{ 'fontSize': 'clamp(2.125rem,7vw,5rem)', 'lineHeight': '1', 'fontWeight': '500' }}>
              Answers in Seconds
            </h2>
          </div>
          <div className="beat flex flex-col items-center" data-beat="5" style={{ 'position': 'absolute', 'textAlign': 'center', 'padding': '0 1.5rem', 'opacity': '0' }}>
            <h2 className="tracking-tight" style={{ 'fontSize': 'clamp(2.125rem,7vw,5rem)', 'lineHeight': '1', 'fontWeight': '500' }}>
              Share with Your Team
            </h2>
          </div>
          <div className="beat flex flex-col items-center" data-beat="6" style={{ 'position': 'absolute', 'textAlign': 'center', 'padding': '0 1.5rem', 'opacity': '0' }}>
            <p className="text-xs uppercase" style={{ 'letterSpacing': '0.3rem', 'color': '#f5b8d0', 'marginBottom': '0.75rem' }}>
              Live Now
            </p>
            <h2 className="tracking-tight uppercase" style={{ 'fontSize': 'clamp(2.375rem,8vw,5.625rem)', 'lineHeight': '1', 'fontWeight': '500' }}>
              AskIT
            </h2>
            <p className="text-sm mt-4 text-[#c9c4bd]">
              AI-powered answers — start asking smarter questions.
            </p>
          </div>
        </div>

        {/*  Timeline HUD  */}
        <div style={{ 'position': 'absolute', 'left': '2rem', 'bottom': '3.5rem', 'zIndex': '45', 'display': 'flex', 'alignItems': 'center', 'gap': '1rem' }} className="">
          <div id="timelineTrack" style={{ 'width': '11.25rem', 'height': '0.1875rem', 'borderRadius': '0.1875rem', 'background': 'rgba(255,255,255,0.16)', 'overflow': 'hidden' }}>
            <div id="timelineFill" style={{ 'height': '100%', 'width': '99.999641%', 'background': 'linear-gradient(90deg, rgb(245, 184, 208), rgb(194, 106, 151))' }}></div>
          </div>
          <span id="timeLabel" className="text-xs tabular-nums text-[#b8b4ae]">12.75s</span>
        </div>

        {/*  Timeline dots  */}
        <div style={{ 'position': 'absolute', 'right': '2rem', 'bottom': '3.5rem', 'zIndex': '45', 'display': 'flex', 'gap': '0.625rem' }} id="dotRow" className="">
        </div>
      </div>
    </section>

    {/*  COLLECTION SECTION  */}
    <section id="collection" className="mx-auto px-6 py-24 max-w-[77.5rem] relative overflow-hidden">
      <div style={{ 'position': 'absolute', 'inset': '0', 'backgroundImage': 'repeating-linear-gradient(45deg, rgba(255,255,255,0.015) 0, rgba(255,255,255,0.015) 1px, transparent 1px, transparent 9px)', 'pointerEvents': 'none' }} className=""></div>

      <div className="reveal-line overflow-hidden">
        <p className="text-xs uppercase text-[#f5b8d0]" style={{ 'letterSpacing': '0.3rem' }}>
          Features
        </p>
      </div>
      <div className="reveal-line mt-3">
        <h2 className="tracking-tight pb-2" style={{ 'fontSize': 'clamp(1.875rem,5vw,3.5rem)', 'fontWeight': '500', 'lineHeight': '1.05' }} data-scroll-word="true">
          Powerful tools built to answer any question
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14 gap-x-6 gap-y-6">
        {agents.map((agent, index) => (
          <div key={index} className="fade-card group flex flex-col border-white/[0.06] hover:bg-white/[0.04] transition-colors duration-500 cursor-pointer border rounded-2xl pt-5 pr-5 pb-5 pl-5 backdrop-blur-lg" style={{ 'transformStyle': 'preserve-3d' }}>
            <div className="rounded-xl overflow-hidden mb-5" style={{ 'aspectRatio': '4/5', 'backgroundImage': `url('${agent.image}')`, 'backgroundSize': 'cover', 'backgroundPosition': 'center' }}></div>
            <div className="flex flex-col flex-grow justify-between" style={{ 'transition': agent.transition }}>
              <div className="">
                <h3 className="text-base font-medium tracking-tight group-hover:text-white transition-colors text-[#e8e6e3]">
                  {agent.title}
                </h3>
                <p className="text-sm mt-1.5 text-[#9c988f]">
                  {agent.description}
                </p>
              </div>
              <p className="text-sm mt-4 font-normal text-[#f5b8d0]">{agent.price}</p>
            </div>
          </div>
        ))}
      </div>
    </section>

    {/*  CRAFT PARALLAX STRIP  */}
    <section id="craft" className="relative overflow-hidden flex items-center" style={{ 'height': '70vh' }}>
      <div id="craftBg" className="absolute inset-[-15%] bg-cover bg-center will-change-transform" style={{ 'backgroundImage': 'url(\'https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/cf973fee-26dd-4029-b42e-26dfa75c7417_3840w.png\')', 'filter': 'brightness(0.35) saturate(0.8)' }}></div>
      <div className="mx-auto px-6 max-w-[77.5rem] relative z-10">
        <div className="reveal-line overflow-hidden">
          <h2 className="tracking-tight text-white" style={{ 'fontSize': 'clamp(1.75rem,5vw,3.25rem)', 'fontWeight': '500', 'maxWidth': '40rem', 'lineHeight': '1.1' }}>
            Every answer is powered by AI that actually understands what you mean.
          </h2>
        </div>
        <a href="/register" className="inline-flex items-center gap-2 mt-8 text-sm font-medium px-5 py-2.5 rounded-full bg-white/10 border border-white/10 text-white hover:bg-white/20 transition-colors backdrop-blur-md" style={{ 'willChange': 'transform', 'display': 'inline-flex' }}>
          Get started free
          <iconify-icon icon="solar:arrow-right-linear" width="1rem"></iconify-icon>
        </a>
      </div>
    </section>
    <section id="integration" className="mx-auto px-6 py-24 max-w-[77.5rem] relative">
      <div className="reveal-line overflow-hidden">
        <p className="text-xs uppercase text-[#f5b8d0]" style={{ 'letterSpacing': '0.3rem' }}>
          Integrations
        </p>
      </div>
      <div className="reveal-line overflow-hidden mt-3">
        <h2 className="tracking-tight" style={{ 'fontSize': 'clamp(1.875rem,5vw,3.5rem)', 'fontWeight': '500', 'lineHeight': '1.05' }}>
          Works with the tools you already use
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-14">
        <div className="fade-card flex flex-col border-white/[0.06] hover:bg-white/[0.04] transition-colors duration-500 bg-neutral-900 border rounded-2xl px-10 py-10" style={{ 'transformStyle': 'preserve-3d' }}>
          <iconify-icon icon="solar:server-square-linear" width="2.5rem" className="text-[#f5b8d0] mb-6"></iconify-icon>
          <h3 className="text-xl font-medium tracking-tight text-[#e8e6e3] mb-2">
            REST API
          </h3>
          <p className="text-sm text-[#9c988f]">
            Connect AskIT directly to your app with our clean REST API.
            Get answers in your product with a single HTTP request.
          </p>
        </div>
        <div className="fade-card flex flex-col border-white/[0.06] hover:bg-white/[0.04] transition-colors duration-500 bg-neutral-900 border rounded-2xl px-10 py-10" style={{ 'transformStyle': 'preserve-3d' }}>
          <iconify-icon icon="solar:cloud-network-linear" width="2.5rem" className="text-[#f5b8d0] mb-6"></iconify-icon>
          <h3 className="text-xl font-medium tracking-tight text-[#e8e6e3] mb-2">
            Cloud Hosted
          </h3>
          <p className="text-sm text-[#9c988f]">
            Fully managed — no infrastructure to maintain. Works on AWS,
            GCP, and Azure out of the box.
          </p>
        </div>
      </div>
    </section>
    <section id="noema-manifesto" style={{ 'position': 'relative', 'minHeight': '100vh', 'background': '#f4efe7', 'color': '#050505', 'overflow': 'hidden', 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'center', 'padding': '6rem 1.25rem', 'fontFamily': '\'Inter\',sans-serif' }} className="">
      <div style={{ 'position': 'absolute', 'inset': '0', 'background': 'radial-gradient(circle at 20% 30%, rgba(79,70,229,0.24), transparent 32%), radial-gradient(circle at 80% 72%, rgba(244,63,94,0.22), transparent 30%)' }} className=""></div>
      <div style={{ 'position': 'relative', 'zIndex': '10', 'maxWidth': 'min(1180px,92vw)', 'display': 'flex', 'flexWrap': 'wrap', 'alignItems': 'center', 'justifyContent': 'center', 'gap': '0.18em 0.28em', 'textAlign': 'center' }} className="">
        <span style={{ 'display': 'inline-block', 'fontWeight': '800', 'fontSize': 'clamp(2.4rem,7.8vw,7.4rem)', 'lineHeight': '0.9', 'letterSpacing': '-0.045em', 'textTransform': 'uppercase' }} className="">
          Everything
        </span>
        <span style={{ 'display': 'inline-block', 'fontWeight': '800', 'fontSize': 'clamp(2.4rem,7.8vw,7.4rem)', 'lineHeight': '0.9', 'letterSpacing': '-0.045em', 'textTransform': 'uppercase' }}>
          your
        </span>
        <span style={{ 'display': 'inline-block', 'fontWeight': '800', 'fontSize': 'clamp(2.4rem,7.8vw,7.4rem)', 'lineHeight': '0.9', 'letterSpacing': '-0.045em', 'textTransform': 'uppercase' }} className="">
          team
        </span>
        <span style={{ 'display': 'inline-block', 'fontWeight': '800', 'fontSize': 'clamp(2.4rem,7.8vw,7.4rem)', 'lineHeight': '0.9', 'letterSpacing': '-0.045em', 'textTransform': 'uppercase' }} className="">
          needs
        </span>
        <span style={{ 'display': 'inline-block', 'fontWeight': '800', 'fontSize': 'clamp(2.4rem,7.8vw,7.4rem)', 'lineHeight': '0.9', 'letterSpacing': '-0.045em', 'textTransform': 'uppercase' }}>
          to
        </span>
        <span style={{ 'display': 'inline-block', 'fontWeight': '800', 'fontSize': 'clamp(2.4rem,7.8vw,7.4rem)', 'lineHeight': '0.9', 'letterSpacing': '-0.045em', 'textTransform': 'uppercase' }} className="">
          know,
        </span>
        <span style={{ 'display': 'inline-block', 'fontWeight': '800', 'fontSize': 'clamp(2.4rem,7.8vw,7.4rem)', 'lineHeight': '0.9', 'letterSpacing': '-0.045em', 'textTransform': 'uppercase' }}>
          answered
        </span>
        <span style={{ 'display': 'inline-block', 'fontWeight': '800', 'fontSize': 'clamp(2.4rem,7.8vw,7.4rem)', 'lineHeight': '0.9', 'letterSpacing': '-0.045em', 'textTransform': 'uppercase' }}>
          by
        </span>
        <span style={{ 'display': 'inline-block', 'fontWeight': '800', 'fontSize': 'clamp(2.4rem,7.8vw,7.4rem)', 'lineHeight': '0.9', 'letterSpacing': '-0.045em', 'textTransform': 'uppercase' }}>
          AI.
        </span>
      </div>
      <p style={{ 'position': 'absolute', 'left': '1.25rem', 'bottom': '1.25rem', 'zIndex': '10', 'fontSize': '0.72rem', 'letterSpacing': '0.18em', 'textTransform': 'uppercase', 'fontWeight': '700', 'color': 'rgba(0,0,0,0.6)' }} className="">
        04 / Knowledge
      </p>
    </section>
    <section style={{ 'position': 'relative', 'minHeight': '100vh', 'color': '#050505', 'overflow': 'hidden', 'padding': '7rem 1.25rem 4rem', 'display': 'flex', 'alignItems': 'center', 'fontFamily': '\'Inter\',sans-serif' }} className="" id="noema-board">
      <h2 style={{ 'position': 'absolute', 'zIndex': '0', 'color': 'rgba(0,0,0,0.18)', 'fontWeight': '800', 'fontSize': 'clamp(8rem,28vw,30rem)', 'lineHeight': '0.78', 'letterSpacing': '-0.055em', 'whiteSpace': 'nowrap', 'left': '50%', 'top': '50%', 'transform': 'translate(-50%,-50%)' }} className="">
        MODELS
      </h2>
      <div style={{ 'position': 'relative', 'zIndex': '10', 'width': '100%', 'maxWidth': '72rem', 'margin': '0 auto', 'display': 'grid', 'gridTemplateColumns': 'repeat(auto-fit,minmax(220px,1fr))', 'gap': '0.75rem' }} className="">
        <article style={{ 'minHeight': '158px', 'border': '1px solid rgba(255,255,255,0.2)', 'background': '#050505', 'color': 'white', 'padding': '1rem', 'display': 'flex', 'flexDirection': 'column', 'justifyContent': 'space-between' }} className="">
          <div className="">
            <p style={{ 'fontSize': '0.75rem', 'textTransform': 'uppercase', 'letterSpacing': '0.18em', 'color': 'rgba(255,255,255,0.45)' }} className="">
              Deployment
            </p>
            <h3 style={{ 'fontWeight': '800', 'fontSize': '1.875rem', 'lineHeight': '1', 'marginTop': '0.75rem' }} className="">
              AskIT:
              <br />
              Online
            </h3>
          </div>
          <div style={{ 'display': 'flex', 'alignItems': 'flex-end', 'justifyContent': 'space-between', 'fontSize': '0.75rem', 'color': 'rgba(255,255,255,0.58)' }} className="">
            <span className="">
              US-East
              <br />
              99.9% Uptime
            </span>
          </div>
        </article>
        <article style={{ 'minHeight': '158px', 'border': '1px solid rgba(255,255,255,0.2)', 'background': '#050505', 'color': 'white', 'padding': '1rem', 'display': 'flex', 'flexDirection': 'column', 'justifyContent': 'space-between' }} className="">
          <div>
            <p style={{ 'fontSize': '0.75rem', 'textTransform': 'uppercase', 'letterSpacing': '0.18em', 'color': 'rgba(255,255,255,0.45)' }}>
              Processing
            </p>
            <h3 style={{ 'fontWeight': '800', 'fontSize': '1.875rem', 'lineHeight': '1', 'marginTop': '0.75rem' }}>
              AI Engine
              <br />
              Active
            </h3>
          </div>
          <div style={{ 'display': 'flex', 'alignItems': 'flex-end', 'justifyContent': 'space-between', 'fontSize': '0.75rem', 'color': 'rgba(255,255,255,0.58)' }}>
            <span>
              EU-Central
              <br />
              12ms Ping
            </span>
          </div>
        </article>
        <article style={{ 'minHeight': '158px', 'border': '1px solid rgba(255,255,255,0.2)', 'background': '#050505', 'color': 'white', 'padding': '1rem', 'display': 'flex', 'flexDirection': 'column', 'justifyContent': 'space-between' }} className="">
          <div className="">
            <p style={{ 'fontSize': '0.75rem', 'textTransform': 'uppercase', 'letterSpacing': '0.18em', 'color': 'rgba(255,255,255,0.45)' }}>
              Training
            </p>
            <h3 style={{ 'fontWeight': '800', 'fontSize': '1.875rem', 'lineHeight': '1', 'marginTop': '0.75rem' }} className="">
              Model Training
              <br />
              Ongoing
            </h3>
          </div>
          <div style={{ 'display': 'flex', 'alignItems': 'flex-end', 'justifyContent': 'space-between', 'fontSize': '0.75rem', 'color': 'rgba(255,255,255,0.58)' }} className="">
            <span className="">
              Global
              <br />
              Continuous
            </span>
          </div>
        </article>
        <article style={{ 'minHeight': '158px', 'border': '1px solid rgba(0,0,0,0.2)', 'background': '#F43F5E', 'color': '#050505', 'padding': '1rem', 'display': 'flex', 'flexDirection': 'column', 'justifyContent': 'space-between' }}>
          <div>
            <p style={{ 'fontSize': '0.75rem', 'textTransform': 'uppercase', 'letterSpacing': '0.18em', 'color': 'rgba(0,0,0,0.55)' }}>
              Security
            </p>
            <h3 style={{ 'fontWeight': '800', 'fontSize': '1.875rem', 'lineHeight': '1', 'marginTop': '0.75rem' }}>
              Zero-Trust
              <br />
              Firewall
            </h3>
          </div>
          <div style={{ 'display': 'flex', 'alignItems': 'flex-end', 'justifyContent': 'space-between', 'fontSize': '0.75rem', 'color': 'rgba(0,0,0,0.65)' }}>
            <span>
              US-West
              <br />
              Protected
            </span>
          </div>
        </article>
      </div>
    </section>
    <section style={{ 'position': 'relative', 'minHeight': '100vh', 'background': '#000000', 'color': 'white', 'overflow': 'hidden', 'padding': '0 1.25rem', 'display': 'flex', 'alignItems': 'center', 'fontFamily': '\'Inter\',sans-serif' }} className="" id="noema-support">
  <h2 style={{ 'position': 'absolute', 'zIndex': '0', 'color': 'rgba(0,0,0,0.35)', 'fontWeight': '800', 'fontSize': 'clamp(8rem,28vw,30rem)', 'lineHeight': '0.78', 'letterSpacing': '-0.055em', 'whiteSpace': 'nowrap', 'left': '50%', 'top': '46%', 'transform': 'translate(-50%,-50%)' }} className="">
    SCALE
  </h2>
  <div style={{ 'position': 'relative', 'zIndex': '10', 'width': '100%', 'maxWidth': '72rem', 'margin': '0px auto', 'display': 'grid', 'gridTemplateColumns': 'repeat(auto-fit, minmax(240px, 1fr))', 'gap': '0.75rem', 'padding': '5rem 0px' }} className="">
    <article style={{ 'border': '1px solid rgba(255,255,255,0.28)', 'background': '#050505', 'color': 'white', 'minHeight': '310px', 'padding': '1.25rem' }} className="">
      <p style={{ 'fontSize': '0.75rem', 'textTransform': 'uppercase', 'letterSpacing': '0.2em', 'color': 'rgba(255,255,255,0.45)' }} className="">
        01 / Ask
      </p>
      <h3 style={{ 'fontWeight': '700', 'fontSize': 'clamp(3rem,5vw,3.75rem)', 'lineHeight': '1', 'marginTop': '1.5rem', 'letterSpacing': '-0.025em' }} className="">
        QUESTION
      </h3>
      <p style={{ 'fontSize': '0.875rem', 'color': 'rgba(255,255,255,0.58)', 'marginTop': '1.5rem', 'maxWidth': '220px' }} className="">
        Type any question in plain language — no keywords needed.
      </p>
    </article>
    <article style={{ 'border': '1px solid rgba(0,0,0,0.1)', 'background': 'white', 'color': '#050505', 'minHeight': '310px', 'padding': '1.25rem' }} className="">
      <p style={{ 'fontSize': '0.75rem', 'textTransform': 'uppercase', 'letterSpacing': '0.2em', 'color': 'rgba(0,0,0,0.45)' }} className="">
        02 / Understand
      </p>
      <h3 style={{ 'fontWeight': '700', 'fontSize': 'clamp(3rem,5vw,3.75rem)', 'lineHeight': '1', 'marginTop': '1.5rem', 'letterSpacing': '-0.025em' }} className="">
        ANALYZED
      </h3>
      <button style={{ 'marginTop': '2rem', 'width': '100%', 'background': 'rgb(5, 5, 5)', 'color': 'white', 'fontSize': '0.875rem', 'fontWeight': '500', 'padding': '0.75rem', 'border': 'medium', 'borderRadius': '9999px', 'cursor': 'pointer', 'willChange': 'transform', 'display': 'inline-flex', 'alignItems': 'center', 'justifyContent': 'center' }}
          onClick={handleGetStarted}>
            Try AskIT Free
          </button>
    </article>
    <article style={{ 'border': '1px solid rgba(255,255,255,0.28)', 'background': '#050505', 'color': 'white', 'minHeight': '310px', 'padding': '1.25rem' }} className="">
      <p style={{ 'fontSize': '0.75rem', 'textTransform': 'uppercase', 'letterSpacing': '0.2em', 'color': 'rgba(255,255,255,0.45)' }}>
        03 / Answer
      </p>
      <h3 style={{ 'fontWeight': '700', 'fontSize': 'clamp(3rem,5vw,3.75rem)', 'lineHeight': '1', 'marginTop': '1.5rem', 'letterSpacing': '-0.025em' }} className="">
        DELIVERED
      </h3>
      <p style={{ 'fontSize': '0.875rem', 'color': 'rgba(255,255,255,0.58)', 'marginTop': '1.5rem', 'maxWidth': '220px' }}>
        Clear, cited answers delivered instantly to you or your team.
      </p>
    </article>
  </div>
</section>

    {/*  FOOTER  */}
    <footer className="mx-auto px-6 py-16 max-w-[77.5rem] border-t border-white/[0.06]">
      <div className="flex flex-col md:flex-row justify-between gap-10">
        <div className="">
          <span className="text-sm font-medium tracking-tighter uppercase text-white">
            AskIT
          </span>
          <p className="text-sm mt-4 text-[#7d7a73]" style={{ 'maxWidth': '17.5rem' }}>
            AI-powered answers for every question your team will ever ask.
          </p>
        </div>
        <div className="flex gap-16 text-sm text-[#9c988f]">
          <div className="flex flex-col gap-3">
            <a href="/login" className="hover:text-white transition-colors" style={{ 'willChange': 'transform', 'display': 'inline-flex' }}>Sign In</a>
            <a href="/register" className="hover:text-white transition-colors" style={{ 'willChange': 'transform', 'display': 'inline-flex' }}>Register</a>
            <a href="#" className="hover:text-white transition-colors" style={{ 'willChange': 'transform', 'display': 'inline-flex' }}>
              Pricing
            </a>
          </div>
          <div className="flex flex-col gap-3">
            <a href="#" className="hover:text-white transition-colors" style={{ 'willChange': 'transform', 'display': 'inline-flex' }}>
              Documentation
            </a>
            <a href="#" className="hover:text-white transition-colors" style={{ 'willChange': 'transform', 'display': 'inline-flex' }}>Changelog</a>
            <a href="#" className="hover:text-white transition-colors" style={{ 'willChange': 'transform', 'display': 'inline-flex' }}>API</a>
          </div>
        </div>
      </div>
      <div className="mt-16 flex items-center justify-between">
        <p className="text-xs text-[#5c5a55]">
          © {new Date().getFullYear()} AskIT. All rights reserved.
        </p>
      </div>
    </footer>

    

    
    
    

    

    

    
  

    </div>
  );
};
