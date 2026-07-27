import { useState } from 'react';
import { Link } from 'wouter';
import { Menu, X, Search, Bell } from 'lucide-react';
import logoImg from '@assets/IMG_3093_1785158973333.WEBP';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '#home', label: 'الرئيسية' },
    { href: '#about', label: 'من أنا' },
    { href: '#gallery', label: 'المعرض' },
    { href: '#live', label: 'البث المباشر' },
    { href: '#schedule', label: 'الجدول' },
    { href: '#community', label: 'المجتمع' },
    { href: '#support', label: 'الدعم' },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 h-[90px]">
        <div
          className="absolute inset-0 bg-[rgba(5,5,5,0.7)] border-b border-[rgba(207,163,71,0.3)]"
          style={{ backdropFilter: 'blur(20px)' }}
        />
        <div className="relative h-full max-w-[1920px] mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <img
              src={logoImg}
              alt="TMNAA"
              className="h-16 w-auto cursor-pointer transition-transform hover:scale-110"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[#D7D7D7] hover:text-[#FFD98A] transition-colors text-lg font-medium relative group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#FFD98A] to-[#CFA347] group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </nav>

          {/* Right Icons */}
          <div className="hidden lg:flex items-center gap-6">
            <button className="text-[#D7D7D7] hover:text-[#FFD98A] transition-colors">
              <Search size={24} />
            </button>
            <button className="text-[#D7D7D7] hover:text-[#FFD98A] transition-colors">
              <Bell size={24} />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-[#FFD98A] hover:text-[#F2C66D] transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden bg-[rgba(5,5,5,0.95)] pt-[90px]"
          style={{ backdropFilter: 'blur(20px)' }}
        >
          <nav className="flex flex-col items-center gap-6 p-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[#D7D7D7] hover:text-[#FFD98A] transition-colors text-2xl font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
