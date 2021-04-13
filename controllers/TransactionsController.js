const createError = require('http-errors');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const db = require("../models");
const Wallet = db.Wallet;
const Transaction = db.Transaction;
const pointHelper = require('../helpers/points_helper')
const { depositWithdrawSchema } = require('../helpers/validation_schema');
const market = require('../ApiModels/market');
const axios = require('axios');

const store = async (req, res) => {
    try {
        const result = await depositWithdrawSchema.validateAsync(req.body);
        const wallet = await Wallet.findOne({ where: { card_id: req.params.wallet_id } });
        if(!wallet)
          throw createError.NotFound('Wallet Not Found');

        if(wallet.checkBalance(result.amount)) {
            
            await Transaction.create({
                wallet_id: wallet.card_id,
                amount: result.amount,
                initialized_at: new Date(),
                accepted_at: null,
                type: "WITHDRAW",
                other_id: result.other_id
            });

            //get user fcm code
            //const response = await axios.post(`${process.env.APIGATEWAY_PROTOCOL}://${process.env.APIGATEWAY_HOST}:${process.env.APIGATEWAY_PORT}/students/${wallet.card_id}`)
            const response = {data: {success:true, student:{fcm_code: "123456"}}}
            if(response?.data.success){
                //send notification to userusing fcm code
                //axios.post(`${process.env.APIGATEWAY_PROTOCOL}://${process.env.APIGATEWAY_HOST}:${process.env.APIGATEWAY_PORT}/notification/${response.data.student.fcm_code}/confirmPurchase_notification`);
                res.json({ success:true, message: "transaction opened waiting student approval" });
            } else {
                res.status(500).json({ success:false, message: "something went wrong!" });
            }     
        } else {
            res.json({
                success: false,
                message: "not enough balance"
            });
        }
    } catch (error) {
    
        res.status(500).send(error.message);
    }
}

const show = async (req, res) => {
    try {
        const transaction = await Transaction.findOne({ where: {id: req.params.id} });
        res.json({ success:true, transaction });
    } catch(err) {
        res.status(500).json({success: false, message: err.message});
    }
}

const accept = async (req, res) => {
    try {
        const wallet = await Wallet.findOne({ where: { card_id: req.body.wallet_id } });
        const transaction = await Transaction.findOne({ where: { id: req.params.id, accepted_at: null } });
        if(!wallet || !transaction) 
            throw createError.NotFound('Not Found');

        const t = await db.sequelize.transaction();
        //await mohemaa because js is async
        await wallet.withdraw(transaction.amount, t);
        await pointHelper.updatePoints(wallet, transaction.amount, t);
        //deposit to market
        const response = await market.update_balance(transaction.other_id, transaction.amount);
        //add websocket in market to show balance update in realtime
        
        if(response?.data?.success){
            transaction.accepted_at = new Date();
            await transaction.save();
            t.commit();
            res.json({ success:true, message: "Thank you!" });
            //or send ok to client side
        } else {
            res.json({
                success: false,
                message: response?.data
            });
            t.rollback()
        }
    } catch(err){
        res.status(500).json({success: false, message: err.message});
    }
}

const reject = async (req, res) => {
    try {
        await Transaction.destroy({ where: { id: req.params.id, accepted_at: null } });
        //do nothing (realtime will not update market balance)
        //or send not ok to client side of market
        res.json({ success:true, message: "Transaction has been canclled!" });
    } catch(err) {
        res.status(500).json({success: false, message: err.message});
    }
}

const studentTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.findAll({ where: {
                wallet_id: req.params.student_id,
                accepted_at:{ [Op.ne]: null}
            }
        });
        res.json({ success:true, transactions });
    } catch(err) {
        res.status(500).json({success: false, message: err.message});
    }
}

const otherTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.findAll({ where: {
            other_id: req.params.other_id, 
            accepted_at:{ [Op.ne]: null }
         }
        });
        res.json({ success:true, transactions });
    } catch(err) {
        res.status(500).json({success: false, message: err.message});
    }
}


module.exports = {
    store,
    show,
    accept,
    reject,
    studentTransactions,
    otherTransactions
}