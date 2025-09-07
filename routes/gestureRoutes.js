import { Router } from "express";
import { addGesture, getGestures } from "@controllers/gestureController.js";
const router = Router();
router.post("/",(req,res)=>{
    console.log(req.body);
    res.send("OK")
})
router.get("/gestures", getGestures);
router.post("/gestures/upload", addGesture);
export default router;
