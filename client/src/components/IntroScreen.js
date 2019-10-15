import React, { useState } from 'react'

import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

import { IntroPaper, IntroOptions } from './styled'
import { useStateValue } from 'state'
import { SET_USER_GAME_DATA } from 'state/reducer'
import { createNewGameSession, joinNewGameSession } from 'services/gameBoard'

const NONE = null
const START = 'start'
const JOIN = 'join'

const IntroScreen = props => {
  const [ selectedOption, setSelectedOption ] = useState(NONE)
  const [ userData, setUserData ] = useState({})
  const { playerName, gameCode } = userData

  const [ , dispatch ] = useStateValue()

  const updateUserData = field => ({ target: { value } }) => setUserData({ ...userData, [field]: value })
  const cleanUserData = () => setUserData({})

  const createNewGame = async () => {
    const { data } = await createNewGameSession(userData)
    dispatch({ type: SET_USER_GAME_DATA, gameData: data })
    props.history.push('/new')
  }
  const joinNewGame = async () => {
      const { data } = await joinNewGameSession(userData)
      dispatch({ type: SET_USER_GAME_DATA, gameData: data })
      props.history.push('/new')
  }

  const selectOption = option => () => setSelectedOption(option)
  const optionBack = () => {
    cleanUserData()
    selectOption(NONE)()
  }
  const DefaultOption = () => (
    <IntroPaper>
      <IntroOptions>
        <Typography variant="subtitle1">Select one</Typography>
        <Button variant="contained" color="primary" onClick={selectOption(START)}>Create new game</Button>
        <Button variant="contained" color="secondary" onClick={selectOption(JOIN)}>Join one</Button>
      </IntroOptions>
    </IntroPaper>
  )
  const NewGameOption = () => (
    <IntroPaper>
      <IntroOptions>
        <Typography variant="subtitle1">Your name</Typography>
        <TextField value={playerName} onChange={updateUserData('playerName')} />
        <Button variant="contained" color="primary" onClick={createNewGame}>Create</Button>
        <Button variant="contained" color="secondary" onClick={optionBack}>Back</Button>
      </IntroOptions>
    </IntroPaper>
  )
  const JoinGameOption = () => (
    <IntroPaper>
      <IntroOptions>
        <Typography variant="subtitle1">Room code</Typography>
        <TextField value={gameCode} onChange={updateUserData('gameCode')} />
        <Typography variant="subtitle1">Your name</Typography>
        <TextField value={playerName} onChange={updateUserData('playerName')} />
        <Button variant="contained" color="primary" onClick={joinNewGame}>Join</Button>
        <Button variant="contained" color="secondary" onClick={optionBack}>Back</Button>
      </IntroOptions>
    </IntroPaper>

  )
  const RenderSelectedOption = () => {
    // This conditionals seems to be causing an out-focus issue on inputs
    if(selectedOption===START) return <NewGameOption />
    if(selectedOption===JOIN) return <JoinGameOption />
    return <DefaultOption />
  }

  const Title = () => (
    <IntroPaper>
      <Typography variant="h1">Ships at war</Typography>
      <Typography variant="h2">Wellcome</Typography>
    </IntroPaper>
  )

  return (
    <div>
      <Title />
      <RenderSelectedOption />
    </div>
  )
}

export default IntroScreen
