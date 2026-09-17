import { Page, Locator } from '@playwright/test';

export class RegisterPage {
    private readonly page: Page;

    // Locators
    private readonly firstNameInput: Locator;
    private readonly lastNameInput: Locator;
    private readonly emailInput: Locator;
    private readonly telephoneInput: Locator;
    private readonly passwordInput: Locator;
    private readonly confirmPasswordInput: Locator;
    private readonly newsletterYesRadio: Locator;
    private readonly privacyCheckbox: Locator;
    private readonly continueButton: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators
        this.firstNameInput = page.getByPlaceholder('First Name');
        this.lastNameInput = page.getByPlaceholder('Last Name');
        this.emailInput = page.getByPlaceholder('E-Mail');
        this.telephoneInput = page.getByPlaceholder('Telephone');
        this.passwordInput = page.locator('#input-password');
        this.confirmPasswordInput = page.locator('#input-confirm');
        this.newsletterYesRadio = page.getByRole('radio', { name: 'Yes' });
        this.privacyCheckbox = page.locator('input[name="agree"]');
        this.continueButton = page.getByRole('button', { name: 'Continue' });
    }

    /**
     * Fills the registration form with user details
     * @param firstName - First name
     * @param lastName - Last name
     * @param email - Email address
     * @param telephone - Telephone number
     * @param password - Password
     */
    async fillRegistrationForm(firstName: string, lastName: string, email: string, telephone: string, password: string): Promise<void> {
        await this.firstNameInput.fill(firstName);
        await this.lastNameInput.fill(lastName);
        await this.emailInput.fill(email);
        await this.telephoneInput.fill(telephone);
        await this.passwordInput.fill(password);
        await this.confirmPasswordInput.fill(password);
    }

    /**
     * Selects the Newsletter Yes radio option
     */
    async selectNewsletterYes(): Promise<void> {
        await this.newsletterYesRadio.click();
    }

    /**
     * Checks the Privacy Policy checkbox
     */
    async agreePrivacyPolicy(): Promise<void> {
        await this.privacyCheckbox.click();
    }

    /**
     * Clicks the Continue button to submit registration
     */
    async clickContinue(): Promise<void> {
        await this.continueButton.click();
    }

    /**
     * Returns the heading text of the register page
     */
    async getHeading(): Promise<string> {
        return await this.page.getByRole('heading', { name: 'Register Account' }).textContent() || '';
    }
}