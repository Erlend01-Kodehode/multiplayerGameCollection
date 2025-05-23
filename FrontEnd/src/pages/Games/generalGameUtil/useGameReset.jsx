import { useCallback } from "react";

const useGameReset = (resetFn) => {
  return useCallback(() => {
    if (typeof resetFn === "function") {
      resetFn();
    } else if (Array.isArray(resetFn)) {
      resetFn.forEach(fn => typeof fn === "function" && fn());
    }
  }, [resetFn]);
};

export default useGameReset;