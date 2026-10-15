import type { Lesson } from "@/lib/types";

// Capa_Temática "Arquitectura y Buenas Prácticas" (dayRange [29, 30]).
// Día 30 — Alta disponibilidad: despliegues Multi-AZ, alarmas de Amazon
// CloudWatch y diseño tolerante a fallos para que la aplicación sobreviva a la
// caída de componentes individuales.
//
// Trazabilidad: Req 3.9, 5.1, 5.2, 9.1, 9.4, 11.3.
export const day30: Lesson = {
  day: 30,
  slug: "arquitectura-multiaz-alta-disponibilidad",
  title: "Alta disponibilidad: Multi-AZ, alarmas de CloudWatch y diseño tolerante a fallos",
  section: "Arquitectura y Buenas Prácticas",
  estimatedMinutes: 30,
  objectives: [
    "Entender el despliegue Multi-AZ y por qué distribuir recursos entre Zonas de Disponibilidad eleva la disponibilidad",
    "Comprender cómo las alarmas de Amazon CloudWatch detectan condiciones anómalas y disparan acciones correctivas",
    "Reconocer los principios de un diseño tolerante a fallos: redundancia, ausencia de puntos únicos de fallo y recuperación automática",
  ],
  blocks: [
    {
      type: "paragraph",
      text:
        "La alta disponibilidad consiste en diseñar sistemas que sigan funcionando aunque fallen componentes individuales. En AWS, el pilar fundamental es desplegar en varias Zonas de Disponibilidad (Multi-AZ): centros de datos físicamente separados dentro de una misma Región, conectados por una red de baja latencia. Si una Zona de Disponibilidad falla, las demás absorben la carga.",
    },
    {
      type: "callout",
      variant: "info",
      text:
        "Una Región de AWS contiene varias Zonas de Disponibilidad (AZ), y cada AZ está formada por uno o más centros de datos aislados. Distribuir recursos entre varias AZ es la forma más directa de evitar un punto único de fallo a nivel de infraestructura.",
    },
    { type: "heading", level: 2, text: "Despliegue Multi-AZ" },
    {
      type: "list",
      items: [
        "Cómputo: un grupo de Auto Scaling con instancias repartidas en varias AZ, detrás de un balanceador de carga, sobrevive a la caída de una zona.",
        "Bases de datos: Amazon RDS Multi-AZ mantiene una réplica en espera (standby) en otra AZ y hace failover automático si la principal falla.",
        "Almacenamiento: Amazon S3 y Amazon EFS replican los datos entre varias AZ de forma transparente.",
        "Redes: las subredes pertenecen a una única AZ; crear subredes en varias AZ es el primer paso para una arquitectura Multi-AZ.",
      ],
    },
    { type: "heading", level: 2, text: "Alarmas de Amazon CloudWatch" },
    {
      type: "paragraph",
      text:
        "Una alarma de Amazon CloudWatch observa una métrica (uso de CPU, latencia, errores HTTP, estado de instancia, etc.) y cambia de estado cuando esa métrica cruza un umbral durante un número de periodos definido. Al entrar en estado ALARM, puede notificar por Amazon SNS, disparar una política de Auto Scaling o ejecutar una acción de recuperación de la instancia. Son el disparador de la recuperación automática.",
    },
    {
      type: "code",
      lang: "bash",
      title: "Crear una alarma de CloudWatch por CPU alta con la CLI de AWS",
      code:
        "aws cloudwatch put-metric-alarm \\\n" +
        "  --alarm-name cpu-alta-asg-web \\\n" +
        "  --namespace AWS/EC2 \\\n" +
        "  --metric-name CPUUtilization \\\n" +
        "  --statistic Average \\\n" +
        "  --period 300 \\\n" +
        "  --evaluation-periods 2 \\\n" +
        "  --threshold 70 \\\n" +
        "  --comparison-operator GreaterThanThreshold \\\n" +
        "  --dimensions Name=AutoScalingGroupName,Value=mi-asg-web \\\n" +
        "  --alarm-actions arn:aws:sns:us-east-2:111122223333:alertas-ops \\\n" +
        "  --region us-east-2",
    },
    {
      type: "callout",
      variant: "warning",
      text:
        "Ajusta --evaluation-periods para evitar falsos positivos: una alarma que salta ante un pico momentáneo genera ruido y escalados innecesarios. Exigir que el umbral se supere durante varios periodos consecutivos filtra los picos transitorios.",
    },
    { type: "heading", level: 2, text: "Diseño tolerante a fallos" },
    {
      type: "list",
      ordered: true,
      items: [
        "Elimina los puntos únicos de fallo: duplica cada componente crítico en al menos dos AZ.",
        "Automatiza la recuperación: usa comprobaciones de estado y alarmas para reemplazar o reiniciar componentes sin intervención manual.",
        "Desacopla los componentes: colas (SQS) y balanceadores de carga aíslan fallos y evitan que la caída de una pieza arrastre a las demás.",
        "Prueba los fallos: simula la caída de una AZ o de una instancia para verificar que la arquitectura se recupera como esperas.",
      ],
    },
    {
      type: "callout",
      variant: "success",
      text:
        "La disponibilidad no se improvisa: se diseña con redundancia Multi-AZ, se vigila con alarmas de CloudWatch y se valida provocando fallos controlados. Asume que todo puede fallar y diseña para que la aplicación lo tolere.",
    },
    { type: "heading", level: 2, text: "Servicios de esta capa" },
    {
      type: "serviceIcon",
      items: [
        { service: "Amazon CloudWatch", icon: "monitoring-cloudwatch" },
      ],
    },
  ],
  icon: "layer-arquitectura-buenas-practicas",
  selfCheck: [
    {
      question:
        "¿Por qué desplegar en varias Zonas de Disponibilidad (Multi-AZ) mejora la disponibilidad?",
      options: [
        "Porque reduce el costo al usar un único centro de datos compartido",
        "Porque las Zonas de Disponibilidad están físicamente separadas, así que la caída de una no detiene a las demás",
        "Porque obliga a usar una sola subred para concentrar el tráfico",
        "Porque elimina la necesidad de comprobaciones de estado y alarmas",
      ],
      correctIndex: 1,
      explanation:
        "Cada Zona de Disponibilidad es un conjunto aislado de centros de datos dentro de la Región. Al repartir los recursos entre varias AZ, el fallo de una zona no deja la aplicación fuera de servicio, porque las otras AZ siguen operando.",
    },
    {
      question:
        "¿Qué ocurre cuando una alarma de Amazon CloudWatch entra en estado ALARM?",
      options: [
        "Elimina automáticamente la métrica que vigilaba",
        "Puede notificar por SNS, disparar una política de Auto Scaling o ejecutar una acción de recuperación",
        "Crea una nueva Zona de Disponibilidad en la Región",
        "Detiene permanentemente todas las instancias del grupo de Auto Scaling",
      ],
      correctIndex: 1,
      explanation:
        "Al cruzar el umbral durante los periodos configurados, la alarma pasa a estado ALARM y ejecuta las acciones asociadas: notificar por Amazon SNS, activar una política de escalado o recuperar la instancia. Así actúa como disparador de la recuperación automática.",
    },
  ],
};
