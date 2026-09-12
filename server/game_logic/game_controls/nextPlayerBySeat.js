module.exports = (Game, seat) => {
    const higherSeats = Game.players.filter(player => player.seat > seat);
    const pool = higherSeats.length > 0 ? higherSeats : Game.players;
    return pool.reduce((closest, player) => (player.seat < closest.seat ? player : closest));
}
