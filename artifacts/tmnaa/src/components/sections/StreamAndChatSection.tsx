import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { kickFetch } from '@/lib/kickApi';
import { chatService } from '@/services/chatService';
import type { ChatMessage } from '@/lib/types';

const easeOut = [0.22, 1, 0.36, 1] as const;
const CHANNEL_SLUG = 'tmnaa';

function OwnerBadge() {
  return <div className="flex items-center justify-center w-4 h-4 rounded bg-[#D4A84A] text-black shrink-0 shadow-[0_0_10px_rgba(212,168,74,0.4)]"><svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3"><path d="M12 2L2 19h20L12 2zm0 3.5L18.5 17H5.5L12 5.5z" /></svg></div>;
}
function ModBadge() {
  return <div className="flex items-center justify-center w-4 h-4 rounded bg-[#D4A84A]/80 text-black shrink-0 shadow-[0_0_8px_rgba(212,168,74,0.4)]"><svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3"><path d="M18.828 2.343a3.001 3.001 0 00-4.243 0l-5.071 5.071-3.657-3.657a1 1 0 00-1.414 0l-1.414 1.414a1 1 0 000 1.414l3.657 3.657-5.071 5.071a1 1 0 000 1.414l2.828 2.828a1 1 0 001.414 0l5.071-5.071 3.657 3.657a1 1 0 001.414 0l1.414-1.414a1 1 0 000-1.414l-3.657-3.657 5.071-5.071a3.001 3.001 0 000-4.243z" /></svg></div>;
}
function VipBadge() {
  return <div className="flex items-center justify-center w-4 h-4 rounded bg-[#F542A8] text-white shrink-0 shadow-[0_0_8px_rgba(245,66,168,0.4)]"><svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3"><path d="M12 2L2 9l10 13 10-13-10-7z" /></svg></div>;
}

function renderMessage(content: string) {
  if (!content) return null;
  const emoteRegex = /\[emote:(\d+):([\w\s\-]+)\]/gi;
  const parts: any[] = [];
  let lastIndex = 0;
  let match;
  while ((match = emoteRegex.exec(content)) !== null) {
    if (match.index > lastIndex) parts.push(content.substring(lastIndex, match.index));
    parts.push(<img key={`${match.index}-${match[1]}`} src={`https://files.kick.com/emotes/${match[1]}/fullsize`} alt={match[2]} className="inline-block w-7 h-7 mx-0.5 align-middle object-contain" />);
    lastIndex = emoteRegex.lastIndex;
  }
  if (lastIndex < content.length) parts.push(content.substring(lastIndex));
  return parts.length > 0 ? parts : content;
}

export function StreamAndChatSection() {
  const [isLive, setIsLive] = useState(false);
  const [viewers, setViewers] = useState(0);
  const [streamTitle, setStreamTitle] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  const [connectionDetails, setConnectionDetails] = useState('');
  const chatRef = useRef<HTMLDivElement>(null);

  const checkLiveStatus = () => {
    kickFetch(`https://kick.com/api/v2/channels/${CHANNEL_SLUG}`).then((data) => {
      if (!data) return;
      const live = data.livestream || data.live_stream;
      const liveBool = live && (live.is_live === true || live.is_live === 1);
      setIsLive(liveBool);
      if (liveBool) {
        setViewers(live.viewer_count || 0);
        setStreamTitle(live.session_title || live.title || 'Live Stream');
      }
    });
  };

  useEffect(() => {
    checkLiveStatus();
    const interval = setInterval(checkLiveStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isLive) return;
    const unbind1 = chatService.onMessage((msg) => {
      setMessages((prev) => [...prev, msg].slice(-50));
    });
    const unbind2 = chatService.onDeleteMessage((id) => {
      setMessages((prev) => prev.filter((m) => m.id !== id));
    });
    const unbind3 = chatService.onStatusChange((connected, error, details) => {
      setIsConnected(connected);
      setConnectionError(error || false);
      setConnectionDetails(details || '');
    });
    chatService.connect(CHANNEL_SLUG);
    return () => { unbind1(); unbind2(); unbind3(); chatService.clearListeners(); chatService.disconnect(); };
  }, [isLive]);

  const handleRetry = () => {
    setConnectionError(false);
    chatService.disconnect();
    chatService.connect(CHANNEL_SLUG);
  };

  useEffect(() => {
    if (chatRef.current) {
      const { scrollHeight, clientHeight, scrollTop } = chatRef.current;
      if (scrollHeight - scrollTop - clientHeight < 150 || messages.length <= 5) {
        chatRef.current.scrollTo({ top: scrollHeight, behavior: 'smooth' });
      }
    }
  }, [messages]);

  if (!isLive) return null;

  const getBadge = (role: string) => {
    if (role === 'owner') return <OwnerBadge />;
    if (role === 'moderator') return <ModBadge />;
    if (role === 'vip') return <VipBadge />;
    return null;
  };

  return (
    <section className="py-20 md:py-28 px-6 relative">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: easeOut }}
          className="flex items-center gap-4 mb-10"
        >
          <div className="h-[1px] flex-1" style={{ background: 'linear-gradient(90deg, transparent, rgba(83, 252, 24, 0.3), transparent)' }} />
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-[#FF7A18] animate-pulse" style={{ boxShadow: '0 0 12px rgba(255, 122, 24, 0.8)' }} />
            <h2 className="text-xs md:text-sm font-bold uppercase tracking-[0.3em]" style={{ color: 'rgba(247, 243, 238, 0.6)', fontFamily: 'Cairo, sans-serif' }}>
              LIVE NOW
            </h2>
            <span className="text-[10px] font-bold text-[#53FC18]">{viewers} watching</span>
          </div>
          <div className="h-[1px] flex-1" style={{ background: 'linear-gradient(90deg, transparent, rgba(83, 252, 24, 0.3), transparent)' }} />
        </motion.div>

        {/* Stream + Chat */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Player */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: easeOut }}
            className="flex-1 aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-black"
          >
            <iframe
              src={`https://player.kick.com/${CHANNEL_SLUG}?autoplay=true&muted=true`}
              className="w-full h-full border-0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title="Kick Stream"
            />
          </motion.div>

          {/* Chat */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: easeOut }}
            className="w-full lg:w-[380px] h-[500px] lg:h-auto rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-[#0b0e0f]/80 backdrop-blur-2xl flex flex-col"
          >
            {/* Chat Header */}
            <div className="h-14 shrink-0 bg-white/5 border-b border-white/5 flex items-center px-5 gap-3">
              <div className="w-8 h-8 rounded-lg bg-black/20 border border-white/5 flex items-center justify-center">
                <svg className="w-4 h-4 text-[#D4A84A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-white font-bold text-sm">Live Chat</span>
                <div className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-[#53FC18] shadow-[0_0_8px_#53FC18]' : connectionError ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : 'bg-yellow-500 animate-pulse'}`} />
                  <span className="text-[10px] text-white/40 font-mono uppercase">{isConnected ? 'Live' : connectionError ? 'Error' : 'Connecting...'}</span>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-1.5">
              {messages.length === 0 && !connectionError && (
                <div className="flex items-center justify-center h-full text-white/30 text-sm">Waiting for messages...</div>
              )}
              {connectionError && (
                <div className="flex flex-col items-center justify-center h-full gap-3">
                  <div className="text-red-400 text-xs text-center">{connectionDetails || 'Chat connection failed'}</div>
                  <button onClick={handleRetry} className="px-4 py-2 rounded-xl bg-[#D4A84A]/10 border border-[#D4A84A]/30 text-[#D4A84A] text-xs font-bold hover:bg-[#D4A84A]/20 transition-all">
                    Retry
                  </button>
                </div>
              )}
              {messages.map((msg) => (
                <div key={msg.id} className="flex items-start gap-2.5 py-1.5 px-3 rounded-xl hover:bg-white/5 transition-all duration-200 border border-transparent hover:border-white/5">
                  {(msg.role === 'owner' || msg.role === 'moderator' || msg.role === 'vip') && (
                    <div className="mt-1 shrink-0">{getBadge(msg.role)}</div>
                  )}
                  <div className="flex flex-wrap items-baseline gap-x-2 text-sm leading-relaxed break-words w-full">
                    <span className="font-bold shrink-0" style={{ color: msg.user.color || '#fff' }}>{msg.user.username}</span>
                    <span className="text-white/80 font-medium flex flex-wrap items-center gap-x-1">{renderMessage(msg.content)}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
