import { describe, it, expect, vi, beforeEach } from 'vitest'
import { jobsAPI, getErrorType, API_ERRORS } from '../services/jobsAPI'
import { mockJob, mockJobs } from './utils.jsx'

// Mock fetch globally
global.fetch = vi.fn()

describe('jobsAPI Service', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe('getAllJobs', () => {
    it('fetches all jobs without limit', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        headers: { get: () => 'application/json' },
        json: () => Promise.resolve(mockJobs)
      })

      const result = await jobsAPI.getAllJobs()

      expect(fetch).toHaveBeenCalledWith('/api/jobs', {
        headers: { 'Content-Type': 'application/json' }
      })
      expect(result).toEqual(mockJobs)
    })

    it('fetches jobs with limit parameter', async () => {
      const limitedJobs = mockJobs.slice(0, 2)
      fetch.mockResolvedValueOnce({
        ok: true,
        headers: { get: () => 'application/json' },
        json: () => Promise.resolve(limitedJobs)
      })

      const result = await jobsAPI.getAllJobs(2)

      expect(fetch).toHaveBeenCalledWith('/api/jobs?_limit=2', {
        headers: { 'Content-Type': 'application/json' }
      })
      expect(result).toEqual(limitedJobs)
    })
  })

  describe('getJobById', () => {
    it('fetches a specific job by ID', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        headers: { get: () => 'application/json' },
        json: () => Promise.resolve(mockJob)
      })

      const result = await jobsAPI.getJobById('1')

      expect(fetch).toHaveBeenCalledWith('/api/jobs/1', {
        headers: { 'Content-Type': 'application/json' }
      })
      expect(result).toEqual(mockJob)
    })

    it('throws error when ID is not provided', async () => {
      await expect(jobsAPI.getJobById()).rejects.toThrow('Job ID is required')
      expect(fetch).not.toHaveBeenCalled()
    })
  })

  describe('createJob', () => {
    it('creates a new job successfully', async () => {
      const newJob = { ...mockJob, id: undefined }
      const createdJob = { ...mockJob, id: '4' }

      fetch.mockResolvedValueOnce({
        ok: true,
        headers: { get: () => 'application/json' },
        json: () => Promise.resolve(createdJob)
      })

      const result = await jobsAPI.createJob(newJob)

      expect(fetch).toHaveBeenCalledWith('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newJob)
      })
      expect(result).toEqual(createdJob)
    })

    it('throws error when job data is not provided', async () => {
      await expect(jobsAPI.createJob()).rejects.toThrow('Job data is required')
      expect(fetch).not.toHaveBeenCalled()
    })
  })

  describe('updateJob', () => {
    it('updates an existing job successfully', async () => {
      const updatedJob = { ...mockJob, title: 'Updated Title' }

      fetch.mockResolvedValueOnce({
        ok: true,
        headers: { get: () => 'application/json' },
        json: () => Promise.resolve(updatedJob)
      })

      const result = await jobsAPI.updateJob('1', updatedJob)

      expect(fetch).toHaveBeenCalledWith('/api/jobs/1', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedJob)
      })
      expect(result).toEqual(updatedJob)
    })

    it('throws error when ID is not provided', async () => {
      await expect(jobsAPI.updateJob(null, mockJob)).rejects.toThrow('Job ID is required')
      expect(fetch).not.toHaveBeenCalled()
    })

    it('throws error when job data is not provided', async () => {
      await expect(jobsAPI.updateJob('1')).rejects.toThrow('Job data is required')
      expect(fetch).not.toHaveBeenCalled()
    })
  })

  describe('deleteJob', () => {
    it('deletes a job successfully', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        headers: { get: () => null } // No content-type for DELETE
      })

      await jobsAPI.deleteJob('1')

      expect(fetch).toHaveBeenCalledWith('/api/jobs/1', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      })
    })

    it('throws error when ID is not provided', async () => {
      await expect(jobsAPI.deleteJob()).rejects.toThrow('Job ID is required')
      expect(fetch).not.toHaveBeenCalled()
    })
  })

  describe('searchJobs', () => {
    beforeEach(() => {
      fetch.mockResolvedValueOnce({
        ok: true,
        headers: { get: () => 'application/json' },
        json: () => Promise.resolve(mockJobs)
      })
    })

    it('returns all jobs when search term is empty', async () => {
      const result = await jobsAPI.searchJobs('')
      expect(result).toEqual(mockJobs)
    })

    it('filters jobs by title', async () => {
      const result = await jobsAPI.searchJobs('React')
      expect(result).toHaveLength(2) // Two jobs have "React" in title
      expect(result.every(job => job.title.toLowerCase().includes('react'))).toBe(true)
    })

    it('filters jobs by company name', async () => {
      const result = await jobsAPI.searchJobs('NewTek')
      expect(result).toHaveLength(1)
      expect(result[0].company.name).toBe('NewTek Solutions')
    })

    it('filters jobs by location', async () => {
      const result = await jobsAPI.searchJobs('Boston')
      expect(result).toHaveLength(1)
      expect(result[0].location).toBe('Boston, MA')
    })

    it('performs case-insensitive search', async () => {
      const result = await jobsAPI.searchJobs('REACT')
      expect(result.length).toBeGreaterThan(0)
    })
  })

  describe('Error Handling', () => {
    it('handles network errors', async () => {
      fetch.mockRejectedValueOnce(new Error('Failed to fetch'))

      await expect(jobsAPI.getAllJobs()).rejects.toThrow('Failed to fetch')
    })

    it('handles HTTP error responses', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      })

      await expect(jobsAPI.getJobById('999')).rejects.toThrow('API Error: 404 Not Found')
    })

    it('handles non-JSON responses', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        headers: { get: () => 'text/plain' }
      })

      const result = await jobsAPI.deleteJob('1')
      expect(result).toBeDefined()
    })
  })
})

describe('Error Type Detection', () => {
  it('detects network errors', () => {
    const error = new Error('Failed to fetch')
    expect(getErrorType(error)).toBe(API_ERRORS.NETWORK_ERROR)
  })

  it('detects 404 errors', () => {
    const error = new Error('API Error: 404 Not Found')
    expect(getErrorType(error)).toBe(API_ERRORS.NOT_FOUND)
  })

  it('detects validation errors', () => {
    const error = new Error('API Error: 400 Bad Request')
    expect(getErrorType(error)).toBe(API_ERRORS.VALIDATION_ERROR)
  })

  it('detects server errors', () => {
    const error = new Error('API Error: 500 Internal Server Error')
    expect(getErrorType(error)).toBe(API_ERRORS.SERVER_ERROR)
  })

  it('returns unknown error for unrecognized errors', () => {
    const error = new Error('Something weird happened')
    expect(getErrorType(error)).toBe('UNKNOWN_ERROR')
  })
})