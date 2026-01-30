const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Helper to get the auth headers
 */
const getAuthHeaders = () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return {};

    try {
        const userData = JSON.parse(userStr);
        // Assuming the token is stored in the userData object as 'token'
        // If it was stored separately, we would need to adjust this.
        // Based on backend response, it sends { token, user }.
        // The AuthContext stores whatever is passed to login().
        // If login(response.data) was called, then userData has .token.
        const token = userData.token;

        return {
            'Authorization': `Bearer ${token}`
        };
    } catch (e) {
        console.error('Error parsing user data', e);
        return {};
    }
};

export const complaintService = {
    /**
     * Get all complaints (public feed)
     * Optional filters: { citizen_id, department, status }
     */
    getComplaints: async (filters = {}) => {
        try {
            const queryParams = new URLSearchParams();
            Object.keys(filters).forEach(key => {
                if (filters[key]) queryParams.append(key, filters[key]);
            });

            const response = await fetch(`${API_URL}/complaints?${queryParams.toString()}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch complaints');
            }

            return await response.json();
        } catch (error) {
            console.error('Error in getComplaints:', error);
            throw error;
        }
    },

    /**
     * Analyze image before creating complaint
     * @param {FormData} formData - Must contain 'image'
     */
    analyzeComplaint: async (formData) => {
        try {
            const response = await fetch(`${API_URL}/complaints/analyze`, {
                method: 'POST',
                headers: {
                    ...getAuthHeaders()
                },
                body: formData
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to analyze image');
            }

            return data;
        } catch (error) {
            console.error('Error in analyzeComplaint:', error);
            throw error;
        }
    },

    /**
     * Create a new complaint with image
     * @param {FormData} formData - Must contain 'image', 'title', 'location', 'description'
     */
    createComplaint: async (formData) => {
        try {
            const response = await fetch(`${API_URL}/complaints`, {
                method: 'POST',
                headers: {
                    ...getAuthHeaders()
                    // Content-Type is set automatically for FormData
                },
                body: formData
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to create complaint');
            }

            return data;
        } catch (error) {
            console.error('Error in createComplaint:', error);
            throw error;
        }
    },

    /**
     * Get a single complaint by ID
     */
    getComplaintById: async (id) => {
        try {
            const response = await fetch(`${API_URL}/complaints/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch complaint details');
            }

            return await response.json();
        } catch (error) {
            console.error('Error in getComplaintById:', error);
            throw error;
        }
    },

    /**
     * Upvote a complaint
     */
    voteComplaint: async (id) => {
        try {
            const response = await fetch(`${API_URL}/complaints/${id}/vote`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeaders()
                }
            });

            if (!response.ok) {
                throw new Error('Failed to vote on complaint');
            }

            return await response.json();
        } catch (error) {
            console.error('Error in voteComplaint:', error);
            throw error;
        }
    },

    /**
     * Get full image URL from relative path
     */
    getImageUrl: (path) => {
        if (!path) return 'https://placehold.co/600x400?text=No+Image';
        if (path.startsWith('http')) return path;
        // API_URL is http://localhost:5000/api, we need http://localhost:5000
        const baseUrl = API_URL.replace('/api', '');
        return `${baseUrl}${path}`;
    },

    /**
     * Get dashboard data for authenticated user
     */
    getDashboardData: async () => {
        try {
            const response = await fetch(`${API_URL}/dashboard`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeaders()
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch dashboard data');
            }

            return data.data; // Backend returns { success: true, data: {...} }
        } catch (error) {
            console.error('Error in getDashboardData:', error);
            throw error;
        }
    },

    /**
     * Get nearby open/active complaints
     */
    getNearbyComplaints: async (latitude, longitude, radius = 5, area = null) => {
        try {
            const queryParams = new URLSearchParams();
            if (latitude) queryParams.append('latitude', latitude);
            if (longitude) queryParams.append('longitude', longitude);
            queryParams.append('radius', radius);
            if (area && area.trim()) queryParams.append('area', area.trim());

            const response = await fetch(`${API_URL}/complaints/nearby?${queryParams.toString()}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeaders()
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch nearby complaints');
            }

            return data;
        } catch (error) {
            console.error('Error in getNearbyComplaints:', error);
            throw error;
        }
    },

    /**
     * Get verifiable complaints (resolved, nearby, not user's own)
     */
    getVerifiableComplaints: async (latitude, longitude, radius = 5, area = null) => {
        try {
            const queryParams = new URLSearchParams();
            if (latitude) queryParams.append('latitude', latitude);
            if (longitude) queryParams.append('longitude', longitude);
            queryParams.append('radius', radius);
            if (area && area.trim()) queryParams.append('area', area.trim());

            const response = await fetch(`${API_URL}/complaints/verifiable?${queryParams.toString()}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeaders()
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch verifiable complaints');
            }

            return data;
        } catch (error) {
            console.error('Error in getVerifiableComplaints:', error);
            throw error;
        }
    },

    /**
     * Submit verification for a resolved complaint with image
     * @param {string} complaintId - ID of the complaint to verify
     * @param {FormData} formData - Must contain 'verificationImage', optional 'verificationLocation', 'verificationAddress'
     */
    submitVerification: async (complaintId, formData) => {
        try {
            const response = await fetch(`${API_URL}/complaints/${complaintId}/verify`, {
                method: 'POST',
                headers: {
                    ...getAuthHeaders()
                    // Content-Type is set automatically for FormData
                },
                body: formData
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to submit verification');
            }

            return data;
        } catch (error) {
            console.error('Error in submitVerification:', error);
            throw error;
        }
    },

    /**
     * Like/unlike a complaint
     */
    likeComplaint: async (complaintId) => {
        try {
            const response = await fetch(`${API_URL}/complaints/${complaintId}/vote`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeaders()
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to like complaint');
            }

            return data;
        } catch (error) {
            console.error('Error in likeComplaint:', error);
            throw error;
        }
    },

    /**
     * Add a comment to a complaint
     */
    addComment: async (complaintId, text) => {
        try {
            const response = await fetch(`${API_URL}/complaints/${complaintId}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeaders()
                },
                body: JSON.stringify({ text })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to add comment');
            }

            return data;
        } catch (error) {
            console.error('Error in addComment:', error);
            throw error;
        }
    },

    /**
     * Get comments for a complaint
     */
    getComments: async (complaintId) => {
        try {
            const response = await fetch(`${API_URL}/complaints/${complaintId}/comments`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch comments');
            }

            return await response.json();
        } catch (error) {
            console.error('Error in getComments:', error);
            throw error;
        }
    },

    /**
     * Like/unlike a comment
     */
    likeComment: async (complaintId, commentId) => {
        try {
            const response = await fetch(`${API_URL}/complaints/${complaintId}/comments/${commentId}/like`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeaders()
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to like comment');
            }

            return data;
        } catch (error) {
            console.error('Error in likeComment:', error);
            throw error;
        }
    }
};
