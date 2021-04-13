const express = require('express')
const helmet = require('helmet');
const createError = require('http-errors')
const cors = require('cors');
const axios = require('axios');
const { sequelize } = require('./models');
require('dotenv').config();

const walletRoutes = require('./routes/wallet');
const transactionsRoutes = require('./routes/transactions');

const PORT = process.env.SERVICE_PORT || 80;

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());


//wallet routes
app.use('/wallets', walletRoutes);
//transactions routes
app.use('/wallets', transactionsRoutes);


//404 error
app.use(async (req, res, next) => {
    next(createError.NotFound());
});

//other errors handler
app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.send({
        error: {
        status: err.status || 500,
        message: err.message,
        }
    });
});

// app.listen(PORT, async () => {
//     axios.put(`http://127.0.0.1:3000/register/wallets_service/1.0.0/${PORT}`);
//     console.log(`server running at http://127.0.0.1:${PORT}`);
// });

app.listen(PORT, async () => {
    console.log(`Server up on http://localhost:${PORT}`)
   await sequelize.authenticate()
   // sync is a function to rebuild tables
   // await sequelize.sync({force: true})
    console.log('Database Connected')
});