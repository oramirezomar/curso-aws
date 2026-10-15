# AWS Icons — Assets locales del Curso_AWS

## Iconos oficiales de AWS Architecture Icons

Los archivos `.svg` de esta carpeta (`layers/**`, `services/**` y
`_placeholder.svg`) son los **AWS Architecture Icons oficiales**, extraídos del
paquete npm `aws-icons` (licencia MIT del empaquetado) que reproduce **sin
modificar** el set oficial publicado por AWS en
<https://aws.amazon.com/architecture/icons/>. El paquete se usó solo en tiempo
de build para extraer los SVG y luego se desinstaló: los iconos viven ahora como
assets locales en `public/aws-icons/` (sin hotlinking a dominios externos,
Requisito 11.4) y el proyecto no mantiene ninguna dependencia de iconos en
runtime.

### Propiedad y términos de marca

Los iconos son **propiedad de Amazon Web Services, Inc.** y se usan bajo los
términos de AWS Architecture Icons. En este curso se respetan dichos términos:

- **No se modifican** los iconos: no se recortan, voltean, rotan ni distorsionan;
  el componente `AwsIcon` los renderiza preservando su relación de aspecto
  original (Req 11.6).
- El curso es **material independiente** y no sugiere patrocinio ni aval de AWS
  (Req 11.8).
- El icono de cada servicio se usa **únicamente** para representar ese servicio
  (Req 11.7).

### Servicios y capas

- **Servicios** (`services/*.svg`): cada archivo es el icono oficial del servicio
  correspondiente de la categoría `architecture-service` del set de AWS
  (p. ej. `s3.svg` ← `AmazonSimpleStorageService.svg`, `sagemaker.svg` ←
  `AmazonSageMakerAI.svg`).
- **Capas** (`layers/*.svg`): una Capa_Temática no es un servicio, por lo que se
  usa el icono oficial de **categoría** de AWS más representativo de cada capa
  (p. ej. `computo.svg` ← `category/Compute.svg`,
  `ia-ml.svg` ← `category/ArtificialIntelligence.svg`). Las capas de Fundamentos
  y de Arquitectura usan `architecture-group/AWSCloud.svg`.
- **Placeholder** (`_placeholder.svg`): icono neutro de nube de AWS
  (`architecture-group/AWSCloud.svg`), usado por `resolveIcon` como degradación
  controlada cuando un `IconId` no existe (Req 11.9).

## Correspondencia id → archivo

La columna final indica el icono oficial de origen (categoría de servicio o de
capa) con el que se materializó cada entrada del `iconCatalog`.

| id | archivo | representa | abreviatura |
| --- | --- | --- | --- |
| `__placeholder__` | `/aws-icons/_placeholder.svg` | Servicio AWS | AWS |
| `layer-fundamentos` | `/aws-icons/layers/fundamentos.svg` | Fundamentos de AWS | FA |
| `layer-computo` | `/aws-icons/layers/computo.svg` | Cómputo | C |
| `layer-almacenamiento-bases-datos` | `/aws-icons/layers/almacenamiento-bases-datos.svg` | Almacenamiento y Bases de Datos | ABD |
| `layer-contenedores` | `/aws-icons/layers/contenedores.svg` | Contenedores a fondo | CF |
| `layer-redes-conectividad` | `/aws-icons/layers/redes-conectividad.svg` | Redes y Conectividad | RC |
| `layer-seguridad` | `/aws-icons/layers/seguridad.svg` | Seguridad | S |
| `layer-monitoreo-observabilidad` | `/aws-icons/layers/monitoreo-observabilidad.svg` | Monitoreo y Observabilidad | MO |
| `layer-edge-proteccion` | `/aws-icons/layers/edge-proteccion.svg` | Edge y Protección | EP |
| `layer-mensajeria-eventos` | `/aws-icons/layers/mensajeria-eventos.svg` | Mensajería y Arquitecturas Orientadas a Eventos | MAO |
| `layer-devops-automatizacion` | `/aws-icons/layers/devops-automatizacion.svg` | DevOps y Automatización | DA |
| `layer-analitica-datos` | `/aws-icons/layers/analitica-datos.svg` | Analítica y Datos | AD |
| `layer-arquitectura-buenas-practicas` | `/aws-icons/layers/arquitectura-buenas-practicas.svg` | Arquitectura y Buenas Prácticas | ABP |
| `layer-ia-ml` | `/aws-icons/layers/ia-ml.svg` | Inteligencia Artificial y Machine Learning | IAM |
| `layer-costos-finops` | `/aws-icons/layers/costos-finops.svg` | Costos y FinOps | CF |
| `layer-gobernanza-multicuenta` | `/aws-icons/layers/gobernanza-multicuenta.svg` | Gobernanza Multi-Cuenta | GMC |
| `layer-migracion-dr` | `/aws-icons/layers/migracion-dr.svg` | Migración y Recuperación ante Desastres | MRD |
| `layer-developer-tooling-iac` | `/aws-icons/layers/developer-tooling-iac.svg` | Developer Tooling e Infraestructura como Código Moderna | DTI |
| `compute-ec2` | `/aws-icons/services/ec2.svg` | Amazon EC2 | EC2 |
| `compute-lambda` | `/aws-icons/services/lambda.svg` | AWS Lambda | λ |
| `compute-ecs` | `/aws-icons/services/ecs.svg` | Amazon ECS | ECS |
| `compute-eks` | `/aws-icons/services/eks.svg` | Amazon EKS | EKS |
| `compute-elastic-beanstalk` | `/aws-icons/services/elastic-beanstalk.svg` | AWS Elastic Beanstalk | EB |
| `compute-fargate` | `/aws-icons/services/fargate.svg` | AWS Fargate | FGT |
| `compute-auto-scaling` | `/aws-icons/services/auto-scaling.svg` | Amazon EC2 Auto Scaling | ASG |
| `compute-elb` | `/aws-icons/services/elb.svg` | Elastic Load Balancing | ELB |
| `containers-ecr` | `/aws-icons/services/ecr.svg` | Amazon ECR | ECR |
| `storage-s3` | `/aws-icons/services/s3.svg` | Amazon S3 | S3 |
| `storage-efs` | `/aws-icons/services/efs.svg` | Amazon EFS | EFS |
| `database-rds` | `/aws-icons/services/rds.svg` | Amazon RDS | RDS |
| `database-dynamodb` | `/aws-icons/services/dynamodb.svg` | Amazon DynamoDB | DDB |
| `database-elasticache` | `/aws-icons/services/elasticache.svg` | Amazon ElastiCache | EC |
| `networking-vpc` | `/aws-icons/services/vpc.svg` | Amazon VPC | VPC |
| `networking-route53` | `/aws-icons/services/route53.svg` | Amazon Route 53 | R53 |
| `networking-api-gateway` | `/aws-icons/services/api-gateway.svg` | Amazon API Gateway | APIG |
| `networking-cloudfront` | `/aws-icons/services/cloudfront.svg` | Amazon CloudFront | CF |
| `networking-global-accelerator` | `/aws-icons/services/global-accelerator.svg` | AWS Global Accelerator | GA |
| `security-iam` | `/aws-icons/services/iam.svg` | AWS IAM | IAM |
| `security-kms` | `/aws-icons/services/kms.svg` | AWS KMS | KMS |
| `security-secrets-manager` | `/aws-icons/services/secrets-manager.svg` | AWS Secrets Manager | SM |
| `security-waf` | `/aws-icons/services/waf.svg` | AWS WAF | WAF |
| `security-guardduty` | `/aws-icons/services/guardduty.svg` | Amazon GuardDuty | GD |
| `security-shield` | `/aws-icons/services/shield.svg` | AWS Shield | SHD |
| `monitoring-cloudwatch` | `/aws-icons/services/cloudwatch.svg` | Amazon CloudWatch | CW |
| `monitoring-cloudtrail` | `/aws-icons/services/cloudtrail.svg` | AWS CloudTrail | CT |
| `monitoring-xray` | `/aws-icons/services/xray.svg` | AWS X-Ray | X |
| `monitoring-systems-manager` | `/aws-icons/services/systems-manager.svg` | AWS Systems Manager | SSM |
| `monitoring-opensearch` | `/aws-icons/services/opensearch.svg` | Amazon OpenSearch Service | OS |
| `messaging-sqs` | `/aws-icons/services/sqs.svg` | Amazon SQS | SQS |
| `messaging-sns` | `/aws-icons/services/sns.svg` | Amazon SNS | SNS |
| `messaging-eventbridge` | `/aws-icons/services/eventbridge.svg` | Amazon EventBridge | EVB |
| `messaging-step-functions` | `/aws-icons/services/step-functions.svg` | AWS Step Functions | SFN |
| `devops-cloudformation` | `/aws-icons/services/cloudformation.svg` | AWS CloudFormation | CFN |
| `devops-codepipeline` | `/aws-icons/services/codepipeline.svg` | AWS CodePipeline | CP |
| `devops-codebuild` | `/aws-icons/services/codebuild.svg` | AWS CodeBuild | CB |
| `devops-codedeploy` | `/aws-icons/services/codedeploy.svg` | AWS CodeDeploy | CD |
| `analytics-athena` | `/aws-icons/services/athena.svg` | Amazon Athena | ATH |
| `analytics-glue` | `/aws-icons/services/glue.svg` | AWS Glue | GLU |
| `analytics-redshift` | `/aws-icons/services/redshift.svg` | Amazon Redshift | RS |
| `analytics-emr` | `/aws-icons/services/emr.svg` | Amazon EMR | EMR |
| `analytics-kinesis` | `/aws-icons/services/kinesis.svg` | Amazon Kinesis | KIN |
| `ai-bedrock` | `/aws-icons/services/bedrock.svg` | Amazon Bedrock | BR |
| `ai-sagemaker` | `/aws-icons/services/sagemaker.svg` | Amazon SageMaker AI | SM-AI |
| `finops-cost-explorer` | `/aws-icons/services/cost-explorer.svg` | AWS Cost Explorer | CE |
| `finops-budgets` | `/aws-icons/services/budgets.svg` | AWS Budgets | BGT |
| `finops-savings-plans` | `/aws-icons/services/savings-plans.svg` | AWS Savings Plans | SP |
| `governance-organizations` | `/aws-icons/services/organizations.svg` | AWS Organizations | ORG |
| `governance-control-tower` | `/aws-icons/services/control-tower.svg` | AWS Control Tower | CTW |
| `migration-dms` | `/aws-icons/services/dms.svg` | AWS Database Migration Service | DMS |
| `migration-backup` | `/aws-icons/services/backup.svg` | AWS Backup | BKP |
| `devtools-cdk` | `/aws-icons/services/cdk.svg` | AWS CDK | CDK |
| `__placeholder__` | `/aws-icons/_placeholder.svg` | Servicio AWS | AWS |

> Total de assets generados: **72** (71 del catálogo + 1 placeholder).
