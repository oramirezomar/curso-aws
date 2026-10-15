import type { Lesson } from "@/lib/types";

// Capa_Temática: Almacenamiento y Bases de Datos (Nivel BÁSICO, day 7–9).
// Trazabilidad: Req 3.3, 5.1, 5.2, 9.1, 9.4, 11.3.
export const day08: Lesson = {
  day: 8,
  slug: "almacenamiento-rds-elasticache",
  title: "Bases de datos gestionadas: Amazon RDS y Amazon ElastiCache",
  section: "Almacenamiento y Bases de Datos",
  estimatedMinutes: 25,
  icon: "database-rds",
  objectives: [
    "Describir qué resuelve una base de datos relacional gestionada como Amazon RDS frente a administrar un motor por cuenta propia",
    "Identificar los motores de RDS y el papel de Multi-AZ y las réplicas de lectura en alta disponibilidad y escalabilidad",
    "Comprender cuándo introducir una caché en memoria con Amazon ElastiCache (Redis OSS / Memcached) para reducir latencia",
  ],
  blocks: [
    {
      type: "paragraph",
      text:
        "Amazon Relational Database Service (Amazon RDS) es un servicio gestionado que facilita la configuración, operación y escalado de bases de datos relacionales en la nube. AWS se encarga de tareas administrativas como el aprovisionamiento del hardware, la instalación del motor, los parches y las copias de seguridad, de modo que el equipo se concentra en los datos y la aplicación.",
    },
    {
      type: "heading",
      level: 2,
      text: "Motores soportados por Amazon RDS",
    },
    {
      type: "list",
      items: [
        "Amazon Aurora (compatible con MySQL y PostgreSQL)",
        "MySQL",
        "MariaDB",
        "PostgreSQL",
        "Oracle Database",
        "Microsoft SQL Server",
        "Db2",
      ],
    },
    {
      type: "serviceIcon",
      items: [
        { service: "Amazon RDS", icon: "database-rds" },
        { service: "Amazon ElastiCache", icon: "database-elasticache" },
      ],
    },
    {
      type: "heading",
      level: 2,
      text: "Alta disponibilidad: despliegues Multi-AZ",
    },
    {
      type: "paragraph",
      text:
        "En una implementación Multi-AZ, RDS mantiene una instancia en espera (standby) en una Zona de Disponibilidad distinta y replica los datos de forma síncrona. Si la instancia principal falla, RDS realiza una conmutación por error (failover) automática hacia la standby, lo que mejora la disponibilidad y la tolerancia a fallos de una AZ.",
    },
    {
      type: "heading",
      level: 3,
      text: "Escalado de lecturas: réplicas de lectura",
    },
    {
      type: "paragraph",
      text:
        "Las réplicas de lectura (read replicas) usan replicación asíncrona para servir tráfico de solo lectura y descargar la instancia principal. A diferencia del standby de Multi-AZ, las réplicas de lectura sí aceptan consultas y ayudan a escalar cargas de trabajo con mucha lectura.",
    },
    {
      type: "code",
      lang: "bash",
      title: "Crear una instancia de base de datos PostgreSQL en RDS",
      code: `aws rds create-db-instance \\
  --db-instance-identifier curso-aws-db \\
  --db-instance-class db.t3.micro \\
  --engine postgres \\
  --master-username adminuser \\
  --manage-master-user-password \\
  --allocated-storage 20 \\
  --multi-az \\
  --region us-east-1`,
    },
    {
      type: "callout",
      variant: "info",
      text:
        "La opción --manage-master-user-password delega la gestión de la contraseña maestra en AWS Secrets Manager, evitando exponer credenciales en texto plano en los comandos o scripts.",
    },
    {
      type: "heading",
      level: 2,
      text: "Caché en memoria: Amazon ElastiCache",
    },
    {
      type: "paragraph",
      text:
        "Amazon ElastiCache es un servicio de almacenamiento en caché en memoria totalmente gestionado. Al colocar datos de acceso frecuente en memoria, reduce la latencia a escala de microsegundos a milisegundos y descarga de trabajo a la base de datos principal. Ofrece los motores Valkey, Redis OSS y Memcached.",
    },
    {
      type: "list",
      items: [
        "Redis OSS / Valkey: estructuras de datos avanzadas, persistencia opcional, réplicas y alta disponibilidad; apto para rankings, colas y sesiones.",
        "Memcached: modelo sencillo de pares clave-valor, multihilo, pensado para cachés simples y horizontalmente escalables.",
        "Patrón común: cache-aside (lazy loading), donde la aplicación consulta primero la caché y, ante un fallo, recurre a la base de datos y rellena la caché.",
      ],
    },
    {
      type: "code",
      lang: "bash",
      title: "Crear un clúster ElastiCache con el motor Redis OSS",
      code: `aws elasticache create-cache-cluster \\
  --cache-cluster-id curso-aws-cache \\
  --engine redis \\
  --cache-node-type cache.t3.micro \\
  --num-cache-nodes 1 \\
  --region us-east-1`,
    },
    {
      type: "callout",
      variant: "warning",
      text:
        "ElastiCache es una caché, no la fuente de verdad: ante un fallo del nodo, los datos en memoria pueden perderse. Diseña la aplicación para repoblar la caché desde la base de datos cuando sea necesario.",
    },
    {
      type: "checklist",
      title: "Decisiones de arquitectura con RDS y ElastiCache",
      items: [
        "Activar Multi-AZ en producción para tolerar la caída de una Zona de Disponibilidad.",
        "Usar réplicas de lectura para escalar cargas con predominio de lecturas.",
        "Introducir ElastiCache delante de la base de datos para datos calientes y reducir la latencia.",
      ],
    },
  ],
  selfCheck: [
    {
      question:
        "¿Qué diferencia principal existe entre la instancia standby de Multi-AZ y una réplica de lectura en Amazon RDS?",
      options: [
        "No existe diferencia: ambas sirven consultas de lectura por igual",
        "La standby de Multi-AZ no acepta consultas y existe para failover; la réplica de lectura sí sirve tráfico de solo lectura",
        "La réplica de lectura usa replicación síncrona y la standby asíncrona",
        "La standby escala las escrituras y la réplica de lectura escala el almacenamiento",
      ],
      correctIndex: 1,
      explanation:
        "La instancia standby de Multi-AZ se replica de forma síncrona y solo entra en juego durante un failover; no atiende consultas. Las réplicas de lectura se replican de forma asíncrona y sí sirven tráfico de solo lectura para escalar lecturas.",
    },
    {
      question:
        "¿Cuál es el motivo principal para colocar Amazon ElastiCache delante de una base de datos relacional?",
      options: [
        "Reemplazar por completo la base de datos como almacén durable",
        "Reducir la latencia de acceso a datos de uso frecuente y descargar trabajo de la base de datos",
        "Cifrar automáticamente todas las tablas de la base de datos",
        "Aplicar parches del sistema operativo de la base de datos",
      ],
      correctIndex: 1,
      explanation:
        "ElastiCache mantiene en memoria los datos de acceso frecuente, lo que reduce la latencia y alivia la carga de la base de datos principal. No es un almacén durable que sustituya a la base de datos.",
    },
  ],
};
