import { useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

interface ClipModalProps {
  clip: { id: string; title: string; view_count: number } | null;
  onClose: () => void;
}

export function ClipModal({ clip, onClose }: ClipModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (clip) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [clip, handleKeyDown]);

  if (!clip) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" />

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 40 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl bg-[#0a0a0a] rounded-[32px] overflow-hidden border border-white/10 shadow-2xl shadow-black/60"
      >
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4A84A]/40 to-transparent" />

        <div className="relative aspect-video bg-black">
          <iframe
            src={`https://kick.com/embed/clip/${clip.id}?autoplay=1`}
            className="w-full h-full"
            allow="autoplay; fullscreen"
            allowFullScreen
            title={clip.title}
          />
          <div className="absolute inset-0 pointer-events-none ring-1 ring-white/5 rounded-inherit" />
        </div>

        <div className="flex items-center justify-between p-4 md:p-5 bg-gradient-to-b from-[#0d0d0d] to-[#080808]">
          <div className="min-w-0 flex-1 mr-4">
            <h3 className="text-sm md:text-lg font-bold text-white truncate drop-shadow-sm">{clip.title}</h3>
            <div className="flex items-center gap-2 mt-1">
              <svg className="w-3.5 h-3.5 text-white/40 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
              <span className="text-xs text-white/50 font-medium">
                {new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(clip.view_count)} views
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="relative w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-300 flex items-center justify-center group/btn shrink-0"
          >
            <svg className="w-4 h-4 text-white/60 group-hover/btn:text-white/90 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
