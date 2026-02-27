import express from "express";
import { createServer as createViteServer } from "vite";
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

// Fallback API Key provided by user if env var is missing
const FALLBACK_API_KEY = "AIzaSyCiSqwpQxdBmkU-dAzk019bpvrO7VrPpAI";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware to parse JSON bodies
  app.use(express.json());

  // API Route for Chat
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history } = req.body;
      
      const apiKey = process.env.GEMINI_API_KEY || FALLBACK_API_KEY;
      
      if (!apiKey) {
        throw new Error("API Key not configured");
      }

      const ai = new GoogleGenAI({ apiKey });
      
      // Parse history if it's a string (backward compatibility) or use as is
      let chatHistory = [];
      if (Array.isArray(history)) {
          chatHistory = history;
      } else if (typeof history === 'string') {
          // If history is just a string, we can't easily reconstruction the structured history
          // So we'll just ignore it or treat it as context. 
          // For simplicity in this migration, we'll start fresh if format doesn't match
          chatHistory = [];
      }

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          ...chatHistory,
          { role: "user", parts: [{ text: message }] }
        ],
        config: {
          systemInstruction: WEBSITE_CONTEXT,
        }
      });

      const responseText = response.text || "Lo siento, no pude generar una respuesta.";

      // Send response
      res.setHeader('Content-Type', 'text/plain');
      res.send(responseText);

    } catch (error: any) {
      console.error("Error in /api/chat:", error);
      res.status(500).send("Error al procesar la solicitud.");
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production static file serving
    app.use(express.static('dist'));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
