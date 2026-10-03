import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { PlusCircle, Edit2, Trash2, X, Check, PackagePlus } from 'lucide-react';
import { API_BASE_URL } from '../config';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [msg, setMsg] = useState(null);

  // Form State for Adding Product
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit Modal State
  const [editingProduct, setEditingProduct] = useState(null);
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editImage, setEditImage] = useState('');

  // Fetch all products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/products`);
      const data = await res.json();
      setProducts(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const showNotification = (message) => {
    setMsg(message);
    setTimeout(() => setMsg(null), 3000);
  };

  // Add Product Handler
  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!name || !price || !description || !image) {
      setError('Please provide all product fields.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          name,
          price: Number(price),
          description,
          image,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to add product');
      }

      // Reset form
      setName('');
      setPrice('');
      setDescription('');
      setImage('');
      showNotification(`Product "${data.name}" added successfully!`);
      fetchProducts();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Product Handler
  const handleDeleteProduct = async (id, prodName) => {
    if (!window.confirm(`Are you sure you want to delete "${prodName}"?`)) {
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to delete product');
      }

      showNotification(`Product "${prodName}" deleted.`);
      fetchProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  // Open Edit Modal
  const openEditModal = (product) => {
    setEditingProduct(product);
    setEditName(product.name);
    setEditPrice(product.price);
    setEditDescription(product.description);
    setEditImage(product.image);
  };

  // Submit Edit Handler
  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/api/products/${editingProduct._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          name: editName,
          price: Number(editPrice),
          description: editDescription,
          image: editImage,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to update product');
      }

      setEditingProduct(null);
      showNotification(`Product updated successfully!`);
      fetchProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Admin Dashboard</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Manage your store catalog: add new items, update details, or remove products.
        </p>
      </div>

      {msg && <div className="alert alert-success">{msg}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Form: Add New Product */}
      <div className="admin-card">
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <PackagePlus size={20} color="var(--primary)" />
          Add New Product
        </h2>

        <form onSubmit={handleAddProduct}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label>Product Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Ultra HD Monitor"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Price ($ USD)</label>
              <input
                type="number"
                step="0.01"
                className="form-control"
                placeholder="e.g. 199.99"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Image URL</label>
            <input
              type="url"
              className="form-control"
              placeholder="https://images.unsplash.com/..."
              value={image}
              onChange={(e) => setImage(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              className="form-control"
              rows={3}
              placeholder="Describe the product specifications, features, etc."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            <PlusCircle size={18} />
            {isSubmitting ? 'Saving...' : 'Add Product'}
          </button>
        </form>
      </div>

      {/* Table: Display All Current Products */}
      <div className="admin-card">
        <div className="admin-header">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
            Current Store Products ({products.length})
          </h2>
          <button onClick={fetchProducts} className="btn btn-outline btn-sm">
            Refresh List
          </button>
        </div>

        {loading ? (
          <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
            Loading products...
          </p>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((prod) => (
                  <tr key={prod._id}>
                    <td>
                      <img src={prod.image} alt={prod.name} className="table-img" />
                    </td>
                    <td style={{ fontWeight: 700, color: 'var(--text-main)', maxWidth: '200px' }}>
                      {prod.name}
                    </td>
                    <td style={{ fontWeight: 800, color: 'var(--primary)' }}>
                      ${Number(prod.price).toFixed(2)}
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.875rem', maxWidth: '300px' }}>
                      {prod.description}
                    </td>
                    <td>
                      <div className="table-actions">
                        <button
                          onClick={() => openEditModal(prod)}
                          className="btn btn-outline btn-sm"
                          title="Edit Product"
                        >
                          <Edit2 size={14} /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(prod._id, prod.name)}
                          className="btn btn-danger btn-sm"
                          title="Delete Product"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="modal-overlay" onClick={() => setEditingProduct(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Edit Product</h3>
              <button
                onClick={() => setEditingProduct(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdateProduct}>
              <div className="form-group">
                <label>Product Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Price ($ USD)</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-control"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="url"
                  className="form-control"
                  value={editImage}
                  onChange={(e) => setEditImage(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
