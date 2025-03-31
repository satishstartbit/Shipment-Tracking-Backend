const Shipments = require("../models/shipment")
const TruckTypes = require("../models/truckType")
const TransportCompany = require('../models/transportCompany');

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
            createdBy: userid,
            updatedBy: userid,
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

const getAllShipments = async (req, res, next) => {
    try {
        // Retrieve all shipments and populate related fields
        const shipments = await Shipments.find()
            .populate("userid", "name email") // Populating the User with only name and email
            .populate("plantId", "name location") // Populating the Plant with name and location
            .populate("truckTypeId", "type capacity") // Populating the TruckType with type and capacity
            .exec();

        // If no shipments are found, return a 404 response
        if (shipments.length === 0) {
            return res.status(404).json({ message: "No shipments found" });
        }

        // Return the populated shipment details
        res.status(200).json({ shipments });
    } catch (error) {
        next(error); // Pass the error to the error-handling middleware
    }
};




const assignShipmentToCompany = async (req, res, next) => {
    const { shipmentId, companyId } = req.body; // shipmentId and companyId passed in the request body

    try {
        // Find the shipment by its ID
        const shipment = await Shipments.findById(shipmentId);

        // If shipment doesn't exist, return a 404 response
        if (!shipment) {
            return res.status(404).json({ message: "Shipment not found" });
        }

        // Find the company by its ID (assuming you have a Company model)
        const company = await TransportCompany.findById(companyId);

        // If company doesn't exist, return a 404 response
        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }

        // Assign the shipment to the company (assuming the Company model has a `shipments` field)
        shipment.companyId = companyId;

        // Save the updated shipment
        await shipment.save();

        // Return the updated shipment with company details
        res.status(200).json({
            message: "Shipment assigned to company successfully",
            shipment,
        });
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



const getAllTruckTypes = async (req, res, next) => {
    try {
        // Retrieve all truck types from the database
        const truckTypes = await TruckTypes.find();

        // If no truck types are found, return a 404 response
        if (truckTypes.length === 0) {
            return res.status(404).json({ message: "No truck types found" });
        }

        // Return the list of truck types
        res.status(200).json({ truckTypes });
    } catch (error) {
        next(error); // Pass the error to the error-handling middleware
    }
};


module.exports = { createShipment, createTruckType, getShipmentDetails, getAllShipments, getAllTruckTypes, assignShipmentToCompany };
