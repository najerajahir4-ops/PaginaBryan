import React from 'react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#1C1C21] border border-carbon/20 dark:border-white/10 rounded-2xl w-full max-w-sm shadow-2xl p-6 transform transition-all">
        <h3 className="text-lg font-bold text-carbon dark:text-white mb-2">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">{message}</p>
        
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
          >
            CANCELAR
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rojo-impacto hover:bg-red-700 shadow-lg shadow-rojo-impacto/30 transition-colors"
          >
            ELIMINAR
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
