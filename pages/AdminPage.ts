import { Page, Locator } from '@playwright/test';

export class AdminPage {
    private readonly page: Page;
    private userToken: string = '';

    // Locators
    private readonly usernameInput: Locator;
    private readonly passwordInput: Locator;
    private readonly loginButton: Locator;
    private readonly securityModalClose: Locator;
    private readonly filterNameInput: Locator;
    private readonly filterEmailInput: Locator;
    private readonly filterButton: Locator;
    private readonly customerTableRows: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.usernameInput = page.locator('#input-username');
        this.passwordInput = page.locator('#input-password');
        this.loginButton = page.locator('button[type="submit"]');
        this.securityModalClose = page.locator('#modal-security .close, [data-dismiss="modal"]').first();
        this.filterNameInput = page.locator('#input-name');
        this.filterEmailInput = page.locator('#input-email');
        this.filterButton = page.locator('#button-filter');
        this.customerTableRows = page.locator('.table-bordered tbody tr');
    }

    /**
     * Extracts the user_token from the current page URL
     */
    private async extractUserToken(): Promise<string> {
        const url = this.page.url();
        const match = url.match(/user_token=([a-zA-Z0-9_-]+)/);
        return match ? match[1] : '';
    }

    /**
     * Navigates to the admin login page
     */
    async navigateToLogin(): Promise<void> {
        const baseUrl = process.env.WEB_APP_URL || 'http://localhost/opencart/upload/';
        await this.page.goto(baseUrl + 'admin/index.php', { waitUntil: 'load', timeout: 20000 });
    }

    /**
     * Logs into the admin panel
     * @param username - Admin username
     * @param password - Admin password
     */
    async login(username: string, password: string): Promise<void> {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
        // Wait for the dashboard URL to load with user_token
        await this.page.waitForURL(/route=common\/dashboard.*user_token=/, { timeout: 15000 });
        this.userToken = await this.extractUserToken();
    }

    /**
     * Returns the stored user_token for direct URL navigation
     */
    getUserToken(): string {
        return this.userToken;
    }

    /**
     * Dismisses the security modal if it appears
     */
    async dismissSecurityModal(): Promise<void> {
        try {
            await this.securityModalClose.waitFor({ state: 'visible', timeout: 3000 });
            await this.securityModalClose.click();
            await this.page.waitForTimeout(500);
        } catch {
            // Modal may not appear
        }
    }

    /**
     * Navigates to the Customers list page with optional email filter via URL
     * @param filterEmail - Optional email to filter customers by
     */
    async navigateToCustomers(filterEmail?: string): Promise<void> {
        // Ensure we have a user_token
        if (!this.userToken) {
            this.userToken = await this.extractUserToken();
        }
        const baseUrl = process.env.WEB_APP_URL || 'http://localhost/opencart/upload/';
        let url = `${baseUrl}admin/index.php?route=customer/customer&user_token=${this.userToken}`;
        if (filterEmail) {
            url += `&filter_email=${encodeURIComponent(filterEmail)}`;
        }
        await this.page.goto(url, { waitUntil: 'load', timeout: 20000 });
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Filters customers by email using URL parameter
     * @param email - Customer email to search
     */
    async filterCustomerByEmail(email: string): Promise<void> {
        if (!this.userToken) {
            this.userToken = await this.extractUserToken();
        }
        const baseUrl = process.env.WEB_APP_URL || 'http://localhost/opencart/upload/';
        const url = `${baseUrl}admin/index.php?route=customer/customer&user_token=${this.userToken}&filter_email=${encodeURIComponent(email)}`;
        await this.page.goto(url, { waitUntil: 'load', timeout: 20000 });
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Checks if a customer exists in the table by email
     * @param email - Customer email to find
     * @returns Promise<boolean> - true if customer is found
     */
    async isCustomerFoundByEmail(email: string): Promise<boolean> {
        try {
            const row = this.customerTableRows.filter({ hasText: email }).first();
            return await row.isVisible({ timeout: 5000 });
        } catch {
            return false;
        }
    }

    /**
     * Gets customer details from the table by email
     * @param email - Customer email to look up
     * @returns Customer details or null
     */
    async getCustomerDetailsByEmail(email: string): Promise<{ name: string; email: string; status: string; customerGroup: string } | null> {
        try {
            const row = this.customerTableRows.filter({ hasText: email }).first();
            const isVisible = await row.isVisible({ timeout: 5000 });
            if (!isVisible) return null;

            const cells = row.locator('td');
            const name = (await cells.nth(1).textContent()) || '';
            const rowEmail = (await cells.nth(2).textContent()) || '';
            const customerGroup = (await cells.nth(3).textContent()) || '';
            const status = (await cells.nth(4).textContent()) || '';

            return {
                name: name.trim(),
                email: rowEmail.trim(),
                customerGroup: customerGroup.trim(),
                status: status.trim()
            };
        } catch {
            return null;
        }
    }
}