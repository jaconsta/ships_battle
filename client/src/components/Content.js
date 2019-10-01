import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
// import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import _ from 'lodash'

import CircularProgress from '@material-ui/core/CircularProgress'

import Title from './Title'
import { GameMap, MapRow, SeaCell, ShipCell, MissedShotCell, ShipHitCell } from './styled'

import { getGameBoard } from 'services/gameBoard'

const convertToHext = num => (num >>> 0).toString(16)

const PaintMapCells = props => {
  const { cellType, onClickSea, onHover, isShip } = props

  if ( cellType === 's') return <ShipCell>*</ShipCell>
  if ( cellType === 'h') return <ShipHitCell>*</ShipHitCell>
  if ( cellType === 'm') return <MissedShotCell>*</MissedShotCell>
  return <SeaCell onMouseEnter={onHover} onClick={onClickSea} active={isShip}>*</SeaCell>
}

PaintMapCells.propTypes = {
  cellType: PropTypes.string,
  onClickSea: PropTypes.func,
  onHover: PropTypes.func,
}

PaintMapCells.defaultProps = {
  onClickSea: () => {},
}

const Content = () => {
  const [ map, setMap ] = useState([])
  const [ loadingMap, setLoadingMap ] = useState(true);
  const [ errorLoading, setErrorLoading ] = useState(false);
  const [ selectedCell, setSelectedCell] = useState([null, null]);
  const [ shipRotation, setShipRotation ] = useState('vertical')
  const [ selectedShipSize, setSelectedShipSize ] = useState(2)

  const highlightShip = (x, y) => () => setSelectedCell([x, y])
  const isShip = (row, column) => {
    // const range = _.range(selectedShipSize)
    const [ox, oy] = shipRotation === 'vertical' ? [1, 0] : [0, 1]

    return _.chain(selectedShipSize)
      .range()
      .map(index => _.isEqual([row-(index*ox), column-(index*oy)], selectedCell))
      .includes(true)
      .value()
  }

  const isMapEmpty = _.isEmpty(map)
  useEffect(() => {
    getGameBoard()
      .then(({ data }) => { setMap(data.map); setLoadingMap(false)})
      .catch(err => { console.log('eee', err); setErrorLoading(true) })
  }, [isMapEmpty])

  if (errorLoading) return <h3>Error loading the map</h3>
  if (loadingMap) return <div><h3>loading map</h3><CircularProgress /></div>

  return (
    <div>
      <Title />
        <GameMap>
          {
            map.map( (row, x) => (
              <MapRow key={x} className="grid-container">
                { row.map( (cell, y) => <PaintMapCells key={y} cellType={cell} onHover={highlightShip(x, y)} isShip={isShip(x, y)} />)}
              </MapRow>
            ))
          }
        </GameMap>
    </div>
  )
}

export default Content
