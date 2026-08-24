import { configureStore } from '@reduxjs/toolkit';
import { pregameSlice, pregameStateReset, handleStartGame } from './pregameSlice';

describe('pregame slice', () => {
  it('resets stale pregame state back to defaults', () => {
    const store = configureStore({
      reducer: { pregame: pregameSlice.reducer }
    });

    store.dispatch({
      type: 'pregame/fetchPlayerInfo/fulfilled',
      payload: { id: 1, player_cap: 2 }
    });
    store.dispatch({
      type: 'pregame/fetchPlayerStatuses/fulfilled',
      payload: [{ id: 1, ready: true }]
    });
    store.dispatch({ type: pregameStateReset.type });

    expect(store.getState().pregame).toMatchObject({
      ready: false,
      playerInfo: [],
      playerStatuses: [],
      gameStatus: null,
      isFetching: false,
      isError: false,
      errorMessage: '',
    });
  });

  it('keeps the rejected message from the thunk payload instead of hardcoding a host-only error', () => {
    const store = configureStore({
      reducer: { pregame: pregameSlice.reducer }
    });

    store.dispatch({
      type: handleStartGame.rejected.type,
      payload: 'Server refused to start the game.'
    });

    expect(store.getState().pregame.isFetching).toBe(false);
    expect(store.getState().pregame.isError).toBe(true);
    expect(store.getState().pregame.errorMessage).toBe('Server refused to start the game.');
  });
});
