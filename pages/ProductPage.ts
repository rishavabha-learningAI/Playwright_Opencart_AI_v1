import { Page, Locator } from '@playwright/test';

export class ProductPage {
    private readonly page: Page;

    // Locators
    private readonly productHeading: Locator;
    private readonly addToCartButton: Locator;
    private readonly quantityInput: Locator;
    private readonly productPrice: Locator;
    private readonly successMessage: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators
        this.productHeading = page.getByRole('heading', { name: 'MacBook' });
        this.addToCartButton = page.getByRole('button', { name: 'Add to Cart' });
        this.quantityInput = page.getByRole('textbox', { name: 'Qty' });
        this.productPrice = page.locator('h2').filter({ hasText: '$' });
        this.successMessage = page.locator('.alert-success');
    }

    /**
     * Returns the product heading text
     * @returns Promise<string> - product name
     */
    async getProductName(): Promise<string> {
        return await this.productHeading.textContent() || '';
    }

    /**
     * Gets the displayed product price
     * @returns Promise<string> - price string
     */
    async getProductPrice(): Promise<string> {
        return await this.productPrice.textContent() || '';
    }

    /**
     * Sets the quantity for the product
     * @param qty - Quantity to set
     */
    async setQuantity(qty: string): Promise<void> {
        await this.quantityInput.fill(qty);
    }

    /**
     * Clicks the Add to Cart button
     */
    async clickAddToCart(): Promise<void> {
        await this.addToCartButton.click();
        // Wait for the success alert to appear
        await this.successMessage.waitFor({ state: 'visible', timeout: 10000 });
    }

    /**
     * Checks if the success alert is visible after adding to cart
     * @returns Promise<boolean> - true if success message is visible
     */
    async isSuccessMessageVisible(): Promise<boolean> {
        try {
            return await this.successMessage.isVisible();
        } catch (error) {
            console.log(`Error checking success message: ${error}`);
            return false;
        }
    }

    /**
     * Gets the success alert text
     * @returns Promise<string> - success message text
     */
    async getSuccessMessageText(): Promise<string> {
        return await this.successMessage.textContent() || '';
    }

    /**
     * Checks if product page exists
     * @returns Promise<boolean> - true if product heading is visible
     */
    async isProductPageExists(): Promise<boolean> {
        try {
            return await this.productHeading.isVisible();
        } catch (error) {
            console.log(`Error checking product page: ${error}`);
            return false;
        }
    }
}