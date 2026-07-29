import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { kickFetch } from '@/lib/kickApi';

const easeOut = [0.22, 1, 0.36, 1] as const;

const formatNum = (n: number) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
};

interface Social {
  name: string;
  username: string;
  url: string;
  icon: React.ReactNode;
  color: string;
  bgGlow: string;
  followers: number;
}

const DEFAULT_FOLLOWERS: Record<string, number> = {
  instagram: 18500,
  tiktok: 35200,
  twitter: 42100,
  youtube: 28900,
};

const SOCIALS: Omit<Social, 'followers'>[] = [
  {
    name: 'Instagram',
    username: '@tmnaa',
    url: 'https://instagram.com/tmnaa',
    color: '#E4405F',
    bgGlow: 'from-pink-500/20 to-purple-600/10',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    name: 'TikTok',
    username: '@tmnaa',
    url: 'https://tiktok.com/@tmnaa',
    color: '#25F4EE',
    bgGlow: 'from-cyan-500/20 to-slate-900/10',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      </svg>
    ),
  },
  {
    name: 'X (Twitter)',
    username: '@tmnaa',
    url: 'https://x.com/tmnaa',
    color: '#FFFFFF',
    bgGlow: 'from-white/20 to-gray-800/10',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    name: 'YouTube',
    username: 'TMNAA',
    url: 'https://youtube.com/@tmnaa',
    color: '#FF0000',
    bgGlow: 'from-red-500/20 to-orange-600/10',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
];

function SocialCard({ social, delay }: { social: Social; delay: number }) {
  return (
    <motion.a
      href={social.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ y: 30, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease: easeOut }}
      className="group relative overflow-hidden rounded-2xl md:rounded-3xl p-5 md:p-7 transition-all duration-500 hover:-translate-y-2"
      style={{
        background: `linear-gradient(160deg, rgba(18,12,10,0.95), rgba(10,8,7,0.9))`,
        border: `1px solid rgba(255,255,255,0.06)`,
      }}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${social.bgGlow} opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`} />
      <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-0 group-hover:opacity-20 transition-all duration-700 pointer-events-none blur-3xl"
        style={{ background: social.color }} />

      <div className="relative z-10 flex items-start gap-4">
        <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
          style={{ color: social.color, background: `rgba(255,255,255,0.04)`, border: `1px solid rgba(255,255,255,0.06)` }}>
          {social.icon}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-base md:text-lg font-black text-white tracking-tight mb-0.5">{social.name}</h3>
          <p className="text-[11px] md:text-xs font-medium text-white/30 truncate">{social.username}</p>
          <p className="text-lg md:text-xl font-black mt-2 tracking-tight" style={{ color: social.color }}>
            {formatNum(social.followers)}
            <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider ml-1 opacity-60">Followers</span>
          </p>
        </div>
        <div className="shrink-0 self-center transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1">
          <svg className="w-5 h-5 text-white/20 group-hover:text-white/60 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
          </svg>
        </div>
      </div>
    </motion.a>
  );
}

export function SocialCardsSection() {
  const [followers, setFollowers] = useState<Record<string, number>>(DEFAULT_FOLLOWERS);

  useEffect(() => {
    const fetchKickFollowers = async () => {
      try {
        const raw = await kickFetch(`https://kick.com/api/v2/channels/tmnaa`);
        const data = raw?.data || raw;
        if (data?.followers_count) {
          setFollowers((prev) => ({ ...prev, kick: data.followers_count }));
        }
      } catch {}
    };
    fetchKickFollowers();
  }, []);

  const allSocials = SOCIALS.map((s) => ({
    ...s,
    followers: followers[s.name.toLowerCase()] || DEFAULT_FOLLOWERS[s.name.toLowerCase()] || 0,
  }));

  return (
    <div className="py-16 md:py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.7, ease: easeOut }}
          className="flex flex-col items-center gap-3 mb-12 text-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#111] border border-white/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-[#D4A84A]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" /></svg>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">Follow TMNAA</h2>
          </div>
          <p className="text-sm text-white/40 font-medium">Join the community across all platforms</p>
          <div className="h-px w-20 bg-gradient-to-r from-transparent via-[#D4A84A]/40 to-transparent" />
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {allSocials.map((social, i) => (
            <SocialCard key={social.name} social={social} delay={i * 0.08} />
          ))}
        </div>
      </div>
    </div>
  );
}
