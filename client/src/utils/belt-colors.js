export const BELT_COLORS = {
  blanco: '#FFFFFF',
  amarillo: '#FACC15', // Tailwind yellow-400
  naranja: '#F97316', // Tailwind orange-500
  verde: '#22C55E', // Tailwind green-500
  azul: 'var(--azul-cinturon)',
  morado: '#A855F7', // Tailwind purple-500
  marron: '#78350F', // Tailwind amber-900
  rojo: 'var(--rojo-impacto)',
  negro: '#000000', 
};

export const getBeltStyle = (grado = '') => {
  const normalized = grado.toLowerCase();
  let bgColor = BELT_COLORS.blanco;

  if (normalized.includes('negro') || normalized.includes('dan') || normalized.includes('poom')) {
    bgColor = BELT_COLORS.negro;
  } else if (normalized.includes('rojo')) {
    bgColor = BELT_COLORS.rojo;
  } else if (normalized.includes('marrón') || normalized.includes('marron')) {
    bgColor = BELT_COLORS.marron;
  } else if (normalized.includes('morado')) {
    bgColor = BELT_COLORS.morado;
  } else if (normalized.includes('azul')) {
    bgColor = BELT_COLORS.azul;
  } else if (normalized.includes('verde')) {
    bgColor = BELT_COLORS.verde;
  } else if (normalized.includes('naranja')) {
    bgColor = BELT_COLORS.naranja;
  } else if (normalized.includes('amarillo')) {
    bgColor = BELT_COLORS.amarillo;
  }

  const isBlackBelt = normalized.includes('negro') || normalized.includes('dan') || normalized.includes('poom');

  return {
    backgroundColor: bgColor,
    isBlackBelt
  };
};
