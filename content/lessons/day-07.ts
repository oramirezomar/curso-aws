import type { Lesson } from "@/lib/types";

// Capa_Temática: Almacenamiento y Bases de Datos (Nivel BÁSICO, day 7–9).
// Trazabilidad: Req 3.3, 5.1, 5.2, 9.1, 9.4, 11.3.
export const day07: Lesson = {
  day: 7,
  slug: "almacenamiento-s3",
  title: "Amazon S3: buckets, objetos, clases de almacenamiento y durabilidad",
  section: "Almacenamiento y Bases de Datos",
  estimatedMinutes: 25,
  icon: "storage-s3",
  objectives: [
    "Comprender el modelo de almacenamiento de objetos de Amazon S3 (buckets y objetos) frente al almacenamiento de bloques o de archivos",
    "Distinguir las clases de almacenamiento de S3 y el criterio para elegir cada una según el patrón de acceso",
    "Explicar las garantías de durabilidad y disponibilidad de S3 y operar objetos básicos con la AWS CLI",
  ],
  blocks: [
    {
      type: "paragraph",
      text:
        "Amazon Simple Storage Service (Amazon S3) es un servicio de almacenamiento de objetos que ofrece escalabilidad, disponibilidad de datos, seguridad y rendimiento. A diferencia del almacenamiento de bloques (EBS) o de archivos (EFS), S3 guarda los datos como objetos dentro de contenedores llamados buckets.",
    },
    {
      type: "heading",
      level: 2,
      text: "Buckets y objetos",
    },
    {
      type: "paragraph",
      text:
        "Un bucket es un contenedor de objetos. Cada objeto está formado por los datos en sí, una clave (key) que lo identifica de forma única dentro del bucket, y metadatos. El nombre de un bucket es único a nivel global en toda la partición de AWS y, salvo que se habilite el enrutamiento multirregión, un bucket reside en la Región donde se crea.",
    },
    {
      type: "list",
      items: [
        "Bucket: contenedor con un nombre único global; se asocia a una Región de AWS concreta.",
        "Objeto: unidad fundamental almacenada en S3; combina datos, clave y metadatos. El tamaño máximo de un objeto es de 5 TB.",
        "Clave (key): nombre completo del objeto dentro del bucket; los prefijos simulan una jerarquía de carpetas.",
      ],
    },
    {
      type: "serviceIcon",
      items: [{ service: "Amazon S3", icon: "storage-s3" }],
    },
    {
      type: "heading",
      level: 2,
      text: "Clases de almacenamiento",
    },
    {
      type: "paragraph",
      text:
        "S3 ofrece varias clases de almacenamiento diseñadas para distintos patrones de acceso y costos. Elegir la clase correcta optimiza el gasto sin sacrificar la durabilidad.",
    },
    {
      type: "list",
      items: [
        "S3 Standard: datos de acceso frecuente; baja latencia y alto rendimiento.",
        "S3 Intelligent-Tiering: mueve los objetos automáticamente entre niveles de acceso según el uso, sin cargos por recuperación.",
        "S3 Standard-IA y S3 One Zone-IA: acceso poco frecuente; menor costo de almacenamiento con cargo por recuperación.",
        "S3 Glacier Instant Retrieval, S3 Glacier Flexible Retrieval y S3 Glacier Deep Archive: archivado de largo plazo con costos muy bajos y tiempos de recuperación crecientes.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      text:
        "Amazon S3 Standard está diseñado para una durabilidad del 99,999999999 % (los \"once nueves\") de los objetos a lo largo de un año, almacenando los datos de forma redundante en varias Zonas de Disponibilidad.",
    },
    {
      type: "heading",
      level: 2,
      text: "Durabilidad frente a disponibilidad",
    },
    {
      type: "paragraph",
      text:
        "La durabilidad mide la probabilidad de que un objeto no se pierda a lo largo del tiempo; la disponibilidad mide la probabilidad de poder acceder a él en un momento dado. S3 Standard ofrece once nueves de durabilidad y un acuerdo de disponibilidad del 99,99 %. Las clases de una sola Zona de Disponibilidad (One Zone-IA) reducen el costo a cambio de menor tolerancia a la pérdida de una AZ.",
    },
    {
      type: "code",
      lang: "bash",
      title: "Crear un bucket y subir un objeto con la AWS CLI",
      code: `# Crear el bucket en la Región indicada
aws s3api create-bucket \\
  --bucket mi-curso-aws-bucket-demo \\
  --region us-east-1

# Subir (copiar) un archivo local al bucket
aws s3 cp ./informe.pdf s3://mi-curso-aws-bucket-demo/informes/informe.pdf \\
  --region us-east-1

# Listar el contenido del bucket
aws s3 ls s3://mi-curso-aws-bucket-demo/informes/ \\
  --region us-east-1`,
    },
    {
      type: "callout",
      variant: "warning",
      text:
        "En la Región us-east-1 no se debe enviar el parámetro LocationConstraint; en el resto de Regiones es obligatorio (por ejemplo, --create-bucket-configuration LocationConstraint=us-west-2). Incluye siempre --region en tus comandos.",
    },
    {
      type: "code",
      lang: "json",
      title: "Política de bucket que exige cifrado en tránsito (HTTPS)",
      code: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DenyInsecureTransport",
      "Effect": "Deny",
      "Principal": "*",
      "Action": "s3:*",
      "Resource": [
        "arn:aws:s3:::mi-curso-aws-bucket-demo",
        "arn:aws:s3:::mi-curso-aws-bucket-demo/*"
      ],
      "Condition": {
        "Bool": { "aws:SecureTransport": "false" }
      }
    }
  ]
}`,
    },
    {
      type: "checklist",
      title: "Buenas prácticas al empezar con S3",
      items: [
        "Mantener el bloqueo de acceso público activado salvo que exista un motivo justificado.",
        "Habilitar el versionado para proteger contra sobrescrituras y borrados accidentales.",
        "Elegir la clase de almacenamiento según el patrón de acceso y automatizar transiciones con reglas de ciclo de vida.",
      ],
    },
  ],
  selfCheck: [
    {
      question:
        "¿Cuál es la durabilidad de diseño de la clase S3 Standard para los objetos a lo largo de un año?",
      options: [
        "99,9 % (tres nueves)",
        "99,99 % (cuatro nueves)",
        "99,999999999 % (once nueves)",
        "100 %, sin posibilidad de pérdida",
      ],
      correctIndex: 2,
      explanation:
        "S3 Standard está diseñado para una durabilidad del 99,999999999 % (once nueves), replicando los datos en varias Zonas de Disponibilidad. La disponibilidad, en cambio, se acuerda en 99,99 %.",
    },
    {
      question:
        "¿Qué clase de almacenamiento conviene cuando el patrón de acceso de los objetos es impredecible y se quiere optimizar costos sin cargos por recuperación?",
      options: [
        "S3 Glacier Deep Archive",
        "S3 Intelligent-Tiering",
        "S3 One Zone-IA",
        "S3 Standard",
      ],
      correctIndex: 1,
      explanation:
        "S3 Intelligent-Tiering mueve automáticamente los objetos entre niveles de acceso según cómo se usan y no cobra cargos por recuperación, lo que la hace ideal para patrones de acceso impredecibles.",
    },
  ],
};
