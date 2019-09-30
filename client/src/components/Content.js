import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import _ from 'lodash'

import CircularProgress from '@material-ui/core/CircularProgress'

import Title from './Title'
import { GameMap, MapRow, SeaCell, ShipCell, MissedShotCell, ShipHitCell } from './styled'

import { getGameBoard } from 'services/gameBoard'

const PaintMapCells = props => {
  const { cellType, onClickSea } = props

  if ( cellType === 's') return <ShipCell>*</ShipCell>
  if ( cellType === 'h') return <ShipHitCell>*</ShipHitCell>
  if ( cellType === 'm') return <MissedShotCell>*</MissedShotCell>
  return <SeaCell onClick={onClickSea}>*</SeaCell>
}

PaintMapCells.propTypes = {
  cellType: PropTypes.string,
  onClickSea: PropTypes.func,
}

PaintMapCells.defaultProps = {
  onClickSea: () => {},
}

const Content = () => {
  const [ map, setMap ] = useState([])
  const [ loadingMap, setLoadingMap ] = useState(true);
  const [ errorLoading, setErrorLoading ] = useState(false);

  useEffect(() => {
    getGameBoard()
      .then(({ data }) => { setMap(data.map); setLoadingMap(false)})
      .catch(err => { console.log('eee', err); setErrorLoading(true) })
  }, [_.isEmpty(map)])

  if (errorLoading) return <h3>Error loading the map</h3>
  if (loadingMap) return <div><h3>loading map</h3><CircularProgress /></div>

  return (
    <div>
      <Title />
        <GameMap>
          {
            map.map( row => (
              <MapRow className="grid-container">
                { row.map( cell => <PaintMapCells cellType={cell} />)}
              </MapRow>
            ))
          }
        </GameMap>
    </div>
  )
}

export default Content
