# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api\auth-api.spec.ts >> Authentication API Tests >> POST - Successful Login @master @sanity @api
- Location: tests\api\auth-api.spec.ts:14:9

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 200
Received: 401
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import dotenv from 'dotenv';
  3  | 
  4  | dotenv.config();
  5  | 
  6  | const BASE_URL = process.env.API_BASE_URL || 'https://fakestoreapi.com';
  7  | 
  8  | test.describe('Authentication API Tests', () => {
  9  | 
  10 |     // ---------------------------------------------------------
  11 |     // POST - Successful Login
  12 |     // ---------------------------------------------------------
  13 | 
  14 |     test('POST - Successful Login @master @sanity @api', async ({ page }) => {
  15 | 
  16 |         const response = await page.request.post(`${BASE_URL}/auth/login`, {
  17 |             data: {
  18 |                 username: process.env.USERNAME || 'mor_2314',
  19 |                 password: process.env.PASSWORD || '83r5^_'
  20 |             }
  21 |         });
  22 | 
  23 |         const responseStatus = response.status();
  24 |         const responseBody = await response.text();
  25 | 
  26 |         console.log(`Auth Login - Status: ${responseStatus}, Body: ${responseBody.substring(0, 100)}`);
  27 | 
> 28 |         expect(responseStatus).toBe(200);
     |                                ^ Error: expect(received).toBe(expected) // Object.is equality
  29 | 
  30 |         const parsedBody = JSON.parse(responseBody);
  31 | 
  32 |         expect(parsedBody).toHaveProperty('token');
  33 |         expect(typeof parsedBody.token).toBe('string');
  34 |         expect(parsedBody.token.length).toBeGreaterThan(0);
  35 |     });
  36 | 
  37 |     // ---------------------------------------------------------
  38 |     // POST - Invalid Login
  39 |     // ---------------------------------------------------------
  40 | 
  41 |     test('POST - Invalid Login @master @regression @api', async ({ page }) => {
  42 | 
  43 |         const response = await page.request.post(`${BASE_URL}/auth/login`, {
  44 |             data: {
  45 |                 username: 'invalid_user_12345',
  46 |                 password: 'wrong_password_67890'
  47 |             }
  48 |         });
  49 | 
  50 |         expect(response.status()).toBe(401);
  51 | 
  52 |         // The API returns plain text for 401, not JSON
  53 |         const responseBody = await response.text();
  54 |         expect(responseBody.toLowerCase()).toContain('incorrect');
  55 |     });
  56 | });
```