'use client';

import { useState, useEffect } from 'react';


export default function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    inquiries: 0,
    downloads: 0,
    galleryItems: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(res => res.json())
      .then(data => {
        if (data.stats) {
          setStats(data.stats);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const statCards = [
    { label: 'Total Products', value: stats.products },
    { label: 'Categories', value: stats.categories },
    { label: 'Inquiries', value: stats.inquiries },
    { label: 'Downloads', value: stats.downloads },
    { label: 'Gallery Items', value: stats.galleryItems },
  ];

  return (
    <div>
      <h1 style={{ marginBottom: '24px', fontSize: '24px', fontWeight: 'bold' }}>Dashboard Overview</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
        {statCards.map((card) => (
          <div key={card.label} style={{ background: '#fff', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h3 style={{ color: '#777', fontSize: '14px', marginBottom: '8px' }}>{card.label}</h3>
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#1a1a1a' }}>
              {loading ? '—' : card.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
