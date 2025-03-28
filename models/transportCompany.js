const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const transportComapnySchema = new Schema({
    company_name: {
        type: String,
        required: true,
        unique: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
    },
    country: {
        type: String,
    },
    munshiId: {
        type: Schema.Types.ObjectId,
        ref: "Users",
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

module.exports = mongoose.model("TransportCompany", transportComapnySchema);