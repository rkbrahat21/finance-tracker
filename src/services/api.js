const BASE_URL = import.meta.env.VITE_API_URL.replace(/\/+$/, '').replace('/api', '');
const API_URL = `${BASE_URL}/api`;

export const getAvatarUrl = (avatar) => {
    if (!avatar) return null;
    if (avatar.startsWith('http')) return avatar;
    // Add a hash/timestamp to break caching since filename is fixed
    return `${BASE_URL}/uploads/avatars/${avatar}?t=${new Date().getTime()}`;
};

/**
 * Shared request helper with consistent error handling.
 */
async function request(endpoint, options = {}) {
    const url = `${API_URL}${endpoint}`.replace(/([^:]\/)\/+/g, '$1');
    const token = localStorage.getItem('token');

    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        ...options,
    };

    const res = await fetch(url, config);

    if (!res.ok) {
        const error = await res.json().catch(() => ({ message: res.statusText }));
        throw new Error(error.message || `Request failed: ${res.status}`);
    }

    return res.json();
}

export const api = {
    // AUTH
    login: (credentials) => request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
    }),
    register: (userData) => request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
    }),
    getMe: () => request('/auth/me'),

    updateAvatar: (formData) => request('/users/avatar', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
            // Content-Type is intentionally omitted for FormData
        },
        body: formData
    }),

    // GET /transactions
    getTransactions: () => request('/transactions'),

    // POST /transactions
    addTransaction: (data) => request('/transactions', {
        method: 'POST',
        body: JSON.stringify(data),
    }),

    // DELETE /transactions/:id
    deleteTransaction: (id) => request(`/transactions/${id}`, {
        method: 'DELETE',
    }),

    // GET /dashboard/stats
    getDashboardStats: () => request('/dashboard/stats'),

    // GET /bank-accounts
    getBankAccounts: () => request('/bank-accounts'),

    // GET /statistics?month=...&startDate=...&endDate=...
    getStatistics: (params = {}) => {
        const query = new URLSearchParams(
            Object.entries(params).filter(([, v]) => v)
        ).toString();
        return request(`/statistics${query ? `?${query}` : ''}`);
    },

    // PUT /transactions/:id
    updateTransaction: (id, data) => request(`/transactions/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    }),

    // Debts
    getDebts: () => request('/debts'),
    addDebt: (data) => request('/debts', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    updateDebt: (id, data) => request(`/debts/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    }),
    deleteDebt: (id) => request(`/debts/${id}`, {
        method: 'DELETE',
    }),
    
    // GET /savings
    getSavings: () => request('/savings'),
};
