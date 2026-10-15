import type { Lesson } from "@/lib/types";

// Capa_Temática "Monitoreo y Observabilidad" (dayRange [18, 20]).
// Día 18 — Amazon CloudWatch: métricas, logs, alarmas y dashboards, los cuatro
// pilares para observar el estado y el comportamiento de tus recursos en AWS.
//
// Trazabilidad: Req 3.7, 5.1, 5.2, 9.1, 9.4, 11.3.
export const day18: Lesson = {
  day: 18,
  slug: "monitoreo-cloudwatch",
  title: "Amazon CloudWatch: métricas, logs, alarmas y dashboards",
  section: "Monitoreo y Observabilidad",
  estimatedMinutes: 25,
  icon: "monitoring-cloudwatch",
  objectives: [
    "Explicar qué es Amazon CloudWatch y los cuatro componentes que ofrece: métricas, logs, alarmas y dashboards",
    "Diferenciar entre métricas estándar y métricas personalizadas, y comprender el concepto de namespace y dimensión",
    "Crear una alarma que vigile una métrica y notifique mediante Amazon SNS cuando se supere un umbral",
  ],
  blocks: [
    {
      type: "paragraph",
      text:
        "Amazon CloudWatch es el servicio de monitoreo y observabilidad nativo de AWS. Recopila datos operativos en forma de métricas, logs y eventos, y te permite reaccionar ante ellos mediante alarmas y automatizaciones. Su objetivo es darte una visión unificada del estado de tus aplicaciones y de la infraestructura que las soporta.",
    },
    {
      type: "callout",
      variant: "info",
      text:
        "Observabilidad no es solo 'ver gráficas'. Es la capacidad de responder preguntas sobre el comportamiento interno de tu sistema a partir de sus señales externas: métricas (qué tanto), logs (qué pasó) y trazas (dónde pasó). CloudWatch cubre las dos primeras y se integra con X-Ray para la tercera.",
    },
    { type: "heading", level: 2, text: "Los cuatro componentes de CloudWatch" },
    {
      type: "list",
      items: [
        "Métricas: series temporales de datos numéricos (por ejemplo, CPUUtilization de una instancia EC2). Se organizan por namespace y se identifican con dimensiones.",
        "Logs (CloudWatch Logs): ingesta, almacenamiento y consulta centralizada de registros de aplicaciones y servicios, organizados en grupos y flujos (log groups y log streams).",
        "Alarmas: vigilan una métrica (o una expresión de métricas) y cambian de estado cuando se cruza un umbral, pudiendo disparar acciones como notificar por SNS o escalar con Auto Scaling.",
        "Dashboards: paneles personalizables que combinan métricas y widgets para visualizar el estado del sistema de un vistazo.",
      ],
    },
    { type: "heading", level: 2, text: "Métricas estándar vs. personalizadas" },
    {
      type: "paragraph",
      text:
        "Muchos servicios de AWS publican métricas estándar automáticamente y sin costo adicional en namespaces como AWS/EC2 o AWS/Lambda. Cuando necesitas medir algo propio de tu aplicación (por ejemplo, el número de pedidos procesados), publicas métricas personalizadas con el CLI o el SDK. Cada métrica vive en un namespace y se distingue por sus dimensiones (pares clave-valor como InstanceId=i-0abc...).",
    },
    {
      type: "code",
      lang: "bash",
      title: "Publicar una métrica personalizada en CloudWatch",
      code:
        "aws cloudwatch put-metric-data \\\n" +
        "  --namespace \"MiApp/Pedidos\" \\\n" +
        "  --metric-name PedidosProcesados \\\n" +
        "  --dimensions Entorno=produccion \\\n" +
        "  --value 42 \\\n" +
        "  --unit Count \\\n" +
        "  --region us-east-2",
    },
    { type: "heading", level: 2, text: "Alarmas: de la métrica a la acción" },
    {
      type: "paragraph",
      text:
        "Una alarma observa una métrica durante un número de periodos de evaluación y cambia a estado ALARM cuando el valor cruza el umbral que definiste. Al entrar en ALARM, puede notificar a un tema de Amazon SNS (correo, SMS, Lambda) o ejecutar acciones de Auto Scaling. El ejemplo crea una alarma que se dispara si la CPU promedio de una instancia supera el 80 % durante dos periodos de cinco minutos.",
    },
    {
      type: "code",
      lang: "bash",
      title: "Crear una alarma de CPU alta que notifica por SNS",
      code:
        "aws cloudwatch put-metric-alarm \\\n" +
        "  --alarm-name \"ec2-cpu-alta\" \\\n" +
        "  --alarm-description \"CPU > 80% durante 10 minutos\" \\\n" +
        "  --namespace AWS/EC2 \\\n" +
        "  --metric-name CPUUtilization \\\n" +
        "  --dimensions Name=InstanceId,Value=i-0123456789abcdef0 \\\n" +
        "  --statistic Average \\\n" +
        "  --period 300 \\\n" +
        "  --evaluation-periods 2 \\\n" +
        "  --threshold 80 \\\n" +
        "  --comparison-operator GreaterThanThreshold \\\n" +
        "  --alarm-actions arn:aws:sns:us-east-2:111122223333:alertas-ops \\\n" +
        "  --region us-east-2",
    },
    {
      type: "callout",
      variant: "warning",
      text:
        "Ojo con el periodo y los periodos de evaluación: un periodo demasiado corto genera alarmas 'nerviosas' por picos transitorios; demasiado largo retrasa la detección. Ajusta ambos al comportamiento real de tu carga y usa 'datapoints to alarm' para exigir N de M puntos antes de disparar.",
    },
    { type: "heading", level: 2, text: "Dashboards para una vista unificada" },
    {
      type: "paragraph",
      text:
        "Los dashboards de CloudWatch son paneles que agrupan widgets (gráficas de métricas, números, texto) en una sola vista. Son útiles para que un equipo observe de un vistazo la salud de un servicio sin navegar servicio por servicio. Se definen de forma declarativa con un documento JSON de cuerpo del dashboard.",
    },
    {
      type: "code",
      lang: "json",
      title: "Cuerpo (dashboard body) de un dashboard de CloudWatch",
      code:
        "{\n" +
        "  \"widgets\": [\n" +
        "    {\n" +
        "      \"type\": \"metric\",\n" +
        "      \"x\": 0,\n" +
        "      \"y\": 0,\n" +
        "      \"width\": 12,\n" +
        "      \"height\": 6,\n" +
        "      \"properties\": {\n" +
        "        \"title\": \"CPU de la instancia\",\n" +
        "        \"region\": \"us-east-2\",\n" +
        "        \"metrics\": [\n" +
        "          [\"AWS/EC2\", \"CPUUtilization\", \"InstanceId\", \"i-0123456789abcdef0\"]\n" +
        "        ],\n" +
        "        \"period\": 300,\n" +
        "        \"stat\": \"Average\"\n" +
        "      }\n" +
        "    }\n" +
        "  ]\n" +
        "}",
    },
    { type: "heading", level: 2, text: "Servicios de esta capa" },
    {
      type: "serviceIcon",
      items: [{ service: "Amazon CloudWatch", icon: "monitoring-cloudwatch" }],
    },
  ],
  selfCheck: [
    {
      question:
        "¿Cuál de estos componentes de CloudWatch cambia de estado cuando una métrica cruza un umbral y puede notificar por Amazon SNS?",
      options: [
        "Un log group de CloudWatch Logs",
        "Una alarma de CloudWatch",
        "Un dashboard de CloudWatch",
        "Un namespace de métricas",
      ],
      correctIndex: 1,
      explanation:
        "Las alarmas vigilan una métrica durante los periodos de evaluación y, al cruzar el umbral, pasan a estado ALARM y disparan acciones como notificar a un tema de SNS o ejecutar Auto Scaling. Los logs almacenan registros, los dashboards visualizan y el namespace solo agrupa métricas.",
    },
    {
      question:
        "Necesitas medir una señal propia de tu aplicación (pedidos procesados por minuto) que AWS no publica por defecto. ¿Qué usas?",
      options: [
        "Una métrica estándar del namespace AWS/EC2",
        "Una métrica personalizada publicada con put-metric-data en tu propio namespace",
        "Un dashboard, porque los dashboards generan métricas",
        "Una alarma, porque las alarmas crean la métrica que vigilan",
      ],
      correctIndex: 1,
      explanation:
        "Las métricas estándar las publican los servicios de AWS automáticamente. Para señales propias de tu aplicación publicas métricas personalizadas con put-metric-data (o el SDK) en un namespace tuyo. Dashboards y alarmas consumen métricas, no las crean.",
    },
  ],
};
