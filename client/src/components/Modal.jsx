import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, fullScreen = false, isFullScreen = false }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const isMaximized = fullScreen || isFullScreen;

  const modalContent = (
    <div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 dark:bg-black/70 backdrop-blur-sm animate-fade-in">
      <div class={`bg-white dark:bg-carbon border border-gray-200 dark:border-white/10 rounded-2xl w-full flex flex-col shadow-2xl overflow-hidden transition-all duration-300 ${isMaximized ? 'max-w-[98vw] h-[95vh] max-h-[95vh]' : 'max-w-2xl max-h-[90vh]'}`}>
        {/* Header */}
        <div class="px-6 py-4 border-b border-gray-200 dark:border-white/10 flex justify-between items-center bg-gray-50 dark:bg-carbon/60">
          <h3 class="text-xl font-bold text-gray-900 dark:text-white font-heading uppercase">{title}</h3>
          <button
            onClick={onClose}
            class="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-white/10"
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

  return createPortal(modalContent, document.body);
};

export default Modal;
