const TruckDetails = require("../models/truckDetail");

const AddTruckDetails = async (req, res, next) => {
    try {
        const { driver_name, mobile_number, truck_number, shipmentId, created_by } = req.body;

        // Check if all required fields are provided
        if (!driver_name || !mobile_number || !truck_number || !shipmentId || !created_by) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if a TruckDetail with the same shipmentId already exists
        const existingTruckDetail = await TruckDetails.findOne({ shipmentId });

        if (existingTruckDetail) {
            return res.status(400).json({
                message: `Truck details for shipmentId ${shipmentId} already exist. Cannot create a duplicate record.`
            });
        }

        // Create a new truck detail entry
        const newTruckDetail = new TruckDetails({
            driver_name,
            mobile_number,
            truck_number,
            shipmentId,
            created_by,
            updated_by: created_by
        });

        // Save the new truck detail to the database
        const savedTruckDetail = await newTruckDetail.save();

        // Return the created truck details in the response
        return res.status(201).json({
            message: "Truck details created successfully",
            truckDetail: savedTruckDetail
        });
    } catch (error) {
        // Handle errors (e.g., validation or database errors)
        console.error(error);
        next(error);
    }
};

module.exports = { AddTruckDetails };
