const express = require('express');
const { createTruckType, createShipment, getShipmentDetails,
    getAllShipments, getAllTruckTypes, assignShipmentToCompany, 
    assignDockNumber
} = require('../controllers/Shipment');


const { AddTruckDetails } = require("../controllers/TruckInfo")
const router = express.Router();

router.get('/getshipment/:id', getShipmentDetails);
router.post('/createshipment', createShipment);
router.post('/createtrucktype', createTruckType);


router.post('/getallshipment', getAllShipments);
router.get('/getalltrucktype', getAllTruckTypes);
router.post('/assignshipment', assignShipmentToCompany);


// truck routes 
router.post('/createtruck', AddTruckDetails);

router.get('/assigndocknumber/:shipmentId', assignDockNumber);

module.exports = router;
