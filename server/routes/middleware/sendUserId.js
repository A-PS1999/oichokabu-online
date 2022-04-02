module.exports = (_, response) => {
    const id = response.locals.user.id;
    const host = response.locals.player;
    response.json({ id, host });
    return null;
};