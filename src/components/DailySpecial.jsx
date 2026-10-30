import { useEffect, useState } from "react";
import { Link } from "react-router";

function DailySpecial({ item, onAdd, endTime, vendorId, vendorName }) {
  const [timeLeft, setTimeLeft] = useState(() =>
    Math.max(0, new Date(endTime).getTime() - Date.now()),
  );

  useEffect(() => {
    const updateCountdown = () => {
      const remaining = new Date(endTime).getTime() - Date.now();
      setTimeLeft(Number.isFinite(remaining) ? Math.max(0, remaining) : 0);
    };

    updateCountdown();

    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  if (!item) return null;

  const isExpired = timeLeft <= 0;
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
        {isExpired ? (
          <strong>Today's special has ended.</strong>
        ) : (
          <>
            Ends in:{" "}
            <strong>
              {String(hours).padStart(2, "0")}:
              {String(minutes).padStart(2, "0")}:
              {String(seconds).padStart(2, "0")}
            </strong>
          </>
        )}
      </p>

      {vendorId && (
        <p>
          <Link to={`/vendor/${vendorId}`}>
            View {vendorName || "vendor"}'s menu
          </Link>
        </p>
      )}

      {isExpired || item.available === false ? (
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
