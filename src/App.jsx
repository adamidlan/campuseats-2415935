import { useEffect, useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import VendorCard from "./components/VendorCard";
import MenuList from "./components/MenuList";
import CartPage from "./components/CartPage";
import { Loading, ErrorMessage } from "./components/Status";

function App() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0); // bump it to fetch again
  const [selectedVendorId, setSelectedVendorId] = useState(null);
  const [cart, setCart] = useState([]); // lines of { item, qty }
  const selectedVendor = vendors.find((v) => v.id === selectedVendorId);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    fetch("/api/vendors.json", { signal: controller.signal })
      .then((res) => {
        // TODO: if res.ok is false, throw new Error(`HTTP ${res.status}`)
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setVendors(data);
        // Keep the vendor the user already picked; otherwise pick the first one.
        setSelectedVendorId((current) => current ?? data[0]?.id ?? null);
      })
      .catch((err) => {
        // TODO: call setError(err.message), but NOT when err.name is 'AbortError'
        if (err.name !== "AbortError") setError(err.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort(); // cleanup: cancel an old request
  }, [reloadKey]);

  function handleAddToCart(item) {
    setCart((prev) => {
      const existing = prev.find((line) => line.item.id === item.id);
      if (existing) {
        // Already in the cart: copy every line, and add 1 to the matching one
        return prev.map((line) =>
          line.item.id === item.id ? { ...line, qty: line.qty + 1 } : line,
        );
      }
      return [...prev, { item, qty: 1 }]; // new line
    });
  }

  function handleChangeQty(itemId, delta) {
    // delta is +1 or -1
    setCart(
      (prev) =>
        prev
          .map((line) =>
            /* TODO: same idea as above, but qty + delta */ line.item.id ===
            itemId
              ? { ...line, qty: line.qty + delta }
              : line,
          )
          .filter((line) => line.qty > 0), // qty 0 means the line disappears
    );
  }

  function handleRemove(itemId) {
    // TODO: setCart(prev => prev.filter(...)), keep lines whose item.id !== itemId
    setCart((prevCart) => prevCart.filter((line) => line.item.id !== itemId));
  }

  const [lastOrder, setLastOrder] = useState(null);
  function handlePlaceOrder(details) {
    const total = cart.reduce(
      (sum, line) => sum + line.item.price * line.qty,
      0,
    ); // TODO: same reduce as CartPage
    setLastOrder({ ...details, total });
    setCart([]);
    setView("done");
  }

  const [view, setView] = useState("menu"); // 'menu' | 'cart' | 'done'
  const cartCount = cart.reduce((sum, line) => sum + line.qty, 0); // TODO: total quantity, with cart.reduce(...)
  let content;
  if (view === "cart") {
    content = (
      <CartPage
        cart={cart}
        onChangeQty={handleChangeQty}
        onRemove={handleRemove}
        onPlaceOrder={handlePlaceOrder}
      />
    );
  } else if (view === "done") {
    content = (
      <section className="card">
        <h2>Order placed</h2>
        <p>
          Thank you, {lastOrder.name}. Pick up at {lastOrder.pickupTime}
          (Mahallah {lastOrder.mahallah}). Total RM {lastOrder.total.toFixed(2)}
          .
        </p>
        <button className="btn" onClick={() => setView("menu")}>
          Back to menus
        </button>
      </section>
    );
  } else if (loading) {
    content = <Loading />;
  } else if (error) {
    content = (
      <ErrorMessage
        message={error}
        onRetry={() => setReloadKey((k) => k + 1)}
      />
    );
  } else {
    {
      /* TODO: your Week 2 vendor cards + MenuList go here */
    }
    content = (
      <>
        {/* Week 2 vendor cards */}
        <section>
          <h2 className="section-title">Choose a vendor</h2>

          <div className="vendor-grid">
            {vendors.map((vendor) => (
              <VendorCard
                key={vendor.id}
                vendor={vendor}
                isSelected={vendor.id === selectedVendorId}
                onSelect={setSelectedVendorId}
              />
            ))}
          </div>
        </section>

        {/* Selected vendor's menu */}
        {selectedVendor && (
          <section>
            <h2 className="section-title">Menu: {selectedVendor.name}</h2>

            <MenuList items={selectedVendor.menu} onAdd={handleAddToCart} />
          </section>
        )}
      </>
    );
  }
  return (
    <>
      <Header
        cartCount={cartCount}
        onShowMenu={() => setView("menu")}
        onShowCart={() => setView("cart")}
      />
      <main className="container">{content}</main>
      <Footer />
    </>
  );
}
export default App;
