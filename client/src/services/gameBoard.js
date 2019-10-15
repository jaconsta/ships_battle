import axios from 'axios'

import { serverUrl } from 'constants.js'

const gameboardRoute = 'game/'

const gameUrl = () => `${serverUrl}${gameboardRoute}`

const getRequestHeaders = token => ({ headers: { Authorization: token } })

export const createNewGameSession = userData => {
  return axios.post(`${gameUrl()}new/`, userData)
}
export const joinNewGameSession = userData => {
  return axios.post(`${gameUrl()}new/join/`, userData)
}
export const getGameBoardStatus = token => {
  return axios.get(`${gameUrl()}`, getRequestHeaders(token))
}
export const submitPlayerGameShips = (ships, token) => {
  return axios.post(`${gameUrl()}new/ships/`, { ships }, getRequestHeaders(token))
}
export const submitPlayerTurnMove = (move, token) => {
  return axios.post(`${gameUrl()}turn/`, { move }, getRequestHeaders(token))
}
