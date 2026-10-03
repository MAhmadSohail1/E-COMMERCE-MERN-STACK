import React, { useState } from 'react';
import { ShoppingCart, Check, Star, Zap } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  // Determine a VIP badge based on price or product
  const isHotDeal = product.price < 60;
  const isPremium = product.price >= 100;

  return (
    <div className="product-card">
      <div className="product-image-box">
        {isPremium && <span className="product-badge badge-vip">👑 Premium VIP</span>}
        {isHotDeal && <span className="product-badge badge-deal">🔥 Hot Deal</span>}
        {!isPremium && !isHotDeal && <span className="product-badge badge-popular">⚡ Best Seller</span>}

        <img
          src={product.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'}
          alt={product.name}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80';
          }}
        />
        <div className="image-overlay-glow"></div>
      </div>

      <div className="product-info">
        {/* Rating and Reviews */}
        <div className="product-meta">
          <div className="product-rating">
            <Star size={13} className="star-icon filled" />
            <span className="rating-value">4.9</span>
            <span className="reviews-count">(95+ reviews)</span>
          </div>
          <span className="in-stock-tag">In Stock</span>
        </div>

        <h3 className="product-title" title={product.name}>{product.name}</h3>
        <p className="product-desc" title={product.description}>{product.description}</p>

        <div className="product-footer">
          <div className="price-block">
            <span className="product-price">${Number(product.price).toFixed(2)}</span>
            <span className="original-price">${(Number(product.price) * 1.25).toFixed(2)}</span>
          </div>

          <button
            onClick={handleAddToCart}
            className={`btn btn-sm ${added ? 'btn-success' : 'btn-primary'} btn-cart-action`}
          >
            {added ? (
              <>
                <Check size={14} /> Added!
              </>
            ) : (
              <>
                <ShoppingCart size={14} /> Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
