import type { Lesson } from "@/lib/types";

// Capa_Temática "Monitoreo y Observabilidad" (dayRange [18, 20]).
// Día 20 — Operación y búsqueda: AWS Systems Manager (operación de la flota y
// configuración segura) y Amazon OpenSearch Service (búsqueda y analítica de
// logs a escala).
//
// Trazabilidad: Req 3.7, 5.1, 5.2, 9.1, 9.4, 11.3.
export const day20: Lesson = {
  day: 20,
  slug: "monitoreo-ssm-opensearch",
  title: "Operación y búsqueda: AWS Systems Manager y Amazon OpenSearch",
  section: "Monitoreo y Observabilidad",
  estimatedMinutes: 25,
  icon: "monitoring-systems-manager",
  objectives: [
    "Explicar qué es AWS Systems Manager y las capacidades operativas que ofrece (Parameter Store, Session Manager, Run Command, Patch Manager)",
    "Comprender cómo Parameter Store centraliza configuración y secretos para las aplicaciones",
    "Entender el rol de Amazon OpenSearch Service como motor de búsqueda y analítica para observabilidad de logs a escala",
  ],
  blocks: [
    {
      type: "paragraph",
      text:
        "Observar un sistema es solo la mitad del trabajo: también hay que operarlo (configurar, parchear, acceder de forma segura) y poder buscar entre grandes volúmenes de datos para entender qué ocurre. AWS Systems Manager cubre la operación de tu flota de recursos y Amazon OpenSearch Service aporta búsqueda y analítica a escala sobre tus logs.",
    },
    { type: "heading", level: 2, text: "AWS Systems Manager: operar la flota sin fricción" },
    {
      type: "paragraph",
      text:
        "AWS Systems Manager (SSM) es un conjunto de capacidades para gestionar y operar tus recursos a escala. Agrupa herramientas que, de otro modo, exigirían SSH, bastiones y scripts dispersos. Las más usadas en el día a día son estas:",
    },
    {
      type: "list",
      items: [
        "Parameter Store: almacén jerárquico de configuración y secretos (cadenas de conexión, flags, credenciales) con cifrado opcional mediante AWS KMS.",
        "Session Manager: acceso interactivo a instancias EC2 sin abrir puertos SSH, sin bastiones y con auditoría de la sesión.",
        "Run Command: ejecuta comandos en muchas instancias a la vez sin iniciar sesión en cada una.",
        "Patch Manager: automatiza la aplicación de parches de sistema operativo en toda la flota según ventanas de mantenimiento.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      text:
        "Session Manager es un cambio de postura de seguridad enorme: elimina los puertos SSH abiertos y los bastiones. El acceso se controla con IAM y cada sesión queda registrada, lo que facilita auditoría y cumplimiento. Menos superficie de ataque, más trazabilidad.",
    },
    { type: "heading", level: 2, text: "Parameter Store: configuración centralizada" },
    {
      type: "paragraph",
      text:
        "Parameter Store organiza los parámetros en una jerarquía tipo ruta (/miapp/produccion/db-url). Los parámetros de tipo String y StringList guardan configuración no sensible; los de tipo SecureString se cifran con AWS KMS para secretos. Tus aplicaciones los leen en tiempo de ejecución con el CLI o el SDK, evitando credenciales incrustadas en el código.",
    },
    {
      type: "code",
      lang: "bash",
      title: "Crear un parámetro cifrado (SecureString) en Parameter Store",
      code:
        "aws ssm put-parameter \\\n" +
        "  --name \"/miapp/produccion/db-url\" \\\n" +
        "  --value \"postgres://db.interna:5432/pedidos\" \\\n" +
        "  --type SecureString \\\n" +
        "  --key-id alias/aws/ssm \\\n" +
        "  --region us-east-2\n" +
        "\n" +
        "# Leerlo descifrado (requiere permisos de IAM y de KMS):\n" +
        "aws ssm get-parameter \\\n" +
        "  --name \"/miapp/produccion/db-url\" \\\n" +
        "  --with-decryption \\\n" +
        "  --region us-east-2",
    },
    {
      type: "callout",
      variant: "warning",
      text:
        "Para que get-parameter --with-decryption funcione, la identidad que llama necesita permisos tanto de ssm:GetParameter como de kms:Decrypt sobre la clave usada. Un olvido típico es conceder el permiso de SSM pero no el de KMS, y la lectura falla con AccessDenied.",
    },
    { type: "heading", level: 2, text: "Amazon OpenSearch Service: buscar y analizar a escala" },
    {
      type: "paragraph",
      text:
        "Amazon OpenSearch Service es un servicio gestionado para desplegar y operar clústeres de OpenSearch, un motor de búsqueda y analítica. En observabilidad se usa para centralizar grandes volúmenes de logs, buscarlos en tiempo casi real y construir visualizaciones y dashboards con OpenSearch Dashboards. Es la pieza habitual cuando el volumen o las consultas superan lo cómodo para CloudWatch Logs Insights.",
    },
    {
      type: "list",
      ordered: true,
      items: [
        "Ingieres logs y eventos en el clúster (por ejemplo, desde CloudWatch Logs, Kinesis Data Firehose o agentes).",
        "Consultas e indexas los documentos para búsquedas full-text y agregaciones casi en tiempo real.",
        "Visualizas tendencias, patrones y anomalías en OpenSearch Dashboards.",
      ],
    },
    {
      type: "code",
      lang: "bash",
      title: "Crear un dominio de Amazon OpenSearch Service",
      code:
        "aws opensearch create-domain \\\n" +
        "  --domain-name logs-observabilidad \\\n" +
        "  --engine-version \"OpenSearch_2.11\" \\\n" +
        "  --cluster-config InstanceType=t3.small.search,InstanceCount=2 \\\n" +
        "  --ebs-options EBSEnabled=true,VolumeType=gp3,VolumeSize=20 \\\n" +
        "  --region us-east-2",
    },
    { type: "heading", level: 2, text: "Servicios de esta capa" },
    {
      type: "serviceIcon",
      items: [
        { service: "AWS Systems Manager", icon: "monitoring-systems-manager" },
        { service: "Amazon OpenSearch Service", icon: "monitoring-opensearch" },
      ],
    },
  ],
  selfCheck: [
    {
      question:
        "Quieres dar acceso interactivo a una instancia EC2 sin abrir el puerto 22 (SSH) ni mantener un host bastión, con cada sesión auditada. ¿Qué usas?",
      options: [
        "Amazon OpenSearch Dashboards",
        "Session Manager de AWS Systems Manager",
        "Una métrica personalizada de CloudWatch",
        "Un trail de CloudTrail multi-región",
      ],
      correctIndex: 1,
      explanation:
        "Session Manager (parte de Systems Manager) ofrece acceso interactivo a instancias sin abrir SSH ni usar bastiones, controlado por IAM y con auditoría de cada sesión. OpenSearch busca/visualiza, CloudWatch mide y CloudTrail audita la API, pero ninguno da ese acceso de shell seguro.",
    },
    {
      question:
        "¿Qué tipo de parámetro de Parameter Store debes usar para guardar un secreto (como una contraseña) cifrándolo con AWS KMS?",
      options: ["String", "StringList", "SecureString", "PlainText"],
      correctIndex: 2,
      explanation:
        "SecureString cifra el valor con AWS KMS y requiere --with-decryption (y permisos de KMS) para leerlo en claro. String y StringList guardan configuración no sensible sin cifrar, y 'PlainText' no es un tipo válido de Parameter Store.",
    },
  ],
};
