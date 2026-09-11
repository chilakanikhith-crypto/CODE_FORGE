import { useEffect, useState } from "react";

export default function AnimatedCounter({
  value,
  duration = 1200,
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const end = Number(String(value).replace(/,/g, ""));

    if (isNaN(end)) {
      setCount(value);
      return;
    }

    let start = 0;

    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;

      if (start >= end) {
        clearInterval(timer);
        setCount(end);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);

  }, [value, duration]);

  return (
    <>
      {typeof count === "number"
        ? count.toLocaleString()
        : count}
    </>
  );
}