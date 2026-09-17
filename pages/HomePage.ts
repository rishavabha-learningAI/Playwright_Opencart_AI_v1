import { Page, Locator } from '@playwright/test';

export class HomePage {
    private readonly page: Page;

    // Locators
    private readonly myAccountLink: Locator;
    private readonly registerLinkInDropdown: Locator;
    private readonly loginLinkInDropdown: Locator;
    private readonly searchBox: Locator;
    private readonly searchButton: Locator;
    private readonly cartTotalButton: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators
        this.myAccountLink = page.locator('.list-inline a:has(span:has-text("My Account"))');
        this.registerLinkInDropdown = page.locator('.dropdown-menu li a:has-text("Register")');
        this.loginLinkInDropdown = page.locator('.dropdown-menu li a:has-text("Login")');
        this.searchBox = page.getByPlaceholder('Search');
        this.searchButton = page.locator('#search button');
        this.cartTotalButton = page.locator('#cart-total');
    }

    /**
     * Navigates to the home page
     */
    async navigate(): Promise<void> {
        await this.page.goto(process.env.WEB_APP_URL || 'http://localhost/opencart/upload/');
    }

    /**
     * Clicks the My Account dropdown to expand it
     */
    async clickMyAccount(): Promise<void> {
        await this.myAccountLink.hover();
        await this.myAccountLink.click();
    }

    /**
     * Clicks the Register link from the My Account dropdown
     */
    async clickRegister(): Promise<void> {
        await this.registerLinkInDropdown.waitFor({ state: 'visible', timeout: 5000 });
        await this.registerLinkInDropdown.click();
    }

    /**
     * Clicks the Login link from the My Account dropdown
     */
    async clickLogin(): Promise<void> {
        await this.loginLinkInDropdown.waitFor({ state: 'visible', timeout: 5000 });
        await this.loginLinkInDropdown.click();
    }

    /**
     * Searches for a product using the search box
     * @param productName - Product name to search
     */
    async searchProduct(productName: string): Promise<void> {
        await this.searchBox.fill(productName);
        await this.searchButton.click();
    }

    /**
     * Clicks the MacBook product link from featured section
     */
    async clickMacBookProduct(): Promise<void> {
        await this.page.getByRole('link', { name: 'MacBook' }).first().click();
    }

    /**
     * Clicks the cart total button in the header to go to cart
     */
    async clickCartButton(): Promise<void> {
        await this.cartTotalButton.click();
    }
}