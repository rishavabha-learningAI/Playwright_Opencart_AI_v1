import { test, expect } from '@playwright/test';
import { RandomDataUtil } from '../../utils/dataGenerator';
import dotenv from 'dotenv';

dotenv.config();

const BASE_URL = process.env.API_BASE_URL || 'https://fakestoreapi.com';

test.describe('Carts API Tests', () => {

    // ---------------------------------------------------------
    // Configuration
    // ---------------------------------------------------------

    const CART_ID = Number(process.env.CART_ID ?? 1);
    const USER_ID = Number(process.env.USER_ID ?? 1);
    const LIMIT = Number(process.env.LIMIT ?? 3);
    const START_DATE = process.env.START_DATE || '2019-12-10';
    const END_DATE = process.env.END_DATE || '2020-10-10';

    // ---------------------------------------------------------
    // GET - All Carts
    // ---------------------------------------------------------

    test('GET - All Carts @master @sanity @api', async ({ request }) => {
        const response = await request.get(`${BASE_URL}/carts`);

        expect(response.status()).toBe(200);

        const responseBody = await response.json();

        expect(Array.isArray(responseBody)).toBeTruthy();
        expect(responseBody.length).toBeGreaterThan(0);
    });

    // ---------------------------------------------------------
    // GET - Cart by ID
    // ---------------------------------------------------------

    test('GET - Cart by ID @master @sanity @api', async ({ request }) => {
        const response = await request.get(`${BASE_URL}/carts/${CART_ID}`);

        expect(response.status()).toBe(200);

        const responseBody = await response.json();

        expect(responseBody.id).toBe(CART_ID);
        expect(responseBody).toHaveProperty('userId');
        expect(responseBody).toHaveProperty('date');
        expect(responseBody).toHaveProperty('products');
        expect(Array.isArray(responseBody.products)).toBeTruthy();
    });

    // ---------------------------------------------------------
    // GET - Carts by Date Range
    // ---------------------------------------------------------

    test('GET - Carts by date range @master @regression @api', async ({ request }) => {
        const response = await request.get(`${BASE_URL}/carts?startdate=${START_DATE}&enddate=${END_DATE}`);

        expect(response.status()).toBe(200);

        const responseBody = await response.json();

        expect(Array.isArray(responseBody)).toBeTruthy();
    });

    // ---------------------------------------------------------
    // GET - User Cart
    // ---------------------------------------------------------

    test('GET - User cart @master @regression @api', async ({ request }) => {
        const response = await request.get(`${BASE_URL}/carts/user/${USER_ID}`);

        expect(response.status()).toBe(200);

        const responseBody = await response.json();

        expect(Array.isArray(responseBody)).toBeTruthy();

        if (responseBody.length > 0) {
            responseBody.forEach((cart: any) => {
                expect(cart.userId).toBe(USER_ID);
            });
        }
    });

    // ---------------------------------------------------------
    // GET - Carts with Limit
    // ---------------------------------------------------------

    test('GET - Carts with limit @master @regression @api', async ({ request }) => {
        const response = await request.get(`${BASE_URL}/carts?limit=${LIMIT}`);

        expect(response.status()).toBe(200);

        const responseBody = await response.json();

        expect(Array.isArray(responseBody)).toBeTruthy();
        expect(responseBody.length).toBe(LIMIT);
    });

    // ---------------------------------------------------------
    // GET - Carts Sorted Ascending
    // ---------------------------------------------------------

    test('GET - Carts sorted ascending @master @regression @api', async ({ request }) => {
        const response = await request.get(`${BASE_URL}/carts?sort=asc`);

        expect(response.status()).toBe(200);

        const responseBody = await response.json();

        expect(Array.isArray(responseBody)).toBeTruthy();
        expect(responseBody.length).toBeGreaterThan(0);

        const ids = responseBody.map((c: any) => c.id);
        for (let i = 1; i < ids.length; i++) {
            expect(ids[i]).toBeGreaterThanOrEqual(ids[i - 1]);
        }
    });

    // ---------------------------------------------------------
    // GET - Carts Sorted Descending
    // ---------------------------------------------------------

    test('GET - Carts sorted descending @master @regression @api', async ({ request }) => {
        const response = await request.get(`${BASE_URL}/carts?sort=desc`);

        expect(response.status()).toBe(200);

        const responseBody = await response.json();

        expect(Array.isArray(responseBody)).toBeTruthy();
        expect(responseBody.length).toBeGreaterThan(0);

        const ids = responseBody.map((c: any) => c.id);
        for (let i = 1; i < ids.length; i++) {
            expect(ids[i]).toBeLessThanOrEqual(ids[i - 1]);
        }
    });

    // ---------------------------------------------------------
    // POST - Create Cart
    // ---------------------------------------------------------

    test('POST - Create cart @master @regression @api', async ({ request }) => {
        const payload = RandomDataUtil.generateCartPayload(USER_ID);
        const response = await request.post(`${BASE_URL}/carts`, { data: payload });

        expect(response.status()).toBe(201);

        const responseBody = await response.json();

        expect(responseBody).toHaveProperty('id');
        expect(responseBody.userId).toBe(USER_ID);
    });

    // ---------------------------------------------------------
    // PUT - Update Cart
    // ---------------------------------------------------------

    test('PUT - Update cart @master @regression @api', async ({ request }) => {
        const payload = RandomDataUtil.generateUpdatedCartPayload(USER_ID);
        const response = await request.put(`${BASE_URL}/carts/${CART_ID}`, { data: payload });

        expect(response.status()).toBe(200);

        const responseBody = await response.json();

        expect(responseBody.id).toBe(CART_ID);
        expect(responseBody.userId).toBe(USER_ID);
    });

    // ---------------------------------------------------------
    // DELETE - Delete Cart
    // ---------------------------------------------------------

    test('DELETE - Delete cart @master @regression @api', async ({ request }) => {
        const response = await request.delete(`${BASE_URL}/carts/${CART_ID}`);

        expect(response.status()).toBe(200);
    });
});