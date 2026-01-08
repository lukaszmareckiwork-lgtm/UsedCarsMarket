
/** @type {import('jest').Config} */
module.exports = {
  // Use jsdom so React Testing Library works with the DOM APIs
  testEnvironment: 'jsdom',
  // Use ts-jest as the transformer and provide its config via the transform entry
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.jest.json', diagnostics: { warnOnly: true } }],
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  // Note: ts-jest config is provided in the transform entry (recommended)
  moduleNameMapper: {
    '^@context/(.*)$': '<rootDir>/src/Context/$1',
    '^@components/(.*)$': '<rootDir>/src/Components/$1',
    '^@pages/(.*)$': '<rootDir>/src/Pages/$1',
    '^@helpers/(.*)$': '<rootDir>/src/Helpers/$1',
    '^@validation/(.*)$': '<rootDir>/src/Validation/$1',
    '^@data/(.*)$': '<rootDir>/src/Data/$1',
    '^@routes/(.*)$': '<rootDir>/src/Routes/$1',
    '^@services/(.*)$': '<rootDir>/src/Services/$1',
    '^@models/(.*)$': '<rootDir>/src/Models/$1',
    "^@config/env$": "<rootDir>/src/Config/__mocks__/env.ts",
    '^@config/(.*)$': '<rootDir>/src/Config/$1',
    '\\.(css|less|scss|sass)$': '<rootDir>/jest.style.mock.js',
  },
  transformIgnorePatterns: ['node_modules/'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/']
};