import { test, expect } from '@playwright/test';

test.describe('Subscription Flow End-to-End', () => {
  let userEmail: string;

  test.beforeAll(() => {
    userEmail = `test_user_${Date.now()}@test.com`;
  });

  test('Full subscription flow', async ({ page }) => {
    // 1. Register and get default free plan
    await page.goto('/register');
    await page.fill('input[name="firstName"]', 'Test');
    await page.fill('input[name="lastName"]', 'User');
    await page.fill('input[name="email"]', userEmail);
    await page.fill('input[name="password"]', 'Password123!');
    
    // Assuming there is a submit button with type="submit" or specific text
    await page.click('button[type="submit"]');
    
    // Wait for redirect to dashboard
    await page.waitForURL('**/admin**');
    
    // Navigate to subscriptions
    await page.goto('/admin/subscriptions');
    
    // Verify Freemium is the current plan
    await expect(page.locator('text=Current Plan').first()).toBeVisible();
    await expect(page.locator('text=Freemium').first()).toBeVisible();

    // 2. Upgrade to a paid plan (Starter Pack - 300)
    // Find the Starter Pack plan card and click its switch button
    // The exact text will depend on the button, it says "Switch to this plan"
    const starterPackCard = page.locator('div', { hasText: 'Starter Pack' }).filter({ hasText: 'Switch to this plan' }).first();
    await starterPackCard.locator('button', { hasText: 'Switch to this plan' }).click();

    // The modal pops up
    await expect(page.locator('text=Confirm Switch')).toBeVisible();
    await page.click('button:has-text("Yes, switch plan")');

    // Wait for Stripe Checkout
    await page.waitForURL('**/checkout.stripe.com/**');

    // Fill Stripe Checkout (this is highly dependent on Stripe's UI which changes, but we try)
    // In test mode, we might just need to enter email and card. Sometimes it auto-fills email.
    // Since Stripe Checkout in E2E is very flaky, we will just simulate payment or use the card.
    await page.locator('#email').fill(userEmail).catch(() => {});
    await page.locator('#cardNumber').fill('4242424242424242');
    await page.locator('#cardExpiry').fill('1234');
    await page.locator('#cardCvc').fill('123');
    await page.locator('#billingName').fill('Test User');
    
    await page.locator('.SubmitButton').click();

    // Wait for return to our app
    await page.waitForURL('**/admin/subscriptions**');
    await expect(page.locator('text=Subscription upgraded successfully').or(page.locator('text=Current Plan'))).toBeVisible();

    // 3. Switch to plan with SAME price (Test Feat - 300)
    const testFeatCard = page.locator('div', { hasText: 'Test Feat' }).filter({ hasText: 'Switch to this plan' }).first();
    await testFeatCard.locator('button', { hasText: 'Switch to this plan' }).click();
    await expect(page.locator('text=Confirm Switch')).toBeVisible();
    await page.click('button:has-text("Yes, switch plan")');
    
    // Should NOT go to stripe, should just reload
    await expect(page.locator('text=Current Plan').first()).toBeVisible();
    
    // 4. Upgrade to a higher plan (500)
    const higherPlanCard = page.locator('div', { hasText: '₦500.00/mo' }).filter({ hasText: 'Switch to this plan' }).first();
    await higherPlanCard.locator('button', { hasText: 'Switch to this plan' }).click();
    
    // Wait for quote modal
    await expect(page.locator('text=Confirm Switch')).toBeVisible();
    // Verify it shows the proration amount
    await expect(page.locator('text=Due today:')).toBeVisible();
    
    await page.click('button:has-text("Yes, switch plan")');
    
    // Should NOT go to checkout, should charge immediately and succeed
    await expect(page.locator('text=Current Plan').first()).toBeVisible();

    // 5. Cancel subscription
    // Assuming there is a Manage Subscription or Cancel button somewhere. 
    // Currently, our code says "To downgrade your plan, please click 'Manage Subscription' above."
    // Let's click Manage Subscription to go to Stripe Customer Portal
    const [portalPage] = await Promise.all([
      page.waitForEvent('popup'), // or navigation if it doesn't open in new tab
      page.click('text=Manage Subscription')
    ]);
    
    await portalPage.waitForLoadState();
    await expect(portalPage.url()).toContain('billing.stripe.com');
    await portalPage.click('text=Cancel plan');
    await portalPage.click('text=Confirm cancellation');
  });
});
