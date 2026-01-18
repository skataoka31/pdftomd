
import React, { useState, useEffect } from 'react';
import Window from './components/Window';
import PDFAnalyzer from './components/PDFAnalyzer';

const App: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ja-JP', {
      month: 'short',
      day: 'numeric',
      weekday: 'short'
    });
  };

  return (
    <div className="relative w-screen h-screen macos-bg overflow-hidden flex flex-col">
      {/* Menu Bar */}
      <div className="h-7 bg-white/30 dark:bg-zinc-900/30 backdrop-blur-md px-4 flex items-center justify-between text-[13px] font-medium text-white shadow-sm z-50">
        <div className="flex items-center gap-4">
          <i className="fa-brands fa-apple text-lg"></i>
          <span className="font-bold">PDF to Markdown</span>
          <span className="opacity-80">ファイル</span>
          <span className="opacity-80">編集</span>
          <span className="opacity-80">表示</span>
          <span className="opacity-80">ウィンドウ</span>
          <span className="opacity-80">ヘルプ</span>
        </div>
        <div className="flex items-center gap-4">
          <i className="fa-solid fa-wifi"></i>
          <i className="fa-solid fa-battery-three-quarters"></i>
          <i className="fa-solid fa-magnifying-glass"></i>
          <div className="flex gap-2">
            <span>{formatDate(currentTime)}</span>
            <span>{formatTime(currentTime)}</span>
          </div>
        </div>
      </div>

      {/* Desktop Workspace */}
      <main className="flex-1 flex items-center justify-center p-6 relative">
        <PDFAnalyzer />
      </main>

      {/* Dock (Visual representation only) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 h-16 bg-white/20 dark:bg-zinc-800/20 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center px-4 gap-4 shadow-2xl">
        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white text-xl shadow-lg cursor-pointer transform hover:scale-110 transition-transform">
          <i className="fa-solid fa-file-pdf"></i>
        </div>
        <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white text-xl shadow-lg cursor-pointer transform hover:scale-110 transition-transform">
          <i className="fa-solid fa-code"></i>
        </div>
        <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center text-white text-xl shadow-lg cursor-pointer transform hover:scale-110 transition-transform">
          <i className="fa-solid fa-folder-open"></i>
        </div>
        <div className="w-[1px] h-10 bg-white/20 mx-1"></div>
        <div className="w-10 h-10 bg-zinc-600 rounded-lg flex items-center justify-center text-white text-xl shadow-lg cursor-pointer transform hover:scale-110 transition-transform">
          <i className="fa-solid fa-trash"></i>
        </div>
      </div>
    </div>
  );
};

export default App;
