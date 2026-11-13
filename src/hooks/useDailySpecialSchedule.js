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

  const endToday = new Date(now);
  endToday.setHours(22, 0, 0, 0);

  if (isSpecialDay && now < endToday) {
    return {
      isAvailable: true,
      timeLeft: endToday.getTime() - currentTime,
      countdownLabel: "Ends in",
    };
  }

  // Find the next Tuesday or Thursday
  const nextStart = new Date(now);
  nextStart.setDate(nextStart.getDate() + 1);
  nextStart.setHours(0, 0, 0, 0);

  while (nextStart.getDay() !== 2 && nextStart.getDay() !== 4) {
    nextStart.setDate(nextStart.getDate() + 1);
  }

  return {
    isAvailable: false,
    timeLeft: nextStart.getTime() - currentTime,
    countdownLabel: "Available in",
  };
}
