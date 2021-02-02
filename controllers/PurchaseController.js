const createError = require('http-errors');
const db = require("../models");
const Wallet = db.Wallet;
const pointHelper=require('../helpers/points_helper')
const {depositWithdrawSchema } = require('../helpers/validation_schema')

// const {calculatePoints,updatePoints}=require('../helpers/points_helper')

//calculate reward points 

exports.purchase = async (req, res,next) => {


    try {
        const result = await depositWithdrawSchema.validateAsync(req.body);
        const wallet = await Wallet.findOne({ where: { student_id: req.params.student_id } });
        if(!wallet)
          throw createError.NotFound('Wallet Not Found');
    
        if(wallet.checkBalance(result.amount)) {
            //await confirmation
          const t = await db.sequelize.transaction();
          //await mohemaa because js is async 
          await wallet.withdraw(result.amount, t);
        
        await pointHelper.updatePoints(wallet,result.amount,t);
            //deposit to market

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
exports.convertPoints = async (req, res) => {

    //if we want to change ration
    const ratio = 0.1;
    //find wallet (by studentID)
    

    const wallet = await db.Wallet.findOne({ where: { student_id: req.body.student_id } })
    if (!wallet)
    //wallet not found
        return res.status(404).send("Wallet not found!")

    var oldBalance = wallet.available_balance;
    var rewardPoints = wallet.reward_point;
    const newBalance = oldBalance + (rewardPoints * ratio);

    //wallet found & update
    db.Wallet.update({
        reward_point: 0,
        available_balance:newBalance

    }, { where: { student_id: req.body.student_id } }).then(wallet => {

        res.send({ "Success : points converted": true });


    });
};
