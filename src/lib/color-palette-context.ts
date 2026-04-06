import { createContext } from "react";
import type { ColorPaletteId } from "@/lib/color-palette";

export type ColorPaletteContextValue = {
  palette: ColorPaletteId;
  setPalette: (id: ColorPaletteId) => void;
};

export const ColorPaletteContext =
  createContext<ColorPaletteContextValue | null>(null);
