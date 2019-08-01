import React from 'react';
import Styled from 'styled-components'

import GraphMap from './components/GraphMap';

function App() {
  return (
    <AppContainer>
      <GraphMap />
    </AppContainer>
  );
}

const AppContainer = Styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background-image: linear-gradient(#90ddf0, #062F32);
  height: 100%;
  min-height: 100vh;
`

export default App;
