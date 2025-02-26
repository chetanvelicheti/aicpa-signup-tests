const { test, expect } = require('@playwright/test');

test.setTimeout(120000); // 120 seconds

test.use({
  browserName: 'chromium',
  launchOptions: {
    args: ['--start-maximized'],
  },
});

test('Navigate, click Register now, add to cart, and view cart', async ({ page, context }) => {
  // Navigate to the page
  await page.goto('https://www.aicpa-cima.com/');
  await page.evaluate(() => document.documentElement.requestFullscreen());
  await page.waitForLoadState('load');

  // Click "Accept All" button
  const acceptAllButton = page.locator('#onetrust-accept-btn-handler');
  await acceptAllButton.waitFor({ state: 'visible', timeout: 30000 });
  await acceptAllButton.hover();
  await acceptAllButton.click();
  console.log('Clicked "Accept All" button.');

  // Click "Register now" button
  const registerButton = page.locator('li.react-multi-carousel-item--active a[data-testid="button-button-welcome-block"] > span');
  await registerButton.waitFor({ state: 'visible', timeout: 15000 });
  await registerButton.hover();
  await registerButton.click();
  console.log('Clicked "Register now" button.');

  // Wait for the new page to open
  const newPage = await context.waitForEvent('page', { predicate: (p) => p.url().includes('cfo-conference'), timeout: 30000 });
  await newPage.waitForLoadState('load');
  console.log(`New page URL: ${newPage.url()}`);

  // Verify the new page URL
  await expect(newPage).toHaveURL(/.*cfo-conference/);
  console.log('Navigated to conference page successfully.');

  // Click the radio button div
  const radioButton = newPage.locator('div[data-testid="0-radio-styled-middle"]');
  await radioButton.waitFor({ state: 'visible', timeout: 15000 });
  await radioButton.hover();
  await radioButton.click();
  console.log('Clicked radio button with data-testid="0-radio-styled-middle".');

  // Click "Add to Cart" button
  const addToCartButton = newPage.locator('button[data-testid="button-purchase-summary-add-to-cart"]');
  await addToCartButton.waitFor({ state: 'visible', timeout: 15000 });
  await addToCartButton.hover();
  await addToCartButton.click();
  console.log('Clicked "Add to Cart" button.');

  // Click "View in Cart" button
  const viewCartButton = newPage.locator('button[data-testid="button-purchase-summary-add-to-cart"]:has-text("View in Cart")');
  await viewCartButton.waitFor({ state: 'visible', timeout: 15000 });
  await viewCartButton.hover();
  await viewCartButton.click();
  console.log('Clicked "View in Cart" button.');

  // Navigate to the cart page
  await newPage.goto('https://www.aicpa-cima.com/account/cart');
  await newPage.waitForLoadState('load');
  console.log('Navigated to cart page: https://www.aicpa-cima.com/account/cart');

  // Take a screenshot
  await newPage.screenshot({ path: 'cart-page.png', fullPage: true });
  console.log('Screenshot saved as cart-page.png');

  // Scroll down the page
  await newPage.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  console.log('Scrolled to the bottom of the cart page.');
});
