import React from 'react'
import PropTypes from 'prop-types'

import { SeaCell, ShipCell, MissedShotCell, ShipHitCell } from './styled'

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
  isShipCell: false,
  isShip: false,
}

export default PaintMapCells
