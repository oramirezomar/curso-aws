// Modelo de contenido tipado. Cada lección es un array de "blocks",
// no un string de markdown, para tener control total del render.
//
// Clonado del Curso_Referencia (curso-clean-code-solid-testing/lib/types.ts)
// y extendido para el Curso_AWS con iconografía oficial de AWS y lenguajes
// de código adicionales (CLI / IaC).

// Identificador estable de icono resuelto por el Catálogo_Iconos.
export type IconId = string;

export type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; level: 2 | 3; text: string }
  | { type: "quote"; text: string; author?: string }
  | { type: "list"; ordered?: boolean; items: string[] }
  | {
      type: "code";
      // (Req 5.3) Lenguajes para CLI de AWS e Infraestructura como Código.
      lang: "js" | "ts" | "text" | "bash" | "yaml" | "json" | "hcl";
      title?: string;
      code: string;
      highlightLines?: number[];
    }
  | { type: "callout"; variant: "info" | "warning" | "success"; text: string }
  | {
      type: "comparison";
      before: { title: string; code: string };
      after: { title: string; code: string };
      lang?: "js" | "ts";
    }
  | { type: "checklist"; title?: string; items: string[] }
  // NUEVO — Bloque_Icono (Req 4.7, 11.3)
  | { type: "serviceIcon"; items: { service: string; icon: IconId }[] };

export interface Lesson {
  day: number;
  slug: string;
  title: string;
  section: string;
  estimatedMinutes: number;
  objectives: string[];
  blocks: ContentBlock[];
  icon?: IconId; // NUEVO — icono principal de la lección (Req 11.2)
  selfCheck?: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
}

export interface CourseSection {
  title: string;
  dayRange: [number, number];
  icon?: IconId; // NUEVO — icono de la capa temática (Req 11.1)
}

// Catálogo_Iconos
export interface IconEntry {
  id: IconId; // id estable (p. ej. "compute-ec2")
  path: string; // ruta local bajo /public (empieza por "/")
  defaultLabel: string; // nombre oficial del servicio/capa
}

export type IconCatalog = Record<IconId, IconEntry>;
