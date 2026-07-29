import { useState } from "react";
import "./styles.css";

const cards = [
  { id: 1, value: "🍎" },
  { id: 2, value: "🍌" },
  { id: 3, value: "🍇" },
  { id: 4, value: "🍉" },
  { id: 5, value: "🍓" },
  { id: 6, value: "🍒" },
  { id: 7, value: "🥝" },
  { id: 8, value: "🍍" },
];

const gameData = [...cards, ...cards].map((c, idx) => ({
  ...c,
  uid: idx, // unique id for each card
  opened: false,
  matched: false,
}));

export default function Memory() {
  const [board, setBoard] = useState(gameData);
  const [open, setOpen] = useState([]); // store indexes

  function handleClick(idx) {
    if (board[idx].matched || open.includes(idx)) return;

    // open card
    const newBoard = [...board];
    newBoard[idx] = { ...newBoard[idx], opened: true };
    setBoard(newBoard);

    const newOpen = [...open, idx];
    setOpen(newOpen);

    // if 2 cards opened
    if (newOpen.length === 2) {
      const [firstIdx, secondIdx] = newOpen;

      if (newBoard[firstIdx].value === newBoard[secondIdx].value) {
        // match
        setTimeout(() => {
          setBoard((prev) => {
            const updated = [...prev];
            updated[firstIdx] = { ...updated[firstIdx], matched: true };
            updated[secondIdx] = { ...updated[secondIdx], matched: true };
            return updated;
          });
          setOpen([]);
        }, 300);
      } else {
        // close both
        setTimeout(() => {
          setBoard((prev) => {
            const updated = [...prev];
            updated[firstIdx] = { ...updated[firstIdx], opened: false };
            updated[secondIdx] = { ...updated[secondIdx], opened: false };
            return updated;
          });
          setOpen([]);
        }, 700);
      }
    }
  }

  return (
    <div className="game">
      {board.map((val, idx) => (
        <li
          className="card"
          onClick={() => handleClick(idx)}
          style={{ listStyle: "none" }}
          key={val.uid}
        >
          {val.opened || val.matched ? val.value : "❓"}
        </li>
      ))}
    </div>
  );
}
