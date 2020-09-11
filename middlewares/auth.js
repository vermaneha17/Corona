const createError = require('http-errors');

const User = require('../models/User');
const Session = require('../models/Session');

const auth = async (req, res, next) => {
    try {
        if (!req.header('Authorization'))
            return next(createError(423, messages.UNAUTHORIZED));
        const session = await Session.findOne({ session: req.header('Authorization') });
        if (!session)
            return next(createError(401, messages.NOT_AUTHORIZED));
        const user = await User.findById(session.userId);
        if (!user) {
            return next(createError(401, messages.NOT_AUTHORIZED));
        }
        req.session = session;
        req.loggedInUser = user;
        next();
    } catch (err) {
        return next(err);
    }
}

module.exports = auth;