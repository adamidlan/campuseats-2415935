import { useEffect, useState } from "react";

function MenuItemCard({ item, onAdd }) {
  const [now, setNow] = useState(Date.now());

  // Update the time every second for daily specials
  useEffect(() => {
    if (!item.isDailySpecial || !item.endTime) return;

    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, [item.isDailySpecial, item.endTime]);

  // Check whether the daily special has expired
  const isExpired =
    item.isDailySpecial &&
    item.endTime &&
    new Date(item.endTime).getTime() <= now;

  const isUnavailable = !item.available || isExpired;

  return (
    <article className="card menu-card">
      <div className="thumb" aria-hidden="true">
        {item.name.charAt(0)}
      </div>

      <div className="menu-badges">
        <span className="tag">{item.category}</span>

        {item.isDailySpecial && (
          <span className="special-tag">Daily Special</span>
        )}
      </div>

      <h3>{item.name}</h3>
      <p className="muted">{item.description}</p>
      <p className="price">RM {Number(item.price).toFixed(2)}</p>

      <button
        className="btn"
        disabled={isUnavailable}
        onClick={() => onAdd(item)}
      >
        {isExpired
          ? "Unavailable"
          : item.available
            ? "Add to cart"
            : "Sold out"}
      </button>
    </article>
  );
}

export default MenuItemCard;
