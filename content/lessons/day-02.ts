import type { Lesson } from "@/lib/types";

export const day02: Lesson = {
  day: 2,
  slug: "fundamentos-iam",
  title: "IAM: identidades, usuarios, roles y políticas",
  section: "Fundamentos de AWS",
  estimatedMinutes: 30,
  icon: "security-iam",
  objectives: [
    "Entender qué es AWS IAM y por qué es la puerta de entrada a la seguridad en AWS",
    "Diferenciar los tipos de identidad: usuario raíz, usuarios IAM, grupos y roles",
    "Comprender cómo funcionan las políticas y la estructura de una política basada en identidad",
    "Aplicar el principio de mínimo privilegio y preferir roles frente a credenciales de larga duración",
  ],
  blocks: [
    {
      type: "paragraph",
      text:
        "AWS Identity and Access Management (IAM) es el servicio que controla QUIÉN (autenticación) puede hacer QUÉ (autorización) sobre QUÉ recursos de tu cuenta. Es un servicio global y gratuito, y es la pieza que más errores de seguridad concentra cuando se usa mal. Todo lo demás en AWS pasa, de una forma u otra, por una evaluación de IAM.",
    },
    { type: "heading", level: 2, text: "Las identidades de IAM" },
    {
      type: "list",
      items: [
        "Usuario raíz (root): la identidad del correo con que se creó la cuenta. Tiene control total e irrestricto. Se usa solo para tareas iniciales y de facturación; nunca para el día a día.",
        "Usuarios IAM: representan una persona o aplicación con credenciales de larga duración (contraseña para la consola y/o claves de acceso para la CLI/SDK).",
        "Grupos IAM: colecciones de usuarios. Las políticas se adjuntan al grupo y se heredan a sus miembros. Simplifican la gestión de permisos.",
        "Roles IAM: una identidad con permisos que puede ser asumida temporalmente por quien la necesite (un servicio de AWS, una instancia EC2, una función Lambda u otra cuenta). No tiene credenciales permanentes.",
      ],
    },
    {
      type: "serviceIcon",
      items: [
        { service: "AWS IAM", icon: "security-iam" },
        { service: "AWS KMS", icon: "security-kms" },
        { service: "AWS Secrets Manager", icon: "security-secrets-manager" },
      ],
    },
    { type: "heading", level: 2, text: "Las políticas: el corazón de la autorización" },
    {
      type: "paragraph",
      text:
        "Una política es un documento JSON que define permisos. Las políticas basadas en identidad se adjuntan a usuarios, grupos o roles y describen qué acciones están permitidas o denegadas sobre qué recursos. La evaluación de IAM parte de un 'denegado implícito': si nada concede el permiso, se deniega; y una denegación explícita (Deny) siempre gana sobre cualquier Allow.",
    },
    {
      type: "code",
      lang: "json",
      title: "Política IAM: solo lectura sobre un bucket de S3",
      code:
        "{\n  \"Version\": \"2012-10-17\",\n  \"Statement\": [\n    {\n      \"Sid\": \"PermitirLecturaBucket\",\n      \"Effect\": \"Allow\",\n      \"Action\": [\n        \"s3:GetObject\",\n        \"s3:ListBucket\"\n      ],\n      \"Resource\": [\n        \"arn:aws:s3:::mi-bucket-datos\",\n        \"arn:aws:s3:::mi-bucket-datos/*\"\n      ]\n    }\n  ]\n}",
    },
    {
      type: "list",
      ordered: true,
      items: [
        "Version: la versión del lenguaje de políticas. Usa siempre '2012-10-17'.",
        "Effect: 'Allow' o 'Deny'.",
        "Action: las operaciones de la API permitidas o denegadas (servicio:Accion).",
        "Resource: el ARN (Amazon Resource Name) sobre el que aplica el permiso.",
      ],
    },
    { type: "heading", level: 2, text: "Crear un usuario y adjuntar permisos desde la CLI" },
    {
      type: "paragraph",
      text:
        "Como IAM es global, los comandos no dependen de la Región para operar sobre identidades; aun así incluimos --region de forma explícita como buena práctica para que la CLI tenga siempre un endpoint resuelto.",
    },
    {
      type: "code",
      lang: "bash",
      title: "Crear un usuario IAM, un grupo y asignar permisos",
      code:
        "# Crear un usuario IAM\naws iam create-user --user-name dev-omar --region us-east-1\n\n# Crear un grupo y adjuntarle una política administrada de solo lectura\naws iam create-group --group-name desarrolladores --region us-east-1\naws iam attach-group-policy \\\n  --group-name desarrolladores \\\n  --policy-arn arn:aws:iam::aws:policy/ReadOnlyAccess \\\n  --region us-east-1\n\n# Añadir el usuario al grupo (hereda los permisos del grupo)\naws iam add-user-to-group \\\n  --group-name desarrolladores \\\n  --user-name dev-omar \\\n  --region us-east-1",
    },
    {
      type: "callout",
      variant: "warning",
      text:
        "Las claves de acceso (access keys) son credenciales de larga duración: si se filtran, son una puerta abierta. Para aplicaciones dentro de AWS NO uses claves: usa roles. Una instancia EC2 o una función Lambda asumen un rol y reciben credenciales temporales rotadas automáticamente.",
    },
    {
      type: "callout",
      variant: "success",
      text:
        "Principio de mínimo privilegio: concede solo los permisos que la identidad necesita para su tarea, ni uno más. Empieza restrictivo y amplía cuando haga falta; es mucho más seguro que empezar con AdministratorAccess y recortar luego.",
    },
  ],
  selfCheck: [
    {
      question: "¿Cuál es la principal ventaja de un rol IAM frente a un usuario IAM con claves de acceso?",
      options: [
        "El rol es más barato de crear",
        "El rol entrega credenciales temporales que se rotan automáticamente, evitando credenciales de larga duración expuestas",
        "El rol permite más acciones que un usuario",
        "El rol funciona solo en una Región, lo que lo hace más seguro",
      ],
      correctIndex: 1,
      explanation:
        "Un rol se asume temporalmente y entrega credenciales de corta duración que AWS rota automáticamente. Esto elimina el riesgo de claves de larga duración filtradas, por eso se prefieren roles para servicios de AWS como EC2 o Lambda.",
    },
    {
      question: "En la evaluación de una política IAM, ¿qué ocurre si hay un Allow y un Deny explícitos sobre la misma acción?",
      options: [
        "Gana el Allow porque concede acceso",
        "Gana el que aparezca primero en el documento",
        "El Deny explícito siempre gana sobre cualquier Allow",
        "Se produce un error y no se aplica ninguno",
      ],
      correctIndex: 2,
      explanation:
        "La lógica de evaluación de IAM da prioridad a la denegación: una denegación explícita (Deny) siempre prevalece sobre cualquier Allow. Además, lo que no está explícitamente permitido se deniega de forma implícita.",
    },
    {
      question: "¿Por qué AWS recomienda NO usar el usuario raíz para el trabajo diario?",
      options: [
        "Porque el usuario raíz no puede acceder a la facturación",
        "Porque tiene acceso ilimitado e irrestricto, y comprometerlo pondría en riesgo toda la cuenta",
        "Porque el usuario raíz solo funciona en us-east-1",
        "Porque el usuario raíz no puede crear otros usuarios",
      ],
      correctIndex: 1,
      explanation:
        "El usuario raíz tiene control total sobre la cuenta. Si se compromete, toda la cuenta queda expuesta. Lo correcto es protegerlo con MFA, reservarlo para tareas excepcionales y operar el día a día con identidades IAM de mínimo privilegio.",
    },
  ],
};
