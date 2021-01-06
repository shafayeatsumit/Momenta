import { useState } from 'react';
import useInterval from "./useInterval";

export default function useBreathCounter(breathCounterEnd: Function) {
  const [breathCounter, setBreathCounter] = useState<number>(0);
  const [breathCounterIsRunning, setBreathCounterIsRunning] = useState<boolean>(false);

  const startBreathCounter = (duration = breathCounter) => {
    setBreathCounter(duration);
    setBreathCounterIsRunning(true);
  }

  const stopBreathCounter = () => setBreathCounterIsRunning(false);
  console.log('breath counter', breathCounter);
  useInterval(() => {
    const updatedTime = breathCounter - 1;
    if (updatedTime === 0) {
      setBreathCounterIsRunning(false);
      breathCounterEnd();
      return;
    }
    setBreathCounter(updatedTime)
  }, breathCounterIsRunning ? 1000 : null)

  return {
    breathCounter,
    startBreathCounter,
    stopBreathCounter,
  }
}