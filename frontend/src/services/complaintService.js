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
    }
};
