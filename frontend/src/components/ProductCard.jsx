import React, { useState } from "react";

export default function ProductCard({
  product,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onQuickView,
}) {
  const [isAdded, setIsAdded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAdd = (e) => {
    e.stopPropagation();
    onAddToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <article
      className="product-card"
      onClick={() => onQuickView(product)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') onQuickView(product); }}
      aria-label={`View details for ${product.name}`}
    >
      {/* Card Header Media */}
      <div className="product-media" style={{ backgroundColor: product.color || "#f1f5f9" }}>
        {/* Badges */}
        <div className="media-badges">
          {product.badge && <span className="badge-pill badge-primary">{product.badge}</span>}
          {discountPercent > 0 && <span className="badge-pill badge-discount">-{discountPercent}%</span>}
        </div>

        {/* Wishlist Button */}
        <button
          className={`wishlist-toggle-btn ${isWishlisted ? 'wishlist-active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          aria-label={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
          title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill={isWishlisted ? "#ec4899" : "none"} stroke={isWishlisted ? "#ec4899" : "currentColor"} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>

        {/* Product Image */}
        {!imageError ? (
          <img
            src={product.image}
            alt={product.name}
            className="product-thumbnail"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="product-emoji-fallback">
            <span className="emoji-large">{product.emoji || "🛍️"}</span>
          </div>
        )}

        {/* Quick View Overlay Button */}
        <div className="quick-view-overlay">
          <span className="quick-view-label">Quick Preview</span>
        </div>
      </div>

      {/* Card Body */}
      <div className="product-details">
        <div className="product-meta">
          <span className="product-category-tag">{product.category}</span>
          <div className="product-rating-box">
            <span className="star-icon">★</span>
            <span className="rating-value">{product.rating}</span>
            <span className="reviews-count">({product.reviewsCount})</span>
          </div>
        </div>

        <h3 className="product-title" title={product.name}>
          {product.name}
        </h3>

        <p className="product-snippet">
          {product.description}
        </p>

        {/* Stock status indicator */}
        <div className="product-stock-status">
          <span className={`stock-dot ${product.stock < 15 ? 'stock-low' : 'stock-ok'}`}></span>
          <span className="stock-text">
            {product.stock < 15 ? `Only ${product.stock} left in stock` : 'In Stock & Ready to Ship'}
          </span>
        </div>

        {/* Price & Action */}
        <div className="product-footer">
          <div className="price-wrapper">
            <div className="price-main">
              <span className="current-price">₹{product.price.toLocaleString("en-IN")}</span>
              {product.originalPrice && (
                <span className="original-price">₹{product.originalPrice.toLocaleString("en-IN")}</span>
              )}
            </div>
            {discountPercent > 0 && (
              <span className="savings-tag">Save ₹{(product.originalPrice - product.price).toLocaleString("en-IN")}</span>
            )}
          </div>

          <button
            className={`card-add-btn ${isAdded ? 'btn-success' : ''}`}
            onClick={handleAdd}
            aria-label={`Add ${product.name} to cart`}
          >
            {isAdded ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>Added</span>
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
