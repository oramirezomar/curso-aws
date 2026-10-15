import type { Lesson } from "@/lib/types";

export const day01: Lesson = {
  day: 1,
  slug: "fundamentos-consola-regiones",
  title: "La Consola de AWS y la estructura global: cuenta, Regiones y Zonas de Disponibilidad",
  section: "Fundamentos de AWS",
  estimatedMinutes: 25,
  icon: "layer-fundamentos",
  objectives: [
    "Comprender qué es una cuenta de AWS y su rol como límite de facturación y aislamiento",
    "Diferenciar una Región de una Zona de Disponibilidad (AZ) y por qué AWS diseña su infraestructura así",
    "Reconocer la diferencia entre servicios regionales y servicios globales",
    "Configurar la AWS CLI y consultar las Regiones disponibles desde la terminal",
  ],
  blocks: [
    {
      type: "paragraph",
      text:
        "Antes de desplegar un solo recurso en AWS necesitas entender dónde vive ese recurso. AWS no es un único centro de datos: es una infraestructura global organizada en una jerarquía deliberada de cuenta, Regiones y Zonas de Disponibilidad. Confundir estos conceptos es la causa número uno de errores de principiante: desde no encontrar un recurso que creaste, hasta diseñar una arquitectura que no sobrevive a la caída de un centro de datos.",
    },
    { type: "heading", level: 2, text: "La cuenta de AWS" },
    {
      type: "paragraph",
      text:
        "La cuenta de AWS es el contenedor raíz de todos tus recursos. Define el límite de facturación (todo lo que consumas se factura a esa cuenta) y el límite de aislamiento por defecto: los recursos de una cuenta no son visibles ni accesibles desde otra cuenta salvo que lo autorices explícitamente. Cada cuenta tiene un identificador numérico de 12 dígitos, el Account ID.",
    },
    {
      type: "callout",
      variant: "warning",
      text:
        "El usuario raíz (root user) es la identidad que se crea con el correo de la cuenta y tiene acceso ilimitado. AWS recomienda NO usarlo para el día a día: actívale MFA, guárdalo bajo llave y opera con identidades de IAM. Lo veremos en detalle en la lección 2.",
    },
    { type: "heading", level: 2, text: "Regiones y Zonas de Disponibilidad" },
    {
      type: "paragraph",
      text:
        "Una Región de AWS es una ubicación geográfica física del mundo (por ejemplo us-east-1 en el norte de Virginia o eu-west-1 en Irlanda). Cada Región es independiente de las demás: tiene su propio código, su propia latencia y su propia disponibilidad de servicios y precios.",
    },
    {
      type: "paragraph",
      text:
        "Dentro de cada Región, AWS opera varias Zonas de Disponibilidad (Availability Zones o AZ). Una AZ es uno o más centros de datos discretos con energía, refrigeración y red redundantes. Las AZ de una misma Región están físicamente separadas (a kilómetros de distancia) pero conectadas por redes de baja latencia. Distribuir una aplicación en varias AZ es la forma estándar de tolerar la caída de un centro de datos completo.",
    },
    {
      type: "serviceIcon",
      items: [
        { service: "Fundamentos de AWS", icon: "layer-fundamentos" },
        { service: "Amazon EC2", icon: "compute-ec2" },
        { service: "Amazon VPC", icon: "networking-vpc" },
      ],
    },
    { type: "heading", level: 3, text: "Servicios regionales vs. servicios globales" },
    {
      type: "list",
      items: [
        "Servicios regionales: la mayoría. Los recursos viven en una Región concreta (una instancia EC2, una tabla DynamoDB, una cola SQS). Si cambias de Región en la consola, dejarás de verlos.",
        "Servicios globales: no están atados a una Región. Los más conocidos son IAM, Amazon Route 53, Amazon CloudFront y AWS WAF (para distribuciones de CloudFront).",
      ],
    },
    {
      type: "callout",
      variant: "info",
      text:
        "El error clásico: creas un bucket o una instancia en una Región, cambias el selector de Región en la esquina superior derecha de la consola y 'desaparece'. No se borró: solo estás mirando otra Región.",
    },
    { type: "heading", level: 2, text: "Primeros pasos con la AWS CLI" },
    {
      type: "paragraph",
      text:
        "La consola web es cómoda para explorar, pero el trabajo serio se hace con la AWS CLI porque es reproducible y automatizable. El primer paso es configurar tus credenciales y la Región por defecto con aws configure.",
    },
    {
      type: "code",
      lang: "bash",
      title: "Configurar la AWS CLI por primera vez",
      code:
        "# Configura Access Key, Secret Key, Región por defecto y formato de salida\naws configure\n\n# Verifica qué identidad está usando la CLI\naws sts get-caller-identity --region us-east-1",
    },
    {
      type: "paragraph",
      text:
        "Una vez configurada, puedes consultar la lista de Regiones habilitadas en tu cuenta. Fíjate en que todos los comandos incluyen --region de forma explícita: es una buena práctica para no depender de la Región por defecto del perfil.",
    },
    {
      type: "code",
      lang: "bash",
      title: "Listar Regiones y Zonas de Disponibilidad",
      code:
        "# Listar las Regiones disponibles para tu cuenta\naws ec2 describe-regions --region us-east-1 --output table\n\n# Listar las Zonas de Disponibilidad de una Región concreta\naws ec2 describe-availability-zones --region us-east-1 --output table",
    },
    {
      type: "callout",
      variant: "success",
      text:
        "Regla práctica de diseño: elige la Región más cercana a tus usuarios (menor latencia) o la que exija tu normativa de residencia de datos, y despliega siempre en al menos dos Zonas de Disponibilidad para alta disponibilidad.",
    },
  ],
  selfCheck: [
    {
      question: "¿Cuál es la diferencia correcta entre una Región y una Zona de Disponibilidad?",
      options: [
        "Son sinónimos; AWS usa ambos términos indistintamente",
        "Una Región es una ubicación geográfica que contiene varias Zonas de Disponibilidad, cada una con uno o más centros de datos aislados",
        "Una Zona de Disponibilidad contiene varias Regiones",
        "Una Región es un único centro de datos y una Zona de Disponibilidad es un rack dentro de él",
      ],
      correctIndex: 1,
      explanation:
        "Una Región es una ubicación geográfica (p. ej. us-east-1) compuesta por múltiples Zonas de Disponibilidad. Cada AZ son uno o más centros de datos con energía, red y refrigeración independientes, separados físicamente pero conectados con baja latencia.",
    },
    {
      question: "¿Cuál de estos servicios es GLOBAL y no está atado a una Región?",
      options: [
        "Amazon EC2",
        "Amazon DynamoDB",
        "AWS IAM",
        "Amazon SQS",
      ],
      correctIndex: 2,
      explanation:
        "IAM es un servicio global: sus usuarios, roles y políticas no pertenecen a una Región concreta. EC2, DynamoDB y SQS son servicios regionales, por lo que sus recursos viven en la Región donde los creaste.",
    },
    {
      question: "Creaste una instancia en la consola y al rato 'desapareció'. ¿Cuál es la causa más probable?",
      options: [
        "AWS la terminó automáticamente por inactividad",
        "Cambiaste el selector de Región en la consola y estás mirando otra Región",
        "Se movió sola a otra Zona de Disponibilidad",
        "El usuario raíz la ocultó por seguridad",
      ],
      correctIndex: 1,
      explanation:
        "Los recursos regionales solo son visibles en la Región donde se crearon. Cambiar el selector de Región en la consola hace que dejes de ver recursos que siguen existiendo en la Región original.",
    },
  ],
};
