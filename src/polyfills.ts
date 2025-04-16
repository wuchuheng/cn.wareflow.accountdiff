// Polyfills for compatibility issues

// Define types for global objects
declare global {
  interface Window {
    global: typeof globalThis;
    process?: {
      env: {
        NODE_ENV: string;
      };
    };
  }
}

// 1. Handle global for Draft.js
// 1.1 Define global object if needed
if (typeof window !== 'undefined' && !window.global) {
  window.global = window;
}

// 1.2 Define process object if needed
if (typeof window !== 'undefined' && !window.process) {
  window.process = { env: { NODE_ENV: 'production' } };
}

export {};
