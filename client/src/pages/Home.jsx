import React from 'react';
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
  Code
} from 'lucide-react';

const Home = () => {
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
      <section class="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-[#0B1550] border-b-2 border-[#C9A227]">
        {/* Dragon Watermark Background */}
        <div class="absolute right-0 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none z-0 w-[600px] h-[600px]">
          <img src="/logo.png" alt="Dragon Watermark" class="w-full h-full object-contain filter grayscale" />
        </div>

        {/* Combat Background Photo Overlay */}
        <div class="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&w=1920&q=80"
            alt="Practicante de Taekwondo y Kickboxing"
            class="w-full h-full object-cover object-center opacity-20 mix-blend-multiply"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-[#0B1550] via-[#0B1550]/80 to-transparent"></div>
        </div>

        <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column Championship Text */}
          <div class="lg:col-span-8 space-y-6 text-left animate-fade-in-up">
            <div class="inline-block px-3 py-1 bg-[#111114] border border-[#C9A227] text-[#C9A227] font-heading text-xs font-bold tracking-widest uppercase rounded-sm">
              [ GRADO CENTRAL • FORMATIVO ESPECIALIZADO ]
            </div>
            
            <h1 class="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#F5F2E9] leading-tight font-heading tracking-wider">
              NAJERA'S TEAM CENTRAL <br />
              <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#C9A227] via-yellow-200 to-[#F5F2E9]">
                FORMANDO CAMPEONES
              </span>
            </h1>

            <p class="text-sm sm:text-base text-[#C9A227] font-heading font-semibold uppercase tracking-widest border-l-4 border-[#8C1D1D] pl-4 py-1">
              "FORMANDO CAMPEONES EN EL TATAMI CON DISCIPLINA, FUERZA Y HUMILDAD"
            </p>

            <p class="text-xs sm:text-sm text-[#F5F2E9]/80 max-w-xl leading-relaxed">
              Taekwondo Olímpico y Kickboxing de Alto Rendimiento. Tu mejor versión empieza en el tatami con metodología pedagógica profesional.
            </p>

            <div class="pt-4 flex flex-wrap gap-4 items-center">
              <Link
                to="/admin/login"
                class="px-8 py-4 font-heading text-sm font-bold tracking-widest text-[#F5F2E9] border-2 border-[#F5F2E9] rounded-sm hover:bg-[#F5F2E9] hover:text-[#111114] transition-colors shadow-lg uppercase"
              >
                INGRESAR
              </Link>
              <Link
                to="/contactos"
                class="px-8 py-4 font-heading text-sm font-bold tracking-widest bg-[#8C1D1D] text-[#F5F2E9] border border-[#8C1D1D] rounded-sm hover:bg-[#6B1414] transition-colors shadow-lg uppercase"
              >
                UNIRSE AHORA ➔
              </Link>
            </div>
          </div>

          {/* Right Column Emblem Badge */}
          <div class="lg:col-span-4 flex flex-col items-center lg:items-end justify-center animate-fade-in-up-delay">
            <div class="bg-[#111114] border-2 border-[#C9A227] p-8 rounded-sm w-full max-w-xs text-center space-y-4 shadow-2xl">
              <div class="w-36 h-36 mx-auto rounded-full p-1 border-2 border-[#C9A227] bg-[#0B1550]">
                <img src="/logo.png" alt="Najera's Team Official Emblem" class="w-full h-full object-contain rounded-full p-1" />
              </div>
              <div>
                <h3 class="text-xl font-bold text-[#F5F2E9] font-heading tracking-wider">NAJERA'S TEAM</h3>
                <span class="text-[11px] font-bold text-[#C9A227] uppercase tracking-widest block">Formativo Especializado</span>
                <p class="text-[11px] text-gray-400 mt-1 italic">"Formando Campeones"</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* WELCOME SECTION & 3X3 QUICK ACCESS CARDS */}
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column Welcome Message */}
          <div class="lg:col-span-5 space-y-6">
            <span class="text-xs font-bold uppercase tracking-widest text-[#C9A227] font-heading">
              PLATAFORMA OFICIAL
            </span>
            <h2 class="text-3xl sm:text-4xl font-bold text-[#0B1550] font-heading leading-tight border-l-4 border-[#C9A227] pl-4">
              Bienvenido a Najera's Team Central - Administrador de Eventos de Taekwondo y Kickboxing
            </h2>
            <p class="text-xs sm:text-sm text-[#111114]/80 leading-relaxed">
              Ofrecemos una infraestructura integral para la enseñanza marcial y la gestión técnica de competencias. Nuestro portal centraliza el control de estudiantes, cronogramas de combate, validación de grados y diplomados oficiales.
            </p>
            <div>
              <Link
                to="/quienes-somos"
                class="inline-flex items-center gap-2 px-6 py-3 bg-[#8C1D1D] hover:bg-[#6B1414] text-[#F5F2E9] font-heading text-xs font-bold tracking-widest rounded-sm transition-colors uppercase shadow"
              >
                LEER MÁS...
                <span class="text-lg">➔</span>
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
                  class="bg-[#F5F2E9] rounded-sm p-4 sm:p-5 flex flex-col items-center justify-center text-center shadow-md hover:shadow-xl transition-all duration-200 border-b-4 border-[#8C1D1D] aspect-square group"
                >
                  <div class="w-12 h-12 rounded-sm bg-[#111114] flex items-center justify-center mb-3 group-hover:bg-[#8C1D1D] transition-colors">
                    <IconComp class="w-6 h-6 text-[#F5F2E9]" />
                  </div>
                  <span class="font-heading text-xs sm:text-sm font-bold text-[#8C1D1D] uppercase tracking-wider line-clamp-2">
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
        <div class="space-y-2 border-l-4 border-[#C9A227] pl-4">
          <h2 class="text-3xl sm:text-4xl font-bold text-[#0B1550] font-heading tracking-wider">
            NUESTROS SERVICIOS
          </h2>
          <p class="text-xs font-bold text-[#C9A227] uppercase tracking-widest">
            Somos especialistas en el campo deportivo de Taekwondo y Kickboxing
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((srv, index) => {
            const SrvIcon = srv.icon;
            return (
              <div
                key={index}
                class="chamfer-card p-6 space-y-4 flex flex-col justify-between group"
              >
                <div class="space-y-4">
                  <div class="flex items-center justify-between">
                    <div class="w-10 h-10 rounded-sm bg-[#0B1550] border border-[#C9A227]/40 flex items-center justify-center text-[#C9A227] group-hover:bg-[#8C1D1D] group-hover:text-[#F5F2E9] group-hover:border-[#8C1D1D] transition-all duration-300">
                      <SrvIcon size={20} class="group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <span class="font-heading text-xs font-bold text-[#C9A227] group-hover:text-white tracking-widest transition-colors duration-300">
                      0{index + 1}
                    </span>
                  </div>
                  <h3 class="text-base font-bold text-[#F5F2E9] group-hover:text-[#C9A227] font-heading tracking-wider transition-colors duration-300">
                    {srv.title}
                  </h3>
                  <p class="text-xs text-[#F5F2E9]/75 leading-relaxed">
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
