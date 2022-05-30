// connections/fast.js
const mongoose = require("mongoose");

mongoose.createConnection(process.env.MONGODB_URI);

module.exports = mongoose;
