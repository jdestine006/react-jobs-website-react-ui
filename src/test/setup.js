import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach, beforeAll, afterAll, vi } from 'vitest'

// Cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup()
})

// Mock fetch globally for all tests
global.fetch = vi.fn()

// Reset all mocks before each test
beforeEach(() => {
  vi.resetAllMocks()
})

// Mock console.error to reduce noise in tests unless specifically testing error scenarios
const originalError = console.error
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})

// Add any global test utilities or mocks here