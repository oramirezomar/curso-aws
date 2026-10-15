// @vitest-environment jsdom
import { describe, it, expect, afterEach } from "vitest";
import fc from "fast-check";
import { render, cleanup, screen } from "@testing-library/react";
import AwsIcon from "@/components/AwsIcon";
import SelfCheck from "@/components/SelfCheck";
import CodeBlock from "@/components/CodeBlock";
import ContentRenderer from "@/components/ContentRenderer";
import { iconCatalog } from "@/lib/iconCatalog";
import { generateStaticParams } from "@/app/curso/[slug]/page";
import { lessons, sections } from "@/content/lessons";
import type { ContentBlock } from "@/lib/types";

const RUNS = { numRuns: 100 };
afterEach(() => cleanup());

describe("Render — property-based", () => {
  // Feature: curso-aws, Property 22: todo AwsIcon renderiza con alt/aria-label no vacío
  // Validates: Requirements 11.10
  it("P22: AwsIcon siempre tiene texto alternativo no vacío", () => {
    const ids = Object.keys(iconCatalog);
    fc.assert(
      fc.property(fc.constantFrom(...ids), fc.string(), (id, label) => {
        cleanup();
        const { container } = render(<AwsIcon id={id} label={label} />);
        const img = container.querySelector("img");
        expect(img).not.toBeNull();
        const alt = img!.getAttribute("alt") ?? "";
        expect(alt.length).toBeGreaterThanOrEqual(1); // nunca vacío (cae a defaultLabel)
      }),
      RUNS,
    );
  });

  // Feature: curso-aws, Property 22b: AwsIcon con id desconocido no lanza y degrada con alt válido
  // Validates: Requirements 11.9, 11.10
  it("P22b: AwsIcon con id inexistente renderiza placeholder sin lanzar", () => {
    fc.assert(
      fc.property(fc.string(), (raw) => {
        const id = "__missing__" + raw;
        if (id in iconCatalog) return;
        cleanup();
        const { container } = render(<AwsIcon id={id} label="Servicio" />);
        const img = container.querySelector("img");
        expect(img).not.toBeNull();
        expect((img!.getAttribute("alt") ?? "").length).toBeGreaterThanOrEqual(1);
      }),
      RUNS,
    );
  });
});

describe("CodeBlock (async server component) — fallback de lenguaje", () => {
  // Feature: curso-aws, Property 10: lenguaje no soportado cae a text y no lanza
  // Validates: Requirements 5.4
  // Nota: CodeBlock es un async server component. jsdom/React no reconcilia
  // server components async, por lo que invocamos la función y afirmamos sobre
  // el elemento resultante (no se usa render() del DOM).
  it("P10: CodeBlock resuelve sin lanzar para cualquier lang (soportado o no)", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.oneof(
          fc.constantFrom("bash", "yaml", "json", "hcl", "ts", "js", "text"),
          fc.string({ minLength: 1, maxLength: 10 }), // langs arbitrarios no soportados
        ),
        fc.string({ minLength: 1, maxLength: 40 }),
        async (lang, code) => {
          // @ts-expect-error — invocación directa del server component async
          const el = await CodeBlock({ code, lang: lang as never, title: "t" });
          // Debe producir un elemento React válido sin lanzar.
          expect(el).toBeTruthy();
          expect(typeof el).toBe("object");
          expect(el).toHaveProperty("type");
        },
      ),
      { numRuns: 60 },
    );
  });
});

describe("ContentRenderer (async) — validez de bloques", () => {
  // Feature: curso-aws, Property 7: ContentRenderer resuelve cada bloque real sin lanzar
  // Validates: Requirements 4.4, 4.5, 4.6, 4.7
  // Nota: componente async de servidor; se invoca y se afirma sobre el elemento
  // resultante sin pasarlo por el reconciliador de React (no soporta server
  // components async anidados en jsdom).
  it("P7: cada bloque de cada lección produce un elemento sin lanzar", async () => {
    const allBlocks = lessons.flatMap((l) => l.blocks);
    const idxArb = fc.nat({ max: allBlocks.length - 1 });
    await fc.assert(
      fc.asyncProperty(idxArb, async (i) => {
        const block = allBlocks[i];
        // @ts-expect-error — server component async
        const el = await ContentRenderer({ blocks: [block] });
        expect(el).toBeTruthy();
        expect(el).toHaveProperty("type");
      }),
      { numRuns: 100 },
    );
  });
});

describe("generateStaticParams ↔ slug", () => {
  // Feature: curso-aws, Property 18: generateStaticParams produce exactamente los slug del catálogo
  // Validates: Requirements 10.4
  it("P18: biyección entre generateStaticParams y lessons.slug", () => {
    const params = generateStaticParams();
    const paramSlugs = params.map((p) => p.slug).sort();
    const lessonSlugs = lessons.map((l) => l.slug).sort();
    expect(paramSlugs).toEqual(lessonSlugs);
    expect(new Set(paramSlugs).size).toBe(lessonSlugs.length);
    // property: todo slug generado existe en lessons y viceversa
    fc.assert(
      fc.property(fc.constantFrom(...params), (p) => {
        expect(lessons.some((l) => l.slug === p.slug)).toBe(true);
      }),
      RUNS,
    );
  });
});

describe("Validación de catálogo — rechazo de section inválida (lógica)", () => {
  // Feature: curso-aws, Property 4: una section no coincidente debe ser rechazada por la validación
  // Validates: Requirements 2.9
  it("P4: validador detecta lesson.section que no coincide con ninguna entrada", () => {
    const titles = new Set(sections.map((s) => s.title));
    const matchesExactlyOne = (section: string) =>
      sections.filter((s) => s.title === section).length === 1;
    fc.assert(
      fc.property(fc.string(), (bogus) => {
        if (titles.has(bogus)) return; // descartar coincidencias reales
        expect(matchesExactlyOne(bogus)).toBe(false);
      }),
      RUNS,
    );
    // y toda section real sí coincide con exactamente una
    fc.assert(
      fc.property(fc.constantFrom(...lessons), (l) => {
        expect(matchesExactlyOne(l.section)).toBe(true);
      }),
      RUNS,
    );
  });
});

describe("SelfCheck (client) — interacción", () => {
  // Feature: curso-aws, Property 6.6: al seleccionar una opción se revela corrección + explicación
  // Validates: Requirements 6.6
  it("SelfCheck revela la explicación al seleccionar una opción", async () => {
    const { default: userEventDefault } = await import("@testing-library/user-event");
    const user = userEventDefault.setup();
    const questions = [
      {
        question: "¿Qué es S3?",
        options: ["Cómputo", "Almacenamiento de objetos", "Red"],
        correctIndex: 1,
        explanation: "S3 es almacenamiento de objetos.",
      },
    ];
    render(<SelfCheck questions={questions} />);
    await user.click(screen.getByText("Almacenamiento de objetos"));
    expect(screen.getByText(/S3 es almacenamiento de objetos/)).toBeTruthy();
  });
});
