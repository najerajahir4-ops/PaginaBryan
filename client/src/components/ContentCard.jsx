import React from 'react';
import { HelpCircle, User, Users, Trophy, Timer, CheckCircle2, XCircle, AlertTriangle, Swords, Medal, Shield, Target, Award } from 'lucide-react';
import { GiBoxingGlove, GiBlackBelt } from 'react-icons/gi';

const iconMap = {
  '🥊': <GiBoxingGlove className="w-full h-full" />,
  '🤔': <HelpCircle className="w-full h-full" />,
  '🎂': <Users className="w-full h-full" />,
  '👦': <User className="w-full h-full" />,
  '👧': <User className="w-full h-full" />,
  '👨': <User className="w-full h-full" />,
  '👩': <User className="w-full h-full" />,
  '🥋': <GiBlackBelt className="w-full h-full" />,
  '💪': <Medal className="w-full h-full" />,
  '🏆': <Trophy className="w-full h-full" />,
  '⏱️': <Timer className="w-full h-full" />,
  '❌': <XCircle className="w-full h-full" />,
  '✅': <CheckCircle2 className="w-full h-full" />,
  '✔️': <CheckCircle2 className="w-full h-full" />,
  '⚠️': <AlertTriangle className="w-full h-full" />,
  '🤼': <Swords className="w-full h-full" />,
  '🛡️': <Shield className="w-full h-full" />,
  '🎯': <Target className="w-full h-full" />,
  '🏅': <Award className="w-full h-full" />
};

const extractIcon = (text) => {
  const match = text.match(/^([^\w\s"'(¿¡A-Za-z0-9]+)\s*(.*)/);
  if (match) {
    return { iconStr: match[1].trim(), text: match[2].trim() };
  }
  return { iconStr: null, text: text.trim() };
};

const ContentCard = ({ rawText }) => {
  if (!rawText) return null;

  // 1. Normalización y corrección de contenido
  let normalizedText = rawText
    .replace(/Children/gi, 'Niños')
    .replace(/Golpa Puntos/gi, 'Golpes por puntos');

  // Limpiar cadena de equipo básico cruda si existe
  const equipMatch = normalizedText.match(/CASCO.*PROTECTOR BUCAL.*/i);
  if (equipMatch) {
    normalizedText = normalizedText.replace(
      equipMatch[0], 
      "🛡️ Equipo básico\nCasco\nProtector bucal\nGuantes\nEspinilleras\nTop en V + pantalón largo"
    );
  }

  const lines = normalizedText.split('\n').map(l => l.trim()).filter(l => l !== '');
  if (lines.length === 0) return null;

  // 2. Parseo base a bloques
  const baseBlocks = [];
  let currentBlock = { type: 'header', icon: null, title: '', subtitle: '', content: [], chips: [] };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const { iconStr, text } = extractIcon(line);
    
    const isQuestion = text.startsWith('¿') && text.endsWith('?');
    const isUppercase = text.length > 0 && text.toUpperCase() === text && /[A-Z]/.test(text);
    const isShort = text.length <= 60;
    const isHeading = (isShort && (isQuestion || isUppercase)) || !!iconStr;
    const isChip = text.includes('➝') || text.includes('->');
    const isBullet = iconStr === '❌' || iconStr === '✅' || iconStr === '✔️' || iconStr === '⚠️';

    if (i === 0) {
      currentBlock.title = text;
      currentBlock.icon = iconStr;
      continue;
    }

    if (i === 1 && !isHeading && !isChip && !isBullet) {
      currentBlock.subtitle = text;
      continue;
    }

    if (isHeading && !isChip && !isBullet && text.length > 0) {
      baseBlocks.push(currentBlock);
      currentBlock = { type: 'section', icon: iconStr, title: text, content: [], chips: [], originalTitle: text };
    } else if (isChip) {
      currentBlock.chips.push(text);
    } else {
      currentBlock.content.push(line);
    }
  }
  baseBlocks.push(currentBlock);

  const headerBlock = baseBlocks[0];
  const rawSections = baseBlocks.slice(1);

  // 3. Agrupación inteligente en Super-Secciones (Reglas, Puntuación, etc.)
  const processedSections = [];
  const usedTitles = new Set();

  // A. Reglas Básicas
  const queEs = rawSections.find(s => s.title.includes('¿Qué es?'));
  const cuantoDura = rawSections.find(s => s.title.includes('¿Cuánto dura?'));
  if (queEs || cuantoDura) {
    processedSections.push({
      type: 'group-grid',
      title: 'Reglas Básicas',
      icon: '🤼',
      blocks: [queEs, cuantoDura].filter(Boolean)
    });
    if (queEs) usedTitles.add(queEs.title);
    if (cuantoDura) usedTitles.add(cuantoDura.title);
  }

  // B. Quién puede competir (Grid de Chips)
  const quienPuede = rawSections.find(s => s.title.includes('¿Quién puede competir?'));
  if (quienPuede) {
    processedSections.push({
      type: 'chips-section',
      title: '¿Quién puede competir?',
      icon: '🎂',
      chips: quienPuede.chips,
      content: quienPuede.content
    });
    usedTitles.add(quienPuede.title);
  }

  // C. Equipo Básico
  const equipo = rawSections.find(s => s.title.toLowerCase().includes('equipo básico'));
  if (equipo) {
    processedSections.push({
      type: 'equipment-grid',
      title: 'Equipo Básico',
      icon: '🛡️',
      items: equipo.content
    });
    usedTitles.add(equipo.title);
  }

  // D. Sistema de Puntuación
  const comoSeAnota = rawSections.find(s => s.title.includes('¿Cómo se anota?'));
  const puntos = rawSections.filter(s => 
    !usedTitles.has(s.title) && 
    (s.title.includes('Puño') || s.title.includes('Patada') || s.title.includes('Barrido') || s.title.includes('Golpes'))
  );
  if (comoSeAnota || puntos.length > 0) {
    processedSections.push({
      type: 'scoring-system',
      title: 'Sistema de Puntuación',
      icon: '🎯',
      mainBlock: comoSeAnota,
      scoreItems: puntos
    });
    if (comoSeAnota) usedTitles.add(comoSeAnota.title);
    puntos.forEach(p => usedTitles.add(p.title));
  }

  // E. Fallback: Cualquier otra sección no capturada por los grupos inteligentes
  rawSections.forEach(section => {
    if (!usedTitles.has(section.title)) {
      processedSections.push({
        type: 'standard-block',
        ...section
      });
    }
  });

  // --- Helpers de renderizado ---
  const renderParagraph = (p, i) => {
    const { iconStr: pIcon, text: pText } = extractIcon(p);
    
    if (pIcon === '❌') return <div key={i} className="flex items-start gap-3 py-2.5 px-4 bg-red-950/30 border-l-[3px] border-red-500 rounded-r-md my-2"><XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" /><span className="text-tatami-blanco/90 font-body">{pText}</span></div>;
    if (pIcon === '✅' || pIcon === '✔️') return <div key={i} className="flex items-start gap-3 py-2.5 px-4 bg-emerald-950/30 border-l-[3px] border-emerald-500 rounded-r-md my-2"><CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" /><span className="text-tatami-blanco/90 font-body">{pText}</span></div>;
    if (pIcon === '⚠️') return <div key={i} className="flex items-start gap-3 py-3 px-4 bg-amber-950/30 border-l-[3px] border-amber-500 rounded-r-md my-3"><AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" /><span className="text-tatami-blanco font-body font-bold">{pText}</span></div>;

    return (
      <p key={i} className="text-tatami-blanco/80 font-body leading-relaxed text-base">
        {pIcon && iconMap[pIcon] ? <span className="inline-block w-5 h-5 mr-2 align-text-bottom text-dorado-campeon">{iconMap[pIcon]}</span> : (pIcon ? <span className="mr-2">{pIcon}</span> : null)}
        {pText}
      </p>
    );
  };

  const renderSectionHeader = (title, iconStr, isQuestion = false) => {
    const iconBgClass = isQuestion ? 'bg-rojo-impacto text-white' : 'bg-dorado-campeon text-carbon';
    const iconShadowClass = isQuestion ? 'shadow-[0_0_10px_rgba(214,40,57,0.3)]' : 'shadow-[0_0_10px_rgba(227,178,60,0.3)]';
    
    return (
      <div className="flex items-center gap-4 mb-4">
        {iconStr && iconMap[iconStr] && (
          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 p-2 ${iconBgClass} ${iconShadowClass}`}>
            {iconMap[iconStr]}
          </div>
        )}
        <h3 className="text-xl sm:text-2xl font-display font-bold text-tatami-blanco uppercase tracking-wide">
          {title}
        </h3>
      </div>
    );
  };

  const renderChip = (label, value, i) => (
    <div key={i} className="flex items-center gap-2 bg-carbon border border-dorado-campeon/40 rounded-md px-4 py-3 hover:border-dorado-campeon hover:bg-white/5 transition-colors shadow-sm w-full sm:w-auto">
      <span className="font-display font-bold text-dorado-campeon text-sm sm:text-base uppercase tracking-wide whitespace-nowrap">
        {label}
      </span>
      {value && (
        <>
          <span className="text-tatami-blanco/30 text-xs">|</span>
          <span className="text-tatami-blanco/90 font-body text-sm sm:text-base font-medium">{value}</span>
        </>
      )}
    </div>
  );

  return (
    <div className="relative clip-card bg-carbon border-t-[4px] border-dorado-campeon impact-flash transition-all duration-300 shadow-2xl">
      
      {/* HEADER */}
      <div className="p-6 sm:p-10 pb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-2">
          {headerBlock.icon && iconMap[headerBlock.icon] ? (
            <div className="w-16 h-16 rounded-full bg-dorado-campeon flex items-center justify-center text-carbon shadow-[0_0_15px_rgba(227,178,60,0.4)] flex-shrink-0 p-3">
              {iconMap[headerBlock.icon]}
            </div>
          ) : headerBlock.icon ? (
            <div className="w-16 h-16 rounded-full bg-dorado-campeon flex items-center justify-center text-carbon shadow-[0_0_15px_rgba(227,178,60,0.4)] flex-shrink-0 text-3xl">
              {headerBlock.icon}
            </div>
          ) : null}
          
          <div>
            <h2 className="text-3xl sm:text-5xl font-display font-bold text-dorado-campeon uppercase tracking-tight leading-none mb-2">
              {headerBlock.title}
            </h2>
            {headerBlock.subtitle && (
              <p className="font-body italic text-tatami-blanco/70 text-lg sm:text-xl">
                {headerBlock.subtitle}
              </p>
            )}
          </div>
        </div>
        {headerBlock.content.length > 0 && (
          <div className="mt-8 space-y-4">
            {headerBlock.content.map(renderParagraph)}
          </div>
        )}
      </div>

      {/* DYNAMIC SECTIONS */}
      {processedSections.length > 0 && (
        <div className="p-6 sm:p-10 pt-4 flex flex-col gap-6">
          {processedSections.map((section, idx) => {
            
            // A. Reglas Básicas (Grid 2 col)
            if (section.type === 'group-grid') {
              return (
                <div key={idx} className="bg-white/5 border-l-[3px] border-dorado-campeon rounded-r-xl p-6 sm:p-8 hover:bg-white/10 transition-colors duration-200">
                  {renderSectionHeader(section.title, section.icon, false)}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                    {section.blocks.map((b, i) => (
                      <div key={i} className="space-y-3">
                        <h4 className="text-lg font-display font-bold text-dorado-campeon uppercase tracking-wide flex items-center gap-2">
                          {b.icon && iconMap[b.icon] && <span className="w-5 h-5 text-rojo-impacto">{iconMap[b.icon]}</span>}
                          {b.title}
                        </h4>
                        <div className="space-y-3">
                          {b.content.map(renderParagraph)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }

            // B. Categorías de Edad (Grid Chips)
            if (section.type === 'chips-section') {
              return (
                <div key={idx} className="bg-white/5 border-l-[3px] border-rojo-impacto rounded-r-xl p-6 sm:p-8 hover:bg-white/10 transition-colors duration-200">
                  {renderSectionHeader(section.title, section.icon, true)}
                  {section.content && section.content.length > 0 && (
                    <div className="mb-5 space-y-3">{section.content.map(renderParagraph)}</div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mt-4">
                    {section.chips.map((chip, i) => {
                      const separator = chip.includes('➝') ? '➝' : '->';
                      const parts = chip.split(separator);
                      return renderChip(parts[0].trim(), parts[1] ? parts[1].trim() : '', i);
                    })}
                  </div>
                </div>
              );
            }

            // C. Equipo Básico (Grid Chips)
            if (section.type === 'equipment-grid') {
              return (
                <div key={idx} className="bg-white/5 border-l-[3px] border-dorado-campeon rounded-r-xl p-6 sm:p-8 hover:bg-white/10 transition-colors duration-200">
                  {renderSectionHeader(section.title, section.icon, false)}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mt-4">
                    {section.items.map((item, i) => {
                      const { iconStr, text } = extractIcon(item);
                      const finalIcon = iconStr || '🛡️';
                      return (
                        <div key={i} className="flex items-center gap-3 bg-carbon border border-dorado-campeon/30 rounded-md p-3 hover:border-dorado-campeon transition-colors shadow-sm">
                          <div className="w-8 h-8 rounded-full bg-dorado-campeon/10 flex items-center justify-center text-dorado-campeon flex-shrink-0 p-1.5">
                            {iconMap[finalIcon] || <Shield className="w-full h-full" />}
                          </div>
                          <span className="font-body font-medium text-tatami-blanco/90 text-sm">{text}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            }

            // D. Sistema de Puntuación (Lista 2 col compacta)
            if (section.type === 'scoring-system') {
              return (
                <div key={idx} className="bg-white/5 border-l-[3px] border-rojo-impacto rounded-r-xl p-6 sm:p-8 hover:bg-white/10 transition-colors duration-200">
                  {renderSectionHeader(section.title, section.icon, true)}
                  
                  {section.mainBlock && section.mainBlock.content.length > 0 && (
                    <div className="mb-6 space-y-3">
                      {section.mainBlock.content.map(renderParagraph)}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    {section.scoreItems.map((item, i) => {
                      // Extraer acción y puntos (ej. "Puño 1" -> "Puño", "1")
                      const match = item.title.match(/^(.*?)\s+(\d+)$/);
                      const action = match ? match[1].trim() : item.title;
                      const points = match ? match[2] : '';
                      
                      return (
                        <div key={i} className="flex items-center justify-between bg-carbon/80 border border-white/5 rounded-md p-4 shadow-sm hover:border-rojo-impacto/50 transition-colors">
                          <div className="flex items-center gap-3">
                            {item.icon && iconMap[item.icon] ? (
                              <div className="w-6 h-6 text-dorado-campeon">{iconMap[item.icon]}</div>
                            ) : (
                              <Target className="w-5 h-5 text-rojo-impacto" />
                            )}
                            <span className="font-body font-medium text-tatami-blanco">{action}</span>
                          </div>
                          {points && (
                            <div className="flex items-center gap-2">
                              <span className="text-tatami-blanco/30">—</span>
                              <span className="font-display font-bold text-dorado-campeon bg-dorado-campeon/10 px-3 py-1 rounded-full">{points} {points === '1' ? 'punto' : 'puntos'}</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            }

            // E. Bloque Estándar (Fallback)
            if (section.type === 'standard-block') {
              const isQuestion = section.title.startsWith('¿');
              return (
                <div key={idx} className="bg-white/5 border-l-[3px] border-rojo-impacto rounded-r-xl p-6 sm:p-8 hover:bg-white/10 transition-colors duration-200">
                  {renderSectionHeader(section.title, section.icon, isQuestion)}
                  {section.content.length > 0 && (
                    <div className="space-y-4 mb-5">
                      {section.content.map(renderParagraph)}
                    </div>
                  )}
                  {section.chips.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mt-4">
                      {section.chips.map((chip, i) => {
                        const separator = chip.includes('➝') ? '➝' : '->';
                        const parts = chip.split(separator);
                        return renderChip(parts[0].trim(), parts[1] ? parts[1].trim() : '', i);
                      })}
                    </div>
                  )}
                </div>
              );
            }

            return null;
          })}
        </div>
      )}
    </div>
  );
};

export default ContentCard;
