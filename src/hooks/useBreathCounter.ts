import { useState } from 'react';
import useInterval from "./useInterval";

export default function useBreathCounter(breathCounterEnd: Function) {
  const [breathCounter, setBreathCounter] = useState<number>(0);
  const [breathCounterIsRunning, setBreathCounterIsRunning] = useState<boolean>(false);

  const startBreathCounter = (duration = breathCounter) => {
    const remainder = duration % 1;
    const countDuratoin = remainder ? Math.trunc(duration) : duration - 1;
    const delay = remainder ? remainder * 1000 : 1000;


    setTimeout(() => {
      setBreathCounter(countDuratoin);
      setBreathCounterIsRunning(true);
    }, delay)

  }

  const stopBreathCounter = () => setBreathCounterIsRunning(false);

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