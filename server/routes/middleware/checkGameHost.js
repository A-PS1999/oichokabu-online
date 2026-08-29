module.exports = (_, response, next) => {
	return response.locals.player.getGame().then(game => {
		if (response.locals.player.host && 'closed' !== game.status) {
			return next();
		} else {
			return response.status(401).json({
				errorMsg: "You are not the host, or the game has ended."
			});
		}
	});
};