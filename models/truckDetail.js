const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const truckDetailSchema = new Schema({
    driver_name: {
        type: String,
        required: true
    },
    mobile_number: {
        type: String,
        required: true
    },
    truck_number: {
        type: String,
        required: true
    },
    shipmentId: {
        type: Schema.Types.ObjectId,
        ref: "Shipments",
        required: true
    },
    created_by: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    updated_by: {
        type: Schema.Types.ObjectId,
        ref: "User",
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

module.exports = mongoose.model("TruckDetails", truckDetailSchema);