import React, { useState, useEffect } from 'react';
import "./Chessboard.css";
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';

const ChessGame: React.FC = () => {
  const [game, setGame] = useState(new Chess());
  const [fen, setFen] = useState(game.fen()); // Board position in FEN
  const [isGameOver, setIsGameOver] = useState(false);
  const [winner, setWinner] = useState<string | null>(null); // Track winner (if any)

  // Function to handle player moves
  const handleMove = (from: string, to: string) => {
    if (isGameOver) return false; // Don't allow moves if the game is over

    const move = game.move({ from, to, promotion: 'q' }); // Always promote to queen for simplicity
    if (move) {
      setFen(game.fen());
      checkGameOver(); // Check if the game is over after the move
      if (!game.isGameOver()) {
        setTimeout(makeAIMove, 500); // AI move after a short delay
      }
    }
    return true;
  };

  // Check if the game is over
  const checkGameOver = () => {
    if (game.isGameOver()) {
      setIsGameOver(true);
      // Set the winner based on the game outcome
      if (game.isCheckmate()) {
        setWinner(game.turn() === 'w' ? 'Black wins' : 'White wins');
      } else if (game.isStalemate()) {
        setWinner('Draw (Stalemate)');
      } else if (game.isInsufficientMaterial()) {
        setWinner('Draw (Insufficient Material)');
      } else if (game.isThreefoldRepetition()) {
        setWinner('Draw (Threefold Repetition)');
      } else if (game.isDraw()) {
        setWinner('Draw (50-move rule)');
      }
    }
  };

  // Simple AI function that makes a random valid move or captures if possible
  const makeAIMove = () => {
    const possibleMoves = game.moves();
    if (possibleMoves.length === 0) return;

    // Try to find a "greedy" move that captures an opponent piece
    const captureMoves = possibleMoves.filter((move) => move.includes("x"));
    const move = captureMoves.length > 0
      ? captureMoves[Math.floor(Math.random() * captureMoves.length)]
      : possibleMoves[Math.floor(Math.random() * possibleMoves.length)];

    game.move(move);
    setFen(game.fen());
    checkGameOver(); // Check if the game is over after the AI move
  };

  // Function to restart the game
  const restartGame = () => {
    const newGame = new Chess();
    setGame(newGame);
    setFen(newGame.fen());
    setIsGameOver(false);
    setWinner(null); // Reset the winner when restarting
  };

  useEffect(() => {
    // Run checkGameOver when the component mounts to set the initial game over state
    checkGameOver();
  }, [fen]); // Re-run when `fen` changes (after a move)

  return (
    <div style={{ textAlign: 'center', position: 'relative' }}>
      <h2>Chess Game - {isGameOver ? 'Game Over' : 'Your Move'}</h2>
      <button className="Restart-button-1" onClick={restartGame}>
        Do you need to Restart?
      </button>
      <div className="Chessboard">
        <Chessboard
          position={fen}
          onPieceDrop={(from, to) => handleMove(from, to)}
          boardOrientation="white" // Player plays as white
        />
        {isGameOver && (
          <div className="Gameover-overlay">
            <div className="Gameover-text">{winner ? winner : 'Game Over'}</div>
            <button className="Restart-button" onClick={restartGame}>
              Restart Game
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChessGame;
