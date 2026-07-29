import { useState } from "react";
import "./styles.css";

export default function Star() {
  const [selectedIdx, setSelectedIdx] = useState(-1);
  const [hoverIdx, setHoverIdx] = useState(-1);

  function handleClick(idx) {
    setSelectedIdx(idx);
  }

  function handleHover(idx) {
    setHoverIdx(idx);
  }

  function handleMouseLeave() {
    setHoverIdx(-1);
  }

  const isFilled = (idx) => {
    if (hoverIdx !== -1) return idx <= hoverIdx;
    return idx <= selectedIdx;
  };

  return (
    <StarRating
      len={10}
      handleMouseLeave={handleMouseLeave}
      renderItem={(_, idx) => (
        <Box
          key={idx}
          filled={isFilled(idx)}
          handleClick={handleClick}
          handleHover={handleHover}
          idx={idx}
        />
      )}
    />
  );
}

function StarRating({ len = 5, renderItem, handleMouseLeave }) {
  return (
    <ul className="star-container" onMouseLeave={handleMouseLeave}>
      {Array.from({ length: len }).map((_, idx) => renderItem(_, idx))}
    </ul>
  );
}

function Box({ filled, handleClick, handleHover, idx, size = 40 }) {
  return (
    <span
      className="star"
      onClick={() => handleClick(idx)}
      onMouseEnter={() => handleHover(idx)}
      style={{ fontSize: `${size}px`, lineHeight: 1, cursor: "pointer" }}
    >
      {filled ? "⭐" : "☆"}
    </span>
  );
}
