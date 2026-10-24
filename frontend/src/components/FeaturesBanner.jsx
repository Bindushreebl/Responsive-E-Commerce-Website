import React from "react";

export default function FeaturesBanner() {
  const features = [
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="3" width="15" height="13"></rect>
          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
          <circle cx="5.5" cy="18.5" r="2.5"></circle>
          <circle cx="18.5" cy="18.5" r="2.5"></circle>
        </svg>
      ),
      title: "Express Delivery",
      description: "Free express shipping on all orders over ₹999.",
      color: "var(--primary-500)",
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        </svg>
      ),
      title: "100% Authentic",
      description: "Direct manufacturer guarantee & verified inspection.",
      color: "var(--accent-emerald)",
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="23 4 23 10 17 10"></polyline>
          <polyline points="1 20 1 14 7 14"></polyline>
          <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
        </svg>
      ),
      title: "30-Day Returns",
      description: "Hassle-free instantaneous exchange and returns.",
      color: "var(--accent-cyan)",
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="4" width="20" height="16" rx="2"></rect>
          <line x1="2" y1="10" x2="22" y2="10"></line>
        </svg>
      ),
      title: "Safe & Encrypted",
      description: "Bank-grade 256-bit encryption for all payments.",
      color: "var(--accent-rose)",
    },
  ];

  return (
    <section className="features-ribbon">
      <div className="features-grid">
        {features.map((feat, index) => (
          <div key={index} className="feature-card">
            <div className="feature-icon" style={{ color: feat.color, backgroundColor: `${feat.color}15` }}>
              {feat.icon}
            </div>
            <div className="feature-text">
              <h4 className="feature-title">{feat.title}</h4>
              <p className="feature-desc">{feat.desc || feat.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
