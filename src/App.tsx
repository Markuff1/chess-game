// App.tsx
import React from 'react';
import ChessGame from './ChessGame';
import "./Chessboard.css"

const App: React.FC = () => {
  return (
    <div>
      <h1 className='title'>Play Chess with Simple AI</h1>
      <ChessGame />
    </div>
  );
};

export default App;
