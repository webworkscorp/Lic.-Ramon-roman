import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, MessageSquare } from 'lucide-react';

export const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([
    { text: "Hola, soy el asistente del Lic. Ramón Romero. ¿En qué puedo ayudarte hoy?", isUser: false }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [interactionCount, setInteractionCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const MAX_INTERACTIONS = 7;

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

    const currentCount = interactionCount + 1;
    setInteractionCount(currentCount);

    try {
      // Add a placeholder message for the bot
      setMessages(prev => [...prev, { text: "", isUser: false }]);

      // Llamamos al backend para procesar el chat. 
      // Esto es más seguro porque la API Key se queda en el servidor.
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userText,
          history: messages.slice(1).slice(-10) // Enviamos el historial (sin el saludo inicial)
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Error del servidor: ${response.status}`);
      }

      const text = await response.text();
      
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
