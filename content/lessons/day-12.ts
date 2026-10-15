import type { Lesson } from "@/lib/types";

// Capa_Temática "Redes y Conectividad" (Nivel MEDIO, dayRange [12, 14]).
// Día 12 — Amazon VPC y subredes: direccionamiento CIDR, subredes públicas y
// privadas, tablas de ruteo, Internet Gateway (IGW) y NAT Gateway.
//
// Trazabilidad: Req 3.4, 5.1, 5.2, 9.1, 9.4, 11.3.
export const day12: Lesson = {
  day: 12,
  slug: "redes-vpc-subnets",
  title: "Amazon VPC y subredes: CIDR, ruteo, Internet Gateway y NAT",
  section: "Redes y Conectividad",
  estimatedMinutes: 30,
  icon: "networking-vpc",
  objectives: [
    "Comprender qué es una Amazon VPC y cómo se define su rango de direcciones mediante notación CIDR",
    "Distinguir una subred pública de una privada según su tabla de ruteo",
    "Explicar el papel del Internet Gateway (IGW) y del NAT Gateway en la salida a Internet",
  ],
  blocks: [
    {
      type: "paragraph",
      text:
        "Amazon Virtual Private Cloud (Amazon VPC) te permite aprovisionar una sección lógicamente aislada de la nube de AWS donde lanzas tus recursos dentro de una red virtual que tú defines. Controlas el direccionamiento IP, la segmentación en subredes, las tablas de ruteo y los gateways de red, igual que lo harías en un centro de datos propio, pero con la elasticidad de AWS.",
    },
    {
      type: "serviceIcon",
      items: [{ service: "Amazon VPC", icon: "networking-vpc" }],
    },
    { type: "heading", level: 2, text: "El rango de direcciones: notación CIDR" },
    {
      type: "paragraph",
      text:
        "Al crear una VPC defines su bloque de direcciones IPv4 mediante notación CIDR (Classless Inter-Domain Routing), por ejemplo 10.0.0.0/16. El sufijo /16 indica cuántos bits identifican la red: cuanto menor es el número, más direcciones disponibles. Un /16 ofrece hasta 65.536 direcciones, mientras que cada subred toma un subconjunto de ese rango, como 10.0.1.0/24 (256 direcciones).",
    },
    {
      type: "callout",
      variant: "info",
      text:
        "En cada subred, AWS reserva las primeras cuatro direcciones y la última de cada bloque CIDR para uso interno. Por eso una subred /24 ofrece 251 direcciones utilizables, no 256.",
    },
    { type: "heading", level: 2, text: "Subredes públicas y privadas" },
    {
      type: "paragraph",
      text:
        "Una subred vive en una única zona de disponibilidad. Lo que la hace pública o privada no es un atributo intrínseco, sino su tabla de ruteo: una subred es pública cuando su tabla de ruteo tiene una ruta hacia un Internet Gateway; es privada cuando no la tiene.",
    },
    {
      type: "list",
      items: [
        "Subred pública: tiene una ruta 0.0.0.0/0 apuntando a un Internet Gateway (IGW). Ideal para balanceadores de carga, bastiones o servidores web expuestos.",
        "Subred privada: no tiene ruta directa al IGW. Aloja bases de datos y servidores de aplicación que no deben recibir tráfico entrante desde Internet.",
        "La separación pública/privada es la base del patrón de arquitectura de múltiples capas (web/app/datos) en AWS.",
      ],
    },
    { type: "heading", level: 2, text: "Internet Gateway y NAT Gateway" },
    {
      type: "paragraph",
      text:
        "El Internet Gateway (IGW) es el componente que permite la comunicación bidireccional entre las instancias con IP pública y la Internet. El NAT Gateway, en cambio, permite que las instancias de una subred privada inicien conexiones salientes hacia Internet (por ejemplo para descargar parches) sin que nada en Internet pueda iniciar una conexión entrante hacia ellas.",
    },
    {
      type: "callout",
      variant: "warning",
      text:
        "El NAT Gateway se despliega en una subred pública y genera costo por hora y por GB procesado. Para alta disponibilidad se recomienda uno por zona de disponibilidad, lo que multiplica el costo: dimensiónalo con criterio.",
    },
    { type: "heading", level: 2, text: "Crear la VPC y la subred con el CLI de AWS" },
    {
      type: "code",
      lang: "bash",
      title: "Crear una VPC /16 y una subred /24 pública",
      code:
        "aws ec2 create-vpc \\\n" +
        "  --cidr-block 10.0.0.0/16 \\\n" +
        "  --region us-east-1\n\n" +
        "aws ec2 create-subnet \\\n" +
        "  --vpc-id vpc-0a1b2c3d4e5f67890 \\\n" +
        "  --cidr-block 10.0.1.0/24 \\\n" +
        "  --availability-zone us-east-1a \\\n" +
        "  --region us-east-1",
      highlightLines: [2, 7],
    },
    {
      type: "code",
      lang: "bash",
      title: "Asociar un Internet Gateway y crear la ruta por defecto",
      code:
        "aws ec2 create-internet-gateway \\\n" +
        "  --region us-east-1\n\n" +
        "aws ec2 attach-internet-gateway \\\n" +
        "  --internet-gateway-id igw-0123456789abcdef0 \\\n" +
        "  --vpc-id vpc-0a1b2c3d4e5f67890 \\\n" +
        "  --region us-east-1\n\n" +
        "aws ec2 create-route \\\n" +
        "  --route-table-id rtb-0123456789abcdef0 \\\n" +
        "  --destination-cidr-block 0.0.0.0/0 \\\n" +
        "  --gateway-id igw-0123456789abcdef0 \\\n" +
        "  --region us-east-1",
      highlightLines: [10, 11, 12],
    },
    {
      type: "paragraph",
      text:
        "La ruta 0.0.0.0/0 → IGW es exactamente lo que convierte a la subred asociada a esa tabla de ruteo en una subred pública. Sin esa ruta, la subred permanece aislada de Internet.",
    },
  ],
  selfCheck: [
    {
      question: "¿Qué determina que una subred de una VPC sea pública o privada?",
      options: [
        "La zona de disponibilidad en la que se encuentra",
        "Que su tabla de ruteo tenga (o no) una ruta hacia un Internet Gateway",
        "El tamaño del bloque CIDR asignado a la subred",
        "Un atributo booleano fijo que se define al crear la VPC",
      ],
      correctIndex: 1,
      explanation:
        "Una subred es pública cuando su tabla de ruteo incluye una ruta (0.0.0.0/0) hacia un Internet Gateway, y privada cuando no la tiene. No es un atributo intrínseco de la subred.",
    },
    {
      question:
        "¿Cuál es la función de un NAT Gateway en una subred privada?",
      options: [
        "Permitir que Internet inicie conexiones entrantes hacia las instancias privadas",
        "Reemplazar al Internet Gateway para todo el tráfico de la VPC",
        "Permitir que las instancias privadas inicien conexiones salientes a Internet sin ser accesibles desde fuera",
        "Asignar direcciones IPv4 privadas a cada instancia de la subred",
      ],
      correctIndex: 2,
      explanation:
        "El NAT Gateway permite que las instancias de una subred privada inicien tráfico saliente hacia Internet (p. ej. actualizaciones) mientras impide que se inicien conexiones entrantes hacia ellas.",
    },
  ],
};
