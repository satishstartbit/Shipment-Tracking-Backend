const TruckDetails = require("../models/truckDetail");
const Shipments = require("../models/shipment")

const AddTruckDetails = async (req, res, next) => {
    try {
        const { driver_name, mobile_number, truck_number, shipmentId, created_by } = req.body;

        // Check if all required fields are provided
        if (!driver_name || !mobile_number || !truck_number || !shipmentId || !created_by) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if the shipment exists to retrieve the shipment_number
        const shipment = await Shipments.findById(shipmentId);

        if (!shipment) {
            return res.status(400).json({ message: "Shipment not found with the provided shipmentId." });
        }


        const TruckDetail = await TruckDetails.findById(shipmentId.TruckId);

        if (!TruckDetail) {
            // If no existing truck detail, create a new one
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

            // Update the TruckId in the shipment document
            shipment.TruckId = savedTruckDetail._id;
            shipment.shipment_status = "Confirmed"
            await shipment.save();


            // Return the created truck details in the response
            return res.status(201).json({
                message: "Truck details created successfully",
                truckDetail: savedTruckDetail,
                shipment: shipment
            });
        } else {

            TruckDetail.driver_name = driver_name;
            TruckDetail.mobile_number = mobile_number;
            TruckDetail.truck_number = truck_number;
            await TruckDetail.save();
            // Return the created truck details in the response
            return res.status(201).json({
                message: "Truck details Updated successfully",
                truckDetail: TruckDetail,
                shipment: shipment
            });
        }


    } catch (error) {
        // Handle errors (e.g., validation or database errors)
        console.error(error);
        next(error);
    }
};


module.exports = { AddTruckDetails };
