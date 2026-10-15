import type { Lesson } from "@/lib/types";

// Capa_Temática "Arquitectura y Buenas Prácticas" (dayRange [29, 30]).
// Día 29 — Escalado y balanceo: Amazon EC2 Auto Scaling (grupos de escalado y
// políticas) y Elastic Load Balancing (Application Load Balancer y Network
// Load Balancer) para distribuir el tráfico y ajustar la capacidad a la demanda.
//
// Trazabilidad: Req 3.9, 5.1, 5.2, 9.1, 9.4, 11.3.
export const day29: Lesson = {
  day: 29,
  slug: "arquitectura-autoscaling-elb",
  title: "Escalado y balanceo: Amazon EC2 Auto Scaling y Elastic Load Balancing",
  section: "Arquitectura y Buenas Prácticas",
  estimatedMinutes: 30,
  objectives: [
    "Comprender los grupos de Auto Scaling (Auto Scaling groups) y cómo sus políticas ajustan la capacidad a la demanda",
    "Diferenciar Application Load Balancer (ALB) de Network Load Balancer (NLB) y cuándo usar cada uno",
    "Entender cómo Auto Scaling y Elastic Load Balancing trabajan juntos para lograr elasticidad y distribución del tráfico",
  ],
  blocks: [
    {
      type: "paragraph",
      text:
        "El escalado y el balanceo de carga son dos piezas inseparables de una arquitectura elástica en AWS. Amazon EC2 Auto Scaling ajusta automáticamente el número de instancias EC2 según la demanda, mientras que Elastic Load Balancing (ELB) distribuye el tráfico entrante entre esas instancias. Juntos permiten que una aplicación crezca y se contraiga sola, sin intervención manual y sin un único punto de saturación.",
    },
    {
      type: "callout",
      variant: "info",
      text:
        "La idea central es la elasticidad: pagar por la capacidad que realmente necesitas en cada momento. En lugar de aprovisionar para el pico máximo todo el tiempo, Auto Scaling añade instancias cuando el tráfico sube y las retira cuando baja.",
    },
    { type: "heading", level: 2, text: "Amazon EC2 Auto Scaling: grupos y políticas" },
    {
      type: "list",
      items: [
        "Grupo de Auto Scaling (Auto Scaling group): el conjunto lógico de instancias EC2 que se gestionan juntas. Define capacidad mínima, deseada y máxima.",
        "Plantilla de lanzamiento (launch template): describe cómo crear cada instancia (AMI, tipo de instancia, grupos de seguridad, etc.).",
        "Política de escalado dinámico (target tracking): ajusta la capacidad para mantener una métrica objetivo, por ejemplo un 50 % de uso promedio de CPU.",
        "Política de escalado por pasos (step scaling): añade o quita instancias en incrementos según umbrales de una alarma de CloudWatch.",
        "Comprobaciones de estado (health checks): si una instancia falla, Auto Scaling la reemplaza para mantener la capacidad deseada.",
      ],
    },
    {
      type: "code",
      lang: "bash",
      title: "Crear un grupo de Auto Scaling con la CLI de AWS",
      code:
        "aws autoscaling create-auto-scaling-group \\\n" +
        "  --auto-scaling-group-name mi-asg-web \\\n" +
        "  --launch-template LaunchTemplateName=plantilla-web,Version='$Latest' \\\n" +
        "  --min-size 2 \\\n" +
        "  --max-size 6 \\\n" +
        "  --desired-capacity 2 \\\n" +
        "  --vpc-zone-identifier \"subnet-0a1b2c3d,subnet-4e5f6g7h\" \\\n" +
        "  --region us-east-2",
    },
    {
      type: "callout",
      variant: "warning",
      text:
        "Distribuye tu grupo de Auto Scaling en varias subredes de distintas Zonas de Disponibilidad (parámetro --vpc-zone-identifier). Si lo confinas a una sola Zona de Disponibilidad, pierdes tolerancia a fallos: la caída de esa zona deja tu aplicación sin instancias.",
    },
    { type: "heading", level: 2, text: "Elastic Load Balancing: ALB y NLB" },
    {
      type: "paragraph",
      text:
        "Elastic Load Balancing distribuye el tráfico entrante entre varios destinos (instancias EC2, contenedores o direcciones IP) registrados en grupos de destino (target groups). AWS ofrece varios tipos; los dos más usados son el Application Load Balancer (ALB), que opera en la capa 7 (HTTP/HTTPS), y el Network Load Balancer (NLB), que opera en la capa 4 (TCP/UDP) con muy baja latencia.",
    },
    {
      type: "list",
      items: [
        "Application Load Balancer (ALB): enruta por contenido (ruta, host, cabeceras). Ideal para aplicaciones web y microservicios HTTP.",
        "Network Load Balancer (NLB): balancea a nivel de conexión TCP/UDP con rendimiento extremo y latencia mínima. Útil para tráfico no HTTP o cargas muy sensibles a la latencia.",
        "Grupo de destino (target group): el conjunto de destinos a los que el balanceador envía tráfico, con sus propias comprobaciones de estado.",
        "Oyente (listener): regla que define en qué puerto y protocolo escucha el balanceador y hacia qué grupo de destino reenvía.",
      ],
    },
    {
      type: "code",
      lang: "bash",
      title: "Crear un Application Load Balancer con la CLI de AWS",
      code:
        "aws elbv2 create-load-balancer \\\n" +
        "  --name mi-alb-web \\\n" +
        "  --type application \\\n" +
        "  --subnets subnet-0a1b2c3d subnet-4e5f6g7h \\\n" +
        "  --security-groups sg-0123456789abcdef0 \\\n" +
        "  --scheme internet-facing \\\n" +
        "  --region us-east-2",
    },
    { type: "heading", level: 2, text: "Escalado y balanceo trabajando juntos" },
    {
      type: "list",
      ordered: true,
      items: [
        "El balanceador recibe el tráfico y lo reparte entre las instancias registradas en el grupo de destino.",
        "El grupo de Auto Scaling se asocia al grupo de destino: cada instancia nueva se registra automáticamente y empieza a recibir tráfico.",
        "Cuando una política de escalado añade instancias, el balanceador las incorpora al reparto; cuando las retira, deja de enviarles tráfico tras drenar sus conexiones.",
      ],
    },
    {
      type: "callout",
      variant: "success",
      text:
        "Regla práctica: Auto Scaling responde '¿cuántas instancias necesito ahora mismo?'; Elastic Load Balancing responde '¿a cuál de ellas mando esta petición?'. Elasticidad frente a distribución del tráfico.",
    },
    { type: "heading", level: 2, text: "Servicios de esta capa" },
    {
      type: "serviceIcon",
      items: [
        { service: "Amazon EC2 Auto Scaling", icon: "compute-auto-scaling" },
        { service: "Elastic Load Balancing", icon: "compute-elb" },
      ],
    },
  ],
  icon: "compute-auto-scaling",
  selfCheck: [
    {
      question:
        "¿Qué define la capacidad mínima, deseada y máxima de instancias en Amazon EC2 Auto Scaling?",
      options: [
        "El grupo de destino (target group) del balanceador de carga",
        "El grupo de Auto Scaling (Auto Scaling group)",
        "El oyente (listener) del Application Load Balancer",
        "La plantilla de lanzamiento (launch template)",
      ],
      correctIndex: 1,
      explanation:
        "El grupo de Auto Scaling define los límites de capacidad (mínima, deseada y máxima) y gestiona el conjunto de instancias. La plantilla de lanzamiento solo describe cómo crear cada instancia, no cuántas mantener.",
    },
    {
      question:
        "¿En qué caso conviene MÁS un Network Load Balancer (NLB) que un Application Load Balancer (ALB)?",
      options: [
        "Cuando necesitas enrutar peticiones HTTP según la ruta o el host",
        "Cuando necesitas balancear tráfico TCP/UDP con latencia mínima y rendimiento extremo",
        "Cuando quieres inspeccionar cabeceras HTTP para decidir el destino",
        "Cuando quieres terminar certificados TLS por nombre de dominio en capa 7",
      ],
      correctIndex: 1,
      explanation:
        "El NLB opera en la capa 4 (TCP/UDP) con latencia muy baja y alto rendimiento, ideal para tráfico no HTTP o muy sensible a la latencia. El enrutamiento por contenido HTTP (ruta, host, cabeceras) es propio del ALB en la capa 7.",
    },
  ],
};
