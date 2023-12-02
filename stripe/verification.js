const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const { addRoleToUser } = require('../discord/utilities.js');



async function checkforActiveSubscription(client, customerEmail, discordUserId) {
    const customers = await stripe.customers.list({
        email: customerEmail,
        limit: 1
    });
    if (customers.data.length > 0) {
    const customerId = customers.data[0].id;
    const subscriptions = await stripe.subscriptions.list({
        customer: customerId,
        status: 'active'
    });
        if (subscriptions.data.length > 0) {
            // lets run a command that inputs their discord id into their customer model
            await stripe.customers.update(customerId, {
                metadata: { discord: discordUserId }
            });
            // lets add their role
            addRoleToUser(client, discordUserId)
            return 'Their subscription has been confirmed as active. And we have unlocked the members only channels for this user.';
        } else{
            const pastDueSubscriptions = await stripe.subscriptions.list({
                customer: customerId,
                status: 'past_due'
            });
            if (pastDueSubscriptions.data.length > 0) {
                // lets pull their past due invoice and send them the link
                const latestInvoiceId = pastDueSubscriptions.data[0].latest_invoice;
                const invoice = await stripe.invoices.retrieve(latestInvoiceId);
                
                // The payment URL for the invoice
                const paymentUrl = invoice.hosted_invoice_url;
                return `They have a subscription but it's past due. They need to complete payment at this link ${paymentUrl} and the members only channels will become available`;
            }else{
                return 'We found their account in stripe but they dont have an active subscription. They need to resign up at https://richbynoon.live';
            }
        }
    } else {
        return 'No customer found with that email';
    }
}


module.exports = { checkforActiveSubscription };
