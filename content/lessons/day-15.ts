import type { Lesson } from "@/lib/types";

export const day15: Lesson = {
  day: 15,
  slug: "seguridad-iam-avanzado",
  title: "IAM avanzado: políticas basadas en recursos, condiciones, roles entre cuentas y STS",
  section: "Seguridad",
  estimatedMinutes: 30,
  icon: "security-iam",
  objectives: [
    "Distinguir las políticas basadas en identidad de las políticas basadas en recursos y saber cuándo usar cada una",
    "Escribir condiciones (Condition) para restringir el acceso por IP, MFA, etiquetas o cifrado",
    "Diseñar el acceso entre cuentas con roles de IAM y la relación de confianza (trust policy)",
    "Entender cómo AWS STS emite credenciales temporales mediante AssumeRole y el ExternalId",
  ],
  blocks: [
    {
      type: "paragraph",
      text:
        "En las primeras lecciones usamos IAM para lo básico: usuarios, grupos y políticas de permisos. Pero el IAM real de producción vive en los detalles: ¿cómo das acceso a un recurso concreto sin tocar la identidad que lo consume? ¿Cómo exiges MFA o un rango de IP? ¿Cómo dejas que una cuenta de auditoría lea tus recursos sin compartir claves? La respuesta son las políticas basadas en recursos, las condiciones y los roles asumibles con STS.",
    },
    { type: "heading", level: 2, text: "Políticas basadas en identidad vs. basadas en recursos" },
    {
      type: "paragraph",
      text:
        "Una política basada en identidad se adjunta a un usuario, grupo o rol de IAM y responde a la pregunta: ¿qué puede hacer esta identidad? Una política basada en recursos se adjunta al propio recurso (un bucket de S3, una cola SQS, una clave de KMS) y responde a: ¿quién puede actuar sobre este recurso? La gran ventaja de las políticas basadas en recursos es que incluyen un elemento Principal: permiten conceder acceso a identidades de OTRA cuenta sin crear usuarios en la tuya.",
    },
    {
      type: "serviceIcon",
      items: [
        { service: "AWS IAM", icon: "security-iam" },
      ],
    },
    {
      type: "list",
      items: [
        "Basada en identidad: adjunta a un principal (usuario/grupo/rol). No lleva Principal porque ya se sabe quién es.",
        "Basada en recursos: adjunta a un recurso. SÍ lleva Principal, que indica a quién se le concede o deniega el acceso.",
        "Cuando ambas aplican, el acceso efectivo es la intersección: debe permitirlo la política de identidad Y la política de recurso (salvo accesos entre cuentas, donde ambas deben otorgarlo explícitamente).",
      ],
    },
    { type: "heading", level: 2, text: "Condiciones: el bloque Condition" },
    {
      type: "paragraph",
      text:
        "El bloque Condition es lo que convierte una política de permisos estática en una política contextual. Permite que un Allow o Deny solo surta efecto cuando se cumple una condición sobre la petición: la IP de origen, si se usó MFA, la hora, una etiqueta del recurso o el tipo de cifrado solicitado. Es la herramienta central del principio de mínimo privilegio.",
    },
    {
      type: "code",
      lang: "json",
      title: "Política IAM con condiciones: exige MFA y restringe por IP de origen",
      code: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PermitirAdminSoloConMFADesdeOficina",
      "Effect": "Allow",
      "Action": "ec2:*",
      "Resource": "*",
      "Condition": {
        "Bool": {
          "aws:MultiFactorAuthPresent": "true"
        },
        "IpAddress": {
          "aws:SourceIp": "203.0.113.0/24"
        }
      }
    }
  ]
}`,
    },
    {
      type: "callout",
      variant: "warning",
      text:
        "Cuidado con aws:SourceIp cuando el acceso llega a través de servicios de AWS (por ejemplo una Lambda que actúa en tu nombre): la IP de origen puede no ser la del cliente final. Para esos casos existe aws:ViaAWSService y claves específicas de cada servicio.",
    },
    { type: "heading", level: 2, text: "Roles entre cuentas y la relación de confianza" },
    {
      type: "paragraph",
      text:
        "Un rol de IAM tiene dos políticas distintas. La política de permisos define qué puede hacer el rol. La política de confianza (trust policy) define quién puede asumir el rol. Para dar acceso entre cuentas creas un rol en la cuenta que posee los recursos (cuenta A) y en su trust policy declaras como Principal la cuenta o el rol de la otra cuenta (cuenta B). Nadie comparte claves de larga duración: la cuenta B asume el rol y recibe credenciales temporales.",
    },
    {
      type: "code",
      lang: "json",
      title: "Trust policy: permitir que la cuenta B asuma el rol con ExternalId",
      code: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::222222222222:root"
      },
      "Action": "sts:AssumeRole",
      "Condition": {
        "StringEquals": {
          "sts:ExternalId": "id-secreto-compartido-con-el-tercero"
        }
      }
    }
  ]
}`,
    },
    {
      type: "callout",
      variant: "info",
      text:
        "El ExternalId resuelve el problema del 'confused deputy' (apoderado confundido): cuando un tercero (por ejemplo un SaaS) asume tu rol, el ExternalId garantiza que solo lo haga en tu nombre y no en el de otro cliente del mismo proveedor.",
    },
    { type: "heading", level: 2, text: "AWS STS: credenciales temporales" },
    {
      type: "paragraph",
      text:
        "AWS Security Token Service (STS) es el servicio que emite credenciales temporales. La operación sts:AssumeRole devuelve una Access Key, una Secret Key y un token de sesión con una caducidad corta (de 15 minutos a varias horas). Estas credenciales temporales son la base de todo acceso seguro moderno en AWS: roles de instancias EC2, roles de ejecución de Lambda, federación de identidades y acceso entre cuentas.",
    },
    {
      type: "code",
      lang: "bash",
      title: "Asumir un rol en otra cuenta con STS desde la CLI",
      code:
        "# Asume el rol y obtén credenciales temporales\naws sts assume-role \\\n  --role-arn arn:aws:iam::111111111111:role/AuditoriaLectura \\\n  --role-session-name sesion-auditoria \\\n  --external-id id-secreto-compartido-con-el-tercero \\\n  --region us-east-1\n\n# Verifica qué identidad efectiva tienes tras asumir el rol\naws sts get-caller-identity --region us-east-1",
    },
    {
      type: "callout",
      variant: "success",
      text:
        "Regla de oro: evita las claves de acceso de larga duración. Para servicios usa roles (EC2, Lambda, ECS); para personas usa federación con tu proveedor de identidad; para acceso entre cuentas usa AssumeRole. Las credenciales temporales reducen drásticamente el impacto de una fuga.",
    },
  ],
  selfCheck: [
    {
      question: "¿Qué distingue a una política basada en recursos de una basada en identidad?",
      options: [
        "La política basada en recursos no puede denegar accesos, solo permitirlos",
        "La política basada en recursos incluye un elemento Principal que indica a quién se concede el acceso, y puede otorgarlo a otra cuenta",
        "Las políticas basadas en identidad solo funcionan con el usuario raíz",
        "No existe diferencia real; ambas se adjuntan al mismo usuario",
      ],
      correctIndex: 1,
      explanation:
        "La política basada en recursos se adjunta al recurso y lleva un Principal, lo que permite conceder acceso a identidades de otra cuenta. La basada en identidad se adjunta al usuario/grupo/rol y no lleva Principal porque ya se conoce la identidad.",
    },
    {
      question: "¿Para qué sirve el ExternalId en la trust policy de un rol entre cuentas?",
      options: [
        "Para cifrar las credenciales temporales que emite STS",
        "Para prevenir el problema del 'confused deputy' cuando un tercero asume tu rol en nombre de varios clientes",
        "Para alargar la duración de la sesión más allá de 12 horas",
        "Para evitar tener que usar MFA en la cuenta destino",
      ],
      correctIndex: 1,
      explanation:
        "El ExternalId es un secreto acordado que el tercero debe presentar al asumir el rol. Garantiza que el apoderado (por ejemplo un SaaS) actúe solo en tu nombre y no sea engañado para operar sobre otra cuenta, mitigando el 'confused deputy'.",
    },
    {
      question: "¿Qué devuelve la operación sts:AssumeRole?",
      options: [
        "Una clave de acceso permanente ligada a un usuario de IAM",
        "Un conjunto de credenciales temporales (Access Key, Secret Key y token de sesión) con caducidad corta",
        "Un certificado X.509 para firmar peticiones",
        "La contraseña del usuario raíz de la cuenta destino",
      ],
      correctIndex: 1,
      explanation:
        "AssumeRole emite credenciales temporales con una caducidad de minutos a horas. Son la base del acceso seguro en AWS: roles de EC2/Lambda/ECS, federación y acceso entre cuentas, evitando claves de larga duración.",
    },
  ],
};
