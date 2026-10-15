import type { Lesson } from "@/lib/types";

// Capa_Temática "DevOps y Automatización" (dayRange [25, 26]).
// Día 26 — Integración y Entrega Continua (CI/CD) en AWS: AWS CodePipeline
// orquesta las etapas, AWS CodeBuild compila y prueba (buildspec.yml) y AWS
// CodeDeploy despliega de forma controlada en EC2, ECS o Lambda.
//
// Trazabilidad: Req 3.6, 5.1, 5.2, 5.3, 9.1, 9.4, 11.3.
export const day26: Lesson = {
  day: 26,
  slug: "devops-cicd-codepipeline",
  title: "CI/CD en AWS: CodePipeline, CodeBuild y CodeDeploy",
  section: "DevOps y Automatización",
  estimatedMinutes: 35,
  objectives: [
    "Entender el flujo de Integración y Entrega Continua (CI/CD) y cómo lo materializan los servicios de AWS Developer Tools",
    "Reconocer el rol de AWS CodePipeline como orquestador de etapas (source, build, deploy)",
    "Escribir un buildspec.yml para AWS CodeBuild y conocer cómo AWS CodeDeploy automatiza el despliegue",
  ],
  blocks: [
    {
      type: "paragraph",
      text:
        "CI/CD (Integración y Entrega Continua) automatiza el camino desde que un desarrollador hace commit hasta que el cambio llega a producción, sin pasos manuales que introduzcan errores. En AWS, tres servicios se reparten el trabajo: CodePipeline orquesta las etapas, CodeBuild compila y ejecuta las pruebas, y CodeDeploy despliega el resultado en el destino. Juntos forman una tubería (pipeline) repetible y auditable.",
    },
    {
      type: "callout",
      variant: "info",
      text:
        "Integración Continua (CI) es compilar y probar cada cambio automáticamente; Entrega Continua (CD) es dejar ese cambio listo para desplegar —o desplegarlo— de forma automatizada. CodeBuild cubre la CI, CodeDeploy la CD, y CodePipeline conecta ambas en un solo flujo.",
    },
    { type: "heading", level: 2, text: "AWS CodePipeline: el orquestador" },
    {
      type: "list",
      items: [
        "Pipeline: el flujo completo, dividido en etapas (stages) que se ejecutan en orden.",
        "Etapa de source: detecta cambios en el repositorio (CodeCommit, GitHub, S3) y dispara el pipeline.",
        "Etapa de build: delega en AWS CodeBuild para compilar artefactos y correr pruebas.",
        "Etapa de deploy: delega en AWS CodeDeploy (o CloudFormation, ECS, etc.) para llevar el artefacto al entorno destino.",
      ],
    },
    { type: "heading", level: 2, text: "AWS CodeBuild: buildspec.yml" },
    {
      type: "paragraph",
      text:
        "AWS CodeBuild es un servicio de compilación totalmente administrado: no gestionas servidores de build, solo describes qué hacer. Las instrucciones viven en un archivo buildspec.yml en la raíz del repositorio, organizado en fases (phases): install, pre_build, build y post_build. Al final, la sección artifacts declara qué archivos se empaquetan como salida para la siguiente etapa del pipeline.",
    },
    {
      type: "code",
      lang: "yaml",
      title: "buildspec.yml de AWS CodeBuild con fases y artefactos",
      code:
        "version: 0.2\n" +
        "\n" +
        "phases:\n" +
        "  install:\n" +
        "    runtime-versions:\n" +
        "      nodejs: 20\n" +
        "    commands:\n" +
        "      - npm ci\n" +
        "  pre_build:\n" +
        "    commands:\n" +
        "      - npm run lint\n" +
        "      - npm test\n" +
        "  build:\n" +
        "    commands:\n" +
        "      - npm run build\n" +
        "  post_build:\n" +
        "    commands:\n" +
        "      - echo Build finalizado el $(date)\n" +
        "\n" +
        "artifacts:\n" +
        "  base-directory: dist\n" +
        "  files:\n" +
        "    - \"**/*\"",
    },
    {
      type: "callout",
      variant: "warning",
      text:
        "El buildspec.yml empieza SIEMPRE por 'version: 0.2' (la versión vigente del formato). Si una fase falla —por ejemplo, las pruebas en pre_build— CodeBuild detiene el build y marca la ejecución como fallida; así un cambio que rompe los tests nunca avanza a la etapa de despliegue.",
    },
    { type: "heading", level: 2, text: "AWS CodeDeploy: despliegue automatizado" },
    {
      type: "paragraph",
      text:
        "AWS CodeDeploy automatiza el despliegue de aplicaciones en instancias EC2/on-premises, AWS Lambda o Amazon ECS. Soporta estrategias como blue/green (levanta el entorno nuevo en paralelo y conmuta el tráfico) y canary/linear (desplaza el tráfico de forma gradual), lo que permite revertir rápido si algo falla. El despliegue se describe en un archivo appspec.yml y se inicia con una revisión de la aplicación.",
    },
    {
      type: "code",
      lang: "bash",
      title: "Iniciar un despliegue con AWS CodeDeploy (CLI de AWS)",
      code:
        "aws deploy create-deployment \\\n" +
        "  --application-name app-pedidos \\\n" +
        "  --deployment-group-name produccion \\\n" +
        "  --s3-location bucket=artefactos-app,key=app.zip,bundleType=zip \\\n" +
        "  --region us-east-2",
    },
    {
      type: "list",
      ordered: true,
      items: [
        "El desarrollador hace push: la etapa source de CodePipeline detecta el cambio.",
        "CodeBuild ejecuta el buildspec.yml: instala dependencias, prueba y compila los artefactos.",
        "CodeDeploy toma el artefacto y lo despliega en el destino con la estrategia configurada.",
        "Si cualquier etapa falla, el pipeline se detiene y el cambio no llega a producción.",
      ],
    },
    {
      type: "callout",
      variant: "success",
      text:
        "Regla práctica: CodePipeline es el director de orquesta (define el orden de las etapas), CodeBuild es quien compila y prueba, y CodeDeploy es quien entrega. Separar responsabilidades hace la tubería clara, reutilizable y fácil de depurar.",
    },
    { type: "heading", level: 2, text: "Servicios de esta capa" },
    {
      type: "serviceIcon",
      items: [
        { service: "AWS CodePipeline", icon: "devops-codepipeline" },
        { service: "AWS CodeBuild", icon: "devops-codebuild" },
        { service: "AWS CodeDeploy", icon: "devops-codedeploy" },
      ],
    },
  ],
  icon: "devops-codepipeline",
  selfCheck: [
    {
      question:
        "En un pipeline de CI/CD en AWS, ¿cuál es el rol de cada servicio?",
      options: [
        "CodePipeline compila el código, CodeBuild despliega y CodeDeploy orquesta",
        "CodePipeline orquesta las etapas, CodeBuild compila y prueba, y CodeDeploy despliega el artefacto en el destino",
        "Los tres hacen lo mismo y se usan de forma intercambiable",
        "CodeDeploy detecta los cambios en el repositorio y CodeBuild los enruta",
      ],
      correctIndex: 1,
      explanation:
        "CodePipeline es el orquestador que conecta las etapas (source, build, deploy). CodeBuild cubre la Integración Continua: compila y ejecuta pruebas según el buildspec.yml. CodeDeploy cubre la entrega: lleva el artefacto resultante al entorno destino (EC2, ECS o Lambda).",
    },
    {
      question:
        "¿Qué describe el archivo buildspec.yml de AWS CodeBuild?",
      options: [
        "Las reglas de red (VPC) que usará el pipeline",
        "Las fases del build (install, pre_build, build, post_build) y los artefactos de salida",
        "La estrategia blue/green del despliegue en producción",
        "El patrón de eventos que dispara el pipeline",
      ],
      correctIndex: 1,
      explanation:
        "El buildspec.yml define, en formato 'version: 0.2', las fases que CodeBuild ejecuta (install, pre_build, build, post_build) con sus comandos, y la sección artifacts que declara qué archivos se empaquetan como salida para la siguiente etapa del pipeline.",
    },
  ],
};
