import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, MessageSquare } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const WEBSITE_CONTEXT = `
Eres el asistente virtual oficial del sitio web del Lic. Ramón Romero.
Tu objetivo es brindar información precisa y guiar a los usuarios para que contacten al Licenciado.

INFORMACIÓN COMPLETA DEL SITIO WEB:

PERFIL PROFESIONAL:
- Nombre: Lic. Ramón Romero
- Títulos: Contador Público Autorizado (CPA), Auditor, Experto en Bienes Raíces.
- Enfoque: Atención profesional y personalizada. Soluciones integrales para empresas y patrimonio.

UBICACIÓN:
- Oficina: Palomo de Orosi, Paraíso de Cartago, Costa Rica.

CONTACTO DIRECTO:
- Teléfono / WhatsApp: 8382-1069 (+506 8382-1069)
- Correo Electrónico: ramonromerocpa@yahoo.es
- Método de contacto principal: El formulario de la web envía los datos directamente a WhatsApp para una atención inmediata.

SERVICIOS OFRECIDOS (Lista detallada):
1. Contabilidad: Gestión integral de registros contables para personas físicas y jurídicas.
2. Auditoría: Examen crítico de estados financieros para garantizar transparencia y cumplimiento.
3. Asesoría Financiera: Consultoría estratégica para optimizar recursos y crecimiento empresarial.
4. Peritazgos Judiciales: Dictámenes periciales contables para procesos legales y litigios.
5. Bienes Raíces: Asesoría profesional en compra, venta y administración de propiedades (especialmente en Cartago y alrededores).
6. Facturación Electrónica: Implementación de sistemas de facturación conforme a la normativa tributaria vigente.
7. Finanzas Personales: Planificación estratégica para alcanzar metas de ahorro e inversión personal.
8. Certificaciones (CPA): Emisión de constancias de ingresos y flujos de caja para trámites bancarios o crediticios.
9. Diseño Publicitario: Desarrollo de identidad visual y material gráfico para empresas.

INSTRUCCIONES DE COMPORTAMIENTO:
- Tono: Profesional, amable, servicial y directo.
- Longitud de respuesta: MANTÉN TUS RESPUESTAS CORTAS (máximo 2-3 oraciones). Ve al grano.
- Precios: No des precios específicos. Indica que los honorarios varían según el servicio y sugiere contactar para una cotización personalizada.
- Citas: Para agendar citas, indica al usuario que use el formulario de contacto de la página o escriba al WhatsApp 8382-1069.
- Ubicación: Si preguntan "dónde están", responde con "Palomo de Orosi, Paraíso de Cartago".
- Si no sabes la respuesta: Sugiere contactar directamente al Licenciado por WhatsApp.
`;

export const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([
    { text: "Hola, soy el asistente del Lic. Ramón Romero. ¿En qué puedo ayudarte hoy?", isUser: false }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [interactionCount, setInteractionCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Clave proporcionada por el usuario para asegurar funcionamiento público
  const PUBLIC_FALLBACK_KEY = "AIzaSyCiSqwpQxdBmkU-dAzk019bpvrO7VrPpAI";
  
  // Prioridad 1: Variable de entorno de Vite (Vercel/Build)
  // Prioridad 2: Clave pública hardcodeada (como último recurso solicitado por el usuario)
  const [apiKey, setApiKey] = useState<string>(import.meta.env.VITE_GEMINI_API_KEY || PUBLIC_FALLBACK_KEY);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const MAX_INTERACTIONS = 7;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Si ya tenemos la API Key por variable de entorno, no necesitamos pedirla al backend
    if (apiKey) return;

    const fetchConfig = async () => {
      try {
        // Esto es principalmente para el entorno de desarrollo local con server.ts
        const response = await fetch('/api/config');
        if (response.ok) {
          const data = await response.json();
          if (data.geminiApiKey) {
            setApiKey(data.geminiApiKey);
          }
        }
      } catch (error) {
        // En Vercel (frontend estático), esta llamada fallará (404 o red), lo cual es esperado.
        // No hacemos nada, confiamos en que VITE_GEMINI_API_KEY esté configurada.
        console.log("Info: No se pudo obtener configuración del backend (esperado en Vercel).");
      }
    };
    fetchConfig();
  }, []);

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

    const currentCount = interactionCount + 1;
    setInteractionCount(currentCount);

    try {
      // Add a placeholder message for the bot
      setMessages(prev => [...prev, { text: "", isUser: false }]);

      // Prioridad 1: Variable de entorno de Vite (Vercel)
      // Prioridad 2: Estado apiKey (Backend local)
      const effectiveApiKey = import.meta.env.VITE_GEMINI_API_KEY || apiKey;
      
      if (!effectiveApiKey) {
        console.error("ERROR CRÍTICO: No se encontró la API Key de Gemini.");
        throw new Error("Error de configuración: No se pudo cargar la clave de acceso.");
      }

      const ai = new GoogleGenAI({ apiKey: effectiveApiKey });
      
      // Skip the first message (greeting) to ensure history starts with user
      const chatHistory = messages.slice(1).slice(-10).map(m => ({
        role: m.isUser ? "user" : "model",
        parts: [{ text: m.text }]
      }));

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          ...chatHistory,
          { role: "user", parts: [{ text: userText }] }
        ],
        config: {
          systemInstruction: WEBSITE_CONTEXT,
        }
      });

      const text = response.text || "Lo siento, no pude generar una respuesta.";
      
      setMessages(prev => {
        const newMessages = prev.map(msg => ({ ...msg }));
        const lastMessage = newMessages[newMessages.length - 1];
        if (lastMessage && !lastMessage.isUser) {
          lastMessage.text = text;
        }
        return newMessages;
      });

      if (currentCount >= MAX_INTERACTIONS) {
        setIsFinished(true);
      }

    } catch (error: any) {
      console.error("Error generating response:", error);
      const errorMessage = error.message || "Error desconocido";
      
      setMessages(prev => {
         const newMessages = [...prev];
         if (newMessages.length > 0 && !newMessages[newMessages.length - 1].isUser && newMessages[newMessages.length - 1].text === "") {
             newMessages[newMessages.length - 1].text = `Lo siento, hubo un problema de conexión. Por favor intenta de nuevo.`;
         } else {
             newMessages.push({ text: `Lo siento, hubo un problema de conexión. Por favor intenta de nuevo.`, isUser: false });
         }
         return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
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
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <p className="text-gray-400 text-xs">En línea</p>
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
