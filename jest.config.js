const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
const config = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  moduleFileExtensions: ["ts", "tsx", "js", "json", "node"],

  // модуль для использования алиасов: удобного импорта (вместо ../../../ -> @/src/app)
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },

  // ищем unit and e2e:
  testMatch: [
    "**/?(*.)+(spec|test).ts",
    "<rootDir>/src/__tests__/e2e/**/*.(spec|test).ts",
  ],

  clearMocks: true,
  coverageDirectory: "coverage",

  transform: {
    ...tsJestTransformCfg,
  },
};

module.exports = config;

// ? createDefaultPreset() — створює дефолтні налаштування для ts-jest.
// ? transform — описує, як Jest має трансформувати .ts файли перед виконанням тестів, без цього Jest не зрозуміє TypeScript і впаде з помилкою.
