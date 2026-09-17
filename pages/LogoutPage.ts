import { Page, Locator } from '@playwright/test';

export class LogoutPage {
    private readonly page: Page;

    // Locators
    private readonly logoutHeading: Locator;
    private readonly continueButton: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators
        this.logoutHeading = page.getByRole('heading', { name: 'Account Logout' });
        this.continueButton = page.getByRole('link', { name: 'Continue' });
    }

    /**
     * Checks if the logout confirmation page is displayed
     * @returns Promise<boolean> - true if logout heading is visible
     */
    async isLogoutPageExists(): Promise<boolean> {
        try {
            return await this.logoutHeading.isVisible();
        } catch (error) {
            console.log(`Error checking logout page: ${error}`);
            return false;
        }
    }

    /**
     * Clicks the Continue button on the logout page
     */
    async clickContinue(): Promise<void> {
        await this.continueButton.click();
    }
}