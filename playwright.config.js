// playwright.config.js
const { defineConfig, devices } = require("@playwright/test");
require("dotenv").config();

const isLambdaTest = process.env.LAMBDATEST === "true";

function ltCapabilities(testName) {
  return {
    browserName: "Chrome",
    browserVersion: "latest",
    "LT:Options": {
      platform: "Windows 11",
      build: "Amazon Cart Automation",
      name: testName,
      user: process.env.LT_USERNAME,
      accessKey: process.env.LT_ACCESS_KEY,
      network: true,
      video: false,
      console: true,
      tunnel: false,
    },
  };
}

const projects = [
  {
    name: "iphone-test",
    use: {
      ...devices["Desktop Chrome"],
      viewport: { width: 1440, height: 900 },
    },
    testMatch: "**/iphone.test.js",
  },
  {
    name: "galaxy-test",
    use: {
      ...devices["Desktop Chrome"],
      viewport: { width: 1440, height: 900 },
    },
    testMatch: "**/galaxy.test.js",
  },
];

module.exports = defineConfig({
  testDir: "./tests",
  timeout: 90_000,
  retries: 0,
  workers: 2,
  fullyParallel: true,
  reporter: [
    ["list"],
    ["html", { open: "never", outputFolder: "playwright-report" }],
  ],
  use: {
    baseURL: "https://www.amazon.in",
    screenshot: "only-on-failure",
    video: isLambdaTest ? "off" : "retain-on-failure",  // ← disable for LambdaTest
    trace: isLambdaTest ? "off" : "on-first-retry",
    ...(isLambdaTest && {
      connectOptions: {
        wsEndpoint: `wss://cdp.lambdatest.com/playwright?capabilities=${encodeURIComponent(
          JSON.stringify(ltCapabilities("Amazon Cart Test"))
        )}`,
      },
    }),
  },
  projects,
});