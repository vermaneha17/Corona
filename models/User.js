const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true
});

userSchema.pre('save', async function (next) {
    if (user.isModified('password')) {
        let salt = await bcrypt.genSalt(parseInt(process.env.PASSWORD_SALT_ROUNDS));
        user.password = await bcrypt.hash(user.password, salt);
    }
    next();
});



userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    return userObject;
}

userSchema.methods.generateAuthToken = function () {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, 'COVID19');
    return token;
};

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error(messages.INCORRECT_EMAIL_OR_PASSWORD);
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error(messages.INCORRECT_EMAIL_OR_PASSWORD);
    }
    return user;
};

const User = mongoose.model('User', userSchema);
module.exports = User;