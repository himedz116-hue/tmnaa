import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMagnifyingGlass, FaBell, FaBars, FaXmark } from 'react-icons/fa6';
const logoImg = '/assets/IMG_3093_1785158973333.WEBP';

const navLinks = [
  { href: '#home', label: 'HOME' },
  { href: '#support', label: 'SUPPORT' },
  { href: '#stats', label: 'STATS' },
];

export function Header() {
  const [activeSection, setActiveSection] = useState('home');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );

    navLinks.forEach(({ href }) => {
      const el = document.querySelector(href);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const NavLink = ({ href, label, layoutId }: { href: string; label: string; layoutId: string }) => {
    const isActive = activeSection === href.replace('#', '');
    return (
      <a
        href={href}
        className="relative px-6 py-2 text-[13px] font-bold tracking-[0.08em] transition-all duration-400 group/nav"
        style={{
          color: isActive ? '#D9A441' : 'rgba(247, 243, 238, 0.7)',
          fontFamily: 'Tajawal, sans-serif',
          letterSpacing: '0.08em',
        }}
      >
        <span className="relative z-10 group-hover/nav:text-[#D9A441] transition-colors duration-300">
          {label}
        </span>
        {isActive && (
          <motion.div
            layoutId={layoutId}
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-[2.5px] rounded-full"
            style={{
              width: '36px',
              background: 'linear-gradient(90deg, transparent, #D9A441, #FF7A18, #D9A441, transparent)',
              boxShadow: '0 0 10px rgba(217, 164, 65, 0.5)',
            }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          />
        )}
        <span className="absolute inset-0 rounded-xl opacity-0 group-hover/nav:opacity-100 transition-opacity duration-300"
          style={{ background: 'linear-gradient(135deg, rgba(217, 164, 65, 0.04), rgba(255, 122, 24, 0.02))' }}
        />
      </a>
    );
  };

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-[100] px-[2.5%] pt-3"
      >
        <nav
          className={`glass-nav ${scrolled ? 'scrolled' : ''} rounded-[40px] mx-auto h-[72px] flex items-center justify-between px-[30px] relative`}
        >
          {/* Section 1: LIVE NOW */}
          <div className="hidden lg:flex items-center gap-3.5 min-w-[220px]">
            <div className="relative flex-shrink-0">
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  background: 'radial-gradient(circle, #FF7A18, #D94A2B)',
                  boxShadow: '0 0 8px rgba(255, 122, 24, 0.8), 0 0 20px rgba(255, 122, 24, 0.4)',
                  animation: 'live-pulse 2s ease-in-out infinite',
                }}
              />
            </div>
            <div className="flex flex-col">
              <span
                className="font-bold text-[13px] tracking-[0.12em] leading-tight"
                style={{
                  fontFamily: 'Cairo, sans-serif',
                  background: 'linear-gradient(135deg, #FF7A18, #FF9A44)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                LIVE NOW
              </span>
              <span
                className="text-[11px] leading-tight truncate max-w-[160px]"
                style={{ color: 'rgba(247, 243, 238, 0.4)' }}
              >
                Streaming Warzone...
              </span>
            </div>
          </div>

          {/* Left Menu */}
          <div className="hidden lg:flex items-center gap-0.5">
            {navLinks.slice(0, 2).map(({ href, label }) => (
              <NavLink key={href} href={href} label={label} layoutId="navActiveLine" />
            ))}
          </div>

          {/* Section 2: Logo Circle (Center) */}
          <div className="absolute left-1/2 -translate-x-1/2 lg:-bottom-[18px] z-[110]">
            <motion.div whileHover={{ scale: 1.06 }} className="relative">
              {/* Outer glow ring */}
              <div
                className="absolute -inset-3 rounded-full pointer-events-none"
                style={{
                  background: 'conic-gradient(from 0deg, transparent, rgba(217, 164, 65, 0.2), transparent, rgba(255, 122, 24, 0.15), transparent)',
                  filter: 'blur(6px)',
                  animation: 'border-glow-rotate 10s linear infinite',
                }}
              />
              <div
                className="w-[92px] h-[92px] rounded-full overflow-hidden flex items-center justify-center relative"
                style={{
                  background: 'radial-gradient(circle, rgba(255, 122, 24, 0.25) 0%, rgba(18, 12, 10, 0.95) 60%)',
                  border: '2px solid rgba(217, 164, 65, 0.6)',
                  boxShadow: `
                    0 0 25px rgba(255, 122, 24, 0.25),
                    0 0 50px rgba(217, 164, 65, 0.12),
                    0 8px 32px rgba(0, 0, 0, 0.5),
                    inset 0 0 20px rgba(255, 122, 24, 0.08),
                    inset 0 2px 4px rgba(217, 164, 65, 0.1)
                  `,
                }}
              >
                <img
                  src={logoImg}
                  alt="TMNAA"
                  className="w-[72px] h-[72px] object-cover rounded-full"
                  style={{
                    filter: 'drop-shadow(0 0 10px rgba(255, 122, 24, 0.3))',
                  }}
                />
              </div>
            </motion.div>
          </div>

          {/* Right Menu */}
          <div className="hidden lg:flex items-center gap-0.5">
            {navLinks.slice(2).map(({ href, label }) => (
              <NavLink key={href} href={href} label={label} layoutId="navActiveLine2" />
            ))}
          </div>

          {/* Section 4: Search + Bell + Profile */}
          <div className="hidden lg:flex items-center gap-3 min-w-[220px] justify-end">
            {/* Search Box */}
            <div
              className="flex items-center gap-2.5 px-4 h-[42px] rounded-[25px] transition-all duration-400 group/search cursor-text"
              style={{
                width: '180px',
                background: 'rgba(26, 18, 13, 0.6)',
                border: '1px solid rgba(217, 164, 65, 0.12)',
                boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.2), inset 0 -1px 0 rgba(217, 164, 65, 0.04)',
              }}
            >
              <FaMagnifyingGlass size={12} className="text-[#D9A441]/40 group-focus-within/search:text-[#D9A441]/80 transition-colors flex-shrink-0" />
              <span className="text-[rgba(247,243,238,0.25)] text-[13px] group-focus-within/search:hidden">Search...</span>
              <input
                type="text"
                className="bg-transparent text-[#F7F3EE] text-[13px] outline-none w-full hidden group-focus-within/search:block placeholder:text-[rgba(247,243,238,0.2)]"
                placeholder="Search..."
              />
            </div>

            {/* Bell Icon */}
            <div className="relative cursor-pointer group/bell">
              <div
                className="w-[42px] h-[42px] rounded-full flex items-center justify-center transition-all duration-300 group-hover/bell:bg-[rgba(217,164,65,0.06)]"
                style={{
                  border: '1px solid rgba(217, 164, 65, 0.1)',
                  boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.15)',
                }}
              >
                <FaBell size={15} className="text-[rgba(247,243,238,0.45)] group-hover/bell:text-[#D9A441] transition-colors duration-300" />
              </div>
              <div
                className="absolute -top-0.5 -right-0.5 w-[18px] h-[18px] rounded-full flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #D94A2B, #FF4A1C)',
                  boxShadow: '0 0 8px rgba(217, 74, 43, 0.6)',
                }}
              >
                <span className="text-[8px] text-white font-bold">3</span>
              </div>
            </div>

            {/* Profile */}
            <div className="flex items-center gap-2.5 cursor-pointer group/profile">
              <div
                className="w-[42px] h-[42px] rounded-full overflow-hidden flex-shrink-0 transition-all duration-400 group-hover/profile:shadow-[0_0_20px_rgba(255,122,24,0.25)]"
                style={{
                  border: '1.5px solid rgba(217, 164, 65, 0.35)',
                }}
              >
                <img
                  src={logoImg}
                  alt="TMNAA"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span
                  className="text-[13px] font-bold leading-tight"
                  style={{ fontFamily: 'Cairo, sans-serif', color: '#F7F3EE' }}
                >
                  TMNAA
                </span>
                <span className="text-[10px] font-bold leading-tight" style={{ color: '#4ADE80' }}>
                  ● Online
                </span>
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
            style={{
              color: 'rgba(247, 243, 238, 0.6)',
              border: '1px solid rgba(217, 164, 65, 0.15)',
            }}
          >
            {mobileOpen ? <FaXmark size={16} /> : <FaBars size={16} />}
          </button>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-[80px] left-[2.5%] right-[2.5%] z-[99] lg:hidden"
          >
            <div
              className="rounded-[24px] overflow-hidden"
              style={{
                background: 'rgba(18, 12, 10, 0.95)',
                backdropFilter: 'blur(35px)',
                WebkitBackdropFilter: 'blur(35px)',
                border: '1.5px solid rgba(217, 164, 65, 0.15)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.7), 0 0 40px rgba(255, 122, 24, 0.06), inset 0 1px 0 rgba(217, 164, 65, 0.06)',
              }}
            >
              <div className="p-5 flex flex-col gap-1">
                {/* Live Status */}
                <div className="flex items-center gap-3 px-4 py-3 mb-2">
                  <div className="w-2.5 h-2.5 rounded-full animate-pulse"
                    style={{ background: 'radial-gradient(circle, #FF7A18, #D94A2B)', boxShadow: '0 0 8px rgba(255, 122, 24, 0.8)' }}
                  />
                  <div className="flex flex-col">
                    <span className="font-bold text-xs tracking-[0.12em]"
                      style={{ fontFamily: 'Cairo, sans-serif', color: '#FF7A18' }}
                    >LIVE NOW</span>
                    <span className="text-[10px]" style={{ color: 'rgba(247, 243, 238, 0.35)' }}>Streaming Warzone...</span>
                  </div>
                </div>
                <div className="h-px mx-3" style={{ background: 'linear-gradient(90deg, transparent, rgba(217, 164, 65, 0.1), transparent)' }} />

                {navLinks.map(({ href, label }, i) => {
                  const isActive = activeSection === href.replace('#', '');
                  return (
                    <motion.a
                      key={href}
                      href={href}
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      onClick={() => setMobileOpen(false)}
                      className="px-4 py-3.5 rounded-xl text-sm font-bold tracking-wider transition-all"
                      style={{
                        color: isActive ? '#D9A441' : 'rgba(247, 243, 238, 0.7)',
                        background: isActive ? 'rgba(217, 164, 65, 0.06)' : 'transparent',
                        fontFamily: 'Tajawal, sans-serif',
                      }}
                    >
                      {label}
                    </motion.a>
                  );
                })}

                <div className="h-px mx-3 mt-2" style={{ background: 'linear-gradient(90deg, transparent, rgba(217, 164, 65, 0.1), transparent)' }} />

                {/* Profile in mobile */}
                <div className="flex items-center gap-3 px-4 py-3 mt-2">
                  <div
                    className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0"
                    style={{ border: '1.5px solid rgba(217, 164, 65, 0.3)' }}
                  >
                    <img src={logoImg} alt="TMNAA" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold" style={{ fontFamily: 'Cairo, sans-serif', color: '#F7F3EE' }}>TMNAA</span>
                    <span className="text-[10px] font-bold" style={{ color: '#4ADE80' }}>● Online</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
