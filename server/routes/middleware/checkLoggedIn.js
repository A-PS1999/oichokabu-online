module.exports = (request, response, next) => {
	if (request.isAuthenticated()) {
		response.locals.user = request.user;
		next();
	} else {
		response.status(401).json({
			errorMsg: "You are not authenticated. Please log in."
		});
	}
	
	return null;
};