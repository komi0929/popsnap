
import React from 'react';
import { Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="w-full py-6 px-4 flex flex-col items-center justify-center relative z-10">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="text-yellow-400 animate-bounce" size={24} />
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 drop-shadow-sm font-[Fredoka]">
          popsnap
        </h1>
        <Sparkles className="text-cyan-400 animate-bounce delay-100" size={24} />
      </div>
      <p className="text-gray-500 text-sm md:text-base font-medium tracking-wide bg-white/50 px-4 py-1 rounded-full backdrop-blur-sm">
        お気にいりの写真をアートに変身させよう！
      </p>
    </header>
  );
};
