import { asyncHandler } from "@libs/middlewares.js";
import Gesture from "@models/Gesture.js";
import { io } from "../app.js";


const thresholds = [20, 20, 20, 20];


const getBentArray = ({ flex1, flex2, flex3, flex4 }) => {
  return [
    flex1 > thresholds[0] ? 1 : 0,
    flex2 > thresholds[1] ? 1 : 0,
    flex3 > thresholds[2] ? 1 : 0,
    flex4 > thresholds[3] ? 1 : 0,
  ];
};


const detectGesture = (bent) => {
  if (bent[0] === 0 && bent[1] === 0 && bent[2] === 0 && bent[3] === 0) {
    return "👋 Hello";
  } else if (bent[0] === 1 && bent[1] === 0 && bent[2] === 0 && bent[3] === 0) {
    return "👍 Yes";
  } else if (bent[0] === 0 && bent[1] === 1 && bent[2] === 0 && bent[3] === 0) {
    return "👎 No";
  } else if (bent[0] === 1 && bent[1] === 1 && bent[2] === 1 && bent[3] === 1) {
    return "🆘 Help";
  } else {
    return "❓ Unknown";
  }
};

const generateTextFromGesture = (message) => {
  switch (message) {
    case "👋 Hello":
      return "Hello how are you?";
    case "👍 Yes":
      return "Yes I agree";
    case "👎 No":
      return "No I disagree";
    case "🆘 Help":
      return "Help me please";
    default:
      return "❓ Unknown Gesture";
  }
};

export const addGesture = asyncHandler(async (req, res) => {
  const { gloveId, flex1, flex2, flex3, flex4 } = req.body;

  if (!gloveId || flex1 === undefined || flex2 === undefined || flex3 === undefined || flex4 === undefined) {
    return res.status(400).json({
      success: false,
      error: "gloveId, flex1, flex2, flex3, flex4 are required",
    });
  }


  const bent = getBentArray({ flex1, flex2, flex3, flex4 });


  const message = detectGesture(bent);

  const generatedText = generateTextFromGesture(message);

  const gesture = new Gesture({
    gloveId,
    flexValues: [flex1, flex2, flex3, flex4],
    bent,
    message,
    text: generatedText,
    createdAt: new Date(),
  });

  await gesture.save();


  io.emit("gestureData", {
    gloveId,
    flexValues: [flex1, flex2, flex3, flex4],
    bent,
    message,
    createdAt: gesture.createdAt,
  });

  res.status(201).json({ success: true, data: gesture });
});


export const getGestures = asyncHandler(async (req, res) => {
  const gestures = await Gesture.find().sort({ createdAt: -1 }).limit(1);
  res.json({ success: true, data: gestures[0] });
});