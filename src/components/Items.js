import React from 'react'
import Styled from 'styled-components'

const Items = props => {

  const { items, pickup } = props

  return (
    <>
      {items.length !== 0 ? (
        items.map(item => (
          <ul key={item}>
            <li>Items in room:</li>
            <button onClick={() => pickup({ item })}>
              pick up: {item}
            </button>
          </ul>
        ))
      ) : (
        <p>This room contains no items</p>
      )}
    </>
  )
}

export default Items