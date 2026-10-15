import type { Lesson } from "@/lib/types";

// Capa_Temática "Redes y Conectividad" (Nivel MEDIO, dayRange [12, 14]).
// Día 13 — Amazon Route 53 (DNS administrado) y Amazon CloudFront (CDN):
// resolución de nombres, tipos de registro, políticas de ruteo y distribución
// de contenido en el edge.
//
// Trazabilidad: Req 3.4, 5.1, 5.2, 9.1, 9.4, 11.3.
export const day13: Lesson = {
  day: 13,
  slug: "redes-route53-cloudfront",
  title: "Amazon Route 53 (DNS) y Amazon CloudFront (CDN)",
  section: "Redes y Conectividad",
  estimatedMinutes: 30,
  icon: "networking-route53",
  objectives: [
    "Entender qué es Amazon Route 53 como servicio de DNS administrado y sus zonas alojadas",
    "Reconocer los principales tipos de registro DNS y las políticas de ruteo de Route 53",
    "Comprender cómo Amazon CloudFront distribuye contenido desde ubicaciones de borde para reducir la latencia",
  ],
  blocks: [
    {
      type: "paragraph",
      text:
        "Amazon Route 53 es el servicio de DNS (Domain Name System) altamente disponible y escalable de AWS. Traduce nombres de dominio legibles por humanos, como www.ejemplo.com, en las direcciones IP que las máquinas usan para comunicarse. Además, Route 53 ofrece registro de dominios y comprobaciones de estado (health checks) para enrutar el tráfico solo hacia destinos sanos.",
    },
    {
      type: "serviceIcon",
      items: [
        { service: "Amazon Route 53", icon: "networking-route53" },
        { service: "Amazon CloudFront", icon: "networking-cloudfront" },
      ],
    },
    { type: "heading", level: 2, text: "Zonas alojadas y registros DNS" },
    {
      type: "paragraph",
      text:
        "Una zona alojada (hosted zone) es un contenedor de registros que define cómo se enruta el tráfico de un dominio y sus subdominios. Dentro de ella creas registros de recursos (resource record sets). Los tipos más comunes son A (nombre a IPv4), AAAA (nombre a IPv6), CNAME (alias de un nombre a otro nombre) y MX (servidores de correo).",
    },
    {
      type: "list",
      items: [
        "Registro A: asocia un nombre de dominio con una dirección IPv4.",
        "Registro CNAME: apunta un nombre a otro nombre de dominio, nunca a una IP.",
        "Registro de Alias (específico de Route 53): apunta a recursos de AWS como un CloudFront, un balanceador de carga o un bucket de S3, y a diferencia de un CNAME puede usarse en la raíz del dominio (zone apex).",
      ],
    },
    { type: "heading", level: 2, text: "Políticas de ruteo" },
    {
      type: "paragraph",
      text:
        "Route 53 no solo resuelve nombres: decide a qué destino enviar el tráfico según la política de ruteo configurada. Esto habilita escenarios de alta disponibilidad y rendimiento global.",
    },
    {
      type: "list",
      ordered: true,
      items: [
        "Simple: un único destino para el registro.",
        "Ponderada (weighted): reparte el tráfico entre varios destinos según pesos relativos (útil para despliegues canary).",
        "Latencia (latency): dirige al usuario a la región de AWS que le ofrece menor latencia.",
        "Failover: enruta al destino secundario cuando el primario falla una comprobación de estado.",
        "Geolocalización: enruta según la ubicación geográfica del usuario.",
      ],
    },
    { type: "heading", level: 2, text: "Amazon CloudFront: la CDN de AWS" },
    {
      type: "paragraph",
      text:
        "Amazon CloudFront es la red de entrega de contenido (CDN) de AWS. Almacena en caché copias de tu contenido en ubicaciones de borde (edge locations) distribuidas por el mundo, de modo que cada usuario lo recibe desde el punto más cercano. El resultado es menor latencia, menos carga en el origen y protección adicional frente a picos de tráfico.",
    },
    {
      type: "callout",
      variant: "info",
      text:
        "El origen de una distribución de CloudFront puede ser un bucket de Amazon S3, un balanceador de carga, un API Gateway o cualquier servidor HTTP accesible. CloudFront se integra de forma nativa con Route 53 mediante registros de Alias.",
    },
    { type: "heading", level: 2, text: "Operación con el CLI de AWS" },
    {
      type: "code",
      lang: "bash",
      title: "Crear una zona alojada en Route 53",
      code:
        "aws route53 create-hosted-zone \\\n" +
        "  --name ejemplo.com \\\n" +
        "  --caller-reference $(date +%s) \\\n" +
        "  --region us-east-1",
      highlightLines: [2],
    },
    {
      type: "paragraph",
      text:
        "Para dar de alta un registro A se usa change-resource-record-sets con un conjunto de cambios en JSON. Este es el bloque de cambios que se envía al servicio.",
    },
    {
      type: "code",
      lang: "json",
      title: "Conjunto de cambios para crear un registro A en Route 53",
      code:
        "{\n" +
        '  "Comment": "Alta de registro A para www",\n' +
        '  "Changes": [\n' +
        "    {\n" +
        '      "Action": "CREATE",\n' +
        '      "ResourceRecordSet": {\n' +
        '        "Name": "www.ejemplo.com",\n' +
        '        "Type": "A",\n' +
        '        "TTL": 300,\n' +
        '        "ResourceRecords": [{ "Value": "203.0.113.10" }]\n' +
        "      }\n" +
        "    }\n" +
        "  ]\n" +
        "}",
      highlightLines: [7, 8],
    },
    {
      type: "callout",
      variant: "warning",
      text:
        "Un valor de TTL alto mejora el rendimiento al reducir consultas, pero retrasa la propagación de cambios: los resolutores seguirán usando la respuesta en caché hasta que expire. Baja el TTL antes de una migración planificada.",
    },
  ],
  selfCheck: [
    {
      question:
        "¿Qué ventaja tiene un registro de Alias de Route 53 frente a un CNAME?",
      options: [
        "Puede apuntar a una dirección IPv4 directamente",
        "Puede usarse en la raíz del dominio (zone apex) y apuntar a recursos de AWS",
        "No requiere una zona alojada para funcionar",
        "Permite cifrar las consultas DNS de extremo a extremo",
      ],
      correctIndex: 1,
      explanation:
        "A diferencia de un CNAME, el registro de Alias puede configurarse en la raíz del dominio (zone apex) y apunta a recursos de AWS como CloudFront, balanceadores o buckets de S3.",
    },
    {
      question: "¿Cuál es el propósito principal de Amazon CloudFront?",
      options: [
        "Traducir nombres de dominio en direcciones IP",
        "Almacenar en caché contenido en ubicaciones de borde para reducir la latencia al usuario",
        "Asignar rangos de direcciones CIDR a las subredes de una VPC",
        "Ejecutar funciones de cómputo sin servidor en respuesta a eventos",
      ],
      correctIndex: 1,
      explanation:
        "CloudFront es la CDN de AWS: cachea el contenido en edge locations cercanas al usuario, reduciendo la latencia y descargando al origen. La traducción de nombres corresponde a Route 53.",
    },
  ],
};
