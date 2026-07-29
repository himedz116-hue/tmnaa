import { useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

interface VodModalProps {
  video: { id?: number; uuid?: string | null; thumbnail?: string; title?: string; session_title?: string; views?: number; view_count?: number } | null;
  onClose: () => void;
}

export function VodModal({ video, onClose }: VodModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (video) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [video, handleKeyDown]);

  if (!video) return null;

  const title = video.session_title || video.title || 'Past Stream';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" />

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.15 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-[#0a0a0a] rounded-[32px] overflow-hidden border border-white/10 shadow-2xl shadow-black/60"
      >
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4A84A]/40 to-transparent" />

        <div className="relative aspect-video bg-black flex items-center justify-center">
          {video.thumbnail ? (
            <img src={video.thumbnail} alt={title} className="w-full h-full object-cover opacity-60" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#111] to-[#050505]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
              <svg className="w-7 h-7 text-white ml-0.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="p-5 md:p-6">
          <h3 className="text-base md:text-lg font-bold text-white leading-tight mb-1">{title}</h3>
          {(video.views || video.view_count) && (
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-3.5 h-3.5 text-white/40 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
              <span className="text-xs text-white/50 font-medium">
                {new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(video.views || video.view_count || 0)} views
              </span>
            </div>
          )}
          <a
            href={`https://kick.com/video/${video.uuid || video.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-[#D4A84A] hover:bg-[#c49a3f] text-black font-bold text-sm transition-all duration-300 shadow-lg shadow-[#D4A84A]/20"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
            Watch on Kick
          </a>
        </div>

        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/40 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all duration-300 flex items-center justify-center z-20"
        >
          <svg className="w-4 h-4 text-white/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </motion.div>
    </motion.div>
  );
}
