const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const truckTypeSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    truck_code: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("TruckTypes", truckTypeSchema);
