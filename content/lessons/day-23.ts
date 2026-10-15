import type { Lesson } from "@/lib/types";

// Capa_Temática "Mensajería y Arquitecturas Orientadas a Eventos" (dayRange [23, 24]).
// Día 23 — Colas y notificaciones: Amazon SQS (colas estándar/FIFO, DLQ) y
// Amazon SNS (publicación/suscripción), con el patrón fan-out SNS + SQS para
// desacoplar productores y consumidores.
//
// Trazabilidad: Req 3.12, 5.1, 5.2, 9.1, 9.4, 11.3.
export const day23: Lesson = {
  day: 23,
  slug: "mensajeria-sqs-sns",
  title: "Colas y notificaciones: Amazon SQS y Amazon SNS",
  section: "Mensajería y Arquitecturas Orientadas a Eventos",
  estimatedMinutes: 28,
  objectives: [
    "Entender el modelo de colas de Amazon SQS y el rol de las colas de mensajes muertos (DLQ)",
    "Comprender el modelo de publicación/suscripción (pub/sub) de Amazon SNS",
    "Diseñar el patrón fan-out combinando SNS con SQS para desacoplar productores y consumidores",
  ],
  blocks: [
    {
      type: "paragraph",
      text:
        "Amazon SQS (Simple Queue Service) y Amazon SNS (Simple Notification Service) son los pilares de la mensajería desacoplada en AWS. SQS es una cola de mensajes totalmente administrada: un productor envía mensajes y uno o varios consumidores los procesan a su propio ritmo. SNS es un servicio de publicación/suscripción (pub/sub): un publicador envía un mensaje a un tema (topic) y SNS lo entrega a todos los suscriptores.",
    },
    {
      type: "callout",
      variant: "info",
      text:
        "La idea clave: SQS desacopla en el tiempo (el consumidor procesa cuando puede), mientras SNS desacopla en el espacio (un mensaje llega a muchos destinos a la vez). Combinarlos (fan-out) te da lo mejor de ambos mundos.",
    },
    { type: "heading", level: 2, text: "Amazon SQS: colas y DLQ" },
    {
      type: "list",
      items: [
        "Colas estándar: throughput casi ilimitado, entrega al-menos-una-vez (at-least-once) y orden best-effort.",
        "Colas FIFO: preservan el orden exacto y garantizan entrega exactamente-una-vez (exactly-once) dentro de un grupo de mensajes.",
        "Visibility timeout: cuando un consumidor recibe un mensaje, este queda invisible un tiempo para que otros no lo procesen en paralelo.",
        "Dead-Letter Queue (DLQ): una cola secundaria donde SQS envía los mensajes que superan el maxReceiveCount sin ser procesados con éxito, para aislarlos y analizarlos sin bloquear la cola principal.",
      ],
    },
    {
      type: "code",
      lang: "bash",
      title: "Crear una cola estándar de SQS con el CLI de AWS",
      code:
        "aws sqs create-queue \\\n" +
        "  --queue-name pagos-pendientes \\\n" +
        "  --attributes VisibilityTimeout=30,MessageRetentionPeriod=345600 \\\n" +
        "  --region us-east-2",
    },
    {
      type: "callout",
      variant: "warning",
      text:
        "Una DLQ no se configura sola: debes crear una segunda cola y asociarla a la principal mediante el atributo RedrivePolicy (deadLetterTargetArn + maxReceiveCount). Sin un maxReceiveCount, los mensajes problemáticos se reintentarán indefinidamente.",
    },
    { type: "heading", level: 2, text: "Amazon SNS: publicación/suscripción" },
    {
      type: "paragraph",
      text:
        "En SNS, los publicadores envían mensajes a un tema (topic) y no saben ni les importa quién los recibe. Los suscriptores (colas SQS, funciones Lambda, endpoints HTTP/S, correo, SMS) se registran en el tema y reciben cada mensaje publicado. Así, agregar un nuevo consumidor no exige tocar al productor.",
    },
    {
      type: "code",
      lang: "bash",
      title: "Crear un tema de SNS con el CLI de AWS",
      code:
        "aws sns create-topic \\\n" +
        "  --name eventos-pedidos \\\n" +
        "  --region us-east-2",
    },
    { type: "heading", level: 2, text: "El patrón fan-out: SNS + SQS" },
    {
      type: "paragraph",
      text:
        "El patrón fan-out resuelve un problema recurrente: un mismo evento debe procesarse de varias formas independientes. En lugar de que el productor escriba en N colas, publica una sola vez en un tema de SNS, y ese tema está suscrito a varias colas SQS (una por cada consumidor). SNS reparte el mensaje a todas las colas; cada consumidor lo procesa a su ritmo y con su propia DLQ.",
    },
    {
      type: "list",
      ordered: true,
      items: [
        "Un pedido se confirma y el servicio publica un único mensaje en el tema SNS 'eventos-pedidos'.",
        "El tema entrega el mensaje a la cola 'facturacion', a la cola 'inventario' y a la cola 'notificaciones'.",
        "Cada equipo consume de su propia cola sin afectar a los demás; si uno falla, su DLQ aísla el problema.",
        "Agregar un cuarto consumidor es solo suscribir otra cola al tema: cero cambios en el productor.",
      ],
    },
    {
      type: "callout",
      variant: "success",
      text:
        "Fan-out = SNS reparte + SQS absorbe. SNS garantiza que el evento llegue a todos los destinos; SQS protege a cada consumidor de picos de carga y permite reintentos y DLQ por separado.",
    },
    { type: "heading", level: 2, text: "Servicios de esta capa" },
    {
      type: "serviceIcon",
      items: [
        { service: "Amazon SQS", icon: "messaging-sqs" },
        { service: "Amazon SNS", icon: "messaging-sns" },
      ],
    },
  ],
  icon: "messaging-sqs",
  selfCheck: [
    {
      question:
        "¿Cuál es la diferencia esencial entre Amazon SQS y Amazon SNS?",
      options: [
        "SQS solo funciona con Lambda y SNS solo con EC2",
        "SQS es una cola donde un consumidor extrae (pull) mensajes a su ritmo; SNS es pub/sub que empuja (push) cada mensaje a todos los suscriptores",
        "SNS almacena mensajes de forma persistente y SQS no almacena nada",
        "No hay diferencia: son dos nombres del mismo servicio",
      ],
      correctIndex: 1,
      explanation:
        "SQS desacopla en el tiempo mediante una cola de la que el consumidor extrae mensajes cuando puede. SNS implementa publicación/suscripción: un mensaje publicado en un tema se entrega (push) a todos los suscriptores registrados.",
    },
    {
      question:
        "En el patrón fan-out, ¿por qué se suscriben colas SQS a un tema de SNS en lugar de que el productor escriba directamente en cada cola?",
      options: [
        "Porque SQS no admite que un productor escriba directamente en una cola",
        "Porque SNS es más barato que SQS en todos los casos",
        "Para desacoplar al productor de los consumidores: publica una sola vez y agregar o quitar consumidores no exige cambiar el productor",
        "Porque SNS garantiza el orden FIFO y SQS nunca lo hace",
      ],
      correctIndex: 2,
      explanation:
        "El fan-out desacopla productor y consumidores: el productor publica un único mensaje en el tema y SNS lo reparte a todas las colas suscritas. Añadir un nuevo consumidor es solo suscribir otra cola, sin tocar al productor.",
    },
  ],
};
