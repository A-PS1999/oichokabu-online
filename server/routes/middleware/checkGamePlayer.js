const { Auth } = require("../../db/api");

module.exports = (request, response, next) => {
    return Auth.findPlayer(request.params.gameId, request.user.id)
    .then(result => {
        if (result) {
            response.locals.player = result;
            next();
            return result;
        } else {
            return response.status(401).json({ error: "NOT_IN_GAME" });
        }
    })
    .catch(error => {
        return response.json({ error });
    });
}