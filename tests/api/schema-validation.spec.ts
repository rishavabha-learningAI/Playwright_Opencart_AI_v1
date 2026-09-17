import { test, expect } from '@playwright/test';
import { DataProvider } from '../../utils/DataReader';
import Ajv from 'ajv';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const BASE_URL = process.env.API_BASE_URL || 'https://fakestoreapi.com';
const PRODUCT_ID = Number(process.env.PRODUCT_ID ?? 1);
const USER_ID = Number(process.env.USER_ID ?? 1);
const CART_ID = Number(process.env.CART_ID ?? 1);

const ajv = new Ajv();

test.describe('JSON Schema Validation Tests', () => {

    // ---------------------------------------------------------
    // Product Response Schema
    // ---------------------------------------------------------

    test('Product response schema validation @master @regression @api', async ({ request }) => {
        const response = await request.get(`${BASE_URL}/products/${PRODUCT_ID}`);
        expect(response.status()).toBe(200);

        const responseBody = await response.json();

        const schema = DataProvider.readJson(path.resolve(__dirname, '../../api/schemas/product_api_schema.json'));
        const validate = ajv.compile(schema);
        const isValid = validate(responseBody);

        if (!isValid) {
            console.log('Product schema validation errors:', JSON.stringify(validate.errors, null, 2));
        }

        expect(isValid).toBeTruthy();
    });

    // ---------------------------------------------------------
    // User Response Schema
    // ---------------------------------------------------------

    test('User response schema validation @master @regression @api', async ({ request }) => {
        const response = await request.get(`${BASE_URL}/users/${USER_ID}`);
        expect(response.status()).toBe(200);

        const responseBody = await response.json();

        const schema = DataProvider.readJson(path.resolve(__dirname, '../../api/schemas/user_api_schema.json'));
        const validate = ajv.compile(schema);
        const isValid = validate(responseBody);

        if (!isValid) {
            console.log('User schema validation errors:', JSON.stringify(validate.errors, null, 2));
        }

        expect(isValid).toBeTruthy();
    });

    // ---------------------------------------------------------
    // Cart Response Schema
    // ---------------------------------------------------------

    test('Cart response schema validation @master @regression @api', async ({ request }) => {
        const response = await request.get(`${BASE_URL}/carts/${CART_ID}`);
        expect(response.status()).toBe(200);

        const responseBody = await response.json();

        const schema = DataProvider.readJson(path.resolve(__dirname, '../../api/schemas/cart_api_schema.json'));
        const validate = ajv.compile(schema);
        const isValid = validate(responseBody);

        if (!isValid) {
            console.log('Cart schema validation errors:', JSON.stringify(validate.errors, null, 2));
        }

        expect(isValid).toBeTruthy();
    });
});