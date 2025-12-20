import { useState, useEffect } from "react";

const useSessionTimer = (initialSeconds, onExpire) => {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

  useEffect(() => {
    if (secondsLeft <= 0) {
      onExpire();
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft, onExpire]);

  const resetTimer = () => setSecondsLeft(initialSeconds);
  return { secondsLeft, resetTimer };
};

export default useSessionTimer;
