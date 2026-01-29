
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
      - Technique: DYNAMIC PANEL LAYOUT. Use comic book panel frames and diagonal splits.
      - Background: Halftone dots, speed lines (horizontal/vertical), and "POW!" sound effects. NO SPIRALS.
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
      - Technique: LIQUID MELT. The background should look like a lava lamp or melting paint.
      - Composition: WAVY HORIZONTAL BANDS and warped checkerboards. Avoid radial explosions.
      - Vibe: Trippy, groovy, and energetic.
    `
  },
  {
    id: 'neon_retro',
    name: 'ネオン・ファンク',
    description: '80年代のレトロでクールなネオン。',
    colorClass: 'bg-indigo-100 border-indigo-400',
    element: 'DARK',
    prompt: `
      - Style: 80s RETRO VAPORWAVE & SYNTHWAVE.
      - Material: Glowing neon tubes, grid landscapes, and chrome textures.
      - Technique: NEON OUTLINE. Trace the subject in bright violet and cyan laser lines.
      - Composition: Cybernetic horizon. Use a retro sun, palm tree silhouettes, and geometric wireframes.
      - Vibe: Radical, nostalgic, and "midnight city" atmosphere.
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
    name: 'クリスタル・パズル',
    description: 'キラキラ輝く宝石のような世界！',
    colorClass: 'bg-purple-100 border-purple-400',
    element: 'MIND',
    prompt: `
      - Style: LOW POLY GEOMETRIC ART (Stained Glass style).
      - Technique: FACETED POLYGONS. The subject is made of sharp triangular facets like a diamond or crystal.
      - Composition: STRUCTURED MESH. No explosions. A clean, tessellated wallpaper background of pastel and jewel-tone triangles.
      - Detail: Sharp edges, prismatic colors, and digital aesthetics.
      - Vibe: Modern, digital, crisp, and sparkling.
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
      - Technique: STICKER BOMB. The entire background is completely covered in random stickers and sweets.
      - Composition: RANDOM SCATTER (All-over pattern). No central explosion. It should look like a messy toy box.
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

  // History system to ensure all 9 styles are shown before repeating
  const [usedStyleIds, setUsedStyleIds] = useState<string[]>([]);

  const getRandomStyle = (history: string[], excludeId?: string): StyleOption => {
    // 1. Find styles that haven't been used yet in this cycle
    const unusedStyles = STYLES.filter(s => !history.includes(s.id));

    // 2. Decide pool: If we exhausted all styles, reset (use full list).
    //    Otherwise, use the unused ones.
    const targetPool = unusedStyles.length === 0 ? STYLES : unusedStyles;

    // 3. Apply excludeId (don't pick the current one ideally, unless it's the only one)
    const validPool = (excludeId && targetPool.length > 1)
      ? targetPool.filter(s => s.id !== excludeId)
      : targetPool;

    // 4. Pick random
    const randomIndex = Math.floor(Math.random() * validPool.length);
    return validPool[randomIndex];
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
    
    // Pass current history (usedStyleIds) to selection logic
    const nextStyle = getRandomStyle(usedStyleIds);
    
    // Update history
    setUsedStyleIds(prev => {
      // If we just finished a cycle (or are about to start a new one because pool was empty),
      // we reset history to just this new one.
      // Logic: If prev.length == STYLES.length, we were full, so we start over.
      // Actually, getRandomStyle handles the selection, but we need to track correctly.
      if (prev.length >= STYLES.length) {
        return [nextStyle.id];
      }
      return [...prev, nextStyle.id];
    });
    
    await generateWithStyle(base64, nextStyle);
  };

  const handleRemix = async () => {
    if (state.originalImage && !state.isGenerating) {
      const nextStyle = getRandomStyle(usedStyleIds, state.currentStyleId);
      
      setUsedStyleIds(prev => {
        if (prev.length >= STYLES.length) {
          return [nextStyle.id];
        }
        // Avoid duplicate ID in history if somehow picked again (shouldn't happen with random logic usually, but safe to check)
        if (prev.includes(nextStyle.id)) return prev;
        return [...prev, nextStyle.id];
      });

      await generateWithStyle(state.originalImage, nextStyle);
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
