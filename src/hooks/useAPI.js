import { useState, useCallback, useMemo } from 'react';
import { getErrorType, API_ERRORS } from '../services/jobsAPI';

/**
 * Custom hook for managing API operations with loading states and error handling
 * Provides consistent patterns for all API calls throughout the application
 */
export const useAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Execute an API operation with automatic loading and error state management
   * @param {Function} apiCall - The API function to execute
   * @param {object} options - Configuration options
   * @returns {Promise} - The API result or throws error
   */
  const execute = useCallback(async (apiCall, options = {}) => {
    const { 
      showLoading = true, 
      onSuccess, 
      onError,
      resetError = true 
    } = options;

    try {
      if (resetError) setError(null);
      if (showLoading) setLoading(true);

      const result = await apiCall();
      
      if (onSuccess) onSuccess(result);
      return result;
      
    } catch (err) {
      const errorType = getErrorType(err);
      const errorInfo = {
        type: errorType,
        message: err.message,
        originalError: err
      };
      
      setError(errorInfo);
      
      if (onError) {
        onError(errorInfo);
      } else {
        // Default error handling
        console.error('API Error:', errorInfo);
      }
      
      throw err; // Re-throw for component-level handling if needed
      
    } finally {
      if (showLoading) setLoading(false);
    }
  }, []);

  /**
   * Reset error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Reset all states
   */
  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
  }, []);

  return {
    loading,
    error,
    execute,
    clearError,
    reset
  };
};

/**
 * Specialized hook for job operations
 * Provides pre-configured API operations for common job actions
 */
export const useJobsAPI = () => {
  const { loading, error, execute, clearError, reset } = useAPI();

  // Memoize operations to prevent infinite re-renders
  const operations = useMemo(() => ({
    fetchJobs: (apiCall, onSuccess, onError) => 
      execute(apiCall, { onSuccess, onError }),
      
    createJob: (apiCall, onSuccess, onError) =>
      execute(apiCall, { 
        onSuccess: (result) => {
          console.log('Job created successfully:', result);
          if (onSuccess) onSuccess(result);
        },
        onError
      }),
      
    updateJob: (apiCall, onSuccess, onError) =>
      execute(apiCall, {
        onSuccess: (result) => {
          console.log('Job updated successfully:', result);
          if (onSuccess) onSuccess(result);
        },
        onError
      }),
      
    deleteJob: (apiCall, onSuccess, onError) =>
      execute(apiCall, {
        onSuccess: (result) => {
          console.log('Job deleted successfully');
          if (onSuccess) onSuccess(result);
        },
        onError
      })
  }), [execute]);

  return {
    loading,
    error,
    clearError,
    reset,
    operations
  };
};

/**
 * Error message mapping for user-friendly error displays
 */
export const getErrorMessage = (error) => {
  if (!error) return '';
  
  switch (error.type) {
    case API_ERRORS.NETWORK_ERROR:
      return 'Unable to connect to the server. Please check your internet connection.';
    case API_ERRORS.NOT_FOUND:
      return 'The requested job was not found.';
    case API_ERRORS.VALIDATION_ERROR:
      return 'Please check your input and try again.';
    case API_ERRORS.SERVER_ERROR:
      return 'Server error occurred. Please try again later.';
    default:
      return error.message || 'An unexpected error occurred.';
  }
};