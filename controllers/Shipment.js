const Shipments = require("../models/shipment")
const TruckTypes = require("../models/truckType")

const createShipment = async (req, res, next) => {
    const { shipment_status, truck_status,
        destination_pin_code, destination_city, destination_state,
        destination_country, expected_arrival_date, actual_arrival_date } = req.body;

    try {
        const shipment = new Shipments({
            shipment_status,
            truck_status,
            truckTypeId: "67ea39e273dd50d57514b7a7",
            plantId: "67e53f04a272c03c7431b952",
            destination_pin_code,
            destination_city,
            destination_state,
            destination_country,
            expected_arrival_date,
            actual_arrival_date,
        });

        // Save the shipment document
        await shipment.save();
        res.status(200).json({ shipment });
    } catch (error) {
        next(error);
    }
};


const createTruckType = async (req, res, next) => {
    const { name, description, } = req.body;
    try {
        const truck = new TruckTypes({
            name,
            description,
        });

        // Save the truck type
        await truck.save();
        res.status(200).json({ truck });
    } catch (error) {
        next(error);
    }
};

module.exports = { createShipment, createTruckType };
