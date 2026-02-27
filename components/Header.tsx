import React, { useState, useEffect } from 'react';

export const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 ${
        scrolled 
          ? 'bg-white/90 backdrop-blur-lg py-4 border-b border-gray-100 text-corp-900 shadow-sm' 
          : 'bg-transparent py-8 text-white'
      }`}
    >
      <div className="container mx-auto px-6 lg:px-24 flex justify-between items-center">
        
        {/* Logo Text Only - Ultra Minimal */}
        <a 
          href="#" 
          onClick={scrollToTop}
          className="relative group z-50 cursor-pointer"
        >
          <div className="flex flex-col">
            <h1 className={`font-serif text-2xl tracking-tight font-bold leading-none ${scrolled ? 'text-corp-900' : 'text-white'}`}>
              ROMERO
              <span className="text-accent-gold">.</span>
            </h1>
            <span className={`text-[9px] uppercase tracking-[0.25em] mt-1 font-sans font-medium ${scrolled ? 'text-corp-500' : 'text-corp-300'}`}>
              Contador Público
            </span>
          </div>
        </a>

        {/* Right Side: Navigation & Seal Logo */}
        <div className="flex items-center gap-6 sm:gap-8">
          
          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-12">
            <a 
              href="#services" 
              onClick={(e) => scrollToSection(e, 'services')}
              className={`text-[11px] font-bold uppercase tracking-[0.15em] hover:text-accent-gold transition-colors cursor-pointer ${
                scrolled ? 'text-corp-500' : 'text-corp-300'
              }`}
            >
              Servicios
            </a>
            <a 
              href="#booking" 
              onClick={(e) => scrollToSection(e, 'booking')}
              className={`px-6 py-2.5 text-[11px] font-bold uppercase tracking-[0.15em] border transition-all duration-300 cursor-pointer ${
                scrolled 
                  ? 'border-corp-900 text-corp-900 hover:bg-corp-900 hover:text-white' 
                  : 'border-white/30 text-white hover:bg-white hover:text-corp-900 hover:border-white'
              }`}
            >
              Contacto
            </a>
          </nav>

          {/* Corner Logo (Seal) */}
          <img 
            src="https://i.imgur.com/Y5GoLoF.png" 
            alt="Sello CPA" 
            className="h-12 w-auto object-contain drop-shadow-md"
          />
        </div>
      </div>
    </header>
  );
};