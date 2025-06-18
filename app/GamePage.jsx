"use client";

import React, { useState } from "react";

const BOARD_SIZE = 10;
const SHAPES = ["circle", "square"];

export default function GamePage({ player1, player2, player1Color, player2Color, startingPlayer, onRestart, onHome }) {
  const [board, setBoard] = useState(
    Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null))
  );
  const [turn, setTurn] = useState(startingPlayer);
  const [selectedShape, setSelectedShape] = useState(null);
  const [winner, setWinner] = useState(null);

  const currentColor = turn === player1 ? player1Color : player2Color;

  function checkWin(r, c, piece) {
    const currentBoard = [...board];
    currentBoard[r][c] = piece;

    const directions = [
      [[0, 1], [0, -1]],
      [[1, 0], [-1, 0]],
      [[1, 1], [-1, -1]],
      [[1, -1], [-1, 1]],
    ];

    for (const dir of directions) {
      for (const trait of ["color", "shape"]) {
        let count = 1;

        for (const [dx, dy] of dir) {
          let x = r + dx;
          let y = c + dy;

          while (
            x >= 0 &&
            x < BOARD_SIZE &&
            y >= 0 &&
            y < BOARD_SIZE &&
            currentBoard[x][y] &&
            currentBoard[x][y][trait] === piece[trait]
          ) {
            count++;
            x += dx;
            y += dy;
          }
        }

        if (count >= 5) return true;
      }
    }

    return false;
  }

  function handleCellClick(r, c) {
    if (winner || !selectedShape || board[r][c]) return;

    const newBoard = board.map((row) => row.slice());
    const piece = { color: currentColor, shape: selectedShape };
    newBoard[r][c] = piece;
    setBoard(newBoard);

    if (checkWin(r, c, piece)) {
      setWinner(turn);
      return;
    }

    if (newBoard.flat().every((cell) => cell !== null)) {
      setWinner("Draw");
      return;
    }

    setTurn(turn === player1 ? player2 : player1);
    setSelectedShape(null);
  }

  function renderPiece({ color, shape }) {
    const base = {
      display: "inline-block",
      width: 30,
      height: 30,
      margin: 5,
      border: color === "black" ? "2px solid white" : "2px solid black",
      backgroundColor: color,
    };
    return shape === "circle"
      ? <div style={{ ...base, borderRadius: "50%" }} />
      : <div style={base} />;
  }

  return (
    <div style={{ fontFamily: "sans-serif", maxWidth: 400, margin: "20px auto", textAlign: "center" }}>
      <h1>Cinco</h1>
      <h3>{winner ? (winner === "Draw" ? "It's a draw!" : `${winner} wins! 🎉`) : `${turn}'s turn`}</h3>

      <div style={{
        display: "grid",
        gridTemplateColumns: `repeat(${BOARD_SIZE}, 50px)`,
        gap: 4,
        justifyContent: "center",
        margin: "20px 0"
      }}>
        {board.map((row, r) =>
          row.map((cell, c) => (
            <div
              key={`${r}-${c}`}
              onClick={() => handleCellClick(r, c)}
              style={{
                width: 50,
                height: 50,
                backgroundColor: "#eee",
                border: "2px solid #333",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: cell || winner ? "default" : "pointer"
              }}
            >
              {cell && renderPiece(cell)}
            </div>
          ))
        )}
      </div>

      <div>
        <p>Select a shape:</p>
        <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}>
          {SHAPES.map((shape) => {
            const piece = { color: currentColor, shape };
            const isSelected = selectedShape === shape;
            return (
              <div
                key={shape}
                onClick={() => setSelectedShape(shape)}
                style={{
                  padding: 5,
                  border: isSelected ? "3px solid gold" : "2px solid #aaa",
                  borderRadius: 4,
                  margin: "4px",
                  cursor: "pointer"
                }}
              >
                {renderPiece(piece)}
              </div>
            );
          })}
        </div>
      </div>

      {winner && (
        <>
          <button
            onClick={() => {
              setBoard(Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null)));
              setWinner(null);
              setTurn(startingPlayer); // Use dynamic starting player again
              setSelectedShape(null);
              onRestart(); // Notify parent to alternate starter
            }}
            style={{
              marginTop: 15,
              padding: "8px 16px",
              fontSize: 16,
              cursor: "pointer"
            }}
          >
            Restart Game
          </button>
          <button
            onClick={onHome}
            style={{ marginLeft: 10, padding: "8px 16px", fontSize: 16, cursor: "pointer" }}
          >
            Return Home
          </button>
        </>
      )}
    </div>
  );
}
