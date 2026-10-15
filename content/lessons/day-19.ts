import type { Lesson } from "@/lib/types";

// Capa_Temática "Monitoreo y Observabilidad" (dayRange [18, 20]).
// Día 19 — Trazabilidad y auditoría: AWS CloudTrail (registro de actividad de
// la API/cuenta) y AWS X-Ray (trazas distribuidas de aplicaciones).
//
// Trazabilidad: Req 3.7, 5.1, 5.2, 9.1, 9.4, 11.3.
export const day19: Lesson = {
  day: 19,
  slug: "monitoreo-cloudtrail-xray",
  title: "Trazabilidad y auditoría: AWS CloudTrail y AWS X-Ray",
  section: "Monitoreo y Observabilidad",
  estimatedMinutes: 25,
  icon: "monitoring-cloudtrail",
  objectives: [
    "Explicar qué registra AWS CloudTrail y por qué es la base de la auditoría y la gobernanza en una cuenta de AWS",
    "Distinguir entre eventos de administración y eventos de datos en CloudTrail",
    "Entender cómo AWS X-Ray traza una petición a través de servicios distribuidos para diagnosticar latencia y errores",
  ],
  blocks: [
    {
      type: "paragraph",
      text:
        "Observar métricas y logs te dice cómo se comporta un sistema; la trazabilidad y la auditoría te dicen quién hizo qué y por dónde pasó una petición. AWS CloudTrail responde a la primera pregunta registrando la actividad de la cuenta, y AWS X-Ray responde a la segunda siguiendo el camino de una petición a través de servicios distribuidos.",
    },
    { type: "heading", level: 2, text: "AWS CloudTrail: el libro contable de tu cuenta" },
    {
      type: "paragraph",
      text:
        "AWS CloudTrail registra las acciones realizadas en tu cuenta como eventos: quién (identidad), qué (acción de la API), cuándo, desde dónde (IP de origen) y sobre qué recurso. Es la fuente de verdad para auditorías de seguridad, análisis de incidentes y cumplimiento normativo. Por defecto conserva los últimos 90 días en el historial de eventos; para retención prolongada y análisis creas un 'trail' que entrega los eventos a un bucket de Amazon S3.",
    },
    {
      type: "callout",
      variant: "info",
      text:
        "CloudTrail NO es lo mismo que CloudWatch. CloudWatch observa el rendimiento y el estado (métricas y logs de aplicación); CloudTrail audita la actividad de la API y de las identidades. Se complementan: puedes enviar eventos de CloudTrail a CloudWatch Logs para alarmar sobre acciones sensibles.",
    },
    { type: "heading", level: 2, text: "Eventos de administración vs. eventos de datos" },
    {
      type: "list",
      items: [
        "Eventos de administración (management events): operaciones sobre los recursos, como crear una instancia EC2 o modificar una política de IAM. Se registran por defecto.",
        "Eventos de datos (data events): operaciones de alto volumen sobre los datos de un recurso, como GetObject/PutObject en objetos de S3 o invocaciones de funciones Lambda. No se registran por defecto por su volumen y se habilitan de forma explícita.",
        "Eventos de Insights: detectan actividad inusual de la API (picos de errores o de llamadas) frente al comportamiento histórico.",
      ],
    },
    {
      type: "code",
      lang: "bash",
      title: "Crear un trail que entrega eventos a un bucket de S3",
      code:
        "aws cloudtrail create-trail \\\n" +
        "  --name auditoria-organizacion \\\n" +
        "  --s3-bucket-name mi-bucket-cloudtrail-logs \\\n" +
        "  --is-multi-region-trail \\\n" +
        "  --region us-east-2\n" +
        "\n" +
        "# Un trail se crea 'detenido'; hay que iniciar el registro:\n" +
        "aws cloudtrail start-logging \\\n" +
        "  --name auditoria-organizacion \\\n" +
        "  --region us-east-2",
    },
    {
      type: "callout",
      variant: "warning",
      text:
        "Un trail multi-región captura la actividad de TODAS las regiones, no solo la de creación. Es la configuración recomendada para auditoría: una acción maliciosa en una región 'olvidada' no debe quedar sin registrar. Protege además el bucket de destino para que nadie pueda alterar o borrar la evidencia.",
    },
    { type: "heading", level: 2, text: "AWS X-Ray: seguir el rastro de una petición" },
    {
      type: "paragraph",
      text:
        "En una arquitectura distribuida (API Gateway → Lambda → DynamoDB → otro servicio), una sola petición de usuario atraviesa varios componentes. AWS X-Ray instrumenta tu aplicación para generar trazas: cada tramo del recorrido se registra como un segmento, y el conjunto forma un mapa de servicios que muestra latencias, cuellos de botella y errores por componente. Así respondes '¿por qué esta petición tardó 3 segundos?' señalando el servicio culpable.",
    },
    {
      type: "list",
      ordered: true,
      items: [
        "Instrumentas la aplicación con el SDK de X-Ray o habilitando el rastreo activo (active tracing) en servicios como Lambda y API Gateway.",
        "Cada componente emite segmentos y subsegmentos con tiempos y metadatos.",
        "X-Ray agrega las trazas en un mapa de servicios y en una vista de trazas donde filtras por latencia o errores.",
      ],
    },
    {
      type: "code",
      lang: "bash",
      title: "Habilitar el rastreo activo de X-Ray en una función Lambda",
      code:
        "aws lambda update-function-configuration \\\n" +
        "  --function-name procesar-pedidos \\\n" +
        "  --tracing-config Mode=Active \\\n" +
        "  --region us-east-2",
    },
    { type: "heading", level: 2, text: "Servicios de esta capa" },
    {
      type: "serviceIcon",
      items: [
        { service: "AWS CloudTrail", icon: "monitoring-cloudtrail" },
        { service: "AWS X-Ray", icon: "monitoring-xray" },
      ],
    },
  ],
  selfCheck: [
    {
      question:
        "Necesitas saber qué identidad eliminó una política de IAM la semana pasada y desde qué IP lo hizo. ¿Qué servicio consultas?",
      options: [
        "Amazon CloudWatch, revisando las métricas de IAM",
        "AWS X-Ray, revisando el mapa de servicios",
        "AWS CloudTrail, revisando los eventos de administración",
        "Amazon OpenSearch, revisando los dashboards",
      ],
      correctIndex: 2,
      explanation:
        "CloudTrail registra la actividad de la API y de las identidades (quién, qué, cuándo, desde dónde). Eliminar una política de IAM es un evento de administración. CloudWatch observa rendimiento, X-Ray traza peticiones de aplicación y OpenSearch busca/visualiza datos, no auditan la actividad de la cuenta.",
    },
    {
      question: "¿Para qué sirve principalmente AWS X-Ray?",
      options: [
        "Para auditar quién llamó a cada API de la cuenta",
        "Para seguir una petición a través de servicios distribuidos y localizar latencias y errores",
        "Para almacenar y consultar métricas numéricas de los recursos",
        "Para cifrar los datos en reposo de una base de datos",
      ],
      correctIndex: 1,
      explanation:
        "X-Ray hace trazabilidad distribuida: genera trazas y un mapa de servicios que muestran por dónde pasó cada petición y dónde está el cuello de botella. La auditoría de la API es trabajo de CloudTrail y las métricas numéricas son de CloudWatch.",
    },
  ],
};
