import { useEffect, useState } from "react";

export function useDailySpecialSchedule() {
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const now = new Date(currentTime);
  const day = now.getDay();

  // Tuesday = 2, Thursday = 4
  const isSpecialDay = day === 2 || day === 4;

  // Special is available from midnight until 10 PM
  const endToday = new Date(now);
  endToday.setHours(22, 0, 0, 0);

  const isAvailable = isSpecialDay && now < endToday;

  return {
    isAvailable,
  };
}
