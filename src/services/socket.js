import io from 'socket.io-client';

export default let socket = io(window.location.origin);