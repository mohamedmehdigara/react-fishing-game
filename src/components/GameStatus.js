import React, { useEffect } from 'react';
import styled from 'styled-components';

const StatusContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.7);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  transition: opacity 0.3s ease;
  opacity: ${(props) => (props.visible ? 1 : 0)};
  pointer-events: ${(props) => (props.visible ? 'auto' : 'none')};
  z-index: ${(props) => (props.visible ? 1 : -1)};
`;

const GameOverMessage = styled.h1`
  font-size: 36px;
  color: #e74c3c;
  margin-bottom: 20px;
`;

const FinalScore = styled.p`
  font-size: 24px;
  margin-bottom: 20px;
`;

const GameStatus = ({ gameOver, score, onPlayAgain }) => {
  useEffect(() => {
    if (!gameOver) {
      const timer = setTimeout(() => {
        onPlayAgain();
      }, 3000); // Automatically start the game after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [gameOver, onPlayAgain]);

  return (
    <StatusContainer visible={gameOver}>
      {gameOver ? (
        <div>
          <GameOverMessage>Game Over!</GameOverMessage>
          <FinalScore>Your Score: {score}</FinalScore>
        </div>
      ) : (
        <p>Get ready to catch some fish!</p>
      )}
    </StatusContainer>
  );
};

export default GameStatus;
