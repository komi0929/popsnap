
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
    description: '元気で明るいポップ漫画！',
    colorClass: 'bg-yellow-100 border-yellow-400',
    element: 'LIGHT',
    prompt: `
      - Style: VINTAGE COMIC COLLAGE & POP ART.
      - CORE RULE: The child's face MUST remain CUTE and undistorted. Do not apply heavy filters to the face.
      - Technique: PAPER CUTOUT style. The subject is a high-quality sticker placed on a busy background.
      - Background: Exploding comic strips, halftone dots, and "POW!" sound effects.
      - Vibe: Energetic, fun, and adorable (preserving the child's expression).
    `
  },
  {
    id: 'groovy_pop',
    name: 'グルーヴィーパーティー',
    description: '60年代のサイケデリックな感じ！',
    colorClass: 'bg-pink-100 border-pink-400',
    element: 'PSYCHIC',
    prompt: `
      - Style: HYPER-VIBRANT 60s Psychedelic Pop Art.
      - Material: Silk-screen prints, neon posters, and kaleidoscope patterns.
      - Technique: Andy Warhol style REPETITION. Repeat the subject's face in clashing neon colors (Hot Pink vs Lime Green).
      - Composition: SPIRALING visual overload! Use swirling patterns, huge stars, and balloon letters.
      - Vibe: Trippy, groovy, and energetic.
    `
  },
  {
    id: 'mystery_red',
    name: 'シークレットエージェント',
    description: 'クールな影とミステリー。',
    colorClass: 'bg-stone-200 border-stone-600',
    element: 'DARK',
    prompt: `
      - Style: High-Contrast NOIR Graphic Novel.
      - Material: Rough newsprint, spilled black ink, and splatters of BLOOD RED paint.
      - Technique: STARK Chiaroscuro. Extreme shadows vs blinding white highlights. Coarse halftone textures.
      - Composition: Dramatic angles, hidden faces, and jagged shadows cutting across the composition.
      - Vibe: Dangerous, cinematic, and mysterious.
    `
  },
  {
    id: 'surrealist',
    name: 'ドリームワールド',
    description: '不思議で魔法のような世界。',
    colorClass: 'bg-indigo-100 border-indigo-400',
    element: 'MAGIC',
    prompt: `
      - Style: Avant-Garde SURREALISM.
      - Material: Vintage Victorian illustrations, clouds, giant eyes, and antique keys.
      - Technique: Dreamlike juxtaposition. Blend the subject with unexpected objects (e.g., face replacing a clock).
      - Composition: FLOATING and defying gravity. Clouds inside rooms, giant flowers, strange scales.
      - Vibe: Otherworldly, poetic, and bizarre.
    `
  },
  {
    id: 'botanical',
    name: 'ボタニカルアート',
    description: 'アンティークな植物図鑑風。',
    colorClass: 'bg-green-100 border-green-500',
    element: 'NATURE',
    prompt: `
      - Style: ANTIQUE BOTANICAL COLLAGE & Art Nouveau.
      - Material: Yellowed parchment, detailed ink illustrations of flora, and real pressed flower textures.
      - Technique: INTERTWINED LAYERING. Vines, leaves, and flowers should weave AROUND and OVER the subject, integrating them into the illustration.
      - Composition: ORGANIC FUSION. The subject appears to be growing out of a vintage garden plate. Not just a person standing in front of a forest.
      - Vibe: Elegant, artistic, and timeless (less 'fairytale', more 'museum art').
    `
  },
  {
    id: 'cyber',
    name: 'フューチャーゲーマー',
    description: 'グリッチとネオンカラー。',
    colorClass: 'bg-cyan-100 border-cyan-400',
    element: 'TECH',
    prompt: `
      - Style: CYBERPUNK GLITCH ART.
      - Material: Broken screens, pixels, neon lasers, and circuit boards.
      - Technique: DATA MOSHING. Distort the image with digital noise, scanlines, and RGB shifts.
      - Composition: High-tech chaos. Holographic overlays and 3D wireframes.
      - Vibe: Futuristic, dystopian, and electric.
    `
  },
  {
    id: 'cubism',
    name: 'パズル写真',
    description: '写真のパズルみたい。',
    colorClass: 'bg-purple-100 border-purple-400',
    element: 'MIND',
    prompt: `
      - Style: AVANT-GARDE PHOTO JOINER (David Hockney style).
      - Technique: ARTISTIC DECONSTRUCTION. Not just small square photos.
      - Composition: The subject is composed of LARGE, overlapping photo fragments of different sizes and angles.
      - Detail: Focus on ABSTRACT SHAPES and shifting perspectives. Some fragments are zoomed in (an eye, a hand).
      - Vibe: Complex, intellectual, and abstract. A true mosaic of moments.
    `
  },
  {
    id: 'torn_poster',
    name: 'ストリートアート',
    description: 'かっこいい破れたポスター風。',
    colorClass: 'bg-orange-100 border-orange-400',
    element: 'FIRE',
    prompt: `
      - Style: URBAN GRAFFITI & STENCIL ART (Banksy style).
      - Material: Concrete wall texture, peeling posters, and vibrant spray paint.
      - Technique: High-contrast STENCIL cutout of the subject. Splash colorful paint drips and graffiti tags around them.
      - Composition: BOLD and EDGY. Use heavy shadows and neon highlights to make the subject pop against the gritty wall.
      - Vibe: Rebellious, cool, and artistic masterpiece.
    `
  },
  {
    id: 'candy_pop',
    name: 'シュガー・コラージュ',
    description: '雑誌やステッカーのスクラップ！',
    colorClass: 'bg-rose-100 border-rose-400',
    element: 'SWEET',
    prompt: `
      - Style: POP SURREALISM / Harajuku Decora Collage.
      - Material: Glossy magazine cutouts, 3D candy wrappers, plastic stickers, and glitter glue textures.
      - Technique: SCRAPBOOKING. Layer items violently OVER and UNDER the subject. Make the subject look like a manually cut-out photo.
      - Composition: CHAOTIC CURATION. A messy but artistic explosion of fashion items and sweets. Meaningful chaos.
      - Vibe: Artistic, eccentric, and high-fashion (less 'fluffy', more 'bold').
    `
  }
];

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

  const [usedCuteStyles, setUsedCuteStyles] = useState<string[]>([]);
  const CUTE_STYLE_IDS = ['candy_pop', 'pop', 'botanical'];

  const getRandomStyle = (excludeId?: string): StyleOption => {
    const isInitialPhase = usedCuteStyles.length < CUTE_STYLE_IDS.length;
    
    let nextStyle: StyleOption;

    if (isInitialPhase) {
      // Phase 1: Pick from Cute Styles (that haven't been used yet)
      const availableCute = CUTE_STYLE_IDS.filter(id => !usedCuteStyles.includes(id));
      // Fallback to random cute if something goes wrong (shouldn't happen)
      const targetPool = availableCute.length > 0 ? availableCute : CUTE_STYLE_IDS;
      // Filter out current if remixing (unless only 1 left)
      const validPool = excludeId && targetPool.length > 1 
        ? targetPool.filter(id => id !== excludeId)
        : targetPool;
        
      const randomId = validPool[Math.floor(Math.random() * validPool.length)];
      nextStyle = STYLES.find(s => s.id === randomId)!;
    } else {
      // Phase 2: Pick from Remaining Styles (excluding Cute styles to ensure variety initially)
      const otherStyles = STYLES.filter(s => !CUTE_STYLE_IDS.includes(s.id));
      const availableStyles = excludeId 
        ? otherStyles.filter(s => s.id !== excludeId)
        : otherStyles;
      const randomIndex = Math.floor(Math.random() * availableStyles.length);
      nextStyle = availableStyles[randomIndex];
    }

    return nextStyle;
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
    
    // Update used cute styles if applicable
    if (CUTE_STYLE_IDS.includes(randomStyle.id) && !usedCuteStyles.includes(randomStyle.id)) {
      setUsedCuteStyles(prev => [...prev, randomStyle.id]);
    }
    
    await generateWithStyle(base64, randomStyle);
  };

  const handleRemix = async () => {
    if (state.originalImage && !state.isGenerating) {
      const newStyle = getRandomStyle(state.currentStyleId);
      
      // Update used cute styles if applicable
      if (CUTE_STYLE_IDS.includes(newStyle.id) && !usedCuteStyles.includes(newStyle.id)) {
        setUsedCuteStyles(prev => [...prev, newStyle.id]);
      }

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

  const currentStyle = STYLES.find(s => s.id === state.currentStyleId);

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
            produced by SoyStories
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
