import Razorpay from "razorpay";
import crypto from "crypto";
import Payment from "@models/Payment.js";
import { asyncHandler } from "@libs/middlewares.js";

const razorpay = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_SECRET });

export const createOrder = asyncHandler(async (req, res) => {
    const { amount, currency } = req.body;
    const order = await razorpay.orders.create({ amount, currency, receipt: `rcpt_${Date.now()}` });
    res.json({ success: true, orderId: order.id });
});

export const verifyPayment = asyncHandler(async (req, res) => {
    const { orderId, paymentId, signature } = req.body;
    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET)
        .update(orderId + "|" + paymentId)
        .digest("hex");
    if (hmac === signature) {
        await Payment.create({ razorpayOrderId: orderId, razorpayPaymentId: paymentId, razorpaySignature: signature, status: "success" });
        res.json({ success: true, message: "Payment verified" });
    } else {
        res.status(400).json({ success: false, message: "Invalid payment" });
    }
});
