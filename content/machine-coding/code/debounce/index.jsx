import { useState } from "react";

function debounceFn(fn, delay) {
  let tid;
  const self = this;
  return function (...args) {
    clearTimeout(tid);
    tid = setTimeout(() => fn.apply(self, args), delay);
  };
}

function Apicall() {
  console.log("hi there from api");
}

const debounceSearch = debounceFn(Apicall, 1000);

export default function Debounce() {
  const [st, setSt] = useState();

  function handleChange(e) {
    setSt(e.target.value);
    debounceSearch(e.target.value);
  }

  return (
    <label>
      <input
        type="text"
        placeholder="Search using debounce"
        onChange={handleChange}
      />
      {st ?? st};
    </label>
  );
}
