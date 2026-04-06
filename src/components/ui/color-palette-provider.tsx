import {
  applyColorPaletteToDocument,
  type ColorPaletteId,
  persistColorPalette,
  readStoredColorPalette,
} from "@/lib/color-palette";
import { ColorPaletteContext } from "@/lib/color-palette-context";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export function ColorPaletteProvider({ children }: { children: ReactNode }) {
  const [palette, setPaletteState] = useState<ColorPaletteId>("brand");

  useEffect(() => {
    const stored = readStoredColorPalette();
    applyColorPaletteToDocument(stored);
    setPaletteState(stored);
  }, []);

  const setPalette = useCallback((id: ColorPaletteId) => {
    applyColorPaletteToDocument(id);
    persistColorPalette(id);
    setPaletteState(id);
  }, []);

  const value = useMemo(
    () => ({ palette, setPalette }),
    [palette, setPalette],
  );

  return (
    <ColorPaletteContext.Provider value={value}>
      {children}
    </ColorPaletteContext.Provider>
  );
}
