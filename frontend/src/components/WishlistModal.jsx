import React from "react";

export default function WishlistModal({
  isOpen,
  onClose,
  wishlist,
  onRemoveFromWishlist,
  onAddToCart,
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content wishlist-modal-panel" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="header-title-flex">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#ec4899" stroke="#ec4899" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            <h2>Your Saved Wishlist</h2>
            <span className="wishlist-counter-tag">({wishlist.length})</span>
          </div>

          <button className="modal-close-btn" onClick={onClose} aria-label="Close wishlist">
            ✕
          </button>
        </div>

        <div className="modal-body-scroll">
          {wishlist.length === 0 ? (
            <div className="wishlist-empty-box">
              <span className="heart-empty-icon">🤍</span>
              <h3>Your wishlist is empty</h3>
              <p>Explore our catalog and click the heart icon on any product to save it here for later.</p>
              <button className="explore-btn" onClick={onClose}>
                Browse Popular Products
              </button>
            </div>
          ) : (
            <div className="wishlist-items-grid">
              {wishlist.map((item) => (
                <div key={item._id || item.id} className="wishlist-item-card">
                  <div className="wishlist-thumb" style={{ backgroundColor: item.color || "#f1f5f9" }}>
                    <img src={item.image} alt={item.name} onError={(e) => { e.target.style.display = 'none'; }} />
                    <span>{item.emoji || "🛍️"}</span>
                  </div>

                  <div className="wishlist-info">
                    <span className="wishlist-cat">{item.category}</span>
                    <h4 className="wishlist-name">{item.name}</h4>
                    <strong className="wishlist-price">₹{item.price.toLocaleString("en-IN")}</strong>
                  </div>

                  <div className="wishlist-actions">
                    <button
                      className="move-to-cart-btn"
                      onClick={() => {
                        onAddToCart(item);
                        onRemoveFromWishlist(item);
                      }}
                      title="Move to Shopping Cart"
                    >
                      + Move to Cart
                    </button>

                    <button
                      className="wishlist-delete-btn"
                      onClick={() => onRemoveFromWishlist(item)}
                      title="Remove from Wishlist"
                      aria-label="Remove item"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
