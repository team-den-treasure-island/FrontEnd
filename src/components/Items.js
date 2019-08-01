import React from 'react'
import Styled from 'styled-components'

const Items = props => {

  const { items, pickup } = props

  return (
    <ItemsContainer>
      <div>Available Items:</div>
      {items.length !== 0 ? (
        items.map(item => (
          <button key={item} onClick={() => pickup({ item })}>
            Pick up: {item}
          </button>
        ))
      ) : (
        <p>This room contains no items</p>
      )}
    </ItemsContainer>
  )
}

const ItemsContainer = Styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: wrap;
  border-top: 2px solid black;
  padding-top: 10px;
  width: 100%;

  p {
    font-size: 12px;
  }
`

export default Items