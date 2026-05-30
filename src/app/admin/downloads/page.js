'use client';

import { useState, useEffect } from 'react';

export default function AdminDownloads() {
  const [downloads, setDownloads] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', fileUrl: '', fileSize: '', icon: '', type: 'catalogue', order: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchDownloads();
  }, []);

  const fetchDownloads = () => {
    fetch('/api/downloads')
      .then(res => res.json())
      .then(data => setDownloads(data.downloads || []));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const form = new FormData();
    form.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: form
      });
      const data = await res.json();
      if (res.ok) {
        setFormData(prev => ({ ...prev, fileUrl: data.url }));
      } else {
        alert(data.error || 'File upload failed');
      }
    } catch (err) {
      console.error(err);
      alert('Upload error');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fileUrl) {
      return alert('Please upload a file first.');
    }

    setIsLoading(true);
    
    try {
      const res = await fetch('/api/downloads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setFormData({ title: '', description: '', fileUrl: '', fileSize: '', icon: '', type: 'catalogue', order: 0 });
        setShowForm(false);
        fetchDownloads();
      } else {
        const errorData = await res.json();
        alert(errorData.error || 'Failed to save download item');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this download?')) return;
    
    try {
      const res = await fetch(`/api/downloads/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchDownloads();
      } else {
        const errorData = await res.json();
        alert(errorData.error || 'Failed to delete item');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Downloads</h1>
        <button 
          onClick={() => setShowForm(!showForm)}
          style={{ padding: '10px 20px', background: '#4a7c59', color: '#fff', borderRadius: '4px', border: 'none', cursor: 'pointer' }}
        >
          {showForm ? 'Cancel' : 'Add Download'}
        </button>
      </div>

      {showForm && (
        <div style={{ background: '#fff', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>New Download Item</h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Title *</label>
              <input required type="text" name="title" value={formData.title} onChange={handleInputChange} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #d9d9d9' }} />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Description</label>
              <textarea name="description" value={formData.description} onChange={handleInputChange} rows={3} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #d9d9d9', resize: 'vertical' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Type</label>
                <select name="type" value={formData.type} onChange={handleInputChange} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #d9d9d9' }}>
                  <option value="catalogue">Catalogue</option>
                  <option value="technical">Technical Drawing</option>
                  <option value="cad">CAD File</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Order</label>
                <input type="number" name="order" value={formData.order} onChange={handleInputChange} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #d9d9d9' }} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>File Size (e.g. "4.2 MB PDF")</label>
                <input type="text" name="fileSize" value={formData.fileSize} onChange={handleInputChange} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #d9d9d9' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Icon Emoji (optional)</label>
                <input type="text" name="icon" value={formData.icon} onChange={handleInputChange} placeholder="📄" style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #d9d9d9' }} />
              </div>
            </div>

            <div style={{ background: '#f5f6fa', padding: '16px', borderRadius: '8px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>File Upload *</label>
              <input type="file" onChange={handleFileUpload} style={{ marginBottom: '8px' }} />
              {uploading && <span style={{ fontSize: '12px', color: '#666' }}>Uploading...</span>}
              {formData.fileUrl && <div style={{ fontSize: '12px', color: '#4a7c59' }}>Current File: {formData.fileUrl}</div>}
            </div>

            <button disabled={isLoading || uploading} type="submit" style={{ padding: '12px', background: '#4a7c59', color: '#fff', borderRadius: '4px', border: 'none', cursor: 'pointer', marginTop: '8px' }}>
              {isLoading ? 'Saving...' : 'Save Download'}
            </button>
          </form>
        </div>
      )}
      
      <div style={{ background: '#fff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#f5f6fa', borderBottom: '1px solid #e8e8e8' }}>
              <th style={{ padding: '16px', fontSize: '13px', color: '#777' }}>Title</th>
              <th style={{ padding: '16px', fontSize: '13px', color: '#777' }}>Type</th>
              <th style={{ padding: '16px', fontSize: '13px', color: '#777' }}>File</th>
              <th style={{ padding: '16px', fontSize: '13px', color: '#777' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {downloads.map(d => (
              <tr key={d._id} style={{ borderBottom: '1px solid #e8e8e8' }}>
                <td style={{ padding: '16px', fontSize: '14px', fontWeight: '500' }}>{d.title}</td>
                <td style={{ padding: '16px', fontSize: '14px', textTransform: 'capitalize' }}>{d.type}</td>
                <td style={{ padding: '16px', fontSize: '14px' }}>
                  <a href={d.fileUrl} target="_blank" rel="noreferrer" style={{ color: '#4a7c59', textDecoration: 'underline' }}>View File</a>
                </td>
                <td style={{ padding: '16px', fontSize: '14px' }}>
                  <button onClick={() => handleDelete(d._id)} style={{ color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer' }}>Delete</button>
                </td>
              </tr>
            ))}
            {downloads.length === 0 && (
              <tr>
                <td colSpan="4" style={{ padding: '16px', textAlign: 'center', color: '#777' }}>No downloads found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
