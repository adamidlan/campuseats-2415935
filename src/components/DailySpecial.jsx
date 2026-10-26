import { useEffect, useState } from "react";

function DailySpecial({ item, onAdd, endTime }) {
  if (!item) {
    return null;
  }
  const [timeLeft, setTimeLeft] = useState(() =>
    Math.max(0, new Date(endTime).getTime() - Date.now()),
  );

  useEffect(() => {
    const updateCountdown = () => {
      setTimeLeft(Math.max(0, new Date(endTime).getTime() - Date.now()));
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  const hours = Math.floor(timeLeft / 3600000);
  const minutes = Math.floor((timeLeft % 3600000) / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);

  const isExpired = new Date(endTime).getTime() <= Date.now();
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
        {timeLeft > 0 ? (
          <>
            Ends in:{" "}
            <strong>
              {String(hours).padStart(2, "0")}:
              {String(minutes).padStart(2, "0")}:
              {String(seconds).padStart(2, "0")}
            </strong>
          </>
        ) : (
          "Today's special has ended."
        )}
      </p>
      {isExpired ? (
        <button className="btn" disabled>
          Unavailable
        </button>
      ) : (
        <button
          className="btn"
          onClick={() => onAdd(item)}
          disabled={timeLeft === 0}
        >
          Add to cart
        </button>
      )}
    </div>
  );
}

export default DailySpecial;
