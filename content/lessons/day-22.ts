import type { Lesson } from "@/lib/types";

// Capa_Temática "Edge y Protección" (dayRange [21, 22]).
// Día 22 — Aceleración global: AWS Global Accelerator y Amazon CloudFront como
// capa de distribución y protección en el borde de la red de AWS.
//
// Trazabilidad: Req 3.11, 5.1, 5.2, 9.1, 9.4, 11.3.
export const day22: Lesson = {
  day: 22,
  slug: "edge-global-accelerator-cloudfront",
  title: "Aceleración global: AWS Global Accelerator y CloudFront en el edge",
  section: "Edge y Protección",
  estimatedMinutes: 28,
  icon: "networking-global-accelerator",
  objectives: [
    "Entender qué es AWS Global Accelerator y cómo usa la red troncal de AWS para mejorar latencia y disponibilidad",
    "Diferenciar cuándo conviene Global Accelerator (TCP/UDP, IP estáticas) y cuándo Amazon CloudFront (caché de contenido HTTP/HTTPS)",
    "Reconocer cómo ambos actúan como capa de distribución y protección en el borde",
    "Crear un acelerador con la AWS CLI y consultar sus direcciones IP estáticas",
  ],
  blocks: [
    {
      type: "paragraph",
      text:
        "La red perimetral de AWS no solo sirve para cachear contenido: también permite acercar a tus usuarios el punto de entrada a tu aplicación y enrutar el tráfico por la red troncal privada de AWS en lugar de la internet pública. Dos servicios aprovechan ese borde con propósitos distintos: AWS Global Accelerator mejora el rendimiento y la disponibilidad del tráfico TCP/UDP hacia tus aplicaciones, y Amazon CloudFront acelera la entrega de contenido web (HTTP/HTTPS) mediante caché distribuida.",
    },
    { type: "heading", level: 2, text: "AWS Global Accelerator" },
    {
      type: "paragraph",
      text:
        "AWS Global Accelerator te proporciona dos direcciones IP estáticas y anycast que sirven como punto de entrada fijo a tu aplicación. Cuando un usuario se conecta a esas IP, el tráfico entra a la red global de AWS por la ubicación de borde más cercana y viaja por la red troncal privada de AWS hasta el endpoint más adecuado (un Application o Network Load Balancer, instancias EC2 o direcciones IP elásticas) en una o varias Regiones. El resultado es menor latencia, menor jitter y conmutación por error rápida si un endpoint o una Región dejan de estar sanos.",
    },
    {
      type: "list",
      items: [
        "Dos IP estáticas anycast: un punto de entrada fijo que no cambia aunque reconfigures los endpoints detrás.",
        "Enrutamiento por la red troncal de AWS: evita gran parte de la internet pública, reduciendo latencia y variabilidad.",
        "Failover regional automático: dirige a los usuarios al endpoint sano más cercano según salud y pesos de tráfico.",
        "Opera a nivel de red/transporte (TCP y UDP), no solo HTTP, por lo que sirve para APIs, juegos, VoIP o IoT.",
      ],
    },
    { type: "heading", level: 2, text: "Amazon CloudFront" },
    {
      type: "paragraph",
      text:
        "Amazon CloudFront es la red de entrega de contenido (CDN) de AWS. Cachea tu contenido estático y dinámico en cientos de ubicaciones de borde y lo sirve desde la más cercana al usuario, reduciendo la latencia y descargando a tu origen. Además de rendimiento, es una capa de protección: integra TLS/HTTPS, se apoya en AWS Shield frente a DDoS y es el punto natural donde asociar una Web ACL de AWS WAF, como vimos en la lección anterior.",
    },
    {
      type: "serviceIcon",
      items: [
        { service: "AWS Global Accelerator", icon: "networking-global-accelerator" },
        { service: "Amazon CloudFront", icon: "networking-cloudfront" },
      ],
    },
    { type: "heading", level: 3, text: "¿Global Accelerator o CloudFront?" },
    {
      type: "list",
      items: [
        "Elige CloudFront para contenido web cacheable (sitios, APIs HTTP/HTTPS, streaming de medios): su fuerza es la caché en el borde y la entrega de contenido.",
        "Elige Global Accelerator para cargas no cacheables sobre TCP/UDP que necesitan IP estáticas y failover rápido entre Regiones (APIs de baja latencia, gaming, VoIP, IoT).",
        "No son excluyentes: puedes usar CloudFront para el contenido web y Global Accelerator para el tráfico de aplicación, cada uno donde aporta más.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      text:
        "Regla rápida: si el tráfico es HTTP/HTTPS y se beneficia de caché, piensa en CloudFront. Si necesitas IP estáticas, TCP/UDP o conmutación por error entre Regiones a nivel de red, piensa en Global Accelerator.",
    },
    { type: "heading", level: 2, text: "Crear un acelerador con la AWS CLI" },
    {
      type: "paragraph",
      text:
        "La API de Global Accelerator (aceleradores estándar) es un servicio global cuyo plano de control reside en us-east-1, así que los comandos de creación se ejecutan contra esa Región. El flujo mínimo es crear el acelerador y luego consultar las IP estáticas que te asigna.",
    },
    {
      type: "code",
      lang: "bash",
      title: "Crear un acelerador de AWS Global Accelerator",
      code:
        "# Crea un acelerador estándar (IPv4) habilitado.\n# El plano de control de Global Accelerator vive en us-east-1.\naws globalaccelerator create-accelerator \\\n  --name acelerador-global \\\n  --ip-address-type IPV4 \\\n  --enabled \\\n  --region us-east-1",
    },
    {
      type: "paragraph",
      text:
        "Con el ARN que devuelve el comando puedes describir el acelerador para ver sus dos direcciones IP estáticas y su DNS, que usarás como punto de entrada en Route 53 o directamente en tus clientes.",
    },
    {
      type: "code",
      lang: "bash",
      title: "Consultar las IP estáticas del acelerador",
      code:
        "# Lista los aceleradores de la cuenta para obtener el ARN\naws globalaccelerator list-accelerators \\\n  --region us-east-1 \\\n  --output table\n\n# Describe el acelerador para ver sus 2 IP estáticas y su nombre DNS\naws globalaccelerator describe-accelerator \\\n  --accelerator-arn <ACCELERATOR_ARN> \\\n  --region us-east-1",
    },
    {
      type: "callout",
      variant: "success",
      text:
        "Pensar en capas de borde: CloudFront acerca y protege el contenido web, Global Accelerator acelera y da resiliencia al tráfico de aplicación, y ambos se apoyan en Shield y pueden combinarse con WAF para una entrada rápida, estable y protegida.",
    },
  ],
  selfCheck: [
    {
      question: "¿Cuál es la diferencia principal entre AWS Global Accelerator y Amazon CloudFront?",
      options: [
        "Son el mismo servicio; Global Accelerator es la versión antigua de CloudFront",
        "CloudFront es una CDN que cachea contenido HTTP/HTTPS en el borde, mientras que Global Accelerator acelera tráfico TCP/UDP con IP estáticas por la red troncal de AWS",
        "CloudFront solo funciona dentro de una Región y Global Accelerator solo on-premise",
        "Global Accelerator cachea páginas web y CloudFront proporciona IP estáticas anycast",
      ],
      correctIndex: 1,
      explanation:
        "CloudFront es la CDN que cachea y entrega contenido HTTP/HTTPS desde el borde. Global Accelerator no cachea: ofrece dos IP estáticas anycast y enruta el tráfico TCP/UDP por la red troncal de AWS hacia el endpoint sano más cercano.",
    },
    {
      question: "¿Qué proporciona AWS Global Accelerator como punto de entrada a tu aplicación?",
      options: [
        "Un único nombre de dominio que cambia en cada despliegue",
        "Dos direcciones IP estáticas anycast que permanecen fijas aunque cambien los endpoints detrás",
        "Una dirección IP distinta por cada usuario conectado",
        "Las direcciones IP privadas de tus instancias EC2",
      ],
      correctIndex: 1,
      explanation:
        "Global Accelerator asigna dos IP estáticas anycast que actúan como punto de entrada fijo. El tráfico entra por la ubicación de borde más cercana y viaja por la red de AWS hasta el endpoint óptimo, con failover automático.",
    },
    {
      question: "Tienes una API de baja latencia sobre TCP que necesita IP estáticas y failover rápido entre dos Regiones. ¿Qué servicio encaja mejor?",
      options: [
        "Amazon CloudFront, por su caché de contenido",
        "AWS Global Accelerator, por sus IP estáticas, enrutamiento TCP/UDP y conmutación por error regional",
        "AWS WAF, porque inspecciona las peticiones",
        "Amazon S3, para servir el contenido directamente",
      ],
      correctIndex: 1,
      explanation:
        "Para tráfico no cacheable sobre TCP/UDP que requiere IP estáticas y failover entre Regiones, Global Accelerator es la opción adecuada. CloudFront brilla con contenido web cacheable, no con este tipo de carga.",
    },
  ],
};
