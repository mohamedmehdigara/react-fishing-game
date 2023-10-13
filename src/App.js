import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Fish from './components/Fish';
import Timer from './components/Timer';

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

const HighScore = styled.p`
  font-size: 18px;
  margin-top: 10px;
`;

const DifficultySelector = styled.select`
  font-size: 18px;
  margin-top: 10px;
  padding: 5px;
  border: 1px solid #ccc;
`;

const App = () => {
  const [fish, setFish] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [difficulty, setDifficulty] = useState('medium'); // Default difficulty

  useEffect(() => {
    const createFish = () => {
      const newFish = [];
      for (let i = 1; i <= 6; i++) {
        newFish.push({ id: i, position: 0 });
      }
      return newFish;
    };

    setFish(createFish());
  }, [difficulty]);

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
    if (score > highScore) {
      setHighScore(score);
    }
    setFish(fish.map((f) => ({ ...f, position: 0 }))); // Reset fish positions
    setScore(0);
    setTimeLeft(30);
    setGameOver(false);
  };

  const handleStartGame = () => {
    setGameStarted(true);
  };

  const handleDifficultyChange = (event) => {
    setDifficulty(event.target.value);
  };

  useEffect(() => {
    if (gameStarted) {
      if (timeLeft > 0 && !gameOver) {
        moveFish();
        const timer = setTimeout(() => {
          setTimeLeft(timeLeft - 1);
        }, 1000);
        return () => clearTimeout(timer);
      } else if (!gameOver) {
        setGameOver(true);
      }
    }
  }, [timeLeft, gameOver, gameStarted, fish]);

  return (
    <AppContainer>
      <HighScore>High Score: {highScore}</HighScore>
      <DifficultySelector value={difficulty} onChange={handleDifficultyChange}>
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </DifficultySelector>
      {!gameStarted ? (
        <PlayAgainButton onClick={handleStartGame}>Start Game</PlayAgainButton>
      ) : (
        <>
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
              <Timer time={timeLeft} />
            </>
          )}
        </>
      )}
    </AppContainer>
  );
};

export default App;
