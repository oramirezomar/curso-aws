import type { Lesson } from "@/lib/types";

// Capa_Temática "Developer Tooling e Infraestructura como Código Moderna"
// (dayRange [36, 36]). ÚLTIMA lección del curso.
// Día 36 — Definir infraestructura con lenguajes de programación mediante AWS
// CDK (Cloud Development Kit, v2), que compila (synth) a plantillas de AWS
// CloudFormation, e interactuar con los servicios desde el código de la
// aplicación con los SDKs de AWS (v3) modulares y basados en comandos.
//
// Trazabilidad: Req 3.17, 5.1, 5.2, 5.3, 9.1, 9.4, 11.3.
export const day36: Lesson = {
  day: 36,
  slug: "devtools-cdk-sdks",
  title: "Developer Tooling e IaC Moderna: AWS CDK v2 y los SDKs de AWS v3",
  section: "Developer Tooling e Infraestructura como Código Moderna",
  estimatedMinutes: 35,
  objectives: [
    "Entender AWS CDK v2 como framework para definir infraestructura con lenguajes de programación (TypeScript) y comprender que CDK sintetiza (compila) a plantillas de AWS CloudFormation",
    "Modelar recursos con constructs del CDK (p. ej. un bucket de Amazon S3) dentro de un Stack y conocer el flujo synth → deploy",
    "Usar los SDKs de AWS v3 (modulares, basados en comandos) para interactuar con los servicios desde el código de la aplicación",
  ],
  blocks: [
    {
      type: "paragraph",
      text:
        "Llegamos a la última capa del curso: las herramientas con las que un desarrollador define y consume la nube desde el código. Dos piezas la dominan. AWS CDK (Cloud Development Kit) v2 te deja describir la infraestructura con un lenguaje de programación real —TypeScript, en nuestro caso— en lugar de escribir YAML o JSON a mano. Y los SDKs de AWS v3 son las librerías con las que tu aplicación habla con los servicios (S3, DynamoDB, etc.) en tiempo de ejecución. Uno construye la plataforma; el otro la usa.",
    },
    {
      type: "callout",
      variant: "info",
      text:
        "Idea central: AWS CDK NO es un motor de aprovisionamiento nuevo. Tu código TypeScript se sintetiza (comando cdk synth) a una plantilla de AWS CloudFormation, y es CloudFormation quien crea, actualiza y elimina los recursos. El CDK te da la ergonomía de un lenguaje de programación; CloudFormation aporta el despliegue declarativo y el control de cambios.",
    },
    { type: "heading", level: 2, text: "AWS CDK v2: infraestructura como código real" },
    {
      type: "paragraph",
      text:
        "Con el CDK describes tu infraestructura mediante tres abstracciones. Una App es la raíz del árbol. Un Stack es la unidad de despliegue (se corresponde con una pila de CloudFormation). Y los constructs son los bloques de construcción: cada recurso (un bucket, una función Lambda, una tabla) es un construct que configuras con las clases del paquete aws-cdk-lib. Al usar un lenguaje de programación obtienes autocompletado, tipos, bucles, condicionales y reutilización: todo lo que YAML no te da.",
    },
    {
      type: "list",
      items: [
        "App: contenedor raíz que agrupa uno o varios Stacks (new App()).",
        "Stack: unidad de despliegue; sintetiza a UNA plantilla de CloudFormation.",
        "Construct: representación de uno o más recursos (p. ej. new s3.Bucket(...)).",
        "aws-cdk-lib: en CDK v2 toda la librería de constructs viaja en un único paquete versionado (adiós a los paquetes @aws-cdk/* separados de v1).",
      ],
    },
    {
      type: "code",
      lang: "ts",
      title: "Stack de CDK v2 que define un bucket de Amazon S3 (TypeScript)",
      code:
        "import { App, Stack, StackProps, RemovalPolicy } from \"aws-cdk-lib\";\n" +
        "import * as s3 from \"aws-cdk-lib/aws-s3\";\n" +
        "import { Construct } from \"constructs\";\n" +
        "\n" +
        "// Un Stack es la unidad de despliegue: sintetiza a UNA plantilla de\n" +
        "// AWS CloudFormation con todos los constructs que declaremos dentro.\n" +
        "export class AlmacenamientoStack extends Stack {\n" +
        "  constructor(scope: Construct, id: string, props?: StackProps) {\n" +
        "    super(scope, id, props);\n" +
        "\n" +
        "    // El construct s3.Bucket representa un recurso AWS::S3::Bucket.\n" +
        "    new s3.Bucket(this, \"BucketDatos\", {\n" +
        "      versioned: true,\n" +
        "      encryption: s3.BucketEncryption.S3_MANAGED,\n" +
        "      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,\n" +
        "      removalPolicy: RemovalPolicy.RETAIN,\n" +
        "    });\n" +
        "  }\n" +
        "}\n" +
        "\n" +
        "const app = new App();\n" +
        "new AlmacenamientoStack(app, \"AlmacenamientoStack\", {\n" +
        "  env: { region: \"us-east-1\" },\n" +
        "});",
    },
    {
      type: "paragraph",
      text:
        "El flujo de trabajo del CDK tiene tres pasos. Primero cdk synth, que ejecuta tu código y produce la plantilla de CloudFormation (el llamado assembly en la carpeta cdk.out). Después cdk diff, que compara tu código con lo que ya está desplegado. Y finalmente cdk deploy, que entrega la plantilla a CloudFormation para que materialice los recursos. Antes de todo, en una cuenta y Región nuevas, se ejecuta cdk bootstrap una sola vez para preparar los recursos de apoyo que el CDK necesita.",
    },
    {
      type: "code",
      lang: "bash",
      title: "Flujo del CDK: bootstrap, synth y deploy (CLI del CDK y de AWS)",
      code:
        "# Preparar la cuenta/Región una sola vez (crea recursos de apoyo del CDK).\n" +
        "cdk bootstrap aws://111122223333/us-east-1\n" +
        "\n" +
        "# Sintetizar: ejecuta el código TypeScript y genera la plantilla de\n" +
        "# CloudFormation en cdk.out (NO despliega nada todavía).\n" +
        "cdk synth\n" +
        "\n" +
        "# Desplegar: entrega la plantilla a CloudFormation, que crea los recursos.\n" +
        "cdk deploy AlmacenamientoStack\n" +
        "\n" +
        "# Lo que el CDK despliega sigue siendo una pila de CloudFormation:\n" +
        "aws cloudformation describe-stacks \\\n" +
        "  --stack-name AlmacenamientoStack \\\n" +
        "  --region us-east-1",
    },
    {
      type: "callout",
      variant: "warning",
      text:
        "No confundas las dos CLIs. La CLI del CDK (comando cdk) sintetiza y orquesta despliegues; no acepta --region (la Región se fija en el env del Stack o con el perfil/variables de entorno). La CLI de AWS (comando aws) habla directo con las APIs de los servicios y ahí sí debes indicar siempre --region de forma explícita.",
    },
    { type: "heading", level: 2, text: "SDKs de AWS v3: hablar con los servicios desde el código" },
    {
      type: "paragraph",
      text:
        "Mientras el CDK define la infraestructura, los SDKs de AWS la usan desde la lógica de tu aplicación. La versión 3 del SDK para JavaScript/TypeScript es modular: en lugar de un paquete monolítico, instalas solo el cliente del servicio que necesitas (por ejemplo @aws-sdk/client-s3). El patrón es siempre el mismo: creas un cliente del servicio, construyes un objeto Command que describe la operación y lo ejecutas con client.send(command). Eso reduce el tamaño del bundle y facilita el tree-shaking.",
    },
    {
      type: "list",
      items: [
        "Modular: un paquete por servicio (@aws-sdk/client-s3, @aws-sdk/client-dynamodb, ...).",
        "Basado en comandos: cada operación es una clase Command (PutObjectCommand, GetObjectCommand, ...).",
        "Promesas nativas: client.send(command) devuelve una Promise; se usa con async/await, sin callbacks.",
        "Credenciales automáticas: el SDK resuelve las credenciales desde la cadena por defecto (variables de entorno, perfil, rol de IAM de la instancia o del contenedor).",
      ],
    },
    {
      type: "code",
      lang: "ts",
      title: "Subir un objeto a Amazon S3 con el SDK de AWS v3 (TypeScript)",
      code:
        "import { S3Client, PutObjectCommand } from \"@aws-sdk/client-s3\";\n" +
        "\n" +
        "// 1) Cliente del servicio: fija la Región de las llamadas a la API.\n" +
        "const s3 = new S3Client({ region: \"us-east-1\" });\n" +
        "\n" +
        "export async function subirObjeto(): Promise<void> {\n" +
        "  // 2) Comando: describe la operación y sus parámetros.\n" +
        "  const comando = new PutObjectCommand({\n" +
        "    Bucket: \"bucket-datos\",\n" +
        "    Key: \"reportes/informe.txt\",\n" +
        "    Body: \"Contenido del informe\",\n" +
        "    ContentType: \"text/plain\",\n" +
        "  });\n" +
        "\n" +
        "  // 3) Enviar: el cliente ejecuta el comando y devuelve una Promise.\n" +
        "  const respuesta = await s3.send(comando);\n" +
        "  console.log(\"ETag del objeto subido:\", respuesta.ETag);\n" +
        "}",
    },
    {
      type: "callout",
      variant: "success",
      text:
        "La historia completa encaja: con AWS CDK v2 declaras el bucket en TypeScript, el CDK lo sintetiza a CloudFormation y lo despliega; después, con el SDK de AWS v3 tu aplicación escribe y lee objetos en ese mismo bucket. Mismo lenguaje para construir la nube y para usarla: ese es el espíritu del developer tooling moderno de AWS.",
    },
    { type: "heading", level: 2, text: "Servicios de esta capa" },
    {
      type: "serviceIcon",
      items: [{ service: "AWS CDK", icon: "devtools-cdk" }],
    },
  ],
  icon: "devtools-cdk",
  selfCheck: [
    {
      question:
        "Cuando ejecutas 'cdk deploy' sobre un Stack escrito en TypeScript, ¿qué ocurre realmente por debajo?",
      options: [
        "El CDK crea los recursos directamente con llamadas a cada servicio, sin usar ningún otro servicio de AWS",
        "El CDK sintetiza tu código a una plantilla de AWS CloudFormation y es CloudFormation quien aprovisiona los recursos",
        "El código TypeScript se ejecuta de forma permanente en un servidor que mantiene vivos los recursos",
        "El CDK traduce el código a Terraform HCL y usa Terraform para desplegar",
      ],
      correctIndex: 1,
      explanation:
        "AWS CDK no es un motor de aprovisionamiento propio: tu código se sintetiza (cdk synth) a una plantilla de AWS CloudFormation y CloudFormation crea, actualiza o elimina los recursos. El CDK aporta la ergonomía de un lenguaje de programación (tipos, bucles, reutilización); CloudFormation aporta el despliegue declarativo y el control de cambios.",
    },
    {
      question:
        "¿Qué describe mejor el patrón de uso del SDK de AWS v3 para JavaScript/TypeScript?",
      options: [
        "Un único paquete monolítico que incluye todos los servicios y se invoca con callbacks",
        "Es modular (un paquete por servicio) y basado en comandos: creas un cliente, construyes un Command y lo ejecutas con client.send(command)",
        "Solo funciona dentro de funciones Lambda y no puede usarse en servidores propios",
        "Requiere definir la infraestructura en el mismo archivo donde se llama a la API",
      ],
      correctIndex: 1,
      explanation:
        "El SDK de AWS v3 es modular: instalas solo el cliente del servicio que necesitas (p. ej. @aws-sdk/client-s3). El patrón es crear el cliente del servicio, construir un objeto Command (como PutObjectCommand) y ejecutarlo con client.send(command), que devuelve una Promise usable con async/await. Esto reduce el tamaño del bundle y favorece el tree-shaking.",
    },
  ],
};
