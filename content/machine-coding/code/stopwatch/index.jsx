import { useEffect, useState } from "react";

export function StopWatch() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;

    const id = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);

    return () => clearInterval(id);
  }, [running]);

  const hh = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const mm = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  function handleReset() {
    setSeconds(0);
    setRunning(false);
  }

  return (
    <div className="flex flex-col items-center justify-center gap-10">
      <div className="text-2xl font-bold">
        {hh}:{mm}:{ss}
      </div>

      <div className="flex gap-6">
        <button onClick={() => setRunning(true)}>Start</button>
        <button onClick={() => setRunning(false)}>Stop</button>
        <button onClick={handleReset}>Reset</button>
      </div>
    </div>
  );
}
