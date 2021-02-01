const router = require('express').Router();


const WalletController = require('../controllers/WalletController');
const PurchaseController = require('../controllers/PurchaseController');

// external wallet routes
router.post('/wallet/create', WalletController.create);
router.get('/wallet/:student_id', WalletController.getWalletByStudentId);
router.get('/wallet/:student_id/check_balance', WalletController.checkBalance);
router.post('/wallet/:student_id/deposit', WalletController.depositBalance);
router.post('/wallet/:student_id/withdraw', WalletController.withdrawBalance);



// purchase routes
router.put("/calculatePoints", PurchaseController.calculatePoints)
router.put("/convertPoints", PurchaseController.convertPoints)

module.exports = router;