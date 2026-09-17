import { test, expect } from '@playwright/test';
import { RandomDataUtil } from '../../utils/dataGenerator';
import dotenv from 'dotenv';

dotenv.config();

const BASE_URL = process.env.API_BASE_URL || 'https://fakestoreapi.com';

test.describe('Users API Tests', () => {

    // ---------------------------------------------------------
    // Configuration
    // ---------------------------------------------------------

    const USER_ID = Number(process.env.USER_ID ?? 1);
    const LIMIT = Number(process.env.LIMIT ?? 3);

    // ---------------------------------------------------------
    // GET - All Users
    // ---------------------------------------------------------

    test('GET - All Users @master @sanity @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}/users`);

        expect(response.status()).toBe(200);

        const responseBody = await response.json();

        expect(Array.isArray(responseBody)).toBeTruthy();
        expect(responseBody.length).toBeGreaterThan(0);
    });

    // ---------------------------------------------------------
    // GET - User by ID
    // ---------------------------------------------------------

    test('GET - User by ID @master @sanity @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}/users/${USER_ID}`);

        expect(response.status()).toBe(200);

        const responseBody = await response.json();

        expect(responseBody.id).toBe(USER_ID);
        expect(responseBody).toHaveProperty('email');
        expect(responseBody).toHaveProperty('username');
        expect(responseBody).toHaveProperty('name');
    });

    // ---------------------------------------------------------
    // GET - Users with Limit
    // ---------------------------------------------------------

    test('GET - Users with limit @master @regression @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}/users?limit=${LIMIT}`);

        expect(response.status()).toBe(200);

        const responseBody = await response.json();

        expect(Array.isArray(responseBody)).toBeTruthy();
        expect(responseBody.length).toBe(LIMIT);
    });

    // ---------------------------------------------------------
    // GET - Users Sorted Ascending
    // ---------------------------------------------------------

    test('GET - Users sorted ascending @master @regression @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}/users?sort=asc`);

        expect(response.status()).toBe(200);

        const responseBody = await response.json();

        expect(Array.isArray(responseBody)).toBeTruthy();
        expect(responseBody.length).toBeGreaterThan(0);

        const ids = responseBody.map((u: any) => u.id);
        for (let i = 1; i < ids.length; i++) {
            expect(ids[i]).toBeGreaterThanOrEqual(ids[i - 1]);
        }
    });

    // ---------------------------------------------------------
    // GET - Users Sorted Descending
    // ---------------------------------------------------------

    test('GET - Users sorted descending @master @regression @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}/users?sort=desc`);

        expect(response.status()).toBe(200);

        const responseBody = await response.json();

        expect(Array.isArray(responseBody)).toBeTruthy();
        expect(responseBody.length).toBeGreaterThan(0);

        const ids = responseBody.map((u: any) => u.id);
        for (let i = 1; i < ids.length; i++) {
            expect(ids[i]).toBeLessThanOrEqual(ids[i - 1]);
        }
    });

    // ---------------------------------------------------------
    // POST - Create User
    // ---------------------------------------------------------

    test('POST - Create user @master @regression @api', async ({ request }) => {

        const payload = RandomDataUtil.generateUserPayload();

        const response = await request.post(`${BASE_URL}/users`, { data: payload });

        expect(response.status()).toBe(201);

        const responseBody = await response.json();

        expect(responseBody).toHaveProperty('id');
        expect(typeof responseBody.id).toBe('number');
    });

    // ---------------------------------------------------------
    // PUT - Update User
    // ---------------------------------------------------------

    test('PUT - Update user @master @regression @api', async ({ request }) => {

        const payload = RandomDataUtil.generateUserUpdatePayload();

        const response = await request.put(`${BASE_URL}/users/${USER_ID}`, { data: payload });

        expect(response.status()).toBe(200);

        const responseBody = await response.json();

        expect(responseBody.email).toBe(payload.email);
        expect(responseBody.username).toBe(payload.username);
    });

    // ---------------------------------------------------------
    // DELETE - Delete User
    // ---------------------------------------------------------

    test('DELETE - Delete user @master @regression @api', async ({ request }) => {

        const response = await request.delete(`${BASE_URL}/users/${USER_ID}`);

        expect(response.status()).toBe(200);
    });
});