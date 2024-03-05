const nextJest = require('next/jest');

/** @type {import('jest').Config} */
const createJestConfig = nextJest({
    // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
    dir: './',
});

// Add any custom config to be passed to Jest
const customJestConfig = {
    coverageProvider: 'v8',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    testEnvironment: 'jest-environment-jsdom',
    preset: 'ts-jest',
    collectCoverage: true, // Enable coverage collection
    coverageReporters: ['json', 'lcov', 'text', 'text-summary'], // Specify coverage reporters
    coverageThreshold: { // Optional: Set minimum coverage thresholds to enforce for each file
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80,
        },
    },
    collectCoverageFrom: [ // Define which files to include in coverage
        '**/*{js,jsx,ts,tsx}',
        '!**/app/api/**',
        '!**/app/layout.tsx',
        '!**/app/components/Navbars/MobileHeader.tsx',
        '!**/app/components/Navbars/SideNav.tsx',
        '!**/app/layout.tsx',
        '!**/app/constants/types.ts',
        '!**/app/dashboard/layout.tsx',
        '!**/app/dashboard/page.tsx',
        '!**/.next/**',
        '!**/*.d.ts',
        '!**/node_modules/**',
        '!**/public/**',
        '!**/*.config.js',
        '!**/*.config.mjs',
        '!**/*.config.ts',
        '!**/coverage/**',
    ],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
