// src/__mocks__/axios.ts
import { jest } from "@jest/globals";

const axios = {
  create: () => axios,
  post: jest.fn(),
  get: jest.fn(),
  patch: jest.fn(),
};

export default axios;
