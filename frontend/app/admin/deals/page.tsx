'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { useApp } from '@/lib/context/AppContext';

export default function AdminDeals() {
  const { user } = useApp();
  const [deals, setDeals] = useState<any[]>([]);

  useEffect(() => {
    if (!user?.isAdmin) return;

    const fetchDeals = async () => {
      const data = await apiFetch('/admin/deals');
      setDeals(data);
    };

    fetchDeals();
  }, [user]);

  if (!user?.isAdmin) return <p>Access denied</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">All Deals</h1>
      <table className="min-w-full bg-white shadow rounded">
        <thead>
          <tr>
            <th className="p-2 border">Title</th>
            <th className="p-2 border">Partner</th>
            <th className="p-2 border">Category</th>
          </tr>
        </thead>
        <tbody>
          {deals.map((d: any) => (
            <tr key={d._id}>
              <td className="p-2 border">{d.title}</td>
              <td className="p-2 border">{d.partner}</td>
              <td className="p-2 border">{d.category}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
