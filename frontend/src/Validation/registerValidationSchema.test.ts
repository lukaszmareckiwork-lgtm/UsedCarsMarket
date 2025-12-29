import { registerValidationSchema } from "./registerValidationSchema";

describe('registerValidationSchema', () => {
  describe('username', () => {
    test('accepts a valid username', async () => {
      await expect(
        registerValidationSchema.validateAt('username', {
          username: 'john_doe.123',
        })
      ).resolves.toBeDefined();
    });

    test('rejects usernames shorter than 3 characters', async () => {
      await expect(
        registerValidationSchema.validateAt('username', {
          username: 'jo',
        })
      ).rejects.toThrow();
    });

    test('rejects usernames longer than 20 characters', async () => {
      await expect(
        registerValidationSchema.validateAt('username', {
          username: 'a'.repeat(21),
        })
      ).rejects.toThrow();
    });

    test('rejects usernames that do not start with a letter', async () => {
      await expect(
        registerValidationSchema.validateAt('username', {
          username: '1john',
        })
      ).rejects.toThrow();
    });

    test('rejects usernames with consecutive dots or underscores', async () => {
      await expect(
        registerValidationSchema.validateAt('username', {
          username: 'john__doe',
        })
      ).rejects.toThrow();
    });

    test('rejects usernames ending with a dot or underscore', async () => {
      await expect(
        registerValidationSchema.validateAt('username', {
          username: 'john_',
        })
      ).rejects.toThrow();
    });
  });

  describe('phone', () => {
    test('accepts and normalizes a valid phone number', async () => {
      const result = await registerValidationSchema.validateAt('phone', {
        phone: '+1 (234) 567-8901',
      });

      expect(result).toBe('+12345678901');
    });

    test('rejects invalid phone numbers', async () => {
      await expect(
        registerValidationSchema.validateAt('phone', {
          phone: '123',
        })
      ).rejects.toThrow();
    });
  });

  describe('sellerType', () => {
    test('accepts a valid seller type', async () => {
      await expect(
        registerValidationSchema.validateAt('sellerType', {
          sellerType: 1,
        })
      ).resolves.toBeDefined();
    });

    test('rejects missing seller type', async () => {
      await expect(
        registerValidationSchema.validateAt('sellerType', {})
      ).rejects.toThrow();
    });
  });

  describe('full form', () => {
    test('accepts a fully valid registration payload', async () => {
      await expect(
        registerValidationSchema.validate({
          username: 'john_doe',
          email: 'john@example.com',
          phone: '+49123456789',
          sellerType: 1,
          password: 'secret123',
        })
      ).resolves.toBeDefined();
    });
  });
});
