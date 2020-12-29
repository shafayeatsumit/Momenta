import { useState } from 'react';
import useInterval from "./useInterval";

export default function useTimer(finishTime: number) {
  const [time, setTime] = useState<number>(0);
  const [timerIsRunning, setTimerIsRunning] = useState<boolean>(false);
  const [timeIsUp, setTimeIsUp] = useState<boolean>(false);
  const handleTimer = () => {
    setTimerIsRunning((running) => !running);
  }
  useInterval(() => {
    const finishTimeInMinutes = finishTime * 60;
    if (time === finishTimeInMinutes) {
      setTimerIsRunning(false);
      setTimeIsUp(true);
      return
    }
    setTime(time + 1);
  }, timerIsRunning ? 1000 : null);
  return { time, timeIsUp, handleTimer }
}