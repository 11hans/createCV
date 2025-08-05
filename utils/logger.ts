/**
 * Centralized logger utility that only logs in development mode
 * All logging is disabled in production to prevent sensitive information leaks
 */

/**
 * Logs messages to the console only in development mode
 */
export function log(...args: any[]): void {
  if (process.env.NODE_ENV !== 'production') {
    console.log(...args);
  }
}

/**
 * Logs warning messages to the console only in development mode
 */
export function warn(...args: any[]): void {
  if (process.env.NODE_ENV !== 'production') {
    console.warn(...args);
  }
}

/**
 * Logs error messages to the console - enabled in all environments
 * but sanitizes potential sensitive data
 */
export function error(...args: any[]): void {
  // Always log errors, but sanitize them in production
  if (process.env.NODE_ENV === 'production') {
    // Create sanitized versions of the arguments
    const sanitizedArgs = args.map(arg => {
      if (typeof arg === 'string') {
        // Redact email addresses and other potentially sensitive data
        return arg
          .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[REDACTED_EMAIL]')
          .replace(/(api[_-]?key|token|password|secret)["']?\s*[:=]\s*["']?([^"'\s]+)/gi, '$1: [REDACTED]');
      }
      if (arg instanceof Error) {
        return `Error: ${arg.message}`;
      }
      if (typeof arg === 'object' && arg !== null) {
        return 'Object data';
      }
      return arg;
    });
    
    console.error(...sanitizedArgs);
  } else {
    console.error(...args);
  }
}

/**
 * Debug logging - only in development and when debug mode is enabled
 */
export function debug(...args: any[]): void {
  if (process.env.NODE_ENV !== 'production' && process.env.DEBUG) {
    console.debug('[DEBUG]', ...args);
  }
}

// Export a logger object that can be imported as { logger } from '~/utils/logger'
export const logger = {
  log,
  warn,
  error,
  debug
}; 