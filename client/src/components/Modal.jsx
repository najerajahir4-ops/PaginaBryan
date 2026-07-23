import React from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div class="bg-dojang-dark border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div class="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-dojang-navy/60">
          <h3 class="text-xl font-bold text-white font-heading">{title}</h3>
          <button
            onClick={onClose}
            class="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div class="p-6 overflow-y-auto space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
