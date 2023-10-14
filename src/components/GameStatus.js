import React from 'react';
import styled from 'styled-components';

const StatusContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const GameOverMessage = styled.h1`
  font-size: 24px;
  margin-bottom: 10px;
`;

const FinalScore = styled.p`
  font-size: 18px;
  margin-bottom: 20px;
`;

const PlayAgainButton = styled.button`
  font-size: 18px;
  background: #f39c12;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
`;

const GameStatus = ({ gameOver, score, onPlayAgain }) => {
  return (
    <StatusContainer>
      {gameOver ? (
        <>
          <GameOverMessage>Game Over!</GameOverMessage>
          <FinalScore>Final Score: {score}</FinalScore>
          <PlayAgainButton onClick={onPlayAgain}>Play Again</PlayAgainButton>
        </>
      ) : (
        <p>Get ready to catch some fish!</p>
      )}
    </StatusContainer>
  );
};

export default GameStatus;
