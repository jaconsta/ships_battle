import axios from 'axios'

import { serverUrl } from 'constants.js'

const gameboardRoute = 'game/'

export const getGameBoard = async () => {
  return axios.get(`${serverUrl}${gameboardRoute}`)
}
