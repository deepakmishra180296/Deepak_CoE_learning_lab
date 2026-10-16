import {test, expect} from '@playwright/test';

test('Login with valid credentials', async ({request}) => {
    const response = await request.post('https://reqres.in/api/login', {
        data: {
            username: 'eve.holt@reqres.in',
            password: 'cityslicka'
        }
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('token');
    expect(body.token).toBeTruthy();
    console.log('Login successful, token:', body.token);
});