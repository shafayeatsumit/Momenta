import { useState } from 'react';
import useInterval from "./useInterval";

export default function useHoldTimer(holdTimeEnd: Function) {
  const [holdTimer, setHoldTimer] = useState<number>(0);
  const [holdTimerIsRunning, setHoldTimerIsRunning] = useState<boolean>(false);

  useInterval(() => {
    const updatedTime = holdTimer - 1;
    if (updatedTime === 0) {
      setHoldTimerIsRunning(false);
      holdTimeEnd();
      return
    }
    setHoldTimer(updatedTime)
  }, holdTimerIsRunning ? 1000 : null)

  const startHoldTimer = (duration = holdTimer) => {
    setHoldTimer(duration);
    setHoldTimerIsRunning(true);
  }

  const stopHoldTimer = () => setHoldTimerIsRunning(false);


  return {
    holdTimer,
    startHoldTimer,
    stopHoldTimer,
  }
}