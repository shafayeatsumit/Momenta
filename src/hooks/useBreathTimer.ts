import { useState } from 'react';
import useInterval from "./useInterval";

export default function useBreathTimer(breathTimeEnd: Function) {
  const [breathTimer, setBreathTimer] = useState<number>(0);
  const [breathTimerIsRunning, setBreathTimerIsRunning] = useState<boolean>(false);

  const startBreathTimer = (duration = breathTimer) => {
    setBreathTimer(duration);
    setBreathTimerIsRunning(true);
  }

  const stopBreathTimer = () => setBreathTimerIsRunning(false);

  useInterval(() => {
    const updatedTime = breathTimer - 1;
    if (updatedTime === 0) {
      setBreathTimerIsRunning(false);
      breathTimeEnd();
      return;
    }
    setBreathTimer(updatedTime)
  }, breathTimerIsRunning ? 1000 : null)

  return {
    breathTimer,
    startBreathTimer,
    stopBreathTimer,
  }
}