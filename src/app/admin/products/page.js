'use client';

import { useState, useEffect, useRef } from 'react';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState({});

  const initialForm = {
    name: '', code: '', series: '', category: '', weight: '',
    dimensions: '', description: '', image: '', technicalDrawing: '',
    pdfUrl: '', order: 0, featured: false
  };
  
  const [formData, setFormData] = useState(initialForm);

  const fetchProducts = () => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setProducts(data.products || []));
  };

  const fetchCategories = () => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data.categories || []));
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleFileUpload = async (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingFiles(prev => ({ ...prev, [fieldName]: true }));

    const form = new FormData();
    form.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: form
      });
      const data = await res.json();
      if (res.ok) {
        setFormData(prev => ({ ...prev, [fieldName]: data.url }));
      } else {
        alert(data.error || 'File upload failed');
      }
    } catch (err) {
      console.error(err);
      alert('Upload error');
    } finally {
      setUploadingFiles(prev => ({ ...prev, [fieldName]: false }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const dataToSend = { ...formData };
    if (!dataToSend.category) delete dataToSend.category;
    if (!dataToSend.series) delete dataToSend.series;

    const url = isEditing ? `/api/products/${editId}` : '/api/products';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
      });
      
      if (res.ok) {
        setFormData(initialForm);
        setShowForm(false);
        setIsEditing(false);
        setEditId(null);
        fetchProducts();
      } else {
        const errorData = await res.json();
        alert(errorData.error || 'Failed to save product');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name || '',
      code: product.code || '',
      series: product.series || '',
      category: product.category?._id || product.category || '',
      weight: product.weight || '',
      dimensions: product.dimensions || '',
      description: product.description || '',
      image: product.image || '',
      technicalDrawing: product.technicalDrawing || '',
      pdfUrl: product.pdfUrl || '',
      order: product.order || 0,
      featured: product.featured || false
    });
    setEditId(product._id);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchProducts();
      } else {
        const errorData = await res.json();
        alert(errorData.error || 'Failed to delete product');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Products</h1>
        <button 
          onClick={() => {
            if (showForm) {
              setShowForm(false);
              setIsEditing(false);
              setFormData(initialForm);
            } else {
              setShowForm(true);
            }
          }}
          style={{ padding: '10px 20px', background: '#4a7c59', color: '#fff', borderRadius: '4px', border: 'none', cursor: 'pointer' }}
        >
          {showForm ? 'Cancel' : 'Add Product'}
        </button>
      </div>

      {showForm && (
        <div style={{ background: '#fff', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>{isEditing ? 'Edit Product' : 'New Product'}</h2>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Name *</label>
              <input required type="text" name="name" value={formData.name} onChange={handleInputChange} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #d9d9d9' }} />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Code *</label>
              <input required type="text" name="code" value={formData.code} onChange={handleInputChange} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #d9d9d9' }} />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Series</label>
              <select name="series" value={formData.series} onChange={handleInputChange} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #d9d9d9' }}>
                <option value="">Select Series</option>
                <option value="31mm-sliding">31 MM Sliding</option>
                <option value="41mm-casement">41 MM Casement</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Category</label>
              <select name="category" value={formData.category} onChange={handleInputChange} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #d9d9d9' }}>
                <option value="">None</option>
                {categories.map(c => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Weight</label>
              <input type="text" name="weight" value={formData.weight} onChange={handleInputChange} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #d9d9d9' }} />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Dimensions</label>
              <input type="text" name="dimensions" value={formData.dimensions} onChange={handleInputChange} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #d9d9d9' }} />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Order</label>
              <input type="number" name="order" value={formData.order} onChange={handleInputChange} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #d9d9d9' }} />
            </div>

            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Description</label>
              <textarea name="description" value={formData.description} onChange={handleInputChange} rows={3} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #d9d9d9', resize: 'vertical' }} />
            </div>

            <div style={{ gridColumn: 'span 2', display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input type="checkbox" name="featured" id="featured" checked={formData.featured} onChange={handleInputChange} />
              <label htmlFor="featured" style={{ fontSize: '14px', fontWeight: '500' }}>Featured Product</label>
            </div>

            <div style={{ gridColumn: 'span 2', background: '#f5f6fa', padding: '16px', borderRadius: '8px', marginTop: '16px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '16px' }}>File Uploads</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '500' }}>Product Image</label>
                  <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'image')} style={{ marginBottom: '8px' }} />
                  {uploadingFiles.image && <span style={{ fontSize: '12px', color: '#666' }}>Uploading...</span>}
                  {formData.image && <div style={{ fontSize: '12px', color: '#4a7c59' }}>Current: {formData.image}</div>}
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '500' }}>Technical Drawing Image</label>
                  <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'technicalDrawing')} style={{ marginBottom: '8px' }} />
                  {uploadingFiles.technicalDrawing && <span style={{ fontSize: '12px', color: '#666' }}>Uploading...</span>}
                  {formData.technicalDrawing && <div style={{ fontSize: '12px', color: '#4a7c59' }}>Current: {formData.technicalDrawing}</div>}
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '500' }}>PDF Document</label>
                  <input type="file" accept=".pdf" onChange={(e) => handleFileUpload(e, 'pdfUrl')} style={{ marginBottom: '8px' }} />
                  {uploadingFiles.pdfUrl && <span style={{ fontSize: '12px', color: '#666' }}>Uploading...</span>}
                  {formData.pdfUrl && <div style={{ fontSize: '12px', color: '#4a7c59' }}>Current: {formData.pdfUrl}</div>}
                </div>
              </div>
            </div>

            <div style={{ gridColumn: 'span 2', marginTop: '16px' }}>
              <button disabled={isLoading} type="submit" style={{ padding: '12px 24px', background: '#4a7c59', color: '#fff', borderRadius: '4px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                {isLoading ? 'Saving...' : (isEditing ? 'Update Product' : 'Save Product')}
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div style={{ background: '#fff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#f5f6fa', borderBottom: '1px solid #e8e8e8' }}>
              <th style={{ padding: '16px', fontSize: '13px', color: '#777' }}>Code</th>
              <th style={{ padding: '16px', fontSize: '13px', color: '#777' }}>Name</th>
              <th style={{ padding: '16px', fontSize: '13px', color: '#777' }}>Series</th>
              <th style={{ padding: '16px', fontSize: '13px', color: '#777' }}>Category</th>
              <th style={{ padding: '16px', fontSize: '13px', color: '#777' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p._id} style={{ borderBottom: '1px solid #e8e8e8' }}>
                <td style={{ padding: '16px', fontSize: '14px', fontWeight: '500' }}>{p.code}</td>
                <td style={{ padding: '16px', fontSize: '14px' }}>{p.name}</td>
                <td style={{ padding: '16px', fontSize: '14px', color: '#777' }}>{p.series}</td>
                <td style={{ padding: '16px', fontSize: '14px', color: '#777' }}>{p.category?.name || '-'}</td>
                <td style={{ padding: '16px', fontSize: '14px' }}>
                  <button onClick={() => handleEdit(p)} style={{ color: '#4a7c59', background: 'none', border: 'none', cursor: 'pointer', marginRight: '12px' }}>Edit</button>
                  <button onClick={() => handleDelete(p._id)} style={{ color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer' }}>Delete</button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan="5" style={{ padding: '16px', textAlign: 'center', color: '#777' }}>No products found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
