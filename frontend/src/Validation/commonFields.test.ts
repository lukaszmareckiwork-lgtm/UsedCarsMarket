import { emailField, passwordField } from './commonFields';

describe('emailField', () => {
  test('accepts a valid email', async () => {
    await expect(
      emailField.validate('john@example.com')
    ).resolves.toBeDefined();
  });

  test('rejects invalid email', async () => {
    await expect(
      emailField.validate('not-an-email')
    ).rejects.toThrow();
  });
});

describe('passwordField', () => {
  test('accepts a valid password', async () => {
    await expect(
      passwordField.validate('secret123')
    ).resolves.toBeDefined();
  });

  test('rejects short passwords', async () => {
    await expect(
      passwordField.validate('1234')
    ).rejects.toThrow();
  });
});
