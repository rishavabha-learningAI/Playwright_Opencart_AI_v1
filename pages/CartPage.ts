import { Page, Locator } from '@playwright/test';

export class CartPage {
    private readonly page: Page;

    // Locators
    private readonly cartHeading: Locator;
    private readonly cartForm: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators
        this.cartHeading = page.getByRole('heading', { name: 'Shopping Cart' });
        this.cartForm = page.locator('form');
    }

    /**
     * Checks if the cart page is displayed
     * @returns Promise<boolean> - true if cart heading is visible
     */
    async isCartPageExists(): Promise<boolean> {
        try {
            return await this.cartHeading.isVisible();
        } catch (error) {
            console.log(`Error checking cart page: ${error}`);
            return false;
        }
    }

    /**
     * Gets the product name in the cart
     * @returns Promise<string> - product name text
     */
    async getProductName(): Promise<string> {
        const productLink = this.cartForm.locator('table.table-bordered tbody tr td:nth-child(2) a').first();
        const text = await productLink.textContent();
        return text?.trim() || '';
    }

    /**
     * Gets the quantity value in the cart
     * @returns Promise<string> - quantity value
     */
    async getQuantity(): Promise<string> {
        const qtyInput = this.cartForm.locator('table.table-bordered tbody tr td:nth-child(4) input[type="text"]');
        return await qtyInput.inputValue();
    }

    /**
     * Gets the unit price text
     * @returns Promise<string> - unit price
     */
    async getUnitPrice(): Promise<string> {
        const price = this.cartForm.locator('table.table-bordered tbody tr td:nth-child(5)').first();
        const text = await price.textContent();
        return text?.trim() || '';
    }

    /**
     * Gets the total price text for the product row
     * @returns Promise<string> - total price
     */
    async getTotalPrice(): Promise<string> {
        const total = this.cartForm.locator('table.table-bordered tbody tr td:nth-child(6)').first();
        const text = await total.textContent();
        return text?.trim() || '';
    }

    /**
     * Gets the overall cart total (from the second totals table)
     * @returns Promise<string> - cart total
     */
    async getCartTotal(): Promise<string> {
        // Totals are in a separate table outside the form, last row last column
        const totalCell = this.page.locator('.col-sm-4.col-sm-offset-8 table.table-bordered tr:last-child td:last-child');
        const text = await totalCell.textContent();
        return text?.trim() || '';
    }
}