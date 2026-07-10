import React, { useState, useEffect, useRef } from "react";
import { ArrowUp, Menu, X, Globe, ExternalLink, Award, Sparkles } from "lucide-react";
import { Icon } from "@iconify/react";
import { projects, achievements, posters } from "./data";

// Animated Counter Component for premium feels
const Counter = ({ target, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const elementRef = useRef(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    let start = 0;
    const end = parseInt(target.replace(/\D/g, ""), 10);
    if (start === end) return;

    const totalMiliseconds = duration;
    const incrementTime = Math.max(Math.floor(totalMiliseconds / end), 15);
    
    const timer = setInterval(() => {
      start += Math.ceil(end / (totalMiliseconds / incrementTime));
      if (start >= end) {
        clearInterval(timer);
        setCount(end);
      } else {
        setCount(start);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [hasStarted, target, duration]);

  const suffix = target.replace(/[0-9]/g, "");

  return (
    <span ref={elementRef} className="font-bold text-3xl lg:text-5xl text-violet-400">
      {count}
      {suffix}
    </span>
  );
};

const ThreeDRingSlider = () => {
  const slides = [
    { img: "/asset-page/website/bajubagus (1).png", title: "Baju Bagus Inc" },
    { img: "/asset-page/website/evoting (1).png", title: "E-Voting OSIS" },
    { img: "/asset-page/website/perpus (2).png", title: "Perpustakaan Online" },
    { img: "/asset-page/website/game_setan (5).png", title: "Game Setan" },
    { img: "/asset-page/website/rog_store (1).png", title: "RoG Store" },
    { img: "/asset-page/website/memorence_spy (1).png", title: "Memorence 2.0" },
    { img: "/asset-page/website/photoboth (1).png", title: "Memorence Photobooth" },
    { img: "/asset-page/website/batakaksara (1).png", title: "Aksara Batak" },
    { img: "/asset-page/website/bajubagus (6).png", title: "Baju Bagus Dashboard" },
    { img: "/asset-page/website/evoting (3).png", title: "E-Voting Panel" },
    { img: "/asset-page/website/rog_store (3).png", title: "RoG Store Catalog" },
    { img: "/asset-page/website/memorence_spy (3).png", title: "Memorence Spotify Mode" }
  ];
  
  const containerRef = useRef(null);
  const cardsRef = useRef([]);
  const rotationRef = useRef(0);
  const isHoveredRef = useRef(false);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const lastXRef = useRef(0);
  const lastTimeRef = useRef(0);
  const velocityRef = useRef(0);
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1000);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleStart = (e) => {
    isDraggingRef.current = true;
    isHoveredRef.current = true;
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    startXRef.current = x;
    lastXRef.current = x;
    lastTimeRef.current = performance.now();
    velocityRef.current = 0;
  };

  const handleMove = (e) => {
    if (!isDraggingRef.current) return;
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const deltaX = x - lastXRef.current;
    
    // Sensitivitas geser
    const sensitivity = 0.15; 
    rotationRef.current = (rotationRef.current - deltaX * sensitivity) % 360;
    
    const now = performance.now();
    const timeDelta = now - lastTimeRef.current;
    if (timeDelta > 0) {
      velocityRef.current = -deltaX / timeDelta;
    }
    
    lastXRef.current = x;
    lastTimeRef.current = now;
  };

  const handleEnd = () => {
    isDraggingRef.current = false;
  };

  useEffect(() => {
    let animationFrameId;
    
    const animate = () => {
      if (isDraggingRef.current) {
        // Sedang di-drag, posisi diupdate di handleMove
      } else {
        // Terapkan perlambatan inersia setelah drag selesai
        if (Math.abs(velocityRef.current) > 0.02) {
          rotationRef.current = (rotationRef.current + velocityRef.current * 16) % 360;
          velocityRef.current *= 0.94; // Gesekan (friction decay)
        } else {
          // Lanjutkan auto-scroll jika tidak di-hover
          if (!isHoveredRef.current) {
            rotationRef.current = (rotationRef.current + 0.12) % 360;
          }
        }
      }
      
      const N = slides.length;
      const isMobile = windowWidth < 640;
      const isTablet = windowWidth >= 640 && windowWidth < 1024;
      
      // Sesuaikan ukuran kartu agar landscape jauh lebih besar dan megah
      const cardWidth = isMobile ? 260 : isTablet ? 380 : 500;
      // Perlebar radiusX agar meregang penuh ke ujung kiri dan kanan layar
      const radiusX = windowWidth / 2 + (isMobile ? 30 : 150);
      const radiusZ = isMobile ? 130 : 250;

      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        
        // Hitung sudut absolut relatif terhadap sudut pandang depan
        const absoluteAngle = (i * (360 / N) + rotationRef.current) % 360;
        const angleRad = (absoluteAngle * Math.PI) / 180;
        const cosVal = Math.cos(angleRad);
        const sinVal = Math.sin(angleRad);
        
        // Warping non-linear sweet-spot: merapat dekat di tengah namun dihitung agar tidak saling menumpuk
        const warpedSin = Math.sign(sinVal) * Math.pow(Math.abs(sinVal), 1.25);
        const translateX = warpedSin * radiusX;
        
        // Translasi Z menggunakan cos (melengkung ke dalam/belakang)
        const translateZ = cosVal * radiusZ - radiusZ; 
        
        // Skala dikecilkan di ujung samping agar tidak menumpuk
        const scale = 0.60 + 0.20 * (1 - Math.abs(sinVal));
        
        // Opacity: Munculkan lebih banyak kartu (lebih lebat), hanya sembunyikan saat mendekati tengah depan
        let opacity = 0;
        if (cosVal < 0.4) {
          if (cosVal > 0.15) {
            opacity = (0.4 - cosVal) / 0.25; // Transisi memudar halus di depan
          } else {
            opacity = 0.95;
          }
        } else {
          opacity = 0; // Hilang sepenuhnya di area tepat di depan teks hero
        }
        
        // Z-Index diatur dinamis berdasarkan kedalaman Z
        const zIndex = Math.round((cosVal + 1) * 10) + 10;
        
        // Hitung persentase batas potong (clip path) tepat di koordinat tengah layar (X = 0)
        const pct = Math.max(0, Math.min(100, (0.5 - translateX / (cardWidth * scale)) * 100));
        
        const dotsOpacity = Math.abs(sinVal) * 0.8;
        const brightness = 1.0 - Math.abs(sinVal) * 0.25;

        // Hitung rotasi kemiringan Y & Z 3D (Warp Effect) agar melengkung alami mengikuti tabung
        const rotateYVal = sinVal * -38;
        const rotateZVal = sinVal * 5.5;

        // Terapkan efek clipPath ke lapisan hitam-putih (data-bw)
        const bwImg = card.querySelector('[data-bw]');
        if (bwImg) {
          bwImg.style.clipPath = `polygon(${pct}% 0%, 100% 0%, 100% 100%, ${pct}% 100%)`;
        }

        // Terapkan brightness filter ke kedua gambar
        const imgs = card.querySelectorAll('img');
        imgs.forEach(img => {
          if (img.hasAttribute('data-bw')) {
            img.style.filter = `grayscale(100%) brightness(${brightness})`;
          } else {
            img.style.filter = `brightness(${brightness})`;
          }
        });
        
        // Apply opacity ke lapisan dots
        const dots = card.querySelector('[data-dots]');
        if (dots) {
          dots.style.opacity = dotsOpacity;
        }
        
        // Mask-image: mulai fade lebih awal (sinVal=0.55) agar kartu di ujung menghilang sebelum sempat menumpuk
        if (sinVal < -0.55) {
          const fadeStop = Math.max(0, Math.min(100, ((-sinVal - 0.55) / 0.35) * 100));
          const maskStr = `linear-gradient(to right, transparent ${fadeStop}%, black ${Math.min(100, fadeStop + 30)}%)`;
          card.style.webkitMaskImage = maskStr;
          card.style.maskImage = maskStr;
        } else if (sinVal > 0.55) {
          const fadeStop = Math.max(0, Math.min(100, ((sinVal - 0.55) / 0.35) * 100));
          const maskStr = `linear-gradient(to left, transparent ${fadeStop}%, black ${Math.min(100, fadeStop + 30)}%)`;
          card.style.webkitMaskImage = maskStr;
          card.style.maskImage = maskStr;
        } else {
          card.style.webkitMaskImage = 'none';
          card.style.maskImage = 'none';
        }
        
        card.style.opacity = opacity;
        card.style.zIndex = zIndex;
        card.style.transform = `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateYVal}deg) rotateZ(${rotateZVal}deg) scale(${scale})`;
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => cancelAnimationFrame(animationFrameId);
  }, [windowWidth]);

  return (
    <div 
      ref={containerRef}
      onMouseDown={handleStart}
      onMouseMove={handleMove}
      onMouseUp={handleEnd}
      onMouseLeave={() => { handleEnd(); isHoveredRef.current = false; }}
      onTouchStart={handleStart}
      onTouchMove={handleMove}
      onTouchEnd={handleEnd}
      onMouseEnter={() => { isHoveredRef.current = true; }}
      className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] h-[170px] sm:h-[320px] md:h-[440px] flex items-center justify-center overflow-hidden py-4 select-none cursor-grab active:cursor-grabbing"
      style={{ perspective: "1200px" }}
    >
      {/* Ambient green glow di tengah belakang */}
      <div className="absolute w-[200px] h-[200px] sm:w-[350px] sm:h-[350px] bg-violet-500/20 rounded-full blur-[80px] pointer-events-none z-0" />
      
      {/* Laser vertikal hijau menyala di tengah, memotong gambar */}
      <div className="absolute top-0 bottom-0 w-[2px] bg-violet-400 shadow-[0_0_15px_#8b5cf6,0_0_30px_#8b5cf6] z-30 pointer-events-none opacity-85" />

      <div 
        className="relative w-full h-full flex items-center justify-center z-10"
        style={{ transformStyle: "preserve-3d" }}
      >
        {slides.map((slide, idx) => (
          <div
            key={idx}
            ref={(el) => (cardsRef.current[idx] = el)}
            className="absolute w-[260px] sm:w-[380px] md:w-[500px] aspect-video rounded-[24px] sm:rounded-[32px] overflow-hidden border border-zinc-800/80 bg-zinc-900 shadow-2xl cursor-pointer transition-all duration-300 ease-out hover:border-violet-500/60 hover:shadow-[0_0_50px_rgba(139,92,246,0.3)] hover:scale-105 group"
            style={{ 
              transformOrigin: "center center"
            }}
          >
            {/* Lapisan gambar utama (Full Color) */}
            <img src={slide.img} alt={slide.title} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700 ease-out" />
            
            {/* Lapisan gambar hitam-putih (Grayscale) yang akan di-clip di sebelah kanan laser */}
            <img src={slide.img} alt={slide.title} data-bw className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-all duration-700 ease-out filter grayscale z-10" />
            
            {/* Lapisan Halftone dots hologram yang memudar di tengah */}
            <div 
              data-dots
              className="absolute inset-0 pointer-events-none mix-blend-overlay transition-opacity duration-300"
              style={{
                backgroundImage: 'radial-gradient(rgba(255,255,255,0.45) 18%, transparent 19%)',
                backgroundSize: '4px 4px'
              }}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex items-end p-4 sm:p-6 z-20">
              <span className="text-white text-xs sm:text-sm md:text-base font-bold opacity-90 group-hover:opacity-100 transition-opacity">{slide.title}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [aboutTab, setAboutTab] = useState("me"); // 'me' | 'education' | 'work'
  const [projectTab, setProjectTab] = useState("web"); // 'web' | 'design' | 'achievement'

  // Popup Modals state
  const [activeModal, setActiveModal] = useState(null); // { type: 'project'|'achievement'|'poster', data: object }
  const [sliderIndex, setSliderIndex] = useState(0);

  // Auto-slide for popup images
  useEffect(() => {
    if (!activeModal || !activeModal.data.mainImg || activeModal.data.mainImg.length <= 1) return;

    const interval = setInterval(() => {
      setSliderIndex((prev) => (prev + 1) % activeModal.data.mainImg.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [activeModal]);

  // Handle scroll event for scroll-to-top button visibility
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const openPopup = (type, data) => {
    setActiveModal({ type, data });
    setSliderIndex(0);
  };

  const closePopup = () => {
    setActiveModal(null);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-violet-500 selection:text-white">
      
      {/* NAVBAR */}
      <nav className="bg-zinc-950/80 backdrop-blur-md border-b border-zinc-900 text-white fixed w-full z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* LOGO */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center font-bold text-white text-lg shadow-lg shadow-violet-500/20">
                H
              </div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                Hafiz Alwan
              </span>
            </div>

            {/* DESKTOP MENU */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" className="text-sm font-medium text-zinc-300 hover:text-violet-400 transition-colors">Home</a>
              <a href="#about" className="text-sm font-medium text-zinc-300 hover:text-violet-400 transition-colors">About</a>
              <a href="#favorit" className="text-sm font-medium text-zinc-300 hover:text-violet-400 transition-colors">Favorite</a>
              <a href="#all" className="text-sm font-medium text-zinc-300 hover:text-violet-400 transition-colors">Projects</a>
              <a 
                href="#all"
                onClick={() => setProjectTab("design")}
                className="text-sm font-medium text-zinc-300 hover:text-violet-400 transition-colors"
              >
                Graphic Design
              </a>
            </div>

            {/* BURGER BUTTON */}
            <div className="md:hidden flex items-center">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-zinc-400 hover:text-white focus:outline-none p-1"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* MOBILE MENU */}
        {mobileMenuOpen && (
          <div className="md:hidden px-4 pt-2 pb-4 space-y-2 bg-zinc-950 border-b border-zinc-900/60 animate-in fade-in slide-in-from-top-5 duration-200">
            <a 
              href="#home" 
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-zinc-300 hover:bg-zinc-900 hover:text-white"
            >
              Home
            </a>
            <a 
              href="#about" 
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-zinc-300 hover:bg-zinc-900 hover:text-white"
            >
              About
            </a>
            <a 
              href="#favorit" 
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-zinc-300 hover:bg-zinc-900 hover:text-white"
            >
              Favorite Project
            </a>
            <a 
              href="#all" 
              onClick={() => { setMobileMenuOpen(false); setProjectTab("web"); }}
              className="block px-3 py-2 rounded-md text-base font-medium text-zinc-300 hover:bg-zinc-900 hover:text-white"
            >
              All Projects
            </a>
            <a 
              href="#all" 
              onClick={() => { setMobileMenuOpen(false); setProjectTab("design"); }}
              className="block px-3 py-2 rounded-md text-base font-medium text-zinc-300 hover:bg-zinc-900 hover:text-white"
            >
              Graphic Design
            </a>
          </div>
        )}
      </nav>

      {/* HERO / HEADER */}
      <header 
        id="home" 
        style={{ 
          background: `
            linear-gradient(to bottom, rgba(9,9,11,0.80) 0%, rgba(9,9,11,0.50) 45%, rgba(9,9,11,0.90) 100%),
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 79px,
              rgba(139,92,246,0.10) 79px,
              rgba(139,92,246,0.10) 80px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 79px,
              rgba(99,102,241,0.10) 79px,
              rgba(99,102,241,0.10) 80px
            ),
            #09090b
          `
        }}
        className="relative pt-24 pb-16 md:pt-40 md:pb-24 text-center bg-center bg-no-repeat bg-cover flex flex-col items-center justify-center min-h-[90vh] overflow-hidden"
      >
        {/* Colored transparent cells scattered throughout the grid */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          {/* Top-left area */}
          <div className="absolute bg-violet-500/8 border border-violet-500/15" style={{width:80,height:80,top:80,left:160}} />
          <div className="absolute bg-indigo-500/6 border border-indigo-500/12" style={{width:80,height:80,top:240,left:80}} />
          <div className="absolute bg-violet-400/10 border border-violet-400/20" style={{width:80,height:80,top:160,left:320}} />
          <div className="absolute bg-blue-500/7 border border-blue-500/14" style={{width:80,height:80,top:400,left:160}} />
          <div className="absolute bg-indigo-400/8 border border-indigo-400/15" style={{width:80,height:80,top:320,left:0}} />
          {/* Top-right area */}
          <div className="absolute bg-violet-500/9 border border-violet-500/18" style={{width:80,height:80,top:80,right:240}} />
          <div className="absolute bg-blue-400/7 border border-blue-400/14" style={{width:80,height:80,top:240,right:80}} />
          <div className="absolute bg-indigo-500/8 border border-indigo-500/15" style={{width:80,height:80,top:160,right:320}} />
          <div className="absolute bg-violet-400/6 border border-violet-400/12" style={{width:80,height:80,top:400,right:160}} />
          <div className="absolute bg-blue-500/9 border border-blue-500/16" style={{width:80,height:80,top:320,right:0}} />
          {/* Bottom scattered */}
          <div className="absolute bg-violet-500/7 border border-violet-500/14" style={{width:80,height:80,bottom:160,left:240}} />
          <div className="absolute bg-indigo-400/8 border border-indigo-400/16" style={{width:80,height:80,bottom:80,left:400}} />
          <div className="absolute bg-blue-400/6 border border-blue-400/12" style={{width:80,height:80,bottom:160,right:240}} />
          <div className="absolute bg-violet-500/9 border border-violet-500/18" style={{width:80,height:80,bottom:80,right:400}} />
          {/* Middle outer sides */}
          <div className="absolute bg-indigo-500/7 border border-indigo-500/13" style={{width:80,height:80,top:'35%',left:0}} />
          <div className="absolute bg-violet-400/8 border border-violet-400/15" style={{width:80,height:80,top:'50%',left:80}} />
          <div className="absolute bg-blue-500/6 border border-blue-500/12" style={{width:80,height:80,top:'35%',right:0}} />
          <div className="absolute bg-indigo-400/9 border border-indigo-400/17" style={{width:80,height:80,top:'50%',right:80}} />
        </div>

        {/* Decorative ambient glow blobs */}
        <div className="glow-blob bg-violet-600/10 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] top-10 left-10" />
        <div className="glow-blob bg-blue-600/10 w-[250px] h-[250px] sm:w-[400px] sm:h-[400px] bottom-10 right-10" />
        

        <div className="relative z-10 w-full max-w-7xl px-6 flex flex-col items-center">
          <div className="focus-in-expand max-w-4xl mx-auto flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-400 text-sm font-semibold mb-6 shadow-[0_0_15px_rgba(139,92,246,0.15)]">
              <Sparkles size={16} /> Hi, Saya Hafiz Alwan 👋
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 font-outfit text-white">
              Create Stunning Websites & Visuals
              <span className="block bg-gradient-to-r from-violet-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent mt-2 filter drop-shadow-[0_0_20px_rgba(139,92,246,0.4)]">
                with Just a Concept
              </span>
            </h1>
            <p className="text-zinc-400 text-base md:text-lg max-w-2xl mx-auto mb-8 leading-relaxed font-light">
              Mengubah ide Anda menjadi aplikasi web interaktif berkualitas tinggi dan grafis visual menakjubkan dalam hitungan detik.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10 relative z-20">
              <a 
                href="#all" 
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-zinc-950 border border-zinc-800 hover:border-violet-500/60 text-white font-medium hover:bg-zinc-900 transition-all duration-300 shadow-[0_0_25px_rgba(99,102,241,0.2)] hover:shadow-[0_0_30px_rgba(99,102,241,0.35)] flex items-center justify-center gap-2 group"
              >
                Lihat Projek Saya 
                <span className="transform group-hover:translate-x-1 transition-transform">→</span>
              </a>
              <a href="#about" className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white font-medium hover:bg-zinc-800 transition-all duration-300 flex items-center justify-center gap-2">
                Tentang Saya
              </a>
            </div>
          </div>
          
          {/* Interactive 3D infinity Ring Slider - Located below the CTA button */}
          <div className="w-full my-6">
            <ThreeDRingSlider />
          </div>

          {/* Three Feature columns at the bottom - Styled exactly like the Framer reference */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mt-10 sm:mt-12 w-full max-w-5xl text-left border-t border-zinc-900 pt-10 sm:pt-12">
            <div>
              <h3 className="text-white font-semibold text-lg mb-2">Lightning-Fast Web Apps</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Tulis ide Anda, tekan enter, dan saksikan antarmuka komponen React yang interaktif serta responsif langsung menyala di layar.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg mb-2">Tailored Brand Aesthetics</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Pilih gaya visual modern dan sesuaikan detail halus seperti harmoni palet warna, tipografi premium, serta tata letak artistik.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg mb-2">Production-Ready Code</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Kembangkan karya Anda ke dalam basis kode yang rapi, modular, dan dioptimalkan secara penuh untuk performa kecepatan web terbaik.
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* SKILLS SECTION */}
      <section className="py-20 bg-zinc-950 border-t border-zinc-900 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="glow-blob bg-violet-800/10 w-[400px] h-[400px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Web Dev skill */}
            <div className="p-8 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 card-glow-hover group">
              <div className="w-14 h-14 rounded-xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(139,92,246,0.15)]">
                <img src="/asset/logo/logos_web-dev-icon.png" className="w-8 h-8 object-contain" alt="Web Dev icon" />
              </div>
              <h3 className="text-2xl font-bold text-zinc-100 mb-4">Web Development</h3>
              <p className="text-zinc-400 leading-relaxed text-base">
                Mengembangkan website dengan pendekatan modern menggunakan Laravel, React JS, JavaScript, dan Tailwind CSS. Terbiasa membangun dashboard interaktif, sistem kasir digital, manajemen produk, dan integrasi AI chatbot.
              </p>
            </div>
            
            {/* Graphic Design skill */}
            <div className="p-8 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 card-glow-hover group">
              <div className="w-14 h-14 rounded-xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(139,92,246,0.15)]">
                <img src="/asset/logo/fluent-color_design-ideas-32.png" className="w-8 h-8 object-contain" alt="Design icon" />
              </div>
              <h3 className="text-2xl font-bold text-zinc-100 mb-4">Graphic Design</h3>
              <p className="text-zinc-400 leading-relaxed text-base">
                Berpengalaman dalam pembuatan desain poster manipulation, visual branding, manipulasi foto, dan 3D visualizer menggunakan Photoshop serta SketchUp. Pernah meraih berbagai kejuaraan dari tingkat Kabupaten hingga Nasional.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* STATS COUNT SECTION */}
      <section className="py-16 bg-gradient-to-b from-zinc-950 to-zinc-900 border-t border-b border-zinc-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center justify-items-center">
            <div className="p-4">
              <Counter target="8+" />
              <h5 className="text-zinc-400 text-sm md:text-base mt-2 font-medium">Web App & Landing Page</h5>
            </div>
            <div className="p-4">
              <Counter target="5+" />
              <h5 className="text-zinc-400 text-sm md:text-base mt-2 font-medium">UI/UX Projects</h5>
            </div>
            <div className="p-4">
              <Counter target="1120+" />
              <h5 className="text-zinc-400 text-sm md:text-base mt-2 font-medium">Graphic Designs</h5>
            </div>
            <div className="p-4">
              <Counter target="9+" />
              <h5 className="text-zinc-400 text-sm md:text-base mt-2 font-medium">Prestasi & Penghargaan</h5>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT ME SECTION */}
      <section id="about" className="py-28 bg-zinc-950 relative overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-violet-600/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">

          {/* Section header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-400 text-sm font-semibold mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
              Tentang Saya
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-zinc-100 tracking-tight">
              Kenali Lebih Dekat
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-violet-500 to-blue-500 rounded-full mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">

            {/* LEFT — Photo + Info card */}
            <div className="lg:col-span-2 flex flex-col items-center gap-6 w-full">
              {/* Photo frame with glowing ring */}
              <div className="relative w-full max-w-[260px] mx-auto">
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-violet-600 via-blue-500 to-indigo-600 blur-sm opacity-60 animate-pulse" />
                <div className="relative rounded-3xl overflow-hidden border-2 border-zinc-800 shadow-2xl w-full aspect-[4/5]">
                  <img
                    className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-700"
                    src="/asset/e3438035-c605-4a2f-9100-2431522526c5.jfif"
                    alt="Hafiz Alwan"
                  />
                  {/* Gradient overlay bottom */}
                  <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-zinc-950/80 to-transparent" />
                  <div className="absolute bottom-4 left-0 right-0 text-center">
                    <p className="text-white text-sm font-bold">Hafiz Alwan</p>
                    <p className="text-violet-400 text-xs">Fullstack Dev & Designer</p>
                  </div>
                </div>
              </div>

              {/* Quick info glass card */}
              <div className="w-full rounded-2xl border border-zinc-800/80 bg-zinc-900/50 backdrop-blur-sm p-4 sm:p-5 space-y-3">
                {[
                  { icon: "ph:graduation-cap-bold", label: "Kampus", value: "Telkom University", color: "text-violet-400" },
                  { icon: "ph:map-pin-bold", label: "Lokasi", value: "Purwokerto, Indonesia", color: "text-blue-400" },
                  { icon: "ph:briefcase-bold", label: "Status", value: "Available for Hire", color: "text-indigo-400" },
                  { icon: "ph:lightning-bold", label: "Fokus", value: "Web Dev & UI Design", color: "text-violet-300" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Icon icon={item.icon} className={`text-xl w-7 flex-shrink-0 ${item.color}`} />
                    <div className="min-w-0">
                      <p className="text-zinc-500 text-[11px] uppercase tracking-wider font-medium">{item.label}</p>
                      <p className="text-zinc-200 text-sm font-medium truncate">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Social buttons */}
              <div className="flex gap-3 w-full">
                <a href="https://fiverr.com" target="_blank" rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold shadow-lg shadow-violet-600/25 hover:shadow-violet-600/40 hover:scale-105 transition-all duration-300">
                  <img src="/asset/logo/Fiverr-Logo-500x281.png" className="h-[18px] brightness-0 invert" alt="Fiverr" />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-300 text-sm font-semibold hover:bg-zinc-700 hover:text-white hover:scale-105 transition-all duration-300">
                  Instagram
                </a>
              </div>
            </div>

            {/* RIGHT — Tab content */}
            <div className="lg:col-span-3">
              {/* Tab navigation */}
              <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-sm mb-8 w-full sm:w-fit">
                {[
                  { key: "me", label: "About Me", icon: "ph:user-circle-bold" },
                  { key: "education", label: "Pendidikan", icon: "ph:graduation-cap-bold" },
                  { key: "work", label: "Pengalaman", icon: "ph:briefcase-bold" },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setAboutTab(tab.key)}
                    className={`flex-1 sm:flex-none px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2 ${
                      aboutTab === tab.key
                        ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-600/30"
                        : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60"
                    }`}
                  >
                    <Icon icon={tab.icon} className="text-base" />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab: About Me */}
              {aboutTab === "me" && (
                <div className="animate-in fade-in duration-300 space-y-6">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold text-zinc-100 tracking-tight mb-1 flex items-center gap-3">Halo, Saya Hafiz! <Icon icon="ph:hand-waving-bold" className="text-yellow-400" /></h3>
                    <div className="w-12 h-0.5 bg-gradient-to-r from-violet-500 to-transparent rounded-full mt-2 mb-5" />
                    <p className="text-zinc-400 leading-relaxed">
                      Saya <span className="text-violet-400 font-semibold">Hafiz Alwan Susilo</span>, seorang mahasiswa di Telkom University Purwokerto dengan minat besar di bidang pemrograman, desain web, dan pengembangan aplikasi interaktif.
                    </p>
                    <p className="text-zinc-400 leading-relaxed mt-4">
                      Pernah meraih <span className="text-white font-medium">Juara 1 Desain Poster</span> tingkat Kabupaten dan Provinsi (2023–2024), serta <span className="text-white font-medium">Juara 1 Web Design</span> di Universitas Soedirman. Aktif di animasi dan pemrograman sejak SMP.
                    </p>
                  </div>

                  {/* Tech Stack with logos */}
                  <div>
                    <p className="text-zinc-500 text-xs uppercase tracking-widest font-semibold mb-3">Tech Stack</p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { name: "React JS",       icon: "logos:react",                bg: "bg-sky-500/8",      border: "border-sky-500/20" },
                        { name: "Laravel",         icon: "logos:laravel",              bg: "bg-red-500/8",      border: "border-red-500/20" },
                        { name: "JavaScript",      icon: "logos:javascript",           bg: "bg-yellow-400/8",   border: "border-yellow-400/20" },
                        { name: "Tailwind CSS",    icon: "logos:tailwindcss-icon",     bg: "bg-cyan-400/8",     border: "border-cyan-400/20" },
                        { name: "PHP",             icon: "logos:php",                  bg: "bg-indigo-400/8",   border: "border-indigo-400/20" },
                        { name: "MySQL",           icon: "logos:mysql",                bg: "bg-orange-400/8",   border: "border-orange-400/20" },
                        { name: "Photoshop",       icon: "logos:adobe-photoshop",      bg: "bg-blue-500/8",     border: "border-blue-500/20" },
                        { name: "SketchUp",        icon: "simple-icons:sketchup",      bg: "bg-blue-400/8",     border: "border-blue-400/20" },
                        { name: "Figma",           icon: "logos:figma",                bg: "bg-violet-400/8",   border: "border-violet-400/20" },
                        { name: "Flowise AI",      icon: "ph:robot-bold",              bg: "bg-violet-500/8",   border: "border-violet-500/20" },
                        { name: "Gemini",          icon: "simple-icons:googlegemini",  bg: "bg-blue-500/8",     border: "border-blue-500/20" },
                        { name: "ChatGPT",         icon: "simple-icons:openai",        bg: "bg-emerald-500/8",  border: "border-emerald-500/20" },
                        { name: "Canva",           icon: "logos:canva",                bg: "bg-cyan-500/8",     border: "border-cyan-500/20" },
                        { name: "CorelDRAW",       icon: "simple-icons:coreldraw",     bg: "bg-green-500/8",    border: "border-green-500/20" },
                        { name: "Git",             icon: "logos:git-icon",             bg: "bg-orange-500/8",   border: "border-orange-500/20" },
                        { name: "Apps Script",     icon: "logos:google-icon",          bg: "bg-blue-400/8",     border: "border-blue-400/20" },
                      ].map((tech) => (
                        <div
                          key={tech.name}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl ${tech.bg} border ${tech.border} hover:brightness-125 hover:scale-105 transition-all duration-200 group cursor-default`}
                        >
                          <Icon icon={tech.icon} className="text-lg flex-shrink-0" />
                          <span className="text-zinc-300 text-xs font-medium group-hover:text-white transition-colors whitespace-nowrap">{tech.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Achievement highlight cards */}
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { icon: "ph:trophy-bold", color: "text-yellow-400", value: "Juara 1", desc: "Web Design Competition" },
                      { icon: "ph:palette-bold", color: "text-violet-400", value: "1120+", desc: "Desain Visual Dibuat" },
                      { icon: "ph:star-bold", color: "text-blue-400", value: "9+", desc: "Prestasi & Penghargaan" },
                      { icon: "ph:rocket-launch-bold", color: "text-indigo-400", value: "8+", desc: "Web App Dibangun" },
                    ].map((item, i) => (
                      <div key={i} className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/80 hover:border-violet-500/30 hover:bg-zinc-900 transition-all duration-300 group">
                        <Icon icon={item.icon} className={`text-2xl ${item.color}`} />
                        <p className="text-white font-bold text-lg mt-2 group-hover:text-violet-300 transition-colors">{item.value}</p>
                        <p className="text-zinc-500 text-xs mt-0.5">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab: Education */}
              {aboutTab === "education" && (
                <div className="animate-in fade-in duration-300 space-y-5">
                  <div>
                    <h3 className="text-2xl font-bold text-zinc-100 mb-1">Pendidikan</h3>
                    <div className="w-12 h-0.5 bg-gradient-to-r from-violet-500 to-transparent rounded-full mt-2 mb-5" />
                  </div>
                  {[
                    {
                      active: true,
                      period: "2023 – Sekarang",
                      institution: "Telkom University Purwokerto",
                      major: "S1 Rekayasa Perangkat Lunak",
                      icon: "ph:graduation-cap-bold",
                      tags: ["Informatika", "Software Engineering"],
                    },
                    {
                      active: false,
                      period: "2020 – 2023",
                      institution: "SMK Negeri 1 Purwokerto",
                      major: "Rekayasa Perangkat Lunak (RPL)",
                      icon: "ph:building-bold",
                      tags: ["Programming", "Database", "Web Dev"],
                    },
                  ].map((edu, i) => (
                    <div key={i} className={`relative p-5 rounded-2xl border transition-all duration-300 hover:scale-[1.01] ${edu.active ? "bg-violet-600/5 border-violet-500/30 shadow-[0_0_30px_rgba(139,92,246,0.08)]" : "bg-zinc-900/40 border-zinc-800/80"}`}>
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${edu.active ? "bg-violet-600/15 border border-violet-500/30" : "bg-zinc-800 border border-zinc-700"}`}>
                          <Icon icon={edu.icon} className={`text-2xl ${edu.active ? "text-violet-400" : "text-zinc-400"}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${edu.active ? "bg-violet-600/20 text-violet-400" : "bg-zinc-800 text-zinc-500"}`}>{edu.period}</span>
                            {edu.active && <span className="text-xs font-bold text-emerald-400 animate-pulse">● Aktif</span>}
                          </div>
                          <h4 className="text-base font-bold text-zinc-100">{edu.institution}</h4>
                          <p className="text-zinc-400 text-sm mt-0.5">{edu.major}</p>
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {edu.tags.map((tag) => (
                              <span key={tag} className="text-[10px] px-2 py-0.5 rounded-md bg-zinc-800 border border-zinc-700 text-zinc-400">{tag}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab: Work Experience */}
              {aboutTab === "work" && (
                <div className="animate-in fade-in duration-300 space-y-5">
                  <div>
                    <h3 className="text-2xl font-bold text-zinc-100 mb-1">Work Experience</h3>
                    <div className="w-12 h-0.5 bg-gradient-to-r from-violet-500 to-transparent rounded-full mt-2 mb-5" />
                  </div>
                  {[
                    {
                      active: true,
                      type: "Full Time",
                      period: "2025 – Sekarang",
                      company: "Dr Kreatif",
                      role: "Graphic Designer & WordPress Admin",
                      icon: "ph:palette-bold",
                      bullets: ["Desain visual komersial (logo, brosur, materi promo)", "Modeling 3D dengan SketchUp", "Mengelola website klien berbasis WordPress"],
                    },
                    {
                      active: false,
                      type: "Internship",
                      period: "4 Bulan",
                      company: "CV. Prabu Bima Tech",
                      role: "Fullstack Developer",
                      icon: "ph:code-bold",
                      bullets: ["Web App E-Voting Pemilihan Ketua OSIS", "E-commerce \"Baju Bagus Inc\" terintegrasi AI Chatbot (Flowise)"],
                    },
                    {
                      active: false,
                      type: "Internship",
                      period: "3 Bulan",
                      company: "CV. JVM Purwokerto",
                      role: "Graphic Designer",
                      icon: "ph:pen-nib-bold",
                      bullets: ["Predikat \"Excellent Performance\" peserta terbaik", "371 desain feed Instagram untuk 4 brand berbeda"],
                    },
                  ].map((work, i) => (
                    <div key={i} className={`relative p-5 rounded-2xl border transition-all duration-300 hover:scale-[1.01] ${work.active ? "bg-violet-600/5 border-violet-500/30 shadow-[0_0_30px_rgba(139,92,246,0.08)]" : "bg-zinc-900/40 border-zinc-800/80"}`}>
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${work.active ? "bg-violet-600/15 border border-violet-500/30" : "bg-zinc-800 border border-zinc-700"}`}>
                          <Icon icon={work.icon} className={`text-2xl ${work.active ? "text-violet-400" : "text-zinc-400"}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${work.active ? "bg-violet-600/20 text-violet-400" : "bg-zinc-800 text-zinc-500"}`}>{work.type}</span>
                            <span className="text-zinc-600 text-xs">{work.period}</span>
                            {work.active && <span className="text-xs font-bold text-emerald-400 animate-pulse">● Aktif</span>}
                          </div>
                          <h4 className="text-base font-bold text-zinc-100">{work.company}</h4>
                          <p className="text-violet-400 text-sm font-medium mt-0.5">{work.role}</p>
                          <ul className="mt-3 space-y-1">
                            {work.bullets.map((b, bi) => (
                              <li key={bi} className="text-zinc-400 text-sm flex items-start gap-2">
                                <Icon icon="ph:caret-right-bold" className="text-violet-500 mt-0.5 flex-shrink-0" />
                                {b}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE LOOP */}
      <section className="relative overflow-hidden py-10 bg-zinc-900 border-t border-b border-zinc-800">
        <div className="flex whitespace-nowrap animate-marquee">
          <marquee className="text-white text-2xl font-bold tracking-wider" scrollamount="12" behavior="scroll" direction="left">
            PORTFOLIO SHOWCASE • WEB DEVELOPMENT • REACT JS • LARAVEL • TAILWIND CSS • GRAPHIC DESIGN • POSTER MANIPULATION • UI/UX DESIGN • FLOWISE AI • RESPONSIVE LAYOUT • FULLSTACK WEB DEVELOPER • 
          </marquee>
        </div>
      </section>

      {/* FAVORITE PROJECT */}
      <section id="favorit" className="py-24 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-400 text-xs font-semibold mb-4">
                PROJEK UNGGULAN
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-zinc-100 tracking-tight leading-tight">
                Projek Favorit: Baju Bagus Inc.
              </h2>
              <p className="mt-6 text-zinc-400 leading-relaxed text-lg">
                Saya membuat platform e-commerce Baju Bagus Inc dengan manajemen produk terstruktur untuk 1.500+ katalog, chatbot AI pintar untuk merekomendasikan baju, panel kasir instan yang memangkas checkout hingga 40%, serta dashboard analytics untuk sales data secara real-time.
              </p>
              
              {/* Tech Stack Icons */}
              <div className="flex flex-wrap items-center gap-5 mt-8">
                {/* JavaScript SVG */}
                <svg xmlns="http://www.w3.org/2000/svg" width="55" height="55" viewBox="0 0 256 256" className="w-12 h-12 hover:scale-110 transition-transform">
                  <path fill="#f7df1e" d="M0 0h256v256H0z" />
                  <path
                    d="m67.312 213.932l19.59-11.856c3.78 6.701 7.218 12.371 15.465 12.371c7.905 0 12.89-3.092 12.89-15.12v-81.798h24.057v82.138c0 24.917-14.606 36.259-35.916 36.259c-19.245 0-30.416-9.967-36.087-21.996m85.07-2.576l19.588-11.341c5.157 8.421 11.859 14.607 23.715 14.607c9.969 0 16.325-4.984 16.325-11.858c0-8.248-6.53-11.17-17.528-15.98l-6.013-2.58c-17.357-7.387-28.87-16.667-28.87-36.257c0-18.044 13.747-31.792 35.228-31.792c15.294 0 26.292 5.328 34.196 19.247l-18.732 12.03c-4.125-7.389-8.591-10.31-15.465-10.31c-7.046 0-11.514 4.468-11.514 10.31c0 7.217 4.468 10.14 14.778 14.608l6.014 2.577c20.45 8.765 31.963 17.7 31.963 37.804c0 21.654-17.012 33.51-39.867 33.51c-22.339 0-36.774-10.654-43.819-24.574" />
                </svg>
                {/* Laravel SVG */}
                <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128" className="w-12 h-12 hover:scale-110 transition-transform">
                  <path fill="#f0513f"
                    d="M7.595 45.354a.6.6 0 0 0-.291.078L.292 49.468c-.024.015-.043.034-.065.05q-.03.021-.057.044q-.028.032-.052.068c-.013.018-.029.033-.04.052q-.022.044-.037.091c-.006.017-.016.032-.02.05a.6.6 0 0 0-.021.152v24.013c0 .21.112.403.293.507l14.022 8.073c.031.018.064.028.097.04c.015.005.03.014.045.018q.074.02.15.02a.6.6 0 0 0 .15-.02q.02-.006.04-.016c.034-.012.069-.023.101-.042l14.023-8.073a.58.58 0 0 0 .293-.506v-7.667l6.718-3.868a.59.59 0 0 0 .293-.507v-8.005a.6.6 0 0 0-.02-.152l-.021-.049c-.012-.03-.021-.062-.038-.09c-.01-.02-.027-.035-.04-.052c-.017-.023-.031-.048-.052-.068c-.016-.017-.038-.03-.057-.044q-.03-.027-.064-.05h-.001L28.92 49.4a.58.58 0 0 0-.583 0l-7.011 4.037q-.035.023-.065.05q-.03.02-.057.043q-.028.032-.052.068c-.013.018-.03.034-.04.053q-.022.043-.038.09l-.02.049a.6.6 0 0 0-.02.152v7.667l-5.843 3.364V49.975a.6.6 0 0 0-.02-.153l-.021-.049c-.012-.03-.021-.062-.038-.09c-.01-.02-.027-.035-.04-.053q-.024-.035-.052-.068q-.027-.023-.057-.044q-.03-.026-.064-.05h-.001l-7.011-4.036a.6.6 0 0 0-.292-.078m0 1.258l5.84 3.363l-5.84 3.362l-5.84-3.362zm21.034 3.968l5.84 3.363l-5.84 3.362l-5.84-3.362zm-14.607.405v14.66l-3.389 1.952L8.18 69.01V54.35l3.39-1.952zm-12.854 0l2.453 1.413l3.39 1.951v15.674c0 .022.006.043.009.065c.003.029.004.058.011.086v.001c.007.023.02.044.028.066c.01.024.017.05.03.073l.002.002c.012.02.029.037.043.056q.022.033.048.062l.002.002q.027.023.056.042q.03.027.063.05h.003l.002.002l6.715 3.8v6.722l-12.854-7.4zm44.379 2.96v19.714h9.321v-2.901h-6.083V53.945Zm79.384 0v19.714H128V53.945ZM22.2 54.953l2.455 1.413l3.389 1.951v6.656l-2.454-1.412l-3.39-1.951Zm12.855 0v6.657l-5.843 3.364v-6.657l3.39-1.951zm27.19 5.243q-1.492 0-2.731.55a6.4 6.4 0 0 0-2.127 1.507a7.13 7.13 0 0 0-1.873 4.844q0 1.408.493 2.647a7 7 0 0 0 1.38 2.197q.887.957 2.127 1.506q1.239.55 2.732.55q1.155 0 2.295-.564q1.14-.562 1.76-1.549v1.775h3.07V60.535h-3.07v1.774q-.62-.985-1.76-1.549q-1.14-.563-2.295-.563zm24.954 0q-1.493 0-2.733.55a6.4 6.4 0 0 0-2.126 1.507a7 7 0 0 0-1.38 2.21a7.1 7.1 0 0 0-.493 2.634q0 1.408.493 2.647a7 7 0 0 0 1.38 2.197a6.4 6.4 0 0 0 2.126 1.506q1.239.55 2.733.55q1.154 0 2.295-.564q1.14-.562 1.76-1.549v1.775h3.07V60.535h-3.07v1.774q-.62-.985-1.76-1.549q-1.14-.563-2.295-.563zm29.236.001c-3.759 0-6.734 3.09-6.734 6.9c0 4.212 2.88 6.9 7.128 6.9c2.377 0 3.895-.91 5.75-2.89l-2.074-1.604c-.001.002-1.565 2.055-3.9 2.055c-2.716 0-3.858-2.188-3.858-3.32h10.183c.535-4.336-2.315-8.04-6.495-8.04zm-44.642.338v13.124h3.07V63.555h5.267v-3.02zm24.012 0l5.038 13.124h3.859l5.038-13.124h-3.11l-3.857 10.05l-3.859-10.05zm-74.188 2.087l5.836 3.36l-4.282 2.444l-8.567 4.89l-5.831-3.3l6.124-3.526zm94.794.014c3.279 0 3.677 3.067 3.7 3.32h-7.356c.023-.252.377-3.32 3.656-3.32m-53.997.293q.873 0 1.592.338q.718.338 1.225.9q.507.565.789 1.324q.28.76.281 1.606q0 .845-.281 1.605a4.1 4.1 0 0 1-.789 1.324a3.8 3.8 0 0 1-1.225.9a3.7 3.7 0 0 1-1.592.339a3.6 3.6 0 0 1-1.577-.338a3.9 3.9 0 0 1-1.21-.901a3.9 3.9 0 0 1-.775-1.324a4.8 4.8 0 0 1-.268-1.605q0-.846.268-1.606q.267-.759.775-1.323a3.9 3.9 0 0 1 1.21-.901q.704-.338 1.578-.338zm24.953 0a3.7 3.7 0 0 1 1.591.338q.72.338 1.226.9q.506.565.788 1.324a4.6 4.6 0 0 1 .282 1.606a4.6 4.6 0 0 1-.282 1.605a4.1 4.1 0 0 1-.788 1.324a3.8 3.8 0 0 1-1.226.9a3.7 3.7 0 0 1-1.59.339a3.6 3.6 0 0 1-1.578-.338a3.9 3.9 0 0 1-1.211-.901a3.9 3.9 0 0 1-.774-1.324a4.8 4.8 0 0 1-.268-1.605q0-.846.267-1.606q.267-.759.775-1.323a3.9 3.9 0 0 1 1.21-.901q.705-.338 1.578-.338M28.045 66.99v6.66l-12.854 7.4v-6.723l9.52-5.434z" />
                </svg>
                {/* Tailwind SVG */}
                <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128" className="w-12 h-12 hover:scale-110 transition-transform">
                  <path fill="#38bdf8"
                    d="M13.227 56.074c-3.528 0-5.727 1.778-6.602 5.301c1.324-1.773 2.875-2.426 4.625-1.977c1 .25 1.727.977 2.523 1.801c1.301 1.324 2.801 2.852 6.079 2.852c3.523 0 5.722-1.778 6.597-5.301c-1.324 1.773-2.875 2.426-4.625 1.977c-1-.25-1.722-.977-2.523-1.801c-1.301-1.324-2.801-2.852-6.074-2.852M6.602 64C3.074 64 .875 65.773 0 69.3c1.324-1.777 2.875-2.425 4.625-1.976c1 .25 1.727.977 2.523 1.801c1.301 1.324 2.801 2.852 6.079 2.852c3.523 0 5.722-1.778 6.597-5.301c-1.324 1.773-2.875 2.426-4.625 1.972c-1-.25-1.722-.972-2.523-1.796C11.398 65.523 9.898 64 6.602 64m0 0" />
                  <path fill="#fff"
                    d="M39.676 62.75h-2.301v4.477c0 1.199.773 1.171 2.3 1.097v1.801c-3.1.375-4.323-.477-4.323-2.898V62.75h-1.704v-1.926h1.704v-2.5l2-.597v3.097h2.296v1.926zm8.8-1.926h2v9.301h-2v-1.352c-.703.977-1.8 1.579-3.25 1.579c-2.527 0-4.624-2.153-4.624-4.903c0-2.773 2.097-4.898 4.625-4.898c1.449 0 2.546.597 3.25 1.574zm-2.953 7.625c1.676 0 2.954-1.25 2.954-2.972c0-1.727-1.278-2.977-2.954-2.977c-1.671 0-2.949 1.25-2.949 2.977c.028 1.722 1.278 2.972 2.95 2.972zm8.301-9.023c-.699 0-1.273-.602-1.273-1.278c0-.699.574-1.273 1.273-1.273c.7 0 1.278.574 1.278 1.273c.023.676-.579 1.278-1.278 1.278m-1 10.699v-9.3h2v9.3zm4.324 0V56.551h2v13.574zm15.079-9.3h2.125l-2.926 9.3h-1.977l-1.926-6.273l-1.949 6.273h-1.972l-2.926-9.3H62.8l1.8 6.425l1.95-6.426h1.926l1.921 6.426zm4.597-1.4c-.699 0-1.273-.6-1.273-1.277c0-.699.574-1.273 1.273-1.273c.7 0 1.278.574 1.278 1.273c.023.676-.551 1.278-1.278 1.278zm-1 10.7v-9.3h2v9.3zm9.227-9.55c2.074 0 3.574 1.425 3.574 3.823v5.727h-2v-5.5c0-1.426-.824-2.148-2.074-2.148c-1.324 0-2.375.773-2.375 2.671v5h-2v-9.296h2v1.199c.625-1 1.625-1.477 2.875-1.477zm13.125-3.473h2v13.023h-2v-1.352c-.7.977-1.801 1.579-3.25 1.579c-2.528 0-4.625-2.153-4.625-4.903c0-2.773 2.097-4.898 4.625-4.898c1.449 0 2.55.597 3.25 1.574zm-2.95 11.347c1.672 0 2.95-1.25 2.95-2.972c0-1.727-1.278-2.977-2.95-2.977c-1.675 0-2.953 1.25-2.953 2.977c0 1.722 1.278 2.972 2.954 2.972zm11.672 1.926c-2.796 0-4.921-2.148-4.921-4.898c0-2.778 2.097-4.903 4.921-4.903c1.829 0 3.403.95 4.153 2.403l-1.727 1c-.398-.875-1.324-1.426-2.449-1.426c-1.648 0-2.875 1.25-2.875 2.926c0 1.671 1.25 2.921 2.875 2.921c1.125 0 2.023-.574 2.477-1.421l1.722.972c-.75 1.477-2.347 2.426-4.176 2.426m7.528-7c0 1.7 5 .676 5 4.125c0 1.852-1.625 2.875-3.625 2.875c-1.852 0-3.2-.852-3.801-2.176l1.727-1c.296.852 1.046 1.352 2.074 1.352c.898 0 1.574-.301 1.574-1.051c0-1.648-5-.727-5-4.05c0-1.75 1.5-2.848 3.398-2.848c1.528 0 2.801.699 3.454 1.921l-1.704.954c-.324-.727-.972-1.051-1.75-1.051c-.722-.028-1.347.3-1.347.949m8.574 0c0 1.7 5 .676 5 4.125c0 1.852-1.625 2.875-3.625 2.875c-1.852 0-3.2-.852-3.8-2.176l1.726-1c.3.852 1.05 1.352 2.074 1.352c.898 0 1.574-.301 1.574-1.051c0-1.648-5-.727-5-4.05c0-1.75 1.5-2.848 3.403-2.848c1.523 0 2.796.699 3.449 1.921l-1.7.954c-.328-.727-.976-1.051-1.75-1.051c-.726-.028-1.351.3-1.351.949m0 0" />
                </svg>
                {/* Flowise SVG */}
                <svg xmlns="http://www.w3.org/2000/svg" width="58" height="58" viewBox="0 0 128 128" className="w-12 h-12 text-zinc-100 hover:scale-110 transition-transform">
                  <path fill="currentColor"
                    d="m47.961 79.02l.193.094l.344.166q.658.315 1.329.615l.281.125q.769.337 1.551.645l.378.148q.725.283 1.463.543l.184.063c.539.188 1.083.363 1.632.534l.395.117c.558.169 1.109.37 1.685.477c36.554 6.665 47.171-21.967 47.171-21.967c-8.918 11.618-24.747 14.683-39.745 11.271c-.568-.128-1.12-.306-1.674-.47l-.417-.126a51 51 0 0 1-1.612-.524l-.221-.08a51 51 0 0 1-1.421-.527l-.398-.156a43 43 0 0 1-1.534-.638l-.307-.136a61 61 0 0 1-1.294-.602l-.375-.18c-.336-.164-.669-.339-1.001-.51l-.668-.35a38 38 0 0 1-1.199-.673l-.405-.226a59 59 0 0 1-1.563-.958l-.421-.28a41 41 0 0 1-1.112-.739l-.358-.252q-.53-.375-1.051-.76l-.466-.353a47 47 0 0 1-.948-.74l-.423-.34a62 62 0 0 1-1.182-.995l-.129-.109A50 50 0 0 1 43.399 60l-.35-.337q-.454-.43-.893-.874l-.35-.35a50 50 0 0 1-1.095-1.158l-.054-.058a44 44 0 0 1-1.111-1.264l-.291-.346q-.406-.488-.799-.988l-.293-.364a53 53 0 0 1-.923-1.229c-8.326-11.358-11.318-27.023-4.663-39.888l-5.899 7.482c-7.559 10.863-6.617 24.997-.844 36.541l.423.821l.271.52l.168.299l.301.539q.268.474.55.944l.315.519q.312.503.64 1l.272.422q.451.674.926 1.336l.027.035l.156.211q.414.568.844 1.123l.318.404q.383.482.78.959l.298.355q.532.63 1.087 1.242l.022.023l.042.046c.36.394.73.778 1.104 1.164l.354.357q.435.437.882.865l.361.343q.594.561 1.208 1.101l.02.015l.21.18q.543.47 1.099.928l.455.362q.453.363.916.716l.489.372q.51.375 1.027.737l.375.266l.103.073c.328.226.663.442.998.659l.432.288q.77.49 1.562.956l.432.244q.58.335 1.172.656l.648.336zm3.693-36.795c.819 1.174 1.726 2.57 2.813 3.514c.394.434.806.856 1.226 1.273l.324.318q.612.595 1.252 1.164l.052.044l.012.013c.475.416.965.816 1.463 1.21l.333.26c.5.383 1.009.759 1.531 1.118l.045.033l.698.46l.332.22c.373.238.75.472 1.135.694l.16.093q.498.287 1.003.561l.356.187l.702.363l.106.048q.722.356 1.464.682l.323.133q.595.254 1.199.487l.514.188c.366.136.732.26 1.102.383l.499.16c.526.163 1.045.369 1.593.46c28.222 4.677 34.738-17.054 34.738-17.054c-5.874 8.459-17.248 12.494-29.386 9.344a34 34 0 0 1-1.598-.462l-.481-.155q-.563-.182-1.118-.385l-.504-.188a40 40 0 0 1-1.204-.485l-.324-.138a32 32 0 0 1-1.472-.685l-.739-.376l-.426-.219q-.471-.257-.934-.527l-.223-.127a36 36 0 0 1-1.132-.689l-.341-.229l-.732-.484a38 38 0 0 1-1.525-1.115l-.343-.271c-5.313-4.193-9.524-9.927-11.527-16.428c-2.098-6.74-1.646-14.308 1.989-20.449l-4.466 6.306c-5.466 7.865-5.169 18.396-.905 26.715a35 35 0 0 0 2.416 4.035m29.747-9.731l.701.243l.309.098c.333.104.662.226 1.005.29c15.583 3.011 19.811-7.997 20.936-9.617c-3.703 5.331-9.925 6.61-17.56 4.757a19 19 0 0 1-1.848-.57a23 23 0 0 1-2.193-.91a22.7 22.7 0 0 1-3.846-2.347c-6.832-5.185-11.076-15.072-6.618-23.126l-2.412 3.324c-3.222 4.743-3.539 10.633-1.303 15.869c2.358 5.56 7.19 9.92 12.829 11.989M66.359 96.295h-4.226a.56.56 0 0 0-.517.417l-1.5 6.94l-1.5 6.94a.554.554 0 0 1-.516.417h-2.991c-2.959 0-2.617-2.047-2.011-4.851l.018-.085l.066-.354l.012-.066l.135-.72l.145-.771l.154-.785l.682-3.332l.683-3.332a.336.336 0 0 0-.341-.419h-4.337a.55.55 0 0 0-.514.418l-.933 4.424l-.932 4.425l-.002.006l-.086.412c-1.074 4.903-.79 9.58 5.048 9.727l.17.003h9.163a.554.554 0 0 0 .516-.417l1.976-9.289l1.976-9.29c.049-.23-.103-.417-.338-.418m-45.256-.049h-4.64a.56.56 0 0 0-.521.416l-.44 1.942l-.44 1.942c-.051.229.098.416.333.416h4.676a.56.56 0 0 0 .518-.417l.425-1.941l.425-1.941c.049-.229-.101-.417-.336-.417m-1.346 6.044H15.08a.56.56 0 0 0-.521.416l-.657 2.91l-.656 2.909l-.183.834l-.631 2.97l-.63 2.971c-.049.229-.15.599-.225.821c0 0-.874 2.6-2.343 2.57l-.184-.004l-1.271-.023h-.001a.56.56 0 0 0-.524.407l-.485 2.039l-.484 2.038c-.055.228.093.416.326.42c.833.01 2.699.031 3.828.031c3.669 0 5.604-2.033 6.843-7.883l1.451-6.714l1.361-6.297c.049-.227-.103-.415-.337-.415m86.117-1.574l-.194-.801l-.191-.82l-.097-.414c-.38-1.477-1.495-2.328-3.917-2.328l-3.77-.004l-3.472-.005h-3.907a.55.55 0 0 0-.515.417l-.173.816l-.204.964l-.057.271l-1.759 8.24l-1.67 7.822c-.05.23-.066.512-.038.626c.028.115.479.209.713.209h3.524c.235 0 .532-.042.66-.094s.317-.513.364-.742l.626-3.099l.627-3.1l.001-.005l.084-.413l.76-3.56l.671-3.144a.555.555 0 0 1 .515-.417l11.089-.005c.235.002.383-.185.33-.414m14.275-7.24l-.854.003h-3.549a.9.9 0 0 0-.667.353l-7.849 11.498c-.132.194-.283.166-.335-.062l-.578-2.533a.56.56 0 0 0-.522-.416h-5.045c-.235 0-.374.184-.31.409l2.261 7.921c.064.226.069.596.011.824l-.985 3.833c-.059.228.085.413.32.413h4.987a.58.58 0 0 0 .532-.413l.986-3.833a2.5 2.5 0 0 1 .363-.755l12.742-16.911c.142-.188.065-.341-.169-.339zm-40.086 9.919v-.004a.514.514 0 0 1-.499.441h-6.397c-.222 0-.334-.15-.301-.336l.006-.015l-.004.002l.003-.021l.029-.109c.611-1.624 1.855-2.69 4.194-2.69c2.634-.001 3.148 1.285 2.969 2.732m-1.877-7.384c-8.211 0-10.157 4.984-11.249 10.015c-1.091 5.128-.998 9.921 7.5 9.921h1.03l.256-.001h.06l1.02-.003h.018c2.244-.009 4.495-.026 5.406-.033a.55.55 0 0 0 .509-.42l.344-1.681l.067-.327l.41-2.006a.335.335 0 0 0-.341-.418h-7.639c-3.039 0-3.941-.807-3.608-3.181H84.18l-.001.001l.008-.001a.5.5 0 0 0 .445-.315l.029-.106l-.001.001c1.813-6.839 1.293-11.445-6.474-11.446m-38.81 7.358l-.116.409v.001l-.922 3.268l-.922 3.267a.6.6 0 0 1-.543.411h-4.88c-3.702 0-4.604-2.896-3.702-7.166c.901-4.368 2.668-7.083 6.312-7.358c4.98-.376 5.976 3.126 4.773 7.168m3.348 7.105s2.301-5.588 2.823-8.814c.713-4.319-1.45-10.585-9.804-10.585c-8.306 0-11.914 5.981-13.29 12.484c-1.376 6.55.427 12.293 8.686 12.246l6.516-.024l6.089-.022a.59.59 0 0 0 .534-.414l1.061-4.046c.059-.228-.084-.414-.319-.416l-1.017-.006l-1.017-.006c-.199-.001-.313-.131-.289-.302zm41.12-3.741a.28.28 0 1 1-.56.001a.28.28 0 0 1 .56-.001" />
                </svg>
                
                {/* Flowise Banner Image */}
                <img 
                  src="https://docs.flowiseai.com/~gitbook/image?url=https%3A%2F%2F4068692976-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FUiD7nOmFRK805sNuiieJ%252Fuploads%252Fkc0ui4v8wWvxDhPJEni3%252FFlowise%2520Logo%2520Cropped%2520White%2520High%2520Res.png%3Falt%3Dmedia%26token%3D597f761e-d481-4726-afff-1d916064b926&width=768&dpr=1&quality=100&sign=c55049fa&sv=2" 
                  alt="Flowise AI" 
                  className="h-[50px] object-contain hover:scale-110 transition-transform" 
                />
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl group">
              <img 
                className="w-full object-cover aspect-video hover:scale-105 transition-transform duration-500" 
                src="/asset-page/website/bajubagus (4).png" 
                alt="Baju Bagus Inc dashboard" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-60 pointer-events-none" />
            </div>
          </div>

          {/* Part of Favorites Subcards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-16">
            <div className="p-6 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
              <img src="/asset-page/website/bajubagus (10).png" className="w-full aspect-video rounded-lg object-cover mb-4 border border-zinc-800" alt="Subcard" />
              <h4 className="text-lg font-bold text-zinc-100 mb-2">Smart Product Management</h4>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Membangun catalog management dengan lazy loading image, multi-filter dinamis, dan chatbot AI asisten.
              </p>
            </div>
            
            <div className="p-6 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
              <img src="/asset-page/website/bajubagus (14).png" className="w-full aspect-video rounded-lg object-cover mb-4 border border-zinc-800" alt="Subcard" />
              <h4 className="text-lg font-bold text-zinc-100 mb-2">Insightful Admin Dashboard</h4>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Visualisasi profit analytics secara grafis interaktif dengan real-time low-stock alerts.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
              <img src="/asset-page/website/bajubagus (7).png" className="w-full aspect-video rounded-lg object-cover mb-4 border border-zinc-800" alt="Subcard" />
              <h4 className="text-lg font-bold text-zinc-100 mb-2">Sistem Kasir Pintar</h4>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Total memiliki 20 halaman operasional sistem penjualan dengan cetak invoice otomatis.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ALL PROJECTS & ARTWORKS */}
      <section id="all" className="py-24 bg-zinc-900/40 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-zinc-100 tracking-tight">Semua Karya & Projek</h2>
            <div className="w-20 h-1 bg-violet-600 rounded-full mx-auto mt-4 mb-6"></div>
            <p className="text-zinc-400 text-base md:text-lg leading-relaxed">
              Kumpulan hasil karya saya yang mencakup pengembangan web, desain grafis kreatif, dan pencapaian kompetisi.
            </p>
          </div>

          {/* Tabs Filter */}
          <div className="flex justify-center gap-3 mb-12 border-b border-zinc-800/60 pb-6">
            <button 
              onClick={() => setProjectTab("web")}
              className={`px-6 py-2.5 rounded-full text-xs md:text-sm font-semibold tracking-wide duration-300 ${
                projectTab === "web" ? "bg-violet-600 text-white" : "bg-zinc-900 text-zinc-400 hover:bg-zinc-850 hover:text-zinc-200"
              }`}
            >
              Web Dev
            </button>
            <button 
              onClick={() => setProjectTab("design")}
              className={`px-6 py-2.5 rounded-full text-xs md:text-sm font-semibold tracking-wide duration-300 ${
                projectTab === "design" ? "bg-violet-600 text-white" : "bg-zinc-900 text-zinc-400 hover:bg-zinc-850 hover:text-zinc-200"
              }`}
            >
              Graphic Design
            </button>
            <button 
              onClick={() => setProjectTab("achievement")}
              className={`px-6 py-2.5 rounded-full text-xs md:text-sm font-semibold tracking-wide duration-300 ${
                projectTab === "achievement" ? "bg-violet-600 text-white" : "bg-zinc-900 text-zinc-400 hover:bg-zinc-850 hover:text-zinc-200"
              }`}
            >
              Achievements
            </button>
          </div>

          {/* Grid Render */}
          {projectTab === "web" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 animate-in fade-in duration-300">
              {projects.map((item, index) => (
                <div 
                  key={index} 
                  onClick={() => openPopup("project", item)}
                  className="cursor-pointer group bg-zinc-900/60 rounded-xl border border-zinc-800 card-glow-hover overflow-hidden transition-all duration-300"
                >
                  <div className="aspect-video w-full overflow-hidden bg-zinc-800 relative">
                    <img src={item.mainImg[0]} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-5">
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {item.badges.map((badge, bIdx) => (
                        <span key={bIdx} className="text-[10px] font-bold tracking-wide uppercase px-2.5 py-0.5 rounded-full bg-violet-600/10 border border-violet-500/20 text-violet-400">
                          {badge}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-lg font-bold text-zinc-100 group-hover:text-violet-400 transition-colors line-clamp-1">{item.title}</h3>
                    <p className="text-zinc-400 text-xs mt-2 line-clamp-2 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {projectTab === "design" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 animate-in fade-in duration-300">
              {posters.map((item, index) => (
                <div 
                  key={index} 
                  onClick={() => openPopup("poster", item)}
                  className="cursor-pointer group bg-zinc-900/60 rounded-xl border border-zinc-800 card-glow-hover overflow-hidden transition-all duration-300"
                >
                  <div className="aspect-[3/4] w-full overflow-hidden bg-zinc-800">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-zinc-100 group-hover:text-violet-400 transition-colors">{item.title}</h3>
                    <p className="text-zinc-400 text-xs mt-2 line-clamp-2 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {projectTab === "achievement" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 animate-in fade-in duration-300">
              {achievements.map((item, index) => (
                <div 
                  key={index} 
                  onClick={() => openPopup("achievement", item)}
                  className="cursor-pointer group bg-zinc-900/60 rounded-xl border border-zinc-800 card-glow-hover overflow-hidden transition-all duration-300"
                >
                  <div className="aspect-video w-full overflow-hidden bg-zinc-800 relative">
                    <img src={item.mainImg[0]} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-5">
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {item.badges.map((badge, bIdx) => (
                        <span key={bIdx} className="text-[10px] font-bold tracking-wide uppercase px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400">
                          {badge}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-lg font-bold text-zinc-100 group-hover:text-violet-400 transition-colors line-clamp-1">{item.title}</h3>
                    <p className="text-zinc-400 text-xs mt-2 line-clamp-2 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full py-8 bg-zinc-950 border-t border-zinc-900 text-center text-sm text-zinc-500 font-medium">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>Designed By Alwan | Copyright © 2025</p>
          <div className="flex items-center gap-6">
            <a href="#home" className="hover:text-zinc-300 transition-colors">Back to top</a>
          </div>
        </div>
      </footer>

      {/* BACK TO TOP BUTTON */}
      {showScrollTop && (
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-violet-600 hover:bg-violet-750 text-white flex items-center justify-center shadow-lg shadow-violet-600/30 z-[999] hover:scale-110 active:scale-95 transition-all duration-300"
          aria-label="Scroll to top"
        >
          <ArrowUp size={20} />
        </button>
      )}

      {/* DETAIL MODAL (PROJECT / ACHIEVEMENT / POSTER) */}
      {activeModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-[9999] p-4 sm:p-6 animate-in fade-in duration-300">
          <div className="bg-zinc-900/90 border border-zinc-800 text-zinc-100 rounded-2xl max-w-4xl w-full p-6 relative max-h-[90vh] overflow-y-auto shadow-2xl">
            <button 
              onClick={closePopup}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 rounded-lg bg-zinc-800/80 hover:bg-zinc-800 transition-colors duration-200"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            {/* Modal Image Slider / Header */}
            {activeModal.type === "project" && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mt-4">
                <div className="md:col-span-3 aspect-video relative rounded-xl overflow-hidden bg-zinc-950 border border-zinc-850">
                  <img 
                    src={activeModal.data.mainImg[sliderIndex]} 
                    alt={activeModal.data.title} 
                    className="w-full h-full object-cover transition-all duration-500" 
                  />
                  {activeModal.data.link && (
                    <a 
                      href={activeModal.data.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="absolute top-4 right-4 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-lg transition-colors duration-300"
                    >
                      Kunjungi Projek <ExternalLink size={12} />
                    </a>
                  )}
                </div>
                {/* Thumbnails */}
                <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto max-h-[220px]">
                  {activeModal.data.mainImg.map((img, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setSliderIndex(idx)}
                      className={`relative aspect-video w-20 md:w-full rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${
                        sliderIndex === idx ? "border-violet-500" : "border-zinc-800 hover:border-zinc-700"
                      }`}
                    >
                      <img src={img} className="w-full h-full object-cover" alt="" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeModal.type === "achievement" && (
              <div className="aspect-video w-full rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800 mt-4 max-h-[400px]">
                <img 
                  src={activeModal.data.mainImg[0]} 
                  alt={activeModal.data.title} 
                  className="w-full h-full object-contain" 
                />
              </div>
            )}

            {activeModal.type === "poster" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4 items-start">
                <div className="aspect-[3/4] w-full rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800">
                  <img src={activeModal.data.image} alt={activeModal.data.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col gap-4">
                  <h3 className="text-2xl font-bold text-zinc-100">{activeModal.data.title}</h3>
                  <div className="w-16 h-1 bg-violet-600 rounded-full"></div>
                  <p className="text-zinc-400 text-sm leading-relaxed">{activeModal.data.description}</p>
                </div>
              </div>
            )}

            {/* Modal Info Footer (only for non-poster, poster has it beside) */}
            {activeModal.type !== "poster" && (
              <div className="mt-8">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  {activeModal.data.badges && activeModal.data.badges.map((badge, idx) => (
                    <span key={idx} className="text-xs font-bold uppercase px-3 py-1 rounded-full bg-violet-600/10 border border-violet-500/20 text-violet-400">
                      {badge}
                    </span>
                  ))}
                </div>
                <h3 className="text-2xl font-bold text-zinc-100">{activeModal.data.title}</h3>
                <p className="text-zinc-400 text-sm mt-3 leading-relaxed">{activeModal.data.desc}</p>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

