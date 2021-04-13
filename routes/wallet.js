const router = require('express').Router();
const Market = require('../ApiModels/market');

const WalletController = require('../controllers/WalletController');

// external wallet routes
router.post('/', WalletController.create);
router.get('/:card_id', WalletController.getWalletByStudentId);
router.put('/:card_id/deposit', WalletController.deposit);
router.put('/:card_id/withdraw', WalletController.withdraw);
router.put("/:card_id/convertPoints", WalletController.convertPoints);


module.exports = router;
