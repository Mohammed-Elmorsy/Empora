'use client';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Theme initialization is handled by Zustand's onRehydrateStorage callback
  // No need for manual initialization here
  return <>{children}</>;
}
