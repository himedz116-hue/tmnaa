import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { HeroSection } from '@/components/sections/HeroSection';
import { SocialSection } from '@/components/sections/SocialSection';
import { LiveStatusSection } from '@/components/sections/LiveStatusSection';
import { SupportSection } from '@/components/sections/SupportSection';
import { CommunitySection } from '@/components/sections/CommunitySection';
import { AboutSection } from '@/components/sections/AboutSection';
import { ScheduleSection } from '@/components/sections/ScheduleSection';
import { GallerySection } from '@/components/sections/GallerySection';
import { useEffect, useState } from 'react';

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden">
      {/* Mouse Follow Light Effect */}
      <div
        className="fixed pointer-events-none z-50 transition-opacity duration-300"
        style={{
          left: mousePosition.x,
          top: mousePosition.y,
          width: '600px',
          height: '600px',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, rgba(255, 217, 138, 0.08) 0%, transparent 70%)',
          mixBlendMode: 'screen',
        }}
      />

      <Header />

      <main>
        <HeroSection />
        <SocialSection />
        <LiveStatusSection />
        <SupportSection />
        <CommunitySection />
        <AboutSection />
        <ScheduleSection />
        <GallerySection />
      </main>

      <Footer />
    </div>
  );
}
