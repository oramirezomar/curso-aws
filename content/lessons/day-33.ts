import type { Lesson } from "@/lib/types";

// Capa_Temática "Costos y FinOps" (dayRange [33, 33]).
// Día 33 — Visibilidad, control y optimización del gasto en AWS: AWS Cost
// Explorer (análisis de costos y uso), AWS Budgets (presupuestos y alertas) y
// AWS Savings Plans (compromisos de ahorro para cómputo).
//
// Trazabilidad: Req 3.14, 5.1, 5.2, 9.1, 9.4, 11.3.
export const day33: Lesson = {
  day: 33,
  slug: "costos-finops",
  title: "Costos y FinOps: AWS Cost Explorer, AWS Budgets y Savings Plans",
  section: "Costos y FinOps",
  estimatedMinutes: 30,
  objectives: [
    "Entender AWS Cost Explorer como herramienta de análisis y visualización del costo y el uso a lo largo del tiempo",
    "Configurar presupuestos y alertas con AWS Budgets para controlar el gasto de forma proactiva",
    "Comprender los Savings Plans como compromiso de uso que reduce el costo del cómputo frente a la tarifa bajo demanda",
  ],
  blocks: [
    {
      type: "paragraph",
      text:
        "En AWS pagas por lo que usas, pero esa flexibilidad se vuelve un problema si nadie mira la factura hasta fin de mes. FinOps es la práctica de dar visibilidad, responsabilidad y control sobre el gasto en la nube. AWS ofrece tres piezas clave para ello: Cost Explorer para entender a dónde se va el dinero, AWS Budgets para poner límites y recibir alertas antes de que sea tarde, y los Savings Plans para pagar menos comprometiendo un uso base.",
    },
    {
      type: "callout",
      variant: "info",
      text:
        "Cost Explorer, AWS Budgets y Savings Plans son servicios de facturación de alcance global y se operan desde la Región us-east-1 para las APIs de Cost Explorer (ce) y Budgets. Aun así, es buena práctica indicar siempre --region de forma explícita en la CLI.",
    },
    { type: "heading", level: 2, text: "AWS Cost Explorer: análisis del gasto" },
    {
      type: "paragraph",
      text:
        "AWS Cost Explorer te permite visualizar, entender y gestionar tu costo y uso a lo largo del tiempo. Ofrece gráficos y tablas con granularidad diaria o mensual, filtros por servicio, Región, cuenta o etiqueta (tag), y agrupaciones que responden preguntas concretas: ¿qué servicio creció este mes?, ¿qué cuenta de la organización gasta más? También incluye previsiones (forecast) basadas en tu histórico de consumo.",
    },
    {
      type: "list",
      items: [
        "Granularidad: define si los importes se agregan por día (DAILY) o por mes (MONTHLY).",
        "Métricas: UnblendedCost (costo real facturado), AmortizedCost (costo amortizado de compromisos) y UsageQuantity (cantidad de uso), entre otras.",
        "Agrupación (GroupBy): divide el resultado por dimensión (SERVICE, REGION, LINKED_ACCOUNT) o por etiqueta de asignación de costos.",
        "Filtros: acotan el análisis a un subconjunto, por ejemplo solo Amazon EC2 o solo una cuenta concreta.",
      ],
    },
    {
      type: "code",
      lang: "bash",
      title: "Consultar costo y uso agrupado por servicio con Cost Explorer (CLI de AWS)",
      code:
        "aws ce get-cost-and-usage \\\n" +
        "  --time-period Start=2024-05-01,End=2024-06-01 \\\n" +
        "  --granularity MONTHLY \\\n" +
        "  --metrics \"UnblendedCost\" \\\n" +
        "  --group-by Type=DIMENSION,Key=SERVICE \\\n" +
        "  --region us-east-1",
    },
    { type: "heading", level: 2, text: "AWS Budgets: presupuestos y alertas" },
    {
      type: "paragraph",
      text:
        "Cost Explorer te dice qué pasó; AWS Budgets te avisa antes de que pase. Un presupuesto (budget) define un umbral de costo o de uso para un periodo (mensual, trimestral o anual) y notifica cuando el gasto real o previsto supera un porcentaje de ese umbral. Las alertas se envían por Amazon SNS o correo, de modo que te enteras del sobregasto a tiempo y no cuando llega la factura.",
    },
    {
      type: "list",
      ordered: true,
      items: [
        "Define el tipo de presupuesto: de costo (COST), de uso (USAGE), de Savings Plans o de cobertura/utilización de reservas.",
        "Fija el importe límite y el periodo (por ejemplo, 500 USD mensuales).",
        "Configura notificaciones por umbral: avisar al 80% del gasto real y al 100% del previsto (forecast).",
        "Enruta las alertas a los responsables mediante correo o un tema de Amazon SNS.",
      ],
    },
    {
      type: "code",
      lang: "json",
      title: "Definición de un presupuesto mensual de costo para AWS Budgets",
      code:
        "{\n" +
        "  \"BudgetName\": \"presupuesto-mensual-general\",\n" +
        "  \"BudgetType\": \"COST\",\n" +
        "  \"TimeUnit\": \"MONTHLY\",\n" +
        "  \"BudgetLimit\": {\n" +
        "    \"Amount\": \"500\",\n" +
        "    \"Unit\": \"USD\"\n" +
        "  }\n" +
        "}",
    },
    {
      type: "code",
      lang: "bash",
      title: "Crear el presupuesto a partir de la definición JSON (CLI de AWS)",
      code:
        "aws budgets create-budget \\\n" +
        "  --account-id 111122223333 \\\n" +
        "  --budget file://presupuesto.json \\\n" +
        "  --region us-east-1",
    },
    {
      type: "callout",
      variant: "warning",
      text:
        "Un presupuesto NO frena el gasto por sí solo: solo notifica. Si necesitas una acción automática (por ejemplo, aplicar una política de IAM restrictiva al superar el umbral), configúrala con AWS Budgets Actions; de lo contrario, la alerta es informativa y el gasto continúa.",
    },
    { type: "heading", level: 2, text: "AWS Savings Plans: compromisos de ahorro" },
    {
      type: "paragraph",
      text:
        "Los Savings Plans son un modelo de precios que ofrece descuentos sobre la tarifa bajo demanda a cambio de comprometer un gasto por hora constante (medido en USD/hora) durante un plazo de uno o tres años. A diferencia de las Instancias Reservadas clásicas, los Compute Savings Plans aplican de forma flexible a EC2, AWS Fargate y AWS Lambda, sin atarte a una familia de instancia o Región concreta.",
    },
    {
      type: "list",
      items: [
        "Compute Savings Plans: máxima flexibilidad; el descuento aplica a EC2, Fargate y Lambda en cualquier Región, familia o tamaño.",
        "EC2 Instance Savings Plans: mayor descuento a cambio de comprometerte con una familia de instancias en una Región concreta.",
        "Plazo: 1 o 3 años. Pago total por adelantado, parcial o sin pago inicial; a mayor compromiso inicial, mayor descuento.",
        "Idea clave: comprometes un gasto base que sabes que vas a consumir siempre; el pico variable se cubre con tarifa bajo demanda.",
      ],
    },
    {
      type: "callout",
      variant: "success",
      text:
        "Flujo FinOps recomendado: analiza tu uso estable con Cost Explorer, protege ese gasto con un presupuesto en AWS Budgets y, una vez que conoces tu consumo base de cómputo, cómpralo con un Savings Plan para pagar menos por lo que ya ibas a usar.",
    },
    { type: "heading", level: 2, text: "Servicios de esta capa" },
    {
      type: "serviceIcon",
      items: [
        { service: "AWS Cost Explorer", icon: "finops-cost-explorer" },
        { service: "AWS Budgets", icon: "finops-budgets" },
        { service: "AWS Savings Plans", icon: "finops-savings-plans" },
      ],
    },
  ],
  icon: "finops-cost-explorer",
  selfCheck: [
    {
      question:
        "¿Cuál es la diferencia principal entre AWS Cost Explorer y AWS Budgets?",
      options: [
        "Cost Explorer bloquea el gasto automáticamente y AWS Budgets solo lo visualiza",
        "Cost Explorer analiza y visualiza el costo y uso histórico, mientras que AWS Budgets fija umbrales y notifica cuando el gasto real o previsto los supera",
        "Son el mismo servicio con dos nombres distintos",
        "Cost Explorer solo funciona con Savings Plans y AWS Budgets solo con Instancias Reservadas",
      ],
      correctIndex: 1,
      explanation:
        "Cost Explorer responde '¿a dónde se fue el dinero?' con gráficos, filtros y previsiones sobre el histórico. AWS Budgets es proactivo: defines un umbral de costo o uso y te alerta (por correo o SNS) cuando el gasto real o previsto lo supera, antes de recibir la factura.",
    },
    {
      question:
        "¿Qué caracteriza a un Compute Savings Plan frente a la tarifa bajo demanda?",
      options: [
        "Es gratis y no implica ningún compromiso de uso",
        "Ofrece descuento a cambio de comprometer un gasto por hora constante durante 1 o 3 años, y aplica de forma flexible a EC2, Fargate y Lambda",
        "Solo aplica a una única instancia EC2 fija en una sola Región",
        "Garantiza que AWS nunca te cobrará por encima del compromiso, aunque uses más",
      ],
      correctIndex: 1,
      explanation:
        "Un Compute Savings Plan reduce el costo frente a la tarifa bajo demanda a cambio de comprometer un gasto por hora (USD/hora) por 1 o 3 años. Su ventaja es la flexibilidad: el descuento se aplica a EC2, AWS Fargate y AWS Lambda en cualquier Región, familia o tamaño. El uso por encima del compromiso se cobra a tarifa bajo demanda.",
    },
  ],
};
