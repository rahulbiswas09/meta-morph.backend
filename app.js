import http from "http";
import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import passport from "./config.js";
import { Server } from "socket.io";
import session from "express-session";
import gestureRoutes from "@routes/gestureRoutes.js";
import ttsRoutes from "@routes/ttsRoutes.js";
import paymentRoutes from "@routes/paymentRoutes.js";
import "@libs/db.js";
import { checkDBConnection } from "@libs/middlewares.js";
import Gesture from "@models/Gesture.js";
import cors from "cors";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = http.createServer(app);

const allowedOrigins = process.env
  .CORS_ORIGIN.split(",")
  .map((origin) => origin.trim());

app.use(
  cors({
    origin: "*", // Allow all origins for testing purposes; replace with allowedOrigins in production
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

const io = new Server(server,{
    cors:{
        origin:"http://127.0.0.1:5175", 
        methods : ["GET","POST"]
    }
});

export { io, app };

io.on("connection", (socket) => {
    console.log("A client connected");
    socket.on("requestAllGestures", async () => {
        const gestures = await Gesture.find().sort({ createdAt: -1 });
        socket.emit("gesturesList", gestures);
    });
});



app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: process.env.SESSION_SECRET, saveUninitialized: false, resave: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(checkDBConnection);




app.get("/",(req,res)=>{
    res.send("Hello World");
    console.log("hola");
})
app.use("/api", gestureRoutes);
app.use("/tts", ttsRoutes);


app.use((req, res) => {
    res.status(404).render("404");
});

server.listen(process.env.PORT || 3000, () => {
    console.info(`server started at http://localhost:${process.env.PORT || 3000}`);
});