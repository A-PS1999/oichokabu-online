const io = require("socket.io-client");

export const socket = io(process.env.API_ORIGIN, {
    withCredentials: true,
    autoConnect: true
})