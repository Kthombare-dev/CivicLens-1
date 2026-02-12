

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
            { id: 'CMP-0456', user: 'John Doe', category: 'Pothole', location: 'MG Road', status: 'Submitted', timestamp: 'Apr 24, 2024, 02:45 PM', assignedTo: null },
            { id: 'CMP-0455', user: 'Sara Smith', category: 'Garbage', location: 'Station Area', status: 'In Progress', timestamp: 'Apr 23, 2024, 02:15 PM', assignedTo: 'Ravi Kumar' },
            { id: 'CMP-0454', user: 'Alex Walker', category: 'Streetlight', location: 'Lakeview Ave', status: 'Resolved', timestamp: 'Apr 20, 2024, 08:30 PM', assignedTo: 'Riya Verma' },
            { id: 'CMP-0453', user: 'Emily Johnson', category: 'Water / Sanitation', location: 'Market Square', status: 'Submitted', timestamp: 'Apr 19, 2024, 09:50 AM', assignedTo: null },
            { id: 'CMP-0452', user: 'Michael Brown', category: 'Pothole', location: 'Aurobindo Ave', status: 'Resolved', timestamp: 'Apr 20, 2024, 09:30 AM', assignedTo: 'Amit Rao' },
            { id: 'CMP-0451', user: 'David Wilson', category: 'Garbage', location: 'Green Park', status: 'Submitted', timestamp: 'Apr 18, 2024, 11:20 AM', assignedTo: null },
            { id: 'CMP-0450', user: 'Lisa Ray', category: 'Streetlight', location: 'Church Road', status: 'Submitted', timestamp: 'Apr 17, 2024, 04:10 PM', assignedTo: null },
            { id: 'CMP-0449', user: 'Chris Evans', category: 'Pothole', location: 'Central Mall', status: 'Submitted', timestamp: 'Apr 16, 2024, 01:55 PM', assignedTo: null },
            { id: 'CMP-0448', user: 'Anna Scott', category: 'Water / Sanitation', location: 'Park Lane', status: 'Submitted', timestamp: 'Apr 15, 2024, 08:45 AM', assignedTo: null },
            { id: 'CMP-0447', user: 'Mark Taylor', category: 'Garbage', location: 'City Center', status: 'Submitted', timestamp: 'Apr 14, 2024, 03:20 PM', assignedTo: null },
            { id: 'CMP-0446', user: 'Sarah Connor', category: 'Pothole', location: 'Main Street', status: 'Assigned', timestamp: 'Apr 13, 2024, 10:15 AM', assignedTo: 'Riya Verma' },
            { id: 'CMP-0445', user: 'Bruce Wayne', category: 'Streetlight', location: 'Gotham Hts', status: 'In Progress', timestamp: 'Apr 12, 2024, 11:30 PM', assignedTo: 'Amit Rao' },
            { id: 'CMP-0444', user: 'Diana Prince', category: 'Water / Sanitation', location: 'Themyscira Rd', status: 'Submitted', timestamp: 'Apr 11, 2024, 09:00 AM', assignedTo: null },
            { id: 'CMP-0443', user: 'Peter Parker', category: 'Garbage', location: 'Queens Blvd', status: 'Resolved', timestamp: 'Apr 10, 2024, 02:45 PM', assignedTo: 'Ravi Kumar' },
            { id: 'CMP-0442', user: 'Tony Stark', category: 'Pothole', location: 'Malibu Point', status: 'Submitted', timestamp: 'Apr 09, 2024, 05:20 PM', assignedTo: null },
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
