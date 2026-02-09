

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return {
        headers: {
            'Authorization': `Bearer ${user?.token}`
        }
    };
};

export const adminService = {
    getStats: async () => {
        // Mocking for now as per instructions to build the UI
        return {
            totalUsers: 1528,
            totalComplaints: 456,
            activeComplaints: 167,
            resolvedComplaints: 265,
            pendingComplaints: 24
        };
    },

    getRecentComplaints: async (search = '') => {
        // Mock data matching the image
        return [
            { id: 'CMP-0456', user: 'John Doe', category: 'Pothole', location: 'MG Road', status: 'Submitted', timestamp: 'Apr 24, 2024, 02:45 PM' },
            { id: 'CMP-0455', user: 'Sara Smith', category: 'Garbage Overflow', location: 'Station Area', status: 'In Progress', timestamp: 'Apr 23, 2024, 02:15 PM' },
            { id: 'CMP-0454', user: 'Alex Walker', category: 'Broken Streetlight', location: 'Lakeview Ave', status: 'Resolved', timestamp: 'Apr 20, 2024, 08:30 PM' },
            { id: 'CMP-0453', user: 'Emily Johnson', category: 'Unsanitary Area', location: 'Market Square', status: 'Submitted', timestamp: 'Apr 19, 2024, 09:50 AM' },
            { id: 'CMP-0452', user: 'Michael Brown', category: 'Pothole', location: 'Aurobindo Ave', status: 'Resolved', timestamp: 'Apr 20, 2024, 09:30 AM' },
        ];
    },

    getAnalytics: async () => {
        return {
            categories: [
                { name: 'Pothole', count: 45 },
                { name: 'Garbage', count: 60 },
                { name: 'Streetlight', count: 32 },
                { name: 'Water / Sanitation', count: 28 },
            ],
            statusOverview: [
                { name: 'Submitted', count: 89 },
                { name: 'In Progress', count: 78 },
                { name: 'Resolved', count: 265 },
            ],
            locations: [
                { name: 'MG Road', count: 12 },
                { name: 'Station Area', count: 9 },
                { name: 'Market Area', count: 7 },
            ]
        };
    },

    getUsers: async () => {
        return [
            { id: 'USR001', name: 'John Doe', contact: 'john@example.com', complaintsFiled: 3, lastActive: 'Apr 24, 2024, 02:45 PM' },
            { id: 'USR002', name: 'Sara Smith', contact: 'sara@example.com', complaintsFiled: 12, lastActive: 'Apr 23, 2024, 02:15 PM' },
            { id: 'USR003', name: 'Alex Walker', contact: '+1234567890', complaintsFiled: 4, lastActive: 'Apr 20, 2024, 09:00 AM' },
            { id: 'USR004', name: 'Emily Johnson', contact: 'emily@example.com', complaintsFiled: 2, lastActive: 'Apr 19, 2024, 09:30 AM' },
            { id: 'USR005', name: 'Michael Brown', contact: 'michaelb@example.com', complaintsFiled: 7, lastActive: 'Apr 20, 2024, 09:30 AM' },
        ];
    }
};
