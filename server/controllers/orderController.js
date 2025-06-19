import Order from "../models/Order.js";
import User from "../models/User.js";
import Product from "../models/Product.js";
import stripe from "stripe"

// Place Order COD : /api/order/cod

export const placeOrderCOD = async(req, res) => {
    try {
        const { userId, items, address } = req.body;

        if (!address || items.length === 0 ) {
            res.json({success: false, message: "Invalid Data"});
        }

        let amount = await items.reduce(async (acc, item)=>{
            const product = await Product.findById(item.product);
            return (await acc) + product.offerPrice * item.quantity;
        },0) //initial acc=0
        
        amount += Math.floor(amount * 0.02);

        await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: "COD",
        });

        return res.json({success: true, message: "Order Placed Successfully"});

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}

// Place Order Stripe : /api/order/stripe

export const placeOrderStripe = async(req, res) => {
    try {
        const { userId, items, address } = req.body;
        const {origin} = req.headers;

        if (!address || items.length === 0 ) {
            res.json({success: false, message: "Invalid Data"});
        }

        let productData = []

        let amount = await items.reduce(async (acc, item)=>{
            const product = await Product.findById(item.product);
            productData.push({
                name: product.name,
                price: product.offerPrice,
                quantity: item.quantity,
            });
            return (await acc) + product.offerPrice * item.quantity;
        },0) //initial acc=0
        
        amount += Math.floor(amount * 0.02);

        const order = await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: "Online",
        });

        // Stripe Gateway Initialize
        const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

        // Create line items for stripe

        const line_items = productData.map((item)=> {
            return {
                price_data: {
                    currency: "inr",
                    product_data: {
                        name: item.name,
                    },
                    unit_amount: Math.floor(item.price + item.price * 0.02) * 100,
                },
                quantity: item.quantity,
            }
        })

        // create session 

        const session = await stripeInstance.checkout.sessions.create({
            line_items,
            mode: "payment",
            success_url: `${origin}/loader?next=my-orders`,
            cancel_url: `${origin}/cart`,
            metadata: {
                orderId: order._id.toString(),
                userId,
            }
        })

        return res.json({success: true, url: session.url });

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}

// Stripe Webhooks to verify Payment action : /stripe

export const stripeWebhooks = async (req, res) => {

    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
    const sig = req.headers['stripe-signature'];

    let event;

    try {
        event = stripeInstance.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (error) {
        return res.status(400).send(`Webhook Error: ${error.message}`);
    }

    switch (event.type) {
        case 'checkout.session.completed': {
            const session = event.data.object;

            const { orderId, userId } = session.metadata;

            await Order.findByIdAndUpdate(orderId, { isPaid: true });
            await User.findByIdAndUpdate(userId, { cartItems: {} });

            break;
        }

        case 'payment_intent.payment_failed': {
            const intent = event.data.object;
            console.log("Payment failed:", intent.id);
            break;
        }

        default:
            console.warn(`Unhandled event type: ${event.type}`);
            break;
    }

    res.json({ received: true });
};




// Get Order by User ID : /api/order/user

export const getUserOrders = async(req, res) => {
    try {
        const userId = req.userId;

        const orders = await Order.find({
            userId,
            $or: [{paymentType: "COD"}, {isPaid: true}]
            //only when either COD or online payment is done
        }).populate("items.product address").sort({createdAt: -1});
        res.json({success: true, orders});
        
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}

// Get All Orders (for seller) : /api/order/seller

export const getAllOrders = async(req, res) => {
    try {
        const orders = await Order.find({
            $or: [{paymentType: "COD"}, {isPaid: true}]
            //only when either COD or online payment is done
        }).populate("items.product address").sort({createdAt: -1});
        res.json({success: true, orders});

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}


