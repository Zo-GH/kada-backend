const requestMiddleware = (req, res, next, handler, validation = null) => {
    if (validation) {
        const { error } = validation.validate(req.body);

        if (error != null) {
            return next(error);
        }

        try {
            handler(req, res, next);
        }

        catch (err) {
            next(err)
        }
    }
}

module.exports = requestMiddleware