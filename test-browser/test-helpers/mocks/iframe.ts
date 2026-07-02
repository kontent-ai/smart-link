// Mock for src/utils/iframe, applied via
// vi.mock("../../src/utils/iframe", () => import("../test-helpers/mocks/iframe")).
// sendMessage and Web Spotlight detection refuse to run outside an iframe;
// tests use this to pretend they are always inside one.
export const isInsideIFrame = (): boolean => true;
