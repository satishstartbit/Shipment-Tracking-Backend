const express = require('express');
const { createTruckType, createShipment, getShipmentDetails,
    getAllShipments, getAllTruckTypes, assignShipmentToCompany
} = require('../controllers/Shipment');
const router = express.Router();

router.get('/getshipment/:id', getShipmentDetails);
router.post('/createshipment', createShipment);
router.post('/createtrucktype', createTruckType);


router.post('/getallshipment', getAllShipments);
router.get('/getalltrucktype', getAllTruckTypes);
router.post('/assignshipment', assignShipmentToCompany);
module.exports = router;
