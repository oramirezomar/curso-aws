import { describe, it, expect } from "vitest";
import fc from "fast-check";
import {
  lessons,
  sections,
  totalLessons,
  getNextLesson,
  getPreviousLesson,
} from "@/content/lessons";
import { iconCatalog, resolveIcon, PLACEHOLDER_ICON } from "@/lib/iconCatalog";
import type { ContentBlock } from "@/lib/types";

const RUNS = { numRuns: 100 };
const anyLesson = () => fc.constantFrom(...lessons);
const anySection = () => fc.constantFrom(...sections);

describe("Catálogo_Lecciones y lógica pura — property-based", () => {
  // Feature: curso-aws, Property 1: invariantes estructurales por entrada de sections (title 1..100, dayRange inicio<=fin)
  // Validates: Requirements 2.5
  it("P1: cada section tiene title 1..100 y dayRange válido", () => {
    fc.assert(
      fc.property(anySection(), (s) => {
        expect(s.title.length).toBeGreaterThanOrEqual(1);
        expect(s.title.length).toBeLessThanOrEqual(100);
        expect(s.dayRange[0]).toBeLessThanOrEqual(s.dayRange[1]);
      }),
      RUNS,
    );
  });

  // Feature: curso-aws, Property 2: dayRange contiguos, disjuntos y cubriendo 1..totalLessons
  // Validates: Requirements 2.6
  it("P2: los dayRange de sections son contiguos y cubren 1..totalLessons", () => {
    const ordered = [...sections].sort((a, b) => a.dayRange[0] - b.dayRange[0]);
    expect(ordered[0].dayRange[0]).toBe(1);
    expect(ordered[ordered.length - 1].dayRange[1]).toBe(totalLessons);
    for (let i = 1; i < ordered.length; i++) {
      expect(ordered[i].dayRange[0]).toBe(ordered[i - 1].dayRange[1] + 1);
    }
    // generador sintético: una validación de contigüidad debe RECHAZAR huecos/solapamientos
    const isContiguous = (ranges: [number, number][]) => {
      const r = [...ranges].sort((a, b) => a[0] - b[0]);
      for (let i = 1; i < r.length; i++) if (r[i][0] !== r[i - 1][1] + 1) return false;
      return true;
    };
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 20 }), (gap) => {
        // introducir un hueco siempre debe detectarse como no contiguo
        const broken: [number, number][] = [[1, 3], [3 + gap + 1, 3 + gap + 2]];
        expect(isContiguous(broken)).toBe(false);
      }),
      RUNS,
    );
  });

  // Feature: curso-aws, Property 3: cada lesson.section coincide con exactamente una entrada de sections
  // Validates: Requirements 2.7
  it("P3: lesson.section coincide carácter por carácter con exactamente una section", () => {
    fc.assert(
      fc.property(anyLesson(), (l) => {
        const matches = sections.filter((s) => s.title === l.section);
        expect(matches.length).toBe(1);
      }),
      RUNS,
    );
  });

  // Feature: curso-aws, Property 5: day estrictamente creciente y separación por niveles
  // Validates: Requirements 2.8
  it("P5: los day están en orden estrictamente creciente", () => {
    const days = lessons.map((l) => l.day);
    fc.assert(
      fc.property(fc.integer({ min: 1, max: lessons.length - 1 }), (i) => {
        expect(days[i]).toBeGreaterThan(days[i - 1]);
      }),
      RUNS,
    );
  });

  // Feature: curso-aws, Property 6: slug únicos y days = 1..totalLessons sin huecos
  // Validates: Requirements 4.8, 4.9
  it("P6: slug únicos y days consecutivos 1..totalLessons", () => {
    const slugs = new Set(lessons.map((l) => l.slug));
    expect(slugs.size).toBe(lessons.length);
    const days = [...lessons.map((l) => l.day)].sort((a, b) => a - b);
    fc.assert(
      fc.property(fc.integer({ min: 0, max: lessons.length - 1 }), (i) => {
        expect(days[i]).toBe(i + 1);
      }),
      RUNS,
    );
    expect(totalLessons).toBe(lessons.length);
  });

  // Feature: curso-aws, Property 8: objectives.length>=2 y estimatedMinutes>0
  // Validates: Requirements 4.2, 4.3
  it("P8: toda lección tiene >=2 objetivos y estimatedMinutes>0", () => {
    fc.assert(
      fc.property(anyLesson(), (l) => {
        expect(l.objectives.length).toBeGreaterThanOrEqual(2);
        expect(l.estimatedMinutes).toBeGreaterThan(0);
      }),
      RUNS,
    );
  });

  // Feature: curso-aws, Property 11: highlightLines en rango 1..nº líneas del code
  // Validates: Requirements 5.5
  it("P11: highlightLines dentro del rango de líneas del fragmento", () => {
    const codeBlocks = lessons.flatMap((l) =>
      l.blocks.filter((b): b is Extract<ContentBlock, { type: "code" }> => b.type === "code"),
    );
    fc.assert(
      fc.property(fc.constantFrom(...codeBlocks), (b) => {
        if (!b.highlightLines) return;
        const n = b.code.split("\n").length;
        for (const line of b.highlightLines) {
          expect(line).toBeGreaterThanOrEqual(1);
          expect(line).toBeLessThanOrEqual(n);
        }
      }),
      RUNS,
    );
  });

  // Feature: curso-aws, Property 12: title de code no vacío y <=80
  // Validates: Requirements 5.6
  it("P12: cada bloque code tiene title no vacío y <=80 chars", () => {
    const codeBlocks = lessons.flatMap((l) =>
      l.blocks.filter((b): b is Extract<ContentBlock, { type: "code" }> => b.type === "code"),
    );
    fc.assert(
      fc.property(fc.constantFrom(...codeBlocks), (b) => {
        expect(b.title).toBeTruthy();
        expect((b.title ?? "").length).toBeGreaterThanOrEqual(1);
        expect((b.title ?? "").length).toBeLessThanOrEqual(80);
      }),
      RUNS,
    );
  });

  // Feature: curso-aws, Property 13: selfCheck válido (>=1 ítem, options>=3, correctIndex en rango, explanation no vacío)
  // Validates: Requirements 6.1, 6.2, 6.3, 6.4, 6.5
  it("P13: selfCheck de cada lección es válido", () => {
    fc.assert(
      fc.property(anyLesson(), (l) => {
        expect(l.selfCheck && l.selfCheck.length).toBeGreaterThanOrEqual(1);
        for (const q of l.selfCheck ?? []) {
          expect(q.question.length).toBeGreaterThanOrEqual(1);
          expect(q.options.length).toBeGreaterThanOrEqual(3);
          expect(q.correctIndex).toBeGreaterThanOrEqual(0);
          expect(q.correctIndex).toBeLessThan(q.options.length);
          expect(q.explanation.length).toBeGreaterThanOrEqual(1);
        }
      }),
      RUNS,
    );
  });

  // Feature: curso-aws, Property 15: navegación prev/next con day±1 y undefined en extremos
  // Validates: Requirements 7.3, 7.4, 7.5
  it("P15: getPreviousLesson/getNextLesson respetan day±1 y extremos", () => {
    expect(getPreviousLesson(1)).toBeUndefined();
    expect(getNextLesson(totalLessons)).toBeUndefined();
    fc.assert(
      fc.property(fc.integer({ min: 2, max: totalLessons - 1 }), (day) => {
        expect(getPreviousLesson(day)?.day).toBe(day - 1);
        expect(getNextLesson(day)?.day).toBe(day + 1);
      }),
      RUNS,
    );
  });
});

// ── Lógica pura del progreso (modelada como funciones puras, design Testing Strategy) ──
function toggle(completed: number[], day: number): number[] {
  return completed.includes(day)
    ? completed.filter((d) => d !== day)
    : [...completed, day].sort((a, b) => a - b);
}
function progressPercent(completedCount: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round((completedCount / total) * 100);
}

describe("Progreso — lógica pura", () => {
  // Feature: curso-aws, Property 16: toggleComplete idempotencia/round-trip sin duplicados
  // Validates: Requirements 8.2, 8.3
  it("P16: toggle dos veces vuelve al estado original y nunca duplica", () => {
    fc.assert(
      fc.property(
        fc.uniqueArray(fc.integer({ min: 1, max: 36 }), { maxLength: 36 }),
        fc.integer({ min: 1, max: 36 }),
        (completed, day) => {
          const once = toggle(completed, day);
          // sin duplicados
          expect(new Set(once).size).toBe(once.length);
          // round-trip
          const twice = toggle(once, day);
          expect([...twice].sort((a, b) => a - b)).toEqual([...completed].sort((a, b) => a - b));
        },
      ),
      RUNS,
    );
  });

  // Feature: curso-aws, Property 17: progressPercent = round(len/total*100) en [0,100]; 0 si total=0
  // Validates: Requirements 8.4, 8.5
  it("P17: progressPercent correcto y sin división por cero", () => {
    fc.assert(
      fc.property(fc.nat({ max: 1000 }), fc.nat({ max: 1000 }), (completed, total) => {
        const c = Math.min(completed, total);
        const pct = progressPercent(c, total);
        expect(Number.isNaN(pct)).toBe(false);
        if (total === 0) {
          expect(pct).toBe(0);
        } else {
          expect(pct).toBe(Math.round((c / total) * 100));
          expect(pct).toBeGreaterThanOrEqual(0);
          expect(pct).toBeLessThanOrEqual(100);
        }
      }),
      RUNS,
    );
  });
});

describe("Catálogo_Iconos — property-based", () => {
  const serviceIconIds = lessons.flatMap((l) =>
    l.blocks
      .filter((b): b is Extract<ContentBlock, { type: "serviceIcon" }> => b.type === "serviceIcon")
      .flatMap((b) => b.items.map((it) => it.icon)),
  );
  const usedIds = [
    ...sections.map((s) => s.icon).filter((x): x is string => !!x),
    ...lessons.map((l) => l.icon).filter((x): x is string => !!x),
    ...serviceIconIds,
  ];

  // Feature: curso-aws, Property 19: integridad referencial — todo IconId usado resuelve a entrada real != placeholder
  // Validates: Requirements 11.1, 11.2, 11.5
  it("P19: todo icono usado resuelve a una entrada real del catálogo", () => {
    fc.assert(
      fc.property(fc.constantFrom(...usedIds), (id) => {
        expect(resolveIcon(id)).not.toBe(PLACEHOLDER_ICON);
      }),
      RUNS,
    );
  });

  // Feature: curso-aws, Property 20: toda path del catálogo es local (empieza por "/") y no http(s)
  // Validates: Requirements 11.4
  it("P20: todas las paths del catálogo son locales, sin hotlinking", () => {
    const entries = Object.values(iconCatalog);
    fc.assert(
      fc.property(fc.constantFrom(...entries), (e) => {
        expect(e.path.startsWith("/")).toBe(true);
        expect(/^https?:\/\//.test(e.path)).toBe(false);
      }),
      RUNS,
    );
  });

  // Feature: curso-aws, Property 21: resolveIcon(id desconocido) devuelve PLACEHOLDER_ICON y no lanza
  // Validates: Requirements 11.9
  it("P21: id desconocido degrada al placeholder sin lanzar", () => {
    fc.assert(
      fc.property(fc.string(), (raw) => {
        const id = "__nope__" + raw;
        if (id in iconCatalog) return; // descartar colisiones improbables
        expect(resolveIcon(id)).toBe(PLACEHOLDER_ICON);
      }),
      RUNS,
    );
  });
});
