import React from 'react';
import { Target, Eye } from 'lucide-react';

const QuienesSomos = () => {
  const pilares = [
    {
      titulo: 'El Sello Circular',
      desc: 'No somos solo una academia, somos una familia marcial extendida. El formato circular simboliza el ciclo continuo de aprendizaje, la unidad y la perfección constante.',
    },
    {
      titulo: 'El Dragón Guardián',
      desc: 'El dragón oriental enroscado en forma de infinito representa que el camino del guerrero nunca termina y el flujo perfecto entre la fluidez del Taekwondo y el poder del Kickboxing.',
    },
    {
      titulo: 'Garantía del Fundador',
      desc: 'Llevar el apellido Nájera en el corazón de nuestro escudo es un compromiso personal de liderazgo, responsabilidad y acompañamiento pedagógico con cada alumno.',
    },
    {
      titulo: 'Formando Campeones',
      desc: 'Un campeón no solo levanta medallas en el tatami, sino que aplica la disciplina, fuerza y humildad en su estudio, trabajo y vida diaria.',
    },
    {
      titulo: 'Formativo Especializado',
      desc: 'Enfoque pedagógico, estructurado y profesional para todas las edades. Enseñanza segura y metodológica.',
    },
    {
      titulo: 'Simbolismo del Color',
      desc: 'Azul Real (Inteligencia táctica), Dorado (Éxito y campeonatos), y Blanco (Pureza técnica y mentalidad de aprendizaje continuo).',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      
      {/* Manifesto Header */}
      <div className="flex flex-col items-center text-center space-y-6">
        <div className="text-xs font-body font-bold text-dorado-campeon tracking-[0.2em] uppercase">
          FILOSOFÍA INSTITUCIONAL
        </div>
        <h1 className="text-5xl sm:text-7xl font-heading text-tatami-blanco tracking-tight leading-[0.9]">
          Najera's Team <span className="text-dorado-campeon">Central</span>
        </h1>
        <p className="text-sm sm:text-base text-tatami-blanco/60 font-body max-w-2xl mx-auto">
          "Formando campeones en el tatami con disciplina, fuerza y humildad"
        </p>
        <div className="h-[2px] w-24 bg-dorado-campeon/50 rounded-full"></div>
        <div className="text-sm font-body text-tatami-blanco/50">
          Fundado por el Mtro. Bryan Nájera<br/>Taekwondo Olímpico & Kickboxing WAKO
        </div>
      </div>

      {/* Main Asymmetric Panel (The Dragon Meaning) */}
      <div className="relative bg-white/[0.02] border border-white/5 rounded-3xl p-8 sm:p-12 shadow-xl shadow-black/20 overflow-hidden backdrop-blur-sm transition-all duration-500 hover:shadow-2xl hover:shadow-dorado-campeon/5">
        
        <div className="absolute top-0 left-0 w-1 h-full bg-dorado-campeon/50 rounded-l-3xl"></div>
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-8 space-y-8">
            <h2 className="text-4xl font-heading text-tatami-blanco tracking-tight leading-tight">
              El Dragón en <br/>nuestro <span className="text-dorado-campeon">escudo</span>
            </h2>
            <p className="text-base font-body text-tatami-blanco/70 leading-relaxed max-w-2xl">
              En la cultura oriental, el dragón representa la <strong className="text-dorado-campeon font-medium">fuerza elemental controlada</strong>, la agilidad y el dominio absoluto de la técnica.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 space-y-3 transition-all duration-300 hover:bg-white/[0.05] hover:-translate-y-1">
                <h4 className="text-lg font-heading text-dorado-campeon tracking-wide">Poder & Maestría</h4>
                <p className="text-sm font-body text-tatami-blanco/60 leading-relaxed">Fuerza bruta bajo control absoluto y agilidad técnica en Taekwondo y Kickboxing.</p>
              </div>
              <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 space-y-3 transition-all duration-300 hover:bg-white/[0.05] hover:-translate-y-1">
                <h4 className="text-lg font-heading text-dorado-campeon tracking-wide">Sabiduría & Protección</h4>
                <p className="text-sm font-body text-tatami-blanco/60 leading-relaxed">Un entorno seguro donde el verdadero poder no necesita tiranía sino humildad.</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex justify-center relative items-center mt-8 lg:mt-0 pb-4 lg:pb-0">
            <div className="absolute w-[150%] h-[150%] bg-[radial-gradient(circle_at_center,_rgba(227,178,60,0.15)_0%,_transparent_60%)] pointer-events-none"></div>
            
            <div className="relative w-64 h-64 lg:w-72 lg:h-72 transition-transform duration-700 hover:scale-105">
              <img src="/logo.png" alt="Najera's Team Logo" className="w-full h-full object-contain filter drop-shadow-[0_10px_20px_rgba(227,178,60,0.2)]" />
            </div>
          </div>
        </div>
      </div>

      {/* 6 Pilares Institucionales Grid */}
      <div className="space-y-10 pt-8">
        <div className="text-center space-y-4">
          <h3 className="text-4xl font-heading text-tatami-blanco tracking-tight">Los 6 <span className="text-rojo-impacto">Pilares</span></h3>
          <div className="h-[2px] w-16 bg-dorado-campeon/50 rounded-full mx-auto"></div>
          <p className="text-sm font-body text-tatami-blanco/60">La promesa de valor inquebrantable</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pilares.map((p, idx) => (
            <div key={idx} className="bg-white/[0.02] border border-white/5 rounded-2xl p-8 flex flex-col justify-between group transition-all duration-300 hover:border-dorado-campeon/20 shadow-md hover:shadow-xl hover:shadow-dorado-campeon/5 hover:-translate-y-1.5 relative overflow-hidden backdrop-blur-sm">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-dorado-campeon/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="space-y-4">
                <div className="font-body text-xs font-bold text-dorado-campeon/60 tracking-[0.2em] uppercase">
                  PILAR 0{idx + 1}
                </div>
                <h4 className="text-xl font-heading text-tatami-blanco tracking-wide group-hover:text-dorado-campeon transition-colors">{p.titulo}</h4>
                <p className="text-sm font-body text-tatami-blanco/60 leading-relaxed">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Misión y Visión */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8">
        <div className="bg-gradient-to-br from-[#A61019] to-[#8B0000] rounded-3xl p-10 flex flex-col items-center text-center space-y-6 shadow-xl shadow-rojo-impacto/20 group hover:shadow-2xl hover:shadow-rojo-impacto/30 transition-all duration-500 hover:-translate-y-1">
          <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-white group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-inner">
            <Target size={32} />
          </div>
          <h3 className="text-3xl font-heading text-white tracking-wide">Misión Formativa</h3>
          <p className="text-sm font-body text-white/90 leading-relaxed max-w-sm">
            Formar campeones dentro y fuera del tatami mediante una metodología estructurada, pedagógica y segura que combina el Taekwondo Olímpico y el Kickboxing.
          </p>
        </div>

        <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-10 flex flex-col items-center text-center space-y-6 shadow-xl shadow-black/20 group hover:shadow-2xl hover:shadow-dorado-campeon/10 transition-all duration-500 hover:border-dorado-campeon/20 hover:-translate-y-1 backdrop-blur-sm">
          <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-dorado-campeon/20 flex items-center justify-center text-dorado-campeon group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300 shadow-sm">
            <Eye size={32} />
          </div>
          <h3 className="text-3xl font-heading text-tatami-blanco tracking-wide">Visión de Excelencia</h3>
          <p className="text-sm font-body text-tatami-blanco/60 leading-relaxed max-w-sm">
            Consolidar a Najera's Team Central como la sede marcial de élite en el país, referente en formación integral, organización de eventos y preparación de atletas de selección.
          </p>
        </div>
      </div>

    </div>
  );
};

export default QuienesSomos;
