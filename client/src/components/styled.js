import styled, { keyframes, css } from 'styled-components'

import Paper from '@material-ui/core/Paper'

export const IntroPaper = styled(Paper)`
  width: 800px;
  margin: 40px auto;
`

export const IntroOptions = styled.div`
  display: flex;
  flex-flow: column;
  h6 {
    margin: 10px 0;
  }
  span {
    margin: 20px 0;
  }
`

export const GameMap = styled.div`
  width: 48.5%;
  margin: auto;
  border: 30px solid #616161;
`

export const MapRow = styled.div`
  display: flex;
`

const seaLevelAnimation = keyframes`
  from {
    background-color: #48a999;
  }

  to {
    background-color: #439889;
  }
`

export const MapCell = styled.span`
  color: #ffffff;
  padding: 7px 10px;
  border: 1px solid #48a999;
  font-size: .7em;
`

export const SeaCell = styled(MapCell)`
  background-color: #48a999;
  color: #ffffff;
  animation: ${seaLevelAnimation}  2s linear infinite alternate;
  &:hover {
    border: 1px solid #fff;
  }
  ${props => props.active && css `
    background-color: #c0ca33;
    animation: none;
    border: 1px solid #c0ca33;
  `}
  ${props => props.isShipCell && css `
    background-color: red;
    animation: none;
    border: 1px solid red;
  `}
`

export const ShipCell = styled(MapCell)`
  background-color: #a8b545;
  color: #ffffff;
  border: 1px solid #ffebee;
  &:hover {
    border: 1px solid #fff;
  }
`

export const ShipHitCell = styled(MapCell)`
  background-color: #ef5350;
  color: #ffffff;
  border: 1px solid #eeffff;
  &:hover {
    border: 1px solid #fff;
  }
`

export const MissedShotCell = styled(MapCell)`
  background-color: #bbdefb;
  color: #ffffff;
  border: 1px solid #eeffff;
  &:hover {
    border: 1px solid #fff;
  }
`
