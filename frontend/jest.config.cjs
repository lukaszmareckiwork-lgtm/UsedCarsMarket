
/** @type {import('jest').Config} */
module.exports = {
  // Use jsdom so React Testing Library works with the DOM APIs
  testEnvironment: 'jsdom',
  // Use ts-jest as the transformer and provide its config via the transform entry
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.jest.json', diagnostics: { warnOnly: true } }],
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  // Note: ts-jest config is provided in the transform entry (recommended)
  moduleNameMapper: {
    // mock style imports
    '\\.(css|less|scss|sass)$': '<rootDir>/jest.style.mock.js',
  },
};