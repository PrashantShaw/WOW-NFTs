import { useCallback } from "react";

const useLocalStorage = () => {
  const getItem = useCallback((key: string) => {
    if (typeof window === "undefined" || !window.localStorage) return null;

    try {
      const storedValue = localStorage.getItem(key);
      return storedValue ? JSON.parse(storedValue) : null;
    } catch (error) {
      console.warn(`Error reading localStorage key “${key}”:`, error);
      return null;
    }
  }, []);

  const setItem = useCallback((key: string, value: unknown) => {
    if (typeof window === "undefined" || !window.localStorage) return null;

    try {
      const valueToStore = JSON.stringify(value);
      localStorage.setItem(key, valueToStore);
    } catch (error) {
      console.warn(`Error setting localStorage key “${key}”:`, error);
    }
  }, []);

  const removeItem = useCallback((key: string) => {
    if (typeof window === "undefined" || !window.localStorage) return null;

    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn(`Error removing localStorage key “${key}”:`, error);
    }
  }, []);
  return { getItem, setItem, removeItem };
};

export default useLocalStorage;
