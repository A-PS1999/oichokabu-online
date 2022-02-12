module.exports = (_, response) => {
    const id = response.locals.user.id;
    response.json({ id })
    return null;
};