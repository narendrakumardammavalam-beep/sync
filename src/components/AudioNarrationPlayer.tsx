import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, X, FastForward } from 'lucide-react';
import { SectionContent } from '../data/blogPostData';

interface AudioNarrationPlayerProps {
  sections: SectionContent[];
  isOpen: boolean;
  onClose: () => void;
  onHighlightParagraph?: (sectionId: string, paragraphIndex: number) => void;
}

export const AudioNarrationPlayer: React.FC<AudioNarrationPlayerProps> = ({
  sections,
  isOpen,
  onClose,
  onHighlightParagraph
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentParagraphIndex, setCurrentParagraphIndex] = useState(0);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [isSupported, setIsSupported] = useState(true);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setIsSupported(false);
    }
  }, []);

  const stopSpeaking = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
  };

  const speakCurrentParagraph = (sectionIdx: number, paraIdx: number) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();

    if (sectionIdx >= sections.length) {
      setIsPlaying(false);
      setCurrentSectionIndex(0);
      setCurrentParagraphIndex(0);
      return;
    }

    const section = sections[sectionIdx];
    if (paraIdx >= section.paragraphs.length) {
      // Advance to next section
      const nextSec = sectionIdx + 1;
      if (nextSec < sections.length) {
        setCurrentSectionIndex(nextSec);
        setCurrentParagraphIndex(0);
        speakCurrentParagraph(nextSec, 0);
      } else {
        setIsPlaying(false);
        setCurrentSectionIndex(0);
        setCurrentParagraphIndex(0);
      }
      return;
    }

    const textToSpeak = section.paragraphs[paraIdx];
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = playbackRate;
    utterance.pitch = 1.0;

    // Pick a natural English voice if available
    const voices = window.speechSynthesis.getVoices();
    const naturalVoice =
      voices.find((v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Premium'))) ||
      voices.find((v) => v.lang.startsWith('en'));
    if (naturalVoice) {
      utterance.voice = naturalVoice;
    }

    utterance.onend = () => {
      const nextPara = paraIdx + 1;
      setCurrentParagraphIndex(nextPara);
      speakCurrentParagraph(sectionIdx, nextPara);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);

    if (onHighlightParagraph) {
      onHighlightParagraph(section.id, paraIdx);
    }
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
    } else {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        setIsPlaying(true);
      } else {
        speakCurrentParagraph(currentSectionIndex, currentParagraphIndex);
      }
    }
  };

  const handleRestart = () => {
    stopSpeaking();
    setCurrentSectionIndex(0);
    setCurrentParagraphIndex(0);
    speakCurrentParagraph(0, 0);
  };

  const handleRateChange = () => {
    const rates = [1.0, 1.25, 1.5];
    const nextIndex = (rates.indexOf(playbackRate) + 1) % rates.length;
    const nextRate = rates[nextIndex];
    setPlaybackRate(nextRate);
    if (isPlaying) {
      speakCurrentParagraph(currentSectionIndex, currentParagraphIndex);
    }
  };

  const handleClose = () => {
    stopSpeaking();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] bg-white border border-stone-300 rounded shadow-lg p-4 font-sans text-stone-900 transition-all">
      <div className="flex items-center justify-between pb-3 border-b border-stone-200">
        <div className="flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-stone-700" />
          <span className="text-xs uppercase tracking-wider font-semibold text-stone-700">
            Audio Reader
          </span>
        </div>
        <button
          type="button"
          onClick={handleClose}
          className="p-1 text-stone-400 hover:text-stone-700 rounded transition-colors cursor-pointer"
          aria-label="Close audio player"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="py-3">
        <div className="text-xs text-stone-500 mb-1 truncate">
          Section {currentSectionIndex + 1} of {sections.length}:
        </div>
        <div className="text-sm font-editorial-heading font-semibold text-stone-900 truncate">
          {sections[currentSectionIndex]?.title}
        </div>
        <div className="text-xs text-stone-500 mt-1 font-mono-numbers">
          Paragraph {currentParagraphIndex + 1} of{' '}
          {sections[currentSectionIndex]?.paragraphs.length || 1}
        </div>

        {isPlaying && (
          <div className="flex items-center gap-1 mt-3 h-3">
            {[40, 75, 55, 90, 60, 30, 80, 50, 70, 45].map((height, i) => (
              <span
                key={i}
                className="w-1 bg-stone-700 rounded-full animate-pulse"
                style={{
                  height: `${height}%`,
                  animationDelay: `${i * 120}ms`
                }}
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-stone-100">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleTogglePlay}
            className="flex items-center justify-center w-8 h-8 rounded bg-stone-900 text-white hover:bg-stone-800 transition-colors cursor-pointer"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
          </button>
          <button
            type="button"
            onClick={handleRestart}
            className="p-1.5 text-stone-600 hover:text-stone-900 rounded hover:bg-stone-100 transition-colors cursor-pointer"
            title="Restart from beginning"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRateChange}
            className="px-2 py-1 text-xs font-mono-numbers font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded transition-colors cursor-pointer"
            title="Adjust reading speed"
          >
            {playbackRate}x
          </button>
        </div>
      </div>
    </div>
  );
};
