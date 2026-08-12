import React from 'react';
import { HelpCircle, User, Users, Trophy, Timer, CheckCircle2, XCircle, AlertTriangle, Swords, Medal, Info } from 'lucide-react';
import { GiBoxingGlove, GiKarate, GiBlackBelt } from 'react-icons/gi';

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
  const lines = rawText.split('\n').map(l => l.trim()).filter(l => l !== '');
  if (lines.length === 0) return null;

  const blocks = [];
  let currentBlock = { type: 'header', icon: null, title: '', subtitle: '', content: [], chips: [] };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const { iconStr, text } = extractIcon(line);
    
    const isQuestion = text.startsWith('¿') && text.endsWith('?');
    const isUppercase = text.length > 0 && text.toUpperCase() === text && /[A-Z]/.test(text);
    const isShort = text.length <= 60;
    const isHeading = (isShort && (isQuestion || isUppercase)) || !!iconStr;
    const isChip = text.includes('➝') || text.includes('->');

    // Casos especiales para bullets negativos/positivos, no los trataremos como headings
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
      blocks.push(currentBlock);
      currentBlock = { type: 'section', icon: iconStr, title: text, content: [], chips: [] };
    } else if (isChip) {
      currentBlock.chips.push(text);
    } else {
      currentBlock.content.push(line);
    }
  }
  blocks.push(currentBlock);

  const headerBlock = blocks[0];
  const sectionBlocks = blocks.slice(1);

  const renderParagraph = (p, i) => {
    const { iconStr: pIcon, text: pText } = extractIcon(p);
    
    if (pIcon === '❌') {
      return (
        <div key={i} className="flex items-start gap-3 py-2.5 px-4 bg-red-950/30 border-l-[3px] border-red-500 rounded-r-md my-2">
          <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <span className="text-tatami-blanco/90 font-body">{pText}</span>
        </div>
      );
    }
    if (pIcon === '✅' || pIcon === '✔️') {
      return (
        <div key={i} className="flex items-start gap-3 py-2.5 px-4 bg-emerald-950/30 border-l-[3px] border-emerald-500 rounded-r-md my-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
          <span className="text-tatami-blanco/90 font-body">{pText}</span>
        </div>
      );
    }
    if (pIcon === '⚠️') {
      return (
        <div key={i} className="flex items-start gap-3 py-3 px-4 bg-amber-950/30 border-l-[3px] border-amber-500 rounded-r-md my-3">
          <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <span className="text-tatami-blanco font-body font-bold">{pText}</span>
        </div>
      );
    }

    return (
      <p key={i} className="text-tatami-blanco/80 font-body leading-relaxed text-base">
        {pIcon && iconMap[pIcon] ? (
          <span className="inline-block w-5 h-5 mr-2 align-text-bottom text-dorado-campeon">{iconMap[pIcon]}</span>
        ) : pIcon ? (
          <span className="mr-2">{pIcon}</span>
        ) : null}
        {pText}
      </p>
    );
  };

  return (
    <div className="relative clip-card bg-carbon border-t-[4px] border-dorado-campeon impact-flash transition-all duration-300 shadow-2xl">
      
      {/* 1. ENCABEZADO */}
      <div className="p-8 sm:p-12 pb-8">
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

      {/* 2. BLOQUES DE PREGUNTA / RESPUESTA */}
      {sectionBlocks.length > 0 && (
        <div className="p-8 sm:p-12 pt-6 flex flex-col gap-6">
          {sectionBlocks.map((block, idx) => {
            const isQuestion = block.title.startsWith('¿');
            // Diferenciar color del ícono si es pregunta (rojo) o no (dorado)
            const iconBgClass = isQuestion ? 'bg-rojo-impacto text-white' : 'bg-dorado-campeon text-carbon';
            const iconShadowClass = isQuestion ? 'shadow-[0_0_10px_rgba(214,40,57,0.3)]' : 'shadow-[0_0_10px_rgba(227,178,60,0.3)]';

            return (
              <div key={idx} className="bg-white/5 border-l-[3px] border-rojo-impacto rounded-r-xl p-6 sm:p-8 hover:bg-white/10 transition-colors duration-200">
                <div className="flex items-center gap-4 mb-4">
                  {block.icon && iconMap[block.icon] && (
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 p-2 ${iconBgClass} ${iconShadowClass}`}>
                      {iconMap[block.icon]}
                    </div>
                  )}
                  <h3 className="text-xl sm:text-2xl font-display font-bold text-tatami-blanco uppercase tracking-wide">
                    {block.title}
                  </h3>
                </div>
                
                {block.content.length > 0 && (
                  <div className="space-y-4 mb-5">
                    {block.content.map(renderParagraph)}
                  </div>
                )}

                {/* 3. CATEGORÍAS DE EDAD (CHIPS) */}
                {block.chips.length > 0 && (
                  <div className="flex flex-wrap gap-3 mt-4">
                    {block.chips.map((chip, i) => {
                      const separator = chip.includes('➝') ? '➝' : '->';
                      const parts = chip.split(separator);
                      const label = parts[0].trim();
                      
                      // Traducción especial si se encuentra 'Children'
                      const translatedLabel = label.toLowerCase() === 'children' ? 'Niños' : label;
                      const value = parts[1] ? parts[1].trim() : '';

                      return (
                        <div key={i} className="flex items-center gap-2 bg-carbon border border-dorado-campeon/40 rounded-md px-4 py-2 hover:border-dorado-campeon transition-colors">
                          <span className="font-display font-bold text-dorado-campeon text-sm uppercase tracking-wide">
                            {translatedLabel}
                          </span>
                          {value && (
                            <>
                              <span className="text-tatami-blanco/30 text-xs">|</span>
                              <span className="text-tatami-blanco/90 font-body text-sm font-medium">{value}</span>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ContentCard;
