import { useEffect } from "react";

interface UseOutsideClickProps<T extends HTMLElement = HTMLElement> {
  ref: React.RefObject<T | null>;
  callback: () => void;
}
export function useOutsideClick<T extends HTMLElement = HTMLElement>({
  ref,
  callback,
}: UseOutsideClickProps<T>) {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [ref, callback]);
}
