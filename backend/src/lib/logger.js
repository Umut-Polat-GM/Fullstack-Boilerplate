// Tiny dependency-free logger. Swap with pino/winston when you need log shipping.
const time = () => new Date().toISOString().slice(11, 19);

export const logger = {
  info: (...args) => console.log(`[${time()}] ℹ`, ...args),
  success: (...args) => console.log(`[${time()}] ✔`, ...args),
  warn: (...args) => console.warn(`[${time()}] ⚠`, ...args),
  error: (...args) => console.error(`[${time()}] ✖`, ...args),
};
