'use client';

import { useState, useEffect } from 'react';

export default function AdminGallery() {
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', image: '', order: 0 });
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fetchGallery = () => {
    fetch('/api/gallery')
      .then(res => res.json())
      .then(data => setItems(data.items || []));
  };

  useEffect(() => {
    fetchGallery();
  }, []);

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
        setFormData(prev => ({ ...prev, image: data.url }));
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
    if (!formData.image) {
      return alert('Please upload an image first.');
    }

    setIsLoading(true);
    
    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `/api/gallery/${editingId}` : '/api/gallery';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setFormData({ title: '', image: '', order: 0 });
        setEditingId(null);
        setShowForm(false);
        fetchGallery();
      } else {
        const errorData = await res.json();
        alert(errorData.error || 'Failed to save item');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (item) => {
    setFormData({ title: item.title || '', image: item.image, order: item.order || 0 });
    setEditingId(item._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this gallery item?')) return;
    
    try {
      const res = await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchGallery();
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
        <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Gallery</h1>
        <button 
          onClick={() => {
            if (showForm) {
              setEditingId(null);
              setFormData({ title: '', image: '', order: 0 });
            }
            setShowForm(!showForm);
          }}
          style={{ padding: '10px 20px', background: '#4a7c59', color: '#fff', borderRadius: '4px', border: 'none', cursor: 'pointer' }}
        >
          {showForm ? 'Cancel' : 'Upload Image'}
        </button>
      </div>

      {showForm && (
        <div style={{ background: '#fff', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>
            {editingId ? 'Edit Gallery Item' : 'New Gallery Item'}
          </h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Title</label>
              <input type="text" name="title" value={formData.title} onChange={handleInputChange} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #d9d9d9' }} />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Image File *</label>
              <input type="file" accept="image/*" onChange={handleFileUpload} style={{ marginBottom: '8px' }} />
              {uploading && <span style={{ fontSize: '12px', color: '#666' }}>Uploading...</span>}
              {formData.image && (
                <div style={{ marginTop: '8px' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={formData.image} alt="Preview" style={{ width: '100px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
                </div>
              )}
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Order</label>
              <input type="number" name="order" value={formData.order} onChange={handleInputChange} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #d9d9d9' }} />
            </div>

            <button disabled={isLoading || uploading} type="submit" style={{ padding: '12px', background: '#4a7c59', color: '#fff', borderRadius: '4px', border: 'none', cursor: 'pointer', marginTop: '8px' }}>
              {isLoading ? 'Saving...' : editingId ? 'Update Gallery Item' : 'Save Gallery Item'}
            </button>
          </form>
        </div>
      )}
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
        {items.map(item => (
          <div key={item._id} style={{ background: '#fff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
            <div style={{ height: '200px', width: '100%', background: '#f5f6fa' }}>
              <img src={item.image} alt={item.title || 'Gallery image'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '500', margin: 0 }}>{item.title || 'Untitled'}</h3>
                <p style={{ fontSize: '12px', color: '#777', margin: '4px 0 0 0' }}>Order: {item.order}</p>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={() => handleEdit(item)} style={{ color: '#4a7c59', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }}>Edit</button>
                <button onClick={() => handleDelete(item._id)} style={{ color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }}>Delete</button>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', color: '#777', background: '#fff', borderRadius: '8px' }}>
            No images in gallery yet.
          </div>
        )}
      </div>
    </div>
  );
}
