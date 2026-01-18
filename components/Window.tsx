
import React from 'react';
import { WindowProps } from '../types';

const Window: React.FC<WindowProps> = ({ title, onClose, children }) => {
  return (
    <div className="w-full h-full max-w-5xl max-h-[85vh] bg-white/80 dark:bg-zinc-900/80 macos-window rounded-xl shadow-2xl flex flex-col overflow-hidden border border-white/20">
      {/* Title Bar */}
      <div className="h-10 flex items-center px-4 bg-white/30 dark:bg-zinc-800/30 border-b border-black/5 dark:border-white/5 select-none shrink-0">
        <div className="flex gap-2 w-16">
          <div className="w-3 h-3 rounded-full bg-[#FF5F57] hover:bg-[#FF5F57]/80 cursor-pointer" onClick={onClose}></div>
          <div className="w-3 h-3 rounded-full bg-[#FEBC2E] hover:bg-[#FEBC2E]/80 cursor-pointer"></div>
          <div className="w-3 h-3 rounded-full bg-[#28C840] hover:bg-[#28C840]/80 cursor-pointer"></div>
        </div>
        <div className="flex-1 text-center text-sm font-semibold text-zinc-700 dark:text-zinc-200">
          {title}
        </div>
        <div className="w-16"></div>
      </div>
      
      {/* Content Area */}
      <div className="flex-1 overflow-auto bg-transparent">
        {children}
      </div>
    </div>
  );
};

export default Window;
