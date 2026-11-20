import MenuItemCard from "./MenuItemCard.jsx";
import DailySpecial from "./DailySpecial.jsx";
import { useCart } from "../hooks/useCart.js";
import { useAuth } from "../hooks/useAuth.js";

function MenuList({ items }) {
  const { addToCart } = useCart();
  const { user } = useAuth();

  // Hide Daily Specials from guests
  const visibleItems = user ? items : items.filter((item) => !item.special);

  if (visibleItems.length === 0) {
    return <p className="muted">No items on this menu yet.</p>;
  }

  return (
    <div className="grid">
      {visibleItems.map((item) =>
        item.special ? (
          <DailySpecial
            key={item.id}
            item={item}
            onAdd={addToCart}
            vendorId={item.vendorId}
            vendorName={item.vendorName}
          />
        ) : (
          <MenuItemCard key={item.id} item={item} onAdd={addToCart} />
        ),
      )}
    </div>
  );
}

export default MenuList;
