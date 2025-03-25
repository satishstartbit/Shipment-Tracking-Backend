const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const transportComapnySchema = new Schema({
    company_name: {
        type: String,
        required: true
    },
    company_address: {
        type: String,
        required: true
    },
    company_contact: {
        type: String,
        required: true
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