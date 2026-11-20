import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useDailySpecialSchedule } from "../hooks/useDailySpecialSchedule.js";

function DailySpecial({ item, onAdd, vendorId, vendorName }) {
  const { isAvailable, countdownLabel } = useDailySpecialSchedule();
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!item) return null;

  // Firestore Timestamp -> JavaScript milliseconds
  const expiryTime = item.specialEndsAt?.toMillis?.() ?? 0;
  const timeLeft = Math.max(0, expiryTime - now);

  const isExpired =
    !isAvailable || item.available === false || !item.special || timeLeft <= 0;

  const hours = Math.floor(timeLeft / 3600000);
  const minutes = Math.floor((timeLeft % 3600000) / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);

  return (
    <div className="card menu-item">
      <div className="thumb" aria-hidden="true">
        {item.name.charAt(0)}
      </div>

      <div className="menu-badges">
        <span className="tag">{item.category}</span>
        <span className="special-tag">Daily Special</span>
      </div>

      <h3>{item.name}</h3>
      <p className="muted">{item.description}</p>
      <p className="price">RM {Number(item.price).toFixed(2)}</p>

      <p className="countdown">
        {countdownLabel}:{" "}
        <strong>
          {String(hours).padStart(2, "0")}:{String(minutes).padStart(2, "0")}:
          {String(seconds).padStart(2, "0")}
        </strong>
      </p>

      {vendorId && (
        <p>
          <Link to={`/vendor/${vendorId}`}>
            View {vendorName || "vendor"}'s menu
          </Link>
        </p>
      )}

      {isExpired ? (
        <button className="btn" disabled>
          Unavailable
        </button>
      ) : (
        <button className="btn" onClick={() => onAdd?.(item)} disabled={!onAdd}>
          Add to cart
        </button>
      )}
    </div>
  );
}

export default DailySpecial;
