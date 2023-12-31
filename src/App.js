import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Fish from './components/Fish';
import Timer from './components/Timer';
import Score from './components/Score';
import FishTank from './components/FishTank';
import GameStatus from './components/GameStatus';

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

const GetReadyScreen = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const App = () => {
  const [fish, setFish] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [difficulty, setDifficulty] = useState('medium');
  const [fishAppearanceRate, setFishAppearanceRate] = useState(1000);
  const [showGetReady, setShowGetReady] = useState(true); // State variable for the "Get ready" screen

  const createFish = (selectedDifficulty) => {
    const fishCount = selectedDifficulty === 'hard' ? 12 : 6;
    return Array.from({ length: fishCount }, (_, i) => ({
      id: i + 1,
      position: 0,
    }));
  };

  useEffect(() => {
    const selectedDifficulty = difficulty;
    setFish(createFish(selectedDifficulty));
  }, [difficulty]);

  const moveFish = () => {
    const newFish = fish.map((f) => ({
      ...f,
      position: Math.floor(Math.random() * (Pond.width - Fish.width)),
    }));
    setFish(newFish);
  };

  const catchFish = (id) => {
    const newFish = fish.map((f) => ({
      ...f,
      position: f.id === id ? -100 : f.position,
    }));
    setFish(newFish);
    setScore(score + 1);
  };

  const handlePlayAgain = () => {
    if (score > highScore) {
      setHighScore(score);
    }
    setFish(createFish(difficulty));
    setScore(0);
    setTimeLeft(30);
    setGameOver(false);
    setGameStarted(true);
    setShowGetReady(true); // Reset "Get ready" screen
  };

  const handleStartGame = () => {
    setGameStarted(true);
    if (showGetReady) {
      setShowGetReady(false); // Hide "Get ready" after starting
      const getReadyTimer = setTimeout(() => {
        handlePlayAgain();
      }, 3000);
      return () => clearTimeout(getReadyTimer);
    }
  };

  const handleDifficultyChange = (event) => {
    const selectedDifficulty = event.target.value;
    setDifficulty(selectedDifficulty);
    setFishAppearanceRate(getFishAppearanceRate(selectedDifficulty));
    setFish(createFish(selectedDifficulty));
  };

  const getFishAppearanceRate = (selectedDifficulty) => {
    const rates = {
      easy: 2000,
      medium: 1000,
      hard: 500,
    };
    return rates[selectedDifficulty] || 1000;
  };

  useEffect(() => {
    if (gameStarted) {
      if (timeLeft > 0 && !gameOver) {
        moveFish();
        const timer = setTimeout(() => {
          setTimeLeft(timeLeft - 1);
        }, 1000);
        const fishTimer = setInterval(moveFish, fishAppearanceRate);
        return () => {
          clearTimeout(timer);
          clearInterval(fishTimer);
        };
      } else if (!gameOver) {
        setGameOver(true);
      }
    }
  }, [timeLeft, gameOver, gameStarted, fish, fishAppearanceRate, Pond.width]);

  return (
    <AppContainer>
      <HighScore>High Score: {highScore}</HighScore>
      <DifficultySelector value={difficulty} onChange={handleDifficultyChange}>
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </DifficultySelector>
      <GameStatus gameOver={gameOver} score={score} onPlayAgain={handleStartGame} />
      {!gameOver && gameStarted && (
        <>
          <Score currentScore={score} highScore={highScore} />
          <FishTank fish={fish} catchFish={catchFish} />
          <Timer time={timeLeft} />
        </>
      )}
    </AppContainer>
  );
};

export default App;
