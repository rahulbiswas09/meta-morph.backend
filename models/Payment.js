import mongoose from "mongoose";
const paymentSchema = new mongoose.Schema({
    amount: Number,
    currency: String,
    status: String,
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
    createdAt: { type: Date, default: Date.now }
});
export default mongoose.model("Payment", paymentSchema);
