import React, { useState, useEffect, useMemo } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import FeaturesBanner from "./components/FeaturesBanner";
import FilterBar from "./components/FilterBar";
import ProductCard from "./components/ProductCard";
import ProductModal from "./components/ProductModal";
import CartDrawer from "./components/CartDrawer";
import CheckoutModal from "./components/CheckoutModal";
import OrdersModal from "./components/OrdersModal";
import WishlistModal from "./components/WishlistModal";
import Toast from "./components/Toast";
import Footer from "./components/Footer";
import "./App.css";

// Initial fallback products in case database is loading
const FALLBACK_PRODUCTS = [
  {
    _id: "p1",
    name: "SonicPro ANC Wireless Headphones",
    category: "Audio & Tech",
    price: 2999,
    originalPrice: 4999,
    rating: 4.9,
    reviewsCount: 328,
    description: "Immersive active noise cancellation with 40-hour battery life, ultra-plush memory foam cushions, and studio-grade spatial audio.",
    features: ["Active Noise Cancellation (ANC)", "40-Hour Battery Life", "Bluetooth 5.3 Multipoint", "Fast USB-C Charging"],
    badge: "Best Seller",
    emoji: "🎧",
    color: "#e0f2fe",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=700&auto=format&fit=crop&q=80",
    inStock: true,
    stock: 25,
  },
  {
    _id: "p2",
    name: "AeroPulse Running Sneakers",
    category: "Footwear",
    price: 1899,
    originalPrice: 2999,
    rating: 4.8,
    reviewsCount: 214,
    description: "Ultra-lightweight responsive foam midsole engineered for high rebound energy return, breathable mesh weave, and slip-resistant rubber tread.",
    features: ["Responsive CloudFoam Sole", "Engineered Breathable Mesh", "Ortholite Antimicrobial Insole"],
    badge: "Trending",
    emoji: "👟",
    color: "#ede9fe",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700&auto=format&fit=crop&q=80",
    inStock: true,
    stock: 18,
  },
  {
    _id: "p3",
    name: "Horizon AMOLED Smartwatch",
    category: "Smart Wearables",
    price: 2499,
    originalPrice: 3999,
    rating: 4.7,
    reviewsCount: 189,
    description: "Sleek 1.43-inch Always-on AMOLED display with continuous heart rate, SpO2 monitoring, 100+ sports modes, and 12-day battery life.",
    features: ["1.43\" Ultra AMOLED Retina Display", "Continuous Heart Rate & SpO2 Tracking", "5ATM Water Resistance"],
    badge: "Hot Deal",
    emoji: "⌚",
    color: "#fce7f3",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700&auto=format&fit=crop&q=80",
    inStock: true,
    stock: 14,
  },
  {
    _id: "p4",
    name: "Vanguard Waterproof Laptop Backpack",
    category: "Accessories",
    price: 1299,
    originalPrice: 1999,
    rating: 4.9,
    reviewsCount: 95,
    description: "Weatherproof ballistic nylon shell with padded 16-inch laptop compartment, hidden anti-theft pocket, and ergonomic airflow back support.",
    features: ["Water-repellent 900D Nylon", "16\" Padded Laptop Compartment", "Luggage Strap"],
    badge: "Staff Pick",
    emoji: "🎒",
    color: "#dcfce7",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=700&auto=format&fit=crop&q=80",
    inStock: true,
    stock: 30,
  },
  {
    _id: "p5",
    name: "Lumina Minimalist Desk Lamp",
    category: "Home & Living",
    price: 899,
    originalPrice: 1499,
    rating: 4.6,
    reviewsCount: 76,
    description: "Modern architectural desk lamp with touch dimming, 3 color temperatures, and built-in wireless phone charger base.",
    features: ["Qi 15W Wireless Charging Base", "Stepless Touch Dimming", "Eye-care Flicker-Free LEDs"],
    badge: "Popular",
    emoji: "💡",
    color: "#fef3c7",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=700&auto=format&fit=crop&q=80",
    inStock: true,
    stock: 22,
  },
  {
    _id: "p6",
    name: "ThermaGuard Insulated Flask",
    category: "Home & Living",
    price: 599,
    originalPrice: 999,
    rating: 4.8,
    reviewsCount: 310,
    description: "Double-wall vacuum insulated 18/8 food-grade stainless steel keeping beverages icy cold for 24 hours or steaming hot for 12 hours.",
    features: ["Double-Wall Vacuum Insulation", "100% Leak-Proof Lock Cap", "BPA-Free 18/8 Stainless Steel"],
    badge: "Eco Choice",
    emoji: "🥤",
    color: "#ffedd5",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=700&auto=format&fit=crop&q=80",
    inStock: true,
    stock: 40,
  },
];

export default function App() {
  // Theme State
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("shopease_theme") || "light";
  });

  // Data states
  const [products, setProducts] = useState(FALLBACK_PRODUCTS);
  const [categories, setCategories] = useState([
    { name: "All", count: 12, emoji: "✨" },
    { name: "Audio & Tech", count: 3, emoji: "🎧" },
    { name: "Footwear", count: 2, emoji: "👟" },
    { name: "Smart Wearables", count: 2, emoji: "⌚" },
    { name: "Home & Living", count: 3, emoji: "💡" },
    { name: "Accessories", count: 2, emoji: "🎒" },
  ]);
  const [dbStatus, setDbStatus] = useState("connecting");
  const [loading, setLoading] = useState(true);

  // Filter & Search states
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOption, setSortOption] = useState("featured");
  const [priceRange, setPriceRange] = useState(5000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [viewMode, setViewMode] = useState("comfortable");

  // User Commerce State
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem("shopease_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem("shopease_wishlist");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedPromo, setAppliedPromo] = useState(() => {
    try {
      const saved = localStorage.getItem("shopease_promo");
      return saved ? JSON.parse(saved) : { code: "LUXE20", label: "20% Off Luxe Sale", type: "percent", value: 20 };
    } catch {
      return null;
    }
  });

  const [ordersCount, setOrdersCount] = useState(0);

  // Modals & Drawers state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [activeProductModal, setActiveProductModal] = useState(null);
  const [activeCheckout, setActiveCheckout] = useState(null);

  // Toasts
  const [toasts, setToasts] = useState([]);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("shopease_theme", theme);
  }, [theme]);

  // Persist cart
  useEffect(() => {
    localStorage.setItem("shopease_cart", JSON.stringify(cart));
  }, [cart]);

  // Persist wishlist
  useEffect(() => {
    localStorage.setItem("shopease_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  // Persist promo
  useEffect(() => {
    if (appliedPromo) {
      localStorage.setItem("shopease_promo", JSON.stringify(appliedPromo));
    } else {
      localStorage.removeItem("shopease_promo");
    }
  }, [appliedPromo]);

  // Fetch initial data & check DB status
  const loadData = async () => {
    try {
      setLoading(true);
      // Check health
      const healthRes = await fetch("/api/health").catch(() => null);
      if (healthRes && healthRes.ok) {
        const healthData = await healthRes.json();
        setDbStatus(healthData.database === "connected" ? "connected" : "offline");
        if (healthData.stats?.orders) {
          setOrdersCount(healthData.stats.orders);
        }
      }

      // Fetch products
      const prodRes = await fetch("/api/products");
      if (prodRes.ok) {
        const prodData = await prodRes.json();
        if (Array.isArray(prodData) && prodData.length > 0) {
          setProducts(prodData);
        }
      }

      // Fetch categories
      const catRes = await fetch("/api/categories");
      if (catRes.ok) {
        const catData = await catRes.json();
        if (Array.isArray(catData) && catData.length > 0) {
          setCategories(catData);
        }
      }
    } catch (err) {
      console.warn("API request fallback:", err);
      setDbStatus("offline");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Toast Notification helper
  const addToast = (title, message = "", type = "info") => {
    const id = Date.now() + Math.random().toString();
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Cart operations
  const addToCart = (product, qty = 1) => {
    const pId = product._id || product.id;
    setCart((prev) => {
      const existing = prev.find((item) => (item._id || item.id) === pId);
      if (existing) {
        return prev.map((item) =>
          (item._id || item.id) === pId
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [...prev, { ...product, quantity: qty }];
    });
    addToast(`Added to cart!`, `${qty}x ${product.name}`, "success");
  };

  const updateQuantity = (id, newQty) => {
    if (newQty <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        (item._id || item.id) === id ? { ...item, quantity: newQty } : item
      )
    );
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => (item._id || item.id) !== id));
    addToast("Item removed", "Item was removed from your cart.", "info");
  };

  const clearCart = () => {
    setCart([]);
    addToast("Cart cleared", "All items have been removed.", "info");
  };

  // Direct Buy Now flow
  const handleBuyNow = (product, qty = 1) => {
    addToCart(product, qty);
    setActiveProductModal(null);

    // Compute pricing and open checkout directly
    const itemTotal = product.price * qty;
    const discount = appliedPromo?.type === "percent" ? Math.round((itemTotal * appliedPromo.value) / 100) : 0;
    const shipping = itemTotal >= 999 ? 0 : 99;
    const tax = Math.round((itemTotal - discount) * 0.05);
    const total = Math.max(0, itemTotal - discount + shipping + tax);

    setActiveCheckout({
      subtotal: itemTotal,
      discount,
      shipping,
      tax,
      total,
      promoCode: appliedPromo?.code || "",
    });
  };

  // Wishlist operations
  const toggleWishlist = (product) => {
    const pId = product._id || product.id;
    const exists = wishlist.some((item) => (item._id || item.id) === pId);

    if (exists) {
      setWishlist((prev) => prev.filter((item) => (item._id || item.id) !== pId));
      addToast("Removed from Wishlist", product.name, "info");
    } else {
      setWishlist((prev) => [...prev, product]);
      addToast("Saved to Wishlist ♥", product.name, "wishlist");
    }
  };

  const removeFromWishlist = (product) => {
    const pId = product._id || product.id;
    setWishlist((prev) => prev.filter((item) => (item._id || item.id) !== pId));
  };

  // Toggle Theme
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // Active filters calculation
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== "All") count++;
    if (sortOption !== "featured") count++;
    if (priceRange < 5000) count++;
    if (inStockOnly) count++;
    if (search.trim()) count++;
    return count;
  }, [selectedCategory, sortOption, priceRange, inStockOnly, search]);

  const handleResetFilters = () => {
    setSelectedCategory("All");
    setSortOption("featured");
    setPriceRange(5000);
    setInStockOnly(false);
    setSearch("");
  };

  // Filter & Sort Products
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        const matchesCategory =
          selectedCategory === "All" || product.category === selectedCategory;

        const matchesSearch =
          !search.trim() ||
          product.name.toLowerCase().includes(search.toLowerCase()) ||
          product.description.toLowerCase().includes(search.toLowerCase()) ||
          product.category.toLowerCase().includes(search.toLowerCase());

        const matchesPrice = product.price <= priceRange;

        const matchesStock = !inStockOnly || product.inStock;

        return matchesCategory && matchesSearch && matchesPrice && matchesStock;
      })
      .sort((a, b) => {
        if (sortOption === "price-asc") return a.price - b.price;
        if (sortOption === "price-desc") return b.price - a.price;
        if (sortOption === "rating") return b.rating - a.rating;
        if (sortOption === "newest") return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        return 0; // featured
      });
  }, [products, selectedCategory, search, priceRange, inStockOnly, sortOption]);

  // Cart Totals for Header
  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalCartPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="app-layout">
      {/* Toast Notifications */}
      <Toast toasts={toasts} onDismiss={dismissToast} />

      {/* Navbar */}
      <Navbar
        search={search}
        setSearch={setSearch}
        cartCount={totalCartCount}
        cartTotal={totalCartPrice}
        wishlistCount={wishlist.length}
        ordersCount={ordersCount}
        theme={theme}
        toggleTheme={toggleTheme}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenOrders={() => setIsOrdersOpen(true)}
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        dbStatus={dbStatus}
      />

      <main className="main-content">
        {/* Hero Section */}
        <Hero
          featuredProduct={products[0] || FALLBACK_PRODUCTS[0]}
          onAddToCart={addToCart}
          onQuickView={(p) => setActiveProductModal(p)}
        />

        {/* Features & Guarantees Strip */}
        <FeaturesBanner />

        {/* Products Section */}
        <section className="catalog-section" id="products">
          <div className="catalog-header-wrap">
            <div className="catalog-titles">
              <div className="catalog-eyebrow">
                <span>CURATED CATALOG</span>
                <span className="live-db-pill">
                  <span className="live-dot"></span>
                  {dbStatus === "connected" ? "MongoDB Live" : "Offline Ready"}
                </span>
              </div>
              <h2 className="catalog-main-title">
                Explore Our <span className="gradient-text">Premium Collection</span>
              </h2>
              <p className="catalog-subtitle">
                Handpicked selection of high-performance gear and lifestyle essentials.
              </p>
            </div>
          </div>

          {/* Filters & Control Bar */}
          <FilterBar
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            sortOption={sortOption}
            onSortChange={setSortOption}
            priceRange={priceRange}
            onPriceChange={setPriceRange}
            inStockOnly={inStockOnly}
            onToggleInStock={setInStockOnly}
            viewMode={viewMode}
            onToggleViewMode={setViewMode}
            activeFilterCount={activeFilterCount}
            onResetFilters={handleResetFilters}
            totalResults={filteredProducts.length}
          />

          {/* Product Grid */}
          <div className={`products-grid ${viewMode === 'compact' ? 'grid-compact' : 'grid-comfortable'}`}>
            {filteredProducts.map((product) => {
              const pId = product._id || product.id;
              const isWishlisted = wishlist.some((item) => (item._id || item.id) === pId);
              return (
                <ProductCard
                  key={pId}
                  product={product}
                  isWishlisted={isWishlisted}
                  onToggleWishlist={toggleWishlist}
                  onAddToCart={addToCart}
                  onQuickView={(p) => setActiveProductModal(p)}
                />
              );
            })}
          </div>

          {/* Empty State */}
          {filteredProducts.length === 0 && (
            <div className="no-products-box">
              <span className="no-products-icon">🔍</span>
              <h3>No matching products found</h3>
              <p>We couldn't find any products matching your active filters or search keyword.</p>
              <button className="reset-cta-btn" onClick={handleResetFilters}>
                Clear All Filters
              </button>
            </div>
          )}
        </section>
      </main>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        onClearCart={clearCart}
        appliedPromo={appliedPromo}
        onApplyPromo={(promo) => {
          setAppliedPromo(promo);
          addToast("Promo Applied!", `${promo.label} active`, "success");
        }}
        onRemovePromo={() => {
          setAppliedPromo(null);
          addToast("Promo removed", "Promo code was removed.", "info");
        }}
        onProceedToCheckout={(pricing) => {
          setActiveCheckout(pricing);
        }}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={Boolean(activeCheckout)}
        onClose={() => setActiveCheckout(null)}
        cart={cart}
        pricing={activeCheckout || {}}
        onOrderSuccess={(order) => {
          setCart([]);
          setOrdersCount((c) => c + 1);
          addToast("Order Confirmed! 🎉", `Order ID: ${order.orderId}`, "success");
        }}
        onOpenOrders={() => {
          setActiveCheckout(null);
          setIsOrdersOpen(true);
        }}
      />

      {/* Orders Modal */}
      <OrdersModal
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
        onRefreshCount={(count) => setOrdersCount(count)}
      />

      {/* Wishlist Modal */}
      <WishlistModal
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlist={wishlist}
        onRemoveFromWishlist={removeFromWishlist}
        onAddToCart={addToCart}
      />

      {/* Product Detail Modal */}
      <ProductModal
        product={activeProductModal}
        onClose={() => setActiveProductModal(null)}
        onAddToCart={addToCart}
        onBuyNow={handleBuyNow}
        isWishlisted={
          activeProductModal
            ? wishlist.some((item) => (item._id || item.id) === (activeProductModal._id || activeProductModal.id))
            : false
        }
        onToggleWishlist={toggleWishlist}
      />

      {/* Footer */}
      <Footer onCategorySelect={setSelectedCategory} />
    </div>
  );
}
