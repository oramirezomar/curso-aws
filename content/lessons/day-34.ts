import type { Lesson } from "@/lib/types";

// Capa_Temática "Gobernanza Multi-Cuenta" (dayRange [34, 34]).
// Día 34 — Gobernar un entorno de múltiples cuentas AWS: AWS Organizations
// (cuentas y unidades organizativas), AWS Control Tower (landing zone con
// buenas prácticas) y las Service Control Policies (SCP) como barreras de
// seguridad (guardrails) que acotan los permisos máximos de cada cuenta.
//
// Trazabilidad: Req 3.15, 5.1, 5.2, 9.1, 9.4, 11.3.
export const day34: Lesson = {
  day: 34,
  slug: "gobernanza-multicuenta",
  title:
    "Gobernanza Multi-Cuenta: AWS Organizations, AWS Control Tower y SCP",
  section: "Gobernanza Multi-Cuenta",
  estimatedMinutes: 30,
  objectives: [
    "Entender AWS Organizations para administrar de forma centralizada múltiples cuentas AWS mediante cuentas y unidades organizativas (OUs)",
    "Comprender AWS Control Tower como servicio que despliega y gobierna una landing zone multi-cuenta siguiendo buenas prácticas",
    "Aplicar Service Control Policies (SCP) como barreras de permisos máximos (guardrails) sobre cuentas y OUs de la organización",
  ],
  blocks: [
    {
      type: "paragraph",
      text:
        "Cuando una organización crece, concentrar todo en una sola cuenta AWS se vuelve inmanejable: se mezclan entornos (producción, desarrollo), se dificulta aislar costos y radios de impacto, y un error de permisos afecta a todo. La estrategia recomendada por AWS es la de múltiples cuentas. Para gobernarlas de forma centralizada existen tres piezas: AWS Organizations para estructurar las cuentas, AWS Control Tower para montar y vigilar el entorno con buenas prácticas, y las Service Control Policies para poner límites de permisos que nadie dentro de la cuenta puede saltarse.",
    },
    {
      type: "callout",
      variant: "info",
      text:
        "AWS Organizations es un servicio global y sus APIs se operan desde la Región us-east-1. Aun así, es buena práctica indicar siempre --region de forma explícita en la CLI para que el comando sea reproducible y no dependa de la configuración del perfil.",
    },
    { type: "heading", level: 2, text: "AWS Organizations: cuentas y OUs" },
    {
      type: "paragraph",
      text:
        "AWS Organizations te permite administrar de forma central y gobernar un conjunto de cuentas AWS. En la raíz (root) está la cuenta de gestión (management account), desde la que se crea la organización. Las cuentas miembro se agrupan en unidades organizativas (OUs), que son contenedores jerárquicos: por ejemplo, una OU de Producción y otra de Desarrollo. Esta estructura permite aplicar políticas y controles por grupo, consolidar la facturación y aislar responsabilidades.",
    },
    {
      type: "list",
      items: [
        "Cuenta de gestión (management account): la cuenta que crea y es dueña de la organización; nunca debería alojar cargas de trabajo productivas.",
        "Unidad organizativa (OU): contenedor que agrupa cuentas para aplicarles políticas en común; puede anidarse formando una jerarquía.",
        "Cuenta miembro: cada cuenta de la organización, aislada en recursos y permisos pero gobernada de forma central.",
        "Facturación consolidada: todas las cuentas comparten una única factura, con descuentos por volumen agregados.",
      ],
    },
    {
      type: "code",
      lang: "bash",
      title: "Crear una OU y una cuenta miembro con AWS Organizations (CLI)",
      code:
        "# Crear una OU de Producción colgando de la raíz de la organización\n" +
        "aws organizations create-organizational-unit \\\n" +
        "  --parent-id r-exam \\\n" +
        "  --name \"Produccion\" \\\n" +
        "  --region us-east-1\n" +
        "\n" +
        "# Crear una nueva cuenta miembro dentro de la organización\n" +
        "aws organizations create-account \\\n" +
        "  --email cuenta-produccion@example.com \\\n" +
        "  --account-name \"Produccion\" \\\n" +
        "  --region us-east-1",
    },
    { type: "heading", level: 2, text: "AWS Control Tower: la landing zone" },
    {
      type: "paragraph",
      text:
        "Montar un entorno multi-cuenta a mano (OUs, cuentas, logging centralizado, SSO, barreras de seguridad) es laborioso y propenso a errores. AWS Control Tower automatiza ese proceso: despliega y gobierna una landing zone, es decir, un entorno multi-cuenta bien arquitecturado y listo para usar, siguiendo las buenas prácticas de AWS. Se apoya en AWS Organizations por debajo y añade controles (controls o guardrails) preventivos y de detección para mantener el entorno conforme a lo largo del tiempo.",
    },
    {
      type: "list",
      items: [
        "Landing zone: entorno multi-cuenta inicial, seguro y conforme a buenas prácticas, creado y mantenido automáticamente.",
        "Cuentas base: Control Tower provisiona cuentas dedicadas para logging centralizado (log archive) y auditoría de seguridad.",
        "Controles (guardrails): reglas preventivas (basadas en SCP) y de detección (basadas en AWS Config) que vigilan el cumplimiento.",
        "Account Factory: mecanismo para provisionar nuevas cuentas de forma estandarizada y conforme desde el primer día.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      text:
        "Control Tower no sustituye a Organizations: lo usa como base. Si ya tienes una organización, Control Tower puede desplegar su landing zone encima, aportando las barreras, el logging centralizado y la fábrica de cuentas sin que tengas que configurarlos pieza por pieza.",
    },
    { type: "heading", level: 2, text: "Service Control Policies (SCP): guardrails" },
    {
      type: "paragraph",
      text:
        "Las Service Control Policies (SCP) son un tipo de política de AWS Organizations que define el máximo de permisos disponibles para las cuentas de una OU o para una cuenta concreta. Es clave entender que una SCP NO concede permisos: solo acota el techo. Aunque un usuario tenga una política de IAM que le permita una acción, si una SCP la deniega, la acción se bloquea. Son la barrera central para imponer controles como 'ninguna cuenta de esta OU puede operar fuera de us-east-1' o 'nadie puede desactivar CloudTrail'.",
    },
    {
      type: "code",
      lang: "json",
      title: "SCP que deniega apagar CloudTrail y operar fuera de us-east-1",
      code:
        "{\n" +
        "  \"Version\": \"2012-10-17\",\n" +
        "  \"Statement\": [\n" +
        "    {\n" +
        "      \"Sid\": \"DenegarDetenerCloudTrail\",\n" +
        "      \"Effect\": \"Deny\",\n" +
        "      \"Action\": [\n" +
        "        \"cloudtrail:StopLogging\",\n" +
        "        \"cloudtrail:DeleteTrail\"\n" +
        "      ],\n" +
        "      \"Resource\": \"*\"\n" +
        "    },\n" +
        "    {\n" +
        "      \"Sid\": \"DenegarFueraDeUsEast1\",\n" +
        "      \"Effect\": \"Deny\",\n" +
        "      \"NotAction\": [\n" +
        "        \"iam:*\",\n" +
        "        \"organizations:*\",\n" +
        "        \"cloudfront:*\"\n" +
        "      ],\n" +
        "      \"Resource\": \"*\",\n" +
        "      \"Condition\": {\n" +
        "        \"StringNotEquals\": {\n" +
        "          \"aws:RequestedRegion\": \"us-east-1\"\n" +
        "        }\n" +
        "      }\n" +
        "    }\n" +
        "  ]\n" +
        "}",
    },
    {
      type: "callout",
      variant: "warning",
      text:
        "Cuidado con el orden mental: una SCP solo RESTRINGE, nunca otorga. Si adjuntas una SCP que solo permite ciertas acciones pero las cuentas no tienen políticas de IAM que las concedan, no pasará nada; y si una SCP deniega algo, ninguna política de IAM podrá revertirlo. Prueba siempre las SCP en una OU de ensayo antes de aplicarlas en producción.",
    },
    {
      type: "callout",
      variant: "success",
      text:
        "Estrategia recomendada: usa AWS Organizations para estructurar cuentas y OUs, despliega AWS Control Tower para obtener una landing zone con buenas prácticas y logging centralizado, y refuerza los límites con SCP que impongan tus barreras de seguridad de forma inquebrantable.",
    },
    { type: "heading", level: 2, text: "Servicios de esta capa" },
    {
      type: "serviceIcon",
      items: [
        { service: "AWS Organizations", icon: "governance-organizations" },
        { service: "AWS Control Tower", icon: "governance-control-tower" },
      ],
    },
  ],
  icon: "governance-organizations",
  selfCheck: [
    {
      question:
        "¿Qué hace realmente una Service Control Policy (SCP) en AWS Organizations?",
      options: [
        "Concede permisos de IAM a los usuarios de una cuenta",
        "Define el máximo de permisos disponibles para las cuentas de una OU o cuenta: no otorga permisos, solo acota el techo, y una denegación prevalece sobre cualquier política de IAM",
        "Despliega automáticamente una landing zone multi-cuenta",
        "Consolida la facturación de todas las cuentas en una sola factura",
      ],
      correctIndex: 1,
      explanation:
        "Una SCP establece el límite máximo de permisos (guardrail) para las cuentas de una OU o una cuenta concreta. No concede permisos por sí sola: aunque IAM permita una acción, si la SCP la deniega, la acción se bloquea. La facturación consolidada y la landing zone son responsabilidades de Organizations y Control Tower, respectivamente.",
    },
    {
      question:
        "¿Cuál es la relación entre AWS Organizations y AWS Control Tower?",
      options: [
        "Son servicios independientes que no pueden coexistir",
        "Control Tower reemplaza por completo a Organizations",
        "Control Tower se apoya en AWS Organizations como base y, sobre él, despliega y gobierna una landing zone con cuentas base, barreras (guardrails) y logging centralizado siguiendo buenas prácticas",
        "Organizations solo sirve para crear SCP y nada más",
      ],
      correctIndex: 2,
      explanation:
        "AWS Control Tower no sustituye a Organizations: lo usa por debajo. Organizations aporta la estructura de cuentas y OUs; Control Tower añade de forma automatizada la landing zone, las cuentas base de logging y auditoría, los controles (preventivos vía SCP y de detección vía AWS Config) y la Account Factory para provisionar cuentas estandarizadas.",
    },
  ],
};
