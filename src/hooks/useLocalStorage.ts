import { useEffect, useState } from "react";
import { safeJsonParse } from "../engine/safety";

export const useLocalStorage = <T,>(key: string, initialValue: T) => {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;
    return safeJsonParse<T>(window.localStorage.getItem(key), initialValue);
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
};
