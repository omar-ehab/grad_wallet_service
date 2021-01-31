const createError = require('http-errors');
const db = require("../models");
const wallet = db.Wallet;

//update

exports.calculatePoints = async (req, res) => {


    const amount = req.body.amount;
    const ratio = 0.1;
    //find wallet (by studentID)
    // calculate amont * ratio then update wallet
    console.log(amount);

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

        // res.send({ "New points balance :": wallet.reward_point });

    });
};


