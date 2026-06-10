// pages/AmazonPage.js
/**
 * Page Object Model for Amazon.com
 *
 * Encapsulates all selectors and interactions so that test scripts
 * remain clean, readable, and easy to maintain.
 */

class AmazonPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // ── Locators ──────────────────────────────────────────────────────────────
    this.searchBox        = page.locator("#twotabsearchtextbox");
    this.searchButton     = page.locator("#nav-search-submit-button");
    this.searchResults    = page.locator("//div[@data-component-type='s-search-result']");

    // Cart
    this.addToCartButton  = page.locator("(//div[@data-component-type='s-search-result'])[1]//button[text()='Add to cart']");
    this.cartCount        = page.locator("#nav-cart-count");
    this.cartConfirmation = page.locator("#NATC_SMART_WAGON_CONF_MSG_SUCCESS, #sw-atc-confirmation, .a-alert-success");

    // Price – tries multiple selectors in order of preference
    this.priceSelectors = page.locator("(//div[@data-component-type='s-search-result'])[1]//span[@class='a-price']//span[@class='a-price-whole']");
  }

  // ── Navigation ──────────────────────────────────────────────────────────────

  /**
   * Navigate to Amazon homepage.
   */
  async goto() {
    await this.page.goto("https://www.amazon.in", {
      waitUntil: "domcontentloaded",
    });
    // Dismiss location / cookie banners if present
    await this._dismissBanners();
  }

  // ── Search ──────────────────────────────────────────────────────────────────

  /**
   * Type a query into the search bar and submit.
   * @param {string} query
   */
  async search(query) {
    await this.searchBox.waitFor({ state: "visible" });
    await this.searchBox.fill(query);
    await this.searchButton.click();
    await this.page.waitForLoadState("domcontentloaded");
  }

  // ── Product selection ───────────────────────────────────────────────────────

  /**
   * Click on the first search result that has a price and a title.
   * Returns the product title for logging.
   * @returns {Promise<string>}
   */
  async selectFirstProduct() {
    // Wait until at least one result card is visible
    // Find the first result that is a sponsored or organic listing with a link
    const firstResult = await this.searchResults.first();
    const productLink = await firstResult.locator("//div[@data-cy='title-recipe']//h2[@aria-label]").first();

    const title = (await productLink.textContent())?.trim() ?? "Unknown product";
    // await productLink.click();
    // await this.page.waitForLoadState("domcontentloaded");

    return title;
  }

  // ── Price retrieval ─────────────────────────────────────────────────────────

  /**
   * Tries each price selector in order and returns the first non-empty text.
   * Returns null if no price element is found.
   * @returns {Promise<string|null>}
   */
  async getPrice() {

      try {
        const el = this.page.locator("(//div[@data-component-type='s-search-result'])[1]//span[@class='a-price']//span[@class='a-price-whole']").first();
        const visible = await el.isVisible().catch(() => false);
        if (visible) {
          const text = (await el.textContent())?.trim();
          if (text) return text;
        }
      } catch {
        // selector not present – try next
      }
    

    // Fallback: scrape the full page text for a price pattern
    const bodyText = await this.page.locator("body").innerText();
    const match = bodyText.match(/\$[\d,]+\.?\d{0,2}/);
    return match ? match[0] : null;
  }

  // ── Cart ────────────────────────────────────────────────────────────────────

  /**
   * Add the currently viewed product to the shopping cart.
   * Handles "Prime" upsell modals automatically.
   */
  async addToCart() {
    // Some products require a size/colour selection first;
    // we skip that here and go straight for the button.
    // await this.addToCartButton.waitFor({ state: "visible", timeout: 15_000 });
    // await this.page.pause()
  await this.page.locator("(//div[@data-component-type='s-search-result'])[1]//button[text()='Add to cart']").click();



    // Wait for either a success banner or the smart-wagon side panel
    await this.page
      .waitForSelector(
        "#NATC_SMART_WAGON_CONF_MSG_SUCCESS, #sw-atc-confirmation, .a-alert-success, #attachDisplayAddBaseAlert",
        { timeout: 15_000 }
      )
      .catch(() => {
        // If neither appears, the item may have still been added – continue
      });

    // Dismiss "No thanks" on Prime / Subscribe & Save modals if they appear
    await this._dismissModals();
  }

  /**
   * Return the current cart item count shown in the header.
   * @returns {Promise<string>}
   */
  async getCartCount() {
    return (await this.page.locator("//span[@id ='nav-cart-count']")).textContent();
  }

  // ── Private helpers ─────────────────────────────────────────────────────────

  async _dismissBanners() {
    const bannerSelectors = [
      "#sp-cc-accept",           // cookie consent
      "#contextual-consent-bar button",
      '[data-action="a-alert-close"]',
    ];
    for (const sel of bannerSelectors) {
      const el = this.page.locator(sel).first();
      if (await el.isVisible().catch(() => false)) {
        await el.click().catch(() => {});
      }
    }
  }

  async _dismissModals() {
    const modalDismissSelectors = [
      "#attachSiNoCoverage",
      "#siNoCoverage-btn",
      '[name="submit.noOpt"]',
      '.a-sheet .a-sheet-header button[data-action="a-popover-close"]',
    ];
    for (const sel of modalDismissSelectors) {
      const el = this.page.locator(sel).first();
      if (await el.isVisible({ timeout: 2_000 }).catch(() => false)) {
        await el.click().catch(() => {});
      }
    }
  }
}

module.exports = { AmazonPage };
