import { useEffect, useRef, useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import Hls from 'hls.js';
import { kickFetch } from '@/lib/kickApi';

interface VodModalProps {
  video: { id?: number; uuid?: string | null; source?: string; thumbnail?: string; title?: string; session_title?: string; views?: number; view_count?: number } | null;
  onClose: () => void;
}

export function VodModal({ video, onClose }: VodModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [showFallback, setShowFallback] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');

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

  useEffect(() => {
    if (!video) return;
    setStatus('loading');

    const loadVideo = async () => {
      let src = '';
      const dbg: string[] = [`id=${video.id}, uuid=${video.uuid}, listSource=${video.source?.slice(0, 50)}`];

      const vid = video.uuid || video.id;
      dbg.push(`vid=${vid}`);

      if (vid) {
        const endpoints = [
          `https://kick.com/api/v2/video/${vid}`,
          `https://kick.com/api/v1/video/${vid}`,
        ];
        for (const ep of endpoints) {
          try {
            dbg.push(`fetch ${ep.split('/').pop()}`);
            const res = await kickFetch(ep);
            const keys = res ? Object.keys(res).join(',') : 'no-res';
            const s3 = res?.s3 || '';
            const vRaw = res?.v;
            const vStr = typeof vRaw === 'string' ? vRaw : (vRaw?.source || vRaw?.url || JSON.stringify(vRaw).slice(0, 60));
            const thumb = res?.thumb?.url || res?.thumb || '';
            dbg.push(`keys=${keys.slice(0, 120)} | s3=${String(s3).slice(0, 60)} | v=${vStr.slice(0, 60)} | thumb=${String(thumb).slice(0, 60)}`);
            src = res?.data?.source || res?.source || res?.playback_url || s3 || vRaw?.source || vRaw?.url || '';
            if (src) { dbg.push(`src=${src.slice(0, 60)}`); break; }
          } catch { dbg.push('fail'); }
        }
      }

      if (!src) src = video.source || '';
      setDebugInfo(dbg.join(' | '));
      if (!src || !videoRef.current) { setStatus('error'); return; }

      const v = videoRef.current;

      if (Hls.isSupported()) {
        const hls = new Hls({ enableWorker: false });
        hls.loadSource(src);
        hls.attachMedia(v);
        hls.on(Hls.Events.MANIFEST_PARSED, () => { setStatus('ready'); v.play().catch(() => {}); });
        hls.on(Hls.Events.ERROR, () => setStatus('error'));
        return () => { hls.destroy(); setStatus('loading'); };
      } else if (v.canPlayType('application/vnd.apple.mpegurl')) {
        v.src = src;
        v.addEventListener('loadedmetadata', () => { setStatus('ready'); v.play().catch(() => {}); });
        v.addEventListener('error', () => setStatus('error'));
        return () => { v.src = ''; };
      } else {
        setStatus('error');
      }
    };

    const timer = setTimeout(() => {
      if (status === 'loading') setShowFallback(true);
    }, 15000);

    loadVideo();
    return () => clearTimeout(timer);
  }, [video]);

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
        className="relative w-full max-w-4xl bg-[#0a0a0a] rounded-[32px] overflow-hidden border border-white/10 shadow-2xl shadow-black/60"
      >
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4A84A]/40 to-transparent" />

        <div className="relative aspect-video bg-black flex items-center justify-center">
          {/* thumbnail placeholder */}
          {status === 'loading' && video.thumbnail && (
            <img src={video.thumbnail} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
          )}
          {status === 'loading' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10">
              <div className="w-10 h-10 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
            </div>
          )}
          {status === 'ready' && (
            <video
              ref={videoRef}
              className="w-full h-full object-contain"
              controls
              playsInline
              autoPlay
            />
          )}
          {status === 'error' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white/40">
              <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
              </svg>
              <span className="text-sm font-medium">Could not load stream</span>
              {debugInfo && <span className="text-[8px] text-white/20 max-w-[300px] text-center leading-tight">{debugInfo}</span>}
              <button onClick={onClose} className="text-xs text-white/30 hover:text-white/50 transition-colors">Close</button>
            </div>
          )}
          <div className="absolute inset-0 pointer-events-none ring-1 ring-white/5" />
        </div>

        <div className="flex items-center justify-between p-4 md:p-5 bg-gradient-to-b from-[#0d0d0d] to-[#080808]">
          <div className="min-w-0 flex-1 mr-4">
            <h3 className="text-sm md:text-lg font-bold text-white truncate drop-shadow-sm">{title}</h3>
            {(video.views || video.view_count) && (
              <div className="flex items-center gap-2 mt-1">
                <svg className="w-3.5 h-3.5 text-white/40 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
                <span className="text-xs text-white/50 font-medium">
                  {new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(video.views || video.view_count || 0)} views
                </span>
              </div>
            )}
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

        {showFallback && status !== 'ready' && (
          <div className="px-4 md:px-5 pb-4 md:pb-5 text-center">
            <div className="h-px bg-white/5 mb-3" />
            <a href={`https://kick.com/video/${video.uuid || video.id}`} target="_blank" rel="noopener noreferrer"
              className="text-xs text-[#D4A84A] hover:underline">Watch on Kick ↗</a>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
