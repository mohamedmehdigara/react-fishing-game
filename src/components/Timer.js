import React from 'react';
import styled from 'styled-components';

const TimerContainer = styled.div`
  font-size: 18px;
  margin-top: 10px;
`;

const Timer = ({ time }) => {
  return <TimerContainer>Time Left: {time} seconds</TimerContainer>;
};

export default Timer;
