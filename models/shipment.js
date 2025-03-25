const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const shipmentSchema = new Schema({

    shipment_number: {
        type: String,
        required: true
    },

    shipment_status: {
        type: String,
        required: true
    },
    truck_status: {
        type: String,
    },

    dock_number: {
        type: String,
    },
    truckTypeId: {
        type: Schema.Types.ObjectId,
        ref: "TruckType",
    },
    plantId: {
        type: Schema.Types.ObjectId,
        ref: "Plant",
    },
    destination_pin_code: {
        type: String,
    },
    destination_city: {
        type: String,
        required: true
    },
    destination_state: {
        type: String,
    },
    destination_country: {
        type: String,
    },
    expected_arrival_date: {
        type: Date,
    },
    actual_arrival_date: {
        type: Date,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    updatedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    }


});

module.exports = mongoose.model("Shipments", shipmentSchema);
