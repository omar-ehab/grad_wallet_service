const router = require('express').Router();
const Market = require('../ApiModels/market');

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


router.get('/test', async (req, res) => {
    const response = await Market.update_balance(50);
    res.json(response?.data);
});


module.exports = router;
