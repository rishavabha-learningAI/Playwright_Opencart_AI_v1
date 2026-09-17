import { Page, Locator } from '@playwright/test';

export class SearchPage {
    private readonly page: Page;

    // Locators
    private readonly searchHeading: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators
        this.searchHeading = page.locator('#content h1');
    }

    /**
     * Clicks on a product link from search results by exact product name
     * @param productName - Exact name of the product to click
     */
    async clickProduct(productName: string): Promise<void> {
        await this.page.getByRole('link', { name: productName, exact: true }).first().click();
    }

    /**
     * Checks if the search results page exists
     * @returns Promise<boolean> - true if search heading is visible
     */
    async isSearchPageExists(): Promise<boolean> {
        try {
            return await this.searchHeading.isVisible();
        } catch (error) {
            console.log(`Error checking search page: ${error}`);
            return false;
        }
    }
}