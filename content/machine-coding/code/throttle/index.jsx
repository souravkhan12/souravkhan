import { useEffect } from "react";

function throttleFn(fn, delay) {
  let flag = false;
  return function (...args) {
    if (flag) return;
    flag = true;
    setTimeout(() => {
      flag = false;
      fn(...args);
    }, delay);
  };
}

function someFn() {
  console.log("hi there");
}

const throttleCall = throttleFn(someFn, 1000);

export function Throttle() {
  function handleClick() {
    throttleCall();
  }

  useEffect(() => {
    handleClick();
  }, []);
  return <button className="rounded-4xl bg-amber-50">Throttle</button>;
}
