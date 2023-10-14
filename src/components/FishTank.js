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
    <Pond>
      {fish.map((f) => (
        <Fish key={f.id} id={f.id} position={f.position} onClick={catchFish} />
      ))}
    </Pond>
  );
};

export default FishTank;
