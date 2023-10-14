import React from 'react';
import styled from 'styled-components';

// Styled component for the fish image
const FishImage = styled.div`
  width: ${(props) => props.size}px;
  height: ${(props) => (props.size * 0.6)}px;
  background: ${(props) => props.color};
  position: absolute;
  bottom: 0;
  cursor: pointer;
`;

/**
 * Fish component that represents a fish in the pond.
 *
 * @param {number} id - Unique identifier for the fish.
 * @param {number} position - Horizontal position of the fish.
 * @param {function} onClick - Function to handle when the fish is clicked.
 * @param {number} size - Size of the fish.
 * @param {string} color - Color of the fish.
 */
const Fish = ({ id, position, onClick, size, color }) => {
  return (
    <FishImage
      style={{ left: position }}
      onClick={() => onClick(id)}
      size={size}
      color={color}
    />
  );
};

// Static property to define the default width of the fish image
Fish.defaultProps = {
  size: 50,
  color: '#f39c12',
};

export default Fish;
