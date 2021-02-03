const axios = require('axios');

const MARKET_SERVICE_DETAILS = {
    hostname: "http://127.0.0.1",
    port: "3000",
    path: '/update_balance/',
}

const update_balance = async (market_id, balance) => {
    try {
        return await axios.post(`${MARKET_SERVICE_DETAILS.hostname}:${MARKET_SERVICE_DETAILS.port}${MARKET_SERVICE_DETAILS.path}${market_id}`,{balance});
    } catch (err) {
        console.error(err.message);
    }
}

module.exports = {
    update_balance
}
