import React, { useState, useEffect } from "react";

export default function OrdersModal({ isOpen, onClose, onRefreshCount }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/orders");
      if (!res.ok) throw new Error("Failed to load orders");
      const data = await res.json();
      setOrders(data);
      if (onRefreshCount) onRefreshCount(data.length);
    } catch (err) {
      console.error(err);
      setError("Unable to retrieve order history from database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchOrders();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content orders-modal-panel" onClick={(e) => e.stopPropagation()}>
        <div className="orders-modal-header">
          <div className="header-text-group">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
              <line x1="8" y1="21" x2="16" y2="21"></line>
              <line x1="12" y1="17" x2="12" y2="21"></line>
            </svg>
            <h2>Your Order History</h2>
            <span className="order-count-pill">{orders.length} Placed</span>
          </div>

          <div className="header-actions-group">
            <button className="sync-orders-btn" onClick={fetchOrders} title="Refresh orders">
              ↻ Refresh
            </button>
            <button className="modal-close-btn" onClick={onClose} aria-label="Close orders">
              ✕
            </button>
          </div>
        </div>

        <div className="orders-modal-body">
          {loading ? (
            <div className="orders-loading-state">
              <span className="btn-spinner large-spinner"></span>
              <p>Fetching records from MongoDB...</p>
            </div>
          ) : error ? (
            <div className="orders-error-state">
              <p>⚠️ {error}</p>
              <button onClick={fetchOrders}>Try Again</button>
            </div>
          ) : orders.length === 0 ? (
            <div className="orders-empty-state">
              <span className="empty-box-icon">📦</span>
              <h3>No Orders Found</h3>
              <p>When you complete a checkout, your confirmed orders will appear here automatically.</p>
              <button className="start-shopping-action-btn" onClick={onClose}>
                Explore Catalog
              </button>
            </div>
          ) : (
            <div className="orders-list-cards">
              {orders.map((ord) => (
                <div key={ord._id || ord.orderId} className="order-record-card">
                  <div className="order-card-header">
                    <div className="order-id-group">
                      <span className="order-prefix">ORDER</span>
                      <strong className="order-code">{ord.orderId}</strong>
                    </div>

                    <div className="order-badge-group">
                      <span className="order-status-pill status-confirmed">
                        {ord.status || "Confirmed"}
                      </span>
                      <span className="order-date-text">
                        {new Date(ord.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="order-items-grid">
                    {ord.items && ord.items.map((item, idx) => (
                      <div key={idx} className="order-item-chip">
                        <div className="order-thumb-wrap">
                          <img src={item.image} alt={item.name} onError={(e) => { e.target.style.display = 'none'; }} />
                          <span>{item.emoji || "🛍️"}</span>
                        </div>
                        <div className="order-item-desc">
                          <p className="item-name">{item.name}</p>
                          <small>Qty: {item.quantity} × ₹{item.price.toLocaleString("en-IN")}</small>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="order-card-footer">
                    <div className="order-shipping-summary">
                      <span className="dest-icon">📍</span>
                      <span>
                        Delivering to <strong>{ord.customer?.fullName}</strong> ({ord.customer?.city})
                      </span>
                    </div>

                    <div className="order-payment-summary">
                      <span className="payment-label">
                        Payment: <strong>{ord.payment?.method?.toUpperCase()}</strong>
                      </span>
                      <span className="order-total-figure">
                        ₹{ord.pricing?.total ? ord.pricing.total.toLocaleString("en-IN") : "N/A"}
                      </span>
                    </div>
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
