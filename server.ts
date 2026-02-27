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

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for Chat using Gemini
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        console.error("GEMINI_API_KEY not found in environment variables");
        return res.status(500).send("Error: API Key no configurada en el servidor.");
      }

      const ai = new GoogleGenAI({ apiKey });
      
      // Format history for Gemini
      const contents = (history || []).map((m: any) => ({
        role: m.isUser ? "user" : "model",
        parts: [{ text: m.text }]
      }));

      // Add current message
      contents.push({
        role: "user",
        parts: [{ text: message }]
      });

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: contents,
        config: {
          systemInstruction: WEBSITE_CONTEXT,
        }
      });

      const responseText = response.text || "Lo siento, no pude procesar tu solicitud.";
      
      res.setHeader('Content-Type', 'text/plain');
      res.send(responseText);

    } catch (error: any) {
      console.error("Error in /api/chat:", error);
      res.status(500).send("Lo siento, hubo un error al procesar tu mensaje.");
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
    app.use(express.static('dist'));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

if (process.env.NODE_ENV !== "production") {
  startServer();
}

export default async (req: any, res: any) => {
  const app = express();
  app.use(express.json());
  
  // Re-define routes for serverless context
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        return res.status(500).send("Error: API Key no configurada en el servidor.");
      }

      const ai = new GoogleGenAI({ apiKey });
      const contents = (history || []).map((m: any) => ({
        role: m.isUser ? "user" : "model",
        parts: [{ text: m.text }]
      }));
      contents.push({ role: "user", parts: [{ text: message }] });

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: contents,
        config: { systemInstruction: WEBSITE_CONTEXT }
      });

      res.setHeader('Content-Type', 'text/plain');
      res.send(response.text || "Lo siento, no pude procesar tu solicitud.");
    } catch (error: any) {
      res.status(500).send("Lo siento, hubo un error al procesar tu mensaje.");
    }
  });

  return app(req, res);
};
