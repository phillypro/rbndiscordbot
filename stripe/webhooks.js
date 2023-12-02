const express = require('express');
const app = express();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const { removeRoleFromUser, addRoleToUser } = require('../discord/utilities');


app.use(express.json());

app.post('/webhook', (request, response) => {
    // ... handle stripe events
});


module.exports = app;
