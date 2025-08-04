import React, { useState, useEffect } from 'react';

const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL;

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        // Decode userId from token (assume JWT, get payload)
        let userId = null;
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          userId = payload.data?.id;
        } catch {}
        if (!userId) throw new Error('Invalid token');
        const res = await fetch(`${baseUrl}/users/${userId}/profile`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to fetch profile');
        const data = await res.json();
        setUser(data);
      } catch (err) {
        setError('Could not load profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Sync form state with user data on first load and when user changes
  useEffect(() => {
    if (user) {
      // If user.data exists, use it (matches your backend response)
      const profile = user.data ? user.data : user;
      setForm({
        username: profile.username || '',
        email: profile.email || '',
        password: ''
      });
    }
  }, [user]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const token = localStorage.getItem('token');
      let userId = null;
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        userId = payload.data?.id;
      } catch {}
      if (!userId) throw new Error('Invalid token');
      const res = await fetch(`${baseUrl}/users/${userId}/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error('Failed to update profile');
      setSuccess(true);
    } catch (err) {
      setError('Could not update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="max-w-lg mx-auto p-8 bg-white rounded-2xl shadow-xl mt-8">
      <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Username</label>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Password <span className="text-xs text-gray-400">(leave blank to keep unchanged)</span></label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            autoComplete="new-password"
          />
        </div>
        <button
          type="submit"
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-full font-semibold shadow hover:scale-105 transition-transform"
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
        {success && <div className="text-green-600 font-medium">Profile updated successfully!</div>}
      </form>
    </div>
  );
};

export default ProfilePage;
