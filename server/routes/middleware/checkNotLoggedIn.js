module.exports = (request, response, next) => {
    if (!request.isAuthenticated()) {
        next();
    } else {
        response.sendStatus(404);
    }
    return null;
};