import express from "express";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const WEBSITE_CONTEXT = `
Eres el asistente virtual del sitio web del Lic. Ramón Romero.
Información del Sitio Web:
- Perfil: CPA (Contador Público Autorizado), Auditor y experto en Bienes Raíces.
- Ubicación: Palomo de Orosi, Paraíso de Cartago.
- Contacto: Teléfono/WhatsApp 8382-1069, Email ramonromerocpa@yahoo.es.
- Servicios Ofrecidos:
  1. Contabilidad: Gestión integral de registros para personas y empresas.
  2. Auditoría: Examen de estados financieros para transparencia.
  3. Asesoría Financiera: Consultoría estratégica.
  4. Peritazgos Judiciales: Dictámenes contables para procesos legales.
  5. Bienes Raíces: Compra, venta y administración de propiedades.
  6. Facturación Electrónica: Implementación de sistemas.
  7. Finanzas Personales: Planificación de ahorro e inversión.
  8. Certificaciones: Constancias de ingresos (CPA) para bancos.
  9. Diseño Publicitario: Identidad visual.
- El formulario de contacto en la web envía los datos directamente a WhatsApp.

Instrucciones de comportamiento:
- Responde de manera natural, amable y profesional.
- Tus respuestas deben ser CORTAS y concisas (máximo 2-3 oraciones si es posible).
- Si te preguntan por precios, invita a contactar directamente para una cotización personalizada.
- Si te preguntan por ubicación, menciona Palomo de Orosi.
- El objetivo es ayudar al usuario y guiarlo a contactar al Licenciado.
`;

// Initialize Gemini API
// NOTE: In production, use process.env.GEMINI_API_KEY. 
// The fallback key is provided for this specific preview environment as requested.
const apiKey = process.env.GEMINI_API_KEY || "AIzaSyCiSqwpQxdBmkU-dAzk019bpvrO7VrPpAI";
const ai = new GoogleGenAI({ apiKey });

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware to parse JSON bodies
  app.use(express.json());

  // API Route for Chat
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages } = req.body;
      
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Invalid messages format" });
      }

      // Transform messages for Gemini
      // Skip the first message if it's the greeting from the bot (which is usually the first one)
      // and ensure we only send the last 10 messages for context
      const chatHistory = messages
        .filter((msg: any) => msg.text) // Filter out empty messages
        .slice(1) // Skip initial greeting
        .slice(-10) // Keep last 10
        .map((msg: any) => ({
          role: msg.isUser ? "user" : "model",
          parts: [{ text: msg.text }]
        }));

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: chatHistory,
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
      res.status(500).json({ error: "Internal Server Error" });
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
