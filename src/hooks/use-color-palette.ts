import { ColorPaletteContext } from "@/lib/color-palette-context";
import { useContext } from "react";

export function useColorPalette() {
  const ctx = useContext(ColorPaletteContext);
  if (!ctx) {
    throw new Error("useColorPalette must be used within ColorPaletteProvider");
  }
  return ctx;
}
