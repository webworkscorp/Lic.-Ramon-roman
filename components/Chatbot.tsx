import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, MessageSquare } from 'lucide-react';

const KNOWLEDGE_BASE = {
  profile: {
    name: "Lic. Ramón Romero",
    titles: ["Contador Público Autorizado (CPA)", "Auditor", "Experto en Bienes Raíces"],
    focus: "Atención profesional y personalizada. Soluciones integrales para empresas y patrimonio."
  },
  location: {
    address: "Palomo de Orosi, Paraíso de Cartago, Costa Rica",
    short: "Palomo de Orosi, Paraíso de Cartago"
  },
  contact: {
    phone: "8382-1069",
    whatsapp: "+506 8382-1069",
    email: "ramonromerocpa@yahoo.es",
    method: "El formulario de la web envía los datos directamente a WhatsApp para una atención inmediata."
  },
  services: [
    { id: "contabilidad", name: "Contabilidad", desc: "Gestión integral de registros contables para personas físicas y jurídicas.", keywords: ["contabilidad", "contable", "libros", "impuestos", "tributario", "hacienda", "declaracion", "iva", "renta", "contavilidad", "conta", "tributacion"] },
    { id: "auditoria", name: "Auditoría", desc: "Examen crítico de estados financieros para garantizar transparencia y cumplimiento.", keywords: ["auditoria", "auditar", "revisar estados", "financieros", "revision", "control", "auditoria", "auditor"] },
    { id: "asesoria", name: "Asesoría Financiera", desc: "Consultoría estratégica para optimizar recursos y crecimiento empresarial.", keywords: ["asesoria", "consultoria", "estrategia", "empresa", "negocio", "invertir", "crecer", "finanzas", "asesoramiento"] },
    { id: "peritazgos", name: "Peritazgos Judiciales", desc: "Dictámenes periciales contables para procesos legales y litigios.", keywords: ["peritazgo", "judicial", "legal", "juicio", "dictamen", "perito", "demanda", "tribunal", "peritaje"] },
    { id: "bienes_raices", name: "Bienes Raíces", desc: "Asesoría profesional en compra, venta y administración de propiedades (especialmente en Cartago y alrededores).", keywords: ["bienes raices", "casa", "lote", "propiedad", "venta", "compra", "alquiler", "cartago", "terreno", "finca", "apartamento", "vienes", "raices"] },
    { id: "facturacion", name: "Facturación Electrónica", desc: "Implementación de sistemas de facturación conforme a la normativa tributaria vigente.", keywords: ["factura", "electronica", "hacienda", "tributacion", "sistema", "digital", "facturacion"] },
    { id: "finanzas", name: "Finanzas Personales", desc: "Planificación estratégica para alcanzar metas de ahorro e inversión personal.", keywords: ["finanzas", "ahorro", "inversion", "personal", "dinero", "presupuesto", "gastos"] },
    { id: "certificaciones", name: "Certificaciones (CPA)", desc: "Emisión de constancias de ingresos y flujos de caja para trámites bancarios o crediticios.", keywords: ["certificacion", "ingresos", "cpa", "banco", "prestamo", "flujo", "constancia", "credito", "certificasion"] },
    { id: "diseno", name: "Diseño Publicitario", desc: "Desarrollo de identidad visual y material gráfico para empresas.", keywords: ["diseno", "publicidad", "logo", "marca", "grafico", "imagen", "identidad", "diseño"] }
  ],
  general: {
    prices: "Los honorarios profesionales se calculan según la complejidad del caso. Para darle un monto exacto, lo ideal es que el Licenciado analice su situación particular.",
    citas: "Para coordinar una reunión, puede completar el formulario de contacto o escribirnos directamente al WhatsApp 8382-1069."
  }
};

// Motor de Razonamiento Local (Sin API)
const getIntelligentResponse = (input: string, interactionCount: number): string => {
  const text = input.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
  // Detección de entidades con tolerancia a errores de escritura
  const entities = {
    servicio: KNOWLEDGE_BASE.services.find(s => s.keywords.some(k => text.includes(k) || k.includes(text) && text.length > 3)),
    ubicacion: text.match(/(donde|oficina|cartago|orosi|paraiso|direccion|lugar|ubicasion|don de)/),
    contacto: text.match(/(whatsapp|telefono|llamar|escribir|contacto|cita|reunion|contato|watsap|wasap)/),
    precio: text.match(/(cuanto|precio|costo|honorarios|pago|vale|tarifa|presupuesto|balor|valor)/),
    persona: text.match(/(quien|ramon|romero|profesional|contador|cpa|auditor|quien es)/),
    saludo: text.match(/(hola|buenos dias|buenas tardes|buenas noches|saludos|que tal)/)
  };

  // Lógica de Ayuda (Máximo 3 interacciones)
  if (interactionCount === 1) {
    if (entities.saludo) return "¡Hola! Es un gusto saludarle. Soy el asistente del Lic. Ramón Romero. ¿En qué área profesional (contabilidad, auditoría o bienes raíces) necesita una solución hoy?";
    if (entities.servicio) return `Excelente elección. El servicio de **${entities.servicio.name}** es una de nuestras especialidades. ${entities.servicio.desc} ¿Desea que analicemos cómo este servicio puede beneficiar su situación actual?`;
    if (entities.ubicacion) return `Nuestra oficina principal se encuentra en **${KNOWLEDGE_BASE.location.short}**, un lugar estratégico para atenderle. Atendemos a clientes de todo el país. ¿Le gustaría saber más sobre nuestros servicios contables o de bienes raíces?`;
    return "Entiendo su interés. El Lic. Ramón Romero ofrece soluciones integrales en contabilidad, auditoría y bienes raíces con un enfoque profesional. ¿Cuál de estas áreas es de su interés inmediato?";
  }

  if (interactionCount === 2) {
    if (entities.servicio) return `Para el área de **${entities.servicio.name}**, el Licenciado aplica un análisis profundo para garantizar su tranquilidad. Es fundamental tener un respaldo profesional en estos temas. ¿Le gustaría que le explique el proceso para iniciar una asesoría formal?`;
    if (entities.precio) return `Respecto a los honorarios, ${KNOWLEDGE_BASE.general.prices} Lo más importante es asegurar que su inversión se traduzca en resultados tangibles y cumplimiento legal. ¿Desea que coordinemos una revisión de su caso?`;
    if (entities.contacto) return `La comunicación directa es clave. Puede contactarnos al WhatsApp **8382-1069** para una respuesta inmediata. Estamos listos para resolver sus dudas técnicas. ¿Hay algo más específico que desee consultar antes de agendar?`;
    return "Su consulta es muy importante. El Lic. Ramón Romero se destaca por su atención personalizada y resultados garantizados. Estamos aquí para optimizar sus recursos y patrimonio. ¿Desea conocer los requisitos para una asesoría?";
  }

  if (interactionCount === 3) {
    let finalMsg = "Ha sido un placer orientarle sobre los servicios profesionales del Lic. Ramón Romero. ";
    if (entities.servicio) finalMsg += `Para profundizar en su requerimiento de **${entities.servicio.name}**, lo ideal es una sesión privada. `;
    finalMsg += "Para brindarle la atención de alto nivel que su caso amerita, por favor complete el formulario a continuación para que el Licenciado se comunique con usted directamente. Su éxito financiero y legal es nuestra prioridad.";
    return finalMsg;
  }

  return "Para darle la mejor asesoría, por favor indíqueme si su consulta es sobre contabilidad, auditoría o bienes raíces.";
};

export const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([
    { text: "Hola, soy el asistente del Lic. Ramón Romero. ¿En qué puedo ayudarle profesionalmente hoy?", isUser: false }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [interactionCount, setInteractionCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const MAX_INTERACTIONS = 3;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleScrollToBooking = () => {
    const bookingSection = document.getElementById('booking');
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim() || isFinished) return;

    const userText = inputValue.trim();
    setInputValue("");
    setMessages(prev => [...prev, { text: userText, isUser: true }]);
    setIsLoading(true);

    const nextCount = interactionCount + 1;
    setInteractionCount(nextCount);

    // Simulación de razonamiento local inteligente
    setTimeout(() => {
      const responseText = getIntelligentResponse(userText, nextCount);
      setMessages(prev => [...prev, { text: responseText, isUser: false }]);
      setIsLoading(false);

      if (nextCount >= MAX_INTERACTIONS) {
        setIsFinished(true);
      }
    }, 1000);
  };




  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      {/* Chat Window */}
      <div 
        className={`mb-4 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden transition-all duration-300 ease-in-out origin-bottom-right ${
          isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-10 pointer-events-none absolute bottom-0 right-0'
        }`}
      >
        {/* Header */}
        <div className="bg-corp-900 p-4 flex justify-between items-center border-b border-corp-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-corp-800 rounded-full border border-corp-700">
              <Bot className="w-5 h-5 text-accent-gold" />
            </div>
            <div>
              <h3 className="text-white font-medium text-sm">Asistente Virtual</h3>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <p className="text-gray-400 text-xs">Sistema Inteligente</p>
              </div>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-corp-800 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Area */}
        <div className="h-96 overflow-y-auto p-4 bg-gray-50 flex flex-col gap-4">
          {messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed ${
                  msg.isUser 
                    ? 'bg-corp-900 text-white rounded-tr-none' 
                    : 'bg-white border border-gray-200 text-corp-700 rounded-tl-none shadow-sm'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 p-3.5 rounded-2xl rounded-tl-none shadow-sm flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-100">
          {!isFinished ? (
            <div className="flex gap-2 items-center bg-gray-50 border border-gray-200 rounded-full px-4 py-2 transition-all">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Escribe tu mensaje..."
                disabled={isLoading}
                className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-corp-800 placeholder-gray-400 disabled:opacity-50 outline-none"
              />
              <button 
                onClick={handleSend}
                disabled={!inputValue.trim() || isLoading}
                className={`p-2 rounded-full transition-all ${
                  inputValue.trim() && !isLoading
                    ? 'bg-accent-gold text-corp-900 hover:bg-accent-goldDim hover:scale-105' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <p className="text-center text-xs text-gray-500">
                Para brindarte una atención personalizada y completa, por favor continúa en nuestro formulario de contacto.
              </p>
              <button 
                onClick={handleScrollToBooking}
                className="w-full bg-corp-900 text-white py-3 rounded-xl font-medium text-sm hover:bg-corp-800 transition-colors flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              >
                <MessageSquare className="w-4 h-4" />
                Ir al Formulario de Contacto
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`group relative flex items-center justify-center w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-accent-gold/30 ${
          isOpen 
            ? 'bg-corp-800 text-white rotate-90' 
            : 'bg-corp-900 text-accent-gold'
        }`}
        aria-label="Abrir chat"
      >
        {isOpen ? (
          <X className="w-6 h-6 transition-transform duration-300" />
        ) : (
          <>
            <Bot className="w-7 h-7 transition-transform duration-300 group-hover:scale-110" />
            <span className="absolute top-0 right-0 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-gold opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-accent-gold"></span>
            </span>
          </>
        )}
      </button>
    </div>
  );
};
