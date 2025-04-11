
const Users = require('../models/user');
const TransportCompany = require('../models/transportCompany');

//Transport Company Registration API
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



const editTransportCompany = async (req, res, next) => {
    const { company_id, company_name, city, state, country,
        username, first_name, last_name, email,
        password, mobile_no, gender,
        dob, roleid
    } = req.body;

    try {
        // Find the transport company by ID
        const transportCompany = await TransportCompany.findById(company_id);

        if (!transportCompany) {
            return res.status(404).json({ message: 'Transport company not found' });
        }

        // Find the associated user (munshiId in TransportCompany)
        const user = await Users.findById(transportCompany.munshiId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the email is already taken by another user (except the current user)
        const existingEmail = await Users.findOne({ email, _id: { $ne: user._id } });
        if (existingEmail) {
            return res.status(400).json({ message: 'Email already in use by another user' });
        }

        // Check if the username is already taken by another user (except the current user)
        const existingUsername = await Users.findOne({ username, _id: { $ne: user._id } });
        if (existingUsername) {
            return res.status(400).json({ message: 'Username already taken by another user' });
        }

        // Update the user details
        user.username = username || user.username;
        user.email = email || user.email;
        user.password = password || user.password;  // You can add password hashing here
        user.first_name = first_name || user.first_name;
        user.last_name = last_name || user.last_name;
        user.mobile_no = mobile_no || user.mobile_no;
        user.gender = gender || user.gender;
        user.dob = dob || user.dob;
        user.roleid = roleid || user.roleid;

        // Save the updated user
        await user.save();

        // Update the transport company details
        transportCompany.company_name = company_name || transportCompany.company_name;
        transportCompany.city = city || transportCompany.city;
        transportCompany.state = state || transportCompany.state;
        transportCompany.country = country || transportCompany.country;

        // Save the updated transport company
        await transportCompany.save();

        res.status(200).json({
            message: 'Transport Company and User updated successfully',
            company: transportCompany,
            user: user
        });

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

    const pageSize = parseInt(page_size) || 10;
    const pageNo = parseInt(page_no) || 1;
    const skip = (pageNo - 1) * pageSize;
    const sortOrder = order === 'desc' ? -1 : 1;

    // Create regex search filters
    const searchRegex = search ? new RegExp(search, 'i') : null;

    const matchStage = searchRegex ? {
        $or: [
            { "company_name": { $regex: searchRegex } },
            { 'munshi.email': { $regex: searchRegex } },
            { 'munshi.first_name': { $regex: searchRegex } },
            { 'munshi.last_name': { $regex: searchRegex } },
            { 'munshi.mobile_no': { $regex: searchRegex } },
        ]
    } : {};

    try {
        const aggregatePipeline = [
            {
                $lookup: {
                    from: 'users', // Assuming munshiId refers to the "users" collection
                    localField: 'munshiId',
                    foreignField: '_id',
                    as: 'munshi'
                }
            },
            { $unwind: '$munshi' },
            { $match: matchStage },
            { $sort: { createdAt: sortOrder } },
            { $skip: skip },
            { $limit: pageSize },
        ];

        const CompanyListing = await TransportCompany.aggregate(aggregatePipeline);

        // Count total matching documents
        const countPipeline = [
            {
                $lookup: {
                    from: 'users',
                    localField: 'munshiId',
                    foreignField: '_id',
                    as: 'munshi'
                }
            },
            { $unwind: '$munshi' },
            { $match: matchStage },
            { $count: 'total' }
        ];

        const countResult = await TransportCompany.aggregate(countPipeline);
        const totalCompanyCount = countResult[0]?.total || 0;

        res.status(200).json({
            totalCompanyCount,
            CompanyListing
        });
    } catch (error) {
        next(error);
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

module.exports = {
    registerTransportCompany, getTransportCompanyById, getAllTransportCompany,
    deleteTransportCompanyById, editTransportCompany
};
