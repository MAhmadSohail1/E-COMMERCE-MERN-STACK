import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Trash2, Plus, Minus, ShoppingBag, CheckCircle, ArrowRight } from 'lucide-react';
import { API_BASE_URL } from '../config';

const CartPage = () => {
  const { cartItems, totalPrice, updateQty, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [checkingOut, setCheckingOut] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [error, setError] = useState(null);

  const handleCheckout = async () => {
    if (!user) {
      // Redirect to login if not logged in
      navigate('/login');
      return;
    }

    if (cartItems.length === 0) return;

    setCheckingOut(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(user.token ? { Authorization: `Bearer ${user.token}` } : {}),
        },
        body: JSON.stringify({
          userId: user._id,
          products: cartItems,
          totalPrice,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to place order');
      }

      setOrderSuccess(data);
      clearCart();
    } catch (err) {
      setError(err.message);
    } finally {
      setCheckingOut(false);
    }
  };

  // Order Success Screen
  if (orderSuccess) {
    return (
      <div className="empty-state" style={{ maxWidth: '600px', margin: '3rem auto' }}>
        <CheckCircle size={64} style={{ color: 'var(--success)', margin: '0 auto 1.5rem' }} />
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          Order Confirmed!
        </h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          Thank you, <strong>{user?.name}</strong>! Your Cash on Delivery order has been successfully placed.
        </p>

        <div
          style={{
            background: 'var(--bg-subtle)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            textAlign: 'left',
            marginBottom: '1.5rem',
          }}
        >
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Order ID: <code>{orderSuccess._id}</code>
          </p>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Payment Method: <strong>Cash on Delivery</strong>
          </p>
          <p style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)', marginTop: '0.5rem' }}>
            Total Amount: ${orderSuccess.totalPrice.toFixed(2)}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button onClick={() => setOrderSuccess(null)} className="btn btn-outline">
            View Cart
          </button>
          <Link to="/" className="btn btn-primary">
            Continue Shopping <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  // Empty Cart State
  if (cartItems.length === 0) {
    return (
      <div className="empty-state">
        <ShoppingBag size={56} style={{ color: 'var(--text-light)', margin: '0 auto 1rem' }} />
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          Your Cart is Empty
        </h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          Looks like you haven't added anything to your cart yet.
        </p>
        <Link to="/" className="btn btn-primary">
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1.5rem' }}>
        Shopping Cart ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
      </h1>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="cart-layout">
        {/* Cart Items List */}
        <div className="cart-items-card">
          {cartItems.map((item) => (
            <div key={item._id} className="cart-item">
              <img src={item.image} alt={item.name} className="cart-item-img" />

              <div className="cart-item-details">
                <h2 className="cart-item-title" style={{ fontSize: '1rem' }}>{item.name}</h2>
                <p className="cart-item-price">${Number(item.price).toFixed(2)} each</p>
              </div>

              {/* Quantity Controls */}
              <div className="qty-controls">
                <button
                  onClick={() => updateQty(item._id, (item.qty || 1) - 1)}
                  className="qty-btn"
                  title="Decrease"
                >
                  <Minus size={14} />
                </button>
                <span className="qty-value">{item.qty || 1}</span>
                <button
                  onClick={() => updateQty(item._id, (item.qty || 1) + 1)}
                  className="qty-btn"
                  title="Increase"
                >
                  <Plus size={14} />
                </button>
              </div>

              {/* Item Total */}
              <div style={{ textAlign: 'right', minWidth: '80px' }}>
                <div style={{ fontWeight: 800, color: 'var(--text-main)' }}>
                  ${(item.price * (item.qty || 1)).toFixed(2)}
                </div>
              </div>

              {/* Remove Button */}
              <button
                onClick={() => removeFromCart(item._id)}
                className="btn-logout"
                style={{ padding: '0.4rem', border: 'none' }}
                title="Remove Item"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* Order Summary & Checkout Card */}
        <div className="cart-summary-card">
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.25rem' }}>
            Order Summary
          </h3>

          <div className="summary-row">
            <span>Items Subtotal:</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>

          <div className="summary-row">
            <span>Shipping:</span>
            <span style={{ color: 'var(--success)', fontWeight: 700 }}>FREE</span>
          </div>

          <div className="summary-row">
            <span>Payment Mode:</span>
            <span>Cash on Delivery (COD)</span>
          </div>

          <div className="summary-row summary-total">
            <span>Total Price:</span>
            <span style={{ color: 'var(--primary)' }}>${totalPrice.toFixed(2)}</span>
          </div>

          {!user && (
            <p style={{ fontSize: '0.8rem', color: 'var(--warning)', marginTop: '0.5rem' }}>
              ℹ️ Please log in to complete checkout.
            </p>
          )}

          <button
            onClick={handleCheckout}
            disabled={checkingOut}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1.25rem' }}
          >
            {checkingOut
              ? 'Processing Order...'
              : user
              ? 'Proceed to Checkout (COD)'
              : 'Login to Checkout'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
