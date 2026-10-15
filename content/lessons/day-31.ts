import type { Lesson } from "@/lib/types";

// Capa_Temática "Inteligencia Artificial y Machine Learning" (dayRange [31, 32]).
// Día 31 — IA generativa gestionada: Amazon Bedrock. Modelos fundacionales (FM)
// de múltiples proveedores tras una única API, más los bloques gestionados para
// construir aplicaciones de IA generativa responsables: Knowledge Bases (RAG),
// Guardrails (salvaguardas) y Agents (orquestación de tareas).
//
// Trazabilidad: Req 3.13, 5.1, 5.2, 9.1, 9.4, 11.3.
export const day31: Lesson = {
  day: 31,
  slug: "ia-bedrock",
  title: "IA generativa gestionada: Amazon Bedrock (modelos fundacionales, Knowledge Bases, Guardrails y Agents)",
  section: "Inteligencia Artificial y Machine Learning",
  estimatedMinutes: 30,
  objectives: [
    "Entender Amazon Bedrock como servicio totalmente gestionado que expone modelos fundacionales de varios proveedores tras una única API",
    "Diferenciar los dos planos de la API de Bedrock: control (bedrock) e inferencia (bedrock-runtime)",
    "Comprender el rol de Knowledge Bases (RAG), Guardrails (salvaguardas) y Agents (orquestación de tareas)",
    "Invocar un modelo fundacional desde la AWS CLI respetando el contrato de entrada/salida",
  ],
  blocks: [
    {
      type: "paragraph",
      text:
        "Amazon Bedrock es un servicio totalmente gestionado que te da acceso a una colección de modelos fundacionales (foundation models o FM) de distintos proveedores detrás de una única API autenticada con IAM. No gestionas servidores, GPUs ni escalado: pides una inferencia y Bedrock responde. Sobre esa base, añade bloques de construcción gestionados para llevar un prototipo a una aplicación de IA generativa seria: Knowledge Bases para dar contexto propio al modelo, Guardrails para imponer límites de seguridad y Agents para que el modelo ejecute tareas de varios pasos.",
    },
    {
      type: "callout",
      variant: "info",
      text:
        "Un modelo fundacional (FM) es un modelo grande preentrenado sobre enormes cantidades de datos que puedes usar tal cual o adaptar. Bedrock no te ata a un único proveedor: cambias de modelo cambiando un identificador, sin reescribir tu arquitectura.",
    },
    { type: "heading", level: 2, text: "Dos planos: control e inferencia" },
    {
      type: "paragraph",
      text:
        "La API de Bedrock se divide en dos espacios de nombres que conviene no confundir. El plano de control (bedrock) administra recursos: listar modelos disponibles, gestionar Knowledge Bases, Guardrails y personalizaciones. El plano de inferencia (bedrock-runtime) es el que realmente invoca un modelo para generar texto, imágenes o embeddings. En la CLI son dos comandos distintos: aws bedrock y aws bedrock-runtime.",
    },
    {
      type: "code",
      lang: "bash",
      title: "Listar los modelos fundacionales disponibles (plano de control)",
      code:
        "# Plano de control: descubre qué modelos fundacionales puedes usar en la Región\n" +
        "aws bedrock list-foundation-models --region us-east-1 --output table\n\n" +
        "# Filtra por proveedor para acotar el listado\n" +
        "aws bedrock list-foundation-models \\\n" +
        "  --by-provider anthropic \\\n" +
        "  --region us-east-1 \\\n" +
        "  --output table",
    },
    {
      type: "callout",
      variant: "warning",
      text:
        "Antes de poder invocar un modelo debes solicitar acceso a él en la consola de Bedrock (Model access). La disponibilidad de modelos y de las propias capacidades varía por Región: comprueba siempre que el modelo que necesitas existe en la Región donde operas.",
    },
    {
      type: "code",
      lang: "bash",
      title: "Invocar un modelo fundacional para generar texto (plano de inferencia)",
      code:
        "# Plano de inferencia: envia un prompt y recibe la respuesta del modelo\n" +
        "aws bedrock-runtime invoke-model \\\n" +
        "  --model-id anthropic.claude-3-haiku-20240307-v1:0 \\\n" +
        "  --content-type application/json \\\n" +
        "  --accept application/json \\\n" +
        "  --body '{\"anthropic_version\":\"bedrock-2023-05-31\",\"max_tokens\":256,\"messages\":[{\"role\":\"user\",\"content\":\"Explica que es un modelo fundacional en una frase.\"}]}' \\\n" +
        "  --region us-east-1 \\\n" +
        "  salida.json",
    },
    {
      type: "paragraph",
      text:
        "El cuerpo (body) de la invocación es un JSON cuyo esquema depende del modelo elegido: cada familia define sus propios campos. La respuesta se escribe en el archivo de salida (salida.json en el ejemplo). Este es el contrato que debes respetar al integrar Bedrock desde cualquier SDK.",
    },
    {
      type: "code",
      lang: "json",
      title: "Ejemplo de cuerpo (body) de invocación para un modelo de la familia Claude",
      code:
        "{\n" +
        "  \"anthropic_version\": \"bedrock-2023-05-31\",\n" +
        "  \"max_tokens\": 256,\n" +
        "  \"messages\": [\n" +
        "    {\n" +
        "      \"role\": \"user\",\n" +
        "      \"content\": \"Resume en tres puntos las ventajas de un servicio gestionado de IA.\"\n" +
        "    }\n" +
        "  ]\n" +
        "}",
    },
    { type: "heading", level: 2, text: "Los bloques de construcción gestionados" },
    {
      type: "list",
      items: [
        "Knowledge Bases: capacidad gestionada de RAG (Retrieval-Augmented Generation). Conecta el modelo a tus datos propios (documentos en S3, por ejemplo) encargándose de la ingesta, el troceado (chunking), los embeddings, el almacenamiento vectorial y la recuperación, para que el modelo responda con tu información y no solo con lo que aprendió al preentrenarse.",
        "Guardrails: salvaguardas configurables que aplican una política de seguridad uniforme sobre uno o varios modelos. Filtran contenido dañino, bloquean temas vetados, enmascaran información sensible (PII) y limitan las alucinaciones, independientes del modelo fundacional que uses.",
        "Agents: orquestan tareas de varios pasos. El modelo razona sobre una petición, decide qué acciones ejecutar (llamando a APIs o funciones Lambda) y puede consultar una Knowledge Base para fundamentar su respuesta, encadenando pasos hasta completar el objetivo.",
      ],
    },
    {
      type: "callout",
      variant: "success",
      text:
        "Regla práctica: usa un FM a secas para generación simple; añade Knowledge Bases cuando el modelo deba responder con tus datos; añade Guardrails cuando necesites imponer límites de seguridad consistentes; y usa Agents cuando el modelo deba ejecutar acciones, no solo generar texto.",
    },
    { type: "heading", level: 2, text: "Servicios de esta capa" },
    {
      type: "serviceIcon",
      items: [{ service: "Amazon Bedrock", icon: "ai-bedrock" }],
    },
  ],
  icon: "ai-bedrock",
  selfCheck: [
    {
      question:
        "¿Qué espacio de nombres de la API usas para generar texto con un modelo fundacional en Amazon Bedrock?",
      options: [
        "El plano de control (aws bedrock), que administra recursos como Knowledge Bases y Guardrails",
        "El plano de inferencia (aws bedrock-runtime), que invoca el modelo con invoke-model",
        "Cualquiera de los dos indistintamente, porque son equivalentes",
        "El servicio aws sagemaker, porque Bedrock no genera texto directamente",
      ],
      correctIndex: 1,
      explanation:
        "La inferencia (generar texto, imágenes o embeddings) se hace en el plano de inferencia con aws bedrock-runtime invoke-model. El plano de control (aws bedrock) administra recursos: listar modelos, gestionar Knowledge Bases, Guardrails y personalizaciones.",
    },
    {
      question:
        "Necesitas que el modelo responda usando los documentos internos de tu empresa, no solo lo que aprendió al preentrenarse. ¿Qué capacidad de Bedrock usas?",
      options: [
        "Guardrails, para filtrar contenido dañino",
        "Agents, para ejecutar acciones de varios pasos",
        "Knowledge Bases, que implementa RAG conectando el modelo a tus datos propios",
        "list-foundation-models, para elegir otro modelo",
      ],
      correctIndex: 2,
      explanation:
        "Knowledge Bases es la capacidad gestionada de RAG: ingiere tus documentos, los trocea, genera embeddings y los recupera en el momento de la consulta para que el modelo fundamente su respuesta en tu información.",
    },
    {
      question: "¿Qué resuelven las Guardrails de Amazon Bedrock?",
      options: [
        "Entrenan un modelo propio desde cero con tus datos",
        "Imponen una política de seguridad uniforme (filtrado de contenido, temas vetados, enmascarado de PII) aplicable a varios modelos",
        "Escalan automáticamente las GPUs según la demanda de inferencia",
        "Convierten documentos en embeddings para búsqueda vectorial",
      ],
      correctIndex: 1,
      explanation:
        "Las Guardrails son salvaguardas configurables, independientes del modelo fundacional, que aplican controles de seguridad consistentes: filtran contenido dañino, bloquean temas no deseados, enmascaran información sensible y acotan las alucinaciones.",
    },
  ],
};
