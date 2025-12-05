import React, { useEffect, useState } from "react";

export default function ConfettiBurst({ trigger }) {
  const [pieces, setPieces] = useState([]);

  useEffect(() => {
    if (!trigger) return;

    const arr = [];
    for (let i = 0; i < 30; i++) {
      arr.push({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.4,
        color: ["#FF7A7A", "#FFD97D", "#7ABFFF", "#B47AFF"][Math.floor(Math.random()*4)]
      });
    }
    setPieces(arr);
  }, [trigger]);

  return (
    <div className="confetti-container">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}vw`,
            background: p.color,
            animationDelay: `${p.delay}s`
          }}
        />
      ))}
    </div>
  );
}
