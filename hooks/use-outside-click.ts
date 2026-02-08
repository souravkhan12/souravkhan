import { useEffect } from "react";
import { useMounted } from "./use-mounted";

interface UseOutsideClickProps {
  ref: React.RefObject<HTMLElement | null>;
  callback: () => void;
}
export function useOutsideClick({ ref, callback }: UseOutsideClickProps) {
  const mounted = useMounted();

  useEffect(() => {
    if (!mounted) return;
    const handleClick = (event: MouseEvent) => {
      if (ref?.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [ref, callback, mounted]);
}
