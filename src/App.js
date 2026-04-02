import React, { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { create } from 'zustand';

// --- ZUSTAND STORE ---
const useGameStore = create((set, get) => ({
  fish: [],
  score: 0,
  timeLeft: 30,
  gameOver: false,
  gameStarted: false,
  highScore: 0,
  difficulty: 'medium',
  
  setDifficulty: (difficulty) => {
    set({ difficulty });
  },

  createFishArray: (difficulty) => {
    // Fewer fish on screen at once makes it less overwhelming
    const fishCount = difficulty === 'hard' ? 8 : 4; 
    return Array.from({ length: fishCount }, (_, i) => ({
      id: i + 1,
      x: Math.random() * 80 + 10,
      y: Math.random() * 80 + 10,
      visible: true,
      emoji: ['🐟', '🐠', '🐡'][Math.floor(Math.random() * 3)]
    }));
  },

  startGame: () => {
    set({
      gameStarted: true,
      gameOver: false,
      score: 0,
      timeLeft: 30,
      fish: get().createFishArray(get().difficulty),
    });
  },

  tick: () => {
    const { timeLeft, gameOver, gameStarted } = get();
    if (gameStarted && !gameOver && timeLeft > 0) {
      set({ timeLeft: timeLeft - 1 });
      // Fish only move every 2 seconds now (slower than before)
      if (timeLeft % 2 === 0) get().moveFish(); 
    } else if (timeLeft <= 0 && gameStarted) {
      const { score, highScore } = get();
      set({ gameOver: true, timeLeft: 0, highScore: Math.max(score, highScore) });
    }
  },

  moveFish: () => {
    set((state) => ({
      fish: state.fish.map((f) => ({
        ...f,
        x: Math.random() * 85 + 5,
        y: Math.random() * 85 + 5,
      })),
    }));
  },

  catchFish: (id) => {
    const { timeLeft } = get();
    set((state) => ({
      score: state.score + 1,
      timeLeft: timeLeft + 1, // BONUS: Catching a fish gives +1 second!
      fish: state.fish.map((f) => 
        f.id === id ? { ...f, visible: false } : f
      ),
    }));
    
    // Quick respawn
    setTimeout(() => {
      set((state) => ({
        fish: state.fish.map((f) => 
          f.id === id ? { 
            ...f, 
            visible: true, 
            x: Math.random() * 85 + 5, 
            y: Math.random() * 85 + 5 
          } : f
        ),
      }));
    }, 400);
  },
}));

// --- STYLED COMPONENTS ---
const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(180deg, #74b9ff 0%, #0984e3 100%);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: white;
`;

const Pond = styled.div`
  width: 95%;
  max-width: 700px;
  height: 450px;
  background: rgba(0, 168, 255, 0.6);
  border: 10px solid #fff;
  border-radius: 30px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(0,0,0,0.3);
  backdrop-filter: blur(5px);
`;

const FishIcon = styled.div`
  position: absolute;
  font-size: 50px; /* Bigger fish = Easier to hit */
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  left: ${props => props.x}%;
  top: ${props => props.y}%;
  display: ${props => props.visible ? 'block' : 'none'};
  cursor: pointer;
  filter: drop-shadow(0 0 10px rgba(255,255,255,0.5));
  
  &:active {
    transform: scale(0.8);
  }
`;

const StatsBar = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
  background: rgba(0,0,0,0.2);
  padding: 10px 30px;
  border-radius: 50px;
  font-weight: bold;
  font-size: 20px;
`;

const Modal = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 100;
  text-align: center;
`;

const StartButton = styled.button`
  padding: 15px 40px;
  font-size: 24px;
  background: #00b894;
  color: white;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
  transition: transform 0.2s;
  &:hover { transform: scale(1.05); }
`;

// --- MAIN COMPONENTS ---
export default function App() {
  const { 
    gameStarted, gameOver, score, timeLeft, highScore, 
    difficulty, setDifficulty, startGame, tick, fish, catchFish 
  } = useGameStore();

  useEffect(() => {
    const interval = setInterval(() => tick(), 1000);
    return () => clearInterval(interval);
  }, [tick]);

  return (
    <AppContainer>
      <h1>🎣 Easy Fisher</h1>
      
      <StatsBar>
        <span>Score: {score}</span>
        <span style={{ color: timeLeft < 10 ? '#ff7675' : '#55efc4' }}>
          Time: {timeLeft}s
        </span>
        <span>High: {highScore}</span>
      </StatsBar>

      <Pond>
        {!gameStarted && (
          <Modal>
            <h2>Welcome to the Pond!</h2>
            <p>Catch fish to gain extra time.</p>
            <div style={{ margin: '20px' }}>
              <label>Difficulty: </label>
              <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                <option value="easy">Easy (Relaxed)</option>
                <option value="medium">Medium (Standard)</option>
                <option value="hard">Hard (Fast)</option>
              </select>
            </div>
            <StartButton onClick={startGame}>Start Fishing</StartButton>
          </Modal>
        )}

        {gameOver && (
          <Modal>
            <h2 style={{ fontSize: '40px' }}>Times Up! ⏰</h2>
            <p style={{ fontSize: '24px' }}>Final Score: {score}</p>
            <StartButton onClick={startGame}>Try Again</StartButton>
          </Modal>
        )}

        {fish.map((f) => (
          <FishIcon 
            key={f.id} 
            x={f.x} 
            y={f.y} 
            visible={f.visible} 
            onClick={() => catchFish(f.id)}
          >
            {f.emoji}
          </FishIcon>
        ))}
      </Pond>
      
      <p style={{ marginTop: '20px', opacity: 0.8 }}>
        Tip: Every fish you catch adds 1 second to the clock!
      </p>
    </AppContainer>
  );
}
