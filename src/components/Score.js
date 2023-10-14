import React from 'react';
import styled from 'styled-components';

const ScoreContainer = styled.div`
  font-size: 24px;
  margin-top: 20px;
`;

const Score = ({ currentScore, highScore }) => {
  return (
    <ScoreContainer>
      <p>Score: {currentScore}</p>
      <p>High Score: {highScore}</p>
    </ScoreContainer>
  );
};

export default Score;
