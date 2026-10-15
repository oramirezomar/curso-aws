import type { Lesson } from "@/lib/types";

// Capa_Temática: Cómputo (Nivel BÁSICO, dayRange [4, 6]).
// Tema: AWS Lambda — funciones serverless, triggers y modelo de ejecución.
// Trazabilidad: Req 3.2, 5.1, 5.2, 9.1, 9.4, 11.3.
export const day05: Lesson = {
  day: 5,
  slug: "computo-lambda",
  title: "AWS Lambda: funciones serverless, triggers y modelo de ejecución",
  section: "Cómputo",
  estimatedMinutes: 30,
  icon: "compute-lambda",
  objectives: [
    "Entender el modelo serverless de AWS Lambda y la ejecución dirigida por eventos",
    "Identificar las fuentes de eventos (triggers) que invocan una función Lambda",
    "Reconocer el modelo de facturación por invocación, duración y memoria configurada",
  ],
  blocks: [
    {
      type: "paragraph",
      text:
        "AWS Lambda es un servicio de cómputo serverless que ejecuta tu código en respuesta a eventos sin que tengas que aprovisionar ni administrar servidores. Subes el código como una función Lambda, defines su runtime (por ejemplo Node.js, Python o Java) y AWS se encarga del escalado, la disponibilidad y el mantenimiento de la infraestructura subyacente.",
    },
    {
      type: "serviceIcon",
      items: [{ service: "AWS Lambda", icon: "compute-lambda" }],
    },
    { type: "heading", level: 2, text: "Modelo de ejecución dirigido por eventos" },
    {
      type: "paragraph",
      text:
        "Una función Lambda no se ejecuta de forma continua: permanece inactiva hasta que un evento la invoca. AWS crea un entorno de ejecución, ejecuta el controlador (handler) con el payload del evento y, tras responder, puede reutilizar ese entorno para invocaciones posteriores (warm start). La primera invocación sobre un entorno nuevo incurre en latencia de arranque en frío (cold start).",
    },
    {
      type: "callout",
      variant: "info",
      text:
        "Configuras la memoria de la función entre 128 MB y 10.240 MB; la CPU asignada escala de forma proporcional a la memoria. El tiempo máximo de ejecución por invocación es de 15 minutos.",
    },
    { type: "heading", level: 2, text: "Triggers: quién invoca la función" },
    {
      type: "paragraph",
      text:
        "Las fuentes de eventos (event sources) determinan qué invoca a la función. Pueden ser invocaciones síncronas (quien llama espera la respuesta) o asíncronas (AWS encola el evento y lo procesa después).",
    },
    {
      type: "list",
      items: [
        "Amazon API Gateway: invoca la función de forma síncrona para servir una API HTTP.",
        "Amazon S3: notifica eventos de objeto (por ejemplo, creación de un archivo) de forma asíncrona.",
        "Amazon EventBridge: enruta eventos y ejecuciones programadas (cron) hacia la función.",
        "Amazon SQS, Kinesis o DynamoDB Streams: Lambda sondea estos orígenes y procesa registros por lotes.",
      ],
    },
    {
      type: "serviceIcon",
      items: [{ service: "Amazon API Gateway", icon: "networking-api-gateway" }],
    },
    {
      type: "code",
      lang: "bash",
      title: "Crear una función Lambda desde un paquete .zip",
      code:
        "aws lambda create-function \\\n" +
        "  --function-name procesar-pedido \\\n" +
        "  --runtime nodejs20.x \\\n" +
        "  --handler index.handler \\\n" +
        "  --role arn:aws:iam::111122223333:role/lambda-ejecucion \\\n" +
        "  --zip-file fileb://funcion.zip \\\n" +
        "  --memory-size 256 \\\n" +
        "  --timeout 30 \\\n" +
        "  --region us-east-1",
      highlightLines: [3, 4],
    },
    {
      type: "code",
      lang: "bash",
      title: "Invocar la función y guardar la respuesta",
      code:
        "aws lambda invoke \\\n" +
        "  --function-name procesar-pedido \\\n" +
        '  --payload \'{ "pedidoId": "A-1001" }\' \\\n' +
        "  --cli-binary-format raw-in-base64-out \\\n" +
        "  --region us-east-1 \\\n" +
        "  respuesta.json",
      highlightLines: [3],
    },
    {
      type: "callout",
      variant: "success",
      text:
        "Lambda factura por número de invocaciones y por duración (GB-segundo = memoria configurada × tiempo de ejecución). No pagas por tiempo de inactividad, lo que lo hace ideal para cargas intermitentes o impredecibles.",
    },
  ],
  selfCheck: [
    {
      question: "¿Qué caracteriza al modelo de cómputo de AWS Lambda?",
      options: [
        "Ejecuta código de forma continua en una instancia que tú administras",
        "Ejecuta código en respuesta a eventos sin administrar servidores (serverless)",
        "Requiere aprovisionar y parchear manualmente el sistema operativo",
        "Solo puede invocarse de forma manual desde la consola de AWS",
      ],
      correctIndex: 1,
      explanation:
        "Lambda es serverless y dirigido por eventos: ejecuta el código en respuesta a un trigger y AWS gestiona el escalado y la infraestructura; no administras servidores.",
    },
    {
      question: "¿Cómo se factura una función Lambda?",
      options: [
        "Por una tarifa mensual fija independiente del uso",
        "Por el número de instancias EC2 que mantiene encendidas",
        "Por número de invocaciones y por duración según la memoria configurada",
        "Solo por el almacenamiento del paquete de código desplegado",
      ],
      correctIndex: 2,
      explanation:
        "El coste de Lambda depende del número de invocaciones y de la duración medida en GB-segundo (memoria configurada por tiempo de ejecución); no se paga por tiempo de inactividad.",
    },
  ],
};
