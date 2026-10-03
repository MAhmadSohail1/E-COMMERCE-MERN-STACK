import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import {
  Search,
  Sparkles,
  Truck,
  ShieldCheck,
  Zap,
  Award,
  Flame,
} from 'lucide-react';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/products');
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || 'Failed to fetch products from backend');
      }
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
      setError(null);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const categories = ['All', 'Audio', 'Wearables', 'Gaming', 'Gear'];

  // Bulletproof filtering
  const filteredProducts = products.filter((p) => {
    if (!p) return false;
    const nameStr = (p.name || '').toLowerCase();
    const descStr = (p.description || '').toLowerCase();
    const query = searchTerm.toLowerCase().trim();

    const matchesSearch = query === '' || nameStr.includes(query) || descStr.includes(query);
    if (!matchesSearch) return false;

    if (selectedCategory === 'All') return true;

    const combined = `${nameStr} ${descStr}`;
    if (selectedCategory === 'Audio') {
      return combined.includes('headphone') || combined.includes('speaker') || combined.includes('microphone') || combined.includes('audio');
    }
    if (selectedCategory === 'Wearables') {
      return combined.includes('watch') || combined.includes('fitness') || combined.includes('wearable');
    }
    if (selectedCategory === 'Gaming') {
      return combined.includes('keyboard') || combined.includes('mouse') || combined.includes('monitor') || combined.includes('gaming');
    }
    if (selectedCategory === 'Gear') {
      return combined.includes('backpack') || combined.includes('stand') || combined.includes('charger') || combined.includes('charging');
    }
    return true;
  });

  return (
    <div className="home-wrapper">
      {/* VIP Hero Banner */}
      <section className="vip-hero">
        <div className="vip-hero-glow"></div>
        <div className="vip-hero-content">
          <div className="vip-badge-pill">
            <Sparkles size={14} className="sparkle-icon" />
            <span>VIP E-COMMERCE STORE • 2026 EDITION</span>
          </div>

          <h1 className="vip-hero-title">
            Discover Elite Tech & <br />
            <span className="gradient-text">Luxury Lifestyle Gear</span>
          </h1>

          <p className="vip-hero-subtitle">
            Curated high-performance products at manufacturer-direct prices.
            Fast nationwide Cash on Delivery and 100% authenticity guaranteed.
          </p>

          <div className="vip-hero-actions">
            <a href="#catalog-section" className="btn btn-primary btn-vip-cta">
              <Flame size={18} /> Explore Collection
            </a>
          </div>
        </div>

        {/* Feature Trust Badges */}
        <div className="vip-trust-grid">
          <div className="trust-item">
            <div className="trust-icon"><Truck size={20} /></div>
            <div>
              <h4>Express Shipping</h4>
              <p>Fast 24-48h dispatch</p>
            </div>
          </div>
          <div className="trust-item">
            <div className="trust-icon"><Zap size={20} /></div>
            <div>
              <h4>Cash on Delivery</h4>
              <p>Pay upon inspection</p>
            </div>
          </div>
          <div className="trust-item">
            <div className="trust-icon"><ShieldCheck size={20} /></div>
            <div>
              <h4>Genuine Products</h4>
              <p>100% verified quality</p>
            </div>
          </div>
          <div className="trust-item">
            <div className="trust-icon"><Award size={20} /></div>
            <div>
              <h4>1-Year Warranty</h4>
              <p>Hassle-free support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Centralized VIP Search & Category Section */}
      <div id="catalog-section" className="vip-search-center-container">
        <div className="search-header-group">
          <span className="search-eyebrow">PREMIUM STORE CATALOG</span>
          <h2 className="search-main-heading">Explore Our Collection</h2>
          <p className="search-main-subheading">
            Browse verified tech devices, audio gear, and luxury desk accessories
          </p>
        </div>

        {/* Centralized Search Bar */}
        <div className="central-search-wrapper">
          <div className="central-search-bar">
            <Search size={22} className="central-search-icon" />
            <input
              type="text"
              className="central-search-input"
              placeholder="Search 4K monitors, headphones, keyboards, smartwatches..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                className="central-clear-btn"
                onClick={() => setSearchTerm('')}
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Centralized Category Filter Pills */}
        <div className="central-category-pills">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`central-pill ${selectedCategory === cat ? 'active' : ''}`}
            >
              {cat === 'All' && '✨ All Products'}
              {cat === 'Audio' && '🎧 Audio & Sound'}
              {cat === 'Wearables' && '⌚ Smart Wearables'}
              {cat === 'Gaming' && '🎮 Gaming & Displays'}
              {cat === 'Gear' && '🎒 Everyday Gear'}
            </button>
          ))}
        </div>

        {/* Results Count Badge */}
        <div className="results-count-badge">
          Showing <strong>{filteredProducts.length}</strong> of {products.length} products
          {searchTerm && <span> matching "<em>{searchTerm}</em>"</span>}
          {selectedCategory !== 'All' && <span> in <strong>{selectedCategory}</strong></span>}
        </div>
      </div>

      {/* Loading & Error States */}
      {loading && (
        <div className="loading-container">
          <div className="vip-spinner"></div>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '1rem' }}>
            Fetching VIP catalog from database...
          </p>
        </div>
      )}

      {error && (
        <div className="alert alert-danger" style={{ maxWidth: '600px', margin: '1rem auto' }}>
          Error loading products: {error}
        </div>
      )}

      {/* Product Grid */}
      {!loading && !error && (
        <>
          {filteredProducts.length === 0 ? (
            <div className="empty-state" style={{ maxWidth: '600px', margin: '2rem auto' }}>
              <p style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)' }}>
                No products found
              </p>
              <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                No items match your search for "{searchTerm}" in category "{selectedCategory}".
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All');
                }}
                className="btn btn-outline"
                style={{ marginTop: '1.25rem' }}
              >
                Reset Search & Filters
              </button>
            </div>
          ) : (
            <div className="products-grid">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HomePage;
