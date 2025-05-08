import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest/presets/js-with-ts",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "\\.(css|scss|sass)$": "identity-obj-proxy",
  },
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: "./tsconfig.test.json", // ou tsconfig.app.json
      },
    ],
  },
  testMatch: ["**/__tests__/**/*.(test|spec).(ts|tsx)"],
};

export default config;
