import type { Lesson } from "@/lib/types";

// Capa_Temática: Cómputo (Nivel BÁSICO, dayRange [4, 6]).
// Tema: Amazon EC2 — instancias, AMIs, tipos de instancia y grupos de seguridad.
// Trazabilidad: Req 3.2, 5.1, 5.2, 9.1, 9.4, 11.3.
export const day04: Lesson = {
  day: 4,
  slug: "computo-ec2",
  title: "Amazon EC2: instancias, AMIs, tipos y grupos de seguridad",
  section: "Cómputo",
  estimatedMinutes: 30,
  icon: "compute-ec2",
  objectives: [
    "Comprender qué es una instancia de Amazon EC2 y el modelo de capacidad de cómputo bajo demanda",
    "Distinguir el rol de una AMI (Amazon Machine Image) y de las familias y tipos de instancia",
    "Configurar un grupo de seguridad como firewall virtual con estado para una instancia",
  ],
  blocks: [
    {
      type: "paragraph",
      text:
        "Amazon Elastic Compute Cloud (Amazon EC2) proporciona capacidad de cómputo redimensionable en la nube de AWS. Una instancia es un servidor virtual que ejecutas sobre la infraestructura de AWS: eliges su configuración de CPU, memoria, almacenamiento y red, y pagas únicamente por la capacidad que consumes.",
    },
    {
      type: "serviceIcon",
      items: [{ service: "Amazon EC2", icon: "compute-ec2" }],
    },
    { type: "heading", level: 2, text: "AMI: la plantilla de arranque" },
    {
      type: "paragraph",
      text:
        "Una Amazon Machine Image (AMI) es la plantilla que define el sistema operativo, el servidor de aplicaciones y las aplicaciones con las que arranca una instancia. AWS publica AMIs oficiales (por ejemplo Amazon Linux 2023), y también puedes crear AMIs propias para estandarizar tus despliegues. Toda instancia se lanza a partir de una AMI concreta identificada por un ID con el prefijo ami-.",
    },
    {
      type: "callout",
      variant: "info",
      text:
        "La AMI determina el estado inicial del disco raíz. Crear una AMI personalizada a partir de una instancia ya configurada es una práctica común para arranques reproducibles y escalado rápido.",
    },
    { type: "heading", level: 2, text: "Familias y tipos de instancia" },
    {
      type: "paragraph",
      text:
        "El tipo de instancia determina el hardware virtual asignado: número de vCPU, memoria, rendimiento de red y almacenamiento. AWS agrupa los tipos en familias según su perfil de uso. La nomenclatura (por ejemplo t3.micro o m5.large) combina la familia, la generación y el tamaño.",
    },
    {
      type: "list",
      items: [
        "Propósito general (T, M): equilibrio entre cómputo, memoria y red. Las familias T ofrecen rendimiento ampliable (burstable) mediante créditos de CPU.",
        "Optimizadas para cómputo (C): alta relación de CPU para cargas intensivas en procesamiento.",
        "Optimizadas para memoria (R, X): grandes volúmenes de memoria para bases de datos en memoria y análisis.",
        "Optimizadas para almacenamiento (I, D) y para cómputo acelerado (P, G) con GPU.",
      ],
    },
    { type: "heading", level: 2, text: "Grupos de seguridad: firewall virtual con estado" },
    {
      type: "paragraph",
      text:
        "Un grupo de seguridad (security group) actúa como firewall virtual a nivel de instancia y controla el tráfico entrante y saliente. Es stateful: si permites una conexión entrante, el tráfico de respuesta se autoriza automáticamente sin necesidad de una regla de salida explícita. Solo admite reglas de permiso (allow); no existen reglas de denegación.",
    },
    {
      type: "serviceIcon",
      items: [{ service: "Amazon EC2 Auto Scaling", icon: "compute-auto-scaling" }],
    },
    {
      type: "code",
      lang: "bash",
      title: "Crear un grupo de seguridad y abrir SSH (puerto 22)",
      code:
        'aws ec2 create-security-group \\\n' +
        '  --group-name web-sg \\\n' +
        '  --description "Grupo de seguridad para servidor web" \\\n' +
        '  --vpc-id vpc-0a1b2c3d4e5f67890 \\\n' +
        "  --region us-east-1\n\n" +
        "aws ec2 authorize-security-group-ingress \\\n" +
        "  --group-id sg-0123456789abcdef0 \\\n" +
        "  --protocol tcp \\\n" +
        "  --port 22 \\\n" +
        "  --cidr 203.0.113.0/24 \\\n" +
        "  --region us-east-1",
      highlightLines: [7, 8],
    },
    {
      type: "code",
      lang: "bash",
      title: "Lanzar una instancia EC2 a partir de una AMI",
      code:
        "aws ec2 run-instances \\\n" +
        "  --image-id ami-0abcdef1234567890 \\\n" +
        "  --instance-type t3.micro \\\n" +
        "  --key-name mi-par-de-claves \\\n" +
        "  --security-group-ids sg-0123456789abcdef0 \\\n" +
        "  --subnet-id subnet-0123456789abcdef0 \\\n" +
        "  --count 1 \\\n" +
        "  --region us-east-1",
      highlightLines: [2, 3],
    },
    {
      type: "callout",
      variant: "warning",
      text:
        "Nunca abras el puerto 22 (SSH) o 3389 (RDP) al CIDR 0.0.0.0/0 en producción. Restringe el origen a rangos de IP conocidos y prefiere AWS Systems Manager Session Manager para el acceso sin exponer puertos.",
    },
  ],
  selfCheck: [
    {
      question: "¿Qué define una AMI (Amazon Machine Image)?",
      options: [
        "El tipo de hardware virtual (vCPU y memoria) asignado a la instancia",
        "Las reglas de tráfico entrante y saliente de la instancia",
        "La plantilla con el sistema operativo y software con que arranca la instancia",
        "La región y la zona de disponibilidad donde se ejecuta la instancia",
      ],
      correctIndex: 2,
      explanation:
        "La AMI es la plantilla de arranque: define el sistema operativo, el software preinstalado y el estado inicial del disco raíz a partir del cual se lanza la instancia.",
    },
    {
      question: "¿Por qué se dice que un grupo de seguridad de EC2 es stateful?",
      options: [
        "Porque guarda el estado de la instancia en disco de forma persistente",
        "Porque el tráfico de respuesta a una conexión permitida se autoriza automáticamente",
        "Porque permite tanto reglas de permiso como de denegación explícitas",
        "Porque mantiene una copia del tipo de instancia seleccionado",
      ],
      correctIndex: 1,
      explanation:
        "Un grupo de seguridad es con estado (stateful): si una conexión entrante está permitida, su tráfico de respuesta se permite automáticamente sin una regla de salida explícita.",
    },
  ],
};
