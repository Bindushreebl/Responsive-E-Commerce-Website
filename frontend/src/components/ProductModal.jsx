import React, { useState } from "react";

export default function ProductModal({
  product,
  onClose,
  onAddToCart,
  onBuyNow,
  isWishlisted,
  onToggleWishlist,
}) {
  const [quantity, setQuantity] = useState(1);
  const [imageError, setImageError] = useState(false);

  if (!product) return null;

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleIncrease = () => {
    if (quantity < (product.stock || 99)) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content product-modal-wrap" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          ✕
        </button>

        <div className="product-modal-grid">
          {/* Left Column: Media */}
          <div className="modal-media-pane" style={{ backgroundColor: product.color || "#f8fafc" }}>
            <div className="modal-media-badges">
              {product.badge && <span className="badge-pill badge-primary">{product.badge}</span>}
              {discountPercent > 0 && <span className="badge-pill badge-discount">-{discountPercent}% OFF</span>}
            </div>

            {!imageError ? (
              <img
                src={product.image}
                alt={product.name}
                className="modal-product-img"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="modal-emoji-display">
                <span>{product.emoji || "🛍️"}</span>
              </div>
            )}
          </div>

          {/* Right Column: Info & Actions */}
          <div className="modal-info-pane">
            <div className="modal-header-meta">
              <span className="modal-category">{product.category}</span>
              <div className="modal-rating">
                <span className="star">★</span>
                <strong>{product.rating}</strong>
                <span className="count">({product.reviewsCount} customer reviews)</span>
              </div>
            </div>

            <h2 className="modal-product-title">{product.name}</h2>

            <div className="modal-pricing-box">
              <span className="modal-price">₹{(product.price * quantity).toLocaleString("en-IN")}</span>
              {product.originalPrice && (
                <span className="modal-orig-price">₹{(product.originalPrice * quantity).toLocaleString("en-IN")}</span>
              )}
              {discountPercent > 0 && (
                <span className="modal-savings-pill">Save {discountPercent}%</span>
              )}
            </div>

            <p className="modal-description">{product.description}</p>

            {/* Key features bullet points */}
            {product.features && product.features.length > 0 && (
              <div className="modal-features-section">
                <h4>Key Highlights:</h4>
                <ul className="modal-features-list">
                  {product.features.map((feat, index) => (
                    <li key={index}>
                      <span className="bullet-check">✓</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Stock status */}
            <div className="modal-stock-indicator">
              <span className="stock-dot stock-ok"></span>
              <span>Available in warehouse • <strong>{product.stock || 20} units remaining</strong></span>
            </div>

            {/* Quantity Selector */}
            <div className="modal-quantity-row">
              <span className="qty-label">Quantity:</span>
              <div className="quantity-stepper">
                <button
                  type="button"
                  onClick={handleDecrease}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="qty-number">{quantity}</span>
                <button
                  type="button"
                  onClick={handleIncrease}
                  disabled={quantity >= (product.stock || 99)}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="modal-actions-row">
              <button
                className="modal-add-cart-btn"
                onClick={() => {
                  onAddToCart(product, quantity);
                  onClose();
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
                <span>Add to Cart (₹{(product.price * quantity).toLocaleString("en-IN")})</span>
              </button>

              <button
                className="modal-buy-now-btn"
                onClick={() => {
                  onBuyNow(product, quantity);
                }}
              >
                <span>⚡ Buy Now</span>
              </button>

              <button
                className={`modal-wishlist-btn ${isWishlisted ? 'active' : ''}`}
                onClick={() => onToggleWishlist(product)}
                aria-label="Toggle Wishlist"
                title="Save to Wishlist"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill={isWishlisted ? "#ec4899" : "none"} stroke={isWishlisted ? "#ec4899" : "currentColor"} strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </button>
            </div>

            {/* Trust Footer */}
            <div className="modal-trust-perks">
              <div className="perk-tag">🚚 Free Shipping &gt; ₹999</div>
              <div className="perk-tag">🛡️ 1-Year Brand Warranty</div>
              <div className="perk-tag">🔄 30-Day Hassle-Free Return</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
