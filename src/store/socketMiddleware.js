
import { socket } from '../services';
import { setCardSelection, setHasClicked, gameSelector } from '../store/gameSlice';

//this can keep the listoner reference for turning off later
const observers = {};


export const socketMiddleware = (store) => {
  // as a node, dispatch is usually called next because it isn't quite dispatch, but i think this will help clarify here
  return (dispatch) => {
    return (action) => {
      // if this is an action of type 'socket' we will handle it here
      if (action.type === 'socket') {
        //logic for joining a game
        if (action.payload.type = 'join-game') {
          // handler is referenced here like this because you need to also pass it to the socket.off function call
          const handler = (data) => {
            // this should be able to be used to have the reducer tell you more infomration
            dispatch(setCardSelection( data ));
          }
          const gameId = `game:${action.payload.game_id}:pickdealer-card-selected`
          // if you happen to have an observer already under this game id, this will remove the old one before adding the new one
          if (observers[gameId]) {
            socket.off(gameId, observers[gameId])
          }
          // set the reference to the function for later use
          observers[gameId] = handler
          // listen to gameId
          socket.on(gameId, handler)
        }
        // if we are calling a socket payload type of 'leave game' it will leave, this should be on ending a game and joining a new one
        if (action.payload.type = 'leave-game') {
          const gameId = `game:${action.payload.game_id}:pickdealer-card-selected`;
          socket.off(gameId, observers[gameId]);

          // probably a good place to set an action to clean up the game state
          // dispatch(cleanUpGameActionGenerator);
        }
      }
      // afterwords, all actions get forwarded here through the system
      dispatch(action);
    }
  }
}
