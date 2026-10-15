import type { Lesson } from "@/lib/types";

// Capa_Temática "Contenedores a fondo" (dayRange [10, 11]).
// Día 11 — AWS Fargate: ejecución serverless de contenedores sobre Amazon ECS
// y Amazon EKS, y los criterios para decidir cuándo usarlo frente a EC2.
//
// Trazabilidad: Req 3.10, 5.1, 5.2, 9.1, 9.4, 11.3.
export const day11: Lesson = {
  day: 11,
  slug: "contenedores-fargate",
  title: "AWS Fargate: contenedores sin administrar servidores",
  section: "Contenedores a fondo",
  estimatedMinutes: 25,
  objectives: [
    "Entender qué es AWS Fargate y cómo elimina la gestión de la infraestructura de cómputo",
    "Diferenciar el modelo de capacidad Fargate del modelo basado en instancias EC2 en ECS y EKS",
    "Decidir con criterio cuándo conviene usar Fargate y cuándo seguir con EC2",
  ],
  blocks: [
    {
      type: "paragraph",
      text:
        "AWS Fargate es un motor de cómputo serverless para contenedores que funciona tanto con Amazon ECS como con Amazon EKS. Con Fargate ya no aprovisionas, parcheas ni escalas instancias EC2: tú declaras cuánta CPU y memoria necesita tu contenedor, y AWS se encarga de provisionar y administrar el cómputo subyacente de forma transparente.",
    },
    {
      type: "callout",
      variant: "info",
      text:
        "La idea clave: Fargate no es un servicio aparte que reemplace a ECS/EKS, es un 'tipo de capacidad' (launch type / capacity provider). Sigues usando ECS o EKS como orquestador; solo cambia quién administra los servidores donde corren tus tareas.",
    },
    { type: "heading", level: 2, text: "Fargate vs. EC2: dos modelos de capacidad" },
    {
      type: "list",
      items: [
        "Modelo EC2: tú gestionas un clúster de instancias EC2 (parches, escalado, binpacking de contenedores). Más control y, a escala alta y sostenida, puede ser más económico.",
        "Modelo Fargate: AWS gestiona el cómputo. Pagas por la CPU y memoria que solicita cada tarea mientras se ejecuta. Menos operación, ideal para cargas variables o equipos pequeños.",
        "Aislamiento: en Fargate cada tarea corre en su propio entorno de kernel aislado, lo que mejora la postura de seguridad frente a compartir un host.",
      ],
    },
    { type: "heading", level: 2, text: "Cómo se declara: la definición de tarea" },
    {
      type: "paragraph",
      text:
        "En ECS, el contrato de ejecución es la definición de tarea (task definition). Para Fargate declaras requiresCompatibilities: FARGATE, el modo de red awsvpc y los valores de cpu/memory a nivel de tarea. Este es el YAML equivalente que luego se registra con el CLI de AWS.",
    },
    {
      type: "code",
      lang: "yaml",
      title: "Definición de tarea de ECS para Fargate (cpu/memory a nivel de tarea)",
      code:
        "family: mi-app\n" +
        "requiresCompatibilities:\n" +
        "  - FARGATE\n" +
        "networkMode: awsvpc\n" +
        "cpu: \"256\"      # 0.25 vCPU\n" +
        "memory: \"512\"   # 512 MiB\n" +
        "executionRoleArn: arn:aws:iam::111122223333:role/ecsTaskExecutionRole\n" +
        "containerDefinitions:\n" +
        "  - name: mi-app\n" +
        "    image: 111122223333.dkr.ecr.us-east-2.amazonaws.com/mi-app:latest\n" +
        "    essential: true\n" +
        "    portMappings:\n" +
        "      - containerPort: 8080\n" +
        "        protocol: tcp",
    },
    { type: "heading", level: 3, text: "Registrar la definición de tarea" },
    {
      type: "code",
      lang: "bash",
      title: "Registrar la task definition en ECS con el CLI de AWS",
      code:
        "aws ecs register-task-definition \\\n" +
        "  --cli-input-yaml file://task-definition.yaml \\\n" +
        "  --region us-east-2",
    },
    {
      type: "callout",
      variant: "warning",
      text:
        "En Fargate los valores de cpu y memory solo admiten combinaciones válidas predefinidas (por ejemplo, 256 CPU admite 512/1024/2048 MiB de memoria). Si eliges una combinación no soportada, el registro de la tarea fallará.",
    },
    { type: "heading", level: 2, text: "¿Cuándo usar Fargate?" },
    {
      type: "list",
      ordered: true,
      items: [
        "Cargas con tráfico variable o impredecible donde no quieres pagar instancias ociosas.",
        "Equipos que prefieren minimizar la operación de infraestructura (sin parchear ni escalar hosts).",
        "Microservicios y jobs por lotes de corta duración que arrancan y terminan con frecuencia.",
        "Requisitos de aislamiento por tarea sin compartir host entre contenedores de distinta confianza.",
      ],
    },
    {
      type: "paragraph",
      text:
        "Por el contrario, cuando tienes una carga grande, estable y predecible, o necesitas tipos de instancia muy específicos (GPU, mucha RAM, acceso a características del host), el modelo EC2 suele dar más control y mejor costo a escala. La decisión no es 'uno u otro' para siempre: puedes mezclar capacity providers en el mismo clúster.",
    },
    { type: "heading", level: 2, text: "Servicios de esta capa" },
    {
      type: "serviceIcon",
      items: [
        { service: "AWS Fargate", icon: "compute-fargate" },
        { service: "Amazon ECS", icon: "compute-ecs" },
        { service: "Amazon EKS", icon: "compute-eks" },
        { service: "Amazon ECR", icon: "containers-ecr" },
      ],
    },
  ],
  icon: "compute-fargate",
  selfCheck: [
    {
      question: "¿Qué describe mejor a AWS Fargate?",
      options: [
        "Un orquestador de contenedores que reemplaza por completo a ECS y EKS",
        "Un registro de imágenes de contenedor administrado",
        "Un tipo de capacidad serverless para ejecutar contenedores en ECS o EKS sin administrar servidores",
        "Un servicio de máquinas virtuales de propósito general",
      ],
      correctIndex: 2,
      explanation:
        "Fargate es un motor de cómputo serverless (un tipo de capacidad) que corre contenedores sobre ECS o EKS. No reemplaza al orquestador: elimina la gestión de las instancias EC2 subyacentes.",
    },
    {
      question:
        "¿En cuál de estos escenarios tiene MÁS sentido elegir Fargate frente a EC2?",
      options: [
        "Una carga enorme, estable y predecible 24/7 que busca el menor costo posible",
        "Microservicios con tráfico variable donde no quieres pagar instancias ociosas ni operar hosts",
        "Una aplicación que necesita acceso directo a GPUs específicas del host",
        "Un escenario donde requieres control total del sistema operativo de las instancias",
      ],
      correctIndex: 1,
      explanation:
        "Fargate brilla con cargas variables y equipos que quieren minimizar operación: pagas por la CPU/memoria solicitada mientras la tarea corre. Para cargas enormes y estables, o requisitos de hardware específicos (GPU), el modelo EC2 suele ser preferible.",
    },
  ],
};
