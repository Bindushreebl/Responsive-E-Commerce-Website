import React, { useState } from "react";

export default function Navbar({
  search,
  setSearch,
  cartCount,
  cartTotal,
  wishlistCount,
  ordersCount,
  theme,
  toggleTheme,
  onOpenCart,
  onOpenWishlist,
  onOpenOrders,
  categories,
  selectedCategory,
  onSelectCategory,
  dbStatus,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Top Notification Announcement Bar */}
      <div className="top-announcement-bar">
        <div className="announcement-content">
          <span className="announcement-badge">FLASH SALE</span>
          <p className="announcement-text">
            Use code <strong className="promo-tag">LUXE20</strong> for 20% OFF | Free Express Delivery on orders over ₹999! 🚚
          </p>
        </div>
        <div className="announcement-status">
          <span className={`status-dot ${dbStatus === 'connected' ? 'dot-active' : ''}`}></span>
          <span className="status-label">{dbStatus === 'connected' ? 'Live DB Synced' : 'Connecting DB...'}</span>
        </div>
      </div>

      {/* Main Glass Navbar */}
      <header className="navbar-container">
        <div className="navbar-inner">
          {/* Brand Logo */}
          <a href="#" className="brand-logo" onClick={(e) => { e.preventDefault(); onSelectCategory("All"); setSearch(""); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
            <div className="brand-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
            </div>
            <div className="brand-text">
              ShopEase<span className="brand-dot">.</span>
              <span className="brand-tag">LUXE</span>
            </div>
          </a>

          {/* Search Box */}
          <div className="navbar-search">
            <span className="search-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </span>
            <input
              type="text"
              id="search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search audio, sneakers, watches, gadgets..."
              aria-label="Search products"
            />
            {search && (
              <button
                className="search-clear-btn"
                onClick={() => setSearch("")}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {/* Action cluster */}
          <div className="navbar-actions">
            {/* Theme Toggle */}
            <button
              className="action-btn theme-toggle-btn"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === "light" ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5"></circle>
                  <line x1="12" y1="1" x2="12" y2="3"></line>
                  <line x1="12" y1="21" x2="12" y2="23"></line>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                  <line x1="1" y1="12" x2="3" y2="12"></line>
                  <line x1="21" y1="12" x2="23" y2="12"></line>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>
              )}
            </button>

            {/* Orders History Button */}
            <button
              className="action-btn orders-btn"
              onClick={onOpenOrders}
              aria-label="View Order History"
              title="View Order History"
            >
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                <line x1="8" y1="21" x2="16" y2="21"></line>
                <line x1="12" y1="17" x2="12" y2="21"></line>
              </svg>
              <span className="btn-text-desktop">Orders</span>
              {ordersCount > 0 && <span className="action-badge badge-blue">{ordersCount}</span>}
            </button>

            {/* Wishlist Button */}
            <button
              className="action-btn wishlist-btn"
              onClick={onOpenWishlist}
              aria-label="View Wishlist"
              title="View Wishlist"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              {wishlistCount > 0 && <span className="action-badge badge-pink">{wishlistCount}</span>}
            </button>

            {/* Shopping Cart Button */}
            <button
              className="cart-primary-btn"
              onClick={onOpenCart}
              aria-label="View Shopping Cart"
              id="cart-trigger-btn"
            >
              <div className="cart-icon-wrapper">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                {cartCount > 0 && <span className="cart-bubble">{cartCount}</span>}
              </div>
              <div className="cart-btn-label">
                <span className="cart-title">Cart</span>
                {cartTotal > 0 && <span className="cart-price">₹{cartTotal.toLocaleString("en-IN")}</span>}
              </div>
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              className="mobile-hamburger-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {mobileMenuOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </>
                ) : (
                  <>
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Category Navigation Bar */}
        <nav className={`category-nav-bar ${mobileMenuOpen ? 'mobile-visible' : ''}`}>
          <div className="category-nav-inner">
            {categories.map((cat) => (
              <button
                key={cat.name}
                className={`category-pill ${selectedCategory === cat.name ? 'category-active' : ''}`}
                onClick={() => {
                  onSelectCategory(cat.name);
                  setMobileMenuOpen(false);
                }}
              >
                <span className="cat-emoji">{cat.emoji}</span>
                <span className="cat-name">{cat.name}</span>
                <span className="cat-count">{cat.count}</span>
              </button>
            ))}
          </div>
        </nav>
      </header>
    </>
  );
}
