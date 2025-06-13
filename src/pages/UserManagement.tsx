import React, { useState, useMemo } from 'react';
import usersData from '../data/users.json';

interface User {
  _id: string;
  username: string;
  name: string;
  email: string;
  password: string;
  createdOn: string;
  lastSession: string;
}

const getInitialUsers = () => {
  // Add createdOn and lastSession timestamps if missing
  return usersData.users.map((u, idx) => ({
    _id: u._id,
    username: u.username,
    name: u.name,
    email: u.email,
    password: u.password || '',
    createdOn: new Date(Date.now() - (idx + 1) * 86400000).toISOString(),
    lastSession: new Date(Date.now() - (idx + 1) * 3600000).toISOString(),
  }));
};

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>(getInitialUsers());
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [form, setForm] = useState({ username: '', name: '', email: '', password: '' });
  const [formError, setFormError] = useState('');
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);

  // Filtered users
  const filteredUsers = useMemo(() => {
    const q = search.toLowerCase();
    return users.filter(u =>
      u._id.includes(q) ||
      u.username.toLowerCase().includes(q) ||
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q)
    );
  }, [search, users]);

  // CSV Export
  const exportCSV = () => {
    const header = ['User ID', 'User Name', 'Email ID', 'Created On', 'Last Session'];
    const rows = filteredUsers.map(u => [u._id, u.name, u.email, u.createdOn, u.lastSession]);
    const csv = [header, ...rows].map(r => r.map(x => `"${x}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Add/Edit Modal handlers
  const openAddModal = () => {
    setEditUser(null);
    setForm({ username: '', name: '', email: '', password: '' });
    setFormError('');
    setShowModal(true);
  };
  const openEditModal = (user: User) => {
    setEditUser(user);
    setForm({ username: user.username, name: user.name, email: user.email, password: user.password });
    setFormError('');
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setEditUser(null);
    setFormError('');
  };
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const validateForm = () => {
    if (!form.username.trim() || !form.name.trim() || !form.email.trim() || !form.password.trim()) {
      setFormError('All fields are required.');
      return false;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) {
      setFormError('Invalid email address.');
      return false;
    }
    return true;
  };
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (editUser) {
      setUsers(users => users.map(u => u._id === editUser._id ? { ...u, ...form } : u));
    } else {
      const newUser: User = {
        _id: (Math.max(0, ...users.map(u => +u._id)) + 1).toString(),
        username: form.username,
        name: form.name,
        email: form.email,
        password: form.password,
        createdOn: new Date().toISOString(),
        lastSession: new Date().toISOString(),
      };
      setUsers(users => [newUser, ...users]);
    }
    closeModal();
  };

  // Delete handlers
  const confirmDelete = (id: string) => setDeleteUserId(id);
  const handleDelete = () => {
    setUsers(users => users.filter(u => u._id !== deleteUserId));
    setDeleteUserId(null);
  };

  return (
    <main className="w-full min-h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-900">
      <div className="w-full h-full p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
          <div className="flex w-full md:w-auto justify-start mb-2 md:mb-0">
            <button
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              onClick={openAddModal}
            >
              Add User
            </button>
          </div>
          <div className="flex gap-2 items-center w-full md:w-auto justify-end">
            <input
              type="text"
              placeholder="Search by ID, name, or email..."
              className="border rounded px-3 py-2 w-full md:w-64"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={exportCSV}
            >
              Export
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-800 rounded shadow">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">User ID</th>
                <th className="px-4 py-2 text-left">User Name</th>
                <th className="px-4 py-2 text-left">Email ID</th>
                <th className="px-4 py-2 text-left">Created On</th>
                <th className="px-4 py-2 text-left">Last Session</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-gray-500">No users found.</td>
                </tr>
              ) : (
                filteredUsers.map(user => (
                  <tr key={user._id} className="border-t">
                    <td className="px-4 py-2">{user._id}</td>
                    <td className="px-4 py-2">{user.name}</td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2">{new Date(user.createdOn).toLocaleString()}</td>
                    <td className="px-4 py-2">{new Date(user.lastSession).toLocaleString()}</td>
                    <td className="px-4 py-2 flex gap-2 justify-center">
                      <button
                        className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
                        onClick={() => openEditModal(user)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                        onClick={() => confirmDelete(user._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">{editUser ? 'Edit User' : 'Add User'}</h3>
            <form onSubmit={handleFormSubmit} className="flex flex-col gap-3">
              <input
                name="username"
                placeholder="Username"
                className="border rounded px-3 py-2 bg-white text-black dark:bg-black dark:text-white w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.username}
                onChange={handleFormChange}
                required
                disabled={!!editUser}
              />
              <input
                name="name"
                placeholder="Full Name"
                className="border rounded px-3 py-2 bg-white text-black dark:bg-black dark:text-white w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.name}
                onChange={handleFormChange}
                required
              />
              <input
                name="email"
                placeholder="Email ID"
                className="border rounded px-3 py-2 bg-white text-black dark:bg-black dark:text-white w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.email}
                onChange={handleFormChange}
                required
                type="email"
              />
              <input
                name="password"
                placeholder="Password"
                className="border rounded px-3 py-2 bg-white text-black dark:bg-black dark:text-white w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.password}
                onChange={handleFormChange}
                required
                type="password"
              />
              {formError && <div className="text-red-600 text-sm">{formError}</div>}
              <div className="flex gap-2 justify-end mt-2">
                <button type="button" className="px-4 py-2 rounded bg-blue-600 text-white" onClick={closeModal}>Cancel</button>
                <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white">{editUser ? 'Save' : 'Add'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteUserId && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded shadow-lg p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p>Are you sure you want to delete this user?</p>
            <div className="flex gap-2 justify-end mt-4">
              <button className="px-4 py-2 rounded bg-gray-200" onClick={() => setDeleteUserId(null)}>Cancel</button>
              <button className="px-4 py-2 rounded bg-red-600 text-white" onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default UserManagement; 