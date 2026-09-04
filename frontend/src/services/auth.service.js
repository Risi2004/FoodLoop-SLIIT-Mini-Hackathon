const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

class AuthService {
  /**
   * Store token and user details in localStorage
   */
  setAuth(data) {
    if (data.token) {
      localStorage.setItem('foodloop_token', data.token);
    }
    if (data.user) {
      localStorage.setItem('foodloop_user', JSON.stringify(data.user));
    }
  }

  /**
   * Get stored JWT token
   */
  getToken() {
    return localStorage.getItem('foodloop_token');
  }

  /**
   * Get stored user profile
   */
  getUser() {
    const userStr = localStorage.getItem('foodloop_user');
    try {
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  }

  /**
   * Clear session
   */
  clearAuth() {
    localStorage.removeItem('foodloop_token');
    localStorage.removeItem('foodloop_user');
  }

  /**
   * Login user
   */
  async login(email, password) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed. Please verify your credentials.');
    }

    if (data.data) {
      this.setAuth(data.data);
    }

    return data;
  }

  /**
   * Register user with role-specific multipart form data and Cloudflare R2 file attachments
   */
  async register(formData) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      body: formData // multipart/form-data (browser sets boundary automatically)
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMsg = data.errors && data.errors.length > 0 
        ? data.errors.join(', ') 
        : data.message || 'Registration failed.';
      throw new Error(errorMsg);
    }

    if (data.data) {
      this.setAuth(data.data);
    }

    return data;
  }

  /**
   * Fetch logged-in user profile
   */
  async getProfile() {
    const token = this.getToken();
    if (!token) throw new Error('No authentication token found');

    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch user profile');
    }

    return data.data?.user;
  }

  /**
   * Check email availability in real-time
   */
  async checkEmail(email) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/check-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      return data.data?.isAvailable ?? true;
    } catch {
      return true;
    }
  }

  /**
   * Logout user
   */
  async logout() {
    const token = this.getToken();
    if (token) {
      try {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } catch (err) {
        console.warn('Logout network error:', err);
      }
    }
    this.clearAuth();
  }
}

export default new AuthService();
