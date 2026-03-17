/**
 * LOW: Proper logging utility with levels
 * In production, this could be extended to send logs to a monitoring service
 */

const isProduction = process.env.NODE_ENV === 'production';

const logger = {
  debug: (...args) => {
    if (!isProduction) {
      console.log('[DEBUG]', ...args);
    }
  },

  info: (...args) => {
    console.log('[INFO]', ...args);
  },

  warn: (...args) => {
    console.warn('[WARN]', ...args);
  },

  error: (...args) => {
    console.error('[ERROR]', ...args);
    // In production, send to error tracking service (e.g., Sentry, LogRocket)
    // if (isProduction && window.errorTracking) {
    //   window.errorTracking.captureException(args[0]);
    // }
  },

  group: (label) => {
    if (!isProduction) {
      console.group(label);
    }
  },

  groupEnd: () => {
    if (!isProduction) {
      console.groupEnd();
    }
  },

  time: (label) => {
    if (!isProduction) {
      console.time(label);
    }
  },

  timeEnd: (label) => {
    if (!isProduction) {
      console.timeEnd(label);
    }
  },
};

export default logger;