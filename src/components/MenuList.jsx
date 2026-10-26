import MenuItemCard from "./MenuItemCard.jsx";
import DailySpecial from "./DailySpecial.jsx";

function MenuList({ items, onAdd }) {
  if (items.length === 0) {
    return <p className="muted">No items on this menu yet.</p>;
  }

  return (
    <div className="grid">
      {items.map((item) =>
        item.isDailySpecial ? (
          <DailySpecial
            key={item.id}
            item={item}
            onAdd={onAdd}
            endTime={item.endTime}
          />
        ) : (
          <MenuItemCard key={item.id} item={item} onAdd={onAdd} />
        ),
      )}
    </div>
  );
}

export default MenuList;
