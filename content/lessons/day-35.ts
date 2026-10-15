import type { Lesson } from "@/lib/types";

// Capa_Temática "Migración y Recuperación ante Desastres" (dayRange [35, 35]).
// Día 35 — Mover cargas a la nube y sobrevivir a los desastres: AWS DMS
// (Database Migration Service) para migrar bases de datos, AWS Backup para
// la copia de seguridad centralizada, y las cuatro estrategias de
// Recuperación ante Desastres (backup & restore, pilot light, warm standby y
// multi-site active/active) medidas con RPO y RTO.
//
// Trazabilidad: Req 3.16, 5.1, 5.2, 9.1, 9.4, 11.3.
export const day35: Lesson = {
  day: 35,
  slug: "migracion-dr",
  title:
    "Migración y Recuperación ante Desastres: AWS DMS, AWS Backup y estrategias de DR con RPO/RTO",
  section: "Migración y Recuperación ante Desastres",
  estimatedMinutes: 35,
  icon: "migration-dms",
  objectives: [
    "Entender AWS DMS (Database Migration Service) como servicio para migrar bases de datos a AWS con mínima interrupción, incluida la replicación continua (CDC)",
    "Comprender AWS Backup como servicio centralizado de copias de seguridad gobernadas por planes y políticas",
    "Diferenciar las cuatro estrategias de Recuperación ante Desastres (backup & restore, pilot light, warm standby y multi-site active/active) y su relación con RPO y RTO",
  ],
  blocks: [
    {
      type: "paragraph",
      text:
        "Llevar una carga de trabajo a AWS tiene dos caras que a menudo se confunden: la migración (cómo mueves tus datos y sistemas a la nube) y la recuperación ante desastres (cómo sigues operando cuando algo falla de forma catastrófica). En esta lección cubrimos AWS DMS para migrar bases de datos, AWS Backup para gobernar las copias de seguridad de forma centralizada, y el marco de estrategias de DR que te permite decidir cuánto estás dispuesto a perder y cuánto tardas en recuperarte.",
    },
    {
      type: "callout",
      variant: "info",
      text:
        "AWS DMS y AWS Backup son servicios regionales: creas y operas sus recursos en una Región concreta. Por eso en la CLI de AWS conviene indicar siempre --region de forma explícita y no depender de la Región por defecto del perfil.",
    },
    { type: "heading", level: 2, text: "AWS DMS: migrar bases de datos" },
    {
      type: "paragraph",
      text:
        "AWS Database Migration Service (DMS) migra bases de datos hacia AWS manteniendo el origen operativo durante casi todo el proceso. Puede hacer migraciones homogéneas (mismo motor, por ejemplo Oracle a Oracle) o heterogéneas (motores distintos, por ejemplo Oracle a Amazon Aurora PostgreSQL, apoyándose en AWS Schema Conversion Tool para convertir el esquema). La pieza central es una instancia de replicación que lee del endpoint de origen y escribe en el de destino.",
    },
    {
      type: "list",
      items: [
        "Instancia de replicación: el recurso de cómputo gestionado que ejecuta la tarea de migración entre origen y destino.",
        "Endpoints: la definición de conexión del origen (source) y del destino (target), con su motor, host y credenciales.",
        "Tarea de replicación (replication task): define qué migrar y en qué modo (migración completa, solo CDC, o completa seguida de CDC).",
        "CDC (Change Data Capture): replicación continua de los cambios que ocurren en el origen mientras migras, para mantener destino y origen sincronizados y poder hacer un corte (cutover) con mínima interrupción.",
      ],
    },
    {
      type: "code",
      lang: "bash",
      title: "Crear una tarea de replicación DMS con carga completa y CDC (CLI de AWS)",
      code:
        "aws dms create-replication-task \\\n" +
        "  --replication-task-identifier migracion-ventas \\\n" +
        "  --source-endpoint-arn arn:aws:dms:us-east-1:111122223333:endpoint:ORIGEN \\\n" +
        "  --target-endpoint-arn arn:aws:dms:us-east-1:111122223333:endpoint:DESTINO \\\n" +
        "  --replication-instance-arn arn:aws:dms:us-east-1:111122223333:rep:INSTANCIA \\\n" +
        "  --migration-type full-load-and-cdc \\\n" +
        "  --table-mappings file://table-mappings.json \\\n" +
        "  --region us-east-1",
    },
    {
      type: "callout",
      variant: "warning",
      text:
        "DMS migra los datos, no necesariamente el esquema completo en una migración heterogénea. Para convertir tablas almacenadas, vistas, procedimientos y demás objetos entre motores distintos, usa AWS Schema Conversion Tool (AWS SCT) antes de arrancar la tarea de replicación.",
    },
    { type: "heading", level: 2, text: "AWS Backup: copias de seguridad centralizadas" },
    {
      type: "paragraph",
      text:
        "AWS Backup centraliza y automatiza las copias de seguridad de muchos servicios (Amazon EBS, Amazon RDS, Amazon DynamoDB, Amazon EFS, entre otros) desde un único punto de control. En lugar de configurar la retención servicio por servicio, defines un plan de copias (backup plan) con reglas de frecuencia y retención, lo asignas a los recursos mediante selecciones o etiquetas, y Backup se encarga de ejecutar y vencer las copias según la política.",
    },
    {
      type: "list",
      ordered: true,
      items: [
        "Define un almacén de copias (backup vault) donde se guardan y protegen los puntos de recuperación.",
        "Crea un plan de copias con una o varias reglas: frecuencia (por ejemplo, cada día) y retención (por ejemplo, 30 días).",
        "Asigna recursos al plan por ARN o por etiqueta, de modo que todo recurso etiquetado quede protegido automáticamente.",
        "Opcionalmente, dispara una copia puntual bajo demanda para un recurso concreto cuando lo necesites.",
      ],
    },
    {
      type: "code",
      lang: "json",
      title: "Plan de copias de AWS Backup: copia diaria con 30 días de retención",
      code:
        "{\n" +
        "  \"BackupPlanName\": \"plan-diario-produccion\",\n" +
        "  \"Rules\": [\n" +
        "    {\n" +
        "      \"RuleName\": \"copia-diaria\",\n" +
        "      \"TargetBackupVaultName\": \"vault-produccion\",\n" +
        "      \"ScheduleExpression\": \"cron(0 5 * * ? *)\",\n" +
        "      \"Lifecycle\": {\n" +
        "        \"DeleteAfterDays\": 30\n" +
        "      }\n" +
        "    }\n" +
        "  ]\n" +
        "}",
    },
    {
      type: "code",
      lang: "bash",
      title: "Crear el plan y lanzar una copia puntual bajo demanda (CLI de AWS)",
      code:
        "# Crear el plan de copias a partir de la definición JSON\n" +
        "aws backup create-backup-plan \\\n" +
        "  --backup-plan file://backup-plan.json \\\n" +
        "  --region us-east-1\n\n" +
        "# Lanzar una copia puntual bajo demanda de un recurso concreto\n" +
        "aws backup start-backup-job \\\n" +
        "  --backup-vault-name vault-produccion \\\n" +
        "  --resource-arn arn:aws:rds:us-east-1:111122223333:db:ventas \\\n" +
        "  --iam-role-arn arn:aws:iam::111122223333:role/AWSBackupDefaultServiceRole \\\n" +
        "  --region us-east-1",
    },
    { type: "heading", level: 2, text: "RPO y RTO: las dos métricas que lo deciden todo" },
    {
      type: "paragraph",
      text:
        "Antes de elegir una estrategia de DR tienes que fijar dos objetivos de negocio. El RPO (Recovery Point Objective, punto de recuperación) es la cantidad máxima de datos que puedes permitirte perder, medida en tiempo: un RPO de 1 hora significa que, tras un desastre, aceptas perder como mucho la última hora de datos. El RTO (Recovery Time Objective, tiempo de recuperación) es el tiempo máximo que puede estar caído el servicio hasta recuperarlo: un RTO de 15 minutos significa que debes volver a operar en 15 minutos o menos.",
    },
    {
      type: "callout",
      variant: "info",
      text:
        "Regla mnemotécnica: el RPO mira hacia atrás (¿cuántos datos pierdo desde la última copia?) y el RTO mira hacia adelante (¿cuánto tardo en volver a estar en línea?). Cuanto más exigentes (más cercanos a cero) sean ambos, más cara y compleja será la estrategia de DR.",
    },
    { type: "heading", level: 2, text: "Las cuatro estrategias de DR" },
    {
      type: "paragraph",
      text:
        "AWS describe cuatro estrategias de recuperación ante desastres ordenadas de menor a mayor coste y de mayor a menor RPO/RTO. La elección es un equilibrio: a más inversión en infraestructura siempre lista, menor pérdida de datos y menor tiempo de recuperación.",
    },
    {
      type: "list",
      items: [
        "Backup & restore (copia y restauración): guardas copias (por ejemplo con AWS Backup) y, ante un desastre, restauras la infraestructura en la Región de recuperación. Es la más barata, pero su RPO y RTO son los más altos (horas).",
        "Pilot light (luz piloto): replicas los datos de forma continua y mantienes apagada o mínima la infraestructura central (bases de datos encendidas, cómputo apagado). Ante el desastre, enciendes y escalas el cómputo. RPO y RTO menores que backup & restore.",
        "Warm standby (reserva templada): mantienes una copia reducida pero siempre encendida del entorno en otra Región, lista para recibir tráfico y escalar. RPO y RTO bajos (minutos).",
        "Multi-site active/active (multisitio activo/activo): la carga corre simultáneamente en varias Regiones atendiendo tráfico real. Ante el fallo de una, el resto absorbe la carga. Es la más cara, con RPO y RTO cercanos a cero.",
      ],
    },
    {
      type: "callout",
      variant: "success",
      text:
        "Cómo decidir: parte del RPO y el RTO que exige el negocio y elige la estrategia más barata que los cumpla. No pagues un multi-site active/active si un warm standby ya satisface tus objetivos; no te conformes con backup & restore si el negocio no tolera perder horas de datos.",
    },
    { type: "heading", level: 2, text: "Servicios de esta capa" },
    {
      type: "serviceIcon",
      items: [
        { service: "AWS Database Migration Service", icon: "migration-dms" },
        { service: "AWS Backup", icon: "migration-backup" },
      ],
    },
  ],
  selfCheck: [
    {
      question:
        "¿Qué miden respectivamente el RPO y el RTO en una estrategia de Recuperación ante Desastres?",
      options: [
        "El RPO mide el coste mensual del plan de DR y el RTO el número de Regiones usadas",
        "El RPO es la cantidad máxima de datos que puedes perder (en tiempo) y el RTO es el tiempo máximo que el servicio puede estar caído hasta recuperarlo",
        "Ambos miden lo mismo: el tiempo total de la migración de datos",
        "El RPO mide el tiempo de recuperación y el RTO el punto de recuperación (están invertidos)",
      ],
      correctIndex: 1,
      explanation:
        "El RPO (Recovery Point Objective, punto de recuperación) define cuántos datos puedes perder medido en tiempo (mira hacia atrás, hacia la última copia válida). El RTO (Recovery Time Objective, tiempo de recuperación) define cuánto tardas en volver a operar tras el desastre (mira hacia adelante). Cuanto más cercanos a cero, más cara y compleja es la estrategia.",
    },
    {
      question:
        "¿Cuál de las estrategias de DR ofrece el RPO y el RTO más bajos (cercanos a cero) a cambio del mayor coste?",
      options: [
        "Backup & restore (copia y restauración)",
        "Pilot light (luz piloto)",
        "Warm standby (reserva templada)",
        "Multi-site active/active (multisitio activo/activo)",
      ],
      correctIndex: 3,
      explanation:
        "Multi-site active/active ejecuta la carga simultáneamente en varias Regiones atendiendo tráfico real, de modo que el fallo de una Región apenas interrumpe el servicio: RPO y RTO cercanos a cero. Es la estrategia más cara. Backup & restore es la más barata pero con RPO/RTO más altos; pilot light y warm standby quedan en posiciones intermedias.",
    },
    {
      question:
        "En AWS DMS, ¿qué permite el modo CDC (Change Data Capture) durante una migración?",
      options: [
        "Convertir automáticamente el esquema entre motores de bases de datos distintos",
        "Replicar de forma continua los cambios del origen mientras migras, para sincronizar origen y destino y hacer el corte con mínima interrupción",
        "Cifrar las copias de seguridad en el almacén de AWS Backup",
        "Apagar la instancia de replicación cuando no hay tráfico",
      ],
      correctIndex: 1,
      explanation:
        "CDC (Change Data Capture) replica de forma continua los cambios que ocurren en la base de datos de origen durante la migración, manteniendo el destino sincronizado. Así puedes hacer el corte (cutover) con una interrupción mínima. La conversión de esquema entre motores distintos corresponde a AWS Schema Conversion Tool, no a CDC.",
    },
  ],
};
