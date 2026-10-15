import type { Lesson } from "@/lib/types";

// Capa_Temática "Mensajería y Arquitecturas Orientadas a Eventos" (dayRange [23, 24]).
// Día 24 — Enrutamiento y orquestación: Amazon EventBridge (event bus y reglas
// con patrones de evento) y AWS Step Functions (máquinas de estado con ASL)
// para coordinar flujos de trabajo distribuidos.
//
// Trazabilidad: Req 3.12, 5.1, 5.2, 9.1, 9.4, 11.3.
export const day24: Lesson = {
  day: 24,
  slug: "mensajeria-eventbridge-step-functions",
  title: "Enrutamiento y orquestación: Amazon EventBridge y AWS Step Functions",
  section: "Mensajería y Arquitecturas Orientadas a Eventos",
  estimatedMinutes: 30,
  objectives: [
    "Entender Amazon EventBridge como event bus y cómo sus reglas enrutan eventos mediante patrones",
    "Comprender AWS Step Functions y las máquinas de estado definidas con Amazon States Language (ASL)",
    "Distinguir cuándo conviene enrutar eventos (EventBridge) y cuándo orquestar un flujo (Step Functions)",
  ],
  blocks: [
    {
      type: "paragraph",
      text:
        "Amazon EventBridge y AWS Step Functions llevan la mensajería un paso más allá: del simple transporte de mensajes al enrutamiento inteligente y la orquestación de flujos. EventBridge es un bus de eventos (event bus) serverless que recibe eventos y los enruta a destinos según reglas basadas en el contenido del evento. Step Functions es un orquestador que coordina múltiples servicios como pasos de una máquina de estados.",
    },
    {
      type: "callout",
      variant: "info",
      text:
        "Amazon EventBridge es la evolución del antiguo Amazon CloudWatch Events: mismo motor de reglas, pero ampliado con buses de eventos, integración con SaaS de terceros y un registro de esquemas. Hoy el nombre oficial es EventBridge.",
    },
    { type: "heading", level: 2, text: "Amazon EventBridge: event bus y reglas" },
    {
      type: "list",
      items: [
        "Event bus: el canal que recibe los eventos. Existe un bus por defecto para eventos de servicios de AWS y puedes crear buses personalizados para tus aplicaciones.",
        "Regla (rule): evalúa cada evento contra un patrón de evento (event pattern); si coincide, lo enruta a uno o más destinos (Lambda, SQS, SNS, Step Functions, etc.).",
        "Patrón de evento: un documento JSON que filtra por campos del evento (source, detail-type, detail). Solo los eventos que coinciden disparan la regla.",
        "Programación: EventBridge Scheduler permite además disparar destinos con expresiones cron o rate, sin depender de eventos entrantes.",
      ],
    },
    {
      type: "code",
      lang: "bash",
      title: "Crear una regla de EventBridge con patrón de evento (CLI de AWS)",
      code:
        "aws events put-rule \\\n" +
        "  --name pedidos-confirmados \\\n" +
        "  --event-pattern '{\"source\":[\"app.pedidos\"],\"detail-type\":[\"PedidoConfirmado\"]}' \\\n" +
        "  --region us-east-2",
    },
    {
      type: "code",
      lang: "json",
      title: "Patrón de evento de EventBridge que filtra por source y detail",
      code:
        "{\n" +
        "  \"source\": [\"app.pedidos\"],\n" +
        "  \"detail-type\": [\"PedidoConfirmado\"],\n" +
        "  \"detail\": {\n" +
        "    \"estado\": [\"CONFIRMADO\"],\n" +
        "    \"monto\": [{ \"numeric\": [\">\", 1000] }]\n" +
        "  }\n" +
        "}",
    },
    {
      type: "callout",
      variant: "warning",
      text:
        "Un patrón de evento no es una consulta libre: cada campo que declaras debe coincidir (match) con el evento entrante. Si el evento no trae un campo que tu patrón exige, la regla no se dispara. Prueba tus patrones con eventos reales antes de confiar en ellos en producción.",
    },
    { type: "heading", level: 2, text: "AWS Step Functions: máquinas de estado" },
    {
      type: "paragraph",
      text:
        "Mientras EventBridge decide a dónde va un evento, Step Functions decide en qué orden se ejecutan los pasos de un proceso. Una máquina de estados (state machine) se define en Amazon States Language (ASL), un JSON declarativo donde cada estado puede invocar un servicio (Task), bifurcar (Choice), esperar (Wait), ejecutar en paralelo (Parallel) o terminar (Succeed/Fail). Step Functions gestiona reintentos, manejo de errores y el estado del flujo por ti.",
    },
    {
      type: "code",
      lang: "json",
      title: "Definición ASL de una máquina de estados de Step Functions",
      code:
        "{\n" +
        "  \"Comment\": \"Flujo de procesamiento de un pedido\",\n" +
        "  \"StartAt\": \"ValidarPedido\",\n" +
        "  \"States\": {\n" +
        "    \"ValidarPedido\": {\n" +
        "      \"Type\": \"Task\",\n" +
        "      \"Resource\": \"arn:aws:lambda:us-east-2:111122223333:function:validar\",\n" +
        "      \"Next\": \"PedidoValido\"\n" +
        "    },\n" +
        "    \"PedidoValido\": {\n" +
        "      \"Type\": \"Choice\",\n" +
        "      \"Choices\": [\n" +
        "        {\n" +
        "          \"Variable\": \"$.valido\",\n" +
        "          \"BooleanEquals\": true,\n" +
        "          \"Next\": \"CobrarPago\"\n" +
        "        }\n" +
        "      ],\n" +
        "      \"Default\": \"RechazarPedido\"\n" +
        "    },\n" +
        "    \"CobrarPago\": {\n" +
        "      \"Type\": \"Task\",\n" +
        "      \"Resource\": \"arn:aws:lambda:us-east-2:111122223333:function:cobrar\",\n" +
        "      \"End\": true\n" +
        "    },\n" +
        "    \"RechazarPedido\": {\n" +
        "      \"Type\": \"Fail\",\n" +
        "      \"Error\": \"PedidoInvalido\",\n" +
        "      \"Cause\": \"La validacion del pedido no fue exitosa\"\n" +
        "    }\n" +
        "  }\n" +
        "}",
    },
    { type: "heading", level: 2, text: "¿Enrutar o orquestar?" },
    {
      type: "list",
      ordered: true,
      items: [
        "Usa EventBridge cuando productores y consumidores están desacoplados y quieres reaccionar a eventos sin que el productor conozca al destino (coreografía).",
        "Usa Step Functions cuando necesitas un flujo con pasos ordenados, bifurcaciones, reintentos y visibilidad del estado de principio a fin (orquestación).",
        "A menudo se combinan: un evento de EventBridge inicia una ejecución de Step Functions que coordina el resto del proceso.",
      ],
    },
    {
      type: "callout",
      variant: "success",
      text:
        "Regla práctica: EventBridge responde '¿a quién le interesa este evento?'; Step Functions responde '¿cuál es el siguiente paso de este proceso?'. Enrutamiento frente a orquestación.",
    },
    { type: "heading", level: 2, text: "Servicios de esta capa" },
    {
      type: "serviceIcon",
      items: [
        { service: "Amazon EventBridge", icon: "messaging-eventbridge" },
        { service: "AWS Step Functions", icon: "messaging-step-functions" },
      ],
    },
  ],
  icon: "messaging-eventbridge",
  selfCheck: [
    {
      question:
        "¿Qué hace una regla (rule) de Amazon EventBridge con un patrón de evento?",
      options: [
        "Ejecuta pasos ordenados de un flujo de trabajo con reintentos",
        "Evalúa cada evento entrante contra el patrón y, si coincide, lo enruta a uno o más destinos",
        "Almacena los eventos de forma permanente en una cola FIFO",
        "Convierte eventos en instancias EC2 automáticamente",
      ],
      correctIndex: 1,
      explanation:
        "Una regla de EventBridge compara el evento con un patrón de evento (JSON). Solo cuando el evento coincide con el patrón, la regla enruta ese evento a sus destinos (Lambda, SQS, SNS, Step Functions, etc.).",
    },
    {
      question:
        "¿Cuándo tiene MÁS sentido usar AWS Step Functions en lugar de solo EventBridge?",
      options: [
        "Cuando únicamente quieres filtrar un evento y enviarlo a un destino sin lógica adicional",
        "Cuando necesitas coordinar varios pasos en un orden definido, con bifurcaciones, reintentos y visibilidad del estado del flujo",
        "Cuando quieres almacenar mensajes para que un consumidor los procese a su ritmo",
        "Cuando necesitas publicar un mensaje a muchos suscriptores a la vez",
      ],
      correctIndex: 1,
      explanation:
        "Step Functions orquesta un flujo: define pasos (Task, Choice, Parallel, Wait) con un orden explícito, maneja reintentos y errores, y da visibilidad del estado de principio a fin. EventBridge solo enruta eventos a destinos según un patrón.",
    },
  ],
};
