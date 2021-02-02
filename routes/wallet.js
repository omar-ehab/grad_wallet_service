const router = require('express').Router();


const WalletController = require('../controllers/WalletController');
const PurchaseController = require('../controllers/PurchaseController');

// external wallet routes
router.post('/wallet/create', WalletController.create);
router.get('/wallet/:student_id', WalletController.getWalletByStudentId);
router.get('/wallet/:student_id/check_balance', WalletController.checkBalance);
router.post('/wallet/:student_id/deposit', WalletController.depositBalance);



// purchase routes
router.put("/convertPoints", PurchaseController.convertPoints)
router.post('/:student_id/purchase', PurchaseController.purchase);


module.exports = router;