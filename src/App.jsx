import React, { useState, useEffect, useRef } from "react";
import { ArrowUp, Menu, X, Globe, ExternalLink, Award, Sparkles, Monitor, Smartphone } from "lucide-react";
import { useLanguage } from "./contexts/LanguageContext";
import { dict } from "./locales/dictionaries";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "motion/react";
import { projects, achievements, posters } from "./data";
import GradientText from "./GradientText";
import ScrollVelocity from "./ScrollVelocity";
import BorderGlow from "./BorderGlow";
import LightRays from "./LightRays";

const techIcons = {
  "Laravel": "logos:laravel",
  "Laravel Filament": "logos:laravel",
  "Flowise": "ph:robot-bold",
  "JavaScript": "logos:javascript",
  "Chart.js": "ic:round-insert-chart",
  "React JS": "logos:react",
  "Tailwind": "logos:tailwindcss-icon",
  "Tailwind CSS": "logos:tailwindcss-icon",
  "HTML": "logos:html-5",
  "Google Apps Script": "logos:google-apps-script",
  "Google Sheets": "vscode-icons:file-type-excel",
  "API Gemini": "logos:google-gemini",
  "ChatGPT": "logos:openai-icon",
};

// Scroll Reveal Component
const ScrollReveal = ({ children, direction = "up", delay = 0, className = "", id }) => {
  const directions = {
    up: { y: 80, x: 0, scale: 0.95 },
    down: { y: -80, x: 0, scale: 0.95 },
    left: { x: 80, y: 0, scale: 0.95 },
    right: { x: -80, y: 0, scale: 0.95 },
    none: { x: 0, y: 0, scale: 1 }
  };

  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, ...directions[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-15%" }}
      transition={{
        type: "spring",
        stiffness: 70,
        damping: 15,
        mass: 1.2,
        delay
      }}
      className={className}
    >
      {children}
    </motion.section>
  );
};

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
    { img: "./asset-page/website/bajubagus1.png", title: "Baju Bagus Inc" },
    // { img: "./asset-page/website/evoting1.png", title: "E-Voting OSIS" },
    { img: "./asset-page/website/perpus1.png", title: "Perpustakaan Online" },
    // { img: "./asset-page/website/game_setan5.png", title: "Game Setan" },
    { img: "./asset-page/website/rog_store1.png", title: "RoG Store" },
    { img: "./asset-page/website/memorence_spy1.png", title: "Memorence 2.0" },
    // { img: "./asset-page/website/photoboth1.png", title: "Memorence Photobooth" },
    { img: "./asset-page/website/fpmanager3.png", title: "FPManager" },
    // { img: "./asset-page/website/bajubagus6.png", title: "Baju Bagus Dashboard" },
    { img: "./asset-page/website/fpmanager4.png", title: "FPManager" },
    { img: "./asset-page/website/bajubagus8.png", title: "Baju Bagus  " },
    // { img: "./asset-page/website/memorence_spy3.png", title: "Memorence Spotify Mode" },
    { img: "./asset-page/website/tpst1.png", title: "TPST Banyumas" },
    { img: "./asset-page/website/tpst5.png", title: "TPST Marketplace" }
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

      // Sesuaikan ukuran kartu — diperbesar signifikan
      const cardWidth = isMobile ? 300 : isTablet ? 500 : 700;
      // RadiusX fullscreen: meregang hingga ujung layar
      const radiusX = windowWidth / 2 + (isMobile ? 40 : 200);
      const radiusZ = isMobile ? 100 : 200;

      cardsRef.current.forEach((card, i) => {
        if (!card) return;

        // Hitung sudut absolut relatif terhadap sudut pandang depan
        const absoluteAngle = (i * (360 / N) + rotationRef.current) % 360;
        const angleRad = (absoluteAngle * Math.PI) / 180;
        const cosVal = Math.cos(angleRad);
        const sinVal = Math.sin(angleRad);

        // Warping non-linear: exponent lebih tinggi agar kartu merapat di samping tanpa bertabrakan
        const warpedSin = Math.sign(sinVal) * Math.pow(Math.abs(sinVal), 1.4);
        const translateX = warpedSin * radiusX;

        // Translasi Z menggunakan cos (melengkung ke dalam/belakang)
        const translateZ = cosVal * radiusZ - radiusZ;

        // Skala: kartu di tengah depan paling besar, kartu di ujung samping mengecil
        const scale = 0.45 + 0.35 * Math.max(0, cosVal);

        // Opacity: tampilkan kartu di setengah depan (dari pojok kanan ke pojok kiri)
        let opacity = 0;
        if (cosVal > -0.15) {
          opacity = 0.95;
          // Fade halus di batas belakang
          if (cosVal < 0.1) {
            opacity = ((cosVal + 0.15) / 0.25) * 0.95;
          }
        } else {
          opacity = 0; // Sembunyikan kartu di belakang
        }

        // Z-Index: kartu di depan (cosVal tinggi) di atas kartu samping
        const zIndex = Math.round((cosVal + 1) * 50) + 10;

        // Hitung persentase batas potong (clip path) tepat di koordinat tengah layar (X = 0)
        const pct = Math.max(0, Math.min(100, (0.5 - translateX / (cardWidth * scale)) * 100));

        const dotsOpacity = (1 - cosVal) * 0.5;
        const brightness = 0.7 + cosVal * 0.3;

        // Hitung rotasi kemiringan Y & Z 3D (Warp Effect) agar melengkung alami mengikuti tabung
        const rotateYVal = sinVal * -35;
        const rotateZVal = sinVal * 3;

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

        // Mask-image: fade di ujung kanan dan kiri agar menghilang halus di tepi layar
        if (sinVal < -0.65) {
          const fadeStop = Math.max(0, Math.min(100, ((-sinVal - 0.65) / 0.3) * 100));
          const maskStr = `linear-gradient(to right, transparent ${fadeStop}%, black ${Math.min(100, fadeStop + 20)}%)`;
          card.style.webkitMaskImage = maskStr;
          card.style.maskImage = maskStr;
        } else if (sinVal > 0.65) {
          const fadeStop = Math.max(0, Math.min(100, ((sinVal - 0.65) / 0.3) * 100));
          const maskStr = `linear-gradient(to left, transparent ${fadeStop}%, black ${Math.min(100, fadeStop + 20)}%)`;
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
      className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] h-[220px] sm:h-[420px] md:h-[560px] flex items-center justify-center overflow-hidden py-4 select-none cursor-grab active:cursor-grabbing"
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
            className="absolute w-[300px] sm:w-[500px] md:w-[700px] aspect-video rounded-2xl sm:rounded-[32px] overflow-hidden border border-zinc-800/80 bg-zinc-900 shadow-2xl cursor-pointer transition-all duration-300 ease-out hover:border-violet-500/60 hover:shadow-[0_0_50px_rgba(139,92,246,0.3)] hover:scale-105 group"
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
  const { lang, toggleLanguage } = useLanguage();
  const t = dict[lang];

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [projectTab, setProjectTab] = useState("web"); // 'web' | 'design' | 'achievement'
  const [showMobileWelcome, setShowMobileWelcome] = useState(true);
  const [islandExpanded, setIslandExpanded] = useState(false);
  const [isHeaderHovered, setIsHeaderHovered] = useState(false);

  useEffect(() => {
    if (showMobileWelcome) {
      const timer = setTimeout(() => {
        setIslandExpanded(true);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setIslandExpanded(false);
    }
  }, [showMobileWelcome]);

  // Popup Modals state
  const [activeModal, setActiveModal] = useState(null); // { type: 'project'|'achievement'|'poster', data: object }
  const [sliderIndex, setSliderIndex] = useState(0);
  const [viewMode, setViewMode] = useState("desktop"); // 'desktop' | 'mobile'
  const [descExpanded, setDescExpanded] = useState(false);

  // Auto-slide for popup images
  useEffect(() => {
    if (!activeModal) return;
    const imgs = viewMode === "mobile" && activeModal.data.mobileImg?.length
      ? activeModal.data.mobileImg
      : activeModal.data.mainImg;
    if (!imgs || imgs.length <= 1) return;

    const interval = setInterval(() => {
      setSliderIndex((prev) => (prev + 1) % imgs.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [activeModal, viewMode]);

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
    setViewMode("desktop");
    setDescExpanded(false);
  };

  const closePopup = () => {
    setActiveModal(null);
  };

  const modalDesc = activeModal?.data ? (lang === 'en' ? (activeModal.data.desc_en || activeModal.data.description_en) : (activeModal.data.desc_id || activeModal.data.description_id)) : '';

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
              <a href="#home" className="text-sm font-medium text-zinc-300 hover:text-violet-400 transition-colors">{t.nav.home}</a>
              <a href="#about" className="text-sm font-medium text-zinc-300 hover:text-violet-400 transition-colors">{t.nav.about}</a>
              <a href="#favorit" className="text-sm font-medium text-zinc-300 hover:text-violet-400 transition-colors">{t.nav.favorite}</a>
              <a href="#all" className="text-sm font-medium text-zinc-300 hover:text-violet-400 transition-colors">{t.nav.projects}</a>
              <a
                href="#all"
                onClick={() => setProjectTab("design")}
                className="text-sm font-medium text-zinc-300 hover:text-violet-400 transition-colors"
              >
                {t.nav.graphicDesign}
              </a>
            </div>

            {/* LANGUAGE TOGGLE */}
            <div className="hidden md:flex items-center ml-4">
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-violet-400 hover:border-violet-500/30 transition-all text-sm font-medium shadow-sm hover:shadow-violet-500/20"
              >
                <Globe size={16} />
                {lang === 'en' ? 'EN' : 'ID'}
              </button>
            </div>

            {/* BURGER BUTTON & MOBILE TOGGLE */}
            <div className="md:hidden flex items-center gap-3">
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-1 px-2 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-medium"
              >
                <Globe size={14} />
                {lang === 'en' ? 'EN' : 'ID'}
              </button>
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
              {t.nav.home}
            </a>
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-zinc-300 hover:bg-zinc-900 hover:text-white"
            >
              {t.nav.about}
            </a>
            <a
              href="#favorit"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-zinc-300 hover:bg-zinc-900 hover:text-white"
            >
              {t.nav.favoriteProject}
            </a>
            <a
              href="#all"
              onClick={() => { setMobileMenuOpen(false); setProjectTab("web"); }}
              className="block px-3 py-2 rounded-md text-base font-medium text-zinc-300 hover:bg-zinc-900 hover:text-white"
            >
              {t.nav.allProjects}
            </a>
            <a
              href="#all"
              onClick={() => { setMobileMenuOpen(false); setProjectTab("design"); }}
              className="block px-3 py-2 rounded-md text-base font-medium text-zinc-300 hover:bg-zinc-900 hover:text-white"
            >
              {t.nav.graphicDesign}
            </a>
          </div>
        )}
      </nav>

      {/* HERO / HEADER */}
      <header
        id="home"
        className="relative pt-24 pb-16 md:pt-40 md:pb-24 text-center bg-zinc-950 flex flex-col items-center justify-center min-h-[90vh] overflow-hidden"
      >
        <div className="absolute inset-0 z-0">
          <LightRays
            raysOrigin="top-center"
            raysColor="#8b5cf6"
            raysSpeed={1.5}
            lightSpread={0.8}
            rayLength={1.2}
            followMouse={true}
            mouseInfluence={0.1}
            noiseAmount={0.1}
            distortion={0.05}
          />
        </div>

        {/* Decorative ambient glow blobs */}
        <div className="glow-blob bg-violet-600/10 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] top-10 left-10 z-0" />
        <div className="glow-blob bg-blue-600/10 w-[250px] h-[250px] sm:w-[400px] sm:h-[400px] bottom-10 right-10 z-0" />


        <div className="relative z-10 w-full max-w-7xl px-6 flex flex-col items-center">
          <div className="focus-in-expand max-w-4xl mx-auto flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-400 text-sm font-semibold mb-6 shadow-[0_0_15px_rgba(139,92,246,0.15)]">
              <Sparkles size={16} /> {t.hero.greeting}
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 font-outfit text-white">
              {t.hero.title1}
              <div className="mt-2 flex justify-center w-full">
                <GradientText
                  colors={["#a78bfa", "#60a5fa", "#818cf8"]}
                  animationSpeed={6}
                  className="filter drop-shadow-[0_0_20px_rgba(139,92,246,0.4)] block"
                >
                  {t.hero.title2}
                </GradientText>
              </div>
            </h1>
            <p className="text-zinc-400 text-base md:text-lg max-w-2xl mx-auto mb-8 leading-relaxed font-light">
              {t.hero.desc}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10 relative z-20">
              <a
                href="#all"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-zinc-950 border border-zinc-800 hover:border-violet-500/60 text-white font-medium hover:bg-zinc-900 transition-all duration-300 shadow-[0_0_25px_rgba(99,102,241,0.2)] hover:shadow-[0_0_30px_rgba(99,102,241,0.35)] flex items-center justify-center gap-2 group"
              >
                {t.hero.btnProjects}
                <span className="transform group-hover:translate-x-1 transition-transform">→</span>
              </a>
              <a href="#about" className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white font-medium hover:bg-zinc-800 transition-all duration-300 flex items-center justify-center gap-2">
                {t.hero.btnAbout}
              </a>
            </div>
          </div>

          {/* Interactive 3D infinity Ring Slider - Located below the CTA button */}
          <div className="w-full my-6">
            <ThreeDRingSlider />
          </div>
        </div>
      </header>

      {/* SKILLS SECTION */}
      <ScrollReveal direction="up" className="py-20 bg-zinc-950 border-t border-zinc-900 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="glow-blob bg-violet-800/10 w-[400px] h-[400px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Web Dev skill */}
            <BorderGlow borderRadius={16} backgroundColor="#18181b" className="h-full w-full">
              <div className="p-8 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 group h-full">
                <div className="w-14 h-14 rounded-xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(139,92,246,0.15)]">
                  <img src="./asset/logo/logos_web-dev-icon.png" className="w-8 h-8 object-contain" alt="Web Dev icon" />
                </div>
                <h3 className="text-2xl font-bold text-zinc-100 mb-4">{t.skills.webDevTitle}</h3>
                <p className="text-zinc-400 leading-relaxed text-base">
                  {t.skills.webDevDesc}
                </p>
              </div>
            </BorderGlow>

            {/* Graphic Design skill */}
            <BorderGlow borderRadius={16} backgroundColor="#18181b" className="h-full w-full">
              <div className="p-8 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 group h-full">
                <div className="w-14 h-14 rounded-xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(139,92,246,0.15)]">
                  <img src="./asset/logo/fluent-color_design-ideas-32.png" className="w-8 h-8 object-contain" alt="Design icon" />
                </div>
                <h3 className="text-2xl font-bold text-zinc-100 mb-4">{t.skills.designTitle}</h3>
                <p className="text-zinc-400 leading-relaxed text-base">
                  {t.skills.designDesc}
                </p>
              </div>
            </BorderGlow>
          </div>
        </div>
      </ScrollReveal>

      {/* STATS COUNT SECTION */}
      <ScrollReveal direction="up" className="py-16 bg-gradient-to-b from-zinc-950 to-zinc-900 border-t border-b border-zinc-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center justify-items-center">
            <div className="p-4">
              <Counter target="8+" />
              <h5 className="text-zinc-400 text-sm md:text-base mt-2 font-medium">{t.stats.web}</h5>
            </div>
            <div className="p-4">
              <Counter target="5+" />
              <h5 className="text-zinc-400 text-sm md:text-base mt-2 font-medium">{t.stats.uiux}</h5>
            </div>
            <div className="p-4">
              <Counter target="1120+" />
              <h5 className="text-zinc-400 text-sm md:text-base mt-2 font-medium">{t.stats.design}</h5>
            </div>
            <div className="p-4">
              <Counter target="9+" />
              <h5 className="text-zinc-400 text-sm md:text-base mt-2 font-medium">{t.stats.awards}</h5>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* ABOUT ME SECTION */}
      <ScrollReveal direction="left" id="about" className="py-28 bg-zinc-950 relative overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-violet-600/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">

          {/* Section header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-400 text-sm font-semibold mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
              {t.about.tag}
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-zinc-100 tracking-tight">
              {t.about.title}
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-violet-500 to-blue-500 rounded-full mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">

            {/* LEFT — Photo + Info card (Premium Layered Design) */}
            <div className="lg:col-span-2 flex flex-col items-center gap-6 w-full">
              <div className="relative w-full max-w-[320px] mx-auto group">

                {/* Decorative background elements */}
                <div className="absolute -top-6 -left-6 w-32 h-32 bg-violet-500/10 rounded-full blur-2xl group-hover:bg-violet-500/20 transition-all duration-700" />
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-blue-500/10 rounded-full blur-xl group-hover:bg-blue-500/20 transition-all duration-700" />

                {/* Background decorative card (rotated) */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-600/20 to-blue-600/20 border border-violet-500/10 transform rotate-3 group-hover:rotate-1 transition-transform duration-500 scale-[1.02]" />

                {/* Grid pattern accent */}
                <div className="absolute -top-3 -right-3 w-16 h-16 opacity-20 group-hover:opacity-40 transition-opacity duration-500"
                  style={{
                    backgroundImage: "radial-gradient(circle, #8b5cf6 1px, transparent 1px)",
                    backgroundSize: "8px 8px"
                  }}
                />

                {/* Main photo card */}
                <div className="relative rounded-2xl overflow-hidden border border-zinc-800/80 shadow-2xl shadow-black/40 transform -rotate-1 group-hover:rotate-0 transition-all duration-500 group-hover:shadow-violet-500/10">
                  {/* Photo */}
                  <div className="aspect-[3/4] w-full overflow-hidden bg-zinc-900">
                    <img
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                      src="./asset/e3438035-c605-4a2f-9100-2431522526c5.jfif"
                      alt="Hafiz Alwan"
                    />
                  </div>

                  {/* Bottom gradient overlay with info */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent pt-16 pb-5 px-5">
                    <h3 className="text-xl font-bold text-zinc-100 tracking-tight">Hafiz Alwan Susilo</h3>
                    <p className="text-violet-400 text-sm font-medium mt-0.5">{t.about.role}</p>
                  </div>

                  {/* Top corner accent line */}
                  <div className="absolute top-0 left-0 w-16 h-[3px] bg-gradient-to-r from-violet-500 to-transparent rounded-br" />
                  <div className="absolute top-0 left-0 h-16 w-[3px] bg-gradient-to-b from-violet-500 to-transparent rounded-br" />
                </div>

                {/* Floating status badge */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-10">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/90 backdrop-blur-md border border-zinc-800 shadow-lg">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                    </span>
                    <span className="text-emerald-400 text-[11px] font-semibold tracking-wide">{t.about.status}</span>
                  </div>
                </div>
              </div>

              {/* Social Links — Pill style */}
              <div className="flex items-center gap-3 mt-4">
                <a href="https://fiverr.com" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/80 border border-zinc-800 text-zinc-400 hover:text-emerald-400 hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/5 active:scale-95 transition-all duration-300 text-xs font-medium"
                  title="Fiverr"
                >
                  <Icon icon="simple-icons:fiverr" className="text-sm" />
                  Fiverr
                </a>
                <a href="https://instagram.com/hafizalwan" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/80 border border-zinc-800 text-zinc-400 hover:text-pink-400 hover:border-pink-500/30 hover:shadow-lg hover:shadow-pink-500/5 active:scale-95 transition-all duration-300 text-xs font-medium"
                  title="Instagram"
                >
                  <Icon icon="ph:instagram-logo-bold" className="text-sm" />
                  Instagram
                </a>
                <a href="mailto:hafizalwan.susilo@gmail.com"
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/80 border border-zinc-800 text-zinc-400 hover:text-violet-400 hover:border-violet-500/30 hover:shadow-lg hover:shadow-violet-500/5 active:scale-95 transition-all duration-300 text-xs font-medium"
                  title="Email"
                >
                  <Icon icon="ph:envelope-bold" className="text-sm" />
                  Email
                </a>
              </div>
            </div>

            {/* RIGHT — VS Code Snippet */}
            <div className="lg:col-span-3 w-full max-w-full flex flex-col gap-6 animate-in fade-in duration-300 min-w-0">
              <div className={`rounded-t-xl overflow-hidden bg-[#1a1b26]/50 backdrop-blur-md border-t border-l border-r shadow-2xl font-mono text-sm lg:text-base w-full max-w-full transition-all duration-300 relative ${isHeaderHovered ? "shadow-violet-500/10 border-violet-500/30" : "border-[#292e42]"}`}>
                {/* Window Header */}
                <div
                  onMouseEnter={() => setIsHeaderHovered(true)}
                  onMouseLeave={() => setIsHeaderHovered(false)}
                  className="bg-[#16161e] opacity-100 z-10 relative px-4 py-2 flex items-center justify-between border-b border-[#292e42] cursor-default"
                >
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="text-[#565f89] text-xs font-sans tracking-wide">AboutMeController.php</div>
                  <div className="w-12"></div> {/* spacer for centering */}
                </div>
                {/* Editor Body */}
                <div className="p-4 flex text-zinc-300 overflow-x-auto w-full max-w-full">
                  {/* Line Numbers */}
                  <div className="flex flex-col text-[#565f89] pr-4 select-none text-right border-r border-[#292e42] mr-4">
                    <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span><span>9</span><span>10</span><span>11</span><span>12</span><span>13</span><span>14</span><span>15</span><span>16</span><span>17</span><span>18</span><span>19</span><span>20</span>
                  </div>
                  {/* Code */}
                  <div className="flex flex-col whitespace-pre">
                    <span className="text-[#89ddff]">{`<?php`}</span>
                    <span>{` `}</span>
                    <span><span className="text-[#bb9af7]">namespace</span> <span className="text-[#c0caf5]">App\Http\Controllers</span>;</span>
                    <span>{` `}</span>
                    <span><span className="text-[#bb9af7]">class</span> <span className="text-[#7aa2f7]">AboutMeController</span> <span className="text-[#bb9af7]">extends</span> <span className="text-[#c0caf5]">Controller</span> {`{`}</span>
                    <span>    <span className="text-[#bb9af7]">public function</span> <span className="text-[#7aa2f7]">index</span>() {`{`}</span>
                    <span>        <span className="text-[#bb9af7]">return</span> <span className="text-[#7aa2f7]">response</span>()-><span className="text-[#7aa2f7]">json</span>([</span>
                    <span>            <span className="text-[#9ece6a]">'name'</span> => <span className="text-[#9ece6a]">'Hafiz Alwan Susilo'</span>,</span>
                    <span>            <span className="text-[#9ece6a]">'role'</span> => <span className="text-[#9ece6a]">'Fullstack Dev & Designer'</span>,</span>
                    <span>            <span className="text-[#9ece6a]">'university'</span> => <span className="text-[#9ece6a]">'Telkom Univ Purwokerto'</span>,</span>
                    <span>            <span className="text-[#9ece6a]">'status'</span> => <span className="text-[#9ece6a]">'Available for Hire'</span>,</span>
                    <span>            <span className="text-[#9ece6a]">'focus'</span> => <span className="text-[#9ece6a]">'Web Dev & UI Design'</span>,</span>
                    <span>            <span className="text-[#9ece6a]">'socials'</span> => [</span>
                    <span>                <span className="text-[#9ece6a]">'ig'</span> => <a href="https://instagram.com" target="_blank" className="text-[#9ece6a] hover:underline">'@hafizalwan'</a>,</span>
                    <span>                <span className="text-[#9ece6a]">'fiverr'</span> => <a href="https://fiverr.com" target="_blank" className="text-[#9ece6a] hover:underline">'fiverr.com/hafizalwan'</a></span>
                    <span>            ],</span>
                    <span>            <span className="text-[#9ece6a]">'awards'</span> => [<span className="text-[#9ece6a]">'Juara 1 Web Design'</span>, <span className="text-[#9ece6a]">'Juara 1 Poster'</span>]</span>
                    <span>        ]);</span>
                    <span>    {`}`}</span>
                    <span>{`}`}</span>
                  </div>
                </div>
                {/* Bottom Black Gradient Overlay */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-zinc-950 via-zinc-950/85 to-transparent pointer-events-none z-20" />
              </div>


            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* RIWAYAT PENDIDIKAN & PENGALAMAN */}
      <ScrollReveal direction="right" id="journey" className="py-20 bg-zinc-950 bg-dots relative border-b border-zinc-900">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-400 text-sm font-semibold mb-4">
              <Icon icon="ph:map-trifold-bold" /> {t.journey.tag}
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-zinc-100 tracking-tight">
              {t.journey.title}
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-violet-500 to-blue-500 rounded-full mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* COLUMN 1: PENDIDIKAN */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 text-xl">
                  <Icon icon="ph:graduation-cap-bold" />
                </div>
                <h3 className="text-2xl font-bold text-zinc-100">{t.journey.eduTitle}</h3>
              </div>

              <div className="relative border-l border-zinc-800/80 ml-5 space-y-12">
                {[
                  {
                    active: true,
                    period: "2023 – Sekarang",
                    institution: "Telkom University Purwokerto",
                    major: "S1 Rekayasa Perangkat Lunak",
                    tags: ["Informatika", "Software Engineering"],
                  },
                  {
                    active: false,
                    period: "2020 – 2023",
                    institution: "SMK Negeri 1 Purwokerto",
                    major: "Rekayasa Perangkat Lunak (RPL)",
                    tags: ["Programming", "Database", "Web Dev"],
                  },
                ].map((edu, i) => (
                  <ScrollReveal key={i} direction="up" delay={i * 0.2} className="relative pl-8 group cursor-pointer">
                    {/* Dot on Timeline */}
                    <span className={`absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-4 ${edu.active ? "bg-blue-400 border-zinc-950 scale-125 ring-4 ring-blue-500/20" : "bg-zinc-800 border-zinc-950"} transition-all duration-300 group-hover:scale-125 group-hover:bg-blue-400 group-hover:border-blue-900`} />

                    <span className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full mb-3 ${edu.active ? "bg-blue-600/20 text-blue-400" : "bg-zinc-800/60 text-zinc-500"} transition-all duration-300 group-hover:bg-blue-600/20 group-hover:text-blue-300`}>
                      {edu.period}
                    </span>
                    <h4 className="text-xl font-bold text-zinc-100 group-hover:text-blue-400 transition-all duration-300 group-hover:translate-x-1">{edu.institution}</h4>
                    <p className="text-zinc-400 text-sm mt-1 group-hover:text-zinc-300 transition-colors duration-300">{edu.major}</p>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {edu.tags.map((tag) => (
                        <span key={tag} className="text-xs px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-500 transition-all duration-300 group-hover:border-blue-500/30 group-hover:text-blue-300 group-hover:bg-blue-500/10">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>

            {/* COLUMN 2: PENGALAMAN */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xl">
                  <Icon icon="ph:briefcase-bold" />
                </div>
                <h3 className="text-2xl font-bold text-zinc-100">{t.journey.careerTitle}</h3>
              </div>

              <div className="relative border-l border-zinc-800/80 ml-5 space-y-12">
                {[
                  {
                    active: true,
                    type: "Full Time",
                    period: "2025 – Sekarang",
                    company: "Dr Kreatif",
                    role: "Graphic Designer & WordPress Admin",
                    bullets: ["Desain visual komersial (logo, brosur, promo)", "Modeling 3D dengan SketchUp", "Mengelola website WordPress"],
                  },
                  {
                    active: false,
                    type: "Internship",
                    period: "4 Bulan",
                    company: "CV. Prabu Bima Tech",
                    role: "Fullstack Developer",
                    bullets: ["Web App E-Voting Ketua OSIS", "E-commerce dengan AI Chatbot (Flowise)"],
                  },
                  {
                    active: false,
                    type: "Internship",
                    period: "3 Bulan",
                    company: "CV. JVM Purwokerto",
                    role: "Graphic Designer",
                    bullets: ["Predikat \"Excellent Performance\"", "371 desain feed Instagram 4 brand"],
                  },
                ].map((work, i) => (
                  <ScrollReveal key={i} direction="up" delay={i * 0.2} className="relative pl-8 group cursor-pointer">
                    {/* Dot on Timeline */}
                    <span className={`absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-4 ${work.active ? "bg-emerald-400 border-zinc-950 scale-125 ring-4 ring-emerald-500/20" : "bg-zinc-800 border-zinc-950"} transition-all duration-300 group-hover:scale-125 group-hover:bg-emerald-400 group-hover:border-emerald-900`} />

                    <div className="flex items-center gap-2 mb-3">
                      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${work.active ? "bg-emerald-600/20 text-emerald-400" : "bg-zinc-800/60 text-zinc-500"} transition-all duration-300 group-hover:bg-emerald-600/20 group-hover:text-emerald-300`}>
                        {work.type}
                      </span>
                      <span className="text-zinc-500 text-xs font-medium group-hover:text-zinc-400 transition-colors duration-300">{work.period}</span>
                    </div>
                    <h4 className="text-xl font-bold text-zinc-100 group-hover:text-emerald-400 transition-all duration-300 group-hover:translate-x-1">{work.company}</h4>
                    <p className="text-emerald-500/80 text-sm font-medium mt-1 group-hover:text-emerald-400 transition-colors duration-300">{work.role}</p>
                    <ul className="mt-4 space-y-2">
                      {work.bullets.map((b, bi) => (
                        <li key={bi} className="text-zinc-400 text-sm flex items-start gap-2 transition-all duration-300 group-hover:text-zinc-300 group-hover:translate-x-1" style={{ transitionDelay: `${bi * 50}ms` }}>
                          <Icon icon="ph:caret-right-bold" className="text-emerald-500 mt-1 flex-shrink-0 group-hover:scale-125 transition-transform duration-300" />
                          <span className="leading-relaxed">{b}</span>
                        </li>
                      ))}
                    </ul>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* MARQUEE LOOP */}
      <ScrollReveal direction="up" className="relative overflow-hidden py-10 bg-zinc-900 bg-dots border-t border-b border-zinc-800">
        <ScrollVelocity
          texts={[
            (
              <div className="flex items-center gap-16 px-8 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                {[
                  { name: "React JS", icon: "logos:react" },
                  { name: "Laravel", icon: "logos:laravel" },
                  { name: "Tailwind CSS", icon: "logos:tailwindcss-icon" },
                  { name: "JavaScript", icon: "logos:javascript" },
                  { name: "Node.js", icon: "logos:nodejs-icon" },
                  { name: "MySQL", icon: "logos:mysql" },
                  { name: "Linux", icon: "logos:linux-tux" },
                  { name: "Gemini", icon: "logos:google-gemini" },
                  { name: "ChatGPT", icon: "logos:openai-icon" },
                  { name: "Claude AI", icon: "logos:anthropic-icon" },
                  { name: "Flowise AI", icon: "ph:robot-bold" },
                  { name: "Apps Script", icon: "logos:google-apps-script" },
                  { name: "Google Sheets", icon: "vscode-icons:file-type-excel" },
                  { name: "Figma", icon: "logos:figma" },
                  { name: "Git", icon: "logos:git-icon" }
                ].map((tech) => (
                  <div key={tech.name} className="flex items-center gap-4">
                    <Icon icon={tech.icon} className="w-12 h-12 md:w-16 md:h-16" />
                    <span className="text-2xl md:text-3xl font-bold text-zinc-200 whitespace-nowrap">{tech.name}</span>
                  </div>
                ))}
              </div>
            ),
            (
              <div className="flex items-center gap-16 px-8 mt-6 md:mt-10 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                {[
                  { name: "React JS", icon: "logos:react" },
                  { name: "Laravel", icon: "logos:laravel" },
                  { name: "Tailwind CSS", icon: "logos:tailwindcss-icon" },
                  { name: "JavaScript", icon: "logos:javascript" },
                  { name: "Node.js", icon: "logos:nodejs-icon" },
                  { name: "MySQL", icon: "logos:mysql" },
                  { name: "Linux", icon: "logos:linux-tux" },
                  { name: "Gemini", icon: "logos:google-gemini" },
                  { name: "ChatGPT", icon: "logos:openai-icon" },
                  { name: "Claude AI", icon: "logos:anthropic-icon" },
                  { name: "Flowise AI", icon: "ph:robot-bold" },
                  { name: "Apps Script", icon: "logos:google-apps-script" },
                  { name: "Google Sheets", icon: "vscode-icons:file-type-excel" },
                  { name: "Figma", icon: "logos:figma" },
                  { name: "Git", icon: "logos:git-icon" }
                ].map((tech) => (
                  <div key={tech.name + "_2"} className="flex items-center gap-4">
                    <Icon icon={tech.icon} className="w-12 h-12 md:w-16 md:h-16" />
                    <span className="text-2xl md:text-3xl font-bold text-zinc-200 whitespace-nowrap">{tech.name}</span>
                  </div>
                ))}
              </div>
            )
          ]}
          velocity={30}
          className="flex items-center opacity-90"
        />
      </ScrollReveal>

      {/* FAVORITE PROJECT */}
      <ScrollReveal direction="up" id="favorit" className="py-24 bg-zinc-950 bg-dots">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-400 text-xs font-semibold mb-4">
                {t.favorite.tag}
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-zinc-100 tracking-tight leading-tight">
                {t.favorite.title}
              </h2>
              <p className="mt-6 text-zinc-400 leading-relaxed text-lg">
                {t.favorite.desc}
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
                src="./asset-page/website/bajubagus4.png"
                alt="Baju Bagus Inc dashboard"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-60 pointer-events-none" />
            </div>
          </div>

          {/* Part of Favorites Subcards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-16">
            <div className="p-6 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
              <img src="./asset-page/website/bajubagus10.png" className="w-full aspect-video rounded-lg object-cover mb-4 border border-zinc-800" alt="Subcard" />
              <h4 className="text-lg font-bold text-zinc-100 mb-2">{t.favorite.sub1Title}</h4>
              <p className="text-zinc-400 text-sm leading-relaxed">
                {t.favorite.sub1Desc}
              </p>
            </div>

            <div className="p-6 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
              <img src="./asset-page/website/bajubagus14.png" className="w-full aspect-video rounded-lg object-cover mb-4 border border-zinc-800" alt="Subcard" />
              <h4 className="text-lg font-bold text-zinc-100 mb-2">{t.favorite.sub2Title}</h4>
              <p className="text-zinc-400 text-sm leading-relaxed">
                {t.favorite.sub2Desc}
              </p>
            </div>

            <div className="p-6 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
              <img src="./asset-page/website/bajubagus7.png" className="w-full aspect-video rounded-lg object-cover mb-4 border border-zinc-800" alt="Subcard" />
              <h4 className="text-lg font-bold text-zinc-100 mb-2">{t.favorite.sub3Title}</h4>
              <p className="text-zinc-400 text-sm leading-relaxed">
                {t.favorite.sub3Desc}
              </p>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* ALL PROJECTS & ARTWORKS */}
      <ScrollReveal direction="up" id="all" className="py-24 bg-zinc-900/40 bg-dots border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-zinc-100 tracking-tight">{t.allProjects.title}</h2>
            <div className="w-20 h-1 bg-violet-600 rounded-full mx-auto mt-4 mb-6"></div>
            <p className="text-zinc-400 text-base md:text-lg leading-relaxed">
              {t.allProjects.desc}
            </p>
          </div>

          {/* Tabs Filter */}
          <div className="flex justify-center gap-3 mb-12 border-b border-zinc-800/60 pb-6">
            <button
              onClick={() => setProjectTab("web")}
              className={`px-6 py-2.5 rounded-full text-xs md:text-sm font-semibold tracking-wide duration-300 ${projectTab === "web" ? "bg-violet-600 text-white" : "bg-zinc-900 text-zinc-400 hover:bg-zinc-850 hover:text-zinc-200"
                }`}
            >
              Web Dev
            </button>
            <button
              onClick={() => setProjectTab("design")}
              className={`px-6 py-2.5 rounded-full text-xs md:text-sm font-semibold tracking-wide duration-300 ${projectTab === "design" ? "bg-violet-600 text-white" : "bg-zinc-900 text-zinc-400 hover:bg-zinc-850 hover:text-zinc-200"
                }`}
            >
              Graphic Design
            </button>
            <button
              onClick={() => setProjectTab("achievement")}
              className={`px-6 py-2.5 rounded-full text-xs md:text-sm font-semibold tracking-wide duration-300 ${projectTab === "achievement" ? "bg-violet-600 text-white" : "bg-zinc-900 text-zinc-400 hover:bg-zinc-850 hover:text-zinc-200"
                }`}
            >
              Awards
            </button>
          </div>

          {/* Grid Render */}
          {projectTab === "web" && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-10 animate-in fade-in duration-300">
              {projects.map((item, index) => (
                <div
                  key={index}
                  onClick={() => openPopup("project", item)}
                  className="cursor-pointer group transition-all duration-300 h-full hover:-translate-y-2 hover:shadow-xl hover:shadow-violet-500/20 rounded-xl"
                >
                  <BorderGlow borderRadius={12} backgroundColor="#18181b" className="h-full w-full">
                    <div className="bg-zinc-900/60 rounded-xl border border-zinc-800 overflow-hidden flex flex-col h-full">
                      <div className="aspect-video w-full overflow-hidden bg-zinc-800 relative">
                        <img src={item.mainImg[0]} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                      <div className="p-3 sm:p-5 flex-1">
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {item.badges.map((badge, bIdx) => (
                            <span key={bIdx} className="flex items-center gap-1.5 text-[10px] md:text-[10px] font-bold tracking-wide uppercase p-1.5 md:px-2.5 md:py-0.5 rounded-full bg-violet-600/10 border border-violet-500/20 text-violet-400">
                              {techIcons[badge] && <Icon icon={techIcons[badge]} className="text-sm md:text-xs" />}
                              <span className={techIcons[badge] ? "hidden md:inline" : "inline"}>{badge}</span>
                            </span>
                          ))}
                        </div>
                        <h3 className="text-sm sm:text-lg font-bold text-zinc-100 group-hover:text-violet-400 transition-colors line-clamp-1">{item.title}</h3>
                        <p className="text-zinc-400 text-[10px] sm:text-xs mt-1 sm:mt-2 line-clamp-2 leading-relaxed">{lang === 'en' ? item.desc_en : item.desc_id}</p>
                      </div>
                    </div>
                  </BorderGlow>
                </div>
              ))}
            </div>
          )}

          {projectTab === "design" && (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-10 animate-in fade-in duration-300">
              {posters.map((item, index) => (
                <div
                  key={index}
                  onClick={() => openPopup("poster", item)}
                  className="cursor-pointer group transition-all duration-300 h-full hover:-translate-y-2 hover:shadow-xl hover:shadow-violet-500/20 rounded-xl"
                >
                  <BorderGlow borderRadius={12} backgroundColor="#18181b" className="h-full w-full">
                    <div className="bg-zinc-900/60 rounded-xl border border-zinc-800 overflow-hidden flex flex-col h-full">
                      <div className="aspect-[3/4] w-full overflow-hidden bg-zinc-800">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                      <div className="p-3 sm:p-5 flex-1">
                        <h3 className="text-sm sm:text-lg font-bold text-zinc-100 group-hover:text-violet-400 transition-colors line-clamp-1">{item.title}</h3>
                        <p className="text-zinc-400 text-[10px] sm:text-xs mt-1 sm:mt-2 line-clamp-2 leading-relaxed">{lang === 'en' ? item.description_en : item.description_id}</p>
                      </div>
                    </div>
                  </BorderGlow>
                </div>
              ))}
            </div>
          )}

          {projectTab === "achievement" && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-10 animate-in fade-in duration-300">
              {achievements.map((item, index) => (
                <div
                  key={index}
                  onClick={() => openPopup("achievement", item)}
                  className="cursor-pointer group transition-all duration-300 h-full hover:-translate-y-2 hover:shadow-xl hover:shadow-amber-500/20 rounded-xl"
                >
                  <BorderGlow borderRadius={12} backgroundColor="#18181b" className="h-full w-full">
                    <div className="bg-zinc-900/60 rounded-xl border border-zinc-800 overflow-hidden flex flex-col h-full">
                      <div className="aspect-video w-full overflow-hidden bg-zinc-800 relative">
                        <img src={item.mainImg[0]} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                      <div className="p-3 sm:p-5 flex-1">
                        <div className="flex flex-wrap gap-1.5 mb-2 sm:mb-3">
                          {item.badges.map((badge, bIdx) => (
                            <span key={bIdx} className="text-[10px] font-bold tracking-wide uppercase px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400">
                              {badge}
                            </span>
                          ))}
                        </div>
                        <h3 className="text-sm sm:text-lg font-bold text-zinc-100 group-hover:text-violet-400 transition-colors line-clamp-1">{item.title}</h3>
                        <p className="text-zinc-400 text-[10px] sm:text-xs mt-1 sm:mt-2 line-clamp-2 leading-relaxed">{lang === 'en' ? item.desc_en : item.desc_id}</p>
                      </div>
                    </div>
                  </BorderGlow>
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollReveal>

      {/* FOOTER */}
      <footer className="w-full py-8 bg-zinc-950 bg-dots border-t border-zinc-900 text-center text-sm text-zinc-500 font-medium">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>Designed By Alwan | Copyright © 2025</p>
          <div className="flex items-center gap-6">
            <a href="#home" className="hover:text-zinc-300 transition-colors">{t.footer.backToTop}</a>
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
      <AnimatePresence>
        {activeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-[9999] p-2 sm:p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
              className={`bg-zinc-900/95 border border-zinc-800 text-zinc-100 rounded-2xl w-full p-5 sm:p-6 relative shadow-2xl overflow-hidden ${activeModal.type === "project" ? "w-[95vw] max-w-[1500px] h-[95vh] flex flex-col" : "max-w-4xl max-h-[90vh] overflow-y-auto"}`}
            >
              <button
                onClick={closePopup}
                className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 rounded-lg bg-zinc-800/80 hover:bg-zinc-800 transition-colors duration-200"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>

              <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-10 w-full h-full overflow-y-auto overflow-x-hidden md:overflow-hidden pb-6 md:pb-0">

                {/* Modal Image Slider / Header */}
                {activeModal.type === "project" && (
                  <div className="flex-1 min-w-0 w-full flex flex-col">
                    {/* Desktop / Mobile Toggle */}
                    <div className="flex items-center gap-2 mb-4 mt-2">
                      <button
                        onClick={() => { setViewMode("desktop"); setSliderIndex(0); }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 ${viewMode === "desktop"
                          ? "bg-violet-600 text-white shadow-lg shadow-violet-500/30"
                          : "bg-zinc-800/80 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                          }`}
                      >
                        <Monitor size={14} /> Desktop
                      </button>
                      <button
                        onClick={() => { setViewMode("mobile"); setSliderIndex(0); }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 ${viewMode === "mobile"
                          ? "bg-violet-600 text-white shadow-lg shadow-violet-500/30"
                          : "bg-zinc-800/80 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                          } ${(!activeModal.data.mobileImg || activeModal.data.mobileImg.length === 0) ? "opacity-40 cursor-not-allowed" : ""}`}
                        disabled={!activeModal.data.mobileImg || activeModal.data.mobileImg.length === 0}
                      >
                        <Smartphone size={14} /> Mobile
                      </button>
                    </div>

                    {/* Desktop View */}
                    {viewMode === "desktop" && (
                      <div className="flex-1 flex flex-col md:flex-row gap-4 min-h-[300px] md:min-h-0 md:overflow-hidden"  >
                        {/* Main Image */}
                        <div className="relative rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800 flex-1 min-h-0 flex items-center justify-center">
                          <img
                            src={activeModal.data.mainImg[sliderIndex]}
                            alt={activeModal.data.title}
                            className="w-full h-full object-contain transition-all duration-500"
                          />
                          {activeModal.data.link && (
                            <a
                              href={activeModal.data.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="absolute top-4 right-4 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-lg transition-colors duration-300"
                            >
                              {t.modal.visitProject} <ExternalLink size={12} />
                            </a>
                          )}
                        </div>
                        {/* Thumbnails — Full height sidebar matching main image */}
                        <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto md:overflow-x-hidden md:w-[110px] flex-shrink-0 md:h-full pb-2 md:pb-0">
                          {activeModal.data.mainImg.map((img, idx) => (
                            <button
                              key={idx}
                              onClick={() => setSliderIndex(idx)}
                              className={`relative aspect-video w-20 md:w-full rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${sliderIndex === idx ? "border-violet-500 shadow-md shadow-violet-500/30" : "border-zinc-800 hover:border-zinc-700"
                                }`}
                            >
                              <img src={img} className="w-full h-full object-cover" alt="" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Mobile View - Phone Mockup */}
                    {viewMode === "mobile" && activeModal.data.mobileImg && activeModal.data.mobileImg.length > 0 && (
                      <div className="flex sm:flex-col items-center justify-center gap-6 md:gap-10 h-full min-h-0">
                        {/* Phone Frame */}
                        <div className="relative flex-shrink-0" style={{ width: "280px" }}>
                          {/* Phone outer shell */}
                          <div className="relative bg-zinc-900 rounded-[40px] p-[10px] border-[3px] border-zinc-700 shadow-2xl shadow-black/50">
                            {/* Notch / Dynamic Island */}
                            <div className="absolute top-[14px] left-1/2 -translate-x-1/2 w-[90px] h-[26px] bg-zinc-950 rounded-full z-20 flex items-center justify-center gap-2">
                              <div className="w-[8px] h-[8px] rounded-full bg-zinc-800 border border-zinc-700"></div>
                              <div className="w-[6px] h-[6px] rounded-full bg-zinc-800"></div>
                            </div>
                            {/* Screen */}
                            <div className="relative rounded-[30px] overflow-hidden bg-zinc-950 aspect-[9/19.5]">
                              <img
                                src={activeModal.data.mobileImg[sliderIndex]}
                                alt={activeModal.data.title}
                                className="w-full h-full object-cover transition-all duration-500"
                              />
                              {/* Screen reflection glare */}
                              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none rounded-[30px]"></div>
                            </div>
                            {/* Bottom bar indicator */}
                            <div className="absolute bottom-[8px] left-1/2 -translate-x-1/2 w-[100px] h-[4px] bg-zinc-600 rounded-full"></div>
                          </div>
                          {/* Phone shadow glow */}
                          <div className="absolute -inset-4 bg-violet-500/5 rounded-[50px] blur-xl -z-10"></div>
                        </div>

                        {/* Mobile Thumbnails */}
                        <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto sm:overflow-x-hidden pb-2 sm:pb-0 sm:pr-2 sm:max-h-[550px] max-w-full justify-center sm:justify-start">
                          {activeModal.data.mobileImg.map((img, idx) => (
                            <button
                              key={idx}
                              onClick={() => setSliderIndex(idx)}
                              className={`relative aspect-[9/16] w-14 sm:w-16 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${sliderIndex === idx ? "border-violet-500 shadow-md shadow-violet-500/30" : "border-zinc-800 hover:border-zinc-700"
                                }`}
                            >
                              <img src={img} className="w-full h-full object-cover" alt="" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeModal.type === "achievement" && (
                  <div className="flex-1 min-w-0 aspect-video w-full rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800 mt-4 max-h-[400px]">
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
                      <p className="text-zinc-400 text-sm leading-relaxed">{modalDesc}</p>
                    </div>
                  </div>
                )}

                {/* Modal Info Footer (only for non-poster, poster has it beside) */}
                {activeModal.type !== "poster" && (
                  <div className={`w-full md:w-[300px] lg:w-[380px] flex-shrink-0 ${activeModal.type === "project" ? "pt-4 border-t md:border-t-0 md:border-l border-zinc-800/50 md:pl-8 md:pt-8 mt-2 md:mt-0 md:overflow-y-auto md:h-full pb-8 md:pb-4" : "mt-8 md:mt-0"}`}>
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      {activeModal.data.badges && activeModal.data.badges.map((badge, idx) => (
                        <span key={idx} className="flex items-center gap-1.5 text-xs font-bold uppercase p-2 md:px-3 md:py-1 rounded-full bg-violet-600/10 border border-violet-500/20 text-violet-400">
                          {techIcons[badge] && <Icon icon={techIcons[badge]} className="text-lg md:text-sm" />}
                          <span className={techIcons[badge] ? "hidden md:inline" : "inline"}>{badge}</span>
                        </span>
                      ))}
                    </div>
                    <h3 className="text-2xl font-bold text-zinc-100">{activeModal.data.title}</h3>
                    <div className="mt-3">
                      <p className="text-zinc-400 text-sm leading-relaxed">
                        {descExpanded || !modalDesc || modalDesc.length <= 150
                          ? modalDesc
                          : `${modalDesc.slice(0, 150)}...`}
                      </p>
                      {modalDesc && modalDesc.length > 150 && (
                        <button
                          onClick={() => setDescExpanded(!descExpanded)}
                          className="text-violet-400 hover:text-violet-300 text-xs font-semibold mt-1.5 transition-colors duration-200"
                        >
                          {descExpanded ? "Read Less ↑" : "Read More ↓"}
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MOBILE WELCOME MODAL (DYNAMIC ISLAND STYLE WITH MOTION) */}
      <AnimatePresence>
        {showMobileWelcome && (
          <div className="md:hidden fixed top-4 left-1/2 -translate-x-1/2 z-[1000] w-[92%] max-w-[350px] flex justify-center pointer-events-none">
            <motion.div
              layout
              initial={{ width: 110, height: 38, borderRadius: 9999, opacity: 0 }}
              animate={{
                width: islandExpanded ? "100%" : 110,
                height: islandExpanded ? "auto" : 38,
                borderRadius: islandExpanded ? 24 : 9999,
                opacity: 1,
              }}
              exit={{ width: 80, height: 30, opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-black/95 border border-zinc-800/80 shadow-2xl flex items-center justify-between p-1.5 pl-3 pr-3 overflow-hidden pointer-events-auto backdrop-blur-md"
            >
              {/* Dynamic Island Content */}
              {!islandExpanded ? (
                // Compact State (Camera/Sensor look)
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center w-full gap-2"
                >
                  <Icon icon="ph:hand-waving-bold" className="text-violet-400 text-sm animate-pulse" />
                  <span className="text-[10px] font-bold text-white font-sans">Hi!</span>
                </motion.div>
              ) : (
                // Expanded State
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15 }}
                  className="flex items-center gap-3.5 w-full py-1.5"
                >
                  {/* Icon */}
                  <div className="w-9 h-9 rounded-full bg-zinc-900/90 border border-zinc-800 flex items-center justify-center flex-shrink-0">
                    <Icon icon="ph:hand-waving-bold" className="text-lg text-violet-400 animate-bounce" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-xs font-bold font-sans tracking-wide">Selamat Datang!</p>
                    <p className="text-zinc-400 text-[10px] leading-tight mt-0.5 truncate">Jelajahi portofolio terbaik Hafiz Alwan</p>
                  </div>

                  {/* Close Button */}
                  <button
                    onClick={() => setShowMobileWelcome(false)}
                    className="w-7 h-7 rounded-full bg-zinc-900/90 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white active:scale-90 transition-all flex-shrink-0"
                  >
                    <Icon icon="ph:x-bold" className="text-[10px]" />
                  </button>
                </motion.div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

