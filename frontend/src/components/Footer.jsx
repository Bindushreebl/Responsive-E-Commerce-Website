import React, { useState } from "react";

export default function Footer({ onCategorySelect }) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email && email.includes("@")) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="footer-wrapper">
      <div className="footer-top-container">
        <div className="footer-col brand-col">
          <div className="footer-logo">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            <span>ShopEase<strong>.LUXE</strong></span>
          </div>
          <p className="footer-about">
            Discover a premier curation of precision tech, athletic footwear, and designer home essentials. Crafted with passion, backed by seamless doorstep logistics.
          </p>
          <div className="social-links-row">
            <a href="#twitter" aria-label="Twitter / X" className="social-btn">𝕏</a>
            <a href="#instagram" aria-label="Instagram" className="social-btn">IG</a>
            <a href="#github" aria-label="GitHub" className="social-btn">GH</a>
            <a href="#linkedin" aria-label="LinkedIn" className="social-btn">IN</a>
          </div>
        </div>

        <div className="footer-col">
          <h4>Explore Collections</h4>
          <ul className="footer-links">
            <li><button onClick={() => onCategorySelect("Audio & Tech")}>Audio & High-Tech</button></li>
            <li><button onClick={() => onCategorySelect("Footwear")}>Athletic Footwear</button></li>
            <li><button onClick={() => onCategorySelect("Smart Wearables")}>Smart Wearables</button></li>
            <li><button onClick={() => onCategorySelect("Home & Living")}>Home & Lifestyle</button></li>
            <li><button onClick={() => onCategorySelect("Accessories")}>Travel & Accessories</button></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Customer Care</h4>
          <ul className="footer-links">
            <li><a href="#orders">Track Order Status</a></li>
            <li><a href="#returns">Hassle-Free Returns</a></li>
            <li><a href="#shipping">Express Shipping Rates</a></li>
            <li><a href="#warranty">1-Year Warranty Claim</a></li>
            <li><a href="#help">24/7 Concierge Support</a></li>
          </ul>
        </div>

        <div className="footer-col newsletter-col">
          <h4>Stay Ahead of Drops</h4>
          <p>Get exclusive early access to limited edition product drops and special member discounts.</p>

          {subscribed ? (
            <div className="newsletter-success">
              <span>🎉 Subscribed! Use coupon code <strong>SAVE10</strong> for 10% off your next order.</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="newsletter-form">
              <input
                type="email"
                placeholder="Enter your email address..."
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button type="submit">Join</button>
            </form>
          )}

          <div className="payment-badges-row">
            <span className="pay-tag">VISA</span>
            <span className="pay-tag">Mastercard</span>
            <span className="pay-tag">RuPay</span>
            <span className="pay-tag">UPI</span>
            <span className="pay-tag">NetBanking</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom-bar">
        <p>© 2026 ShopEase Luxe Inc. All rights reserved. Built with Full Stack React, Express & MongoDB.</p>
        <div className="footer-bottom-links">
          <a href="#privacy">Privacy Policy</a>
          <span className="dot">•</span>
          <a href="#terms">Terms of Service</a>
          <span className="dot">•</span>
          <a href="#security">Security & Compliance</a>
        </div>
      </div>
    </footer>
  );
}
