

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => {
    try {
        const user = JSON.parse(localStorage.getItem('user') || 'null');
        return { headers: { 'Authorization': `Bearer ${user?.token ?? ''}` } };
    } catch {
        return { headers: { 'Authorization': 'Bearer ' } };
    }
};

export const adminService = {
    getStats: async () => {
        const response = await fetch(`${API_URL}/admin/stats`, getAuthHeaders());
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to fetch stats');
        return data.data;
    },

    getRecentComplaints: async ({ page = 1, limit = 10, status = '', category = '', search = '' } = {}) => {
        const params = new URLSearchParams({ page, limit });
        if (status)   params.append('status', status);
        if (category) params.append('category', category);
        if (search)   params.append('search', search);

        const response = await fetch(`${API_URL}/admin/complaints?${params}`, getAuthHeaders());
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to fetch complaints');
        return data.data; // { complaints, pagination }
    },

    updateComplaintStatus: async (complaintId, status) => {
        const response = await fetch(`${API_URL}/admin/complaints/${complaintId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders().headers
            },
            body: JSON.stringify({ status })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to update status');
        return data.data;
    },

    getAnalytics: async () => {
        const response = await fetch(`${API_URL}/admin/analytics`, getAuthHeaders());
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to fetch analytics');
        return data.data;
    },

    getUsers: async (page = 1, limit = 10) => {
        const response = await fetch(
            `${API_URL}/admin/users?page=${page}&limit=${limit}`,
            getAuthHeaders()
        );
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to fetch users');
        return data.data; // { users, pagination }
    },

    getOfficers: async ({ page = 1, limit = 10, search = '' } = {}) => {
        const params = new URLSearchParams({ page, limit });
        if (search) params.append('search', search);
        const response = await fetch(`${API_URL}/admin/officers?${params}`, getAuthHeaders());
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to fetch officers');
        return data.data; // { officers, pagination }
    },

    createOfficer: async ({ name, email, phone, ward }) => {
        const response = await fetch(`${API_URL}/admin/officers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...getAuthHeaders().headers },
            body: JSON.stringify({ name, email, phone, ward })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to create officer');
        return data.data;
    },

    updateOfficer: async (officerId, { ward }) => {
        const response = await fetch(`${API_URL}/admin/officers/${officerId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', ...getAuthHeaders().headers },
            body: JSON.stringify({ ward })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to update officer');
        return data.data;
    },

    toggleOfficerStatus: async (officerId) => {
        const response = await fetch(`${API_URL}/admin/officers/${officerId}/status`, {
            method: 'PATCH',
            headers: getAuthHeaders().headers
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to toggle status');
        return data.data;
    },

    assignOfficer: async (complaintId, officerId) => {
        const response = await fetch(`${API_URL}/admin/complaints/${complaintId}/assign`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders().headers
            },
            body: JSON.stringify({ officerId })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to assign officer');
        return data.data;
    }
};
