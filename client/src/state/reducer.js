// https://medium.com/simply/state-management-with-react-hooks-and-context-api-at-10-lines-of-code-baf6be8302c

export const SET_USER_GAME_DATA = 'SET_USER_GAME_DATA'

export const initialState = {
  gameData: {}
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER_GAME_DATA:
      return {
        ...state,
        gameData: { ...state.gameData, ...action.gameData }
      }
    default:
      return state;
  }
}

export default reducer
