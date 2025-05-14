import { useCallback, useEffect } from "react";

type KeyEvent = "keydown" | "keyup" | "keypress";

interface UseKeyOptions {
  key: string;
  event?: KeyEvent;
  target?: Window | HTMLElement | null;
  preventDefault?: boolean;
}

/**
 * A hook that handles keyboard events
 * @param callback Function to call when the key is pressed
 * @param options Configuration options
 * @param options.key The key to listen for (e.g., 'Escape', 'Enter')
 * @param options.event The keyboard event to listen for (default: 'keydown')
 * @param options.target The target element to attach the listener to (default: window)
 * @param options.preventDefault Whether to prevent the default behavior (default: false)
 */
const useKey = (
  callback: (event: KeyboardEvent) => void,
  {
    key,
    event = "keydown",
    target = typeof window !== "undefined" ? window : null,
    preventDefault = false,
  }: UseKeyOptions,
) => {
  const handleKeyEvent = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === key) {
        if (preventDefault) {
          e.preventDefault();
        }
        callback(e);
      }
    },
    [callback, key, preventDefault],
  );

  useEffect(() => {
    if (!target) return;

    target.addEventListener(event, handleKeyEvent as EventListener);

    return () => {
      target.removeEventListener(event, handleKeyEvent as EventListener);
    };
  }, [target, event, handleKeyEvent]);
};

export default useKey;
