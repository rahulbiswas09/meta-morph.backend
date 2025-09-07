
export const processGesture = (gestureData) => {

    if (!gestureData.gestureName) {
        throw new Error("Gesture name required");
    }


    return gestureData;
};