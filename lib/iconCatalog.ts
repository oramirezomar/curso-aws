// Catálogo_Iconos del Curso_AWS.
//
// Mapa que asocia un identificador estable (IconId, en kebab-case con prefijo
// de categoría, p. ej. "compute-ec2") con su archivo SVG local bajo /public y
// el nombre oficial del servicio o capa.
//
// Reglas conforme al design.md y a los Requisitos 11.4, 11.5, 11.9:
//  - Toda `path` empieza por "/" (asset local) y NUNCA es una URL externa
//    (http/https) — sin hotlinking (Req 11.4).
//  - Cada icono se referencia por un `id` estable resuelto por este catálogo
//    (Req 11.5).
//  - `resolveIcon` degrada de forma controlada al PLACEHOLDER_ICON si el id es
//    undefined o no existe; nunca lanza (Req 11.9).
//
// NOTA: este archivo define únicamente el catálogo/mapa. Los archivos SVG
// (public/aws-icons/**) se generan en una tarea posterior.

import type { IconCatalog, IconEntry, IconId } from "./types";

// Icono neutro usado como degradación controlada (Req 11.9).
export const PLACEHOLDER_ICON: IconEntry = {
  id: "__placeholder__",
  path: "/aws-icons/_placeholder.svg",
  defaultLabel: "Servicio AWS",
};

export const iconCatalog: IconCatalog = {
  // ─── Capas Temáticas (17) ──────────────────────────────────────────────
  "layer-fundamentos": {
    id: "layer-fundamentos",
    path: "/aws-icons/layers/fundamentos.svg",
    defaultLabel: "Fundamentos de AWS",
  },
  "layer-computo": {
    id: "layer-computo",
    path: "/aws-icons/layers/computo.svg",
    defaultLabel: "Cómputo",
  },
  "layer-almacenamiento-bases-datos": {
    id: "layer-almacenamiento-bases-datos",
    path: "/aws-icons/layers/almacenamiento-bases-datos.svg",
    defaultLabel: "Almacenamiento y Bases de Datos",
  },
  "layer-contenedores": {
    id: "layer-contenedores",
    path: "/aws-icons/layers/contenedores.svg",
    defaultLabel: "Contenedores a fondo",
  },
  "layer-redes-conectividad": {
    id: "layer-redes-conectividad",
    path: "/aws-icons/layers/redes-conectividad.svg",
    defaultLabel: "Redes y Conectividad",
  },
  "layer-seguridad": {
    id: "layer-seguridad",
    path: "/aws-icons/layers/seguridad.svg",
    defaultLabel: "Seguridad",
  },
  "layer-monitoreo-observabilidad": {
    id: "layer-monitoreo-observabilidad",
    path: "/aws-icons/layers/monitoreo-observabilidad.svg",
    defaultLabel: "Monitoreo y Observabilidad",
  },
  "layer-edge-proteccion": {
    id: "layer-edge-proteccion",
    path: "/aws-icons/layers/edge-proteccion.svg",
    defaultLabel: "Edge y Protección",
  },
  "layer-mensajeria-eventos": {
    id: "layer-mensajeria-eventos",
    path: "/aws-icons/layers/mensajeria-eventos.svg",
    defaultLabel: "Mensajería y Arquitecturas Orientadas a Eventos",
  },
  "layer-devops-automatizacion": {
    id: "layer-devops-automatizacion",
    path: "/aws-icons/layers/devops-automatizacion.svg",
    defaultLabel: "DevOps y Automatización",
  },
  "layer-analitica-datos": {
    id: "layer-analitica-datos",
    path: "/aws-icons/layers/analitica-datos.svg",
    defaultLabel: "Analítica y Datos",
  },
  "layer-arquitectura-buenas-practicas": {
    id: "layer-arquitectura-buenas-practicas",
    path: "/aws-icons/layers/arquitectura-buenas-practicas.svg",
    defaultLabel: "Arquitectura y Buenas Prácticas",
  },
  "layer-ia-ml": {
    id: "layer-ia-ml",
    path: "/aws-icons/layers/ia-ml.svg",
    defaultLabel: "Inteligencia Artificial y Machine Learning",
  },
  "layer-costos-finops": {
    id: "layer-costos-finops",
    path: "/aws-icons/layers/costos-finops.svg",
    defaultLabel: "Costos y FinOps",
  },
  "layer-gobernanza-multicuenta": {
    id: "layer-gobernanza-multicuenta",
    path: "/aws-icons/layers/gobernanza-multicuenta.svg",
    defaultLabel: "Gobernanza Multi-Cuenta",
  },
  "layer-migracion-dr": {
    id: "layer-migracion-dr",
    path: "/aws-icons/layers/migracion-dr.svg",
    defaultLabel: "Migración y Recuperación ante Desastres",
  },
  "layer-developer-tooling-iac": {
    id: "layer-developer-tooling-iac",
    path: "/aws-icons/layers/developer-tooling-iac.svg",
    defaultLabel: "Developer Tooling e Infraestructura como Código Moderna",
  },

  // ─── Cómputo ───────────────────────────────────────────────────────────
  "compute-ec2": {
    id: "compute-ec2",
    path: "/aws-icons/services/ec2.svg",
    defaultLabel: "Amazon EC2",
  },
  "compute-lambda": {
    id: "compute-lambda",
    path: "/aws-icons/services/lambda.svg",
    defaultLabel: "AWS Lambda",
  },
  "compute-ecs": {
    id: "compute-ecs",
    path: "/aws-icons/services/ecs.svg",
    defaultLabel: "Amazon ECS",
  },
  "compute-eks": {
    id: "compute-eks",
    path: "/aws-icons/services/eks.svg",
    defaultLabel: "Amazon EKS",
  },
  "compute-elastic-beanstalk": {
    id: "compute-elastic-beanstalk",
    path: "/aws-icons/services/elastic-beanstalk.svg",
    defaultLabel: "AWS Elastic Beanstalk",
  },
  "compute-fargate": {
    id: "compute-fargate",
    path: "/aws-icons/services/fargate.svg",
    defaultLabel: "AWS Fargate",
  },
  "compute-auto-scaling": {
    id: "compute-auto-scaling",
    path: "/aws-icons/services/auto-scaling.svg",
    defaultLabel: "Amazon EC2 Auto Scaling",
  },
  "compute-elb": {
    id: "compute-elb",
    path: "/aws-icons/services/elb.svg",
    defaultLabel: "Elastic Load Balancing",
  },

  // ─── Contenedores ──────────────────────────────────────────────────────
  "containers-ecr": {
    id: "containers-ecr",
    path: "/aws-icons/services/ecr.svg",
    defaultLabel: "Amazon ECR",
  },

  // ─── Almacenamiento y Bases de Datos ─────────────────────────────────────
  "storage-s3": {
    id: "storage-s3",
    path: "/aws-icons/services/s3.svg",
    defaultLabel: "Amazon S3",
  },
  "storage-efs": {
    id: "storage-efs",
    path: "/aws-icons/services/efs.svg",
    defaultLabel: "Amazon EFS",
  },
  "database-rds": {
    id: "database-rds",
    path: "/aws-icons/services/rds.svg",
    defaultLabel: "Amazon RDS",
  },
  "database-dynamodb": {
    id: "database-dynamodb",
    path: "/aws-icons/services/dynamodb.svg",
    defaultLabel: "Amazon DynamoDB",
  },
  "database-elasticache": {
    id: "database-elasticache",
    path: "/aws-icons/services/elasticache.svg",
    defaultLabel: "Amazon ElastiCache",
  },

  // ─── Redes y Conectividad ────────────────────────────────────────────────
  "networking-vpc": {
    id: "networking-vpc",
    path: "/aws-icons/services/vpc.svg",
    defaultLabel: "Amazon VPC",
  },
  "networking-route53": {
    id: "networking-route53",
    path: "/aws-icons/services/route53.svg",
    defaultLabel: "Amazon Route 53",
  },
  "networking-api-gateway": {
    id: "networking-api-gateway",
    path: "/aws-icons/services/api-gateway.svg",
    defaultLabel: "Amazon API Gateway",
  },
  "networking-cloudfront": {
    id: "networking-cloudfront",
    path: "/aws-icons/services/cloudfront.svg",
    defaultLabel: "Amazon CloudFront",
  },
  "networking-global-accelerator": {
    id: "networking-global-accelerator",
    path: "/aws-icons/services/global-accelerator.svg",
    defaultLabel: "AWS Global Accelerator",
  },

  // ─── Seguridad ───────────────────────────────────────────────────────────
  "security-iam": {
    id: "security-iam",
    path: "/aws-icons/services/iam.svg",
    defaultLabel: "AWS IAM",
  },
  "security-kms": {
    id: "security-kms",
    path: "/aws-icons/services/kms.svg",
    defaultLabel: "AWS KMS",
  },
  "security-secrets-manager": {
    id: "security-secrets-manager",
    path: "/aws-icons/services/secrets-manager.svg",
    defaultLabel: "AWS Secrets Manager",
  },
  "security-waf": {
    id: "security-waf",
    path: "/aws-icons/services/waf.svg",
    defaultLabel: "AWS WAF",
  },
  "security-guardduty": {
    id: "security-guardduty",
    path: "/aws-icons/services/guardduty.svg",
    defaultLabel: "Amazon GuardDuty",
  },
  "security-shield": {
    id: "security-shield",
    path: "/aws-icons/services/shield.svg",
    defaultLabel: "AWS Shield",
  },

  // ─── Monitoreo y Observabilidad ──────────────────────────────────────────
  "monitoring-cloudwatch": {
    id: "monitoring-cloudwatch",
    path: "/aws-icons/services/cloudwatch.svg",
    defaultLabel: "Amazon CloudWatch",
  },
  "monitoring-cloudtrail": {
    id: "monitoring-cloudtrail",
    path: "/aws-icons/services/cloudtrail.svg",
    defaultLabel: "AWS CloudTrail",
  },
  "monitoring-xray": {
    id: "monitoring-xray",
    path: "/aws-icons/services/xray.svg",
    defaultLabel: "AWS X-Ray",
  },
  "monitoring-systems-manager": {
    id: "monitoring-systems-manager",
    path: "/aws-icons/services/systems-manager.svg",
    defaultLabel: "AWS Systems Manager",
  },
  "monitoring-opensearch": {
    id: "monitoring-opensearch",
    path: "/aws-icons/services/opensearch.svg",
    defaultLabel: "Amazon OpenSearch Service",
  },

  // ─── Mensajería y Arquitecturas Orientadas a Eventos ─────────────────────
  "messaging-sqs": {
    id: "messaging-sqs",
    path: "/aws-icons/services/sqs.svg",
    defaultLabel: "Amazon SQS",
  },
  "messaging-sns": {
    id: "messaging-sns",
    path: "/aws-icons/services/sns.svg",
    defaultLabel: "Amazon SNS",
  },
  "messaging-eventbridge": {
    id: "messaging-eventbridge",
    path: "/aws-icons/services/eventbridge.svg",
    defaultLabel: "Amazon EventBridge",
  },
  "messaging-step-functions": {
    id: "messaging-step-functions",
    path: "/aws-icons/services/step-functions.svg",
    defaultLabel: "AWS Step Functions",
  },

  // ─── DevOps y Automatización ─────────────────────────────────────────────
  "devops-cloudformation": {
    id: "devops-cloudformation",
    path: "/aws-icons/services/cloudformation.svg",
    defaultLabel: "AWS CloudFormation",
  },
  "devops-codepipeline": {
    id: "devops-codepipeline",
    path: "/aws-icons/services/codepipeline.svg",
    defaultLabel: "AWS CodePipeline",
  },
  "devops-codebuild": {
    id: "devops-codebuild",
    path: "/aws-icons/services/codebuild.svg",
    defaultLabel: "AWS CodeBuild",
  },
  "devops-codedeploy": {
    id: "devops-codedeploy",
    path: "/aws-icons/services/codedeploy.svg",
    defaultLabel: "AWS CodeDeploy",
  },

  // ─── Analítica y Datos ───────────────────────────────────────────────────
  "analytics-athena": {
    id: "analytics-athena",
    path: "/aws-icons/services/athena.svg",
    defaultLabel: "Amazon Athena",
  },
  "analytics-glue": {
    id: "analytics-glue",
    path: "/aws-icons/services/glue.svg",
    defaultLabel: "AWS Glue",
  },
  "analytics-redshift": {
    id: "analytics-redshift",
    path: "/aws-icons/services/redshift.svg",
    defaultLabel: "Amazon Redshift",
  },
  "analytics-emr": {
    id: "analytics-emr",
    path: "/aws-icons/services/emr.svg",
    defaultLabel: "Amazon EMR",
  },
  "analytics-kinesis": {
    id: "analytics-kinesis",
    path: "/aws-icons/services/kinesis.svg",
    defaultLabel: "Amazon Kinesis",
  },

  // ─── Inteligencia Artificial y Machine Learning ──────────────────────────
  "ai-bedrock": {
    id: "ai-bedrock",
    path: "/aws-icons/services/bedrock.svg",
    defaultLabel: "Amazon Bedrock",
  },
  "ai-sagemaker": {
    id: "ai-sagemaker",
    path: "/aws-icons/services/sagemaker.svg",
    defaultLabel: "Amazon SageMaker AI",
  },

  // ─── Costos y FinOps ─────────────────────────────────────────────────────
  "finops-cost-explorer": {
    id: "finops-cost-explorer",
    path: "/aws-icons/services/cost-explorer.svg",
    defaultLabel: "AWS Cost Explorer",
  },
  "finops-budgets": {
    id: "finops-budgets",
    path: "/aws-icons/services/budgets.svg",
    defaultLabel: "AWS Budgets",
  },
  "finops-savings-plans": {
    id: "finops-savings-plans",
    path: "/aws-icons/services/savings-plans.svg",
    defaultLabel: "AWS Savings Plans",
  },

  // ─── Gobernanza Multi-Cuenta ─────────────────────────────────────────────
  "governance-organizations": {
    id: "governance-organizations",
    path: "/aws-icons/services/organizations.svg",
    defaultLabel: "AWS Organizations",
  },
  "governance-control-tower": {
    id: "governance-control-tower",
    path: "/aws-icons/services/control-tower.svg",
    defaultLabel: "AWS Control Tower",
  },

  // ─── Migración y Recuperación ante Desastres ─────────────────────────────
  "migration-dms": {
    id: "migration-dms",
    path: "/aws-icons/services/dms.svg",
    defaultLabel: "AWS Database Migration Service",
  },
  "migration-backup": {
    id: "migration-backup",
    path: "/aws-icons/services/backup.svg",
    defaultLabel: "AWS Backup",
  },

  // ─── Developer Tooling e Infraestructura como Código Moderna ─────────────
  "devtools-cdk": {
    id: "devtools-cdk",
    path: "/aws-icons/services/cdk.svg",
    defaultLabel: "AWS CDK",
  },
};

/**
 * Resuelve un IconId contra el Catálogo_Iconos.
 *
 * Degradación controlada (Req 11.9): devuelve PLACEHOLDER_ICON cuando el `id`
 * es `undefined` o no existe en el catálogo. Nunca lanza.
 */
export function resolveIcon(id: IconId | undefined): IconEntry {
  if (!id) return PLACEHOLDER_ICON;
  return iconCatalog[id] ?? PLACEHOLDER_ICON;
}
