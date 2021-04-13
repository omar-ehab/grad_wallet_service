const axios = require('axios');

const update_balance = async (market_id, balance) => {
    try {
        return await axios.post(`${process.env.APIGATEWAY_PROTOCOL}://${process.env.APIGATEWAY_HOST}:${process.env.APIGATEWAY_PORT}/markets/${market_id}/deposit`, {
            balance
        });
    } catch (err) {
        console.error(err.message);
    }
}

module.exports = {
    update_balance
}
