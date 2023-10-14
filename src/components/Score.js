import React from 'react';
import styled from 'styled-components';

const ScoreContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 24px;
  margin-top: 20px;
`;

const ScoreText = styled.p`
  margin: 5px 0;
`;

const Score = ({ currentScore, highScore }) => {
  return (
    <ScoreContainer>
      <ScoreText>Score: {currentScore}</ScoreText>
      <ScoreText>High Score: {highScore}</ScoreText>
    </ScoreContainer>
  );
};

export default Score;
