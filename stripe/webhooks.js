const express = require('express');
const app = express();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const { removeRoleFromUser, addRoleToUser } = require('../discord/utilities');


app.use(express.json());

app.post('/webhook', (request, response) => {
    // ... handle stripe events
    console.log('Received Stripe Webhook:', request.body);
    console.log('ping')


    response.status(200).send('Event received');
});


module.exports = app;
