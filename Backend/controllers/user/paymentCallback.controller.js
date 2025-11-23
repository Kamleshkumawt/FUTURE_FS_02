import Stripe from "stripe";
import orderModel from "../../models/order.model.js";

export const handlePaymentSuccess = async (req, res) => {
    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
    const sig = req.headers['stripe-signature'];

    let event;

    try {
        event = stripeInstance.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);

    } catch (err) {
        console.log(`⚠️  Webhook signature verification failed.`, err.message);
        return res.sendStatus(400);
    }

    try {
        switch (event.type) {
            case 'payment_intent.succeeded':
                const paymentIntent = event.data.object;
                const sessionList = await stripeInstance.checkout.sessions.list({
                    payment_intent: paymentIntent.id,
                });
                const session = sessionList.data[0];
                const {orderId} = session.metadata;
                const order = await orderModel.findById(orderId);
                order.payment_status = 'paid';
                await order.save();
                break;
            default:
                console.log(`Unhandled event type ${event.type}`);
        }
        res.json({ received: true });
    } catch (err) {
        console.log(`⚠️  Webhook handling failed.`, err.message);
        return res.sendStatus(400);
    }
};