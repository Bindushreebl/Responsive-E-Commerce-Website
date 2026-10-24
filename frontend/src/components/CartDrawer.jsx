import React, { useState } from "react";

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout,
  appliedPromo,
  onApplyPromo,
  onRemovePromo,
}) {
  const [promoInput, setPromoInput] = useState("");
  const [promoError, setPromoError] = useState("");

  if (!isOpen) return null;

  const FREE_SHIPPING_THRESHOLD = 999;
  const STANDARD_SHIPPING_FEE = 99;

  // Calculate pricing
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Discount calculation
  let discount = 0;
  let isFreeShippingPromo = false;

  if (appliedPromo) {
    if (appliedPromo.type === "percent") {
      discount = Math.round((subtotal * appliedPromo.value) / 100);
    } else if (appliedPromo.type === "flat") {
      discount = appliedPromo.value;
    } else if (appliedPromo.type === "shipping") {
      isFreeShippingPromo = true;
    }
  }

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || isFreeShippingPromo || subtotal === 0
    ? 0
    : STANDARD_SHIPPING_FEE;

  const tax = Math.round((subtotal - discount) * 0.05); // 5% GST
  const grandTotal = Math.max(0, subtotal - discount + shipping + tax);

  const freeShippingProgress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
  const amountNeededForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  const handleApplyPromoCode = (codeToApply) => {
    const code = (codeToApply || promoInput).trim().toUpperCase();
    setPromoError("");

    if (!code) {
      setPromoError("Please enter a code");
      return;
    }

    if (code === "LUXE20") {
      onApplyPromo({ code: "LUXE20", label: "20% Off Luxe Sale", type: "percent", value: 20 });
      setPromoInput("");
    } else if (code === "SAVE10") {
      onApplyPromo({ code: "SAVE10", label: "10% Welcome Discount", type: "percent", value: 10 });
      setPromoInput("");
    } else if (code === "FREESHIP") {
      onApplyPromo({ code: "FREESHIP", label: "Free Shipping Guaranteed", type: "shipping", value: 0 });
      setPromoInput("");
    } else {
      setPromoError("Invalid promo code. Try LUXE20 or SAVE10");
    }
  };

  return (
    <div className="drawer-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="cart-drawer-panel" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div className="drawer-header">
          <div className="drawer-title-group">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <h3>Your Shopping Cart</h3>
            <span className="drawer-item-count">({cart.reduce((sum, item) => sum + item.quantity, 0)})</span>
          </div>

          <div className="drawer-header-actions">
            {cart.length > 0 && (
              <button className="clear-cart-text-btn" onClick={onClearCart} title="Empty Cart">
                Clear all
              </button>
            )}
            <button className="drawer-close-btn" onClick={onClose} aria-label="Close cart">
              ✕
            </button>
          </div>
        </div>

        {/* Free Shipping Progress Meter */}
        {cart.length > 0 && (
          <div className="free-shipping-box">
            <div className="shipping-message">
              {amountNeededForFreeShipping > 0 ? (
                <>
                  🚚 Add <strong>₹{amountNeededForFreeShipping.toLocaleString("en-IN")}</strong> more for <strong>FREE Delivery</strong>
                </>
              ) : (
                <>🎉 Congratulations! You unlocked <strong>FREE Express Delivery</strong></>
              )}
            </div>
            <div className="shipping-progress-track">
              <div
                className="shipping-progress-bar"
                style={{ width: `${freeShippingProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Cart Items List */}
        <div className="drawer-body">
          {cart.length === 0 ? (
            <div className="cart-empty-state">
              <div className="empty-cart-orb">
                <span className="empty-icon">🛒</span>
              </div>
              <h4>Your cart is empty</h4>
              <p>Looks like you haven't added anything to your cart yet.</p>
              <button
                className="empty-cta-btn"
                onClick={onClose}
              >
                Start Shopping Now
              </button>
            </div>
          ) : (
            <div className="cart-items-list">
              {cart.map((item) => (
                <div key={item.id || item._id} className="cart-item-card">
                  <div className="cart-item-media" style={{ backgroundColor: item.color || "#f1f5f9" }}>
                    <img
                      src={item.image}
                      alt={item.name}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                    <span className="cart-item-fallback" style={{ display: 'none' }}>
                      {item.emoji || "🛍️"}
                    </span>
                  </div>

                  <div className="cart-item-content">
                    <div className="cart-item-top">
                      <span className="cart-item-category">{item.category}</span>
                      <button
                        className="item-remove-btn"
                        onClick={() => onRemoveItem(item.id || item._id)}
                        aria-label={`Remove ${item.name}`}
                        title="Remove item"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                      </button>
                    </div>

                    <h4 className="cart-item-name">{item.name}</h4>

                    <div className="cart-item-bottom">
                      <div className="cart-item-stepper">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.id || item._id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.id || item._id, item.quantity + 1)}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <div className="cart-item-price-col">
                        <span className="item-unit-price">₹{item.price.toLocaleString("en-IN")} each</span>
                        <span className="item-total-price">₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer with Promo & Totals */}
        {cart.length > 0 && (
          <div className="drawer-footer">
            {/* Promo Code Input */}
            <div className="promo-box">
              {appliedPromo ? (
                <div className="applied-promo-chip">
                  <div className="applied-promo-left">
                    <span className="promo-check">✓</span>
                    <div>
                      <strong>{appliedPromo.code}</strong> Applied
                      <small>{appliedPromo.label}</small>
                    </div>
                  </div>
                  <button className="remove-promo-btn" onClick={onRemovePromo} aria-label="Remove promo">
                    ✕
                  </button>
                </div>
              ) : (
                <>
                  <div className="promo-input-row">
                    <input
                      type="text"
                      placeholder="Enter Promo Code (e.g. LUXE20)"
                      value={promoInput}
                      onChange={(e) => {
                        setPromoInput(e.target.value);
                        setPromoError("");
                      }}
                      onKeyDown={(e) => { if (e.key === 'Enter') handleApplyPromoCode(); }}
                    />
                    <button
                      type="button"
                      className="apply-promo-btn"
                      onClick={() => handleApplyPromoCode()}
                    >
                      Apply
                    </button>
                  </div>
                  {promoError && <p className="promo-error-text">{promoError}</p>}
                  {/* Quick Suggestions */}
                  <div className="quick-coupons">
                    <span>Try:</span>
                    <button type="button" onClick={() => handleApplyPromoCode("LUXE20")}>LUXE20 (-20%)</button>
                    <button type="button" onClick={() => handleApplyPromoCode("FREESHIP")}>FREESHIP</button>
                  </div>
                </>
              )}
            </div>

            {/* Price Calculations */}
            <div className="order-summary-table">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString("en-IN")}</span>
              </div>

              {discount > 0 && (
                <div className="summary-row row-discount">
                  <span>Promo Discount ({appliedPromo?.code})</span>
                  <span>-₹{discount.toLocaleString("en-IN")}</span>
                </div>
              )}

              <div className="summary-row">
                <span>Estimated Shipping</span>
                <span>{shipping === 0 ? <strong className="free-shipping-tag">FREE</strong> : `₹${shipping}`}</span>
              </div>

              <div className="summary-row">
                <span>Taxes & GST (5%)</span>
                <span>₹{tax.toLocaleString("en-IN")}</span>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-row row-total">
                <span>Total Amount</span>
                <span className="total-figure">₹{grandTotal.toLocaleString("en-IN")}</span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              className="drawer-checkout-btn"
              onClick={() => {
                onClose();
                onProceedToCheckout({
                  subtotal,
                  discount,
                  shipping,
                  tax,
                  total: grandTotal,
                  promoCode: appliedPromo?.code || "",
                });
              }}
            >
              <span>Proceed to Checkout</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
