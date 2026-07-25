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
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end border-l-8 border-dorado-campeon pl-6 py-2">
        <div class="lg:col-span-8 space-y-2">
          <div class="text-sm font-display font-bold text-dorado-campeon tracking-widest uppercase">
            [ FILOSOFÍA INSTITUCIONAL • SEDE CENTRAL ]
          </div>
          <h1 class="text-4xl sm:text-6xl font-bold text-carbon font-display tracking-wider uppercase">
            NAJERA'S TEAM CENTRAL
          </h1>
          <p class="text-sm sm:text-base text-carbon/80 font-body font-bold uppercase tracking-widest">
            "FORMANDO CAMPEONES EN EL TATAMI CON DISCIPLINA, FUERZA Y HUMILDAD"
          </p>
        </div>
        <div class="lg:col-span-4 text-left lg:text-right text-sm font-body text-carbon/70 font-bold uppercase">
          Fundado por el Mtro. Bryan Nájera <br />
          Taekwondo Olímpico & Kickboxing WAKO
        </div>
      </div>

      {/* Main Asymmetric Panel with Integrated Watermark Dragon */}
      <div class="relative bg-carbon border-l-8 border-dorado-campeon p-8 sm:p-12 overflow-hidden shadow-2xl clip-card">
        {/* Dragon Watermark */}
        <div class="absolute right-0 bottom-0 opacity-10 pointer-events-none w-96 h-96 z-0">
          <img src="/logo.png" alt="Dragon Emblem" class="w-full h-full object-contain filter grayscale" />
        </div>

        <div class="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div class="lg:col-span-8 space-y-6">
            <h2 class="text-3xl sm:text-4xl font-bold text-tatami-blanco font-display tracking-wider border-b border-dorado-campeon/30 pb-3 uppercase">
              El Significado del Dragón en Nuestro Escudo
            </h2>
            <p class="text-sm sm:text-base font-body text-tatami-blanco/90 leading-relaxed">
              En la cultura oriental, el dragón representa la <strong class="text-dorado-campeon">fuerza elemental pero controlada</strong>, la agilidad y el dominio absoluto de la técnica.
            </p>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div class="bg-black/30 p-4 space-y-1 border-l-2 border-rojo-impacto">
                <h4 class="text-sm font-bold text-dorado-campeon font-display tracking-widest uppercase">Poder & Maestría</h4>
                <p class="text-xs font-body text-tatami-blanco/70">Fuerza bruta bajo control absoluto y agilidad técnica en Taekwondo y Kickboxing.</p>
              </div>
              <div class="bg-black/30 p-4 space-y-1 border-l-2 border-rojo-impacto">
                <h4 class="text-sm font-bold text-dorado-campeon font-display tracking-widest uppercase">Sabiduría & Protección</h4>
                <p class="text-xs font-body text-tatami-blanco/70">Un entorno seguro donde el verdadero poder no necesita tiranía sino humildad.</p>
              </div>
            </div>
          </div>

          <div class="lg:col-span-4 flex justify-center">
            <div class="w-64 h-64 lg:w-72 lg:h-72 drop-shadow-[0_0_30px_rgba(201,162,39,0.3)] animate-pulse-slow hover:scale-105 transition-transform duration-500">
              <img src="/logo.png" alt="Najera's Team Logo" class="w-full h-full object-contain" />
            </div>
          </div>
        </div>
      </div>

      {/* 6 Pilares Institucionales Grid */}
      <div class="space-y-6">
        <div class="border-l-8 border-dorado-campeon pl-4 space-y-1">
          <h3 class="text-3xl font-bold text-carbon font-display tracking-wider uppercase">Los 6 Pilares de Nuestro Escudo</h3>
          <p class="text-sm font-body text-carbon/80 uppercase font-bold tracking-widest">La promesa de valor inquebrantable</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pilares.map((p, idx) => (
            <div key={idx} class="bg-carbon border-l-4 border-l-dorado-campeon border-r border-y border-dorado-campeon/20 p-6 clip-card space-y-3 shadow-lg">
              <div class="font-display text-sm font-bold text-dorado-campeon tracking-widest uppercase">
                [ PILAR 0{idx + 1} ]
              </div>
              <h4 class="text-xl font-bold text-tatami-blanco font-display tracking-wider uppercase">{p.titulo}</h4>
              <p class="text-sm font-body text-tatami-blanco/80 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Misión y Visión */}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="bg-rojo-impacto border-l-8 border-carbon p-8 clip-card space-y-4">
          <div class="text-carbon flex items-center justify-center">
            <Target size={40} />
          </div>
          <h3 class="text-3xl font-bold text-white font-display tracking-wider uppercase text-center">Misión Formativa</h3>
          <p class="text-sm font-body font-bold text-white/90 leading-relaxed text-center">
            Formar campeones dentro y fuera del tatami mediante una metodología estructurada, pedagógica y segura que combina el Taekwondo Olímpico y el Kickboxing.
          </p>
        </div>

        <div class="bg-carbon border-l-8 border-dorado-campeon p-8 clip-card space-y-4">
          <div class="text-dorado-campeon flex items-center justify-center">
            <Eye size={40} />
          </div>
          <h3 class="text-3xl font-bold text-tatami-blanco font-display tracking-wider uppercase text-center">Visión de Excelencia</h3>
          <p class="text-sm font-body text-tatami-blanco/80 leading-relaxed text-center">
            Consolidar a Najera's Team Central como la sede marcial de élite en el país, referente en formación integral, organización de eventos y preparación de atletas de selección.
          </p>
        </div>
      </div>

    </div>
  );
};

export default QuienesSomos;
