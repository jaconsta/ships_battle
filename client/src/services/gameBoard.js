import axios from 'axios'

import { serverUrl } from 'constants.js'

const gameboardRoute = 'game/'

export const getGameBoard = async () => {
  return axios.get(`${serverUrl}${gameboardRoute}`)
}

export const submitPlayerGameShips = async ships => {
  return axios.post(`${serverUrl}${gameboardRoute}ships/`, { ships })
}
