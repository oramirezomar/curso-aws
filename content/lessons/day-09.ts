import type { Lesson } from "@/lib/types";

// Capa_Temática: Almacenamiento y Bases de Datos (Nivel BÁSICO, day 7–9).
// Trazabilidad: Req 3.3, 5.1, 5.2, 9.1, 9.4, 11.3.
export const day09: Lesson = {
  day: 9,
  slug: "almacenamiento-dynamodb-efs",
  title: "Amazon DynamoDB (NoSQL) y Amazon EFS (sistema de archivos)",
  section: "Almacenamiento y Bases de Datos",
  estimatedMinutes: 25,
  icon: "database-dynamodb",
  objectives: [
    "Explicar el modelo de datos NoSQL de Amazon DynamoDB (tablas, elementos, atributos y claves) y su rendimiento a cualquier escala",
    "Distinguir los modos de capacidad bajo demanda y aprovisionada en DynamoDB",
    "Comprender cuándo usar Amazon EFS como sistema de archivos compartido y elástico para múltiples instancias",
  ],
  blocks: [
    {
      type: "paragraph",
      text:
        "Amazon DynamoDB es una base de datos NoSQL de clave-valor y documentos, totalmente gestionada y sin servidores (serverless), que ofrece rendimiento de un dígito de milisegundos a cualquier escala. No requiere aprovisionar ni administrar servidores, y escala horizontalmente de forma transparente.",
    },
    {
      type: "heading",
      level: 2,
      text: "Modelo de datos de DynamoDB",
    },
    {
      type: "list",
      items: [
        "Tabla: colección de elementos; no impone un esquema fijo más allá de la clave primaria.",
        "Elemento (item): conjunto de atributos identificado de forma única por su clave primaria; equivale a una fila.",
        "Atributo: par nombre-valor que compone un elemento.",
        "Clave primaria: puede ser una clave de partición simple, o compuesta por clave de partición más clave de ordenación (sort key).",
      ],
    },
    {
      type: "serviceIcon",
      items: [
        { service: "Amazon DynamoDB", icon: "database-dynamodb" },
        { service: "Amazon EFS", icon: "storage-efs" },
      ],
    },
    {
      type: "heading",
      level: 2,
      text: "Modos de capacidad",
    },
    {
      type: "paragraph",
      text:
        "DynamoDB ofrece dos modos de capacidad. En el modo bajo demanda (on-demand), se paga por las solicitudes de lectura y escritura reales sin planificar capacidad, ideal para cargas impredecibles. En el modo aprovisionado (provisioned), se definen unidades de capacidad de lectura y escritura, con la opción de Auto Scaling, lo que resulta más económico para cargas estables y predecibles.",
    },
    {
      type: "code",
      lang: "bash",
      title: "Crear una tabla DynamoDB en modo bajo demanda",
      code: `aws dynamodb create-table \\
  --table-name Clientes \\
  --attribute-definitions AttributeName=clienteId,AttributeType=S \\
  --key-schema AttributeName=clienteId,KeyType=HASH \\
  --billing-mode PAY_PER_REQUEST \\
  --region us-east-1`,
    },
    {
      type: "code",
      lang: "bash",
      title: "Insertar un elemento con put-item en DynamoDB",
      code: `aws dynamodb put-item \\
  --table-name Clientes \\
  --item '{
    "clienteId": {"S": "C-1001"},
    "nombre": {"S": "Ada Lovelace"},
    "activo": {"BOOL": true}
  }' \\
  --region us-east-1`,
    },
    {
      type: "callout",
      variant: "info",
      text:
        "En DynamoDB cada atributo se expresa con su tipo: S (string), N (number), BOOL (booleano), M (mapa), L (lista), entre otros. Elegir una buena clave de partición es clave para distribuir la carga de forma uniforme.",
    },
    {
      type: "heading",
      level: 2,
      text: "Amazon EFS: sistema de archivos compartido y elástico",
    },
    {
      type: "paragraph",
      text:
        "Amazon Elastic File System (Amazon EFS) proporciona un sistema de archivos NFS totalmente gestionado y elástico que crece y se reduce automáticamente a medida que se agregan o eliminan archivos. A diferencia de un volumen EBS, que se adjunta a una sola instancia, un sistema de archivos EFS puede montarse simultáneamente desde muchas instancias EC2 y contenedores, incluso en varias Zonas de Disponibilidad.",
    },
    {
      type: "list",
      items: [
        "EFS (archivos): acceso concurrente compartido vía NFS desde múltiples instancias y AZ; elástico.",
        "EBS (bloques): volumen de bloques adjunto normalmente a una sola instancia.",
        "S3 (objetos): almacenamiento de objetos accesible por API HTTP, no montable como sistema de archivos POSIX tradicional.",
      ],
    },
    {
      type: "code",
      lang: "bash",
      title: "Crear un sistema de archivos EFS con cifrado en reposo",
      code: `aws efs create-file-system \\
  --performance-mode generalPurpose \\
  --throughput-mode bursting \\
  --encrypted \\
  --tags Key=Name,Value=curso-aws-efs \\
  --region us-east-1`,
    },
    {
      type: "callout",
      variant: "warning",
      text:
        "EFS es ideal para cargas que necesitan almacenamiento compartido POSIX entre varias instancias (por ejemplo, directorios de aplicaciones o contenido web). Para una base de datos de alto rendimiento adjunta a una sola instancia, EBS suele ser la opción adecuada.",
    },
    {
      type: "checklist",
      title: "Elegir el almacenamiento correcto",
      items: [
        "¿Clave-valor o documentos a gran escala con baja latencia? Amazon DynamoDB.",
        "¿Sistema de archivos compartido entre varias instancias y AZ? Amazon EFS.",
        "¿Objetos estáticos accesibles por HTTP y archivado económico? Amazon S3.",
      ],
    },
  ],
  selfCheck: [
    {
      question:
        "En Amazon DynamoDB, ¿qué modo de capacidad conviene cuando el tráfico es impredecible y no se desea planificar capacidad por adelantado?",
      options: [
        "Modo aprovisionado sin Auto Scaling",
        "Modo bajo demanda (on-demand / PAY_PER_REQUEST)",
        "Modo aprovisionado con capacidad fija máxima",
        "Modo multi-maestro global obligatorio",
      ],
      correctIndex: 1,
      explanation:
        "El modo bajo demanda (PAY_PER_REQUEST) cobra por las lecturas y escrituras reales sin necesidad de planificar capacidad, lo que lo hace idóneo para cargas de trabajo impredecibles o con picos.",
    },
    {
      question:
        "¿Cuál es la ventaja distintiva de Amazon EFS frente a un volumen EBS?",
      options: [
        "EFS almacena objetos accesibles por HTTP como S3",
        "EFS puede montarse simultáneamente desde múltiples instancias EC2 en varias Zonas de Disponibilidad",
        "EFS solo puede adjuntarse a una única instancia a la vez",
        "EFS sustituye a una base de datos relacional",
      ],
      correctIndex: 1,
      explanation:
        "EFS ofrece un sistema de archivos NFS elástico que varias instancias EC2 y contenedores pueden montar a la vez, incluso en diferentes AZ. Un volumen EBS, en cambio, suele adjuntarse a una sola instancia.",
    },
  ],
};
