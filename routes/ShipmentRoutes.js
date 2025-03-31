const express = require('express');
const { createTruckType, createShipment, getShipmentDetails } = require('../controllers/Shipment');
const router = express.Router();

router.get('/getshipment/:id', getShipmentDetails);
router.post('/createshipment', createShipment);
router.post('/createtrucktype', createTruckType);
module.exports = router;
