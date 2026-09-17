/**
 * Test Case: End-to-End Shopping Flow
 *
 * Tags: @master @e2e @web
 *
 * Steps:
 * 1) Open the application
 * 2) Navigate to Register page and register a new customer
 * 3) Verify successful registration
 * 4) Log out
 * 5) Navigate to Login page and log in
 * 6) Verify successful authentication
 * 7) Search for MacBook product
 * 8) Open the product details page
 * 9) Add the product to the cart
 * 10) Open the shopping cart
 * 11) Verify the correct product
 * 12) Verify the quantity
 * 13) Verify the product price
 * 14) Verify the applicable cart total
 */

import { test, expect } from '../../fixtures/pageFixtures';
import { RandomDataUtil } from '../../utils/dataGenerator';
import { Helper } from '../../utils/helper';
import dotenv from 'dotenv';

dotenv.config();

const APP_URL = process.env.WEB_APP_URL || 'http://localhost/opencart/upload/';

test.describe('End-to-End Shopping Flow @master @e2e @web', () => {

    let testUser: { firstName: string; lastName: string; email: string; telephone: string; password: string };

    test.beforeEach(() => {
        // Generate dynamic unique test data for registration
        testUser = {
            firstName: RandomDataUtil.getFirstName(),
            lastName: RandomDataUtil.getLastName(),
            email: RandomDataUtil.getEmail(),
            telephone: RandomDataUtil.getPhoneNumber(),
            password: RandomDataUtil.getPassword(12),
        };
    });

    test('Complete customer shopping journey @master @e2e', async ({ page, homePage, loginPage, registerPage, accountPage, logoutPage, searchPage, productPage, cartPage }) => {

        // ---------------------------------------------------------
        // Step 2 - Register a new customer
        // ---------------------------------------------------------
        await test.step('2) Register a new customer', async () => {
            await page.goto(APP_URL, { waitUntil: 'load', timeout: 20000 });
            await page.goto(APP_URL + 'index.php?route=account/register', { waitUntil: 'load', timeout: 20000 });

            await registerPage.fillRegistrationForm(
                testUser.firstName,
                testUser.lastName,
                testUser.email,
                testUser.telephone,
                testUser.password
            );
            await registerPage.agreePrivacyPolicy();
            await registerPage.clickContinue();
        });

        // ---------------------------------------------------------
        // Step 3 - Verify successful registration
        // ---------------------------------------------------------
        await test.step('3) Verify successful registration', async () => {
            const isSuccess = await accountPage.isRegistrationSuccessMessageVisible();
            expect(isSuccess).toBeTruthy();
        });

        // ---------------------------------------------------------
        // Step 4 - Log out
        // ---------------------------------------------------------
        await test.step('4) Log out', async () => {
            await accountPage.logout();
            const isLogoutPage = await logoutPage.isLogoutPageExists();
            expect(isLogoutPage).toBeTruthy();
            await logoutPage.clickContinue();
        });

        // ---------------------------------------------------------
        // Step 5 - Log in again using the newly created credentials
        // ---------------------------------------------------------
        await test.step('5) Log in again using the newly created credentials', async () => {
            await page.goto(APP_URL + 'index.php?route=account/login');
            await loginPage.login(testUser.email, testUser.password);
        });

        // ---------------------------------------------------------
        // Step 6 - Verify successful authentication
        // ---------------------------------------------------------
        await test.step('6) Verify successful authentication', async () => {
            const isLoggedIn = await accountPage.isMyAccountPageExists();
            expect(isLoggedIn).toBeTruthy();
        });

        // ---------------------------------------------------------
        // Step 7 - Search for a known product (MacBook)
        // ---------------------------------------------------------
        await test.step('7) Search for MacBook', async () => {
            await homePage.searchProduct('MacBook');
            const isSearchPage = await searchPage.isSearchPageExists();
            expect(isSearchPage).toBeTruthy();
        });

        // ---------------------------------------------------------
        // Step 8 - Open the product details page
        // ---------------------------------------------------------
        await test.step('8) Open the MacBook product details', async () => {
            await searchPage.clickProduct('MacBook');
            const isProductPage = await productPage.isProductPageExists();
            expect(isProductPage).toBeTruthy();
        });

        // ---------------------------------------------------------
        // Step 9 - Add the product to the cart
        // ---------------------------------------------------------
        await test.step('9) Add the product to the cart', async () => {
            await productPage.clickAddToCart();
            const isSuccess = await productPage.isSuccessMessageVisible();
            expect(isSuccess).toBeTruthy();
        });

        // ---------------------------------------------------------
        // Step 10 - Open the shopping cart
        // ---------------------------------------------------------
        await test.step('10) Open the shopping cart', async () => {
            await page.goto(APP_URL + 'index.php?route=checkout/cart');
            const isCartPage = await cartPage.isCartPageExists();
            expect(isCartPage).toBeTruthy();
        });

        // ---------------------------------------------------------
        // Step 11 - Verify the correct product
        // ---------------------------------------------------------
        await test.step('11) Verify the correct product in cart', async () => {
            const productName = await cartPage.getProductName();
            expect(productName).toContain('MacBook');
        });

        // ---------------------------------------------------------
        // Step 12 - Verify the quantity
        // ---------------------------------------------------------
        await test.step('12) Verify the quantity', async () => {
            const quantity = await cartPage.getQuantity();
            expect(quantity).toBe('1');
        });

        // ---------------------------------------------------------
        // Step 13 - Verify the product price
        // ---------------------------------------------------------
        await test.step('13) Verify the product price', async () => {
            const unitPrice = await cartPage.getUnitPrice();
            expect(unitPrice.trim()).toBe('$602.00');
        });

        // ---------------------------------------------------------
        // Step 14 - Verify the applicable cart total
        // ---------------------------------------------------------
        await test.step('14) Verify the cart total', async () => {
            const cartTotal = await cartPage.getCartTotal();
            expect(cartTotal.trim()).toBe('$602.00');
        });

        console.log('✅ End-to-End shopping journey completed successfully!');
    });
});