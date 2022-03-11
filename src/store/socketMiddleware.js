
import { socket } from '../services';
import { setCardSelection, setHasClicked, gameSelector } from '../store/gameSlice';

//this can keep the listoner reference for turning off later
const observers = {};


export const socketMiddleware = (store) => {
  return (dispatch) => {
    socket.on('', () => {
      dispatch({ type: 'test' })
    });
    return (action) => {
      if (action.type !== 'socket') {
        dispatch(action);
        return;
      }
      if (action.payload.type = 'join-game') {
        const handler = (data) => {
            dispatch({ type: 'setCard', payload: data})
            if (data.cardId === id) {
                setIsHidden(false);
                setIsDisabled(true);
                dispatch(setCardSelection( data ));
            }
        }
        const gameId = `game:${action.payload.game_id}:pickdealer-card-selected`
        if (observers[gameId]) {
          socket.off(gameId, observers[gameId])  
        }
        observers[gameId] = handler
        socket.on(gameId, handler)
      }
      if (action.payload.type = 'leave-game') {
        const gameId = `game:${action.payload.game_id}:pickdealer-card-selected`;
        socket.off(gameId, observers[gameId]);
      }


      console.log('dispatching', action);
      const result = dispatch(action);
      console.log('next state', store.getState());
      return result;
    }
  }
}
