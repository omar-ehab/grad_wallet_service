const router = require('express').Router();

const controller = require('../controllers/WalletController');
const PurchaseController = require('../controllers/PurchaseController');

// purchase routes
router.put("/calculatePoints", PurchaseController.calculatePoints)
router.put("/convertPoints", PurchaseController.convertPoints)

module.exports = router;