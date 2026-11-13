import MenuItemCard from "./MenuItemCard.jsx";
import { useCart } from "../hooks/useCart.js";
import { useAuth } from "../hooks/useAuth.js";
import { useDailySpecialSchedule } from "../hooks/useDailySpecialSchedule.js";
import DailySpecial from "./DailySpecial.jsx";

function MenuList({ items }) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { isAvailable } = useDailySpecialSchedule();
  const visibleItems = user
    ? items
    : items.filter((item) => !item.isDailySpecial);

  if (visibleItems.length === 0) {
    return <p className="muted">No items on this menu yet.</p>;
  }

  return (
    <div className="grid">
      {visibleItems.map((item) => {
        const menuItem = item.isDailySpecial
          ? {
              ...item,
              available: item.available !== false && isAvailable,
            }
          : item;

        return <MenuItemCard key={item.id} item={menuItem} onAdd={addToCart} />;
      })}
    </div>
  );
}
export default MenuList;
