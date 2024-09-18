import { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$', // Regex für Tests
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest', // Transformiert TypeScript-Dateien
  },
  coverageDirectory: './coverage',
  testEnvironment: 'node',
  roots: ['<rootDir>/test/unit', '<rootDir>/test/e2e'], // Pfad zu Testordnern
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
};

export default config;
