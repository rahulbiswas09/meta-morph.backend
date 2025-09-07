import { Router } from "express";
import { createOrder, verifyPayment } from "@controllers/paymentController.js";
const router = Router();
router.post("/payments/create-order", createOrder);
router.post("/payments/verify", verifyPayment);
export default router;
