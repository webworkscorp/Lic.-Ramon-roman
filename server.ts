import express from "express";
import { createServer as createViteServer } from "vite";

const WEBSITE_CONTEXT = `
Información del Sitio Web del Lic. Ramón Romero:
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
`;

// Simple rule-based response logic
function getLocalResponse(message: string): string {
  const lowerMsg = message.toLowerCase();

  if (lowerMsg.includes("hola") || lowerMsg.includes("buenos") || lowerMsg.includes("buenas")) {
    return "¡Hola! Soy el asistente virtual del Lic. Ramón Romero. ¿En qué puedo ayudarte hoy? Puedo darte información sobre contabilidad, auditoría, bienes raíces y más.";
  }

  if (lowerMsg.includes("ubicacion") || lowerMsg.includes("donde") || lowerMsg.includes("dirección") || lowerMsg.includes("ubicado")) {
    return "La oficina se encuentra en Palomo de Orosi, Paraíso de Cartago. Para una ubicación exacta o cita, por favor contáctanos por WhatsApp.";
  }

  if (lowerMsg.includes("telefono") || lowerMsg.includes("celular") || lowerMsg.includes("whatsapp") || lowerMsg.includes("contacto") || lowerMsg.includes("correo") || lowerMsg.includes("email")) {
    return "Puedes contactarnos directamente al Teléfono/WhatsApp 8382-1069 o al correo ramonromerocpa@yahoo.es.";
  }

  if (lowerMsg.includes("precio") || lowerMsg.includes("costo") || lowerMsg.includes("cuanto vale") || lowerMsg.includes("tarifas")) {
    return "Los honorarios varían según el servicio específico que necesites (contabilidad, auditoría, peritazgo, etc.). Te recomiendo contactar directamente al Licenciado al 8382-1069 para una cotización personalizada.";
  }

  if (lowerMsg.includes("cita") || lowerMsg.includes("agendar") || lowerMsg.includes("reunion") || lowerMsg.includes("horario")) {
    return "Para agendar una cita, por favor utiliza el formulario de contacto en esta página o escribe directamente al WhatsApp 8382-1069.";
  }

  if (lowerMsg.includes("servicio") || lowerMsg.includes("hace") || lowerMsg.includes("ofrece")) {
    return "Ofrecemos servicios de Contabilidad, Auditoría, Asesoría Financiera, Peritazgos Judiciales, Bienes Raíces, Facturación Electrónica, Finanzas Personales, Certificaciones de Ingresos y Diseño Publicitario.";
  }

  if (lowerMsg.includes("contabilidad") || lowerMsg.includes("contador")) {
    return "Brindamos gestión integral de registros contables para personas físicas y jurídicas, asegurando el cumplimiento de todas las normativas fiscales.";
  }

  if (lowerMsg.includes("auditoria") || lowerMsg.includes("auditor")) {
    return "Realizamos exámenes de estados financieros para garantizar la transparencia y confiabilidad de tu información financiera.";
  }
  
  if (lowerMsg.includes("bienes raices") || lowerMsg.includes("propiedad") || lowerMsg.includes("lote") || lowerMsg.includes("casa")) {
    return "En Bienes Raíces, ofrecemos servicios de compra, venta y administración de propiedades en la zona de Cartago y alrededores.";
  }

  if (lowerMsg.includes("cpa") || lowerMsg.includes("certificacion") || lowerMsg.includes("constancia")) {
    return "Emitimos certificaciones de ingresos (CPA) y otras constancias requeridas por bancos e instituciones financieras.";
  }

  return "Entiendo tu consulta. Para brindarte la mejor asesoría personalizada sobre ese tema, te invito a contactar directamente al Lic. Ramón Romero al WhatsApp 8382-1069 o usar el formulario de contacto.";
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware to parse JSON bodies
  app.use(express.json());

  // API Route for Chat
  app.post("/api/chat", async (req, res) => {
    try {
      const { message } = req.body;
      
      // Simulate a small delay for natural feel
      await new Promise(resolve => setTimeout(resolve, 600));

      const responseText = getLocalResponse(message || "");

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
