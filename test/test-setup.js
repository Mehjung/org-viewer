// tests/e2e/test-setup.js
import { beforeAll, afterAll } from "vitest";
import { setup, teardown } from "./setup.js";

beforeAll(async () => {
  await setup();
});

afterAll(async () => {
  await teardown();
});
