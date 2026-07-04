import { createContext, useContext, useState, useCallback } from "react";

const LayoutContext = createContext();

export function LayoutProvider({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleCollapse = useCallback(() => setSidebarCollapsed((v) => !v), []);

  return (
    <LayoutContext.Provider
      value={{
        sidebarCollapsed,
        toggleCollapse,
        setSidebarCollapsed,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  const ctx = useContext(LayoutContext);
  if (!ctx) throw new Error("useLayout debe usarse dentro de LayoutProvider");
  return ctx;
}
