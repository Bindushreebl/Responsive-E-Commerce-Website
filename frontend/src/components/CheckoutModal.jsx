import React, { useState } from "react";

export default function CheckoutModal({
  isOpen,
  onClose,
  cart,
  pricing,
  onOrderSuccess,
  onOpenOrders,
}) {
  const [formData, setFormData] = useState({
    fullName: "Alex Rivera",
    email: "alex.rivera@example.com",
    phone: "+91 98765 43210",
    address: "742 Evergreen Terrace, Suite 4B",
    city: "Mumbai",
    postalCode: "400001",
  });

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardData, setCardData] = useState({
    cardNumber: "4532 •••• •••• 8892",
    cardHolder: "Alex Rivera",
    expiry: "08/29",
    cvv: "342",
  });
  const [upiId, setUpiId] = useState("alex@okaxis");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!formData.fullName || !formData.email || !formData.address || !formData.city || !formData.postalCode) {
      setErrorMessage("Please complete all shipping address fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        customer: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
        },
        items: cart.map((item) => ({
          productId: item._id || item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          emoji: item.emoji,
        })),
        pricing: {
          subtotal: pricing.subtotal,
          discount: pricing.discount,
          shipping: pricing.shipping,
          tax: pricing.tax,
          total: pricing.total,
          promoCode: pricing.promoCode || "",
        },
        payment: {
          method: paymentMethod,
        },
      };

      // Call backend API
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderPayload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed with status ${response.status}`);
      }

      const result = await response.json();
      setConfirmedOrder(result.order);
      onOrderSuccess(result.order);
    } catch (err) {
      console.error("Order error:", err);
      setErrorMessage(err.message || "Failed to process order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content checkout-modal-panel" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close checkout">
          ✕
        </button>

        {!confirmedOrder ? (
          <div className="checkout-container">
            <div className="checkout-header">
              <h2>Express Checkout</h2>
              <p>Complete your shipping information and payment details below</p>
            </div>

            {errorMessage && (
              <div className="checkout-alert-error">
                <span>⚠️ {errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmitOrder} className="checkout-grid-layout">
              {/* Left Column: Delivery & Payment Details */}
              <div className="checkout-form-col">
                {/* Step 1: Shipping Details */}
                <div className="checkout-section">
                  <div className="section-title-wrap">
                    <span className="step-num">1</span>
                    <h3>Shipping Address</h3>
                  </div>

                  <div className="form-fields-grid">
                    <div className="form-group span-2">
                      <label htmlFor="fullName">Full Name</label>
                      <input
                        id="fullName"
                        type="text"
                        name="fullName"
                        required
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="email">Email Address</label>
                      <input
                        id="email"
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="john@example.com"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="phone">Phone Number</label>
                      <input
                        id="phone"
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+91 98765 43210"
                      />
                    </div>

                    <div className="form-group span-2">
                      <label htmlFor="address">Street Address</label>
                      <input
                        id="address"
                        type="text"
                        name="address"
                        required
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Flat / House no, Landmark, Area"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="city">City</label>
                      <input
                        id="city"
                        type="text"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="Mumbai"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="postalCode">Postal Code / PIN</label>
                      <input
                        id="postalCode"
                        type="text"
                        name="postalCode"
                        required
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        placeholder="400001"
                      />
                    </div>
                  </div>
                </div>

                {/* Step 2: Payment Method */}
                <div className="checkout-section">
                  <div className="section-title-wrap">
                    <span className="step-num">2</span>
                    <h3>Payment Method</h3>
                  </div>

                  <div className="payment-method-selector">
                    <label className={`payment-pill ${paymentMethod === 'card' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={paymentMethod === 'card'}
                        onChange={() => setPaymentMethod('card')}
                      />
                      <div className="pill-content">
                        <span className="pill-icon">💳</span>
                        <div className="pill-text">
                          <strong>Credit / Debit Card</strong>
                          <small>Visa, Mastercard, RuPay</small>
                        </div>
                      </div>
                    </label>

                    <label className={`payment-pill ${paymentMethod === 'upi' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="upi"
                        checked={paymentMethod === 'upi'}
                        onChange={() => setPaymentMethod('upi')}
                      />
                      <div className="pill-content">
                        <span className="pill-icon">⚡</span>
                        <div className="pill-text">
                          <strong>UPI / Instant Pay</strong>
                          <small>GPay, PhonePe, Paytm</small>
                        </div>
                      </div>
                    </label>

                    <label className={`payment-pill ${paymentMethod === 'cod' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                      />
                      <div className="pill-content">
                        <span className="pill-icon">💵</span>
                        <div className="pill-text">
                          <strong>Cash on Delivery</strong>
                          <small>Pay upon package arrival</small>
                        </div>
                      </div>
                    </label>
                  </div>

                  {paymentMethod === 'card' && (
                    <div className="card-input-details">
                      <div className="form-group">
                        <label>Card Number</label>
                        <input
                          type="text"
                          value={cardData.cardNumber}
                          onChange={(e) => setCardData({ ...cardData, cardNumber: e.target.value })}
                        />
                      </div>
                      <div className="form-row-2">
                        <div className="form-group">
                          <label>Expiry Date</label>
                          <input
                            type="text"
                            value={cardData.expiry}
                            onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                          />
                        </div>
                        <div className="form-group">
                          <label>Security CVV</label>
                          <input
                            type="password"
                            value={cardData.cvv}
                            onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'upi' && (
                    <div className="upi-input-details">
                      <div className="form-group">
                        <label>Virtual Payment Address (VPA / UPI ID)</label>
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="yourname@upi"
                        />
                      </div>
                      <p className="upi-hint">A payment request will be sent to your UPI application upon placing order.</p>
                    </div>
                  )}

                  {paymentMethod === 'cod' && (
                    <div className="cod-info-box">
                      <p>📦 You can pay using cash or UPI directly to the courier executive upon doorstep delivery.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Order Summary Preview & Submit */}
              <div className="checkout-summary-col">
                <div className="summary-sticky-card">
                  <h3>Order Review</h3>

                  <div className="checkout-items-preview">
                    {cart.map((item) => (
                      <div key={item.id || item._id} className="preview-item-row">
                        <div className="preview-item-thumb" style={{ backgroundColor: item.color || "#f1f5f9" }}>
                          <img src={item.image} alt={item.name} onError={(e) => { e.target.style.display = 'none'; }} />
                          <span>{item.emoji || "🛍️"}</span>
                          <span className="preview-badge">{item.quantity}</span>
                        </div>
                        <div className="preview-item-info">
                          <p className="preview-item-title">{item.name}</p>
                          <small>₹{item.price.toLocaleString("en-IN")} × {item.quantity}</small>
                        </div>
                        <strong className="preview-item-total">
                          ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                        </strong>
                      </div>
                    ))}
                  </div>

                  <div className="summary-totals">
                    <div className="s-row">
                      <span>Subtotal</span>
                      <span>₹{pricing.subtotal.toLocaleString("en-IN")}</span>
                    </div>

                    {pricing.discount > 0 && (
                      <div className="s-row discount-row">
                        <span>Discount ({pricing.promoCode})</span>
                        <span>-₹{pricing.discount.toLocaleString("en-IN")}</span>
                      </div>
                    )}

                    <div className="s-row">
                      <span>Express Shipping</span>
                      <span>{pricing.shipping === 0 ? <strong className="green-text">FREE</strong> : `₹${pricing.shipping}`}</span>
                    </div>

                    <div className="s-row">
                      <span>Estimated GST (5%)</span>
                      <span>₹{pricing.tax.toLocaleString("en-IN")}</span>
                    </div>

                    <div className="s-divider"></div>

                    <div className="s-row grand-total-row">
                      <span>Total to Pay</span>
                      <strong className="grand-price">₹{pricing.total.toLocaleString("en-IN")}</strong>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="place-order-submit-btn"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="spinner-wrapper">
                        <span className="btn-spinner"></span>
                        <span>Securing & Storing Order...</span>
                      </span>
                    ) : (
                      <>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                        <span>Place Order • ₹{pricing.total.toLocaleString("en-IN")}</span>
                      </>
                    )}
                  </button>

                  <div className="security-badges-footer">
                    <span>🔒 256-Bit SSL Encrypted</span>
                    <span>🛡️ Money-back Guarantee</span>
                  </div>
                </div>
              </div>
            </form>
          </div>
        ) : (
          /* Order Confirmation View */
          <div className="order-confirmed-screen">
            <div className="success-icon-wrapper">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>

            <h2>Order Placed Successfully!</h2>
            <p className="order-success-subtitle">
              Thank you for shopping with ShopEase Luxe. Your order has been registered in the database.
            </p>

            <div className="order-details-card">
              <div className="detail-row">
                <span className="detail-label">Order Number:</span>
                <strong className="detail-value highlight-order-id">{confirmedOrder.orderId}</strong>
              </div>
              <div className="detail-row">
                <span className="detail-label">Estimated Delivery:</span>
                <strong className="detail-value">2 - 3 Business Days (Express)</strong>
              </div>
              <div className="detail-row">
                <span className="detail-label">Deliver To:</span>
                <span className="detail-value">{confirmedOrder.customer.fullName}, {confirmedOrder.customer.city}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Payment Method:</span>
                <span className="detail-value text-capitalize">{confirmedOrder.payment.method.toUpperCase()} ({confirmedOrder.payment.status})</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Amount Paid:</span>
                <strong className="detail-value text-accent">₹{confirmedOrder.pricing.total.toLocaleString("en-IN")}</strong>
              </div>
            </div>

            <div className="confirmed-actions">
              <button
                className="view-orders-btn"
                onClick={() => {
                  onClose();
                  onOpenOrders();
                }}
              >
                Track in Order History
              </button>
              <button
                className="continue-shopping-btn"
                onClick={onClose}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
