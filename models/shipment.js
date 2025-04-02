const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const shipmentSchema = new Schema({

    shipment_number: {
        type: String,
        unique: true
    },
    shipment_status: {
        type: String,
        required: true
    },
    companyId: {
        type: Schema.Types.ObjectId,
        ref: "TransportCompany",
    },
    dock_number: {
        type: String,
    },
    truckTypeId: {
        type: Schema.Types.ObjectId,
        ref: "TruckTypes",
    },
    plantId: {
        type: Schema.Types.ObjectId,
        ref: "Plants",
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
    mobile_number: {
        type: String,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "Users",
    },
    updatedBy: {
        type: Schema.Types.ObjectId,
        ref: "Users",
    },
    TruckId: {
        type: Schema.Types.ObjectId,
        ref: "TruckDetails"
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




// Pre-save hook to generate unique shipment_number using MongoDB's ObjectId
shipmentSchema.pre("save", function (next) {
    const shipment = this;

    // Get the MongoDB ObjectId and convert it to a string
    const objectId = shipment._id.toString();

    // Generate the shipment number using ObjectId (e.g., SHIP_NUM-000001, SHIP_NUM-000002)
    shipment.shipment_number = `SHIPNUM-${objectId.substring(objectId.length - 6)}`;

    next();
});

module.exports = mongoose.model("Shipments", shipmentSchema);
