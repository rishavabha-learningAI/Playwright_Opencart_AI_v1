import { test, expect } from '@playwright/test';
import { RandomDataUtil } from '../../utils/dataGenerator';
import dotenv from 'dotenv';

dotenv.config();

const BASE_URL = process.env.API_BASE_URL || 'https://fakestoreapi.com';

test.describe('E2E API Workflow Tests', () => {

    // ---------------------------------------------------------
    // Product CRUD Workflow
    // ---------------------------------------------------------

    test('Product CRUD workflow @master @e2e @api', async ({ request }) => {

        // 1) Create a product
        const createPayload = RandomDataUtil.generateProductPayload();
        const createResponse = await request.post(`${BASE_URL}/products`, { data: createPayload });
        //expect(createResponse.status()).toBe(201);

        const createdProduct = await createResponse.json();
        expect(createdProduct).toHaveProperty('id');

        const productId = createdProduct.id;

        // 2) Update the same product
        const updatePayload = RandomDataUtil.generateUpdatedProductPayload();
        const updateResponse = await request.put(`${BASE_URL}/products/${productId}`, { data: updatePayload });
        expect(updateResponse.status()).toBe(200);

        const updatedProduct = await updateResponse.json();
        expect(updatedProduct.id).toBe(productId);
        expect(updatedProduct.title).toBe(updatePayload.title);

        // 3) Delete the same product
        const deleteResponse = await request.delete(`${BASE_URL}/products/${productId}`);
        expect(deleteResponse.status()).toBe(200);
    });

    // ---------------------------------------------------------
    // User CRUD Workflow
    // ---------------------------------------------------------

    test('User CRUD workflow @master @e2e @api', async ({ request }) => {

        // 1) Create a user
        const createPayload = RandomDataUtil.generateUserPayload();
        const createResponse = await request.post(`${BASE_URL}/users`, { data: createPayload });
        expect(createResponse.status()).toBe(201);

        const createdUser = await createResponse.json();
        expect(createdUser).toHaveProperty('id');

        const userId = createdUser.id;

        // 2) Update the same user
        const updatePayload = RandomDataUtil.generateUserUpdatePayload();
        const updateResponse = await request.put(`${BASE_URL}/users/${userId}`, { data: updatePayload });
        expect(updateResponse.status()).toBe(200);

        const updatedUser = await updateResponse.json();
        expect(updatedUser.username).toBe(updatePayload.username);

        // 3) Delete the same user
        const deleteResponse = await request.delete(`${BASE_URL}/users/${userId}`);
        expect(deleteResponse.status()).toBe(200);
    });

    // ---------------------------------------------------------
    // Cart CRUD Workflow
    // ---------------------------------------------------------

    test('Cart CRUD workflow @master @e2e @api', async ({ request }) => {

        const userId = Number(process.env.USER_ID ?? 1);

        // 1) Create a cart
        const createPayload = RandomDataUtil.generateCartPayload(userId);
        const createResponse = await request.post(`${BASE_URL}/carts`, { data: createPayload });
        expect(createResponse.status()).toBe(201);

        const createdCart = await createResponse.json();
        expect(createdCart).toHaveProperty('id');
        expect(createdCart.userId).toBe(userId);

        const cartId = createdCart.id;

        // 2) Update the same cart
        const updatePayload = RandomDataUtil.generateUpdatedCartPayload(userId);
        const updateResponse = await request.put(`${BASE_URL}/carts/${cartId}`, { data: updatePayload });
        expect(updateResponse.status()).toBe(200);

        const updatedCart = await updateResponse.json();
        expect(updatedCart.id).toBe(cartId);
        expect(updatedCart.userId).toBe(userId);

        // 3) Delete the same cart
        const deleteResponse = await request.delete(`${BASE_URL}/carts/${cartId}`);
        expect(deleteResponse.status()).toBe(200);
    });
});