import type { Lesson } from "@/lib/types";

// Capa_Temática: Cómputo (Nivel BÁSICO, dayRange [4, 6]).
// Tema: Contenedores gestionados y PaaS — Amazon ECS, Amazon EKS y AWS
// Elastic Beanstalk (visión general y cuándo usar cada uno).
// Trazabilidad: Req 3.2, 5.1, 5.2, 9.1, 9.4, 11.3.
export const day06: Lesson = {
  day: 6,
  slug: "computo-ecs-eks-beanstalk",
  title: "Contenedores gestionados y PaaS: ECS, EKS y Elastic Beanstalk",
  section: "Cómputo",
  estimatedMinutes: 35,
  icon: "compute-ecs",
  objectives: [
    "Diferenciar Amazon ECS, Amazon EKS y AWS Elastic Beanstalk como opciones de cómputo gestionado",
    "Comprender el rol de AWS Fargate como motor de cómputo serverless para contenedores",
    "Decidir cuándo conviene cada servicio según el nivel de control y el modelo operativo",
  ],
  blocks: [
    {
      type: "paragraph",
      text:
        "Además de EC2 y Lambda, AWS ofrece servicios de orquestación de contenedores y plataformas como servicio (PaaS) que reducen la carga operativa. Amazon ECS y Amazon EKS orquestan contenedores; AWS Elastic Beanstalk abstrae por completo la infraestructura para desplegar aplicaciones web.",
    },
    {
      type: "serviceIcon",
      items: [
        { service: "Amazon ECS", icon: "compute-ecs" },
        { service: "Amazon EKS", icon: "compute-eks" },
        { service: "AWS Elastic Beanstalk", icon: "compute-elastic-beanstalk" },
        { service: "AWS Fargate", icon: "compute-fargate" },
      ],
    },
    { type: "heading", level: 2, text: "Amazon ECS: orquestación nativa de AWS" },
    {
      type: "paragraph",
      text:
        "Amazon Elastic Container Service (Amazon ECS) es un orquestador de contenedores totalmente gestionado y propio de AWS. Defines tareas (task definitions) que describen uno o varios contenedores y las ejecutas como servicios con escalado y balanceo. Es la opción más sencilla si tu equipo no necesita las APIs de Kubernetes.",
    },
    { type: "heading", level: 2, text: "Amazon EKS: Kubernetes gestionado" },
    {
      type: "paragraph",
      text:
        "Amazon Elastic Kubernetes Service (Amazon EKS) ejecuta Kubernetes gestionado por AWS, con un plano de control conforme al upstream. Es la opción indicada cuando ya usas Kubernetes, necesitas su ecosistema de herramientas o buscas portabilidad entre nubes, a cambio de una mayor complejidad operativa.",
    },
    { type: "heading", level: 2, text: "AWS Fargate: cómputo serverless para contenedores" },
    {
      type: "paragraph",
      text:
        "AWS Fargate es un motor de cómputo serverless que ejecuta contenedores sin que administres instancias EC2 subyacentes. Funciona como tipo de lanzamiento tanto para ECS como para EKS: defines CPU y memoria por tarea o pod y pagas solo por los recursos que consume, delegando la gestión de los nodos a AWS.",
    },
    { type: "heading", level: 2, text: "AWS Elastic Beanstalk: PaaS de despliegue" },
    {
      type: "paragraph",
      text:
        "AWS Elastic Beanstalk es una plataforma como servicio: subes el código de tu aplicación y Elastic Beanstalk aprovisiona y gestiona automáticamente la capacidad (EC2), el balanceo de carga, el escalado automático y la monitorización. Mantienes el control de los recursos subyacentes, pero sin configurarlos manualmente.",
    },
    { type: "heading", level: 2, text: "¿Cuándo usar cada uno?" },
    {
      type: "list",
      items: [
        "Elige Elastic Beanstalk para desplegar una aplicación web estándar rápidamente, con mínima gestión de infraestructura.",
        "Elige Amazon ECS para orquestar contenedores con integración nativa de AWS y una curva de aprendizaje baja.",
        "Elige Amazon EKS cuando necesites Kubernetes, su ecosistema o portabilidad multinube.",
        "Combina ECS o EKS con AWS Fargate para no gestionar servidores de los contenedores.",
      ],
    },
    {
      type: "code",
      lang: "bash",
      title: "Crear un servicio ECS con tipo de lanzamiento Fargate",
      code:
        "aws ecs create-service \\\n" +
        "  --cluster produccion \\\n" +
        "  --service-name api-pedidos \\\n" +
        "  --task-definition api-pedidos:3 \\\n" +
        "  --desired-count 2 \\\n" +
        "  --launch-type FARGATE \\\n" +
        '  --network-configuration "awsvpcConfiguration={subnets=[subnet-0123456789abcdef0],securityGroups=[sg-0123456789abcdef0],assignPublicIp=DISABLED}" \\\n' +
        "  --region us-east-1",
      highlightLines: [6],
    },
    {
      type: "code",
      lang: "yaml",
      title: "Elastic Beanstalk: .ebextensions con variables de entorno",
      code:
        "option_settings:\n" +
        "  aws:elasticbeanstalk:application:environment:\n" +
        "    NODE_ENV: production\n" +
        "    LOG_LEVEL: info\n" +
        "  aws:autoscaling:asg:\n" +
        '    MinSize: "2"\n' +
        '    MaxSize: "4"',
      highlightLines: [2, 3],
    },
    {
      type: "callout",
      variant: "info",
      text:
        "Fargate no es un servicio independiente de orquestación: es un tipo de lanzamiento (launch type) para ECS y un modo de cómputo para EKS. La alternativa es el tipo EC2, donde tú gestionas las instancias del clúster.",
    },
  ],
  selfCheck: [
    {
      question: "¿Cuál es la diferencia principal entre Amazon ECS y Amazon EKS?",
      options: [
        "ECS es serverless y EKS requiere siempre gestionar instancias EC2",
        "ECS es el orquestador propio de AWS y EKS ejecuta Kubernetes gestionado",
        "ECS solo ejecuta funciones y EKS solo ejecuta máquinas virtuales",
        "No hay diferencia: son dos nombres del mismo servicio",
      ],
      correctIndex: 1,
      explanation:
        "Amazon ECS es el orquestador de contenedores nativo de AWS, mientras que Amazon EKS ejecuta Kubernetes gestionado, indicado cuando necesitas su API y ecosistema.",
    },
    {
      question: "¿Qué describe mejor a AWS Fargate?",
      options: [
        "Una plataforma como servicio para desplegar aplicaciones web completas",
        "Un orquestador de contenedores alternativo a ECS y EKS",
        "Un motor de cómputo serverless usado como tipo de lanzamiento de ECS y EKS",
        "Un servicio de registro de imágenes de contenedor",
      ],
      correctIndex: 2,
      explanation:
        "Fargate es un motor de cómputo serverless para contenedores: se usa como tipo de lanzamiento en ECS y como modo de cómputo en EKS, evitando gestionar instancias EC2.",
    },
    {
      question: "¿En qué escenario conviene AWS Elastic Beanstalk?",
      options: [
        "Cuando necesitas la API de Kubernetes y portabilidad multinube",
        "Para desplegar una aplicación web estándar con mínima gestión de infraestructura",
        "Para ejecutar funciones efímeras dirigidas por eventos",
        "Para almacenar y versionar imágenes de contenedor",
      ],
      correctIndex: 1,
      explanation:
        "Elastic Beanstalk es un PaaS: aprovisiona y gestiona automáticamente capacidad, balanceo y escalado, ideal para desplegar aplicaciones web rápidamente con poca gestión manual.",
    },
  ],
};
