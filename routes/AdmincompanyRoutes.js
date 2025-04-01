// routes/userRoutes.js
const express = require('express');
const { registerTransportCompany, getTransportCompanyById,
    getAllTransportCompany, deleteTransportCompanyById, editTransportCompany
} = require('../controllers/AdminCompany');
const router = express.Router();
// GET route to fetch all users

router.post('/create', registerTransportCompany);
router.post('/update', editTransportCompany);
router.get('/:id', getTransportCompanyById);
router.get('/delete/:id', deleteTransportCompanyById);
router.get('/', getAllTransportCompany);
module.exports = router;
