import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { vi } from 'vitest'

/**
 * Custom render function that includes router context
 * Use this instead of @testing-library/react's render for components that use routing
 */
export const renderWithRouter = (ui, options = {}) => {
  const { initialEntries = ['/'], ...renderOptions } = options
  
  const Wrapper = ({ children }) => (
    <BrowserRouter>
      {children}
    </BrowserRouter>
  )
  
  return render(ui, { wrapper: Wrapper, ...renderOptions })
}

/**
 * Mock job data for testing
 */
export const mockJob = {
  id: '1',
  title: 'Senior React Developer',
  type: 'Full-Time',
  description: 'We are seeking a talented Front-End Developer to join our team in Boston, MA.',
  location: 'Boston, MA',
  salary: '$70K - $80K',
  company: {
    name: 'NewTek Solutions',
    description: 'NewTek Solutions is a leading technology company.',
    contactEmail: 'contact@teksolutions.com',
    contactPhone: '555-555-5555'
  }
}

export const mockJobs = [
  mockJob,
  {
    id: '2',
    title: 'Frontend Engineer',
    type: 'Remote',
    description: 'Join our team as a Front-End Developer in sunny Miami, FL.',
    location: 'Miami, FL',
    salary: '$70K - $80K',
    company: {
      name: 'Veneer Solutions',
      description: 'Veneer Solutions is a creative agency.',
      contactEmail: 'contact@veneer.com',
      contactPhone: '555-555-5556'
    }
  },
  {
    id: '3',
    title: 'React.js Developer',
    type: 'Part-Time',
    description: 'Are you passionate about front-end development?',
    location: 'Brooklyn, NY',
    salary: '$60K - $70K',
    company: {
      name: 'Dolor Cloud',
      description: 'Dolor Cloud is a leading technology company.',
      contactEmail: 'contact@dolor.com',
      contactPhone: '555-555-5557'
    }
  }
]

/**
 * Mock API responses
 */
export const createMockFetch = (responses) => {
  return vi.fn().mockImplementation((url, options = {}) => {
    const method = options.method || 'GET'
    const key = `${method} ${url}`
    
    const response = responses[key] || responses[url] || { ok: true, json: () => Promise.resolve([]) }
    
    return Promise.resolve({
      ok: response.ok !== false,
      status: response.status || 200,
      json: () => Promise.resolve(response.data || response),
      text: () => Promise.resolve(JSON.stringify(response.data || response))
    })
  })
}

/**
 * Common mock API setup for jobs
 */
export const setupMockAPI = () => {
  const mockFetch = createMockFetch({
    '/api/jobs': { data: mockJobs },
    '/api/jobs?_limit=3': { data: mockJobs.slice(0, 3) },
    '/api/jobs/1': { data: mockJob },
    'POST /api/jobs': { data: { ...mockJob, id: '4' } },
    'PUT /api/jobs/1': { data: mockJob },
    'DELETE /api/jobs/1': { data: {} }
  })
  
  global.fetch = mockFetch
  return mockFetch
}

/**
 * Helper to wait for async operations in tests
 */
export const waitFor = (callback, options = {}) => {
  return new Promise((resolve, reject) => {
    const { timeout = 1000, interval = 50 } = options
    const startTime = Date.now()
    
    const check = () => {
      try {
        const result = callback()
        if (result) {
          resolve(result)
          return
        }
      } catch (error) {
        // Callback not ready yet
      }
      
      if (Date.now() - startTime >= timeout) {
        reject(new Error('Timeout waiting for condition'))
        return
      }
      
      setTimeout(check, interval)
    }
    
    check()
  })
}