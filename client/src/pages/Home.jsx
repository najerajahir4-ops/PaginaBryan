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
      <section class="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden bg-carbon">
        {/* Lado derecho con imagen cortada en diagonal */}
        <div class="absolute right-0 top-0 w-full lg:w-3/5 h-full z-0 clip-diagonal-right">
          <img
            src="https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&w=1920&q=80"
            alt="Combat Impact"
            class="w-full h-full object-cover object-center opacity-40 mix-blend-overlay"
          />
          <div class="absolute inset-0 bg-rojo-impacto mix-blend-multiply opacity-20"></div>
        </div>

        <div class="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-12">
          
          {/* Left Column Championship Text */}
          <div class="w-full lg:w-1/2 space-y-6 text-left animate-hit">
            <div class="inline-block px-3 py-1 bg-dorado-campeon text-carbon font-display text-sm tracking-widest uppercase clip-button">
              FORMATIVO ESPECIALIZADO
            </div>
            
            <h1 class="text-4xl sm:text-6xl lg:text-7xl font-display text-tatami-blanco leading-none tracking-tight uppercase">
              ENTRENA. <br/>
              COMPITE. <br/>
              <span class="text-rojo-impacto">GANA.</span>
            </h1>

            <p class="text-sm sm:text-lg text-tatami-blanco/80 font-body border-l-4 border-dorado-campeon pl-4 py-1 max-w-lg">
              Disciplina, fuerza y humildad. Tu mejor versión empieza en el tatami de Najera's Team Central.
            </p>

            <div class="pt-4 flex flex-wrap gap-4 items-center">
              <Link
                to="/contactos?scroll=true"
                state={{ scrollTarget: 'contact-cards-section' }}
                class="px-8 py-4 font-display text-base tracking-widest bg-rojo-impacto text-tatami-blanco hover:bg-white hover:text-rojo-impacto transition-colors shadow-lg uppercase clip-button impact-flash"
              >
                UNIRSE AHORA
              </Link>
              <Link
                to="/admin/login"
                class="px-8 py-4 font-display text-base tracking-widest bg-carbon text-dorado-campeon border border-dorado-campeon hover:bg-dorado-campeon hover:text-carbon transition-colors shadow-lg uppercase clip-button impact-flash"
              >
                ACCESO
              </Link>
            </div>
          </div>
        </div>


        </div>

      </section>

      {/* SVG KICK TRAJECTORY DIVIDER */}
      <div class="w-full h-16 sm:h-24 bg-carbon flex justify-center items-center overflow-hidden">
        <svg viewBox="0 0 1200 100" class="w-full h-full px-4" preserveAspectRatio="none">
          <path d="M-100,80 L200,80 L400,20 L800,20 L1000,80 L1300,80" stroke="var(--rojo-impacto)" strokeWidth="4" fill="none" class="draw-path" />
          <circle cx="600" cy="20" r="6" fill="var(--dorado-campeon)" class="animate-pulse" />
        </svg>
      </div>

      {/* WELCOME SECTION & 3X3 QUICK ACCESS CARDS */}
      <section id="welcome-section" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column Welcome Message */}
          <div class="lg:col-span-5 space-y-6">
            <h2 class="text-4xl sm:text-5xl font-display text-carbon leading-none border-l-8 border-rojo-impacto pl-4 uppercase">
              Bienvenido a Najera's Team Central
            </h2>
            <p class="text-sm text-carbon/80 font-body leading-relaxed">
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
