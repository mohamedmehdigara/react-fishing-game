import React from 'react';
import styled from 'styled-components';
import Fish from './Fish';

const Pond = styled.div`
  width: 100%;
  max-width: 600px;
  height: 50vh;
  background: #00a8ff;
  border: 5px solid #0097e6;
  position: relative;
`;

const FishTank = ({ fish, catchFish }) => {
  return (
    <Pond data-testid="fish-tank">
      {fish.map(({ id, position }) => (
        <Fish
          key={id}
          id={id}
          position={position}
          onClick={catchFish}
          data-testid={`fish-${id}`}
        />
      ))}
    </Pond>
  );
};

export default FishTank;
