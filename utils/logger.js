// utils/logger.js
/**
 * Lightweight logger that adds a timestamp and test-name prefix to every line.
 * Keeps console output tidy when two tests run in parallel.
 */

const COLOURS = {
  reset:  "\x1b[0m",
  cyan:   "\x1b[36m",
  green:  "\x1b[32m",
  yellow: "\x1b[33m",
  red:    "\x1b[31m",
  bold:   "\x1b[1m",
};

function timestamp() {
  return new Date().toISOString().replace("T", " ").slice(0, 19);
}

function prefix(testName) {
  return `${COLOURS.cyan}[${timestamp()}]${COLOURS.reset} ${COLOURS.bold}[${testName}]${COLOURS.reset}`;
}

/**
 * @param {string} testName  Short label shown in every log line (e.g. "iPhone Test")
 */
function createLogger(testName) {
  return {
    info:    (msg) => console.log(`${prefix(testName)} ${msg}`),
    success: (msg) => console.log(`${prefix(testName)} ${COLOURS.green}✔  ${msg}${COLOURS.reset}`),
    warn:    (msg) => console.warn(`${prefix(testName)} ${COLOURS.yellow}⚠  ${msg}${COLOURS.reset}`),
    error:   (msg) => console.error(`${prefix(testName)} ${COLOURS.red}✖  ${msg}${COLOURS.reset}`),

    /** Prominently print the retrieved price to the console (assignment requirement). */
    price: (productTitle, price) => {
      const line = "─".repeat(60);
      console.log(`\n${COLOURS.green}${line}`);
      console.log(`  ${COLOURS.bold}PRICE RETRIEVED${COLOURS.reset}${COLOURS.green}`);
      console.log(`  Test    : ${testName}`);
      console.log(`  Product : ${productTitle}`);
      console.log(`  Price   : ${price ?? "N/A – could not retrieve price"}`);
      console.log(`${line}${COLOURS.reset}\n`);
    },
  };
}

module.exports = { createLogger };
