import React from 'react';
import styled from 'styled-components';

const StatusContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const GameStatus = ({ gameOver, score, onPlayAgain }) => {
  return (
    <StatusContainer>
      {gameOver ? (
        <>
          <h1>Game Over!</h1>
          <p>Final Score: {score}</p>
          <button onClick={onPlayAgain}>Play Again</button>
        </>
      ) : (
        <p>Get ready to catch some fish!</p>
      )}
    </StatusContainer>
  );
};

export default GameStatus;
