import type { Lesson } from "@/lib/types";

// Capa_Temática: Analítica y Datos (Nivel AVANZADO, dayRange [27, 28]).
// Día 27 — Lago de datos y consultas: Amazon S3 como data lake, Amazon Athena
// (SQL serverless sobre S3) y AWS Glue (ETL serverless y catálogo de datos).
//
// Trazabilidad: Req 3.8, 5.1, 5.2, 9.1, 9.4, 11.3.
export const day27: Lesson = {
  day: 27,
  slug: "analitica-athena-glue",
  title: "Lago de datos y consultas: Amazon S3, Amazon Athena y AWS Glue",
  section: "Analítica y Datos",
  estimatedMinutes: 30,
  icon: "analytics-athena",
  objectives: [
    "Comprender el patrón de lago de datos (data lake) sobre Amazon S3 como almacenamiento central y desacoplado del cómputo",
    "Explicar Amazon Athena como motor de consultas SQL serverless que lee directamente los datos de S3 sin servidores que administrar",
    "Entender el papel de AWS Glue como servicio de ETL serverless y catálogo de datos (Glue Data Catalog) que describe los esquemas",
  ],
  blocks: [
    {
      type: "paragraph",
      text:
        "Un lago de datos (data lake) es un repositorio centralizado que almacena datos estructurados y no estructurados a cualquier escala. En AWS, el lago de datos se construye normalmente sobre Amazon S3: los datos crudos y procesados viven como objetos en buckets, y los servicios analíticos los consultan sin necesidad de cargarlos previamente en una base de datos. Esta separación entre almacenamiento (S3) y cómputo (Athena, Glue, EMR, Redshift) es la base de la analítica moderna en la nube.",
    },
    {
      type: "callout",
      variant: "info",
      text:
        "La idea clave del lago de datos es desacoplar el almacenamiento del cómputo: guardas los datos una sola vez en S3 y encima colocas distintos motores (Athena para SQL ad hoc, Glue para ETL, EMR para big data, Redshift para almacén analítico) según la necesidad.",
    },
    { type: "heading", level: 2, text: "Amazon Athena: SQL serverless sobre S3" },
    {
      type: "paragraph",
      text:
        "Amazon Athena es un servicio de consultas interactivo que permite analizar datos directamente en Amazon S3 usando SQL estándar. Es serverless: no hay infraestructura que aprovisionar ni administrar, y se paga por la cantidad de datos escaneados en cada consulta. Athena usa el Glue Data Catalog como metastore para conocer las tablas, columnas y ubicaciones de los datos en S3.",
    },
    {
      type: "list",
      items: [
        "Serverless: no administras servidores; solo defines tablas y ejecutas consultas SQL.",
        "Modelo de costo: se cobra por los datos escaneados; comprimir y usar formatos columnares (Parquet, ORC) reduce el costo y acelera las consultas.",
        "Formatos soportados: CSV, JSON, Parquet, ORC, Avro, entre otros, leídos directamente desde S3.",
        "Particionado: dividir los datos por columnas (por ejemplo, fecha) reduce drásticamente los datos escaneados por consulta.",
      ],
    },
    {
      type: "code",
      lang: "bash",
      title: "Lanzar una consulta de Athena de forma asíncrona con la AWS CLI",
      code: `# Inicia la ejecucion de una consulta SQL sobre una tabla del Data Catalog.
# Athena lee los datos directamente desde S3 y escribe el resultado en S3.
aws athena start-query-execution \\
  --query-string "SELECT origen, COUNT(*) AS total FROM ventas GROUP BY origen" \\
  --query-execution-context Database=analitica_db \\
  --result-configuration OutputLocation=s3://mi-lago-datos/resultados-athena/ \\
  --region us-east-2`,
    },
    {
      type: "code",
      lang: "text",
      title: "Crear una tabla externa en Athena apuntando a datos en S3",
      code: `-- CodeBlock no resalta SQL: se muestra como texto plano.
CREATE EXTERNAL TABLE ventas (
  origen   STRING,
  monto    DOUBLE,
  fecha    DATE
)
ROW FORMAT SERDE 'org.apache.hadoop.hive.ql.io.parquet.serde.ParquetHiveSerDe'
STORED AS PARQUET
LOCATION 's3://mi-lago-datos/ventas/';`,
    },
    {
      type: "callout",
      variant: "warning",
      text:
        "Athena cobra por los datos escaneados en cada consulta. Un SELECT * sobre datos en texto plano sin particionar puede resultar caro y lento. Usa formatos columnares comprimidos (Parquet/ORC), particiona por columnas de filtrado frecuente y selecciona solo las columnas necesarias.",
    },
    { type: "heading", level: 2, text: "AWS Glue: ETL serverless y catálogo de datos" },
    {
      type: "paragraph",
      text:
        "AWS Glue es un servicio de integración de datos serverless que facilita descubrir, preparar y combinar datos para analítica. Tiene dos piezas centrales: el Glue Data Catalog, un metastore que almacena las definiciones de tablas (esquema y ubicación en S3) compartido por Athena, EMR y Redshift Spectrum; y los trabajos de ETL (jobs) que extraen, transforman y cargan datos. Los crawlers de Glue recorren tus datos en S3, infieren el esquema y pueblan automáticamente el catálogo.",
    },
    {
      type: "list",
      ordered: true,
      items: [
        "Un crawler de Glue inspecciona los datos en S3 e infiere su esquema (columnas y tipos).",
        "El esquema inferido se registra como una tabla en el Glue Data Catalog.",
        "Athena, EMR y Redshift Spectrum consultan esas tablas del catálogo sin redefinir el esquema.",
        "Los jobs de ETL de Glue transforman los datos (limpieza, formato, enriquecimiento) y los escriben de vuelta en S3.",
      ],
    },
    {
      type: "code",
      lang: "bash",
      title: "Iniciar un crawler de AWS Glue para poblar el Data Catalog",
      code: `# El crawler recorre los datos en S3, infiere el esquema y crea/actualiza
# las tablas correspondientes en el Glue Data Catalog.
aws glue start-crawler \\
  --name crawler-ventas \\
  --region us-east-2`,
    },
    {
      type: "callout",
      variant: "success",
      text:
        "El Glue Data Catalog es el punto de encuentro de la analítica en AWS: defines el esquema una vez y lo reutilizan Athena, EMR y Redshift Spectrum. Catalogar bien tus datos evita duplicar definiciones de tablas en cada motor.",
    },
    { type: "heading", level: 2, text: "¿Cuándo usar Athena y cuándo Glue?" },
    {
      type: "list",
      items: [
        "Usa Athena para consultas SQL ad hoc e interactivas sobre datos que ya están en S3, sin montar infraestructura.",
        "Usa Glue para preparar y transformar datos (ETL) y para mantener el catálogo de esquemas que consumen los demás motores.",
        "Se complementan: un job de Glue limpia y convierte los datos a Parquet, un crawler los cataloga y Athena los consulta de forma eficiente.",
      ],
    },
    { type: "heading", level: 2, text: "Servicios de esta lección" },
    {
      type: "serviceIcon",
      items: [
        { service: "Amazon S3", icon: "storage-s3" },
        { service: "Amazon Athena", icon: "analytics-athena" },
        { service: "AWS Glue", icon: "analytics-glue" },
      ],
    },
  ],
  selfCheck: [
    {
      question:
        "¿Qué describe mejor a Amazon Athena dentro de un lago de datos sobre Amazon S3?",
      options: [
        "Un almacén de datos (data warehouse) con clústeres de nodos que se aprovisionan y administran",
        "Un motor de consultas SQL serverless que lee datos directamente desde S3 y cobra por los datos escaneados",
        "Un servicio de ETL que transforma datos y los carga en una base relacional",
        "Un sistema de archivos distribuido que reemplaza a S3",
      ],
      correctIndex: 1,
      explanation:
        "Athena es serverless: no administras servidores, ejecutas SQL estándar directamente sobre los datos de S3 y pagas por la cantidad de datos escaneados en cada consulta. Usa el Glue Data Catalog como metastore.",
    },
    {
      question:
        "¿Cuál es la función principal del Glue Data Catalog?",
      options: [
        "Ejecutar las consultas SQL interactivas que lanzan los usuarios",
        "Almacenar físicamente los datos del lago en lugar de S3",
        "Servir como metastore con las definiciones de tablas (esquema y ubicación) compartidas por Athena, EMR y Redshift Spectrum",
        "Aprovisionar clústeres de big data bajo demanda",
      ],
      correctIndex: 2,
      explanation:
        "El Glue Data Catalog es un metastore central: guarda los esquemas y la ubicación en S3 de las tablas. Athena, EMR y Redshift Spectrum lo consultan para conocer los datos sin redefinir el esquema en cada motor.",
    },
  ],
};
