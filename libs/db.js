import mongoose from "mongoose";
import multer from "multer";

const url = process.env.MONGODB_URI;

mongoose.connect(url)
  .then(() => console.info(`Connected to db`))
  .catch((error) => console.error(`Error connecting to MongoDB: ${error.message}`));


const conn = mongoose.connection;

const storage = multer.memoryStorage();
const upload = multer({ storage });

export { conn, upload };