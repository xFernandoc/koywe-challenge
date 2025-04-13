export default {
    moduleNameMapper: {
        '^src/(.*)$': '<rootDir>/src/$1',
    },
    moduleFileExtensions: [
        "js",
        "json",
        "ts"
    ],
    rootDir: ".",
    testRegex: ".*\\.spec\\.ts$",
    transform: {
        "^.+\\.(t|j)s$": "ts-jest"
    },
    collectCoverageFrom: [
        'src/**/*.{ts,js}',
        "**/*.(t|j)s",
        "!**/*.d.ts",
        '!../dist/**'
    ],
    coverageDirectory: "../coverage",
    testEnvironment: "node",
    coveragePathIgnorePatterns: [
        '/node_modules/',
        '/dist/',
        'jest.config.ts',
        'eslint.config.js',
        ".e2e-spec.ts"
    ],
    testPathIgnorePatterns: [
        '/node_modules/',
        '/dist/',
        'jest.config.ts',
        'eslint.config.js',
        ".e2e-spec.ts"
    ]
};