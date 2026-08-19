import adminApiClient from '../../services/adminApiClient'

export const getUsersApi = () => {
  return adminApiClient.get('/admin/users')
}

export const getRolesApi = () => {
  return adminApiClient.get('/admin/roles')
}

export const updateUserRoleApi = (userId, role) => {
  return adminApiClient.put(`/admin/users/${userId}/role`, { role })
}
// --- ADDED THESE NEW SERVICE FUNCTIONS ---

// Toggle User Status
export const toggleUserStatusApi = (userId, status) => {
  return adminApiClient.patch(`/admin/users/${userId}/status`, { status });
};

// Trigger Password Reset
export const triggerPasswordResetApi = (userId) => {
  return adminApiClient.post(`/admin/users/${userId}/reset-password`);
};

// Bulk Role Assignment
export const bulkAssignRolesApi = (userIds, role) => {
  return adminApiClient.post('/admin/users/bulk-role', { userIds, role });
};