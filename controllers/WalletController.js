const createError = require('http-errors');
const db = require('../models')
const Wallet = db.Wallet;
const { createWalletSchema, checkBalanceSchema, depositWithdrawSchema } = require('../helpers/validation_schema')


const create = async (req, res, next) => {
  try {
    const result = await createWalletSchema.validateAsync(req.body);
    const wallet = await Wallet.create({
      card_id: result.card_id
    });

    res.json({
      success: true,
      wallet
    });
  } catch (error) {
    if(error.isJoi) {
      next(error);
    }
    res.json({
      success: false,
      message: `${req.body.card_id} already exists`
    })
  }
}

const getWalletByStudentId = async (req, res, next) => {
  try {
    const wallet = await Wallet.findOne({ where: { card_id: req.params.card_id } });
    if(!wallet)
      throw createError.NotFound('Wallet Not Found');

    res.json({
      success: true,
      wallet
    });
  } catch (error){
    next(error)
  }
}

const deposit = async (req, res, next) => {
  try {
    const result = await depositWithdrawSchema.validateAsync(req.body);
    //console.log(result);
    const wallet = await Wallet.findOne({ where: { card_id: req.params.card_id } });
    if(!wallet)
      throw createError.NotFound('Wallet Not Found');

    const t = await db.sequelize.transaction();
    await wallet.deposit(result.amount, t);
    //here we will add this transaction as purchase history

    t.commit();

    res.json({
      success: true,
      message: "deposition done successfully"
    });
  } catch (error){
    next(error)
  }
}

const withdraw = async (req, res, next) => {
  try {
    const result = await depositWithdrawSchema.validateAsync(req.body);
    const wallet = await Wallet.findOne({ where: { card_id: req.params.card_id } });
    if(!wallet)
      throw createError.NotFound('Wallet Not Found');

    if(wallet.checkBalance(result.amount)) {
      const t = await db.sequelize.transaction();
      await wallet.withdraw(result.amount, t);
      //here we will add this transaction as purchase history
      t.commit();

      res.json({
        success: true,
        message: "withdrawal done successfully"
      });
    } else{
      res.json({
        success: false,
        message: "not enough balance"
      })
    }
  } catch (error){
    next(error)
  }
}


//convert reward points into balance
////////////////////////////MOHEM////////////////////////
//make balance & points float not an integer 3lshan al points tt7sb b7a2 rbna
const convertPoints = async (req, res) => {

  //if we want to change ration
  const ratio = 0.1;
  //find wallet (by studentID)


  const wallet = await Wallet.findOne({ where: { card_id: req.params.card_id } })
  if (!wallet)
  //wallet not found
      return res.status(404).send("Wallet not found!")

  let oldBalance = wallet.available_balance;
  let rewardPoints = wallet.reward_point;
  const newBalance = oldBalance + (rewardPoints * ratio);

  //wallet found & update
  await Wallet.update({
      reward_point: 0,
      available_balance: newBalance
  }, { where: { card_id: req.params.card_id } }).then(wallet => {
      res.json({ success: true, message: "points converted" });
  });
};


module.exports = {
  create,
  getWalletByStudentId,
  deposit,
  withdraw,
  convertPoints
}