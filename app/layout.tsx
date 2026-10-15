import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Curso AWS: Fundamentos a Arquitectura Avanzada",
  description:
    "Curso de autoestudio sobre Amazon Web Services, organizado en una ruta de aprendizaje de tres niveles (Básico, Medio y Avanzado) para avanzar a tu ritmo desde el celular o el escritorio.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
