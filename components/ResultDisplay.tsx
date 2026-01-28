import React, { useState, useEffect } from "react";
import { ResultDisplayProps } from "../types";
import {
  Download,
  ArrowRight,
  Loader2,
  Palette,
  RefreshCcw,
  Share2,
  Sparkles,
  Brush,
  Camera,
  ChevronDown,
  Layers,
  Image as ImageIcon
} from "lucide-react";

export const ResultDisplay: React.FC<ResultDisplayProps> = ({
  originalImage,
  generatedImage,
  isGenerating,
  onReset,
  onRemix,
  currentStyle,
}) => {
  const [isSharing, setIsSharing] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState(0);
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);


  // Cycle through loading phases when generating
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (isGenerating) {
      setLoadingPhase(0);
      interval = setInterval(() => {
        setLoadingPhase((prev) => (prev + 1) % 3);
      }, 1200);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  const generateComparisonImage = (): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img1 = new Image();
      const img2 = new Image();

      img1.crossOrigin = "anonymous";
      img2.crossOrigin = "anonymous";
      img1.src = originalImage!;
      img2.src = generatedImage!;

      img1.onload = () => {
        img2.onload = () => {
          // Calculate layout: Side by side
          const margin = 40;
          const logoHeight = 40;
          const canvasWidth = img1.width + img2.width + margin * 3;
          const canvasHeight = Math.max(img1.height, img2.height) + margin * 2 + logoHeight;

          canvas.width = canvasWidth;
          canvas.height = canvasHeight;

          // Background
          if (ctx) {
            ctx.fillStyle = "#FFFDF5"; // Creamy white
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);

            // Draw original
            ctx.drawImage(img1, margin, margin);
            // Draw generated
            ctx.drawImage(img2, img1.width + margin * 2, margin);

            // Watermark
            ctx.fillStyle = "#cbd5e1"; // gray-300
            ctx.font = "bold 24px sans-serif";
            ctx.textAlign = "right";
            ctx.fillText("produced by popsnap", canvasWidth - margin, canvasHeight - 20);
            
            // Labels
            ctx.fillStyle = "#94a3b8"; // gray-400
            ctx.textAlign = "center";
            ctx.fillText("Before", margin + img1.width / 2, margin + img1.height + 30);
            ctx.fillText("After", margin * 2 + img1.width + img2.width / 2, margin + img2.height + 30);
          }

          resolve(canvas.toDataURL("image/png"));
        };
      };
    });
  };

  const handleDownload = async (type: 'art' | 'comparison') => {
    let imageToDownload = generatedImage;
    if (type === 'comparison') {
      imageToDownload = await generateComparisonImage();
    }

    if (imageToDownload) {
      const link = document.createElement("a");
      link.href = imageToDownload;
      link.download = `popsnap-${type}-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    setShowDownloadOptions(false);
  };

  const handleShare = async (type: 'art' | 'comparison') => {
    let imageToShare = generatedImage;
    if (type === 'comparison') {
      imageToShare = await generateComparisonImage();
    }
    
    if (!imageToShare) return;
    setIsSharing(true);
    const shareText = `子供の写真が現代アートに！🎨 #popsnap で作成しました✨\nhttps://popsnap.vercel.app/`;

    try {
      const response = await fetch(imageToShare);
      const blob = await response.blob();
      const file = new File([blob], `popsnap-${type}.png`, { type: blob.type });

      if (
        navigator.share &&
        navigator.canShare &&
        navigator.canShare({ files: [file] })
      ) {
        try {
          await navigator.share({
            files: [file],
            title: "popsnap アート",
            text: shareText,
          });
          setIsSharing(false);

          return;
        } catch (shareError) {
          if ((shareError as Error).name === "AbortError") {
            setIsSharing(false);

            return;
          }
        }
      }

      try {
        await navigator.clipboard.write([
          new ClipboardItem({ [blob.type]: blob }),
        ]);
        alert("クリップボードにコピーしたよ！貼り付けてシェアしてね。");
      } catch (clipboardError) {
        handleDownload(type);
      }
    } catch (error) {
      console.error("Share failed:", error);
    } finally {
      setIsSharing(false);

    }
  };

  const loadingSteps = [
    {
      icon: <Camera className="animate-bounce" size={48} />,
      text: "構図を考えています...",
      color: "text-purple-500",
      bg: "bg-purple-100",
    },
    {
      icon: <Palette className="animate-spin" size={48} />,
      text: "色を選んでいます...",
      color: "text-pink-500",
      bg: "bg-pink-100",
    },
    {
      icon: <Brush className="animate-pulse" size={48} />,
      text: "仕上げています...",
      color: "text-cyan-500",
      bg: "bg-cyan-100",
    },
  ];

  const currentLoading = loadingSteps[loadingPhase];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 pb-32">
      {/* Art Display Area */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Original (Mobile: Top Small, Desktop: Left) */}
        <div className="relative group shrink-0">
          <div className="absolute -inset-2 bg-white rounded-lg opacity-30 group-hover:opacity-50 transition-opacity blur-md"></div>
          <div className="relative bg-white p-2 shadow-lg rounded-lg transform rotate-[-3deg] w-40 md:w-64 transition-transform hover:rotate-0 duration-300">
            {originalImage && (
              <img
                src={originalImage}
                alt="Original"
                className="w-full h-auto rounded"
              />
            )}
          </div>
        </div>

        {/* Transition Arrow */}
        <div className="text-gray-300 shrink-0">
          {isGenerating ? (
            <Sparkles className="animate-spin text-yellow-400" size={32} />
          ) : (
            <ArrowRight size={32} className="hidden md:block" />
          )}
          <ArrowRight size={24} className="md:hidden rotate-90" />
        </div>

        {/* Generated Art (Center Stage) */}
        <div className="relative w-full max-w-md shrink-0 flex flex-col items-center">
          <div className="bg-white p-3 md:p-4 shadow-2xl rounded-2xl w-full aspect-[3/4] flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
            {generatedImage && !isGenerating ? (
              <img
                src={generatedImage}
                alt="Generated Art"
                className="w-full h-full object-cover rounded-xl shadow-inner animate-in zoom-in duration-500"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-300 p-8 text-center w-full">
                {isGenerating ? (
                  <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-300">
                    <div
                      className={`relative p-8 rounded-full ${currentLoading.bg} transition-colors duration-500`}
                    >
                      <div
                        className={`relative z-10 ${currentLoading.color} transition-colors duration-500`}
                      >
                        {currentLoading.icon}
                      </div>
                      {/* Fun decorative particles */}
                      <div className="absolute top-0 right-0 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
                      <div className="absolute bottom-2 left-2 w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-150"></div>
                      <div className="absolute top-2 left-0 w-2 h-2 bg-green-400 rounded-full animate-bounce delay-75"></div>
                    </div>
                    <span
                      className={`font-bold text-xl ${currentLoading.color} animate-pulse transition-colors duration-500`}
                    >
                      {currentLoading.text}
                    </span>
                  </div>
                ) : (
                  <span>写真を追加してね</span>
                )}
              </div>
            )}
          </div>

          {/* Style Name Display (For Fine-tuning) */}
          {generatedImage && !isGenerating && currentStyle && (
             <div className="mt-6 flex flex-col items-center animate-in slide-in-from-bottom-2 fade-in duration-500">
               <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Applied Style</span>
               <div className={`px-6 py-2 rounded-full border-2 ${currentStyle.colorClass} shadow-sm flex items-center gap-2 bg-opacity-50`}>
                 <span className="text-lg">✨</span>
                 <span className="font-bold text-gray-800">{currentStyle.name}</span>
               </div>
             </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 animate-in slide-in-from-bottom-8 duration-700 px-4">
        <button
          onClick={onRemix}
          disabled={isGenerating}
          className={`
             w-full md:w-auto flex items-center justify-center gap-2 px-8 py-4 text-white transition-all shadow-lg rounded-full font-bold text-lg
             bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 hover:scale-105
             ${isGenerating ? "opacity-80 cursor-wait" : ""}
           `}
        >
          {isGenerating ? (
            <Loader2 size={24} className="animate-spin" />
          ) : (
            <Palette size={24} />
          )}
          <span>別のスタイルを試す</span>
        </button>

        {generatedImage && !isGenerating && (
          <div className="flex gap-2 w-full md:w-auto mt-4 md:mt-0">
            {/* Download Button with Options */}
            <div className="relative flex-1 md:flex-none">
              <button
                onClick={() => setShowDownloadOptions(!showDownloadOptions)}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white transition-all shadow-md rounded-full font-bold whitespace-nowrap"
              >
                <Download size={18} />
                <span>保存</span>
                <ChevronDown size={14} className={`transition-transform ${showDownloadOptions ? 'rotate-180' : ''}`} />
              </button>
              
              {showDownloadOptions && (
                <div className="absolute bottom-full mb-2 left-0 w-full min-w-[200px] bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-50 animate-in slide-in-from-bottom-2">
                  <button 
                    onClick={() => handleDownload('art')}
                    className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl text-left text-sm font-bold text-gray-700"
                  >
                    <ImageIcon size={18} className="text-cyan-500" />
                    アートのみ保存
                  </button>
                  <button 
                    onClick={() => handleDownload('comparison')}
                    className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl text-left text-sm font-bold text-gray-700 border-t border-gray-50"
                  >
                    <Layers size={18} className="text-purple-500" />
                    ビフォーアフターで保存
                  </button>
                </div>
              )}
            </div>

            {/* Share Button (Direct Share, no options) */}
            <div className="relative flex-1 md:flex-none">
              <button
                onClick={() => handleShare('art')}
                disabled={isSharing}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-800 hover:bg-black text-white transition-all shadow-md rounded-full font-bold whitespace-nowrap"
              >
                {isSharing ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>
                    <Share2 size={18} />
                    <span>シェア</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        <button
          onClick={onReset}
          className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-gray-100 text-gray-600 hover:bg-gray-50 hover:border-gray-200 transition-all rounded-full font-bold shadow-sm order-last md:order-none mt-4 md:mt-0"
        >
          <RefreshCcw size={18} />
          <span>新しい写真</span>
        </button>
      </div>


    </div>
  );
};
