import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import InputField from '../../components/common/InputField';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorState from '../../components/common/ErrorState';
import UserModal from '../../components/admin/UserModal';
import { usePermission } from '../../hooks/usePermission';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import RBACMatrix from '../../components/RBACMatrix';
import useSessionTimeout from '../../hooks/useSessionTimeout';
import {
  fetchUsers,
  updateUserRole,
  selectAdminUsers,
  selectAdminUsersLoading,
  selectAdminUsersError,
} from '../../features/adminUsers/adminUserSlice';
import { 
  getUsersApi, 
  toggleUserStatusApi, 
  triggerPasswordResetApi, 
  bulkAssignRolesApi 
} from '../../features/adminUsers/adminUserService';

const ROLE_STYLES = {
  Learner: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
  Instructor: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  TA: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  Admin: 'bg-pink-500/10 text-pink-400 border-pink-500/30',
};

export default function AdminUsersPage() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const dispatch = useDispatch();
  const users = useSelector(selectAdminUsers) ?? [];
  const loading = useSelector(selectAdminUsersLoading);
  const error = useSelector(selectAdminUsersError);
  useSessionTimeout();

  // State for bulk selection and role assignment
const [selectedUserIds, setSelectedUserIds] = useState([]);
const [selectedRole, setSelectedRole] = useState('');
const [confirmstate, setconfirmstate] = useState({ open: false, action: null, payload: null });

// RBAC permission check using your imported hook
const { hasPermission } = usePermission();
const canManageUsers = hasPermission('manage_users') || hasPermission('admin');
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase());
      const matchesRole = roleFilter === 'all' || u.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [search, roleFilter, users]);

  const handleOpenModal = (user = null) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleSaveUser = async (userData) => {
    if (userData.id) {
      await dispatch(updateUserRole({ userId: userData.id, role: userData.role }));
    }
    setIsModalOpen(false);
  };

  // Toggle User Status handler
const handleStatusToggle = async (userId, currentStatus) => {
  const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
  try {
    await toggleUserStatusApi(userId, newStatus);
    dispatch(fetchUsers()); // Re-fetch or update local state
  } catch (err) {
    console.error('Error toggling status:', err);
  }
};

// Password Reset Handler
const handlePasswordReset = async (userId) => {
  try {
    await triggerPasswordResetApi(userId);
    alert('Password reset email sent successfully.');
  } catch (err) {
    console.error('Error resetting password:', err);
  }
};

// Bulk Role Assignment Handler
const handleBulkRoleAssign = async () => {
  if (!selectedUserIds.length || !selectedRole) return;
  try {
    await bulkAssignRolesApi(selectedUserIds, selectedRole);
    setSelectedUserIds([]);
    dispatch(fetchUsers());
  } catch (err) {
    console.error('Error with bulk role assignment:', err);
  }
};

// Checkbox Selection Toggle Handler
const toggleUserSelection = (userId) => {
  setSelectedUserIds((prev) =>
    prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
  );
};
const askConfirm = (action, payload) => setConfirmState({ open: true, action, payload });

  const handleConfirmed = async () => {
    const { action, payload } = confirmState;
    if (action === 'toggleStatus') await handleStatusToggle(payload.id, payload.status);
    if (action === 'resetPassword') await handlePasswordReset(payload.id);
    if (action === 'bulkRole') await handleBulkRoleAssign();
    setConfirmState({ open: false, action: null, payload: null });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Users</h1>
          <p className="text-sm text-gray-400 mt-1">Manage learners, instructors, TAs and admins.</p>
        </div>
        {canManageUsers && (
          <Button label="+ Add User" onClick={() => handleOpenModal()} />
        )}
      </div>

      <div className="glass-panel rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 sm:items-end">
          <div className="flex-1">
            <InputField
              label="Search"
              id="user-search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'Learner', 'Instructor', 'TA', 'Admin'].map((role) => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  roleFilter === role
                    ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                    : 'text-gray-400 border-gray-700 hover:border-gray-600'
                }`}
              >
                {role === 'all' ? 'All' : role}
              </button>
            ))}
          </div>
        </div>

        {loading && <LoadingSpinner label="Loading users..." />}

        {!loading && error && (
          <ErrorState
            message={`${error} (expected until /admin/users is mounted on the backend)`}
            onRetry={() => dispatch(fetchUsers())}
          />
        )}

        {!loading && !error && (
         <>
            {canManageUsers && selectedUserIds.length > 0 && (
  <div className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg mb-4">
    <span className="text-sm text-gray-300">
      {selectedUserIds.length} user(s) selected
    </span>
    <select
      value={selectedRole}
      onChange={(e) => setSelectedRole(e.target.value)}
      className="bg-slate-700 text-white text-sm p-2 rounded border border-slate-600"
    >
      <option value="">Select Target Role</option>
      <option value="Admin">Admin</option>
      <option value="Instructor">Instructor</option>
      <option value="TA">TA</option>
      <option value="Learner">Learner</option>
    </select>
    <Button onClick={() => askConfirm('bulkRole', null)}>Apply Bulk Role</Button>
  </div>
     
     )}
<div className="overflow-x-auto">
            <table className="w-full text-sm">
                 <thead>
  <tr className="border-b border-slate-700 text-left text-xs text-slate-400">
    {/* FIRST TH IN THE TR */}
    <th className="p-3">
      <input
        type="checkbox"
        onChange={(e) => {
          if (e.target.checked) {
            setSelectedUserIds(filteredUsers.map((u) => u.id));
          } else {
            setSelectedUserIds([]);
          }
        }}
        checked={filteredUsers?.length > 0 && selectedUserIds.length === filteredUsers.length}
      />
    </th>
    <th className="p-3">User</th>
    <th className="p-3">Role</th>
    <th className="p-3">Status</th>
    <th className="p-3">Actions</th>
  </tr>
</thead>
                  
             <tbody>
  {users.map((user) => (
    <tr key={user.id} className="border-b border-slate-800 hover:bg-slate-800/50">
      {/* FIRST TD IN THE ROW */}
      <td className="p-3">
        <input
          type="checkbox"
          checked={selectedUserIds.includes(user.id)}
          onChange={() => toggleUserSelection(user.id)}
        />
      </td>
      <td className="p-3">{user.name}</td>
    
                    <td className="p-3 text-right">
  {canManageUsers ? (
    <div className="flex items-center justify-end gap-2">
      <button
        onClick={() => askConfirm('toggleStatus', { id: user.id, status:user.status})}
        className="text-xs px-2 py-1 rounded bg-slate-800 text-cyan-400 hover:bg-slate-700"
      >
        Toggle ({user.status || 'active'})
      </button>

      <button
        onClick={() => askConfirm('resetPassword', {id: user.id})}
        className="text-xs px-2 py-1 rounded bg-slate-800 text-amber-400 hover:bg-slate-700"
      >
        Reset Password
      </button>

      <button
        onClick={() => handleOpenModal(user)}
        className="text-xs px-2 py-1 rounded bg-slate-800 text-gray-400 hover:text-cyan-400"
      >
        Edit
      </button>
    </div>
  ) : (
    <span className="text-xs text-slate-500">View Only</span>
  )}
</td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-400">
                      No users match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          </>
        )}
      </div>
<RBACMatrix />

        <ConfirmDialog
          open={confirmState.open}
          title="Confirm action"
          message={
            confirmState.action === 'bulkRole'
              ? `Apply role "${selectedRole}" to ${selectedUserIds.length} selected user(s)?`
              : `Are you sure you want to proceed for this user?`
          }
          danger={confirmState.action === 'toggleStatus'}
          onConfirm={handleConfirmed}
          onCancel={() => setConfirmState({ open: false, action: null, payload: null })}
        />
      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={selectedUser}
        onSave={handleSaveUser}
      />
    </div>
  );
}