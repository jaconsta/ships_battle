import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import GamePlaceShips from './GamePlaceShips'
import IntroScreen from './IntroScreen'
import GameDevelopment from './GameDevelopment'

const AppRouter = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/new" component={GamePlaceShips} />
      <Route path="/game" component={GameDevelopment} />
      <Route exact path="/" component={IntroScreen} />
      <Route>
        <div>Page not Found</div>
      </Route>
    </Switch>
  </BrowserRouter>
)

export default AppRouter
