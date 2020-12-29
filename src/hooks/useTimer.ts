import { useState } from 'react';
import useInterval from "./useInterval";

export default function useTimer(timeEnd: Function, finishTime: number) {
  const [time, setTime] = useState<number>(0);
  const [timerIsRunning, setTimerIsRunning] = useState<boolean>(false);

  const finishTimeInMinutes = finishTime * 60;

  const startTimer = () => setTimerIsRunning(true);
  const stopTimer = () => setTimerIsRunning(false);

  useInterval(() => {
    if (time === finishTimeInMinutes) {
      timeEnd();
      return
    }
    setTime(time + 1);
  }, timerIsRunning ? 1000 : null);
  return { time, startTimer, stopTimer }
}