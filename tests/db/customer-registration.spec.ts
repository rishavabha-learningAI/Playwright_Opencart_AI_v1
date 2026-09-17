/**
 * Test Case: OpenCart Customer Registration - Frontend + Admin + DB Validation
 *
 * Tags: @master @e2e @db
 */

import { test, expect } from '../../fixtures/pageFixtures';
import { RandomDataUtil } from '../../utils/dataGenerator';
import { executeQuery } from '../../utils/dbClient';
import { AdminPage } from '../../pages/AdminPage';
import dotenv from 'dotenv';

dotenv.config();

const APP_URL = process.env.WEB_APP_URL || 'http://localhost/opencart/upload/';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin';

test.describe('OpenCart Customer Registration - 3-Layer Validation @master @e2e @db', () => {

    let testUser: {
        firstName: string;
        lastName: string;
        email: string;
        telephone: string;
        password: string;
    };

    test.beforeEach(() => {
        testUser = {
            firstName: RandomDataUtil.getFirstName(),
            lastName: RandomDataUtil.getLastName(),
            email: RandomDataUtil.getEmail(),
            telephone: RandomDataUtil.getPhoneNumber(),
            password: RandomDataUtil.getPassword(12),
        };
    });

    test('Frontend registration + Admin verification + DB validation @master @e2e @db', async ({ page, registerPage, accountPage }) => {

        // ---------------------------------------------------------
        // Step 1: Register a Customer Through the Frontend
        // ---------------------------------------------------------
        await test.step('1) Register a new customer through the frontend', async () => {
            await page.goto(APP_URL + 'index.php?route=account/register', { waitUntil: 'load', timeout: 20000 });
            await page.waitForSelector('input[placeholder="First Name"]', { timeout: 10000 });

            const heading = await registerPage.getHeading();
            expect(heading).toContain('Register Account');

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
        // Step 2: Verify Successful Registration
        // ---------------------------------------------------------
        await test.step('2) Verify registration success', async () => {
            const isSuccess = await accountPage.isRegistrationSuccessMessageVisible();
            expect(isSuccess).toBeTruthy();
        });

        // ---------------------------------------------------------
        // Step 3: Verify the Customer in the Admin Portal
        // ---------------------------------------------------------
        await test.step('3) Verify customer in Admin Portal', async () => {
            await page.goto(APP_URL + 'admin/index.php', { waitUntil: 'load', timeout: 20000 });

            const adminPage = new AdminPage(page);
            await adminPage.login(ADMIN_USERNAME, ADMIN_PASSWORD);
            await page.waitForLoadState('networkidle');

            await adminPage.dismissSecurityModal();
            await adminPage.navigateToCustomers(testUser.email);

            const isFound = await adminPage.isCustomerFoundByEmail(testUser.email);
            expect(isFound).toBeTruthy();

            const customerDetails = await adminPage.getCustomerDetailsByEmail(testUser.email);
            expect(customerDetails).not.toBeNull();
            expect(customerDetails!.name).toContain(testUser.firstName);
            expect(customerDetails!.name).toContain(testUser.lastName);
            expect(customerDetails!.email).toBe(testUser.email);
            expect(customerDetails!.status).toBe('Enabled');
        });

        // ---------------------------------------------------------
        // Step 4: Verify the Customer in MySQL Database
        // ---------------------------------------------------------
        await test.step('4) Verify customer in MySQL database', async () => {
            const rows: any = await executeQuery(
                'SELECT customer_id, firstname, lastname, email, status, date_added FROM oc_customer WHERE email = ?',
                [testUser.email]
            );

            expect(rows.length).toBe(1);

            const customer = rows[0];

            expect(customer.firstname).toBe(testUser.firstName);
            expect(customer.lastname).toBe(testUser.lastName);
            expect(customer.email).toBe(testUser.email);
            expect(customer.status).toBe(1);
            expect(customer.date_added).toBeDefined();
            expect(customer.customer_id).toBeGreaterThan(0);

            console.log(`DB record found: customer_id=${customer.customer_id}, email=${customer.email}`);
        });

        console.log(`3-layer customer registration validation completed for ${testUser.email}`);
    });
});