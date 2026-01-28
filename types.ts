
export interface CollageState {
  originalImage: string | null;
  generatedImage: string | null;
  isGenerating: boolean;
  error: string | null;
  currentStyleId: string;
}

export interface ImageUploadProps {
  onImageSelect: (base64: string) => void;
}

export interface StyleOption {
  id: string;
  name: string;
  description: string;
  prompt: string;
  colorClass: string;
  element: string; // Kept for compatibility but unused in new UI
}

export interface ResultDisplayProps {
  originalImage: string | null;
  generatedImage: string | null;
  isGenerating: boolean;
  onReset: () => void;
  onRemix: () => void;
  currentStyle: StyleOption | undefined;
}
