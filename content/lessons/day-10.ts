import type { Lesson } from "@/lib/types";

// Capa_Temática "Contenedores a fondo" (dayRange [10, 11]).
// Día 10 — Amazon ECR: registro de imágenes, autenticación, push/pull y el
// ciclo de build/push de imágenes de contenedor.
//
// Trazabilidad: Req 3.10, 5.1, 5.2, 9.1, 9.4, 11.3.
export const day10: Lesson = {
  day: 10,
  slug: "contenedores-ecr",
  title: "Amazon ECR: el registro de tus imágenes de contenedor",
  section: "Contenedores a fondo",
  estimatedMinutes: 25,
  objectives: [
    "Entender qué es Amazon ECR y qué problema resuelve como registro de imágenes de contenedor",
    "Dominar el ciclo build → tag → push → pull de una imagen contra un repositorio ECR",
    "Autenticar Docker contra ECR de forma segura usando credenciales temporales del CLI de AWS",
  ],
  blocks: [
    {
      type: "paragraph",
      text:
        "Amazon Elastic Container Registry (Amazon ECR) es un registro de imágenes de contenedor totalmente administrado por AWS. Te permite almacenar, versionar y distribuir imágenes Docker/OCI de forma privada (o pública con ECR Public) sin operar tu propio registro. Es la pieza que conecta tu proceso de build con los orquestadores que ejecutan tus contenedores (Amazon ECS y Amazon EKS).",
    },
    {
      type: "callout",
      variant: "info",
      text:
        "Un repositorio ECR vive en una región y una cuenta concretas. Su URI tiene la forma <account_id>.dkr.ecr.<region>.amazonaws.com/<nombre-repositorio>. Fíjate siempre en la región: una imagen en us-east-1 no está automáticamente disponible en us-east-2.",
    },
    { type: "heading", level: 2, text: "Por qué un registro administrado" },
    {
      type: "list",
      items: [
        "Integración nativa con IAM: controlas quién puede hacer push/pull mediante políticas, sin usuarios/contraseñas estáticos.",
        "Cifrado en reposo (SSE-S3 o AWS KMS) y en tránsito, además de escaneo de vulnerabilidades de las imágenes.",
        "Alta disponibilidad y durabilidad: AWS replica y administra el almacenamiento subyacente.",
        "Políticas de ciclo de vida para expirar imágenes antiguas y controlar costos de almacenamiento.",
      ],
    },
    { type: "heading", level: 2, text: "El ciclo de vida de una imagen" },
    {
      type: "paragraph",
      text:
        "El flujo de trabajo con ECR siempre sigue las mismas cuatro fases: construyes la imagen localmente (build), la etiquetas con el URI del repositorio (tag), la subes (push) y, en el entorno de ejecución, el orquestador la descarga (pull). Antes de push/pull necesitas autenticar el cliente Docker contra el registro.",
    },
    { type: "heading", level: 3, text: "1) Crear el repositorio" },
    {
      type: "code",
      lang: "bash",
      title: "Crear un repositorio privado en ECR con el CLI de AWS",
      code:
        "aws ecr create-repository \\\n" +
        "  --repository-name mi-app \\\n" +
        "  --image-scanning-configuration scanOnPush=true \\\n" +
        "  --region us-east-2",
    },
    { type: "heading", level: 3, text: "2) Autenticar Docker contra ECR" },
    {
      type: "paragraph",
      text:
        "La autenticación usa credenciales TEMPORALES: el comando get-login-password genera un token válido por 12 horas que se canaliza directamente a docker login. Nunca almacenas una contraseña permanente.",
    },
    {
      type: "code",
      lang: "bash",
      title: "Login de Docker en ECR con credenciales temporales",
      code:
        "aws ecr get-login-password --region us-east-2 \\\n" +
        "  | docker login --username AWS \\\n" +
        "      --password-stdin 111122223333.dkr.ecr.us-east-2.amazonaws.com",
    },
    { type: "heading", level: 3, text: "3) Build, tag y push" },
    {
      type: "code",
      lang: "bash",
      title: "Construir, etiquetar y subir la imagen al repositorio ECR",
      code:
        "# Construir la imagen a partir del Dockerfile local\n" +
        "docker build -t mi-app .\n\n" +
        "# Etiquetar con el URI completo del repositorio ECR\n" +
        "docker tag mi-app:latest \\\n" +
        "  111122223333.dkr.ecr.us-east-2.amazonaws.com/mi-app:latest\n\n" +
        "# Subir (push) la imagen al registro\n" +
        "docker push 111122223333.dkr.ecr.us-east-2.amazonaws.com/mi-app:latest",
    },
    {
      type: "callout",
      variant: "warning",
      text:
        "Evita la etiqueta mutable 'latest' en producción. Usa etiquetas inmutables (por ejemplo, el SHA del commit) para que un despliegue sea reproducible y puedas hacer rollback a una versión exacta.",
    },
    { type: "heading", level: 2, text: "Servicios de esta capa" },
    {
      type: "serviceIcon",
      items: [
        { service: "Amazon ECR", icon: "containers-ecr" },
        { service: "Amazon ECS", icon: "compute-ecs" },
        { service: "Amazon EKS", icon: "compute-eks" },
      ],
    },
    {
      type: "paragraph",
      text:
        "Con la imagen en ECR, el siguiente paso es ejecutarla. Tanto Amazon ECS como Amazon EKS descargan (pull) imágenes desde ECR usando el rol de ejecución de la tarea/pod. En la próxima lección veremos cómo ejecutar esos contenedores sin administrar servidores con AWS Fargate.",
    },
  ],
  icon: "containers-ecr",
  selfCheck: [
    {
      question:
        "¿Por qué 'aws ecr get-login-password' se considera un mecanismo seguro de autenticación?",
      options: [
        "Porque guarda tu contraseña de AWS cifrada en el disco local",
        "Porque genera un token temporal (válido ~12 h) basado en IAM, sin credenciales permanentes",
        "Porque desactiva el cifrado en tránsito para acelerar el push",
        "Porque crea un usuario IAM nuevo por cada docker login",
      ],
      correctIndex: 1,
      explanation:
        "get-login-password emite un token de autorización temporal derivado de tus permisos IAM (válido unas 12 horas). Se canaliza a 'docker login' con --password-stdin, de modo que no hay contraseñas permanentes almacenadas.",
    },
    {
      question:
        "¿Cuál es el orden correcto del ciclo de vida de una imagen para publicarla en ECR?",
      options: [
        "push → pull → build → tag",
        "tag → build → pull → push",
        "build → tag → push (y luego pull desde el orquestador)",
        "pull → tag → build → push",
      ],
      correctIndex: 2,
      explanation:
        "Primero construyes la imagen (build), la etiquetas con el URI del repositorio (tag) y la subes (push). El pull lo realiza después el entorno de ejecución (ECS/EKS) al desplegar.",
    },
  ],
};
