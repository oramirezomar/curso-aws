import type { Lesson } from "@/lib/types";

// Capa_Temática "Redes y Conectividad" (Nivel MEDIO, dayRange [12, 14]).
// Día 14 — Amazon API Gateway: creación de APIs REST y HTTP, tipos de API,
// etapas (stages) e integración con AWS Lambda (patrón proxy).
//
// Trazabilidad: Req 3.4, 5.1, 5.2, 9.1, 9.4, 11.3.
export const day14: Lesson = {
  day: 14,
  slug: "redes-api-gateway",
  title: "Amazon API Gateway: APIs REST/HTTP e integración con Lambda",
  section: "Redes y Conectividad",
  estimatedMinutes: 30,
  icon: "networking-api-gateway",
  objectives: [
    "Comprender qué es Amazon API Gateway y su rol como puerta de entrada administrada para APIs",
    "Diferenciar las APIs REST de las APIs HTTP y saber cuándo elegir cada una",
    "Describir cómo se integra API Gateway con AWS Lambda mediante el patrón de integración proxy",
  ],
  blocks: [
    {
      type: "paragraph",
      text:
        "Amazon API Gateway es un servicio totalmente administrado que facilita a los desarrolladores crear, publicar, mantener, monitorear y proteger APIs a cualquier escala. Actúa como la 'puerta principal' por la que las aplicaciones acceden a datos, lógica de negocio o funcionalidad de tus servicios de backend, encargándose de tareas transversales como autenticación, limitación de tasa (throttling) y gestión de versiones.",
    },
    {
      type: "serviceIcon",
      items: [
        { service: "Amazon API Gateway", icon: "networking-api-gateway" },
      ],
    },
    { type: "heading", level: 2, text: "APIs REST vs. APIs HTTP" },
    {
      type: "paragraph",
      text:
        "API Gateway ofrece varios tipos de API. Los dos más usados para servicios web son las APIs REST y las APIs HTTP. Ambas exponen endpoints HTTP, pero difieren en funcionalidades y costo.",
    },
    {
      type: "list",
      items: [
        "API REST: conjunto completo de funciones (planes de uso, claves de API, validación de solicitudes, caché, transformaciones de petición/respuesta). Más control, mayor costo.",
        "API HTTP: diseñada para ser más simple, de menor latencia y menor costo; ideal para exponer funciones Lambda o backends HTTP sin necesidad de las funciones avanzadas de REST.",
        "Regla práctica: empieza con API HTTP salvo que necesites una característica concreta que solo ofrece la API REST.",
      ],
    },
    { type: "heading", level: 2, text: "Recursos, métodos y etapas" },
    {
      type: "paragraph",
      text:
        "Una API se organiza en recursos (rutas como /clientes) y métodos HTTP (GET, POST, etc.) sobre cada recurso. Antes de que los clientes puedan invocarla, debes desplegar la API en una etapa (stage), por ejemplo dev o prod. Cada etapa tiene su propia URL de invocación y su configuración, lo que permite separar entornos.",
    },
    {
      type: "callout",
      variant: "info",
      text:
        "Un cambio en la definición de la API no es visible hasta que se despliega en una etapa. Las etapas te permiten promover cambios de forma controlada entre entornos sin afectar al tráfico de producción.",
    },
    { type: "heading", level: 2, text: "Integración con AWS Lambda (proxy)" },
    {
      type: "paragraph",
      text:
        "El patrón más común es la integración proxy de Lambda (AWS_PROXY). API Gateway reenvía la solicitud completa (ruta, cabeceras, cuerpo y parámetros) a una función Lambda, y espera de vuelta un objeto con statusCode, headers y body. Así, la función tiene control total sobre la respuesta HTTP sin configurar mapeos complejos en API Gateway.",
    },
    {
      type: "code",
      lang: "bash",
      title: "Crear una API HTTP integrada con una función Lambda",
      code:
        "aws apigatewayv2 create-api \\\n" +
        "  --name mi-api \\\n" +
        "  --protocol-type HTTP \\\n" +
        "  --target arn:aws:lambda:us-east-1:111122223333:function:mi-funcion \\\n" +
        "  --region us-east-1",
      highlightLines: [3, 4],
    },
    {
      type: "paragraph",
      text:
        "Con el patrón proxy, la función Lambda debe devolver una respuesta con el formato que API Gateway espera. Este es un ejemplo de la respuesta JSON que retorna el handler.",
    },
    {
      type: "code",
      lang: "json",
      title: "Respuesta esperada por la integración proxy de Lambda",
      code:
        "{\n" +
        '  "statusCode": 200,\n' +
        '  "headers": { "Content-Type": "application/json" },\n' +
        '  "body": "{\\"mensaje\\": \\"Hola desde Lambda\\"}"\n' +
        "}",
      highlightLines: [2, 4],
    },
    {
      type: "callout",
      variant: "warning",
      text:
        "Al crear una API HTTP con --target, AWS configura por ti la integración y una ruta por defecto, pero debes otorgar permiso de invocación a API Gateway sobre la función (resource-based policy) o la llamada fallará con un error de permisos.",
    },
  ],
  selfCheck: [
    {
      question:
        "¿Cuándo es preferible elegir una API HTTP en lugar de una API REST en API Gateway?",
      options: [
        "Cuando necesitas planes de uso, claves de API y caché de respuestas",
        "Cuando buscas menor latencia y menor costo para exponer una función Lambda sin funciones avanzadas",
        "Cuando quieres transformaciones complejas de petición y respuesta",
        "Cuando necesitas validación de solicitudes integrada en el gateway",
      ],
      correctIndex: 1,
      explanation:
        "Las APIs HTTP son más simples, de menor latencia y costo, ideales para exponer Lambda o backends HTTP. Las funciones avanzadas (planes de uso, claves, caché, validación, transformaciones) son propias de las APIs REST.",
    },
    {
      question:
        "En una integración proxy (AWS_PROXY), ¿qué debe devolver la función Lambda a API Gateway?",
      options: [
        "Solo una cadena de texto plano con el cuerpo de la respuesta",
        "Un objeto con statusCode, headers y body para construir la respuesta HTTP",
        "El ARN de otra función Lambda que generará la respuesta",
        "Un documento XML con el mapeo de la respuesta",
      ],
      correctIndex: 1,
      explanation:
        "Con la integración proxy, la función devuelve un objeto con statusCode, headers y body; API Gateway lo usa directamente para formar la respuesta HTTP, dándole a la función control total sobre ella.",
    },
  ],
};
