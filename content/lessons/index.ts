// Catálogo_Lecciones del Curso_AWS.
//
// Punto único de acceso al contenido del curso: expone el arreglo `sections`
// (las 17 Capas_Temáticas), el arreglo `lessons` (las 36 Lecciones) y los
// helpers de navegación. Clonado del Curso_Referencia
// (curso-clean-code-solid-testing/content/lessons/index.ts) y adaptado al
// temario AWS con iconografía de capa (Req 11.1).
//
// Trazabilidad: Req 1.3, 2.1–2.8, 11.1.

import type { ContentBlock, CourseSection, IconId, Lesson } from "@/lib/types";
import { PLACEHOLDER_ICON, resolveIcon } from "@/lib/iconCatalog";
import { day01 } from "./day-01";
import { day02 } from "./day-02";
import { day03 } from "./day-03";
import { day04 } from "./day-04";
import { day05 } from "./day-05";
import { day06 } from "./day-06";
import { day07 } from "./day-07";
import { day08 } from "./day-08";
import { day09 } from "./day-09";
import { day10 } from "./day-10";
import { day11 } from "./day-11";
import { day12 } from "./day-12";
import { day13 } from "./day-13";
import { day14 } from "./day-14";
import { day15 } from "./day-15";
import { day16 } from "./day-16";
import { day17 } from "./day-17";
import { day18 } from "./day-18";
import { day19 } from "./day-19";
import { day20 } from "./day-20";
import { day21 } from "./day-21";
import { day22 } from "./day-22";
import { day23 } from "./day-23";
import { day24 } from "./day-24";
import { day25 } from "./day-25";
import { day26 } from "./day-26";
import { day27 } from "./day-27";
import { day28 } from "./day-28";
import { day29 } from "./day-29";
import { day30 } from "./day-30";
import { day31 } from "./day-31";
import { day32 } from "./day-32";
import { day33 } from "./day-33";
import { day34 } from "./day-34";
import { day35 } from "./day-35";
import { day36 } from "./day-36";

// ─────────────────────────────────────────────────────────────────────────
// Capas_Temáticas (sections) — 17 entradas EXACTAS según design.md.
//
// Cada entrada define el `title` (coincide carácter por carácter con el
// `section` de sus Lecciones — Req 2.7), el `dayRange` contiguo y disjunto
// que cubre `day` 1..36 sin huecos ni solapamientos (Req 2.5, 2.6), y el
// `icon` con el id de capa resuelto por el Catálogo_Iconos (Req 11.1).
//
// Niveles (Req 2.1–2.4, 2.8):
//   BÁSICO    → capas 1–4  (day 1–11)
//   MEDIO     → capas 5–9  (day 12–24)
//   AVANZADO  → capas 10–17 (day 25–36)
// ─────────────────────────────────────────────────────────────────────────
export const sections: CourseSection[] = [
  // ── Nivel BÁSICO ─────────────────────────────────────────────────────
  { title: "Fundamentos de AWS", dayRange: [1, 3], icon: "layer-fundamentos" },
  { title: "Cómputo", dayRange: [4, 6], icon: "layer-computo" },
  {
    title: "Almacenamiento y Bases de Datos",
    dayRange: [7, 9],
    icon: "layer-almacenamiento-bases-datos",
  },
  { title: "Contenedores a fondo", dayRange: [10, 11], icon: "layer-contenedores" },
  // ── Nivel MEDIO ──────────────────────────────────────────────────────
  { title: "Redes y Conectividad", dayRange: [12, 14], icon: "layer-redes-conectividad" },
  { title: "Seguridad", dayRange: [15, 17], icon: "layer-seguridad" },
  {
    title: "Monitoreo y Observabilidad",
    dayRange: [18, 20],
    icon: "layer-monitoreo-observabilidad",
  },
  { title: "Edge y Protección", dayRange: [21, 22], icon: "layer-edge-proteccion" },
  {
    title: "Mensajería y Arquitecturas Orientadas a Eventos",
    dayRange: [23, 24],
    icon: "layer-mensajeria-eventos",
  },
  // ── Nivel AVANZADO ───────────────────────────────────────────────────
  {
    title: "DevOps y Automatización",
    dayRange: [25, 26],
    icon: "layer-devops-automatizacion",
  },
  { title: "Analítica y Datos", dayRange: [27, 28], icon: "layer-analitica-datos" },
  {
    title: "Arquitectura y Buenas Prácticas",
    dayRange: [29, 30],
    icon: "layer-arquitectura-buenas-practicas",
  },
  {
    title: "Inteligencia Artificial y Machine Learning",
    dayRange: [31, 32],
    icon: "layer-ia-ml",
  },
  { title: "Costos y FinOps", dayRange: [33, 33], icon: "layer-costos-finops" },
  {
    title: "Gobernanza Multi-Cuenta",
    dayRange: [34, 34],
    icon: "layer-gobernanza-multicuenta",
  },
  {
    title: "Migración y Recuperación ante Desastres",
    dayRange: [35, 35],
    icon: "layer-migracion-dr",
  },
  {
    title: "Developer Tooling e Infraestructura como Código Moderna",
    dayRange: [36, 36],
    icon: "layer-developer-tooling-iac",
  },
];

// ─────────────────────────────────────────────────────────────────────────
// Lecciones (lessons) — 36 Lecciones (day 1..36).
//
// TODO (tareas 10–13): poblar este arreglo con las 36 Lecciones a medida que
// se creen los archivos `day-01.ts` .. `day-36.ts`. Al completar la tarea 10
// (primeras lecciones) este arreglo debe reemplazarse por los imports:
//
//   import { day01 } from "./day-01";
//   ...
//   import { day36 } from "./day-36";
//
//   export const lessons: Lesson[] = [day01, day02, ..., day36];
//
// Mientras los archivos day-XX.ts no existan, se deja el arreglo vacío con el
// tipo correcto (Lesson[]) para que el módulo exporte `totalLessons` y demás
// símbolos sin romper la compilación (`tsc --noEmit`) ni a `useProgress`.
// ─────────────────────────────────────────────────────────────────────────
export const lessons: Lesson[] = [
  day01, day02, day03, day04, day05, day06, day07, day08, day09, day10,
  day11, day12, day13, day14, day15, day16, day17, day18, day19, day20,
  day21, day22, day23, day24, day25, day26, day27, day28, day29, day30,
  day31, day32, day33, day34, day35, day36,
];

export function getLessonByDay(day: number): Lesson | undefined {
  return lessons.find((lesson) => lesson.day === day);
}

export function getLessonBySlug(slug: string): Lesson | undefined {
  return lessons.find((lesson) => lesson.slug === slug);
}

export function getNextLesson(day: number): Lesson | undefined {
  return getLessonByDay(day + 1);
}

export function getPreviousLesson(day: number): Lesson | undefined {
  return getLessonByDay(day - 1);
}

export const totalLessons = lessons.length;

// ─────────────────────────────────────────────────────────────────────────
// Validación del catálogo (Punto único de verificación)
//
// `assertCatalog()` concentra TODAS las invariantes estructurales del
// Catálogo_Lecciones y se ejecuta al cargar el módulo (ver llamada al final).
// Si alguna invariante se viola, lanza un Error descriptivo que aborta la
// construcción de la Ruta_Aprendizaje: como este módulo se importa desde las
// rutas (`app/curso/**`), un catálogo inválido rompe `next build` en lugar de
// llegar a producción (design.md → Error Handling; Req 10).
//
// IMPORTANTE sobre el estado temporal del catálogo:
//   Mientras `lessons` esté vacío (las 36 Lecciones se crean en las tareas
//   10–13), `assertCatalog()` DEBE pasar sin lanzar. Un catálogo con 0
//   Lecciones es temporalmente válido:
//     - Unicidad de slug/day: trivialmente cierta sobre el conjunto vacío.
//     - Consecutividad: la regla "el conjunto de days == {1..lessons.length}"
//       con 0 Lecciones produce el conjunto vacío == conjunto vacío → válida.
//   Por eso NO se valida aquí `lessons.length === 36`: eso rompería hasta que
//   existan las 36 Lecciones. Cuando las 36 Lecciones existan (days 1..36),
//   la regla de consecutividad obligará a que los days sean exactamente
//   1..36 y, combinada con la contigüidad de `dayRange` (que ya cubre [1,36]),
//   quedará garantizada la cobertura total de los dayRange sobre 1..36
//   (Req 2.6).
//
// Trazabilidad: Req 2.6, 2.7, 2.8, 2.9, 4.8, 4.9, 11.5.
// ─────────────────────────────────────────────────────────────────────────

/**
 * Verifica que un IconId resuelva a una entrada REAL del Catálogo_Iconos
 * (distinta del placeholder). Un icono `undefined` se considera ausente
 * (no referencia nada) y no se valida aquí; la integridad referencial
 * (Req 11.5) solo exige que todo id *presente* resuelva a una entrada real.
 */
function iconResolvesToRealEntry(id: IconId | undefined): boolean {
  if (id === undefined) return true;
  return resolveIcon(id) !== PLACEHOLDER_ICON;
}

/**
 * Valida todas las invariantes estructurales del Catálogo_Lecciones.
 *
 * Lanza un Error descriptivo (sin producir una Ruta_Aprendizaje parcial) ante
 * la primera invariante violada. Es idempotente y de solo lectura: no muta
 * `lessons` ni `sections`.
 */
export function assertCatalog(): void {
  // ── Req 11.5: integridad referencial de los iconos de `sections` ───────
  // Todo `section.icon` presente debe resolver a una entrada real.
  for (const section of sections) {
    if (!iconResolvesToRealEntry(section.icon)) {
      throw new Error(
        `[Catálogo_Lecciones] Icono de capa inválido: la section "${section.title}" ` +
          `referencia el icono "${section.icon}" que no existe en el Catálogo_Iconos ` +
          `(resuelve al placeholder). Req 11.5.`,
      );
    }
  }

  // ── Req 4.8: unicidad de `slug` entre todas las Lecciones ──────────────
  const seenSlugs = new Set<string>();
  for (const lesson of lessons) {
    if (seenSlugs.has(lesson.slug)) {
      throw new Error(
        `[Catálogo_Lecciones] slug duplicado: "${lesson.slug}" (day ${lesson.day}). ` +
          `Cada Lección debe tener un slug único. Req 4.8.`,
      );
    }
    seenSlugs.add(lesson.slug);
  }

  // ── Req 4.9: `day` únicos y consecutivos sin huecos ────────────────────
  // El conjunto de days debe ser EXACTAMENTE {1, 2, ..., lessons.length}.
  // Con 0 Lecciones ambos conjuntos son vacíos → válido (estado temporal).
  const seenDays = new Set<number>();
  for (const lesson of lessons) {
    if (seenDays.has(lesson.day)) {
      throw new Error(
        `[Catálogo_Lecciones] day duplicado: ${lesson.day} (slug "${lesson.slug}"). ` +
          `Cada Lección debe tener un day único. Req 4.9.`,
      );
    }
    seenDays.add(lesson.day);
  }
  for (let expected = 1; expected <= lessons.length; expected += 1) {
    if (!seenDays.has(expected)) {
      throw new Error(
        `[Catálogo_Lecciones] secuencia de days con huecos: falta el day ${expected}. ` +
          `Los days deben formar la secuencia consecutiva 1..${lessons.length} ` +
          `sin huecos ni duplicados. Req 4.9.`,
      );
    }
  }

  // ── Req 2.6: `dayRange` de `sections` contiguos, disjuntos y bien formados.
  // Validez por entrada (inicio <= fin) y contigüidad global (fin_i + 1 ==
  // inicio_{i+1}) sobre las sections ordenadas por su inicio de rango.
  const orderedSections = [...sections].sort(
    (a, b) => a.dayRange[0] - b.dayRange[0],
  );
  for (const section of orderedSections) {
    const [start, end] = section.dayRange;
    if (start > end) {
      throw new Error(
        `[Catálogo_Lecciones] dayRange inválido en la section "${section.title}": ` +
          `[${start}, ${end}] con inicio > fin. Req 2.6.`,
      );
    }
  }
  for (let i = 1; i < orderedSections.length; i += 1) {
    const prev = orderedSections[i - 1];
    const curr = orderedSections[i];
    if (prev.dayRange[1] + 1 !== curr.dayRange[0]) {
      throw new Error(
        `[Catálogo_Lecciones] dayRange no contiguos entre "${prev.title}" ` +
          `([${prev.dayRange[0]}, ${prev.dayRange[1]}]) y "${curr.title}" ` +
          `([${curr.dayRange[0]}, ${curr.dayRange[1]}]): se esperaba que el siguiente ` +
          `inicio fuera ${prev.dayRange[1] + 1}. Deben ser contiguos y disjuntos. Req 2.6.`,
      );
    }
  }

  // ── Req 2.7 / 2.9: cada `lesson.section` coincide carácter por carácter con
  // el `title` de EXACTAMENTE una entrada de `sections`. Si no coincide, se
  // lanza un error que identifica slug, day y el valor section ofensor, sin
  // producir una Ruta_Aprendizaje parcial.
  //
  // ── Req 2.6 (cierre): además, cada `day` debe caer dentro del dayRange de la
  // section cuyo title coincide con su `section`.
  for (const lesson of lessons) {
    const matches = sections.filter((s) => s.title === lesson.section);
    if (matches.length !== 1) {
      throw new Error(
        `[Catálogo_Lecciones] section no coincidente: la Lección slug "${lesson.slug}" ` +
          `(day ${lesson.day}) declara section "${lesson.section}", que coincide con ` +
          `${matches.length} entradas de \`sections\` (se requiere exactamente 1, ` +
          `coincidencia carácter por carácter). Req 2.7, 2.9.`,
      );
    }
    const [start, end] = matches[0].dayRange;
    if (lesson.day < start || lesson.day > end) {
      throw new Error(
        `[Catálogo_Lecciones] day fuera de rango: la Lección slug "${lesson.slug}" ` +
          `(day ${lesson.day}) pertenece a la section "${lesson.section}" cuyo dayRange ` +
          `es [${start}, ${end}]; el day debe caer dentro de ese rango. Req 2.6.`,
      );
    }
  }

  // ── Req 2.8: `day` estrictamente creciente en el orden del arreglo ─────
  // (orden estricto; la separación por Niveles se garantiza por los dayRange
  // de las sections ya validados).
  for (let i = 1; i < lessons.length; i += 1) {
    if (lessons[i].day <= lessons[i - 1].day) {
      throw new Error(
        `[Catálogo_Lecciones] orden de days no estrictamente creciente: ` +
          `day ${lessons[i - 1].day} (slug "${lessons[i - 1].slug}") seguido de ` +
          `day ${lessons[i].day} (slug "${lessons[i].slug}"). Req 2.8.`,
      );
    }
  }

  // ── Req 11.5: integridad referencial de los iconos de las Lecciones ────
  // `lesson.icon` y todo `items.icon` de un Bloque_Icono (serviceIcon) deben
  // resolver a una entrada real del Catálogo_Iconos.
  for (const lesson of lessons) {
    if (!iconResolvesToRealEntry(lesson.icon)) {
      throw new Error(
        `[Catálogo_Lecciones] Icono de Lección inválido: la Lección slug "${lesson.slug}" ` +
          `(day ${lesson.day}) referencia el icono "${lesson.icon}" que no existe en el ` +
          `Catálogo_Iconos (resuelve al placeholder). Req 11.5.`,
      );
    }
    for (const block of lesson.blocks) {
      if ((block as ContentBlock).type !== "serviceIcon") continue;
      const serviceIconBlock = block as Extract<
        ContentBlock,
        { type: "serviceIcon" }
      >;
      for (const item of serviceIconBlock.items) {
        if (!iconResolvesToRealEntry(item.icon)) {
          throw new Error(
            `[Catálogo_Lecciones] Icono de servicio inválido: la Lección slug ` +
              `"${lesson.slug}" (day ${lesson.day}) contiene un Bloque_Icono con el ` +
              `servicio "${item.service}" que referencia el icono "${item.icon}", ` +
              `inexistente en el Catálogo_Iconos (resuelve al placeholder). Req 11.5.`,
          );
        }
      }
    }
  }
}

// Ejecución al cargar el módulo: un catálogo inválido rompe `next build`
// (design.md → Error Handling; Req 10) en lugar de llegar a producción.
assertCatalog();
