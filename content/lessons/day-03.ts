import type { Lesson } from "@/lib/types";

export const day03: Lesson = {
  day: 3,
  slug: "fundamentos-well-architected",
  title: "AWS Well-Architected Framework: los 6 pilares",
  section: "Fundamentos de AWS",
  estimatedMinutes: 25,
  icon: "layer-arquitectura-buenas-practicas",
  objectives: [
    "Entender qué es el AWS Well-Architected Framework y para qué sirve",
    "Conocer los 6 pilares y qué pregunta de diseño responde cada uno",
    "Reconocer los compromisos (trade-offs) que surgen entre pilares",
    "Relacionar los pilares con decisiones concretas de arquitectura en la nube",
  ],
  blocks: [
    {
      type: "paragraph",
      text:
        "El AWS Well-Architected Framework es un conjunto de buenas prácticas y preguntas guía que AWS publica para ayudarte a diseñar y operar cargas de trabajo seguras, fiables, eficientes, rentables y sostenibles en la nube. No es una herramienta que ejecutas: es un marco de evaluación que te obliga a hacerte las preguntas correctas ANTES de que un problema te explote en producción.",
    },
    {
      type: "callout",
      variant: "info",
      text:
        "El framework se organiza en 6 pilares. Durante años fueron 5; AWS añadió el pilar de Sostenibilidad en 2021. Ninguno es opcional: una buena arquitectura equilibra los seis según el contexto del negocio.",
    },
    { type: "heading", level: 2, text: "Los 6 pilares" },
    {
      type: "serviceIcon",
      items: [
        { service: "Arquitectura y Buenas Prácticas", icon: "layer-arquitectura-buenas-practicas" },
        { service: "AWS IAM", icon: "security-iam" },
        { service: "Amazon CloudWatch", icon: "monitoring-cloudwatch" },
        { service: "AWS Cost Explorer", icon: "finops-cost-explorer" },
      ],
    },
    { type: "heading", level: 3, text: "1. Excelencia operativa (Operational Excellence)" },
    {
      type: "paragraph",
      text:
        "Capacidad de ejecutar y monitorear sistemas para entregar valor de negocio y mejorar continuamente los procesos y procedimientos. Pregunta clave: ¿cómo despliegas, observas y mejoras tus operaciones de forma automatizada y repetible? Infraestructura como código, observabilidad y pequeños cambios reversibles son sus señas.",
    },
    { type: "heading", level: 3, text: "2. Seguridad (Security)" },
    {
      type: "paragraph",
      text:
        "Proteger la información, los sistemas y los activos. Abarca gestión de identidades (IAM), protección de datos en tránsito y en reposo (cifrado con KMS), trazabilidad y respuesta a incidentes. Pregunta clave: ¿quién puede acceder a qué, y cómo lo detectas y respondes si algo va mal?",
    },
    { type: "heading", level: 3, text: "3. Fiabilidad (Reliability)" },
    {
      type: "paragraph",
      text:
        "Capacidad de una carga de trabajo de funcionar correctamente y recuperarse de fallos. Incluye diseño multi-AZ, recuperación automática, gestión de la demanda y pruebas de recuperación. Pregunta clave: ¿tu sistema sobrevive a la caída de un componente, de una Zona de Disponibilidad o de una Región?",
    },
    { type: "heading", level: 3, text: "4. Eficiencia del rendimiento (Performance Efficiency)" },
    {
      type: "paragraph",
      text:
        "Usar los recursos de cómputo de forma eficiente para cumplir los requisitos y mantener esa eficiencia cuando cambia la demanda. Pregunta clave: ¿estás usando el tipo de recurso adecuado (serverless, contenedores, el tamaño de instancia correcto) y lo ajustas según la carga?",
    },
    { type: "heading", level: 3, text: "5. Optimización de costos (Cost Optimization)" },
    {
      type: "paragraph",
      text:
        "Evitar costos innecesarios: entender en qué gastas, elegir el modelo de precios adecuado y escalar para cubrir solo la demanda real. Pregunta clave: ¿estás pagando por lo que usas o por lo que aprovisionaste 'por si acaso'? Herramientas como AWS Cost Explorer y AWS Budgets apoyan este pilar.",
    },
    { type: "heading", level: 3, text: "6. Sostenibilidad (Sustainability)" },
    {
      type: "paragraph",
      text:
        "Minimizar el impacto ambiental de las cargas de trabajo en la nube: maximizar la utilización, elegir Regiones y servicios eficientes y reducir el cómputo desperdiciado. Pregunta clave: ¿puedes lograr el mismo resultado consumiendo menos recursos?",
    },
    { type: "heading", level: 2, text: "Los compromisos entre pilares" },
    {
      type: "paragraph",
      text:
        "Los pilares a menudo tiran en direcciones opuestas, y ahí está la verdadera decisión de arquitectura. Replicar datos en varias Regiones mejora la fiabilidad, pero sube el costo. Cifrarlo todo y auditar cada acción refuerza la seguridad, pero puede añadir latencia y afectar al rendimiento. El framework no te da una respuesta única: te obliga a hacer el compromiso de forma consciente según las prioridades del negocio.",
    },
    {
      type: "list",
      items: [
        "Fiabilidad vs. Costo: más redundancia (multi-AZ, multi-Región) significa más gasto.",
        "Seguridad vs. Rendimiento: controles y cifrado adicionales pueden introducir latencia.",
        "Rendimiento vs. Costo: instancias más potentes rinden más pero cuestan más; a veces conviene escalar horizontalmente.",
      ],
    },
    {
      type: "callout",
      variant: "success",
      text:
        "Úsalo como checklist vivo: revisa tu arquitectura contra los 6 pilares de forma periódica, no una sola vez. Las cargas de trabajo evolucionan y lo que era 'bien diseñado' hace un año puede no serlo hoy.",
    },
  ],
  selfCheck: [
    {
      question: "¿Cuántos pilares tiene actualmente el AWS Well-Architected Framework y cuál fue el último en añadirse?",
      options: [
        "5 pilares; el último fue Seguridad",
        "6 pilares; el último en añadirse fue Sostenibilidad",
        "4 pilares; el último fue Fiabilidad",
        "7 pilares; el último fue Rendimiento",
      ],
      correctIndex: 1,
      explanation:
        "El framework tiene 6 pilares. Originalmente eran 5 y AWS incorporó el pilar de Sostenibilidad en 2021, cerrando el conjunto actual: Excelencia operativa, Seguridad, Fiabilidad, Eficiencia del rendimiento, Optimización de costos y Sostenibilidad.",
    },
    {
      question: "¿Qué pregunta de diseño responde principalmente el pilar de Fiabilidad?",
      options: [
        "¿Estoy pagando solo por lo que uso?",
        "¿Mi sistema se recupera y sigue funcionando ante la caída de un componente o de una Zona de Disponibilidad?",
        "¿Quién puede acceder a cada recurso?",
        "¿Puedo lograr lo mismo consumiendo menos recursos?",
      ],
      correctIndex: 1,
      explanation:
        "El pilar de Fiabilidad se centra en que la carga de trabajo funcione correctamente y se recupere de fallos, lo que incluye diseños multi-AZ, recuperación automática y pruebas de recuperación.",
    },
    {
      question: "Replicas tus datos en tres Regiones para mejorar la fiabilidad. ¿Qué compromiso del framework estás asumiendo?",
      options: [
        "Mejoras la fiabilidad pero aumentas el costo",
        "Mejoras el costo pero reduces la seguridad",
        "No hay ningún compromiso: la replicación es siempre gratuita",
        "Mejoras la sostenibilidad pero reduces la fiabilidad",
      ],
      correctIndex: 0,
      explanation:
        "La replicación multi-Región aumenta la redundancia y, por tanto, la fiabilidad, pero añade gasto de almacenamiento y transferencia. Es un trade-off típico entre el pilar de Fiabilidad y el de Optimización de costos que debe decidirse de forma consciente.",
    },
  ],
};
