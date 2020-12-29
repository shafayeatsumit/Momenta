import { useState } from 'react';
import useInterval from "./useInterval";

export default function useBreathTimer(breathTimeEnd: Function) {
  const [breathTimer, setBreathTimer] = useState<number>(0);
  const [breathTimerIsRunning, setBreathTimerIsRunning] = useState<boolean>(0);

  const startBreathTimer = (duration = breathTimer) => {
    setBreathTimer(duration);
    setBreathTimerIsRunning(true);
  }

  const stopBreathTimer = () => setBreathTimerIsRunning(false);

  useInterval(() => {
    if (breathTimer === 0) {
      setBreathTimerIsRunning(false);
      breathTimeEnd();
      return;
    }
    setBreathTimer(breathTimer - 1)
  }, breathTimerIsRunning ? 1000 : null)

  return {
    breathTimer,
    startBreathTimer,
    stopBreathTimer,
  }
}