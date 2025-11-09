/**
 * Jobs API Service Layer
 * Centralized API functions for all job-related operations
 * Handles error management, response parsing, and consistent data flow
 */

const API_BASE_URL = '/api';

/**
 * Generic API request handler with error management
 * @param {string} endpoint - API endpoint
 * @param {object} options - Fetch options (method, headers, body)
 * @returns {Promise} - API response data
 */
const apiRequest = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    // Check if response is ok
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    // Handle different response types
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    
    return response;
  } catch (error) {
    console.error(`API Request Failed: ${endpoint}`, error);
    throw error;
  }
};

/**
 * Job API Operations
 */
export const jobsAPI = {
  /**
   * Get all jobs with optional limit
   * @param {number} limit - Optional limit for number of jobs
   * @returns {Promise<Array>} - Array of job objects
   */
  getAllJobs: async (limit = null) => {
    const endpoint = limit ? `/jobs?_limit=${limit}` : '/jobs';
    return await apiRequest(endpoint);
  },

  /**
   * Get a specific job by ID
   * @param {string} id - Job ID
   * @returns {Promise<object>} - Job object
   */
  getJobById: async (id) => {
    if (!id) throw new Error('Job ID is required');
    return await apiRequest(`/jobs/${id}`);
  },

  /**
   * Create a new job
   * @param {object} jobData - Job data object
   * @returns {Promise<object>} - Created job object
   */
  createJob: async (jobData) => {
    if (!jobData) throw new Error('Job data is required');
    
    return await apiRequest('/jobs', {
      method: 'POST',
      body: JSON.stringify(jobData),
    });
  },

  /**
   * Update an existing job
   * @param {string} id - Job ID
   * @param {object} jobData - Updated job data
   * @returns {Promise<object>} - Updated job object
   */
  updateJob: async (id, jobData) => {
    if (!id) throw new Error('Job ID is required');
    if (!jobData) throw new Error('Job data is required');
    
    return await apiRequest(`/jobs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(jobData),
    });
  },

  /**
   * Delete a job
   * @param {string} id - Job ID
   * @returns {Promise<void>}
   */
  deleteJob: async (id) => {
    if (!id) throw new Error('Job ID is required');
    
    return await apiRequest(`/jobs/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Search jobs by term (client-side filtering for now)
   * In a real backend, this would be a server-side search
   * @param {string} searchTerm - Search term
   * @returns {Promise<Array>} - Filtered job array
   */
  searchJobs: async (searchTerm) => {
    const allJobs = await jobsAPI.getAllJobs();
    
    if (!searchTerm || !searchTerm.trim()) {
      return allJobs;
    }

    const searchLower = searchTerm.toLowerCase();
    return allJobs.filter(job => 
      job.title.toLowerCase().includes(searchLower) ||
      job.description.toLowerCase().includes(searchLower) ||
      job.company.name.toLowerCase().includes(searchLower) ||
      job.location.toLowerCase().includes(searchLower) ||
      job.type.toLowerCase().includes(searchLower)
    );
  }
};

/**
 * Error types for better error handling
 */
export const API_ERRORS = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
};

/**
 * Helper function to determine error type
 * @param {Error} error - Error object
 * @returns {string} - Error type
 */
export const getErrorType = (error) => {
  if (error.message.includes('Failed to fetch')) {
    return API_ERRORS.NETWORK_ERROR;
  }
  if (error.message.includes('404')) {
    return API_ERRORS.NOT_FOUND;
  }
  if (error.message.includes('400')) {
    return API_ERRORS.VALIDATION_ERROR;
  }
  if (error.message.includes('500')) {
    return API_ERRORS.SERVER_ERROR;
  }
  return 'UNKNOWN_ERROR';
};

export default jobsAPI;