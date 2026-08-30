/// <reference types="@testing-library/jest-dom" />

import type { TestingLibraryMatchers } from "@testing-library/jest-dom/matchers";

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-object-type -- testing-library's documented vitest matcher augmentation */
declare module "vitest" {
  interface Assertion<T = any>
    extends jest.Matchers<void, T>, TestingLibraryMatchers<T, void> {}
  interface AsymmetricMatchersContaining extends TestingLibraryMatchers<
    any,
    any
  > {}
}
