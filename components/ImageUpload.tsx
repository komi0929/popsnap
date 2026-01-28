
import React, { useRef, useState } from 'react';
import { ImageUploadProps } from '../types';
import { Plus, Image as ImageIcon } from 'lucide-react';

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result && typeof e.target.result === 'string') {
        onImageSelect(e.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-xl mx-auto p-4">
      <div
        className={`
          relative flex flex-col items-center justify-center h-80 
          border-4 border-dashed rounded-[2.5rem] transition-all duration-300 ease-in-out
          bg-white/80 backdrop-blur-sm shadow-xl overflow-hidden cursor-pointer
          ${dragActive ? 'border-pink-400 bg-pink-50 scale-[1.02]' : 'border-purple-200 hover:border-purple-300 hover:bg-white/90'}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="z-10 flex flex-col items-center gap-6 w-full max-w-sm px-4 text-center">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-400 rounded-3xl flex items-center justify-center shadow-2xl rotate-3 group-hover:rotate-6 transition-transform">
              <ImageIcon size={48} className="text-white" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-yellow-400 rounded-full border-4 border-white flex items-center justify-center shadow-lg">
              <Plus size={24} className="text-white stroke-[3px]" />
            </div>
          </div>
          
          <div>
            <h3 className="text-2xl font-black text-gray-800 font-[Fredoka] mb-2">
              写真を追加
            </h3>
            <p className="text-gray-500 font-medium leading-relaxed">
              タップして写真を撮るか<br />
              ライブラリから選んでね
            </p>
          </div>

          <div className="hidden md:block mt-2">
             <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">
               またはここにドラッグ＆ドロップ
             </span>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-4 left-4 w-12 h-12 bg-pink-100 rounded-full opacity-20 blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-20 h-20 bg-cyan-100 rounded-full opacity-20 blur-2xl"></div>
      </div>
    </div>
  );
};
