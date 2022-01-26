import { socket } from '../../services/socket';
import { fetchGames } from '../lobbySlice';

export const LobbyMiddleware = (store) => {
    
    socket.on('lobby:create-game', () => {
        console.log('Game created; emit detected')
        store.dispatch(fetchGames())
    })

    return (next) => (action) => {
        next(action);
    }
}