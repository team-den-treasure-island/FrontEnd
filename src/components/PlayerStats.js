import React from 'react'
import Styled from 'styled-components'

const PlayerStats = props => {

  // player_status: {
  //   name: '',
  //   encumberance: null,
  //   strength: 10,
  //   speed: 10,
  //   gold: null,
  //   inventory: [],
  //   status: [],
  //   errors: [],
  //   messages: []
  // },

  const { player } = props
  let statKeys = Object.keys(player)
  // let statValues = Object.values(player)

  console.log('PLAYER STATS:', player)
  return (
    <StatsContainer>
      {statKeys.map((stat) => (
        <p key={stat}>{stat}: {player[stat]}</p>
      ))}
    </StatsContainer>
  )
}

const StatsContainer = Styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;

  p {
    margin: 5px;
  }
`

export default PlayerStats