import React from 'react';

export const Footer: React.FC = () => {

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-white text-corp-900 py-16 border-t border-corp-100">
      <div className="container mx-auto px-6 lg:px-24">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-serif text-2xl font-bold">Ramón Romero</span>
              <span className="w-1.5 h-1.5 bg-accent-gold rounded-full"></span>
            </div>
            <p className="text-xs uppercase tracking-widest text-corp-500">Licenciado & CPA</p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 md:gap-12 text-sm font-medium text-corp-600">
            <a 
              href="#services" 
              onClick={(e) => scrollToSection(e, 'services')}
              className="hover:text-corp-900 transition-colors cursor-pointer"
            >
              Servicios
            </a>
            <a 
              href="#booking" 
              onClick={(e) => scrollToSection(e, 'booking')}
              className="hover:text-corp-900 transition-colors cursor-pointer"
            >
              Contacto
            </a>
            <span className="text-corp-400">8382-1069</span>
            <span className="text-corp-400 hidden md:inline">|</span>
            <span className="text-corp-400">Palomo de Orosi, Cartago</span>
          </div>

        </div>
        
        <div className="mt-12 pt-8 border-t border-corp-100 flex flex-col md:flex-row justify-between items-center text-xs text-corp-400 font-light">
          <p>&copy; {new Date().getFullYear()} Lic. Ramón Romero. Todos los derechos reservados.</p>
          <p className="mt-2 md:mt-0">Servicios Profesionales CPA</p>
        </div>
      </div>
    </footer>
  );
};