import React, { useState } from 'react';
import { ArrowRight, Mail, Phone, MapPin } from 'lucide-react';
import { FormData } from '../types.ts';

export const Booking: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    reason: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.reason) return;
    
    const message = `Hola Lic. Ramón Romero, deseo realizar una consulta.%0A%0A*Nombre:* ${formData.name}%0A*Consulta:* ${formData.reason}`;
    const whatsappUrl = `https://wa.me/50683821069?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <section id="booking" className="py-32 bg-corp-900 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-corp-800 skew-x-12 translate-x-32 opacity-50 z-0"></div>
      
      <div className="container mx-auto px-6 lg:px-24 relative z-10">
        <div className="flex flex-col lg:flex-row gap-20 items-stretch">
          
          <div className="w-full lg:w-5/12 flex flex-col justify-center">
            <span className="text-accent-gold font-bold tracking-[0.2em] text-xs uppercase mb-6 block">Contacto Directo</span>
            <h2 className="text-4xl lg:text-5xl font-serif mb-8 leading-tight">
              ¿En qué puedo <br />
              <span className="text-corp-400 italic">servirle?</span>
            </h2>
            <p className="text-corp-300 text-lg font-light leading-relaxed mb-12">
              Lic. Ramón Romero. Atención profesional y personalizada. Complete el formulario para iniciar una conversación directa.
            </p>
            
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="mt-1 p-2 bg-white/5 rounded-full">
                    <Mail className="w-5 h-5 text-accent-gold" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs uppercase tracking-widest text-corp-500 mb-1">Correo Electrónico</span>
                  <a href="mailto:ramonromerocpa@yahoo.es" className="text-lg font-serif text-white hover:text-accent-gold transition-colors">
                    ramonromerocpa@yahoo.es
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                 <div className="mt-1 p-2 bg-white/5 rounded-full">
                    <Phone className="w-5 h-5 text-accent-gold" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs uppercase tracking-widest text-corp-500 mb-1">Teléfono Directo</span>
                  <a href="https://wa.me/50683821069" className="text-lg font-serif text-white hover:text-accent-gold transition-colors">
                    8382-1069
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                 <div className="mt-1 p-2 bg-white/5 rounded-full">
                    <MapPin className="w-5 h-5 text-accent-gold" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs uppercase tracking-widest text-corp-500 mb-1">Ubicación</span>
                  <a 
                    href="https://www.google.com/maps/search/?api=1&query=Palomo+de+Orosi,+Paraíso+de+Cartago" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-lg font-serif text-white hover:text-accent-gold transition-colors"
                  >
                    Palomo de Orosi, Paraíso de Cartago
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-7/12 bg-white text-corp-900 p-8 lg:p-16 shadow-2xl rounded-sm">
            <form onSubmit={handleSubmit} className="h-full flex flex-col justify-center">
              <h3 className="text-2xl font-serif mb-10">Enviar Consulta</h3>
              
              <div className="group relative z-0 w-full mb-10">
                <input
                  type="text"
                  id="name"
                  required
                  className="block py-4 px-0 w-full text-lg text-corp-900 bg-transparent border-0 border-b border-corp-300 appearance-none focus:outline-none focus:ring-0 focus:border-corp-900 peer"
                  placeholder=" "
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
                <label htmlFor="name" className="peer-focus:font-medium absolute text-sm text-corp-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-corp-900 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                  Su Nombre
                </label>
              </div>

              <div className="group relative z-0 w-full mb-12">
                <textarea
                  id="reason"
                  required
                  rows={2}
                  className="block py-4 px-0 w-full text-lg text-corp-900 bg-transparent border-0 border-b border-corp-300 appearance-none focus:outline-none focus:ring-0 focus:border-corp-900 peer resize-none"
                  placeholder=" "
                  value={formData.reason}
                  onChange={(e) => setFormData({...formData, reason: e.target.value})}
                ></textarea>
                <label htmlFor="reason" className="peer-focus:font-medium absolute text-sm text-corp-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-corp-900 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                  Detalle de su consulta
                </label>
              </div>

              <button 
                type="submit" 
                className="w-full bg-corp-900 text-white py-5 px-6 font-semibold uppercase tracking-widest text-xs hover:bg-corp-800 transition-all duration-300 flex items-center justify-between group shadow-lg hover:shadow-xl"
              >
                Enviar Consulta
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
};