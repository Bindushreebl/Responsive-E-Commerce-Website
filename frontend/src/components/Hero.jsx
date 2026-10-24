import React from "react";

export default function Hero({ onAddToCart, onQuickView, featuredProduct }) {
  return (
    <section className="hero-section">
      <div className="hero-glow-orb hero-orb-1"></div>
      <div className="hero-glow-orb hero-orb-2"></div>

      <div className="hero-container">
        {/* Left Column: Copy & Actions */}
        <div className="hero-copy">
          <div className="hero-pill-badge">
            <span className="sparkle-icon">✨</span>
            <span>SUMMER 2026 LUXE COLLECTION</span>
            <span className="pill-discount">SAVE 20%</span>
          </div>

          <h1 className="hero-title">
            Shopping crafted for <br />
            <span className="gradient-text">effortless living.</span>
          </h1>

          <p className="hero-subtitle">
            Immerse yourself in precision audio, athletic footwear, and designer home essentials.
            Every item backed by guaranteed authenticity and express doorstep delivery.
          </p>

          <div className="hero-cta-group">
            <a href="#products" className="hero-primary-btn">
              <span>Explore Collection</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <polyline points="19 12 12 19 5 12"></polyline>
              </svg>
            </a>
            <div className="hero-coupon-chip">
              <span className="coupon-prefix">Use Promo</span>
              <strong className="coupon-code">LUXE20</strong>
              <span className="coupon-hint">for 20% off</span>
            </div>
          </div>

          {/* Social Proof & Metrics */}
          <div className="hero-metrics">
            <div className="metric-item">
              <span className="metric-number">4.9★</span>
              <span className="metric-label">12,000+ Reviews</span>
            </div>
            <div className="metric-divider"></div>
            <div className="metric-item">
              <span className="metric-number">24h</span>
              <span className="metric-label">Express Dispatch</span>
            </div>
            <div className="metric-divider"></div>
            <div className="metric-item">
              <span className="metric-number">100%</span>
              <span className="metric-label">Authentic Gear</span>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Featured Product Card */}
        <div className="hero-showcase">
          {featuredProduct && (
            <div className="showcase-card">
              <div className="showcase-badge">
                <span className="pulse-dot"></span>
                <span>Featured Spotlight</span>
              </div>

              <div className="showcase-image-wrap">
                <img
                  src={featuredProduct.image}
                  alt={featuredProduct.name}
                  className="showcase-img"
                  loading="eager"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="showcase-emoji-fallback" style={{ display: 'none' }}>
                  <span>{featuredProduct.emoji}</span>
                </div>
              </div>

              <div className="showcase-info">
                <div className="showcase-header">
                  <span className="showcase-cat">{featuredProduct.category}</span>
                  <div className="showcase-rating">
                    <span>★ {featuredProduct.rating}</span>
                    <span className="showcase-reviews">({featuredProduct.reviewsCount})</span>
                  </div>
                </div>

                <h3 className="showcase-name">{featuredProduct.name}</h3>

                <div className="showcase-pricing">
                  <div>
                    <span className="showcase-price">₹{featuredProduct.price.toLocaleString("en-IN")}</span>
                    {featuredProduct.originalPrice && (
                      <span className="showcase-orig-price">₹{featuredProduct.originalPrice.toLocaleString("en-IN")}</span>
                    )}
                  </div>
                  <span className="showcase-savings">Save {Math.round((1 - featuredProduct.price / featuredProduct.originalPrice) * 100)}%</span>
                </div>

                <div className="showcase-actions">
                  <button
                    className="showcase-quick-btn"
                    onClick={() => onQuickView(featuredProduct)}
                  >
                    Quick View
                  </button>
                  <button
                    className="showcase-add-btn"
                    onClick={() => onAddToCart(featuredProduct)}
                  >
                    + Add to Cart
                  </button>
                </div>
              </div>

              {/* Floating Decorative Glass Badges */}
              <div className="float-badge float-badge-1">
                <span>🔥</span>
                <div>
                  <strong>Trending Drop</strong>
                  <small>Over 300+ sold today</small>
                </div>
              </div>

              <div className="float-badge float-badge-2">
                <span>🎧</span>
                <div>
                  <strong>Active Noise Cancelling</strong>
                  <small>40h Battery Reserve</small>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
