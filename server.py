from flask import Flask, request, jsonify
import torch
from ultralytics import YOLO
from PIL import Image
import io
from flask_cors import CORS
import base64

app = Flask(__name__)

CORS(app)
# CORS is needed for using react-native as client

# Load YOLOv8 model
model = YOLO("climbscan/last.pt")  

@app.route('/detect', methods=['POST'])
def detect():
    if 'image' not in request.files:
        app.logger.error("No 'image' in request.files")
        return jsonify({"error": "No image provided"}), 400

    file = request.files['image']
    app.logger.info(f"Received file: {file.filename}")

    try:
        img_bytes = file.read()
        img = Image.open(io.BytesIO(img_bytes))
    except Exception as e:
        app.logger.error(f"Error reading image: {e}")
        return jsonify({"error": "Invalid image"}), 400

    results = model(img)
    detections = [
        {
            "bounding_box": box.xyxy[0].tolist(),
            "confidence": box.conf[0].item(),
            "class_id": int(box.cls[0]),
        }
        for box in results[0].boxes
    ]
    return jsonify({"detections": detections})


if __name__ == '__main__':
    app.run(debug=True)
