import React, { useEffect, useState, useCallback, useMemo } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// --- ZUSTAND: CORE GAME ENGINE ---
const useGameStore = create(
  persist(
    (set, get) => ({
      fish: [],
      score: 0,
      timeLeft: 30,
      gameOver: false,
      gameStarted: false,
      highScore: 0,
      difficulty: 'medium',
      frenzy: false,
      
      setDifficulty: (val) => set({ difficulty: val }),

      generateFish: (id) => {
        const rand = Math.random();
        const isKing = rand > 0.96;
        const isPuffer = !isKing && rand > 0.85;
        
        return {
          id,
          x: Math.random() * 80 + 10,
          y: Math.random() * 80 + 10,
          prevX: 50,
          visible: true,
          isKing,
          isPuffer,
          emoji: isKing ? '👑' : isPuffer ? '🐡' : '🐟',
          points: isKing ? 25 : isPuffer ? 10 : 2,
          timeBonus: isKing ? 5 : isPuffer ? 2 : 1,
          speed: isKing ? 0.7 : isPuffer ? 1.1 : 1.6,
        };
      },

      startGame: () => {
        const count = { easy: 6, medium: 10, hard: 16 }[get().difficulty];
        set({
          gameStarted: true,
          gameOver: false,
          score: 0,
          timeLeft: 35,
          frenzy: false,
          fish: Array.from({ length: count }, (_, i) => get().generateFish(i)),
        });
      },

      tick: () => {
        const { timeLeft, gameStarted, gameOver, score, highScore } = get();
        if (!gameStarted || gameOver) return;

        if (timeLeft <= 0) {
          set({ gameOver: true, highScore: Math.max(score, highScore) });
        } else {
          set({ timeLeft: timeLeft - 1 });
          // Move fish with variable probability based on difficulty
          const moveProb = { easy: 0.3, medium: 0.5, hard: 0.7 }[get().difficulty];
          set(state => ({
            fish: state.fish.map(f => Math.random() < moveProb 
              ? { ...f, prevX: f.x, x: Math.random() * 85 + 5, y: Math.random() * 85 + 5 }
              : f
            )
          }));
        }
      },

      catchFish: (id) => {
        const target = get().fish.find(f => f.id === id);
        if (!target || !target.visible) return null;

        const multiplier = get().frenzy ? 2 : 1;
        set(state => ({
          score: state.score + (target.points * multiplier),
          timeLeft: state.timeLeft + target.timeBonus,
          fish: state.fish.map(f => f.id === id ? { ...f, visible: false } : f)
        }));

        // Respawn with a chance to upgrade to King
        setTimeout(() => {
          set(state => ({
            fish: state.fish.map(f => f.id === id ? get().generateFish(id) : f)
          }));
        }, 1200);

        return target;
      },

      triggerFrenzy: (active) => set({ frenzy: active }),
    }),
    { name: 'fishing-master-v1' }
  )
);

// --- STYLES & ANIMATIONS ---
const drift = keyframes`
  from { background-position: 0 0; }
  to { background-position: 100% 100%; }
`;

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(235, 47, 6, 0.4); }
  70% { box-shadow: 0 0 0 20px rgba(235, 47, 6, 0); }
  100% { box-shadow: 0 0 0 0 rgba(235, 47, 6, 0); }
`;

const floatUp = keyframes`
  0% { transform: translateY(0) scale(1); opacity: 1; }
  100% { transform: translateY(-80px) scale(1.5); opacity: 0; }
`;

const MainContainer = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #061e3d;
  color: #fff;
  font-family: 'Segoe UI', Roboto, sans-serif;
  overflow: hidden;
`;

const HUD = styled.div`
  display: flex;
  gap: 50px;
  margin-bottom: 25px;
  font-size: 28px;
  font-weight: 800;
  letter-spacing: 2px;
  text-shadow: 0 4px 10px rgba(0,0,0,0.5);
`;

const Pond = styled.div`
  position: relative;
  width: 90vw;
  max-width: 1000px;
  height: 600px;
  background: #10ac84;
  background: linear-gradient(135deg, #0a3d62 0%, #3c6382 100%);
  border: 12px solid ${props => props.isLow ? '#eb2f06' : '#fad390'};
  border-radius: 40px;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(0,0,0,0.6);
  ${props => props.isLow && css`animation: ${pulse} 1s infinite;`}
  transition: border-color 0.5s ease;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: url('https://www.transparenttextures.com/patterns/cubes.png');
    opacity: 0.1;
    pointer-events: none;
    animation: ${drift} 30s linear infinite;
  }
`;

const Fish = styled.div.attrs(props => ({
  style: {
    left: `${props.x}%`,
    top: `${props.y}%`,
    transform: `scaleX(${props.x > props.prevX ? -1 : 1})`,
  },
}))`
  position: absolute;
  font-size: ${props => props.isKing ? '70px' : props.isPuffer ? '50px' : '40px'};
  transition: all ${props => props.speed}s cubic-bezier(0.45, 0.05, 0.55, 0.95);
  cursor: pointer;
  z-index: 10;
  filter: drop-shadow(0 8px 10px rgba(0,0,0,0.3));
  user-select: none;
  opacity: ${props => props.visible ? 1 : 0};
  pointer-events: ${props => props.visible ? 'auto' : 'none'};

  &:hover { filter: brightness(1.3) scale(1.2); }
`;

const FloatingText = styled.div`
  position: absolute;
  left: ${props => props.x}%;
  top: ${props => props.y}%;
  color: ${props => props.gold ? '#f1c40f' : '#2ecc71'};
  font-weight: 900;
  font-size: 30px;
  pointer-events: none;
  animation: ${floatUp} 0.8s ease-out forwards;
  z-index: 100;
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.85);
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 200;
  text-align: center;
`;

const Button = styled.button`
  background: #f39c12;
  color: white;
  border: none;
  padding: 20px 60px;
  font-size: 26px;
  font-weight: 900;
  border-radius: 50px;
  cursor: pointer;
  box-shadow: 0 8px 0 #d35400;
  transition: 0.1s;
  &:active { transform: translateY(4px); box-shadow: 0 4px 0 #d35400; }
`;

// --- MAIN APP ---
export default function App() {
  const store = useGameStore();
  const [popups, setPopups] = useState([]);

  // High-frequency game loop
  useEffect(() => {
    const loop = setInterval(() => store.tick(), 1000);
    return () => clearInterval(loop);
  }, [store]);

  const handleCatch = useCallback((id) => {
    const f = store.catchFish(id);
    if (f) {
      const popupId = Date.now();
      setPopups(prev => [...prev, { 
        id: popupId, 
        x: f.x, 
        y: f.y, 
        text: f.isKing ? `KING! +${f.points}` : `+${f.points}`,
        gold: f.isKing 
      }]);
      setTimeout(() => setPopups(prev => prev.filter(p => p.id !== popupId)), 800);
    }
  }, [store]);

  return (
    <MainContainer>
      <HUD>
        <div>SCORE: <span style={{color: '#f1c40f'}}>{store.score}</span></div>
        <div style={{color: store.timeLeft < 6 ? '#e74c3c' : '#2ecc71'}}>
          TIME: {store.timeLeft}s
        </div>
        <div>BEST: {store.highScore}</div>
      </HUD>

      <Pond isLow={store.timeLeft > 0 && store.timeLeft < 6}>
        {!store.gameStarted && (
          <Overlay>
            <h1 style={{fontSize: '4rem', marginBottom: '0'}}>AQUA CRUSH</h1>
            <p style={{fontSize: '1.2rem', opacity: 0.8}}>Catch 👑 for massive point multipliers!</p>
            <div style={{margin: '30px'}}>
              <select 
                value={store.difficulty} 
                onChange={(e) => store.setDifficulty(e.target.value)}
                style={{padding: '12px 30px', borderRadius: '15px', fontSize: '18px'}}
              >
                <option value="easy">Easy Stream</option>
                <option value="medium">Normal Lake</option>
                <option value="hard">Expert Ocean</option>
              </select>
            </div>
            <Button onClick={store.startGame}>CAST LINE</Button>
          </Overlay>
        )}

        {store.gameOver && (
          <Overlay>
            <h1 style={{color: '#e74c3c', fontSize: '3rem'}}>TIME EXPIRED</h1>
            <p style={{fontSize: '2rem'}}>Final Score: <b>{store.score}</b></p>
            <Button onClick={store.startGame}>REPLAY</Button>
          </Overlay>
        )}

        {store.fish.map((f) => (
          <Fish 
            key={f.id} 
            {...f} 
            onClick={() => handleCatch(f.id)}
          >
            {f.emoji}
          </Fish>
        ))}

        {popups.map(p => (
          <FloatingText key={p.id} x={p.x} y={p.y} gold={p.gold}>
            {p.text}
          </FloatingText>
        ))}
      </Pond>

      <div style={{marginTop: '30px', opacity: 0.5, fontSize: '0.9rem'}}>
        TIP: King fish appear rarely but grant 25 points!
      </div>
    </MainContainer>
  );
}
