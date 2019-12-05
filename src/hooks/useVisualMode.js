import { useState } from "react";
export default function useVisualMode(initial) {
  const [history, setHistory] = useState([initial]);
  const [mode, setMode] = useState(initial);
  function transition(mode, replace) {
    //setMode to the current mode
    setMode(mode);
    //If there is need for replace
    if (replace) {
      //empty the history array and add the mode to it
      setHistory([...history.slice(0, history.length - 1), mode]);
    } else {
      //add the current mode to the history array
      history.push(mode)
      //set the history
      setHistory(history);
    }
  }
  function back() {
    //check if there's more that one item in history array
    if (history.length > 1) {
      history.pop();
      setMode(history[history.length - 1]);
    }
  }
  return { mode, transition, back };
}