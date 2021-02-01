const createError = require('http-errors');
const db = require('../models')
const Wallet = db.Wallet;
const { createWalletSchema, checkBalanceSchema, depositWithdrawSchema } = require('../helpers/validation_schema')


const create = async (req, res, next) => {
  try {
    const result = await createWalletSchema.validateAsync(req.body);
    const wallet = await Wallet.create({
      student_id: result.student_id
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
      message: `${req.body.student_id} already exists`
    })
  }
}

const getWalletByStudentId = async (req, res, next) => {
  try {
    const wallet = await Wallet.findOne({ where: { student_id: req.params.student_id } });
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

const checkBalance = async (req, res, next) => {
  try {
    const result = await checkBalanceSchema.validateAsync(req.body);
    const wallet = await Wallet.findOne({ where: { student_id: req.params.student_id } });
    if(!wallet)
      throw createError.NotFound('Wallet Not Found');

    res.json({
      success: true,
      is_balance_available: wallet.available_balance >= result.balance
    });
  } catch (error){
    next(error)
  }
}

const depositBalance = async (req, res, next) => {
  try {
    const result = await depositWithdrawSchema.validateAsync(req.body);
    const wallet = await Wallet.findOne({ where: { student_id: req.params.student_id } });
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

const withdrawBalance = async (req, res, next) => {
  try {
    const result = await depositWithdrawSchema.validateAsync(req.body);
    const wallet = await Wallet.findOne({ where: { student_id: req.params.student_id } });
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


module.exports = {
  create,
  getWalletByStudentId,
  checkBalance,
  depositBalance,
  withdrawBalance
}