import React from 'react';
import Styled from 'styled-components';

const Navigation = props => {
  const { exits, movement } = props;

  return (
    <NavigationContainer>
      {/* {!exits ? (
        <> */}
      <p>Available Moves:</p>
      <ButtonsContainer>
        {exits.map(exit => (
          <NavButton onClick={() => movement({ exit })} key={exit}>
            {exit}
          </NavButton>
        ))}
      </ButtonsContainer>
      {/* </>
      ) : null} */}
    </NavigationContainer>
  );
};

const NavigationContainer = Styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  /* border: 2px solid yellow; */
  width: 100%;
  height: 100%;

  p {
    margin: 0 0 10px 0;
  }
`;

const ButtonsContainer = Styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  /* border: 2px solid yellow; */
  width: 100%;
  height: 100%;
`;

const NavButton = Styled.button`
  display: flex;
  border: 1px solid white;
  background: white;
  transition: .2s;
  cursor: pointer;
  margin: 0 5px 5px 0;
  padding: 2px 5px;

  :hover {
    background: none;
    border: 1px solid #cdf279;
    transition: .2s;
  }
`;

export default Navigation;
