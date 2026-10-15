import type { Lesson } from "@/lib/types";

export const day17: Lesson = {
  day: 17,
  slug: "seguridad-waf-guardduty",
  title: "Protección y detección: AWS WAF y Amazon GuardDuty",
  section: "Seguridad",
  estimatedMinutes: 30,
  icon: "security-waf",
  objectives: [
    "Comprender qué protege AWS WAF a nivel de aplicación y dónde se asocia (CloudFront, ALB, API Gateway)",
    "Distinguir reglas gestionadas, reglas propias y la acción por defecto de una Web ACL",
    "Entender cómo Amazon GuardDuty detecta amenazas analizando fuentes de telemetría de la cuenta",
    "Diferenciar el rol preventivo de WAF del rol de detección de GuardDuty dentro de una estrategia de defensa en profundidad",
  ],
  blocks: [
    {
      type: "paragraph",
      text:
        "La seguridad no es un único muro: es defensa en profundidad, varias capas que se complementan. En esta lección vemos dos piezas distintas y complementarias. AWS WAF es preventivo: filtra el tráfico malicioso ANTES de que llegue a tu aplicación. Amazon GuardDuty es de detección: vigila de forma continua la actividad de tu cuenta y te avisa cuando algo huele a compromiso. Una previene; el otro detecta lo que se cuela.",
    },
    { type: "heading", level: 2, text: "AWS WAF: cortafuegos de aplicaciones web" },
    {
      type: "paragraph",
      text:
        "AWS WAF (Web Application Firewall) inspecciona las peticiones HTTP/HTTPS y decide si permitirlas, bloquearlas o contarlas según reglas que tú defines. Opera en la capa de aplicación (capa 7), así que entiende de rutas, cabeceras, cadenas de consulta y cuerpos. Se asocia a recursos de entrada como distribuciones de Amazon CloudFront, Application Load Balancer (ALB) y Amazon API Gateway.",
    },
    {
      type: "serviceIcon",
      items: [
        { service: "AWS WAF", icon: "security-waf" },
        { service: "Amazon GuardDuty", icon: "security-guardduty" },
      ],
    },
    {
      type: "paragraph",
      text:
        "La unidad central de WAF es la Web ACL (lista de control de acceso web): un conjunto de reglas evaluadas en orden más una acción por defecto. Puedes usar reglas gestionadas por AWS (grupos preconstruidos contra amenazas comunes como inyección SQL o el OWASP Top 10) y reglas propias (por ejemplo, limitar la tasa de peticiones por IP o bloquear por país).",
    },
    {
      type: "list",
      items: [
        "Reglas gestionadas por AWS: grupos mantenidos por AWS contra amenazas comunes (SQLi, XSS, bots conocidos). Se activan con poco esfuerzo.",
        "Reglas propias: condiciones que defines tú (rate limiting por IP, bloqueo geográfico, coincidencia de patrones en la URL o cabeceras).",
        "Acción por defecto: qué hace la Web ACL con una petición que no coincide con ninguna regla, Allow o Block. Define tu postura base.",
      ],
    },
    {
      type: "code",
      lang: "json",
      title: "Regla de WAF: limitar la tasa de peticiones por IP (rate-based)",
      code: `{
  "Name": "LimitarTasaPorIP",
  "Priority": 1,
  "Statement": {
    "RateBasedStatement": {
      "Limit": 2000,
      "AggregateKeyType": "IP"
    }
  },
  "Action": { "Block": {} },
  "VisibilityConfig": {
    "SampledRequestsEnabled": true,
    "CloudWatchMetricsEnabled": true,
    "MetricName": "LimitarTasaPorIP"
  }
}`,
    },
    {
      type: "callout",
      variant: "info",
      text:
        "WAF protege en la capa 7 (aplicación). Para ataques volumétricos de capa 3/4 (DDoS) el servicio dedicado es AWS Shield, que trabaja junto a WAF y CloudFront. Son complementarios: Shield absorbe el volumen, WAF filtra la lógica de las peticiones.",
    },
    { type: "heading", level: 2, text: "Amazon GuardDuty: detección de amenazas" },
    {
      type: "paragraph",
      text:
        "Amazon GuardDuty es un servicio de detección de amenazas que analiza de forma continua la telemetría de tu cuenta sin necesidad de instalar agentes. Aplica inteligencia de amenazas y aprendizaje automático sobre fuentes como los eventos de AWS CloudTrail, los registros de flujo de VPC (VPC Flow Logs) y las consultas DNS para identificar comportamientos sospechosos: una instancia que se comunica con una IP maliciosa conocida, credenciales usadas desde una ubicación inusual o actividad de minería de criptomonedas.",
    },
    {
      type: "code",
      lang: "bash",
      title: "Habilitar GuardDuty creando un detector en la Región",
      code:
        "# Crea el detector que habilita GuardDuty en la Región\naws guardduty create-detector \\\n  --enable \\\n  --region us-east-1\n\n# Lista los hallazgos (findings) detectados por GuardDuty\naws guardduty list-findings \\\n  --detector-id <DETECTOR_ID> \\\n  --region us-east-1",
    },
    {
      type: "paragraph",
      text:
        "GuardDuty genera hallazgos (findings) con un nivel de severidad. No bloquea por sí mismo: su trabajo es alertar. La respuesta se automatiza integrándolo con Amazon EventBridge para disparar acciones (notificar a un equipo, aislar una instancia, revocar credenciales) cuando aparece un hallazgo de severidad alta.",
    },
    {
      type: "callout",
      variant: "success",
      text:
        "Estrategia combinada: WAF filtra el tráfico de entrada (prevención), GuardDuty vigila la actividad de la cuenta (detección) y EventBridge más Lambda automatizan la respuesta. Juntos forman una defensa en profundidad: prevenir, detectar y responder.",
    },
    {
      type: "callout",
      variant: "warning",
      text:
        "GuardDuty es regional: debes habilitarlo en cada Región donde operes. En entornos multi-cuenta, delega la administración desde una cuenta de seguridad central con AWS Organizations para no dejar Regiones ni cuentas sin cobertura.",
    },
  ],
  selfCheck: [
    {
      question: "¿A qué capa opera AWS WAF y a qué recursos se asocia?",
      options: [
        "A la capa de red (capa 3/4) y se asocia a tablas de rutas de la VPC",
        "A la capa de aplicación (capa 7) y se asocia a CloudFront, Application Load Balancer y API Gateway",
        "Al sistema operativo de las instancias EC2 mediante un agente",
        "A la base de datos, filtrando consultas SQL dentro del motor",
      ],
      correctIndex: 1,
      explanation:
        "AWS WAF inspecciona peticiones HTTP/HTTPS en la capa 7 y se asocia a recursos de entrada como distribuciones de CloudFront, ALB y API Gateway. Para la protección volumétrica de capa 3/4 el servicio dedicado es AWS Shield.",
    },
    {
      question: "¿Cuál es la función principal de Amazon GuardDuty?",
      options: [
        "Bloquear automáticamente el tráfico malicioso antes de que llegue a la aplicación",
        "Detectar amenazas analizando continuamente telemetría como CloudTrail, VPC Flow Logs y consultas DNS, generando hallazgos",
        "Cifrar los datos en reposo de los buckets de S3",
        "Rotar automáticamente las claves de KMS de la cuenta",
      ],
      correctIndex: 1,
      explanation:
        "GuardDuty es un servicio de detección: analiza telemetría de la cuenta sin agentes y genera hallazgos ante comportamientos sospechosos. No bloquea por sí mismo; la respuesta se automatiza integrándolo con EventBridge.",
    },
    {
      question: "¿Cómo se complementan WAF y GuardDuty en una defensa en profundidad?",
      options: [
        "Hacen exactamente lo mismo, así que basta con uno de los dos",
        "WAF previene filtrando el tráfico de entrada y GuardDuty detecta actividad sospechosa en la cuenta; juntos cubren prevención y detección",
        "GuardDuty filtra el tráfico y WAF solo envía notificaciones por correo",
        "Ambos sustituyen la necesidad de usar IAM y cifrado",
      ],
      correctIndex: 1,
      explanation:
        "Son complementarios: WAF es preventivo y filtra peticiones antes de llegar a la aplicación, mientras GuardDuty detecta comportamientos sospechosos en la actividad de la cuenta. Combinados con EventBridge para la respuesta, forman una defensa en profundidad.",
    },
  ],
};
