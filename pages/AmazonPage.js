
class AmazonPage {

  constructor(page) {
    this.page = page;
    this.searchBox        = page.locator("#twotabsearchtextbox");
    this.searchButton     = page.locator("#nav-search-submit-button");
    this.searchResults    = page.locator("//div[@data-component-type='s-search-result']");
    this.addToCartButton  = page.locator("(//div[@data-component-type='s-search-result'])[1]//button[text()='Add to cart']");
    this.cartCount        = page.locator("#nav-cart-count");
    this.cartConfirmation = page.locator("#NATC_SMART_WAGON_CONF_MSG_SUCCESS, #sw-atc-confirmation, .a-alert-success");
    this.priceSelectors = page.locator("(//div[@data-component-type='s-search-result'])[1]//span[@class='a-price']//span[@class='a-price-whole']");
  }
  async goto() {
    await this.page.goto("https://www.amazon.in", {
      waitUntil: "domcontentloaded",
    });
    await this._dismissBanners();
  }

  async search(query) {
    await this.searchBox.waitFor({ state: "visible" });
    await this.searchBox.fill(query);
    await this.searchButton.click();
    await this.page.waitForLoadState("domcontentloaded");
  }

  async selectFirstProduct() {
    const firstResult = await this.searchResults.first();
    const productLink = await firstResult.locator("//div[@data-cy='title-recipe']//h2[@aria-label]").first();

    const title = (await productLink.textContent())?.trim() ?? "Unknown product";
    return title;
  }

  async getPrice() {

      try {
        const el = this.page.locator("(//div[@data-component-type='s-search-result'])[1]//span[@class='a-price']//span[@class='a-price-whole']").first();
        const visible = await el.isVisible().catch(() => false);
        if (visible) {
          const text = (await el.textContent())?.trim();
          if (text) return text;
        }
      } catch {
      }
    
    const bodyText = await this.page.locator("body").innerText();
    const match = bodyText.match(/\$[\d,]+\.?\d{0,2}/);
    return match ? match[0] : null;
  }

  async addToCart() {
  await this.page.locator("(//div[@data-component-type='s-search-result'])[1]//button[text()='Add to cart']").click();

    await this.page
      .waitForSelector(
        "#NATC_SMART_WAGON_CONF_MSG_SUCCESS, #sw-atc-confirmation, .a-alert-success, #attachDisplayAddBaseAlert",
        { timeout: 15_000 }
      )
      .catch(() => {
      });
    await this._dismissModals();
  }

  async getCartCount() {
    return (await this.page.locator("//span[@id ='nav-cart-count']")).textContent();
  }

  async _dismissBanners() {
    const bannerSelectors = [
      "#sp-cc-accept",       
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
