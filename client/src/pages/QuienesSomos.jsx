import React from 'react';
import { Target, Eye } from 'lucide-react';

const QuienesSomos = () => {
  const pilares = [
    {
      titulo: 'El Sello Circular y Sentido de Comunidad',
      desc: 'No somos solo una academia, somos una familia marcial extendida. El formato circular simboliza el ciclo continuo de aprendizaje, la unidad y la perfección constante.',
    },
    {
      titulo: 'El Dragón Guardián & El Infinito (∞)',
      desc: 'El dragón oriental enroscado en forma de infinito representa que el camino del guerrero nunca termina y el flujo perfecto entre la fluidez del Taekwondo y el poder de impacto del Kickboxing.',
    },
    {
      titulo: 'Garantía del Fundador: Bryan Nájera',
      desc: 'Llevar el apellido Nájera en el corazón de nuestro escudo es un compromiso personal de liderazgo, responsabilidad y acompañamiento pedagógico con cada alumno.',
    },
    {
      titulo: 'Promesa: "Formando Campeones"',
      desc: 'Un campeón no solo levanta medallas en el tatami, sino que aplica la disciplina, fuerza y humildad en su estudio, trabajo y vida diaria.',
    },
    {
      titulo: 'Cimiento: "Formativo Especializado"',
      desc: 'Enfoque pedagógico, estructurado y profesional para todas las edades. Enseñanza segura y metodológica.',
    },
    {
      titulo: 'Simbolismo del Color (Sangre Azul & Dorado)',
      desc: 'Azul Real (Inteligencia táctica y lealtad), Dorado (Éxito y campeonatos), y Blanco (Pureza técnica y mentalidad de aprendizaje continuo).',
    },
  ];

  return (
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Asymmetric Left-Aligned Header */}
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end border-l-4 border-[#C9A227] pl-6 py-2">
        <div class="lg:col-span-8 space-y-2">
          <div class="text-xs font-heading font-bold text-[#C9A227] tracking-widest uppercase">
            [ FILOSOFÍA INSTITUCIONAL • SEDE CENTRAL ]
          </div>
          <h1 class="text-4xl sm:text-6xl font-bold text-[#0B1550] font-heading tracking-wider">
            NAJERA'S TEAM CENTRAL
          </h1>
          <p class="text-sm sm:text-base text-[#C9A227] font-heading font-bold tracking-widest uppercase">
            "FORMANDO CAMPEONES EN EL TATAMI CON DISCIPLINA, FUERZA Y HUMILDAD"
          </p>
        </div>
        <div class="lg:col-span-4 text-left lg:text-right text-xs text-[#111114]/70">
          Fundado por el Mtro. Bryan Nájera <br />
          Taekwondo Olímpico & Kickboxing WAKO
        </div>
      </div>

      {/* Main Asymmetric Panel with Integrated Watermark Dragon */}
      <div class="relative bg-[#111114] border-2 border-[#C9A227]/40 p-8 sm:p-12 rounded-sm overflow-hidden shadow-2xl">
        {/* Dragon Watermark */}
        <div class="absolute right-0 bottom-0 opacity-10 pointer-events-none w-96 h-96 z-0">
          <img src="/logo.png" alt="Dragon Emblem" class="w-full h-full object-contain filter grayscale" />
        </div>

        <div class="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div class="lg:col-span-8 space-y-6">
            <h2 class="text-2xl sm:text-3xl font-bold text-[#F5F2E9] font-heading tracking-wider border-b border-[#C9A227]/30 pb-3">
              El Significado del Dragón en Nuestro Escudo
            </h2>
            <p class="text-xs sm:text-sm text-[#F5F2E9]/80 leading-relaxed">
              En la cultura oriental, el dragón representa la <strong class="text-[#C9A227]">fuerza elemental pero controlada</strong>, la agilidad y el dominio absoluto de la técnica.
            </p>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div class="chamfer-card p-4 space-y-1">
                <h4 class="text-xs font-bold text-[#C9A227] font-heading tracking-widest">Poder & Maestría</h4>
                <p class="text-[11px] text-gray-300">Fuerza bruta bajo control absoluto y agilidad técnica en Taekwondo y Kickboxing.</p>
              </div>
              <div class="chamfer-card p-4 space-y-1">
                <h4 class="text-xs font-bold text-[#C9A227] font-heading tracking-widest">Sabiduría & Protección</h4>
                <p class="text-[11px] text-gray-300">Un entorno seguro donde el verdadero poder no necesita tiranía sino humildad.</p>
              </div>
            </div>
          </div>

          <div class="lg:col-span-4 flex justify-center">
            <div class="w-56 h-56 rounded-full border-2 border-[#C9A227] p-1 bg-[#0B1550] shadow-2xl">
              <img src="/logo.png" alt="Najera's Team Logo" class="w-full h-full object-contain rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* 6 Pilares Institucionales Grid */}
      <div class="space-y-6">
        <div class="border-l-4 border-[#C9A227] pl-4 space-y-1">
          <h3 class="text-2xl font-bold text-[#0B1550] font-heading tracking-wider">Los 6 Pilares de Nuestro Escudo</h3>
          <p class="text-xs text-[#111114]/80">La promesa de valor inquebrantable que sostiene a la comunidad de Najera's Team Central</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pilares.map((p, idx) => (
            <div key={idx} class="bg-[#111114] border-t-2 border-t-[#C9A227] border-x border-b border-[#C9A227]/20 p-6 rounded-sm space-y-3 shadow-lg">
              <div class="font-heading text-xs font-bold text-[#C9A227] tracking-widest">
                [ PILAR 0{idx + 1} ]
              </div>
              <h4 class="text-base font-bold text-[#F5F2E9] font-heading tracking-wider">{p.titulo}</h4>
              <p class="text-xs text-gray-300 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Misión y Visión */}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="bg-[#111114] border-l-4 border-[#8C1D1D] border-y border-r border-white/10 p-8 rounded-sm space-y-4">
          <div class="w-10 h-10 rounded-sm bg-[#8C1D1D]/20 text-[#8C1D1D] flex items-center justify-center border border-[#8C1D1D]">
            <Target size={20} />
          </div>
          <h3 class="text-xl font-bold text-[#F5F2E9] font-heading tracking-wider">Misión Formativa</h3>
          <p class="text-xs text-gray-300 leading-relaxed">
            Formar campeones dentro y fuera del tatami mediante una metodología estructurada, pedagógica y segura que combina el Taekwondo Olímpico y el Kickboxing.
          </p>
        </div>

        <div class="bg-[#111114] border-l-4 border-[#C9A227] border-y border-r border-white/10 p-8 rounded-sm space-y-4">
          <div class="w-10 h-10 rounded-sm bg-[#C9A227]/20 text-[#C9A227] flex items-center justify-center border border-[#C9A227]">
            <Eye size={20} />
          </div>
          <h3 class="text-xl font-bold text-[#F5F2E9] font-heading tracking-wider">Visión de Excelencia</h3>
          <p class="text-xs text-gray-300 leading-relaxed">
            Consolidar a Najera's Team Central como la sede marcial de élite en el país, referente en formación integral, organización de eventos y preparación de atletas de selección.
          </p>
        </div>
      </div>

    </div>
  );
};

export default QuienesSomos;
