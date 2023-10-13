import React from 'react';
import styled from 'styled-components';

const FishImage = styled.div`
  width: 50px;
  height: 30px;
  background: #f39c12;
  position: absolute;
  bottom: 0;
`;

const Fish = ({ id, position, onClick }) => {
  return (
    <FishImage style={{ left: position }} onClick={() => onClick(id)} />
  );
};

Fish.width = 50; // Add this property to the Fish component for easy reference

export default Fish;
