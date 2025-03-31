const express = require('express');
const { createTruckType, createShipment } = require('../controllers/Shipment');
const router = express.Router();


router.post('/createshipment', createShipment);
router.post('/createtrucktype', createTruckType);
module.exports = router;
