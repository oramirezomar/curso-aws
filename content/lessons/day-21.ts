import type { Lesson } from "@/lib/types";

// Capa_Temática "Edge y Protección" (dayRange [21, 22]).
// Día 21 — Protección DDoS y seguridad en el edge: AWS Shield (Standard y
// Advanced) y AWS WAF aplicado en el borde con Amazon CloudFront.
//
// Trazabilidad: Req 3.11, 5.1, 5.2, 9.1, 9.4, 11.3.
export const day21: Lesson = {
  day: 21,
  slug: "edge-shield-waf",
  title: "Protección DDoS y seguridad en el edge: AWS Shield y AWS WAF con CloudFront",
  section: "Edge y Protección",
  estimatedMinutes: 28,
  icon: "security-shield",
  objectives: [
    "Comprender qué protege AWS Shield y la diferencia entre Shield Standard y Shield Advanced",
    "Entender cómo AWS WAF inspecciona el tráfico HTTP/HTTPS y bloquea peticiones maliciosas en el edge",
    "Reconocer por qué el borde (Amazon CloudFront) es el lugar idóneo para absorber y filtrar ataques",
    "Crear y asociar una Web ACL de AWS WAF a una distribución de CloudFront con la AWS CLI",
  ],
  blocks: [
    {
      type: "paragraph",
      text:
        "Exponer una aplicación a internet significa exponerla también a tráfico hostil: ataques de denegación de servicio distribuida (DDoS) que buscan saturarla, e inyecciones, bots y abuso en la capa de aplicación. AWS aborda estos dos frentes con dos servicios complementarios que trabajan en el borde de la red: AWS Shield frente a los ataques volumétricos y de protocolo (capas 3 y 4), y AWS WAF frente al tráfico malicioso en la capa 7 (HTTP/HTTPS).",
    },
    { type: "heading", level: 2, text: "AWS Shield: protección contra DDoS" },
    {
      type: "paragraph",
      text:
        "AWS Shield es el servicio gestionado de protección contra DDoS. Se ofrece en dos niveles. Shield Standard está activado de forma automática y sin coste adicional para todas las cuentas, y defiende contra los ataques de capa de red y transporte (capas 3 y 4) más comunes, especialmente cuando usas CloudFront y Amazon Route 53. Shield Advanced es un servicio de pago que añade detección y mitigación de ataques más grandes y sofisticados, visibilidad detallada, acceso al Shield Response Team (SRT) y protección frente a los cargos derivados de picos de tráfico por un ataque.",
    },
    {
      type: "list",
      items: [
        "Shield Standard: automático, sin coste adicional, defensa frente a los ataques DDoS de capas 3 y 4 más frecuentes.",
        "Shield Advanced: suscripción de pago, mitigación avanzada, métricas e informes detallados, soporte del Shield Response Team y protección de costos ante escalado por ataque.",
        "Shield actúa junto a servicios del edge como CloudFront, Route 53 y AWS Global Accelerator, donde la capacidad de red de AWS absorbe el ataque antes de llegar a tu origen.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      text:
        "Shield mitiga ataques de capas 3 y 4 (volumétricos y de protocolo). Para el tráfico malicioso de capa 7 (peticiones HTTP/HTTPS bien formadas pero abusivas) necesitas AWS WAF: son servicios complementarios, no sustitutos.",
    },
    { type: "heading", level: 2, text: "AWS WAF: firewall de aplicaciones web" },
    {
      type: "paragraph",
      text:
        "AWS WAF (Web Application Firewall) inspecciona las peticiones HTTP/HTTPS que llegan a tu aplicación y permite, bloquea o cuenta cada una según reglas que tú defines. Esas reglas se agrupan en una Web ACL (Access Control List) que se asocia a un recurso: una distribución de CloudFront, un Application Load Balancer, Amazon API Gateway o un AWS AppSync. Puedes escribir reglas propias (por IP, país, cabeceras, patrones de inyección SQL o cross-site scripting, límites de tasa) o apoyarte en los Grupos de Reglas Gestionadas por AWS, que cubren amenazas comunes y se mantienen actualizados por AWS.",
    },
    {
      type: "serviceIcon",
      items: [
        { service: "AWS Shield", icon: "security-shield" },
        { service: "AWS WAF", icon: "security-waf" },
        { service: "Amazon CloudFront", icon: "networking-cloudfront" },
      ],
    },
    { type: "heading", level: 3, text: "Por qué proteger en el edge" },
    {
      type: "paragraph",
      text:
        "Asociar WAF a una distribución de CloudFront significa inspeccionar y filtrar las peticiones en las ubicaciones de borde (edge locations) de AWS, lo más cerca posible del atacante y lo más lejos posible de tu origen. El tráfico malicioso se descarta antes de consumir recursos de tu infraestructura, y la enorme capacidad de la red perimetral de AWS ayuda a absorber los picos. Cuando una Web ACL se asocia a CloudFront, se gestiona desde el ámbito global (CLOUDFRONT), que vive en la Región us-east-1.",
    },
    {
      type: "callout",
      variant: "warning",
      text:
        "Para una distribución de CloudFront, la Web ACL de WAF se crea y gestiona SIEMPRE con --scope CLOUDFRONT y --region us-east-1, sin importar dónde esté tu origen. Para un ALB o API Gateway el ámbito es REGIONAL y la Región es la del recurso.",
    },
    { type: "heading", level: 2, text: "Crear una Web ACL y asociarla a CloudFront" },
    {
      type: "paragraph",
      text:
        "El flujo con la AWS CLI tiene dos pasos: primero creas la Web ACL (aquí con un Grupo de Reglas Gestionadas de AWS que cubre el conjunto común de amenazas), y después la asocias a la distribución de CloudFront. Fíjate en el uso explícito de --region us-east-1 y --scope CLOUDFRONT.",
    },
    {
      type: "code",
      lang: "bash",
      title: "Crear una Web ACL de AWS WAF para CloudFront",
      code:
        "# Crea una Web ACL de ámbito CLOUDFRONT (global, en us-east-1)\n# con acción por defecto 'permitir' y una regla gestionada de AWS.\naws wafv2 create-web-acl \\\n  --name proteccion-edge \\\n  --scope CLOUDFRONT \\\n  --region us-east-1 \\\n  --default-action Allow={} \\\n  --visibility-config SampledRequestsEnabled=true,CloudWatchMetricsEnabled=true,MetricName=proteccion-edge \\\n  --rules '[{\"Name\":\"AWSManagedCommon\",\"Priority\":1,\"OverrideAction\":{\"None\":{}},\"Statement\":{\"ManagedRuleGroupStatement\":{\"VendorName\":\"AWS\",\"Name\":\"AWSManagedRulesCommonRuleSet\"}},\"VisibilityConfig\":{\"SampledRequestsEnabled\":true,\"CloudWatchMetricsEnabled\":true,\"MetricName\":\"AWSManagedCommon\"}}]'",
    },
    {
      type: "paragraph",
      text:
        "Con el ARN que devuelve el comando anterior, asocias la Web ACL a la distribución de CloudFront. En CloudFront la asociación se hace indicando el ARN de la Web ACL en la configuración de la distribución (campo WebACLId), que WAF también expone mediante associate-web-acl para recursos regionales.",
    },
    {
      type: "code",
      lang: "bash",
      title: "Consultar y confirmar la Web ACL creada",
      code:
        "# Lista las Web ACL de ámbito CLOUDFRONT para obtener su ARN e Id\naws wafv2 list-web-acls \\\n  --scope CLOUDFRONT \\\n  --region us-east-1 \\\n  --output table\n\n# Verifica el detalle de la Web ACL (reglas, acción por defecto, metricas)\naws wafv2 get-web-acl \\\n  --name proteccion-edge \\\n  --scope CLOUDFRONT \\\n  --region us-east-1 \\\n  --id <WEB_ACL_ID>",
    },
    {
      type: "callout",
      variant: "success",
      text:
        "Patrón recomendado: CloudFront como puerta de entrada, Shield (Standard o Advanced) absorbiendo los DDoS de capas 3 y 4, y una Web ACL de WAF con reglas gestionadas de AWS filtrando el abuso de capa 7. Defensa en profundidad desde el borde.",
    },
  ],
  selfCheck: [
    {
      question: "¿Cuál es la diferencia correcta entre AWS Shield y AWS WAF?",
      options: [
        "Son el mismo servicio con nombres distintos según la Región",
        "Shield mitiga ataques DDoS de capas 3 y 4, mientras que WAF filtra tráfico malicioso de capa 7 (HTTP/HTTPS) con reglas",
        "WAF solo funciona en origen y Shield solo en el edge; nunca se combinan",
        "Shield inspecciona el contenido de cada petición HTTP y WAF mide el volumen de tráfico de red",
      ],
      correctIndex: 1,
      explanation:
        "Son complementarios: AWS Shield protege contra ataques DDoS volumétricos y de protocolo (capas 3 y 4), y AWS WAF inspecciona las peticiones HTTP/HTTPS de capa 7 para permitir, bloquear o contar según las reglas de una Web ACL.",
    },
    {
      question: "Al crear una Web ACL de WAF para una distribución de CloudFront, ¿qué ámbito y Región debes usar?",
      options: [
        "--scope REGIONAL y la Región del origen",
        "--scope CLOUDFRONT y --region us-east-1",
        "--scope GLOBAL y la Región más cercana al usuario",
        "No importa el ámbito; CloudFront lo asigna automáticamente",
      ],
      correctIndex: 1,
      explanation:
        "Las Web ACL asociadas a CloudFront se gestionan en el ámbito global con --scope CLOUDFRONT, que vive en la Región us-east-1. El ámbito REGIONAL se usa para recursos como ALB, API Gateway o AppSync.",
    },
    {
      question: "¿Qué afirmación sobre AWS Shield Standard es correcta?",
      options: [
        "Requiere una suscripción de pago mensual para activarse",
        "Está activado automáticamente, sin coste adicional, y protege frente a los DDoS de capas 3 y 4 más comunes",
        "Reemplaza por completo la necesidad de usar AWS WAF",
        "Solo protege recursos desplegados en centros de datos on-premise",
      ],
      correctIndex: 1,
      explanation:
        "Shield Standard viene activado de forma automática y sin coste adicional para todas las cuentas, y defiende contra los ataques DDoS de capas 3 y 4 más frecuentes. Shield Advanced es el nivel de pago con mitigación y soporte avanzados.",
    },
  ],
};
