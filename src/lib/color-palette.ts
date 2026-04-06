export type ColorPaletteId = "brand" | "mineral" | "terra";

export const COLOR_PALETTE_STORAGE_KEY = "geologiya-color-palette";

export function isColorPaletteId(value: string | null): value is ColorPaletteId {
  return value === "brand" || value === "mineral" || value === "terra";
}

export function applyColorPaletteToDocument(id: ColorPaletteId) {
  const root = document.documentElement;
  root.classList.remove("palette-mineral", "palette-terra");
  if (id === "mineral") root.classList.add("palette-mineral");
  if (id === "terra") root.classList.add("palette-terra");
}

export function readStoredColorPalette(): ColorPaletteId {
  try {
    const raw = localStorage.getItem(COLOR_PALETTE_STORAGE_KEY);
    if (raw && isColorPaletteId(raw)) return raw;
  } catch {
    /* ignore */
  }
  return "brand";
}

export function persistColorPalette(id: ColorPaletteId) {
  try {
    localStorage.setItem(COLOR_PALETTE_STORAGE_KEY, id);
  } catch {
    /* ignore */
  }
}
