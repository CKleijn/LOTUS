const mongoose = require("./../../database/dbconnection");

const tokenSchema = new mongoose.Schema({
    emailAddress: {
        type: String,
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 60 * 60 * 24 * 3,
    },
});

module.exports = mongoose.model("Token", tokenSchema);
