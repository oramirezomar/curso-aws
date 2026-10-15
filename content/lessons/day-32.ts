import type { Lesson } from "@/lib/types";

// Capa_Temática "Inteligencia Artificial y Machine Learning" (dayRange [31, 32]).
// Día 32 — Plataforma de ML: Amazon SageMaker AI. El ciclo de vida completo del
// machine learning gestionado: construir (notebooks y datos), entrenar (training
// jobs sobre infraestructura efímera) y desplegar (endpoints de inferencia) los
// modelos propios, frente al enfoque de IA generativa gestionada de Bedrock.
//
// Trazabilidad: Req 3.13, 5.1, 5.2, 9.1, 9.4, 11.3.
export const day32: Lesson = {
  day: 32,
  slug: "ia-sagemaker",
  title: "Plataforma de ML: Amazon SageMaker AI (construir, entrenar y desplegar modelos)",
  section: "Inteligencia Artificial y Machine Learning",
  estimatedMinutes: 30,
  objectives: [
    "Entender Amazon SageMaker AI como plataforma gestionada para el ciclo de vida completo del machine learning",
    "Diferenciar las tres fases: construir, entrenar y desplegar un modelo propio",
    "Comprender cómo un training job usa infraestructura efímera y guarda los artefactos del modelo en Amazon S3",
    "Distinguir cuándo conviene SageMaker AI (modelos propios) frente a Amazon Bedrock (IA generativa gestionada)",
  ],
  blocks: [
    {
      type: "paragraph",
      text:
        "Amazon SageMaker AI es la plataforma gestionada de AWS para recorrer el ciclo de vida completo del machine learning: construir, entrenar y desplegar modelos propios. Donde Amazon Bedrock te da modelos fundacionales ya hechos tras una API, SageMaker AI te da la fábrica para crear tus propios modelos sobre tus propios datos, sin que tengas que aprovisionar ni administrar los clústeres de entrenamiento y los servidores de inferencia a mano.",
    },
    {
      type: "callout",
      variant: "info",
      text:
        "El nombre oficial del servicio es Amazon SageMaker AI. Resuelve el problema de fondo del ML: montar y operar la infraestructura de entrenamiento y despliegue es caro y complejo. SageMaker AI lo gestiona para que te concentres en los datos y el modelo.",
    },
    { type: "heading", level: 2, text: "El ciclo de vida: construir, entrenar, desplegar" },
    {
      type: "list",
      ordered: true,
      items: [
        "Construir: preparas los datos y desarrollas el modelo en un entorno gestionado (notebooks, SageMaker Studio). Aquí exploras los datos, haces ingeniería de características y defines el algoritmo.",
        "Entrenar: lanzas un training job. SageMaker AI aprovisiona instancias de cómputo efímeras, ejecuta el entrenamiento con tus datos de Amazon S3, guarda los artefactos del modelo resultante en S3 y apaga las instancias al terminar. Pagas solo por el tiempo de entrenamiento.",
        "Desplegar: publicas el modelo entrenado en un endpoint de inferencia para servir predicciones en tiempo real, o lo usas en inferencia por lotes (batch transform) para procesar grandes volúmenes de una vez.",
      ],
    },
    {
      type: "paragraph",
      text:
        "La clave del entrenamiento gestionado es la infraestructura efímera: un training job levanta las máquinas que necesita, entrena y las libera. No mantienes un clúster encendido esperando trabajo. El resultado del entrenamiento son los artefactos del modelo, que SageMaker AI deposita en la ruta de Amazon S3 que le indiques.",
    },
    {
      type: "code",
      lang: "bash",
      title: "Lanzar un training job en Amazon SageMaker AI (CLI de AWS)",
      code:
        "# Crea un trabajo de entrenamiento: infraestructura efimera + datos en S3\n" +
        "aws sagemaker create-training-job \\\n" +
        "  --training-job-name entrenamiento-demo-01 \\\n" +
        "  --algorithm-specification TrainingImage=382416733822.dkr.ecr.us-east-1.amazonaws.com/xgboost:latest,TrainingInputMode=File \\\n" +
        "  --role-arn arn:aws:iam::111122223333:role/SageMakerExecutionRole \\\n" +
        "  --input-data-config '[{\"ChannelName\":\"train\",\"DataSource\":{\"S3DataSource\":{\"S3DataType\":\"S3Prefix\",\"S3Uri\":\"s3://mi-bucket/datos/train/\",\"S3DataDistributionType\":\"FullyReplicated\"}}}]' \\\n" +
        "  --output-data-config S3OutputPath=s3://mi-bucket/modelos/ \\\n" +
        "  --resource-config InstanceType=ml.m5.xlarge,InstanceCount=1,VolumeSizeInGB=10 \\\n" +
        "  --stopping-condition MaxRuntimeInSeconds=3600 \\\n" +
        "  --region us-east-1",
    },
    {
      type: "callout",
      variant: "warning",
      text:
        "El role-arn es obligatorio: es el rol de ejecución que SageMaker AI asume para leer tus datos de S3 y escribir los artefactos del modelo. Si el rol no tiene permisos sobre esos buckets, el training job falla. Define siempre MaxRuntimeInSeconds para no dejar un entrenamiento corriendo (y facturando) de forma indefinida.",
    },
    {
      type: "paragraph",
      text:
        "Terminado el entrenamiento, puedes gestionar el ciclo también desde un SDK. Con el AWS SDK para JavaScript v3 el patrón es el mismo que en la CLI: un cliente del servicio y un comando por operación.",
    },
    {
      type: "code",
      lang: "ts",
      title: "Consultar el estado de un training job con el AWS SDK v3",
      code:
        "import {\n" +
        "  SageMakerClient,\n" +
        "  DescribeTrainingJobCommand,\n" +
        "} from \"@aws-sdk/client-sagemaker\";\n\n" +
        "const client = new SageMakerClient({ region: \"us-east-1\" });\n\n" +
        "const respuesta = await client.send(\n" +
        "  new DescribeTrainingJobCommand({ TrainingJobName: \"entrenamiento-demo-01\" }),\n" +
        ");\n\n" +
        "// TrainingJobStatus: InProgress | Completed | Failed | Stopping | Stopped\n" +
        "console.log(respuesta.TrainingJobStatus, respuesta.ModelArtifacts?.S3ModelArtifacts);",
    },
    { type: "heading", level: 2, text: "SageMaker AI frente a Amazon Bedrock" },
    {
      type: "list",
      items: [
        "Elige Amazon Bedrock cuando quieres consumir IA generativa a partir de modelos fundacionales ya entrenados tras una API, sin construir ni operar infraestructura de ML.",
        "Elige Amazon SageMaker AI cuando necesitas construir, entrenar y desplegar tus propios modelos sobre tus propios datos, con control del algoritmo, el entrenamiento y el despliegue.",
        "No son excluyentes: una organización puede usar Bedrock para casos de IA generativa y SageMaker AI para modelos de ML a medida (predicción de demanda, detección de fraude, scoring).",
      ],
    },
    {
      type: "callout",
      variant: "success",
      text:
        "Regla práctica: Bedrock es 'consume modelos fundacionales gestionados'; SageMaker AI es 'construye, entrena y despliega tus propios modelos'. Comprar un modelo frente a fabricar el tuyo.",
    },
    { type: "heading", level: 2, text: "Servicios de esta capa" },
    {
      type: "serviceIcon",
      items: [{ service: "Amazon SageMaker AI", icon: "ai-sagemaker" }],
    },
  ],
  icon: "ai-sagemaker",
  selfCheck: [
    {
      question:
        "¿Qué ocurre con la infraestructura de cómputo cuando lanzas un training job en Amazon SageMaker AI?",
      options: [
        "Debes aprovisionar y mantener encendido un clúster de forma permanente",
        "SageMaker AI aprovisiona instancias efímeras, entrena, guarda los artefactos en S3 y libera las instancias al terminar",
        "El entrenamiento corre sobre el endpoint de inferencia ya desplegado",
        "No hay cómputo: SageMaker AI entrena en el navegador del usuario",
      ],
      correctIndex: 1,
      explanation:
        "Un training job usa infraestructura efímera: SageMaker AI levanta las instancias necesarias, ejecuta el entrenamiento con los datos de S3, deposita los artefactos del modelo en la ruta de salida de S3 y apaga las instancias. Pagas solo por el tiempo de entrenamiento.",
    },
    {
      question:
        "Tu equipo necesita construir, entrenar y desplegar un modelo propio de detección de fraude con sus propios datos. ¿Qué servicio encaja mejor?",
      options: [
        "Amazon Bedrock, porque ya trae modelos fundacionales listos",
        "Amazon SageMaker AI, la plataforma para el ciclo de vida completo del ML con modelos propios",
        "Amazon S3, porque almacena los datos",
        "AWS Lambda, porque ejecuta código bajo demanda",
      ],
      correctIndex: 1,
      explanation:
        "SageMaker AI cubre construir, entrenar y desplegar modelos propios sobre tus datos, con control del algoritmo y del despliegue. Bedrock, en cambio, sirve para consumir modelos fundacionales ya entrenados de IA generativa.",
    },
    {
      question:
        "En un training job, ¿cuál es el papel del role-arn (rol de ejecución)?",
      options: [
        "Define la Región donde se ejecuta el entrenamiento",
        "Es el rol que SageMaker AI asume para leer los datos de S3 y escribir los artefactos del modelo",
        "Especifica el tipo de instancia de cómputo que se usará",
        "Fija el tiempo máximo de ejecución del entrenamiento",
      ],
      correctIndex: 1,
      explanation:
        "El role-arn es el rol de ejecución que SageMaker AI asume en tu nombre durante el entrenamiento. Necesita permisos para leer los datos de entrada en S3 y escribir los artefactos del modelo en la ruta de salida; sin ellos, el training job falla.",
    },
  ],
};
