// JWT utility functions for authentication

/**
 * Decode JWT token without verification (for client-side use only)
 * Note: This should only be used to read the payload, not for security validation
 */
export function decodeJWT(token) {
  try {
    // Split the token into parts
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format');
    }

    // Decode the payload (second part)
    const payload = parts[1];
    
    // Add padding if needed for base64 decoding
    const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4);
    
    // Decode from base64
    const decodedPayload = atob(paddedPayload);
    
    // Parse JSON
    const parsedPayload = JSON.parse(decodedPayload);
    
    return parsedPayload;
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
}

/**
 * Check if JWT token is expired
 */
export function isTokenExpired(token) {
  const decoded = decodeJWT(token);
  if (!decoded) return true;
  
  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp < currentTime;
}

/**
 * Get user data from JWT token
 */
export function getUserFromToken(token) {
  const decoded = decodeJWT(token);
  return decoded?.data || null;
}

/**
 * Store authentication data in localStorage
 */
export function storeAuthData(token, userData) {
  localStorage.setItem('authToken', token);
  localStorage.setItem('user', JSON.stringify(userData));
}

/**
 * Get stored authentication token
 */
export function getAuthToken() {
  return localStorage.getItem('authToken');
}

/**
 * Get stored user data
 */
export function getStoredUser() {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

/**
 * Clear authentication data
 */
export function clearAuthData() {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
}

/**
 * Redirect user based on their role
 */
export function redirectUserByRole(role, navigate) {
  switch (role.toLowerCase()) {
    case 'admin':
      navigate('/admin');
      break;
    case 'user':
    default:
      navigate('/dashboard');
      break;
  }
}
