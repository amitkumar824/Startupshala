'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { useApp } from '@/lib/context/AppContext';

export default function AdminDashboard() {
  const { user } = useApp();
  const [stats, setStats] = useState({ users: 0, deals: 0, pendingClaims: 0 });

  useEffect(() => {
    if (!user?.isAdmin) return; // restrict non-admins

    const fetchStats = async () => {
      const users = await apiFetch('/admin/users');
      const deals = await apiFetch('/admin/deals');
      const claims = await apiFetch('/claims/my'); // or /admin/claims if available

      setStats({
        users: users.length,
        deals: deals.length,
        pendingClaims: claims.filter((c: any) => c.status === 'pending').length,
      });
    };

    fetchStats();
  }, [user]);

  if (!user?.isAdmin) return <p>Access denied</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded shadow">Users: {stats.users}</div>
        <div className="bg-white p-6 rounded shadow">Deals: {stats.deals}</div>
        <div className="bg-white p-6 rounded shadow">Pending Claims: {stats.pendingClaims}</div>
      </div>
    </div>
  );
}
