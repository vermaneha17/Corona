require('mongoose');
const createError = require('http-errors');

const User = require('../models/User');
const Session = require('../models/Session');


module.exports = {
    login: async function (req, res, next) {
        try {
            let user = await User.findByCredentials(req.body.email, req.body.password);
            if (!user)
                return next(createError(401, messages.NOT_FOUND));
            const session = new Session({ userId: user.id, session: await user.generateAuthToken() });
            await session.save();
            if (!session)
                return next(createError(426, messages.NOT_FOUND));
            res.responseHandler({ user, session: session.session }, messages.SUCCESSFUL_LOGIN);
        } catch (err) {
            return next(createError(426, err.message));
        }
    },

    signup: async function (req, res, next) {
        try {
            let emailCount = await User.countDocuments({ email: req.body.email });
            if (emailCount) {
                return next(createError(426, messages.EMAIL_NOT_UNIQUE));
            }
            let user = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            });
            await user.save();
            console.log(user);

            if (!user)
                return next(createError(426, messages.NOT_FOUND));
            res.responseHandler('Successfully registered.');
        } catch (err) {
            return next(createError(426, err.message));
        }
    },

    logout: async function (req, res, next) {
        try {
            let doc = await Session.findByIdAndDelete(req.session.id);
            if (!doc)
                return next(createError(423, messages.DELETE_FAILURE));
            res.responseHandler(messages.LOGOUT_SUCCESS);
        } catch (err) {
            return next(createError(426, err.message));
        }
    }
};