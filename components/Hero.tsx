import React from 'react';
import { ArrowRight } from 'lucide-react';

export const Hero: React.FC = () => {
  
  const scrollToBooking = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const bookingSection = document.getElementById('booking');
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full h-screen bg-corp-950 text-white overflow-hidden flex flex-col justify-center">
      
      {/* Background - Pure Dark, no overlays interfering with the image brightness */}
      <div className="absolute inset-0 bg-corp-950 z-0"></div>

      {/* Subtle Ambient Light behind text only (Left side) to give depth, keeping image area clean */}
      <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-corp-800/20 rounded-full blur-[120px] pointer-events-none z-0"></div>

      <div className="container mx-auto px-6 lg:px-24 relative z-10 h-full">
        <div className="flex flex-col lg:flex-row h-full items-center">
          
          {/* TEXT COLUMN */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center pt-20 lg:pt-0 relative z-20">
            
            <div className="w-12 h-1 bg-accent-gold mb-8 shadow-[0_0_15px_rgba(197,179,136,0.3)]"></div>
            
            <h1 className="text-5xl lg:text-7xl font-sans font-bold leading-tight tracking-tight mb-6 text-white drop-shadow-2xl">
              Ramón Romero
            </h1>

            <p className="text-xl lg:text-2xl text-corp-300 font-light mb-10 max-w-lg leading-relaxed">
              CPA, Auditoría &<br/>
              <span className="text-white font-medium">Bienes Raíces.</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-6">
              <a 
                href="#booking" 
                onClick={scrollToBooking}
                className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-white border-b border-accent-gold pb-2 hover:text-accent-gold transition-colors w-fit hover:pl-2 duration-300 cursor-pointer"
              >
                Agendar Cita
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* IMAGE COLUMN - Professional Blending */}
          <div className="w-full lg:w-1/2 h-full relative flex items-end justify-center lg:justify-end pointer-events-none">
            
            {/* 
                THE SOLUTION: 
                Instead of placing a dark div ON TOP, we use mask-image.
                This makes the image itself turn transparent at the top and bottom.
            */}
            <img 
              src="https://i.imgur.com/qrc2Yk0.png" 
              alt="Lic. Ramón Romero" 
              className="relative z-10 max-h-[80vh] lg:max-h-[90vh] w-auto object-contain filter grayscale-[5%] contrast-[1.15]"
              style={{
                // Mask starts transparent (0%), becomes visible at 10%, stays visible until 85%, then fades out again.
                maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)'
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};