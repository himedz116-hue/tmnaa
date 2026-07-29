import { Header } from '@/components/Header';
import { StreamAndChatSection } from '@/components/sections/StreamAndChatSection';
import { StatsSection } from '@/components/sections/StatsSection';
import { SocialCardsSection } from '@/components/sections/SocialCardsSection';
import { SupportSection } from '@/components/sections/SupportSection';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#090807] text-white overflow-x-hidden">
      <Header />

      <main>
        <StreamAndChatSection />
        <StatsSection />
        <SocialCardsSection />
        <SupportSection />
      </main>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto flex flex-col items-center gap-4">
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase" style={{ color: 'rgba(247,243,238,0.25)' }}>
            &copy; 2026 TMNAA. All Rights Reserved.
          </p>
          <p className="text-[10px] tracking-[0.15em]" style={{ color: 'rgba(247,243,238,0.15)' }}>
            RISE WITH FIRE
          </p>
        </div>
      </footer>
    </div>
  );
}
