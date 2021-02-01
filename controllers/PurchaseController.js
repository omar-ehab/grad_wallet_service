const createError = require('http-errors');
const db = require("../models");
const wallet = db.Wallet;

//calculate reward points 

exports.calculatePoints = async (req, res) => {


    const amount = req.body.amount;
    const ratio = 0.1;
    //find wallet (by studentID)
    // calculate amont * ratio then update wallet

    const wallet = await db.Wallet.findOne({ where: { student_id: req.body.student_id } })
    if (!wallet)
    //wallet not found
        return res.status(404).send("Wallet not found!")
    var old_points = wallet.reward_point;
    const point = old_points + (amount * ratio);
    //wallet found & update
    db.Wallet.update({
        reward_point: point

    }, { where: { student_id: req.body.student_id } }).then(wallet => {

        res.send({ "Success : points added": true });


    });
};


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
