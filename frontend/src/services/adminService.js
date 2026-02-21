

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
            { id: 'CMP-0456', user: 'Arjun Sharma', category: 'Pothole', location: 'MG Road', status: 'Submitted', timestamp: 'Apr 24, 2024, 02:45 PM', assignedTo: null },
            { id: 'CMP-0455', user: 'Priya Iyer', category: 'Garbage', location: 'Indira Nagar', status: 'In Progress', timestamp: 'Apr 23, 2024, 02:15 PM', assignedTo: 'Ravi Kumar' },
            { id: 'CMP-0454', user: 'Vikram Singh', category: 'Streetlight', location: 'Sector 45', status: 'Resolved', timestamp: 'Apr 20, 2024, 08:30 PM', assignedTo: 'Riya Verma' },
            { id: 'CMP-0453', user: 'Neha Gupta', category: 'Water / Sanitation', location: 'Koramangala', status: 'Submitted', timestamp: 'Apr 19, 2024, 09:50 AM', assignedTo: null },
            { id: 'CMP-0452', user: 'Rohan Mehta', category: 'Pothole', location: 'Jayanagar', status: 'Resolved', timestamp: 'Apr 20, 2024, 09:30 AM', assignedTo: 'Amit Rao' },
            { id: 'CMP-0451', user: 'Anjali Desai', category: 'Garbage', location: 'Whitefield', status: 'Submitted', timestamp: 'Apr 18, 2024, 11:20 AM', assignedTo: null },
            { id: 'CMP-0450', user: 'Suresh Reddy', category: 'Streetlight', location: 'Church Street', status: 'Submitted', timestamp: 'Apr 17, 2024, 04:10 PM', assignedTo: null },
            { id: 'CMP-0449', user: 'Kavita Joshi', category: 'Pothole', location: 'Brigade Road', status: 'Submitted', timestamp: 'Apr 16, 2024, 01:55 PM', assignedTo: null },
            { id: 'CMP-0448', user: 'Manoj Kumar', category: 'Water / Sanitation', location: 'Malleshwaram', status: 'Submitted', timestamp: 'Apr 15, 2024, 08:45 AM', assignedTo: null },
            { id: 'CMP-0447', user: 'Swati Patel', category: 'Garbage', location: 'City Market', status: 'Submitted', timestamp: 'Apr 14, 2024, 03:20 PM', assignedTo: null },
            { id: 'CMP-0446', user: 'Aditya Verma', category: 'Pothole', location: 'Residency Road', status: 'Assigned', timestamp: 'Apr 13, 2024, 10:15 AM', assignedTo: 'Riya Verma' },
            { id: 'CMP-0445', user: 'Meera Nair', category: 'Streetlight', location: 'HSR Layout', status: 'In Progress', timestamp: 'Apr 12, 2024, 11:30 PM', assignedTo: 'Amit Rao' },
            { id: 'CMP-0444', user: 'Karthik S', category: 'Water / Sanitation', location: 'Electronic City', status: 'Submitted', timestamp: 'Apr 11, 2024, 09:00 AM', assignedTo: null },
            { id: 'CMP-0443', user: 'Sneha Rao', category: 'Garbage', location: 'BTM Layout', status: 'Resolved', timestamp: 'Apr 10, 2024, 02:45 PM', assignedTo: 'Ravi Kumar' },
            { id: 'CMP-0442', user: 'Rahul Khanna', category: 'Pothole', location: 'Richmond Town', status: 'Submitted', timestamp: 'Apr 09, 2024, 05:20 PM', assignedTo: null },
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
                { name: 'Indira Nagar', count: 9 },
                { name: 'Sector 45', count: 7 },
            ]
        };
    },

    getUsers: async () => {
        return [
            { id: 'USR001', name: 'Arjun Sharma', contact: 'arjun.sharma@example.com', complaintsFiled: 3, lastActive: 'Apr 24, 2024, 02:45 PM' },
            { id: 'USR002', name: 'Priya Iyer', contact: 'priya.iyer@example.com', complaintsFiled: 12, lastActive: 'Apr 23, 2024, 02:15 PM' },
            { id: 'USR003', name: 'Vikram Singh', contact: '+91 98765 43210', complaintsFiled: 4, lastActive: 'Apr 20, 2024, 09:00 AM' },
            { id: 'USR004', name: 'Neha Gupta', contact: 'neha.gupta@example.com', complaintsFiled: 2, lastActive: 'Apr 19, 2024, 09:30 AM' },
            { id: 'USR005', name: 'Rohan Mehta', contact: 'rohan.mehta@example.com', complaintsFiled: 7, lastActive: 'Apr 20, 2024, 09:30 AM' },
        ];
    },

    getOfficers: async () => {
        return [
            { id: 'OFF001', name: 'Ravi Kumar', email: 'ravi@email.com', department: 'Sanitation', phone: '9876543210', workload: 3, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ravi', status: 'Active' },
            { id: 'OFF002', name: 'Amit Rao', email: 'amit@email.com', department: 'Water', phone: '9123456780', workload: 5, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amit', status: 'Inactive' },
            { id: 'OFF003', name: 'Pooja Patel', email: 'pooja@email.com', department: 'Water', phone: '9876512345', workload: 5, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pooja', status: 'Active' },
            { id: 'OFF004', name: 'Rajiv Mehra', email: 'rajiv@email.com', department: 'Field Officer', phone: '9123456789', workload: 8, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rajiv', status: 'Active' },
            { id: 'OFF005', name: 'Sanjay Mishra', email: 'sanjay@email.com', department: 'Water', phone: '9125012345', workload: 2, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sanjay', status: 'Inactive' },
            { id: 'OFF006', name: 'Anuj Singh', email: 'anuj@email.com', department: 'Field Officer', phone: '9876509876', workload: 4, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anuj', status: 'Active' },
            { id: 'OFF007', name: 'Sunita Joshi', email: 'sunita@email.com', department: 'Water', phone: '9012345678', workload: 6, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sunita', status: 'Active' },
        ];
    }
};
