// src/main.tsx
import { queryClient } from "@/lib/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "@/i18n";
import App from "./App";
import { ColorPaletteProvider } from "./components/ui/color-palette-provider";
import { ThemeProvider } from "./components/ui/theme-provider";
import "./global.css";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ColorPaletteProvider>
        <BrowserRouter>
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
        </BrowserRouter>
      </ColorPaletteProvider>
    </ThemeProvider>
  </React.StrictMode>
);
