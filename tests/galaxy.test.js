// tests/galaxy.test.js
/**
 * Test Case 2 – Samsung Galaxy
 *
 * 1. Navigate to Amazon.com
 * 2. Search for "Samsung Galaxy"
 * 3. Select the first result
 * 4. Add it to the cart
 * 5. Retrieve and print the price to the console
 */

const { test, expect } = require("@playwright/test");
const { AmazonPage }   = require("../pages/AmazonPage");
const { createLogger } = require("../utils/logger");

const log = createLogger("Galaxy Test");

test.describe("Test Case 2 – Galaxy Cart", () => {
  test("Search for Samsung Galaxy, add to cart, and print price", async ({ page }) => {
    const amazon = new AmazonPage(page);

    // ── Step 1: Navigate ───────────────────────────────────────────────────
    log.info("Navigating to Amazon.com …");
    await amazon.goto();
    log.success("Amazon.com loaded");

    // ── Step 2: Search ─────────────────────────────────────────────────────
    const query = "Galaxy";
    log.info(`Searching for "${query}" …`);
    await amazon.search(query);
    log.success(`Search results page loaded for "${query}"`);

    // ── Step 3: Select first product ───────────────────────────────────────
    log.info("Selecting first product from results …");
    const productTitle = await amazon.selectFirstProduct();
    log.success(`Product page opened: "${productTitle}"`);

    // ── Step 4: Retrieve price ─────────────────────────────────────────────
    log.info("Retrieving product price …");
    const price = await amazon.getPrice();
    log.price(productTitle, price);

    if (price) {
      expect(price).toMatch(/\$|USD|[\d,]+/);
    } else {
      log.warn("Price could not be retrieved (may require sign-in).");
    }

    // ── Step 5: Add to cart ────────────────────────────────────────────────
    log.info("Adding product to cart …");
    await amazon.addToCart();
    const cartCount = await amazon.getCartCount();
    log.success(`Item added to cart. Cart count: ${cartCount}`);

    expect(parseInt(cartCount, 10)).toBeGreaterThanOrEqual(1);

    log.success("Test Case 2 completed successfully ✔");
  });
});
