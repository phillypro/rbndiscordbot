const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const { addRoleToUser } = require('../discord/utilities.js');



async function checkforActiveSubscription(client, customerEmail, discordUserId) {
    customerEmail = customerEmail.toLowerCase();
    const customers = await stripe.customers.list({ email: customerEmail });
    if (customers.data.length === 0) {
        return 'No customer found with that email';
    }

    let activeSubscriptionFound = false;
    let pastDueSubscriptionFound = false;
    let cancelledSubscriptionFound = false;
    let responseMessage = '';

    for (const customer of customers.data) {
        const subscriptions = await stripe.subscriptions.list({
            customer: customer.id,
            status: 'all',
            expand: ['data.latest_invoice']
        });
           
        for (const subscription of subscriptions.data) {
            console.log(subscription);
            if (subscription.status === 'active' || subscription.status === 'trialing') {
                await stripe.customers.update(customer.id, {
                    metadata: { discord: discordUserId }
                });
                addRoleToUser(client, discordUserId);
                return 'Their subscription has been confirmed as active. And we have unlocked the members only channels for this user.';
            } else if (subscription.status === 'past_due') {
                pastDueSubscriptionFound = true;
                responseMessage = `They have a subscription but it's past due. They need to complete payment at this link ${subscription.latest_invoice.hosted_invoice_url} and the members only channels will become available.`;
            } else if (subscription.status === 'canceled') {
                cancelledSubscriptionFound = true;
            }
        }
    }

    if (pastDueSubscriptionFound) {
        return responseMessage;
    } else if (cancelledSubscriptionFound) {
        return 'We found their account in Stripe, but their subscription is cancelled. They need to resign up at https://join.richbynoon.live/b/14kcOx7IG7T9gxy7st';
    } else {
        return 'We found their account in Stripe but they don’t have an active subscription. They need to resign up at https://join.richbynoon.live/b/14kcOx7IG7T9gxy7st';
    }
}



module.exports = { checkforActiveSubscription };
