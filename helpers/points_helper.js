const calculatePoints = (amount) =>{

    const ratio = 0.1;
    const point = amount * ratio;
    return point;
 
}

const updatePoints = async (wallet,amount,t ) =>{

    const ratio = 0.1;
    const newPoints = calculatePoints(amount);
    const old_points = wallet.reward_point;
    const totalPoint = old_points + newPoints;
    wallet.reward_point=totalPoint;
    await wallet.save({transaction: t});


 
}

module.exports={calculatePoints,updatePoints}