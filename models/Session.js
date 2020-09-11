const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    session: String
}, {
    timestamps: true
});

const Session = mongoose.model('Session', sessionSchema);
module.exports = Session;