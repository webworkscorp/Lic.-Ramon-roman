import React from 'react';
import { ShieldCheck, FileSpreadsheet, Scale, Building, Receipt, Wallet, BadgeCheck, PenTool, Briefcase, ArrowUpRight } from 'lucide-react';
import { Service } from '../types.ts';

const servicesData: Service[] = [
  {
    id: 1,
    title: "Contabilidad",
    description: "Gestión integral de registros contables para personas y empresas.",
    icon: <FileSpreadsheet />
  },
  {
    id: 2,
    title: "Auditoría",
    description: "Examen crítico de estados financieros para garantizar transparencia.",
    icon: <ShieldCheck />
  },
  {
    id: 3,
    title: "Asesoría Financiera",
    description: "Consultoría estratégica para optimizar recursos y crecimiento.",
    icon: <Briefcase />
  },
  {
    id: 4,
    title: "Peritazgos Judiciales",
    description: "Dictámenes periciales contables para procesos legales.",
    icon: <Scale />
  },
  {
    id: 5,
    title: "Bienes Raíces",
    description: "Asesoría profesional en compra, venta y administración de propiedades.",
    icon: <Building />
  },
  {
    id: 6,
    title: "Facturación Electrónica",
    description: "Implementación de sistemas de facturación conforme a normativa.",
    icon: <Receipt />
  },
  {
    id: 7,
    title: "Finanzas Personales",
    description: "Planificación para alcanzar metas de ahorro e inversión.",
    icon: <Wallet />
  },
  {
    id: 8,
    title: "Certificaciones",
    description: "Emisión de constancias de ingresos (CPA) para trámites bancarios.",
    icon: <BadgeCheck />
  },
  {
    id: 9,
    title: "Diseño Publicitario",
    description: "Desarrollo de identidad visual y material para su empresa.",
    icon: <PenTool />
  }
];

export const Services: React.FC = () => {
  return (
    <section id="services" className="py-24 bg-white relative">
      <div className="container mx-auto px-6 lg:px-24">
        
        <div className="mb-16 border-b border-corp-100 pb-6">
            <h2 className="text-3xl lg:text-4xl font-sans font-bold text-corp-900 mb-2">
              Servicios Profesionales
            </h2>
            <p className="text-corp-500 font-light">
              Soluciones integrales para su empresa y patrimonio.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
          {servicesData.map((service) => (
            <div 
              key={service.id} 
              className="group flex flex-col items-start p-6 bg-corp-50/50 hover:bg-corp-50 transition-colors duration-300 rounded-sm"
            >
              <div className="mb-4 text-corp-800 group-hover:text-accent-gold transition-colors duration-300">
                  {React.cloneElement(service.icon as React.ReactElement, { strokeWidth: 1.5, className: "w-6 h-6" })}
              </div>
              
              <h3 className="text-base font-bold text-corp-900 mb-2">
                {service.title}
              </h3>
              
              <p className="text-corp-600 text-sm leading-relaxed mb-4">
                {service.description}
              </p>

              <div className="mt-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                 <ArrowUpRight className="w-4 h-4 text-corp-400" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};