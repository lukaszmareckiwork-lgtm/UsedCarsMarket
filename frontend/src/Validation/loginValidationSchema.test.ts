import { loginValidationSchema } from "./loginValidationSchema";

describe('loginValidationSchema', () => {
  test('accepts a valid login payload', async () => {
    await expect(
      loginValidationSchema.validate({
        email: 'john@example.com',
        password: 'secret123',
      })
    ).resolves.toBeDefined();
  });
});
