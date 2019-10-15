import React from 'react';

import './App.css';

import AppRouter from 'components'
import { StateProvider } from 'state'
import reducer, { initialState } from 'state/reducer'

function App() {
  return (
    <StateProvider initialState={initialState} reducer={reducer}>
      <div className="App">
        <AppRouter />
      </div>
    </StateProvider>
  );
}

export default App;
