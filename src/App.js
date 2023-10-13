import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Fish from './components/Fish';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const Pond = styled.div`
  width: 100%;
  max-width: 600px;
  height: 50vh;
  background: #00a8ff;
  border: 5px solid #0097e6;
  position: relative;
`;

const Score = styled.p`
  font-size: 24px;
  margin-top: 20px;
`;

const GameOverScreen = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const PlayAgainButton = styled.button`
  font-size: 18px;
  background: #f39c12;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  margin-top: 20px;
`;

const App = () => {
  const [fish, setFish] = useState([
    { id: 1, position: 0 },
    { id: 2, position: 0 },
    { id: 3, position: 0 },
  ]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameOver, setGameOver] = useState(false);

  const moveFish = () => {
    const newFish = fish.map((f) => ({
      id: f.id,
      position: Math.floor(Math.random() * (Pond.width - Fish.width)),
    }));
    setFish(newFish);
  };

  const catchFish = (id) => {
    const newFish = fish.map((f) => ({
      id: f.id,
      position: f.id === id ? -100 : f.position,
    }));
    setFish(newFish);
    setScore(score + 1);
  };

  const handlePlayAgain = () => {
    setFish([
      { id: 1, position: 0 },
      { id: 2, position: 0 },
      { id: 3, position: 0 },
    ]);
    setScore(0);
    setTimeLeft(30);
    setGameOver(false);
  };

  useEffect(() => {
    if (timeLeft > 0 && !gameOver) {
      moveFish();
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (!gameOver) {
      setGameOver(true);
    }
  }, [timeLeft, gameOver]);

  return (
    <AppContainer>
      {gameOver ? (
        <GameOverScreen>
          <h1>Game Over!</h1>
          <Score>Final Score: {score}</Score>
          <PlayAgainButton onClick={handlePlayAgain}>Play Again</PlayAgainButton>
        </GameOverScreen>
      ) : (
        <>
          <Pond>
            {fish.map((f) => (
              <Fish key={f.id} id={f.id} position={f.position} onClick={catchFish} />
            ))}
          </Pond>
          <Score>Score: {score}</Score>
          <p>Time Left: {timeLeft} seconds</p>
        </>
      )}
    </AppContainer>
  );
            }
export default App;
