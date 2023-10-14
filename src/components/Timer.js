import React from 'react';
import styled from 'styled-components';

const TimerContainer = styled.div`
  font-size: 18px;
  margin-top: 10px;
`;

/**
 * Timer component that displays the remaining time in a countdown format.
 *
 * @param {number} time - The time remaining in seconds.
 */
const Timer = ({ time }) => {
  // Calculate minutes and seconds separately
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  // Format the time into a string (e.g., 05:09)
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

  return <TimerContainer>Time Left: {formattedMinutes}:{formattedSeconds}</TimerContainer>;
};

export default Timer;
