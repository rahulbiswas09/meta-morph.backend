import mongoose from "mongoose";

const gestureSchema = new mongoose.Schema({
  gloveId: {
    type: String,
    required: true,
  },
  flexValues: {
    type: [Number],
    required: true,
  },
  bent: {
    type: [Number],
    required: true,
  },
  text: {
    type: String
  },
  message: {
    type: String,
    required: true,
  }
}, {
  timestamps: true,
});

const Gesture = mongoose.model("Gesture", gestureSchema);
export default Gesture;