const Shipments = require("../models/shipment")
const TruckTypes = require("../models/truckType")

const createShipment = async (req, res, next) => {
    const { shipment_status, truck_status,
        destination_pin_code, destination_city, destination_state, userid,
        destination_country, expected_arrival_date, actual_arrival_date } = req.body;

    try {
        const shipment = new Shipments({
            shipment_status,
            truck_status,
            truckTypeId: "67ea39e273dd50d57514b7a7",
            plantId: "67e53f04a272c03c7431b952",
            userid,
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


const getShipmentDetails = async (req, res, next) => {
    const { shipmentId } = req.params; // Assuming the shipment ID is passed in the URL

    try {
        // Find the shipment by ID and populate related fields
        const shipment = await Shipments.findById(shipmentId)
            .populate("userid", "name email") // Populating the User with only name and email
            .populate("plantId", "name location") // Populating the Plant with name and location
            .populate("truckTypeId", "type capacity") // Populating the TruckType with type and capacity
            .exec();

        // If the shipment is not found, return a 404 response
        if (!shipment) {
            return res.status(404).json({ message: "Shipment not found" });
        }

        // Return the populated shipment details
        res.status(200).json({ shipment });
    } catch (error) {
        next(error); // Pass the error to the error-handling middleware
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

module.exports = { createShipment, createTruckType , getShipmentDetails};
