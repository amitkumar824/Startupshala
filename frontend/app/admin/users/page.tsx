'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { useApp } from '@/lib/context/AppContext';

export default function AdminUsers() {
  const { user } = useApp();
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    if (!user?.isAdmin) return;

    const fetchUsers = async () => {
      const data = await apiFetch('/admin/users');
      setUsers(data);
    };

    fetchUsers();
  }, [user]);

  if (!user?.isAdmin) return <p>Access denied</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">All Users</h1>
      <table className="min-w-full bg-white shadow rounded">
        <thead>
          <tr>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Admin</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u: any) => (
            <tr key={u._id}>
              <td className="p-2 border">{u.name}</td>
              <td className="p-2 border">{u.email}</td>
              <td className="p-2 border">{u.isAdmin ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
