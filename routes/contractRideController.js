const express = require('express');
const router = express.Router();
const kadaController = require('../controllers/contractRideController');

router.post('/bookRide', kadaController.bookRide);
router.post('/payForRide', kadaController.payForRide);
router.get('/ride/:id', kadaController.getRideDetails);
router.get('/history/:customer', kadaController.getCustomerRideHistory);
router.get('/transaction/:id', kadaController.getTransactionDetails);

module.exports = router;
