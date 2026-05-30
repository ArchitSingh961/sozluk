'use client';

import React, { useState, useEffect } from 'react';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', slug: '', parent: '', image: '', description: '', order: 0 });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data.categories || []));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Clean up empty parent field before sending
    const dataToSend = { ...formData };
    if (!dataToSend.parent) {
      delete dataToSend.parent;
    }

    try {
      const url = editingId ? `/api/categories/${editingId}` : '/api/categories';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
      });
      
      if (res.ok) {
        setFormData({ name: '', slug: '', parent: '', image: '', description: '', order: 0 });
        setShowForm(false);
        setEditingId(null);
        fetchCategories();
      } else {
        const errorData = await res.json();
        alert(errorData.error || 'Failed to save category');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (category) => {
    setFormData({
      name: category.name || '',
      slug: category.slug || '',
      parent: category.parent || '',
      image: category.image || '',
      description: category.description || '',
      order: category.order || 0
    });
    setEditingId(category._id);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ name: '', slug: '', parent: '', image: '', description: '', order: 0 });
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    
    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchCategories();
      } else {
        const errorData = await res.json();
        alert(errorData.error || 'Failed to delete category');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Categories</h1>
        <button 
          onClick={() => {
            if (showForm) {
              handleCancel();
            } else {
              setShowForm(true);
            }
          }}
          style={{ padding: '10px 20px', background: '#4a7c59', color: '#fff', borderRadius: '4px', border: 'none', cursor: 'pointer' }}
        >
          {showForm ? 'Cancel' : 'Add Category'}
        </button>
      </div>

      {showForm && (
        <div style={{ background: '#fff', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>{editingId ? 'Edit Category' : 'New Category'}</h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Name *</label>
              <input required type="text" name="name" value={formData.name} onChange={handleInputChange} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #d9d9d9' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Slug *</label>
              <input required type="text" name="slug" value={formData.slug} onChange={handleInputChange} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #d9d9d9' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Parent Category</label>
              <select name="parent" value={formData.parent} onChange={handleInputChange} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #d9d9d9' }}>
                <option value="">None (Top Level)</option>
                {categories.map(c => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Order</label>
              <input type="number" name="order" value={formData.order} onChange={handleInputChange} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #d9d9d9' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Image URL</label>
              <input type="text" name="image" value={formData.image} onChange={handleInputChange} placeholder="/images/series.png" style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #d9d9d9' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Description</label>
              <textarea name="description" value={formData.description} onChange={handleInputChange} rows={3} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #d9d9d9', resize: 'vertical' }} />
            </div>
            <button disabled={isLoading} type="submit" style={{ padding: '12px', background: '#4a7c59', color: '#fff', borderRadius: '4px', border: 'none', cursor: 'pointer', marginTop: '8px' }}>
              {isLoading ? 'Saving...' : 'Save Category'}
            </button>
          </form>
        </div>
      )}
      
      <div style={{ background: '#fff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#f5f6fa', borderBottom: '1px solid #e8e8e8' }}>
              <th style={{ padding: '16px', fontSize: '13px', color: '#777' }}>Name</th>
              <th style={{ padding: '16px', fontSize: '13px', color: '#777' }}>Slug</th>
              <th style={{ padding: '16px', fontSize: '13px', color: '#777' }}>Parent</th>
              <th style={{ padding: '16px', fontSize: '13px', color: '#777' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.filter(c => !c.parent).map(parentCat => {
              const children = categories.filter(c => c.parent === parentCat._id);
              
              return (
                <React.Fragment key={parentCat._id}>
                  {/* Parent Row */}
                  <tr style={{ borderBottom: '1px solid #e8e8e8', background: '#fafafa' }}>
                    <td style={{ padding: '16px', fontSize: '15px', fontWeight: '600', color: '#333' }}>{parentCat.name}</td>
                    <td style={{ padding: '16px', fontSize: '14px', color: '#777' }}>{parentCat.slug}</td>
                    <td style={{ padding: '16px', fontSize: '14px', color: '#aaa' }}>-</td>
                    <td style={{ padding: '16px', fontSize: '14px' }}>
                      <button onClick={() => handleEdit(parentCat)} style={{ color: '#4f46e5', background: 'none', border: 'none', cursor: 'pointer', marginRight: '16px' }}>Edit</button>
                      <button onClick={() => handleDelete(parentCat._id)} style={{ color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer' }}>Delete</button>
                    </td>
                  </tr>
                  
                  {/* Children Rows */}
                  {children.map(child => (
                    <tr key={child._id} style={{ borderBottom: '1px solid #e8e8e8' }}>
                      <td style={{ padding: '16px 16px 16px 40px', fontSize: '14px', fontWeight: '400', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: '#ccc' }}>↳</span> {child.name}
                      </td>
                      <td style={{ padding: '16px', fontSize: '14px', color: '#777' }}>{child.slug}</td>
                      <td style={{ padding: '16px', fontSize: '14px', color: '#777' }}>{parentCat.name}</td>
                      <td style={{ padding: '16px', fontSize: '14px' }}>
                        <button onClick={() => handleEdit(child)} style={{ color: '#4f46e5', background: 'none', border: 'none', cursor: 'pointer', marginRight: '16px' }}>Edit</button>
                        <button onClick={() => handleDelete(child._id)} style={{ color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer' }}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
