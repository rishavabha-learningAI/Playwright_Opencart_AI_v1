import { test, expect } from '@playwright/test';
import { RandomDataUtil } from '../../utils/dataGenerator';
import dotenv from 'dotenv';

dotenv.config();

const BASE_URL = process.env.API_BASE_URL || 'https://fakestoreapi.com';

test.describe('Products API Tests', () => {

    // ---------------------------------------------------------
    // Configuration
    // ---------------------------------------------------------

    const PRODUCT_ID = Number(process.env.PRODUCT_ID ?? 1);
    const LIMIT = Number(process.env.LIMIT ?? 3);

    // ---------------------------------------------------------
    // GET - All Products
    // ---------------------------------------------------------

    test('GET - All Products @master @sanity @api', async ({ request }) => {
        const response = await request.get(`${BASE_URL}/products`);

        expect(response.status()).toBe(200);

        const responseBody = await response.json();

        expect(Array.isArray(responseBody)).toBeTruthy();
        expect(responseBody.length).toBeGreaterThan(0);

        const product = responseBody[0];
        expect(product).toHaveProperty('id');
        expect(product).toHaveProperty('title');
        expect(product).toHaveProperty('price');
        expect(product).toHaveProperty('category');
        expect(product).toHaveProperty('image');
    });

    // ---------------------------------------------------------
    // GET - Product by ID
    // ---------------------------------------------------------

    test('GET - Product by ID @master @sanity @api', async ({ request }) => {
        const response = await request.get(`${BASE_URL}/products/${PRODUCT_ID}`);

        expect(response.status()).toBe(200);

        const responseBody = await response.json();

        expect(responseBody.id).toBe(PRODUCT_ID);
        expect(responseBody).toHaveProperty('title');
        expect(responseBody).toHaveProperty('price');
        expect(responseBody).toHaveProperty('description');
        expect(responseBody).toHaveProperty('category');
        expect(responseBody).toHaveProperty('image');
    });

    // ---------------------------------------------------------
    // GET - Products with Limit
    // ---------------------------------------------------------

    test('GET - Products with limit @master @regression @api', async ({ request }) => {
        const response = await request.get(`${BASE_URL}/products?limit=${LIMIT}`);

        expect(response.status()).toBe(200);

        const responseBody = await response.json();

        expect(Array.isArray(responseBody)).toBeTruthy();
        expect(responseBody.length).toBe(LIMIT);
    });

    // ---------------------------------------------------------
    // GET - Products Sorted Ascending
    // ---------------------------------------------------------

    test('GET - Products sorted ascending @master @regression @api', async ({ request }) => {
        const response = await request.get(`${BASE_URL}/products?sort=asc`);

        expect(response.status()).toBe(200);

        const responseBody = await response.json();

        expect(Array.isArray(responseBody)).toBeTruthy();
        expect(responseBody.length).toBeGreaterThan(0);

        const ids = responseBody.map((p: any) => p.id);
        for (let i = 1; i < ids.length; i++) {
            expect(ids[i]).toBeGreaterThanOrEqual(ids[i - 1]);
        }
    });

    // ---------------------------------------------------------
    // GET - Products Sorted Descending
    // ---------------------------------------------------------

    test('GET - Products sorted descending @master @regression @api', async ({ request }) => {
        const response = await request.get(`${BASE_URL}/products?sort=desc`);

        expect(response.status()).toBe(200);

        const responseBody = await response.json();

        expect(Array.isArray(responseBody)).toBeTruthy();
        expect(responseBody.length).toBeGreaterThan(0);

        const ids = responseBody.map((p: any) => p.id);
        for (let i = 1; i < ids.length; i++) {
            expect(ids[i]).toBeLessThanOrEqual(ids[i - 1]);
        }
    });

    // ---------------------------------------------------------
    // GET - All Categories
    // ---------------------------------------------------------

    test('GET - All categories @master @regression @api', async ({ request }) => {
        const response = await request.get(`${BASE_URL}/products/categories`);

        expect(response.status()).toBe(200);

        const responseBody = await response.json();

        expect(Array.isArray(responseBody)).toBeTruthy();
        expect(responseBody.length).toBeGreaterThan(0);
    });

    // ---------------------------------------------------------
    // GET - Products by Category
    // ---------------------------------------------------------

    test('GET - Products by category @master @regression @api', async ({ request }) => {
        const category = 'electronics';
        const response = await request.get(`${BASE_URL}/products/category/${category}`);

        expect(response.status()).toBe(200);

        const responseBody = await response.json();

        expect(Array.isArray(responseBody)).toBeTruthy();
        expect(responseBody.length).toBeGreaterThan(0);

        responseBody.forEach((product: any) => {
            expect(product.category).toBe(category);
        });
    });

    // ---------------------------------------------------------
    // POST - Create Product
    // ---------------------------------------------------------

    test('POST - Create product @master @regression @api', async ({ request }) => {
        const payload = RandomDataUtil.generateProductPayload();
        const response = await request.post(`${BASE_URL}/products`, { data: payload });

        expect(response.status()).toBe(201);

        const responseBody = await response.json();

        expect(responseBody).toHaveProperty('id');
        expect(responseBody.title).toBe(payload.title);
        expect(Number(responseBody.price)).toBe(payload.price);
    });

    // ---------------------------------------------------------
    // PUT - Update Product
    // ---------------------------------------------------------

    test('PUT - Update product @master @regression @api', async ({ request }) => {
        const payload = RandomDataUtil.generateUpdatedProductPayload();
        const response = await request.put(`${BASE_URL}/products/${PRODUCT_ID}`, { data: payload });

        expect(response.status()).toBe(200);

        const responseBody = await response.json();

        expect(responseBody.id).toBe(PRODUCT_ID);
        expect(responseBody.title).toBe(payload.title);
        expect(Number(responseBody.price)).toBe(payload.price);
    });

    // ---------------------------------------------------------
    // DELETE - Delete Product
    // ---------------------------------------------------------

    test('DELETE - Delete product @master @regression @api', async ({ request }) => {
        const response = await request.delete(`${BASE_URL}/products/${PRODUCT_ID}`);

        expect(response.status()).toBe(200);
    });
});