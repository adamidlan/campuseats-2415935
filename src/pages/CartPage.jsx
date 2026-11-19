import CartItem from "../components/CartItem.jsx";
import CheckoutForm from "../components/CheckoutForm.jsx";
import { useNavigate } from "react-router";
import { useCart } from "../hooks/useCart.js";
import { useAuth } from "../hooks/useAuth.js";
import { placeOrders } from "../services/orders.js";
import { useState } from "react";
function CartPage() {
  const { cart, total, changeQty, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  async function handlePlaceOrder(details) {
    setError("");

    try {
      await placeOrders(user, cart, details);
      clearCart();
      navigate("/orders");
    } catch (err) {
      setError(`Could not place the order: ${err.message}`);
    }
  }
  return (
    <section>
      <h2 className="section-title">Your cart</h2>
      <div className="cart-layout">
        <div className="card">
          <ul className="cart-list">
            {error && (
              <p className="field-error" role="alert">
                {error}
              </p>
            )}
            {cart.map((line) => (
              <CartItem
                key={line.item.id}
                line={line}
                onChangeQty={changeQty}
                onRemove={removeFromCart}
              />
            ))}
          </ul>
          <p className="cart-total">Total: RM {total.toFixed(2)}</p>
        </div>
        <CheckoutForm
          defaultName={user?.displayName ?? ""}
          onPlaceOrder={handlePlaceOrder}
        />
      </div>
    </section>
  );
}
export default CartPage;
