import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  GiBlackBelt, 
  GiHighKick, 
  GiTrophyCup, 
  GiScrollUnfurled, 
  GiCrossedSwords, 
  GiOpenBook, 
  GiPodium,
  GiIdCard,
  GiDiploma
} from 'react-icons/gi';

import {
  Zap,
  BookOpen,
  Monitor,
  Code,
  ChevronDown
} from 'lucide-react';

const Home = () => {
  const [showScrollArrow, setShowScrollArrow] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setShowScrollArrow(false);
      } else {
        setShowScrollArrow(true);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollDown = () => {
    const nextSection = document.getElementById('welcome-section');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // 3x3 Square Cards (White #F5F2E9 fill, carbon #111114 icon on top, red #8C1D1D title on bottom)
  const quickAccessCards = [
    { title: 'Alumnos Destacados', icon: GiTrophyCup, path: '/alumnos-destacados' },
    { title: 'Campeonatos', icon: GiHighKick, path: '/campeonatos' },
    { title: 'Grados', icon: GiBlackBelt, path: '/grados' },
    { title: 'Historial', icon: GiScrollUnfurled, path: '/alumnos-destacados' },
    { title: 'Llaves', icon: GiCrossedSwords, path: '/alumnos-destacados' },
    { title: 'Contenido', icon: GiOpenBook, path: '/contenido' },
    { title: 'Estadística', icon: GiPodium, path: '/alumnos-destacados' },
    { title: 'Carnets', icon: GiIdCard, path: '/contactos' },
    { title: 'Diplomas', icon: GiDiploma, path: '/quienes-somos' },
  ];

  // 4 Services Cards (Structured dark panels with gold border lines)
  const services = [
    {
      title: 'Organización de Eventos',
      desc: 'Gestión profesional de torneos de Taekwondo y Kickboxing con cronometraje y pesajes oficiales.',
      icon: Zap,
    },
    {
      title: 'Capacitación y Evaluación',
      desc: 'Seminarios de actualización técnica, certificación de cinturones negros y diplomados para árbitros.',
      icon: BookOpen,
    },
    {
      title: 'Desarrollo de Software Deportivo',
      desc: 'Sistemas de llaves electrónicas (brackets), conteo de puntos y gestión de atletas en vivo.',
      icon: Monitor,
    },
    {
      title: 'Creación de Páginas Web o Apps',
      desc: 'Diseño de aplicaciones web modernas adaptadas a escuelas, federaciones y clubes marciales.',
      icon: Code,
    },
  ];

  return (
    <div class="space-y-16 pb-16">
      
      {/* HERO SECTION */}
      <section class="relative min-h-[calc(100vh-4rem)] flex items-center overflow-hidden bg-carbon">
        
        {/* Right Column Dragon (Absolute background watermark on mobile, split on desktop) */}
        <div class="absolute right-0 top-0 w-full lg:w-3/5 h-full z-0 lg:clip-diagonal-right bg-transparent lg:bg-[#0a0b0e] border-none lg:border-l-[12px] lg:border-rojo-impacto overflow-hidden flex items-center justify-center pointer-events-none">
          
          {/* Fondo de patrón de puntos */}
          <div class="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#ffffff 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>

          {/* Resplandor rojo central (solo PC para no quemar el fondo en móvil) */}
          <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[45rem] h-[45rem] bg-rojo-impacto/30 blur-[100px] rounded-full hidden lg:block"></div>
          
          {/* Emblema Central Animado (Video con Loop-Fade) */}
          <div 
            class="relative w-[120%] aspect-square max-w-lg lg:max-w-none lg:w-[45rem] lg:h-[45rem] lg:translate-x-12 mix-blend-screen opacity-[0.08] lg:opacity-100 transition-all duration-700"
            style={{ 
              WebkitMaskImage: 'radial-gradient(circle, black 50%, transparent 70%)', 
              maskImage: 'radial-gradient(circle, black 50%, transparent 70%)',
              animation: 'loop-fade 8s infinite linear'
            }}
          >
            <video
              src="/dragon_loop.mp4"
              autoPlay
              loop
              muted
              playsInline
              class="w-full h-full object-cover drop-shadow-[0_0_40px_rgba(200,16,46,0.4)] contrast-125 saturate-150"
            />
          </div>

          <div class="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-carbon via-transparent to-black/30 pointer-events-none"></div>
        </div>

        {/* Left Column Text (Always on top) */}
        <div class="relative z-10 w-full lg:w-1/2 flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-16 lg:py-0 pointer-events-auto">
          <div class="space-y-6 text-left animate-hit max-w-xl mx-auto lg:mx-0 w-full">
            {/* Badge with increased horizontal padding to prevent clip-button text cutoff */}
            <div class="inline-block px-5 py-1.5 bg-dorado-campeon text-carbon font-display text-xs sm:text-sm tracking-widest uppercase clip-button">
              FORMATIVO ESPECIALIZADO
            </div>
            
            <h1 class="text-5xl sm:text-6xl lg:text-7xl font-display text-tatami-blanco leading-none tracking-tight uppercase">
              ENTRENA. <br/>
              COMPITE. <br/>
              <span class="text-rojo-impacto">GANA.</span>
            </h1>

            <p class="text-base sm:text-lg text-tatami-blanco/80 font-body border-l-4 border-dorado-campeon pl-4 py-1 max-w-lg">
              Disciplina, fuerza y humildad. Tu mejor versión empieza en el tatami de Najera's Team Central.
            </p>

            <div class="pt-6 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
              <Link
                to="/contactos?scroll=true"
                state={{ scrollTarget: 'contact-cards-section' }}
                class="px-8 py-4 text-center font-display text-base tracking-widest bg-rojo-impacto text-tatami-blanco hover:bg-white hover:text-rojo-impacto transition-colors shadow-lg uppercase clip-button impact-flash"
              >
                UNIRSE AHORA
              </Link>
              <Link
                to="/admin/login"
                class="relative px-8 py-4 text-center font-display text-base tracking-widest text-dorado-campeon hover:text-carbon shadow-lg uppercase clip-button impact-flash group"
              >
                {/* Border simulation layer */}
                <span class="absolute inset-0 bg-dorado-campeon z-0"></span>
                {/* Inner background layer */}
                <span class="absolute inset-[2px] bg-carbon group-hover:bg-dorado-campeon transition-colors z-0 clip-button" style={{ clipPath: 'polygon(9px 0, 100% 0, calc(100% - 9px) 100%, 0 100%)' }}></span>
                {/* Text layer */}
                <span class="relative z-10">ACCESO</span>
              </Link>
            </div>
          </div>
        </div>

      </section>

      {/* WELCOME SECTION & 3X3 QUICK ACCESS CARDS */}
      <section id="welcome-section" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column Welcome Message */}
          <div class="lg:col-span-5 space-y-6">
            <h2 class="text-4xl sm:text-5xl font-display text-tatami-blanco leading-none border-l-8 border-rojo-impacto pl-4 uppercase">
              Bienvenido a Najera's Team Central
            </h2>
            <p class="text-sm text-tatami-blanco/80 font-body leading-relaxed">
              Ofrecemos una infraestructura integral para la enseñanza marcial y la gestión técnica de competencias. Nuestro portal centraliza el control de estudiantes, cronogramas de combate, validación de grados y diplomados oficiales.
            </p>
            <div>
              <Link
                to="/quienes-somos"
                class="inline-flex items-center gap-2 px-6 py-3 bg-carbon hover:bg-rojo-impacto text-tatami-blanco font-display text-sm tracking-widest uppercase clip-button impact-flash"
              >
                LEER MÁS
              </Link>
            </div>
          </div>

          {/* Right Column 3x3 Grid of Square Cards (#F5F2E9 fill, #111114 icon, #8C1D1D title) */}
          <div class="lg:col-span-7 grid grid-cols-3 gap-4 sm:gap-5">
            {quickAccessCards.map((card, idx) => {
              const IconComp = card.icon;
              return (
                <Link
                  key={idx}
                  to={card.path}
                  class="bg-white p-4 sm:p-5 flex flex-col items-center justify-center text-center hover:bg-rojo-impacto hover:text-white transition-colors duration-200 clip-card aspect-square group text-carbon"
                >
                  <div class="mb-3 group-hover:scale-110 transition-transform">
                    <IconComp class="w-8 h-8" />
                  </div>
                  <span class="font-display text-xs sm:text-sm uppercase tracking-wider line-clamp-2">
                    {card.title}
                  </span>
                </Link>
              );
            })}
          </div>

        </div>
      </section>

      {/* NUESTROS SERVICIOS */}
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div class="space-y-2 border-l-8 border-dorado-campeon pl-4">
          <h2 class="text-4xl sm:text-5xl font-display text-carbon uppercase">
            NUESTROS SERVICIOS
          </h2>
          <p class="text-sm font-body font-bold text-carbon/70 uppercase tracking-widest">
            Especialistas en el campo deportivo de Taekwondo y Kickboxing
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((srv, index) => {
            const SrvIcon = srv.icon;
            return (
              <div
                key={index}
                class="bg-carbon text-tatami-blanco p-6 space-y-4 flex flex-col justify-between group clip-card hover:bg-rojo-impacto transition-colors"
              >
                <div class="space-y-4">
                  <div class="flex items-center justify-between">
                    <div class="text-dorado-campeon group-hover:text-white transition-colors">
                      <SrvIcon size={24} strokeWidth={2} />
                    </div>
                  </div>
                  <h3 class="text-xl font-display uppercase tracking-wide group-hover:text-white transition-colors">
                    {srv.title}
                  </h3>
                  <p class="text-sm font-body text-tatami-blanco/70 group-hover:text-white/90 leading-relaxed">
                    {srv.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
};

export default Home;
