import React from 'react';
import Styled from 'styled-components';

const Players = props => {
  const { players, examineRoom, currentRoom } = props;
  return (
    <PlayerContainer>
      {currentRoom < 0 ? (
        <p>Please select a player!</p>
      ) : (
        <>
          <p>You are in Room Number: {currentRoom}</p>
          <p>Players with you:</p>
          <PlayerList>
            {players.length !== 0 ? (
              players.map(player => (
                <PlayerButton
                  onClick={() => examineRoom({ player })}
                  key={player}
                >
                  {player}
                </PlayerButton>
              ))
            ) : (
              <p>You are alone in this room</p>
            )}
          </PlayerList>
        </>
      )}
    </PlayerContainer>
  );
};

const PlayerContainer = Styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  flex-wrap: wrap;
  margin: 10px 0;
  padding: 10px 0;
  border-top: 2px solid black;
  border-bottom: 2px solid black;

  p {
    margin: 0 0 10px 0;
  }
`;

const PlayerList = Styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  flex-wrap: wrap;

  p {
    font-size: 12px;
  }
`;

const PlayerButton = Styled.button`
  display: flex;
  border: 1px solid white;
  background: white;
  transition: .2s;
  cursor: pointer;
  margin: 0 5px 5px 0;
  padding: 2px;

  :hover {
    background: none;
    border: 1px solid black;
    transition: .2s;
  }
`;

export default Players;
