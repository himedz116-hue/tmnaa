import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { ForgedButton } from '@/components/ui/ForgedButton';
import { EmberCanvas } from '@/components/EmberCanvas';
import heroBgImg from '@assets/Create_design_for_phone_2K_202607270558_1785158973330.jpeg';
import logoGlowImg from '@assets/B2F8BEA4-C623-4DC4-B192-1161574A65A6_1785158979040.png';

export function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      id="home"
      ref={ref}
      className="relative h-screen w-full overflow-hidden"
    >
      {/* Background Image with Parallax */}
      <motion.div
        style={{ y }}
        className="absolute inset-0 w-full h-[120vh]"
      >
        <img
          src={heroBgImg}
          alt=""
          className="w-full h-full object-cover"
        />
        {/* Dark Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/20 to-black/60" />
      </motion.div>

      {/* Ember Particles */}
      <EmberCanvas />

      {/* Content */}
      <motion.div
        style={{ opacity }}
        className="relative z-20 h-full flex flex-col items-center justify-center px-6 text-center"
      >
        {/* Logo with Glow */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.2, type: 'spring' }}
          className="mb-12"
        >
          <img
            src={logoGlowImg}
            alt="TMNAA"
            className="w-[300px] h-auto pulse-glow"
          />
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6"
          style={{ fontFamily: 'Cairo, sans-serif' }}
        >
          اصنع المستحيل... واترك بصمتك.
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="text-xl md:text-2xl text-[#D7D7D7] max-w-3xl mb-12 leading-relaxed"
        >
          مرحبًا بك في عالم TMNAA، حيث يلتقي الإبداع مع الألعاب، والبث المباشر مع الاحتراف، لتجربة لا تُنسى.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="flex flex-col sm:flex-row gap-6"
        >
          <ForgedButton
            variant="fire"
            href="https://www.youtube.com/@tmnaa1"
          >
            شاهد البث المباشر 🔥
          </ForgedButton>
          <ForgedButton
            variant="metal"
            href="https://www.tiktok.com/@tmnaa0"
          >
            انضم للمجتمع 👑
          </ForgedButton>
        </motion.div>
      </motion.div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#050505] to-transparent z-10" />
    </section>
  );
}
