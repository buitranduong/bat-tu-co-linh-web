/**
 * Service for SIM analysis API calls
 */

const API_BASE_URL = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

/**
 * Analyze phone numbers
 * @param {string[]} phoneNumbers - Array of phone numbers to analyze
 * @returns {Promise<Object>} - API response with analysis results
 */
export const analyzePhoneNumbers = async (phoneNumbers) => {
  try {
    const response = await fetch(`${API_BASE_URL}/analyze-bulk`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sim_numbers: phoneNumbers }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    // Re-throw with more context
    if (error.message.includes('Failed to fetch') || error.name === 'TypeError') {
      throw new Error('CORS_ERROR');
    }
    throw error;
  }
};

/**
 * Health check for API
 * @returns {Promise<boolean>} - True if API is reachable
 */
export const checkApiHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
    });
    return response.ok;
  } catch (error) {
    return false;
  }
};
