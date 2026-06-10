const { test, expect } = require("@playwright/test");
const { AmazonPage }   = require("../pages/AmazonPage");
const { createLogger } = require("../utils/logger");

const log = createLogger("iPhone Test");

test.describe("Test Case 1 – iPhone Cart", () => {
  test("Search for iPhone, add to cart, and print price", async ({ page }) => {
    const amazon = new AmazonPage(page);
    log.info("Navigating to Amazon.com …");
    await amazon.goto();
    log.success("Amazon.com loaded");
    const query = "iPhone";
    log.info(`Searching for "${query}" …`);
    await amazon.search(query);
    log.success(`Search results page loaded for "${query}"`);
    log.info("Selecting first product from results …");
    const productTitle = await amazon.selectFirstProduct();
    log.success(`Product page opened: "${productTitle}"`);
    log.info("Retrieving product price …");
    const price = await amazon.getPrice();
    log.price(productTitle, price);
    if (price) {
      expect(price).toMatch(/\$|USD|[\d,]+/);
    } else {
      log.warn("Price could not be retrieved (may require sign-in).");
    }
    log.info("Adding product to cart …");
    await amazon.addToCart();
    const cartCount = await amazon.getCartCount();
    log.success(`Item added to cart. Cart count: ${cartCount}`);
    expect(parseInt(cartCount, 10)).toBeGreaterThanOrEqual(1);
    log.success("Test Case 1 completed successfully ✔");
  });
});
