import { useEffect } from "react";

interface UseOutsideClickProps {
  ref: React.RefObject<HTMLElement>;
  callback: () => void;
}
export function useOutsideClick({ ref, callback }: UseOutsideClickProps) {
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
