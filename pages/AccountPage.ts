import { Page, Locator } from '@playwright/test';

export class AccountPage {
    private readonly page: Page;

    // Locators
    private readonly myAccountHeading: Locator;
    private readonly accountSuccessMessage: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators
        this.myAccountHeading = page.locator('#content h2').filter({ hasText: 'My Account' });
        this.accountSuccessMessage = page.locator('#content').getByText('Your Account Has Been Created!');
    }

    /**
     * Checks if the My Account page is displayed (heading visible)
     * @returns Promise<boolean> - true if My Account heading is visible
     */
    async isMyAccountPageExists(): Promise<boolean> {
        try {
            return await this.myAccountHeading.isVisible();
        } catch (error) {
            console.log(`Error checking My Account page: ${error}`);
            return false;
        }
    }

    /**
     * Checks if the registration success message is displayed
     * @returns Promise<boolean> - true if success message is visible
     */
    async isRegistrationSuccessMessageVisible(): Promise<boolean> {
        try {
            return await this.accountSuccessMessage.isVisible();
        } catch (error) {
            console.log(`Error checking success message: ${error}`);
            return false;
        }
    }

    /**
     * Navigates directly to the account logout page
     */
    async logout(): Promise<void> {
        await this.page.goto(process.env.WEB_APP_URL + 'index.php?route=account/logout' || 'http://localhost/opencart/upload/index.php?route=account/logout');
    }
}