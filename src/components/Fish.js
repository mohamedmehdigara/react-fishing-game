import React from 'react';
import styled from 'styled-components';

// Styled component for the fish image
const FishImage = styled.div`
  width: 50px;
  height: 30px;
  background: #f39c12;
  position: absolute;
  bottom: 0;
`;

/**
 * Fish component that represents a fish in the pond.
 *
 * @param {number} id - Unique identifier for the fish.
 * @param {number} position - Horizontal position of the fish.
 * @param {function} onClick - Function to handle when the fish is clicked.
 */
const Fish = ({ id, position, onClick }) => {
  return (
    <FishImage
      style={{ left: position }}
      onClick={() => onClick(id)}
      // You can add more styles or props here as needed
    />
  );
};

// Static property to define the width of the fish image
Fish.width = 50;

export default Fish;
