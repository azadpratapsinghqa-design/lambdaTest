# Amazon Cart Automation — Playwright + JavaScript

Automated test suite for the **Automation Engineering Assignment**.  
Covers two parallel test cases that search Amazon, add a product to the cart, and print the price to the console.

---

## Table of Contents

- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Running the Tests](#running-the-tests)
- [Bonus: LambdaTest Cloud Integration](#bonus-lambdatest-cloud-integration)
- [Design Decisions](#design-decisions)

---

## Project Structure

```
amazon-automation/
├── pages/
│   └── AmazonPage.js          # Page Object Model – all Amazon selectors & actions
├── tests/
│   ├── iphone.test.js         # Test Case 1: iPhone search → cart → price
│   └── galaxy.test.js         # Test Case 2: Galaxy search → cart → price
├── utils/
│   └── logger.js              # Colour-coded console logger
├── .env.example               # Environment variable template (copy to .env)
├── .gitignore
├── package.json
├── playwright.config.js       # Parallel execution config + LambdaTest projects
└── README.md
```

---

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | ≥ 18.x |
| npm | ≥ 9.x |

---

## Setup

```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/amazon-automation.git
cd amazon-automation

# 2. Install npm dependencies
npm install

# 3. Install Playwright browsers
npx playwright install --with-deps chromium
```

---

## Running the Tests

### Parallel execution (default — both tests run at the same time)

```bash
npm test
```

Both `iphone.test.js` and `galaxy.test.js` launch simultaneously using **2 Playwright workers**.  
You will see interleaved log output from each worker, confirming true parallel execution.

### Headed mode (watch the browser)

```bash
npm run test:headed
```

### View the HTML report after a run

```bash
npm run test:report
```

### What you will see in the console

```
──────────────────────────────────────────────────────────────
  PRICE RETRIEVED
  Test    : iPhone Test
  Product : Apple iPhone 15 (128 GB) – Black
  Price   : $799
──────────────────────────────────────────────────────────────

──────────────────────────────────────────────────────────────
  PRICE RETRIEVED
  Test    : Galaxy Test
  Product : Samsung Galaxy S24 128GB Onyx Black
  Price   : $699
──────────────────────────────────────────────────────────────
```

---

## Bonus: LambdaTest Cloud Integration

### 1. Create a free account

Sign up at [https://www.lambdatest.com](https://www.lambdatest.com).

### 2. Get your credentials

Go to **Profile → Account Settings → Access Key** and copy your **Username** and **Access Key**.

### 3. Add credentials to your environment

```bash
cp .env.example .env
# Edit .env and fill in LT_USERNAME and LT_ACCESS_KEY
```

### 4. Run on LambdaTest

```bash
npm run test:lambdatest
```

This sets `LAMBDATEST=true`, which switches `playwright.config.js` to use the LambdaTest CDP WebSocket endpoint instead of local browsers. Both test cases still run in parallel on the LambdaTest grid.

You can monitor live execution at:  
[https://automation.lambdatest.com/timeline](https://automation.lambdatest.com/timeline)

---

## Design Decisions

| Decision | Rationale |
|----------|-----------|
| **Page Object Model** | Keeps selectors in one place; tests stay readable and maintainable. |
| **`workers: 2` + `fullyParallel: true`** | Both test files run concurrently — satisfies the parallel execution requirement without any extra tooling. |
| **Multiple price selectors** | Amazon's DOM varies by product type, region, and login state; a fallback chain makes price retrieval robust. |
| **`dotenv` for LambdaTest creds** | Credentials stay out of source control; one flag switches between local and cloud. |
| **Colour-coded logger** | Parallel workers print interleaved output; colour + test-name prefix makes it easy to follow each thread. |
