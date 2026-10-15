import type { Lesson } from "@/lib/types";

// Capa_Temática "DevOps y Automatización" (dayRange [25, 26]).
// Día 25 — Infraestructura como Código (IaC): AWS CloudFormation (plantillas
// declarativas en YAML) y Terraform (HCL de HashiCorp). Aprovisionar y versionar
// la infraestructura de forma repetible, auditable y controlada por código.
//
// Trazabilidad: Req 3.6, 5.1, 5.2, 5.3, 9.1, 9.4, 11.3.
export const day25: Lesson = {
  day: 25,
  slug: "devops-iac-cloudformation-terraform",
  title: "Infraestructura como Código: AWS CloudFormation y Terraform",
  section: "DevOps y Automatización",
  estimatedMinutes: 35,
  objectives: [
    "Comprender qué es la Infraestructura como Código (IaC) y por qué sustituye al aprovisionamiento manual en la consola",
    "Escribir una plantilla declarativa de AWS CloudFormation en YAML y conocer sus secciones principales",
    "Definir recursos de AWS con Terraform usando HCL y distinguir el enfoque de estado (state) frente al stack de CloudFormation",
  ],
  blocks: [
    {
      type: "paragraph",
      text:
        "La Infraestructura como Código (IaC) consiste en describir los recursos de la nube —redes, servidores, buckets, bases de datos— en archivos de texto versionables, en lugar de crearlos a mano en la consola. El archivo es la fuente de verdad: cualquiera puede revisarlo, revisarlo en un pull request, replicarlo entre cuentas y entornos, y reconstruir todo desde cero de forma idéntica. Adiós a los entornos que 'nadie sabe cómo se montaron'.",
    },
    {
      type: "callout",
      variant: "info",
      text:
        "AWS CloudFormation es el servicio nativo de IaC de AWS: tú declaras el estado deseado en una plantilla y CloudFormation calcula y aplica los cambios, agrupando los recursos en una unidad llamada stack. Terraform, de HashiCorp, cumple el mismo objetivo pero es multinube y usa su propio lenguaje, HCL.",
    },
    { type: "heading", level: 2, text: "AWS CloudFormation: plantillas y stacks" },
    {
      type: "list",
      items: [
        "Plantilla (template): documento declarativo en YAML o JSON que describe los recursos deseados y sus propiedades.",
        "Stack: el conjunto de recursos que CloudFormation crea, actualiza y elimina como una sola unidad a partir de una plantilla.",
        "Change set: previsualización de los cambios que CloudFormation aplicará antes de ejecutarlos, para evitar sorpresas.",
        "Secciones típicas de una plantilla: Parameters (entradas), Resources (obligatoria, lo que se crea) y Outputs (valores exportados).",
      ],
    },
    {
      type: "code",
      lang: "yaml",
      title: "Plantilla CloudFormation en YAML: bucket S3 con versionado",
      code:
        "AWSTemplateFormatVersion: \"2010-09-09\"\n" +
        "Description: Bucket S3 privado con versionado activado\n" +
        "\n" +
        "Parameters:\n" +
        "  NombreBucket:\n" +
        "    Type: String\n" +
        "    Description: Nombre global unico del bucket\n" +
        "\n" +
        "Resources:\n" +
        "  BucketDatos:\n" +
        "    Type: AWS::S3::Bucket\n" +
        "    Properties:\n" +
        "      BucketName: !Ref NombreBucket\n" +
        "      VersioningConfiguration:\n" +
        "        Status: Enabled\n" +
        "      PublicAccessBlockConfiguration:\n" +
        "        BlockPublicAcls: true\n" +
        "        BlockPublicPolicy: true\n" +
        "        IgnorePublicAcls: true\n" +
        "        RestrictPublicBuckets: true\n" +
        "\n" +
        "Outputs:\n" +
        "  BucketArn:\n" +
        "    Description: ARN del bucket creado\n" +
        "    Value: !GetAtt BucketDatos.Arn",
    },
    {
      type: "callout",
      variant: "warning",
      text:
        "La sección Resources es la única obligatoria en una plantilla de CloudFormation. Las funciones intrínsecas como !Ref (referencia a otro recurso o parámetro) y !GetAtt (obtiene un atributo de un recurso) son la forma correcta de enlazar recursos sin escribir identificadores a mano.",
    },
    { type: "heading", level: 2, text: "Desplegar un stack con la CLI de AWS" },
    {
      type: "code",
      lang: "bash",
      title: "Crear un stack de CloudFormation desde la plantilla",
      code:
        "aws cloudformation deploy \\\n" +
        "  --template-file plantilla.yaml \\\n" +
        "  --stack-name datos-app \\\n" +
        "  --parameter-overrides NombreBucket=datos-app-prod-2026 \\\n" +
        "  --region us-east-2",
    },
    { type: "heading", level: 2, text: "Terraform: HCL y el enfoque de estado" },
    {
      type: "paragraph",
      text:
        "Terraform describe la infraestructura en HCL (HashiCorp Configuration Language). A diferencia de CloudFormation, Terraform mantiene un archivo de estado (state) que mapea los recursos declarados con los recursos reales en la nube; al ejecutar 'terraform plan' calcula la diferencia entre lo declarado y el estado actual, y 'terraform apply' la aplica. Es multinube: el mismo flujo sirve para AWS, Azure, GCP y cientos de proveedores.",
    },
    {
      type: "code",
      lang: "hcl",
      title: "Recurso Terraform: aws_s3_bucket con versionado",
      code:
        "terraform {\n" +
        "  required_providers {\n" +
        "    aws = {\n" +
        "      source  = \"hashicorp/aws\"\n" +
        "      version = \"~> 5.0\"\n" +
        "    }\n" +
        "  }\n" +
        "}\n" +
        "\n" +
        "provider \"aws\" {\n" +
        "  region = \"us-east-2\"\n" +
        "}\n" +
        "\n" +
        "resource \"aws_s3_bucket\" \"datos\" {\n" +
        "  bucket = \"datos-app-prod-2026\"\n" +
        "}\n" +
        "\n" +
        "resource \"aws_s3_bucket_versioning\" \"datos\" {\n" +
        "  bucket = aws_s3_bucket.datos.id\n" +
        "\n" +
        "  versioning_configuration {\n" +
        "    status = \"Enabled\"\n" +
        "  }\n" +
        "}",
    },
    {
      type: "callout",
      variant: "success",
      text:
        "Idea clave: CloudFormation agrupa recursos en un stack que AWS gestiona por ti; Terraform mantiene un archivo de estado que compara lo declarado con la realidad. Ambos son declarativos: tú describes el QUÉ (estado deseado), no el CÓMO (los pasos).",
    },
    { type: "heading", level: 2, text: "Servicios de esta capa" },
    {
      type: "serviceIcon",
      items: [
        { service: "AWS CloudFormation", icon: "devops-cloudformation" },
      ],
    },
  ],
  icon: "devops-cloudformation",
  selfCheck: [
    {
      question:
        "¿Cuál es la diferencia esencial entre AWS CloudFormation y Terraform?",
      options: [
        "CloudFormation es imperativo y Terraform es declarativo",
        "CloudFormation es el servicio nativo de IaC de AWS que agrupa recursos en un stack; Terraform es multinube y mantiene su propio archivo de estado en HCL",
        "Terraform solo funciona con AWS y CloudFormation con cualquier nube",
        "Ambos requieren crear los recursos manualmente en la consola antes de ejecutarse",
      ],
      correctIndex: 1,
      explanation:
        "Los dos son herramientas de IaC declarativa. CloudFormation es nativo de AWS y organiza los recursos en un stack que el propio servicio gestiona. Terraform (HashiCorp) usa HCL, es multinube y mantiene un archivo de estado (state) que mapea lo declarado con lo que existe en la nube.",
    },
    {
      question:
        "En una plantilla de AWS CloudFormation, ¿qué sección es obligatoria?",
      options: [
        "Parameters",
        "Outputs",
        "Resources",
        "Mappings",
      ],
      correctIndex: 2,
      explanation:
        "La sección Resources es la única obligatoria: declara los recursos de AWS que el stack creará. Parameters, Outputs y Mappings son opcionales y sirven para parametrizar, exportar valores o definir tablas de búsqueda.",
    },
  ],
};
