// Componente AwsIcon del Curso_AWS.
//
// Resuelve un identificador estable (IconId) contra el Catálogo_Iconos y
// renderiza el SVG local correspondiente como un asset bajo /public.
//
// Es un componente de servidor simple (no usa hooks ni estado), por lo que no
// requiere la directiva "use client".
//
// Reglas conforme al design.md y a los Requisitos 11.6, 11.8, 11.9, 11.10:
//  - Preserva la relación de aspecto original: tamaño cuadrado uniforme por
//    `size` (width === height) y `objectFit: "contain"`. NO aplica transform
//    (rotate/scale no uniforme), ni clip-path, ni recorte (Req 11.6, términos
//    de marca de AWS).
//  - Texto alternativo accesible SIEMPRE no vacío: usa `label` y, si viniera
//    vacío, cae al `defaultLabel` de la entrada resuelta (Req 11.10).
//  - Degradación controlada: `resolveIcon` ya devuelve el PLACEHOLDER_ICON para
//    ids inexistentes, por lo que el componente nunca lanza (Req 11.9).
//  - No añade logotipos de aval ni disposición que sugiera patrocinio de AWS
//    (Req 11.8).

import { resolveIcon } from "../lib/iconCatalog";

interface AwsIconProps {
  id: string; // identificador estable del Catálogo_Iconos
  label: string; // nombre del servicio o capa (accesibilidad)
  size?: number; // px; por defecto 32 — escala uniforme
  className?: string;
}

export default function AwsIcon({ id, label, size = 32, className }: AwsIconProps) {
  const entry = resolveIcon(id);
  // El alt/aria-label nunca debe quedar vacío (Req 11.10).
  const alt = label.trim() ? label : entry.defaultLabel;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={entry.path}
      alt={alt}
      width={size}
      height={size}
      className={className}
      // Tamaño cuadrado uniforme + contain: preserva aspect-ratio sin recortar,
      // voltear, rotar ni distorsionar (Req 11.6).
      style={{ objectFit: "contain" }}
    />
  );
}
