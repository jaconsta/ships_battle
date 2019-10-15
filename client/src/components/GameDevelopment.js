import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import _ from 'lodash'

import Title from './Title'
import GameMapCell from './GameMapCell'
import { GameMap, MapRow } from './styled'

import { useStateValue } from 'state'
import { SET_USER_GAME_DATA } from 'state/reducer'
import useInterval from 'hooks/useInterval'
import { getGameBoardStatus, submitPlayerTurnMove } from 'services/gameBoard'

const gameMap = [
  ['*', '*'],
  ['*', 's'],
]

const OpponentGameMap = props => {
  const {
    opponent = {},
    hoverCell = [null, null],
    onHover,
    onClick,
  } = props

  if (!opponent.map) return <div>Waiting for player to submit ships</div>

  return (
    <GameMap>
      { (opponent.map || gameMap).map( (row, x) => (
          <MapRow key={x}>
            {
              row.map((cell, y) => (
                <GameMapCell
                  key={y}
                  cellType={_.isEqual([x, y], hoverCell) ? 's' : cell}
                  onHover={onHover(x, y)}
                  onClickSea={onClick(x, y)}
                />
              ))
            }
          </MapRow>
        ))
      }
    </GameMap>
  )
}

OpponentGameMap.propTypes = {
  opponent: PropTypes.object,
  hoverCell: PropTypes.array,
  onHover: PropTypes.func,
  onClick: PropTypes.func,
}

const GameDevelopment = props => {
  const [ { gameData }, dispatch] = useStateValue()

  useEffect(() => { if(!gameData.token) props.history.push('/') })
  useInterval(async () => {
    const { data } = await getGameBoardStatus(gameData.token)

    dispatch({ type: SET_USER_GAME_DATA, gameData: data })
  }, 5000)

  /* Target Opponent moves */
  const myTurn = gameData.turn === gameData.role
  const [ opponentHover, setOpponentHoverHoverMap ] = useState([null, null])
  const highlightOpponentTarget = (x, y) => () => myTurn ? setOpponentHoverHoverMap([x, y]) : null
  const shootOponent = (x, y) => async () => {
    if (!myTurn) return
    const { data } = await submitPlayerTurnMove([x, y], gameData.token)
    dispatch({ type: SET_USER_GAME_DATA, gameData: data })
  }

  return (
    <div>
      <Title />
      <h3>Code: {gameData.code} </h3>
      <h4>{myTurn ? 'My' : 'Opponents'} Turn</h4>
      <div>
        <h4>Your map</h4>
        <GameMap>
          { (gameData.map || gameMap).map( (row, x) => (
              <MapRow key={x}>
                {
                  row.map((cell, y) => (
                    <GameMapCell
                      key={y}
                      cellType={cell}
                      onHover={()=> {} /*highlightShip(x, y)*/}
                      onClickSea={()=> {} /*placeShip(x, y) */}
                    />
                  ))
                }
              </MapRow>
            ))
          }
        </GameMap>
      </div>
      <div>
        <h4>Opponents map</h4>
        <OpponentGameMap
          opponent={gameData.oponent}
          hooverCell={opponentHover}
          onHover={highlightOpponentTarget}
          onClick={shootOponent}
        />
      </div>
    </div>
  )
}

export default GameDevelopment
