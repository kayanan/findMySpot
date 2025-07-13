import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BACKEND_APP_URL || 'http://localhost:4000/api';

// Helper function to create axios instance with auth
const createAuthInstance = () => {
  return axios.create({
    baseURL: BASE_URL,
    withCredentials: true, // Include cookies
  });
};

export const profileService = {
  // Check if backend is available
  async checkBackendHealth() {
    // try {
    //   const authInstance = createAuthInstance();
    //   await authInstance.get('/ping');
    //   return true;
    // } catch (error) {
    //   console.error('Backend health check failed:', error);
    //   return false;
    // }
    return true;
  },

  // Get current user profile
  async getCurrentUser() {
    try {
      const authInstance = createAuthInstance();
      const response = await authInstance.get('/v1/user/current');
      return response.data;
    } catch (error) {
      console.error('Error fetching current user:', error);
      if (error.response?.status === 401) {
        throw new Error('Please log in to view your profile.');
      } else if (error.code === 'ERR_NETWORK') {
        throw new Error('Network error. Please check your connection and ensure the backend server is running.');
      } else if (error.response?.status === 404) {
        throw new Error('User profile not found.');
      } else if (error.response?.status === 500) {
        throw new Error('Server error. Please try again later.');
      }
      throw error;
    }
  },

  // Get user profile by ID
  async getUserProfile(userId) {
    try {
      const authInstance = createAuthInstance();
      const response = await authInstance.get(`/v1/user/profile/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },

  // Update user profile
  async updateUserProfile(userId, profileData) {
    try {
      const authInstance = createAuthInstance();
      const response = await authInstance.patch(`/v1/user/update/${userId}`, profileData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },

  // Change password
  async changePassword(passwordData) {
    try {
      const authInstance = createAuthInstance();
      const response = await authInstance.patch('/v1/user/change-password', passwordData);
      return response.data;
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  },

  // Get user by email
  async getUserByEmail(email) {
    try {
      const authInstance = createAuthInstance();
      const response = await authInstance.get(`/v1/user/email/${email}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user by email:', error);
      throw error;
    }
  },

  // Get user by mobile number
  async getUserByMobileNumber(mobileNumber) {
    try {
      const authInstance = createAuthInstance();
      const response = await authInstance.get(`/v1/user/mobile-number/${mobileNumber}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user by mobile number:', error);
      throw error;
    }
  }
};

export default profileService; 