import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  GiBlackBelt, 
  GiHighKick, 
  GiTrophyCup
} from 'react-icons/gi';

import {
  Zap,
  BookOpen,
  Monitor,
  Code,
  ChevronDown,
  ArrowRight
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

  // Quick Access Cards - Rediseñadas estilo Placas de Honor
  const quickAccessCards = [
    { title: 'Alumnos Destacados', icon: GiTrophyCup, path: '/alumnos-destacados' },
    { title: 'Campeonatos', icon: GiHighKick, path: '/campeonatos' },
    { title: 'Grados', icon: GiBlackBelt, path: '/grados' },
  ];

  // 4 Services Cards - Rediseñadas estilo Placas de Honor
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
    <div className="flex flex-col bg-carbon pb-24">
      
      {/* HERO SECTION */}
      <section className="relative min-h-[calc(100vh-4rem)] flex items-center overflow-hidden bg-carbon">
        
        {/* Background Visuals */}
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden flex items-center justify-end pointer-events-none">
          {/* Precise radial glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60rem] h-[60rem] bg-[radial-gradient(circle_at_center,_rgba(227,178,60,0.08)_0%,_transparent_60%)] pointer-events-none hidden lg:block"></div>
          
          {/* Logo Estático como textura masiva */}
          <div className="absolute right-[-20%] sm:right-[-10%] lg:right-[-5%] top-1/2 -translate-y-1/2 w-[150vw] sm:w-[90vw] lg:w-[65vw] opacity-[0.03] lg:opacity-[0.04] transition-all duration-1000 grayscale">
            <img
              src="/logo.png"
              alt=""
              className="w-full h-full object-contain filter blur-[2px]"
            />
          </div>

          {/* Gradient lateral para legibilidad del texto */}
          <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-carbon via-carbon/80 to-transparent pointer-events-none"></div>
          {/* Gradient inferior estricto para evitar que el logo se corte abruptamente */}
          <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-carbon via-carbon/80 to-transparent pointer-events-none"></div>
        </div>

        {/* Left Column Text */}
        <div className="relative z-10 w-full lg:w-2/3 flex flex-col px-4 sm:px-6 lg:px-12 xl:px-20 py-8 lg:py-0 pointer-events-auto self-stretch lg:justify-center">
          <div className="flex flex-col justify-between h-full lg:h-auto text-left animate-hit max-w-2xl mx-auto lg:mx-0 w-full">
            
            <div className="space-y-6 mt-8 lg:mt-0">
              {/* Badge */}
              <div className="inline-flex items-center gap-4">
                <div className="h-[1px] w-10 bg-dorado-campeon/60"></div>
                <span className="text-tatami-blanco/60 font-body font-semibold text-xs sm:text-sm tracking-[0.25em] uppercase">
                  FORMATIVO ESPECIALIZADO
                </span>
              </div>
              
              <h1 className="text-6xl sm:text-7xl lg:text-[7.5rem] font-heading text-tatami-blanco leading-[0.85] tracking-tight uppercase">
                ENTRENA.<br/>
                COMPITE.<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-br from-rojo-impacto to-[#8B0000] drop-shadow-[0_0_15px_rgba(214,40,57,0.3)]">GANA.</span>
              </h1>

              <p className="hidden sm:block text-base sm:text-lg text-tatami-blanco/50 font-body max-w-xl leading-relaxed mt-4">
                Disciplina, fuerza y humildad. Tu mejor versión empieza en el tatami de <strong className="text-tatami-blanco/80 font-semibold">Najera's Team Central</strong>.
              </p>
            </div>

            <div className="pt-10 pb-6 lg:pb-0 mt-auto lg:mt-10 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
              <Link
                to="/contactos?scroll=true"
                state={{ scrollTarget: 'contact-cards-section' }}
                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#A61019] border border-white/5 font-body font-bold text-sm tracking-[0.2em] text-tatami-blanco transition-all duration-300 hover:bg-[#D62828] hover:shadow-[0_0_30px_rgba(214,40,57,0.3)] hover:-translate-y-0.5 uppercase overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                <span className="relative z-10 drop-shadow-md">MÁS INFORMACIÓN</span>
                <ArrowRight className="relative z-10 group-hover:translate-x-1 transition-transform duration-300" size={18} />
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center z-20">
          <button
            onClick={handleScrollDown}
            className={`transition-opacity duration-500 text-dorado-campeon/50 hover:text-dorado-campeon animate-bounce ${showScrollArrow ? 'opacity-100' : 'opacity-0'}`}
          >
            <ChevronDown size={36} />
          </button>
        </div>
      </section>

      {/* SEPARADOR DECORATIVO */}
      <div className="w-full flex justify-center px-4 py-16 lg:py-24">
        <div className="w-full max-w-3xl h-[1px] bg-gradient-to-r from-transparent via-dorado-campeon/20 to-transparent"></div>
      </div>

      {/* WELCOME SECTION & QUICK ACCESS */}
      <section id="welcome-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column */}
          <div className="lg:col-span-5 space-y-8">
            <h2 className="text-4xl sm:text-5xl font-heading text-tatami-blanco leading-none uppercase tracking-wide">
              BIENVENIDO A <br/>
              <span className="text-dorado-campeon">NAJERA'S TEAM</span>
            </h2>
            <div className="h-[2px] w-16 bg-dorado-campeon/50"></div>
            <p className="text-sm text-tatami-blanco/70 font-body leading-relaxed">
              Ofrecemos una infraestructura integral para la enseñanza marcial y la gestión técnica de competencias. Nuestro portal centraliza el control de estudiantes, cronogramas de combate, validación de grados y diplomados oficiales.
            </p>
            <div>
              <Link
                to="/quienes-somos"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#0A0B0E] border border-dorado-campeon/30 hover:border-dorado-campeon text-dorado-campeon font-heading text-sm tracking-widest uppercase transition-all hover:bg-dorado-campeon/10 hover:shadow-[0_0_15px_rgba(227,178,60,0.15)]"
              >
                NUESTRO MANIFIESTO
              </Link>
            </div>
          </div>

          {/* Right Column 3x3 Grid - Rediseñado */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
            {quickAccessCards.map((card, idx) => {
              const IconComp = card.icon;
              return (
                <Link
                  key={idx}
                  to={card.path}
                  className="group bg-[#0A0B0E] border border-white/5 p-6 flex flex-col items-center justify-center text-center transition-all duration-300 shadow-[0_0_15px_rgba(227,178,60,0.05)] hover:shadow-[0_0_25px_rgba(227,178,60,0.15)] hover:border-dorado-campeon/30 hover:-translate-y-1 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-dorado-campeon/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  <div className="mb-4 text-dorado-campeon/50 group-hover:text-dorado-campeon group-hover:scale-110 transition-all duration-300 relative z-10">
                    <IconComp className="w-10 h-10" />
                  </div>
                  <span className="font-heading text-sm text-tatami-blanco/80 group-hover:text-tatami-blanco uppercase tracking-widest leading-tight relative z-10">
                    {card.title}
                  </span>
                </Link>
              );
            })}
          </div>

        </div>
      </section>

      {/* NUESTROS SERVICIOS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 pt-24 lg:pt-32 w-full">
        <div className="space-y-4 text-center max-w-3xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-heading text-tatami-blanco uppercase tracking-wide">
            SERVICIOS <span className="text-rojo-impacto">ESPECIALIZADOS</span>
          </h2>
          <div className="h-[2px] w-24 bg-dorado-campeon/50 mx-auto"></div>
          <p className="text-xs font-body text-dorado-campeon/70 uppercase tracking-[0.2em]">
            Gestión técnica y deportiva de Taekwondo y Kickboxing
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((srv, index) => {
            const SrvIcon = srv.icon;
            return (
              <div
                key={index}
                className="bg-[#0A0B0E] border border-white/5 p-8 flex flex-col justify-between group transition-all duration-300 shadow-[0_0_15px_rgba(227,178,60,0.05)] hover:shadow-[0_0_25px_rgba(227,178,60,0.15)] hover:border-dorado-campeon/30 hover:-translate-y-1 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-dorado-campeon/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="space-y-5 relative z-10">
                  <div className="w-12 h-12 bg-carbon border border-dorado-campeon/20 flex items-center justify-center text-dorado-campeon/70 group-hover:text-dorado-campeon group-hover:border-dorado-campeon transition-colors">
                    <SrvIcon size={24} strokeWidth={1.5} />
                  </div>
                  
                  <h3 className="text-xl font-heading text-tatami-blanco/90 uppercase tracking-widest leading-tight group-hover:text-tatami-blanco transition-colors">
                    {srv.title}
                  </h3>
                  
                  <p className="text-sm font-body text-tatami-blanco/60 leading-relaxed group-hover:text-tatami-blanco/80 transition-colors">
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
