const express = require('express');
const midtransClient = require('midtrans-client');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Konfigurasi Midtrans
const snap = new midtransClient.Snap({
    isProduction: false, // SANDBOX
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.MIDTRANS_CLIENT_KEY
});

app.post('/create-transaction', async (req, res) => {
    try {
        const { id, productName, price, quantity } = req.body;

        const parameter = {
            transaction_details: {
                order_id: `VIAN-${Date.now()}`,
                gross_amount: price * quantity
            },
            item_details: [{
                id: id,
                price: price,
                quantity: quantity,
                name: productName
            }]
        };

        const transaction = await snap.createTransaction(parameter);
        res.status(200).json({ token: transaction.token });
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: error.message });
    }
});

module.exports = app;