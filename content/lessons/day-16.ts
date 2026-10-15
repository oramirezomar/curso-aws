import type { Lesson } from "@/lib/types";

export const day16: Lesson = {
  day: 16,
  slug: "seguridad-kms-secrets",
  title: "Cifrado y secretos: AWS KMS y AWS Secrets Manager",
  section: "Seguridad",
  estimatedMinutes: 30,
  icon: "security-kms",
  objectives: [
    "Comprender cómo AWS KMS gestiona claves y aplica el cifrado de sobre (envelope encryption)",
    "Diferenciar claves gestionadas por AWS, claves gestionadas por el cliente (CMK) y el rol de la política de clave",
    "Usar Secrets Manager para almacenar credenciales y entender su rotación automática",
    "Distinguir cuándo conviene Secrets Manager frente a Parameter Store de Systems Manager",
  ],
  blocks: [
    {
      type: "paragraph",
      text:
        "Cifrar datos no consiste en inventar algoritmos: consiste en gestionar bien las claves. ¿Dónde viven? ¿Quién puede usarlas? ¿Cómo se rotan sin romper nada? Y lo mismo con las credenciales de tus aplicaciones: una contraseña de base de datos no debería estar nunca en el código ni en una variable de entorno en texto plano. AWS KMS resuelve la gestión de claves y AWS Secrets Manager la gestión de secretos.",
    },
    { type: "heading", level: 2, text: "AWS KMS y el cifrado de sobre" },
    {
      type: "paragraph",
      text:
        "AWS Key Management Service (KMS) centraliza la creación y el control de claves de cifrado. La idea clave es el cifrado de sobre (envelope encryption): KMS no cifra tus datos directamente con la clave maestra. En su lugar genera una clave de datos (data key), cifra tus datos con esa clave de datos y luego cifra la propia clave de datos con la clave maestra, que nunca sale de KMS sin cifrar. Así proteges grandes volúmenes de datos con operaciones criptográficas rápidas y una clave maestra que jamás se expone.",
    },
    {
      type: "serviceIcon",
      items: [
        { service: "AWS KMS", icon: "security-kms" },
        { service: "AWS Secrets Manager", icon: "security-secrets-manager" },
      ],
    },
    {
      type: "list",
      items: [
        "Clave gestionada por AWS: la crea y rota AWS por ti para un servicio concreto; no la controlas directamente.",
        "Clave gestionada por el cliente (CMK): la creas y controlas tú; defines su política de clave, su rotación y quién puede usarla.",
        "Política de clave (key policy): es la política basada en recursos de la clave; determina qué principales pueden cifrar, descifrar o administrar.",
      ],
    },
    {
      type: "code",
      lang: "bash",
      title: "Crear una clave gestionada por el cliente y un alias",
      code:
        "# Crea una clave simétrica gestionada por el cliente\naws kms create-key \\\n  --description \"Clave para cifrar datos de la app de pagos\" \\\n  --region us-east-1\n\n# Asigna un alias legible a la clave recién creada\naws kms create-alias \\\n  --alias-name alias/app-pagos \\\n  --target-key-id <KEY_ID> \\\n  --region us-east-1",
    },
    {
      type: "paragraph",
      text:
        "La política de clave es una política basada en recursos. Puedes combinar permisos con condiciones: por ejemplo, permitir el descifrado solo a un rol concreto. Fíjate en que la clave maestra se controla igual que cualquier otro recurso de AWS.",
    },
    {
      type: "code",
      lang: "json",
      title: "Fragmento de key policy: permitir descifrar solo a un rol con condición",
      code: `{
  "Sid": "PermitirDescifradoSoloAlRolDeLaApp",
  "Effect": "Allow",
  "Principal": {
    "AWS": "arn:aws:iam::111111111111:role/AppPagosEjecucion"
  },
  "Action": "kms:Decrypt",
  "Resource": "*",
  "Condition": {
    "StringEquals": {
      "kms:ViaService": "secretsmanager.us-east-1.amazonaws.com"
    }
  }
}`,
    },
    {
      type: "callout",
      variant: "info",
      text:
        "La rotación automática de una CMK genera material criptográfico nuevo manteniendo el mismo ID de clave y alias. KMS conserva las versiones anteriores para poder descifrar datos cifrados con material viejo, así que la rotación es transparente para tus aplicaciones.",
    },
    { type: "heading", level: 2, text: "AWS Secrets Manager" },
    {
      type: "paragraph",
      text:
        "Secrets Manager almacena y recupera secretos (contraseñas de bases de datos, claves de API, tokens) cifrados con KMS. Tu aplicación nunca guarda la credencial: la pide a Secrets Manager en tiempo de ejecución con permisos de IAM. Su gran valor añadido es la rotación automática: para servicios compatibles (como Amazon RDS) puede cambiar la contraseña en la base de datos y actualizar el secreto sin intervención humana ni tiempo de inactividad.",
    },
    {
      type: "code",
      lang: "bash",
      title: "Crear un secreto cifrado con una CMK y recuperarlo",
      code:
        "# Crea un secreto con la credencial de la base de datos, cifrado con tu CMK\naws secretsmanager create-secret \\\n  --name prod/app-pagos/db \\\n  --description \"Credencial de la base de datos de pagos\" \\\n  --secret-string '{\"username\":\"app\",\"password\":\"CAMBIA_ESTO\"}' \\\n  --kms-key-id alias/app-pagos \\\n  --region us-east-1\n\n# Recupera el valor del secreto en tiempo de ejecución\naws secretsmanager get-secret-value \\\n  --secret-id prod/app-pagos/db \\\n  --region us-east-1",
    },
    { type: "heading", level: 3, text: "Secrets Manager vs. Parameter Store" },
    {
      type: "list",
      items: [
        "Secrets Manager: rotación automática integrada, cifrado con KMS por defecto y precio por secreto. Ideal para credenciales que deben rotar.",
        "Parameter Store (AWS Systems Manager): almacena parámetros de configuración, con opción de cifrado (SecureString con KMS). El nivel estándar es gratuito y sirve para configuración y secretos simples sin rotación nativa.",
        "Regla práctica: credenciales que deben rotar → Secrets Manager; configuración y parámetros no sensibles o sin rotación → Parameter Store.",
      ],
    },
    {
      type: "callout",
      variant: "warning",
      text:
        "Nunca pongas secretos en el código fuente, en el repositorio ni en variables de entorno en texto plano. Recupéralos en tiempo de ejecución desde Secrets Manager o Parameter Store y controla el acceso con políticas de IAM de mínimo privilegio.",
    },
  ],
  selfCheck: [
    {
      question: "¿En qué consiste el cifrado de sobre (envelope encryption) de KMS?",
      options: [
        "KMS cifra todos tus datos directamente con la clave maestra en un único paso",
        "KMS genera una clave de datos para cifrar los datos y luego cifra esa clave de datos con la clave maestra, que nunca sale sin cifrar",
        "KMS envía tus datos a un sobre físico sellado en un centro de datos",
        "KMS usa la misma clave para cifrar y para firmar certificados X.509",
      ],
      correctIndex: 1,
      explanation:
        "En el cifrado de sobre, los datos se cifran con una clave de datos rápida y esa clave de datos se cifra a su vez con la clave maestra, que permanece protegida dentro de KMS. Así se cifran grandes volúmenes sin exponer la clave maestra.",
    },
    {
      question: "¿Cuál es la ventaja principal de Secrets Manager frente a guardar una contraseña en una variable de entorno?",
      options: [
        "Es siempre gratuito y no requiere permisos",
        "Permite rotación automática de la credencial y la almacena cifrada con KMS, recuperándose con permisos de IAM en tiempo de ejecución",
        "Convierte la contraseña en un token que no caduca nunca",
        "Elimina la necesidad de usar IAM para controlar el acceso",
      ],
      correctIndex: 1,
      explanation:
        "Secrets Manager cifra el secreto con KMS, controla el acceso con IAM y, para servicios compatibles, puede rotar la credencial automáticamente sin intervención ni tiempo de inactividad. Una variable de entorno en texto plano no ofrece nada de eso.",
    },
    {
      question: "¿Cuándo conviene Parameter Store en lugar de Secrets Manager?",
      options: [
        "Siempre, porque Secrets Manager no cifra nada",
        "Para configuración o parámetros no sensibles y secretos simples sin necesidad de rotación nativa, aprovechando su nivel estándar gratuito",
        "Solo para almacenar claves maestras de KMS",
        "Nunca; Parameter Store no admite valores cifrados",
      ],
      correctIndex: 1,
      explanation:
        "Parameter Store es ideal para configuración y secretos simples: su nivel estándar es gratuito y admite SecureString cifrado con KMS. Cuando necesitas rotación automática de credenciales, Secrets Manager es la elección correcta.",
    },
  ],
};
