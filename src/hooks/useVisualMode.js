import React, { useState } from 'react';
export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);
  function transition(mode) {
    setMode(mode);
    history.push(mode);
    setHistory(history);
  }
  function back() {
    history.pop();
    setMode(history[history.length - 1]);
  }
  return { history, mode, transition, back };
}
