
import React, { useState } from 'react';
import { Header } from './components/Header';
import { ImageUpload } from './components/ImageUpload';
import { ResultDisplay } from './components/ResultDisplay';
import { generateCollage } from './services/geminiService';
import { CollageState, StyleOption } from './types';
import { AlertCircle, X } from 'lucide-react';

const STYLES: StyleOption[] = [
  {
    id: 'pop',
    name: 'コミックヒーロー',
    description: '超カラフルなコミックスタイル！',
    colorClass: 'bg-yellow-100 border-yellow-400',
    element: 'LIGHT',
    prompt: `
      - Style: Retro Pop Art & Comic Book.
      - Material: Cutouts from vintage comic books and advertisements.
      - Technique: Use bold black outlines, halftone patterns (Ben-Day dots), and high-contrast color blocks.
      - Composition: Collage the subject with speech bubbles and "POW!" graphic shapes.
      - Vibe: Energetic, fun, and heroic.
    `
  },
  {
    id: 'groovy_pop',
    name: 'グルーヴィーパーティー',
    description: '60年代のサイケデリックな感じ！',
    colorClass: 'bg-pink-100 border-pink-400',
    element: 'PSYCHIC',
    prompt: `
      - Style: 60s Psychedelic Pop Art & Warhol Silk-screen.
      - Material: Vintage comic books, newspaper clippings, and silk-screen prints.
      - Technique: Repeat the subject's face 3-4 times in different neon colors (Warhol effect). Heavy Ben-Day dots.
      - Composition: Explosive collage with starbursts and speech bubbles containing text like "GROOVY!", "SUPER!", "POP!".
      - Colors: High saturation pink, turquoise, and yellow.
    `
  },
  {
    id: 'mystery_red',
    name: 'シークレットエージェント',
    description: 'クールな影とミステリー。',
    colorClass: 'bg-stone-200 border-stone-600',
    element: 'DARK',
    prompt: `
      - Style: Graphic Novel Noir.
      - Material: Coarse halftone newsprint, red paint splatters, and black heavy ink.
      - Technique: The subject is converted to a high-contrast black and white halftone pattern.
      - Composition: Dynamic collage with bold typography and sharp angles.
      - Vibe: Mysterious, cool, and dramatic.
    `
  },
  {
    id: 'surrealist',
    name: 'ドリームワールド',
    description: '不思議で魔法のような世界。',
    colorClass: 'bg-indigo-100 border-indigo-400',
    element: 'MAGIC',
    prompt: `
      - Style: Whimsical Surrealism.
      - Material: Vintage book illustrations, butterflies, and clouds.
      - Technique: Playful collage mixing the subject with dreamlike elements.
      - Composition: Floating elements, giant flowers, and soft vintage textures.
      - Vibe: Dreamy, magical, and imaginative.
    `
  },
  {
    id: 'botanical',
    name: 'フェアリーフォレスト',
    description: 'お花と自然がいっぱい。',
    colorClass: 'bg-green-100 border-green-500',
    element: 'NATURE',
    prompt: `
      - Style: Nature Scrapbook.
      - Material: Real dried pressed flowers, leaves, and kraft paper.
      - Technique: Layer the subject with organic plant matter and garden elements.
      - Composition: Natural, organic, and textured.
      - Vibe: Soft, peaceful, and earthy.
    `
  },
  {
    id: 'noir',
    name: 'ロックスター',
    description: 'クールな白黒ポスター。',
    colorClass: 'bg-gray-200 border-gray-500',
    element: 'SOUND',
    prompt: `
      - Style: Punk Rock Poster.
      - Material: Ripped paper, photocopy textures, and tape.
      - Technique: High contrast black and white. Rough, cool texture.
      - Composition: Cut-out letters and bold graphic shapes.
      - Vibe: Edgy, loud, and cool.
    `
  },
  {
    id: 'cyber',
    name: 'フューチャーゲーマー',
    description: 'グリッチとネオンカラー。',
    colorClass: 'bg-cyan-100 border-cyan-400',
    element: 'TECH',
    prompt: `
      - Style: Retro Gamer Glitch.
      - Material: Pixel art, neon lasers, and computer windows.
      - Technique: Pixelation effects mixed with paper cutouts.
      - Composition: Futuristic, chaotic, and colorful. Cyan and magenta colors.
      - Vibe: Digital, fast, and electric.
    `
  },
  {
    id: 'cubism',
    name: 'パズル写真',
    description: '写真のパズルみたい。',
    colorClass: 'bg-purple-100 border-purple-400',
    element: 'MIND',
    prompt: `
      - Style: Photo Mosaic Joiner.
      - Material: Multiple square photo prints.
      - Technique: The image is composed of many slightly overlapping square photos.
      - Composition: Playful rearrangement of the subject.
      - Vibe: Artistic, fun, and clever.
    `
  },
  {
    id: 'torn_poster',
    name: 'ストリートアート',
    description: 'かっこいい破れたポスター風。',
    colorClass: 'bg-orange-100 border-orange-400',
    element: 'FIRE',
    prompt: `
      - Style: Urban Street Art.
      - Material: Layers of colorful paper, peeling paint, and doodles.
      - Technique: Reveal colorful layers underneath by tearing parts of the image.
      - Composition: Bright, colorful, and textured.
      - Vibe: Creative, messy, and bold.
    `
  },
  {
    id: 'candy_pop',
    name: 'キャンディ・ポップ',
    description: 'お菓子とステッカーでデコっちゃおう！',
    colorClass: 'bg-rose-100 border-rose-400',
    element: 'SWEET',
    prompt: `
      - Style: Harajuku Decora & Kawaii Aesthetic.
      - Material: Piles of stickers, plastic gems, candy wrappers, and pastel toys.
      - Technique: Maximalist decoration. Cover the background with cute chaotic elements.
      - Composition: Center the subject surrounded by floating sweets, hearts, stars, and rainbows.
      - Vibe: Overwhelmingly cute, colorful, and fun.
    `
  },
  {
    id: 'neon_retro',
    name: 'ネオン・レトロ',
    description: '80年代のキラキラな未来！',
    colorClass: 'bg-violet-100 border-violet-400',
    element: 'FUTURE',
    prompt: `
      - Style: 80s Vaporwave & Synthwave.
      - Material: Neon lights, wireframe grids, and chrome textures.
      - Technique: Digital airbrushing mixed with VHS glitch effects.
      - Composition: Sunset in the background, palm trees, and geometric shapes.
      - Colors: Neon purple, hot pink, and cyan.
      - Vibe: Retro-futuristic, nostalgic, and cool.
    `
  }
];

const SECRET_STYLE: StyleOption = {
  id: 'kintsugi_gold',
  name: 'ゴールデントレジャー',
  description: 'キラキラ輝く金色の魔法！',
  colorClass: 'bg-yellow-50 border-yellow-600',
  element: 'DIVINE',
  prompt: `
    - Style: Kintsugi Masterpiece.
    - Material: Cracked ceramics and gold lacquer.
    - Technique: The image appears broken and repaired with visible veins of gold.
    - Composition: High contrast between dark backgrounds and shining gold cracks.
    - Vibe: Precious, magical, and glowing.
  `
};

const TERMS_TEXT = `
【利用規約】

1. 本アプリは、Google Gemini APIを使用して画像を生成します。
2. 生成された画像の著作権や利用に関する法的な責任は、ユーザーに帰属します。
3. 公序良俗に反する画像、他人の権利を侵害する画像のアップロードは禁止します。
4. 本アプリの使用により生じた損害について、運営者は一切の責任を負いません。
5. 生成された画像は個人利用の範囲でお楽しみください。
`;

const PRIVACY_TEXT = `
【プライバシーポリシー】

1. 画像データの扱い
本アプリでアップロードされた画像は、AIによる画像生成処理のためにGoogleのサーバーへ送信されます。生成完了後、データは保持されず、保存されません。

2. 収集する情報
本アプリは、ユーザー個人を特定する情報（名前、メールアドレスなど）を収集しません。

3. クッキー（Cookie）
ユーザー体験向上のため、ローカルストレージやCookieを使用する場合がありますが、個人追跡を目的とするものではありません。
`;

const App: React.FC = () => {
  const [state, setState] = useState<CollageState>({
    originalImage: null,
    generatedImage: null,
    isGenerating: false,
    error: null,
    currentStyleId: ''
  });

  const [modalContent, setModalContent] = useState<{title: string, text: string} | null>(null);

  const getRandomStyle = (excludeId?: string): StyleOption => {
    // 10% chance to trigger the SECRET STYLE
    const isSecret = Math.random() < 0.10;
    
    if (isSecret && excludeId !== 'kintsugi_gold') {
      return SECRET_STYLE;
    }

    const availableStyles = excludeId 
      ? STYLES.filter(s => s.id !== excludeId)
      : STYLES;
    const randomIndex = Math.floor(Math.random() * availableStyles.length);
    return availableStyles[randomIndex];
  };

  const generateWithStyle = async (base64: string, style: StyleOption) => {
    setState((prev) => ({
      ...prev,
      isGenerating: true,
      error: null,
      currentStyleId: style.id
    }));

    try {
      const result = await generateCollage(base64, style.prompt);
      
      setState((prev) => ({
        ...prev,
        generatedImage: result,
        isGenerating: false,
      }));
    } catch (error) {
      console.error("Generation failed", error);
      setState((prev) => ({
        ...prev,
        isGenerating: false,
        error: "アートの作成に失敗しました。もう一度試してね！",
      }));
    }
  };

  const handleImageSelect = async (base64: string) => {
    setState(prev => ({ ...prev, originalImage: base64, generatedImage: null }));
    const randomStyle = getRandomStyle();
    await generateWithStyle(base64, randomStyle);
  };

  const handleRemix = async () => {
    if (state.originalImage && !state.isGenerating) {
      const newStyle = getRandomStyle(state.currentStyleId);
      await generateWithStyle(state.originalImage, newStyle);
    }
  };

  const handleReset = () => {
    setState({
      originalImage: null,
      generatedImage: null,
      isGenerating: false,
      error: null,
      currentStyleId: ''
    });
  };

  const currentStyle = state.currentStyleId === SECRET_STYLE.id 
    ? SECRET_STYLE 
    : STYLES.find(s => s.id === state.currentStyleId);

  return (
    <div className="min-h-screen pb-24 relative overflow-hidden font-[Fredoka]">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-[-1] opacity-50">
        <div className="absolute top-[-50px] left-[-50px] w-80 h-80 bg-pink-200/40 rounded-full blur-3xl"></div>
        <div className="absolute top-[40%] right-[-50px] w-96 h-96 bg-cyan-200/40 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-50px] left-[20%] w-72 h-72 bg-yellow-200/40 rounded-full blur-3xl"></div>
      </div>

      <Header />

      <main className="container mx-auto px-4">
        {state.error && (
          <div className="max-w-md mx-auto mb-8 p-4 bg-red-50 border-2 border-red-200 text-red-500 flex items-center gap-3 rounded-2xl shadow-sm">
            <AlertCircle size={20} />
            <span className="font-bold">{state.error}</span>
          </div>
        )}

        {!state.originalImage ? (
          <div className="animate-in fade-in zoom-in duration-500">
             <ImageUpload onImageSelect={handleImageSelect} />
          </div>
        ) : (
          <ResultDisplay
            originalImage={state.originalImage}
            generatedImage={state.generatedImage}
            isGenerating={state.isGenerating}
            onReset={handleReset}
            onRemix={handleRemix}
            currentStyle={currentStyle}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 w-full bg-white/60 backdrop-blur-md py-3 text-center border-t border-white/50 z-30">
        <div className="flex flex-col items-center gap-2">
          <div className="flex gap-4 text-[10px] text-gray-400">
            <button onClick={() => setModalContent({title: "利用規約", text: TERMS_TEXT})} className="hover:text-gray-600 underline">利用規約</button>
            <button onClick={() => setModalContent({title: "プライバシーポリシー", text: PRIVACY_TEXT})} className="hover:text-gray-600 underline">プライバシーポリシー</button>
          </div>
          <a href="https://soystories.jp/" target="_blank" rel="noopener noreferrer" className="text-[10px] text-gray-400 hover:text-pink-400 transition-colors font-bold">
            produced by SoyStories © 2025 v1.0.1
          </a>
        </div>
      </footer>

      {/* Modal for Terms/Privacy */}
      {modalContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50">
              <h3 className="font-bold text-gray-800">{modalContent.title}</h3>
              <button 
                onClick={() => setModalContent(null)}
                className="p-1 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto whitespace-pre-wrap text-sm text-gray-600 leading-relaxed">
              {modalContent.text}
            </div>
            <div className="p-4 border-t border-gray-100 bg-gray-50 text-center">
              <button 
                onClick={() => setModalContent(null)}
                className="px-6 py-2 bg-gray-800 text-white rounded-full text-sm font-bold hover:bg-gray-700 transition-colors"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
