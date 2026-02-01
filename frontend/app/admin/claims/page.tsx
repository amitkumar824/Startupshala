'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { useApp } from '@/lib/context/AppContext';

export default function AdminClaims() {
  const { user } = useApp();
  const [claims, setClaims] = useState<any[]>([]);

  useEffect(() => {
    if (!user?.isAdmin) return;

    const fetchClaims = async () => {
      const data = await apiFetch('/admin/claims');
      setClaims(data);
    };

    fetchClaims();
  }, [user]);

  const handleClaim = async (id: string, status: 'approved' | 'rejected') => {
    await apiFetch(`/admin/claims/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
    setClaims(claims.map(c => (c._id === id ? { ...c, status } : c)));
  };

  if (!user?.isAdmin) return <p>Access denied</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Pending Claims</h1>
      <table className="min-w-full bg-white shadow rounded">
        <thead>
          <tr>
            <th className="p-2 border">User</th>
            <th className="p-2 border">Deal</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {claims.map(c => (
            <tr key={c._id}>
              <td className="p-2 border">{c.userId}</td>
              <td className="p-2 border">{c.dealId}</td>
              <td className="p-2 border">{c.status}</td>
              <td className="p-2 border space-x-2">
                {c.status === 'pending' && (
                  <>
                    <button
                      className="bg-green-500 text-white px-2 py-1 rounded"
                      onClick={() => handleClaim(c._id, 'approved')}
                    >
                      Approve
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded"
                      onClick={() => handleClaim(c._id, 'rejected')}
                    >
                      Reject
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
