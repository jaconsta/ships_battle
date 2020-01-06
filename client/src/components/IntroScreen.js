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

const Title = () => (
  <IntroPaper>
    <Typography variant="h1">Ships at war</Typography>
    <Typography variant="h2">Wellcome</Typography>
  </IntroPaper>
)

const DefaultOption = props => (
  <IntroPaper>
    <IntroOptions>
      <Typography variant="subtitle1">Select one</Typography>
      <Button variant="contained" color="primary" onClick={props.selectOption(START)}>Create new game</Button>
      <Button variant="contained" color="secondary" onClick={props.selectOption(JOIN)}>Join one</Button>
    </IntroOptions>
  </IntroPaper>
)
const NewGameOption = props => (
  <IntroPaper>
    <IntroOptions>
      <Typography variant="subtitle1">Your name</Typography>
      <TextField value={props.playerName} onChange={props.updateUserData('playerName')} />
      <Button variant="contained" color="primary" onClick={props.createNewGame}>Create</Button>
      <Button variant="contained" color="secondary" onClick={props.optionBack}>Back</Button>
    </IntroOptions>
  </IntroPaper>
)
const JoinGameOption = props => (
  <IntroPaper>
    <IntroOptions>
      <Typography variant="subtitle1">Room code</Typography>
      <TextField value={props.gameCode} onChange={props.updateUserData('gameCode')} />
      <Typography variant="subtitle1">Your name</Typography>
      <TextField value={props.playerName} onChange={props.updateUserData('playerName')} />
      <Button variant="contained" color="primary" onClick={props.joinNewGame}>Join</Button>
      <Button variant="contained" color="secondary" onClick={props.optionBack}>Back</Button>
    </IntroOptions>
  </IntroPaper>
)

const RenderSelectedOption = props => {
  const {
    selectOption,
    selectedOption,
    gameCode,
    updateUserData,
    playerName,
    createNewGame,
    joinNewGame,
    optionBack,
  } = props

  if(selectedOption===START) return (
    <NewGameOption
      gameCode={gameCode}
      playerName={playerName}
      updateUserData={updateUserData}
      createNewGame={createNewGame}
      optionBack={optionBack}
    />
  )
  if(selectedOption===JOIN) return (
    <JoinGameOption
      gIntroPaperameCode={gameCode}
      updateUserData={updateUserData}
      playerName={playerName}
      joinNewGame={joinNewGame}
      optionBack={optionBack}
    />
  )
  return <DefaultOption selectOption={selectOption}/>
}


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

  const getNewGameFieldProps = () => ({
    selectOption,
    selectedOption,
    gameCode,
    updateUserData,
    playerName,
    createNewGame,
    joinNewGame,
    optionBack,
  })

  return (
    <div>
      <Title />
      <RenderSelectedOption {...getNewGameFieldProps()} />
    </div>
  )
}

export default IntroScreen
