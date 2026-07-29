/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useRef, useState } from "react";
import { createPortal } from "react-dom";

const PopOverContext = createContext(null);

function PopOverProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef(null);

  function handlePopOver() {
    setIsOpen((prev) => !prev);
    const { left, right } = contentRef.current?.getBoundingClientRect() ?? {};
    console.log(left, right);
  }

  return (
    <PopOverContext.Provider
      value={{ isOpen, contentRef, handlePopOver, setIsOpen }}
    >
      {children}
    </PopOverContext.Provider>
  );
}

function usePopOverContext() {
  const ctxt = useContext(PopOverContext);
  if (!ctxt) throw new Error("usePopOverContext used outside PopOverProvider");
  return ctxt;
}

function PopOver({ children }) {
  return <>{children}</>;
}

function Action({ children }) {
  const { handlePopOver } = usePopOverContext();
  return <button onClick={handlePopOver}>{children}</button>;
}

function Content({ children }) {
  const { isOpen, contentRef } = usePopOverContext();
  if (!isOpen) return null;
  return createPortal(<div ref={contentRef}>{children}</div>, document.body);
}

PopOver.Action = Action;
PopOver.Content = Content;

export { usePopOverContext, PopOverProvider, PopOver };
