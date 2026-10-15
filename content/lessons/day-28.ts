import type { Lesson } from "@/lib/types";

// Capa_Temática: Analítica y Datos (Nivel AVANZADO, dayRange [27, 28]).
// Día 28 — Almacenamiento analítico y streaming: Amazon Redshift (data
// warehouse), Amazon EMR (big data con frameworks de código abierto) y
// Amazon Kinesis (ingesta y procesamiento de datos en streaming).
//
// Trazabilidad: Req 3.8, 5.1, 5.2, 9.1, 9.4, 11.3.
export const day28: Lesson = {
  day: 28,
  slug: "analitica-redshift-emr-kinesis",
  title: "Almacenamiento analítico y streaming: Amazon Redshift, EMR y Kinesis",
  section: "Analítica y Datos",
  estimatedMinutes: 30,
  icon: "analytics-redshift",
  objectives: [
    "Comprender Amazon Redshift como almacén de datos (data warehouse) columnar y masivamente paralelo para analítica a gran escala",
    "Explicar Amazon EMR como plataforma de big data gestionada para ejecutar frameworks de código abierto como Apache Spark y Hadoop",
    "Entender Amazon Kinesis como familia de servicios para ingerir y procesar datos en streaming en tiempo real",
  ],
  blocks: [
    {
      type: "paragraph",
      text:
        "Cuando la analítica crece en volumen y exigencia, Amazon ofrece motores especializados por caso de uso: Amazon Redshift para un almacén de datos (data warehouse) con consultas analíticas complejas, Amazon EMR para procesar grandes volúmenes con frameworks de código abierto, y Amazon Kinesis para capturar y procesar datos en streaming conforme llegan. Los tres se integran con el lago de datos en S3 y con el Glue Data Catalog visto en la lección anterior.",
    },
    { type: "heading", level: 2, text: "Amazon Redshift: data warehouse" },
    {
      type: "paragraph",
      text:
        "Amazon Redshift es un almacén de datos (data warehouse) en la nube, totalmente gestionado y a escala de petabytes. Está optimizado para analítica (OLAP) gracias a su almacenamiento columnar y a su arquitectura de procesamiento masivamente paralelo (MPP), que reparte las consultas entre varios nodos de cómputo. Con Redshift Spectrum puede consultar también datos que viven directamente en S3 sin cargarlos.",
    },
    {
      type: "list",
      items: [
        "Columnar: almacena por columnas, lo que acelera las agregaciones analíticas y mejora la compresión.",
        "MPP: distribuye el trabajo entre múltiples nodos para consultar grandes volúmenes con rapidez.",
        "Redshift Serverless: ejecuta cargas analíticas sin aprovisionar ni gestionar clústeres manualmente.",
        "Redshift Spectrum: consulta datos del lago de datos en S3 directamente, uniéndolos con las tablas del almacén.",
      ],
    },
    {
      type: "code",
      lang: "bash",
      title: "Crear un clúster de Amazon Redshift con la AWS CLI",
      code: `# Crea un cluster de Redshift de un solo nodo para analitica.
# En produccion se usan varios nodos y credenciales gestionadas de forma segura.
aws redshift create-cluster \\
  --cluster-identifier analitica-dw \\
  --node-type ra3.xlplus \\
  --number-of-nodes 1 \\
  --master-username adminuser \\
  --master-user-password "$REDSHIFT_PASSWORD" \\
  --region us-east-2`,
    },
    {
      type: "callout",
      variant: "warning",
      text:
        "No incrustes contraseñas en texto plano en tus comandos ni en el historial del shell. Usa variables de entorno o, mejor aún, AWS Secrets Manager para gestionar las credenciales del clúster de Redshift.",
    },
    { type: "heading", level: 2, text: "Amazon EMR: big data gestionado" },
    {
      type: "paragraph",
      text:
        "Amazon EMR (Elastic MapReduce) es una plataforma de big data gestionada para ejecutar frameworks de código abierto como Apache Spark, Apache Hadoop, Apache Hive y Presto sobre clústeres escalables. EMR se encarga de aprovisionar y administrar la infraestructura, de modo que te concentras en procesar y analizar grandes volúmenes de datos almacenados, por ejemplo, en S3.",
    },
    {
      type: "list",
      items: [
        "Frameworks de código abierto: Spark, Hadoop, Hive, HBase, Presto, entre otros, gestionados por AWS.",
        "Elasticidad: los clústeres escalan nodos según la carga y pueden ser transitorios (se crean, procesan y se apagan).",
        "Integración con S3: lee y escribe datos directamente desde el lago de datos usando EMRFS.",
        "Opciones de ejecución: sobre EC2, sobre Amazon EKS o EMR Serverless, según el modelo operativo deseado.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      text:
        "Elige EMR cuando ya trabajas con frameworks de código abierto (sobre todo Apache Spark) o necesitas transformaciones de big data a medida. Para consultas SQL ad hoc sencillas sobre S3, Athena suele ser más simple y económico.",
    },
    { type: "heading", level: 2, text: "Amazon Kinesis: datos en streaming" },
    {
      type: "paragraph",
      text:
        "Amazon Kinesis es una familia de servicios para recopilar, procesar y analizar datos en streaming en tiempo real. Kinesis Data Streams captura flujos continuos de registros (logs, clics, telemetría) organizados en fragmentos (shards); Kinesis Data Firehose entrega esos flujos a destinos como S3, Redshift u OpenSearch; y Managed Service for Apache Flink permite analizar el stream en tiempo real.",
    },
    {
      type: "code",
      lang: "bash",
      title: "Crear un stream de Amazon Kinesis Data Streams con la AWS CLI",
      code: `# Crea un stream con un numero inicial de shards (fragmentos).
# Cada shard aporta capacidad de ingesta; se escala agregando shards.
aws kinesis create-stream \\
  --stream-name eventos-clickstream \\
  --shard-count 2 \\
  --region us-east-2`,
    },
    {
      type: "callout",
      variant: "success",
      text:
        "Regla práctica: Redshift para analizar grandes volúmenes históricos con SQL (data warehouse), EMR para procesamiento masivo con frameworks de código abierto, y Kinesis para datos que llegan de forma continua y hay que procesar en tiempo real.",
    },
    { type: "heading", level: 2, text: "Servicios de esta lección" },
    {
      type: "serviceIcon",
      items: [
        { service: "Amazon Redshift", icon: "analytics-redshift" },
        { service: "Amazon EMR", icon: "analytics-emr" },
        { service: "Amazon Kinesis", icon: "analytics-kinesis" },
      ],
    },
  ],
  selfCheck: [
    {
      question:
        "¿Qué caracteriza a Amazon Redshift como almacén de datos (data warehouse)?",
      options: [
        "Es un servicio de streaming para procesar datos en tiempo real por shards",
        "Es un almacenamiento columnar con arquitectura de procesamiento masivamente paralelo (MPP) optimizado para analítica (OLAP)",
        "Es una plataforma para ejecutar Apache Spark y Hadoop sobre clústeres transitorios",
        "Es un motor serverless que solo consulta datos en S3 sin almacenar nada",
      ],
      correctIndex: 1,
      explanation:
        "Redshift es un data warehouse columnar y masivamente paralelo (MPP), optimizado para consultas analíticas (OLAP) a gran escala. Redshift Spectrum le permite además consultar datos directamente en S3.",
    },
    {
      question:
        "Necesitas procesar un flujo continuo de eventos de clics que llegan en tiempo real. ¿Qué servicio es el más adecuado?",
      options: [
        "Amazon Redshift, porque almacena grandes volúmenes históricos",
        "Amazon EMR, porque ejecuta frameworks de código abierto en lotes",
        "Amazon Kinesis, porque está diseñado para ingerir y procesar datos en streaming en tiempo real",
        "Amazon Athena, porque ejecuta SQL serverless sobre archivos en S3",
      ],
      correctIndex: 2,
      explanation:
        "Amazon Kinesis está diseñado para capturar y procesar datos en streaming en tiempo real. Kinesis Data Streams ingiere los eventos en shards y otros servicios de la familia los entregan o analizan conforme llegan.",
    },
  ],
};
