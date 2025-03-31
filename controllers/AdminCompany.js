
const Users = require('../models/user');
const TransportCompany = require('../models/transportCompany');

const registerTransportCompany = async (req, res, next) => {

    const { company_name, city, state, country, company_contact,
        username, first_name, last_name, email,
        password, mobile_no, gender,
        dob, roleid, avatar
    } = req.body;

    try {

        // Check if the email already exists
        const existingEmail = await Users.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        // Check if the username already exists
        const existingUsername = await Users.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ message: 'Username already taken' });
        }


        const existingTransportCompany = await TransportCompany.findOne({ company_name });
        if (existingTransportCompany) {
            return res.status(400).json({ message: 'Transport company name already taken' });
        }

        const newUser = new Users({
            username,
            email,
            password,
            first_name,
            last_name,
            mobile_no,
            gender,
            avatar,
            dob,
            roleid,
            plantId: "67e53f04a272c03c7431b952",
        });

        await newUser.save();


        let newuserId = newUser?._id
        const newTransportCompany = new TransportCompany({
            company_name,
            city,
            state,
            country,
            munshiId: newuserId
        });

        await newTransportCompany.save();



        res.status(201).json({ message: 'Transport Company registered successfully', company: newTransportCompany, user: newUser });

    } catch (error) {
        if (error.code === 11000) {
            // Duplicate key error, meaning the name already exists
            return res.status(400).json({ message: 'Transport Company name must be unique. This Company name already exists.' });
        }
        // Pass other errors to the error-handling middleware
        next(error);
    }
};

const getTransportCompanyById = async (req, res, next) => {
    const plantId = req.params.id;
    console.log("plantId", plantId);

    try {
        // Correct the population to munshiId since that's the actual reference field in your schema
        const plant = await TransportCompany.findById(plantId).populate("munshiId");  // Populating the 'munshiId' field

        if (!plant) {
            return res.status(404).json({ message: 'Plant not found' });
        }

        res.status(200).json(plant);
    } catch (error) {
        console.error('Error fetching plant:', error);
        next(error);  // Pass the error to the next middleware (error handler)
    }
};




const getAllTransportCompany = async (req, res, next) => {
    const { page_size, page_no, search, order } = req.query;

    const pageSize = parseInt(page_size) || 10; // Default to 10 if page_size is not provided
    const pageNo = parseInt(page_no) || 1; // Default to 1 if page_no is not provided
    const searchQuery = search ? { $text: { $search: search } } : {}; // Search filter
    const sortOrder = order === 'desc' ? -1 : 1; // Sort order (asc or desc)

    try {
        // Calculate the skip and limit based on page size and page number
        const skip = (pageNo - 1) * pageSize;
        const limit = pageSize;

        // Fetch the users with pagination and search filter
        const Company = await TransportCompany.find(searchQuery).populate("munshiId")
            .sort({ createdAt: sortOrder }) // Assuming sorting by `createdAt`, adjust as needed
            .skip(skip)
            .limit(limit);


        // Get the total Company count (for pagination purposes)
        const totalCompanyCount = await TransportCompany.countDocuments(searchQuery);

        // Respond with Company users and total count
        res.status(200).json({
            totalCompanyCount,
            CompanyListing: Company,
        });
    } catch (error) {
        next(error); // Handle error if fetching users fails
    }
};


// Controller to delete user by ID
const deleteTransportCompanyById = async (req, res, next) => {
    const plantId = req.params.id;

    try {
        const plant = await TransportCompany.findByIdAndDelete(plantId);
        if (!plant) {
            return res.status(404).json({ message: 'Transport Company not found' });
        }

        res.status(200).json({ message: 'Transport Company deleted successfully' });
    } catch (error) {
        next(error); // Passing the error to the error handling middleware
    }
};

module.exports = { registerTransportCompany, getTransportCompanyById, getAllTransportCompany, deleteTransportCompanyById };
