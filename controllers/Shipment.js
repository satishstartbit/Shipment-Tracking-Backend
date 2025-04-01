const Shipments = require("../models/shipment")
const TruckTypes = require("../models/truckType")
const TransportCompany = require('../models/transportCompany');
const TruckDetails = require("../models/truckDetail")

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
    const { id } = req.params; // Assuming the shipment ID is passed in the URL

    try {
        // Find the shipment by ID and populate related fields
        const shipment = await Shipments.findById(id)
            .populate("companyId", "") // Populating the Plant with name and location
            .populate("truckTypeId", "") // Populating the TruckType with type and capacity
            .exec();

        // If the shipment is not found, return a 404 response
        if (!shipment) {
            return res.status(404).json({ message: "Shipment not found" });
        }


        const TruckDetail = await TruckDetails.find({ shipmentId: id })


        if (!TruckDetail) {
            return res.status(404).json({ message: "Truck details not found" });
        }

        // Return the populated shipment details
        res.status(200).json({ shipment , TruckDetail});
    } catch (error) {
        next(error); // Pass the error to the error-handling middleware
    }
};









const getAllShipments = async (req, res, next) => {
    try {
        // Destructure query parameters from the request
        const { page_size = 10, page_no = 1, search = '', order = 'asc', slug = 'logistic_person', userid = null } = req.body;

        // Create the pagination and ordering logic
        const skip = (page_no - 1) * page_size;  // For skipping records based on page number
        const limit = parseInt(page_size); // Number of records to fetch
        const sortOrder = order === 'desc' ? -1 : 1;  // Sort order (ascending or descending)


        // Build the search filter
        const searchFilter = search
            ? {
                $or: [
                    { 'createdBy.first_name': { $regex: search, $options: 'i' } },
                    { 'createdBy.last_name': { $regex: search, $options: 'i' } },
                ]
            }
            : {};  // If search is provided, match it on first name or last name, otherwise no filter

        // Initialize the filters object
        let filters = { ...searchFilter };

        // Modify filters based on the slug
        if (slug === 'security_gaurd') {
            // Add an additional filter for the 'Confirmed' status if the role is 'security_gaurd'
            filters = { ...filters, shipment_status: 'Confirmed' };
        } else if (slug === "Munshi") {
            filters = { ...filters, shipment_status: 'Assigned' };
        }

        let shipments = []
        let totalShipments = 0
        if (slug === "Munshi") {
            if (!userid) {
                return res.status(404).json({ message: 'User ID can not ne null' });
            }

            // Retrieve the shipments with filters, pagination, and sorting
            shipments = await Shipments.find(filters)
                .populate({
                    path: 'companyId', // Populate the 'companyId' field
                    match: { 'munshiId': userid }, // Filter on the 'munshiId' field of the referenced document
                    select: '', // Select the fields you want to include from the populated document
                })
                .populate('truckTypeId', '')  // Populate the truck type data
                .sort({ created_at: sortOrder })  // Sort by created_at or any other field as needed
                .skip(skip)  // Pagination: skip records based on page
                .limit(limit)  // Pagination: limit number of records per page
                .exec();

            // Count the total number of shipments for pagination info
            totalShipments = await Shipments.countDocuments(filters);

        } else {
            // Retrieve the shipments with filters, pagination, and sorting
            shipments = await Shipments.find(filters)
                .populate('createdBy', '')  // Populate user data
                .populate('truckTypeId', '')  // Populate the truck type data
                .sort({ created_at: sortOrder })  // Sort by created_at or any other field as needed
                .skip(skip)  // Pagination: skip records based on page
                .limit(limit)  // Pagination: limit number of records per page
                .exec();

            // Count the total number of shipments for pagination info
            totalShipments = await Shipments.countDocuments(filters);
        }


        // If no shipments are found, return a 404 response
        if (shipments.length === 0) {
            return res.status(404).json({ message: 'No shipments found' });
        }

        // Return the populated shipment details with pagination information
        res.status(200).json({
            shipments,
            totalShipments,
            page_size: parseInt(page_size),
            page_no: parseInt(page_no),
            total_pages: Math.ceil(totalShipments / page_size),  // Calculate total pages
            has_next: (page_no * page_size) < totalShipments,  // Check if there is a next page
            has_prev: page_no > 1  // Check if there is a previous page
        });
    } catch (error) {
        next(error);  // Pass the error to the error-handling middleware
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


module.exports = {
    createShipment, createTruckType, getShipmentDetails,
    getAllShipments, getAllTruckTypes, assignShipmentToCompany
};
