import React from 'react';

const StatusBadge = ({ status }) => {
  let badgeStyles = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
  let label = 'Al día';

  if (status === 'AMARILLO') {
    badgeStyles = 'bg-amber-500/20 text-amber-400 border-amber-500/40';
    label = 'Próximo a Vencer';
  } else if (status === 'ROJO') {
    badgeStyles = 'bg-rose-500/20 text-rose-400 border-rose-500/40';
    label = 'Pago Vencido';
  }

  return (
    <span class={`px-3 py-1 rounded-full text-xs font-semibold border ${badgeStyles} inline-flex items-center gap-1.5`}>
      <span class={`w-2 h-2 rounded-full ${status === 'VERDE' ? 'bg-emerald-400' : status === 'AMARILLO' ? 'bg-amber-400' : 'bg-rose-400'}`}></span>
      {label}
    </span>
  );
};

export default StatusBadge;
