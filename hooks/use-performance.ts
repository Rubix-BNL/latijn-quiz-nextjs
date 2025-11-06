"use client";

import { useEffect } from "react";

/**
 * Performance monitoring hook
 * Meet en log belangrijke performance metrics
 */
export function usePerformance(componentName: string) {
  useEffect(() => {
    // Alleen in development mode
    if (process.env.NODE_ENV !== "development") return;

    // Meet component mount tijd
    const mountTime = performance.now();

    // Log Web Vitals
    if (typeof window !== "undefined" && "PerformanceObserver" in window) {
      try {
        // First Input Delay (FID)
        const fidObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            console.log(`[${componentName}] FID:`, entry);
          }
        });
        fidObserver.observe({ type: "first-input", buffered: true });

        // Largest Contentful Paint (LCP)
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          console.log(`[${componentName}] LCP:`, lastEntry);
        });
        lcpObserver.observe({ type: "largest-contentful-paint", buffered: true });

        return () => {
          fidObserver.disconnect();
          lcpObserver.disconnect();
        };
      } catch (e) {
        console.warn("Performance Observer niet ondersteund");
      }
    }

    return () => {
      const unmountTime = performance.now();
      const lifetime = unmountTime - mountTime;
      console.log(`[${componentName}] Component lifetime: ${lifetime.toFixed(2)}ms`);
    };
  }, [componentName]);
}

/**
 * Meet de executietijd van een functie
 */
export function measurePerformance<T>(
  fnName: string,
  fn: () => T
): T {
  if (process.env.NODE_ENV !== "development") {
    return fn();
  }

  const start = performance.now();
  const result = fn();
  const end = performance.now();
  const duration = end - start;

  if (duration > 10) {
    console.warn(`⚠️ [Performance] ${fnName} took ${duration.toFixed(2)}ms`);
  } else {
    console.log(`✓ [Performance] ${fnName} took ${duration.toFixed(2)}ms`);
  }

  return result;
}

/**
 * Async versie van measurePerformance
 */
export async function measurePerformanceAsync<T>(
  fnName: string,
  fn: () => Promise<T>
): Promise<T> {
  if (process.env.NODE_ENV !== "development") {
    return fn();
  }

  const start = performance.now();
  const result = await fn();
  const end = performance.now();
  const duration = end - start;

  if (duration > 100) {
    console.warn(`⚠️ [Performance] ${fnName} took ${duration.toFixed(2)}ms`);
  } else {
    console.log(`✓ [Performance] ${fnName} took ${duration.toFixed(2)}ms`);
  }

  return result;
}
