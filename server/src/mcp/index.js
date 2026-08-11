const { z } = require('zod');
const prisma = require('../config/db');

async function initMcp(app) {
  // Importamos dinámicamente los módulos ESM del SDK de MCP
  const { McpServer } = await import("@modelcontextprotocol/sdk/server/mcp.js");
  const { SSEServerTransport } = await import("@modelcontextprotocol/sdk/server/sse.js");

  const mcpServer = new McpServer({
    name: "taekwondo-academy-api",
    version: "1.0.0",
  });

  // Definimos la herramienta (Tool) para buscar alumnos
  mcpServer.tool(
    "buscar_alumnos",
    "Busca alumnos de la academia por nombre",
    { nombre: z.string() },
    async ({ nombre }) => {
      const alumnos = await prisma.student.findMany({
        where: { nombres: { contains: nombre, mode: 'insensitive' } },
        select: { 
          id: true, 
          nombres: true, 
          apellidos: true, 
          cedula: true, 
          estado: true, 
          grado: true, 
          modalidad: true 
        }
      });
      return {
        content: [{ type: "text", text: JSON.stringify(alumnos, null, 2) }]
      };
    }
  );

  // Tool para listar clubes
  mcpServer.tool(
    "listar_clubes",
    "Obtiene la lista de clubes registrados en el sistema",
    {},
    async () => {
      const clubes = await prisma.club.findMany({
        select: { id: true, nombre: true, descripcion: true }
      });
      return {
        content: [{ type: "text", text: JSON.stringify(clubes, null, 2) }]
      };
    }
  );

  let transport;

  // Endpoint de conexión SSE (El que se configura en Spark)
  app.get("/api/mcp", async (req, res) => {
    try {
      // Indicamos la ruta por la que Gemini enviará los mensajes
      transport = new SSEServerTransport("/api/mcp/messages", res);
      await mcpServer.connect(transport);
    } catch (error) {
      console.error("Error al conectar transporte MCP:", error);
      if (!res.headersSent) {
        res.status(500).json({ error: "Failed to initialize MCP connection" });
      }
    }
  });

  // Endpoint interno por el cual Gemini/Spark envía las solicitudes JSON-RPC
  app.post("/api/mcp/messages", async (req, res) => {
    if (transport) {
      try {
        await transport.handlePostMessage(req, res);
      } catch (error) {
        console.error("Error procesando mensaje MCP:", error);
        if (!res.headersSent) {
          res.status(500).json({ error: "Failed to process MCP message" });
        }
      }
    } else {
      res.status(400).send("No active MCP connection");
    }
  });

  console.log("🛠️  Servidor MCP inicializado correctamente en los endpoints /api/mcp");
}

module.exports = { initMcp };
