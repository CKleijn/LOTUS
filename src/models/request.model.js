const mongoose = require("../../database/dbconnection");
const ObjectId = mongoose.Schema.Types.ObjectId;
// Create requestSchema with all fields
const requestSchema = new mongoose.Schema({
    userId: {
        type: ObjectId,
    },
    requestDate: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ["Afgewezen", "In behandeling", "Goedgekeurd"],
        default: "In behandeling",
    },
    assignmentId: {
        type: ObjectId,
    }
});
// Create a Request model
module.exports = mongoose.model("Request", requestSchema);
