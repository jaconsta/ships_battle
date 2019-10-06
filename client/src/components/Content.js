import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
// import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import _ from 'lodash'

import CircularProgress from '@material-ui/core/CircularProgress'
import Button from '@material-ui/core/Button'

import Title from './Title'
import { GameMap, MapRow, SeaCell, ShipCell, MissedShotCell, ShipHitCell } from './styled'

import { getGameBoard, submitPlayerGameShips } from 'services/gameBoard'

// const convertToHext = num => (num >>> 0).toString(16)
const defaultShipSize = 2
const shipSizes = {
  0: { size: 2, name: '2 Yatch' },
  1: { size: 3, name: '3-A ship' },
  [defaultShipSize]: { size: 3, name: '3-B ship' },
  3: { size: 4, name: '4 Battlecruiser' },
  4: { size: 5, name: '5 Air carrier' },
}

const getSelectShipButtonColor = (shipId, choosingId, placedShipData) => {
  if (_.hasIn(placedShipData, shipId)) return 'secondary'
  if (shipId === choosingId) return 'primary'
  return 'default'
}

const PlaceShips = props => (
  <div>
    {
      _.map(shipSizes, (shipInfo, shipId) => <Button key={shipId} onClick={props.chooseShip(shipId)} color={getSelectShipButtonColor(shipId, props.currentShipSelection, props.placedShipData)}>{shipInfo.name}</Button>)
    }
  </div>
)

PlaceShips.propTypes = {
  chooseShip: PropTypes.func,
  currentShipSelection: PropTypes.string,
  placedShipData: PropTypes.object,
}


const PaintMapCells = props => {
  const { cellType, onClickSea, onHover, isShip, isShipCell } = props

  if ( cellType === 's') return <ShipCell>*</ShipCell>
  if ( cellType === 'h') return <ShipHitCell>*</ShipHitCell>
  if ( cellType === 'm') return <MissedShotCell>*</MissedShotCell>
  return <SeaCell onMouseEnter={onHover} onClick={onClickSea} active={isShip} isShipCell={isShipCell}>*</SeaCell>
}

PaintMapCells.propTypes = {
  cellType: PropTypes.string,
  onClickSea: PropTypes.func,
  onHover: PropTypes.func,
  isShipCell: PropTypes.bool,
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
  const [ selectedShipSize, setSelectedShipSize ] = useState(`${defaultShipSize}`)
  const [ placedShips, setPlacedShips ] = useState([])
  const [ placedShipData, setPlacedShipData ] = useState({})

  const chooseShipSize = shipId => () => setSelectedShipSize(shipId)
  const highlightShip = (x, y) => () => setSelectedCell([x, y])
  const isShip = (row, column) => {
    const [ox, oy] = shipRotation === 'vertical' ? [1, 0] : [0, 1]

    return _.chain(shipSizes[selectedShipSize].size)
      .range()
      .map(index => _.isEqual([row-(index*ox), column-(index*oy)], selectedCell))
      .includes(true)
      .value()
  }

  const rotatePlaceShip = () => setShipRotation(shipRotation === 'vertical' ? 'horizontal' : 'vertical')
  const placeShip = (row, column) => () => {
    const [ox, oy] = shipRotation === 'vertical' ? [1, 0] : [0, 1]
    const shipCells = _.map(_.range(shipSizes[selectedShipSize].size), (index) => ({ x: row+(index*ox), y: column+(index*oy) }))

    const cellsOutside = _.chain(shipCells).map(_.values).flatten().some(x => x > 15 || x < 0).value()
    if(cellsOutside) return

    const shipPlaces = _.get(placedShipData, selectedShipSize)
    const [ sx, sy ] = shipPlaces ? shipPlaces.orientation  === 'vertical' ? [1, 0] : [0, 1]  : [0, 0]
    const currentPlacedShip = shipPlaces ? _.map(_.range(shipSizes[selectedShipSize].size), (index) => ({ x: shipPlaces.x+(index*sx), y: shipPlaces.y+(index*sy) })) : []
    const cleanPreviousPlacedShip = _.xorWith(
      currentPlacedShip,
      placedShips,
      _.isEqual,
    )

    const overlapsShips = !_.chain(shipCells)
      .map(shipPos => _.find(placedShips, shipPos))
      .compact()
      .isEmpty()
      .value()
    if (overlapsShips) return

    setPlacedShips([...shipCells, ...cleanPreviousPlacedShip])
    setPlacedShipData({ ...placedShipData, [selectedShipSize]: { x: row, y: column, orientation: shipRotation } })
  }
  const hasPlacedAllShips = () => _.size(placedShipData) < 5

  const isMapEmpty = _.isEmpty(map)
  useEffect(() => {
    getGameBoard()
      .then(({ data }) => { setMap(data.map); setLoadingMap(false)})
      .catch(err => { console.log('eee', err); setErrorLoading(true) })
  }, [isMapEmpty])

  if (errorLoading) return <h3>Error loading the map</h3>
  if (loadingMap) return <div><h3>loading map</h3><CircularProgress /></div>

  const submitPlacedShips = async () => {
    try {
      const { data } = await submitPlayerGameShips(placedShipData)
      console.log(data)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div>
      <Title />
      <GameMap>
        {
          map.map( (row, x) => (
            <MapRow key={x} className="grid-container">
              {
                row.map( (cell, y) => (
                  <PaintMapCells
                    key={y}
                    cellType={cell}
                    onHover={highlightShip(x, y)}
                    isShip={isShip(x, y)}
                    onClickSea={placeShip(x, y)}
                    isShipCell={_.find(placedShips, { x, y }) != null}
                  />
                ))
              }
            </MapRow>
          ))
        }
      </GameMap>
      <PlaceShips chooseShip={chooseShipSize} currentShipSelection={selectedShipSize} placedShipData={placedShipData} />
      <Button onClick={rotatePlaceShip}>Rotate</Button>
      <Button disabled={hasPlacedAllShips()} onClick={submitPlacedShips}>Continue</Button>
    </div>
  )
}

export default Content
