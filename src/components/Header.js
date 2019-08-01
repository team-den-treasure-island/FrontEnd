import React from 'react';
import Styled from 'styled-components';
function Header() {
  return (
    <HeaderContainer>
      <ul>
        <li>Stuff</li>
        <li>Stuff</li>
        <li>Stuff</li>
      </ul>
    </HeaderContainer>
  );
}

const HeaderContainer = Styled.div`
height: 20%;
width: 100%;
background: black;

`;

export default Header;
