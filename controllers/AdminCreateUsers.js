
const Users = require('../models/user');
const bcrypt = require('bcryptjs');


// Controller to register a new user
const registerUser = async (req, res, next) => {
    const { username, first_name, last_name, email, password, mobile_no, gender, dob, roleid, avatar } = req.body;
    console.log(req.body);

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

        // Create a new user
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

        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        next(error); // Passing the error to the error handling middleware
    }
};


// Controller to get user details by ID
const getUserById = async (req, res, next) => {
    const userId = req.params.id;
    try {
        const user = await Users.findById(userId).populate("roleid", "name slug is_active");
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ user });
    } catch (error) {
        next(error);
    }
};



const getAllUsers = async (req, res, next) => {
    const { page_size, page_no, search, order } = req.query;

    const pageSize = parseInt(page_size) || 10; // Default to 10 if page_size is not provided
    const pageNo = parseInt(page_no) || 1; // Default to 1 if page_no is not provided
    const searchQuery = search ? { $text: { $search: search } } : {}; // Search filter
    const sortOrder = order === 'desc' ? -1 : 1; // Sort order (asc or desc)

    try {
        // Calculate the skip and limit based on page size and page number
        const skip = (pageNo - 1) * pageSize;
        const limit = pageSize;

        // Fetch the users with pagination and search filter, and populate the role
        const users = await Users.find(searchQuery)
            .populate("roleid", "slug") // Populate the role with only the slug field
            .sort({ createdAt: sortOrder }) // Sorting by `createdAt`, adjust as needed
            .skip(skip)
            .limit(limit);



        // Filter the users based on the role slug ('logistic_person' or 'security_gaurd')
        const filteredUsers = users.filter(user =>
            (user.roleid.slug === "logistic_person" || user.roleid.slug === "security_gaurd")
        );


        const totalCount = await Users.aggregate([
            { $match: searchQuery },  // Apply the search query filter
            {
                $lookup: {
                    from: 'roles',  // Assuming the role collection is called "roles"
                    localField: 'roleid',  // Field in Users collection
                    foreignField: '_id',  // Field in Roles collection
                    as: 'roleDetails'  // New field to hold the joined data
                }
            },
            { $unwind: '$roleDetails' },  // Flatten the joined role data
            { $match: { 'roleDetails.slug': { $in: ["logistic_person", "security_gaurd"] } } },  // Filter by slugs
            { $count: 'totalCount' }  // Count the number of matching users
        ]);

        // Extract total count from aggregation result
        const totalUsers = totalCount.length > 0 ? totalCount[0].totalCount : 0;

        // Respond with paginated users and total count
        res.status(200).json({
            usersListing: filteredUsers,
            totalUserCount: totalUsers
        });
    } catch (error) {
        next(error); // Handle error if fetching users fails
    }
};





// Controller to delete user by ID
const deleteUserById = async (req, res, next) => {
    const userId = req.params.id;
    console.log("userId", userId);

    try {
        const user = await Users.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        next(error); // Passing the error to the error handling middleware
    }
};


module.exports = { registerUser, getUserById, getAllUsers, deleteUserById };
