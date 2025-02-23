from flask import Flask, request, jsonify
from ultralytics import YOLO
from PIL import Image
import io
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

model = YOLO("climbscan/model.pt")  

API_KEY = "APIKEY";

@app.route('/detect', methods=['POST'])
def detect():
    # Check for API key in request headers
    api_key = request.headers.get("API-KEY")
    if api_key != API_KEY:
        return jsonify({"error": "Unauthorized"}), 403

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
            "bounding_box": box.xywhn[0].tolist(),
            "confidence": box.conf[0].item(),
            "class_id": int(box.cls[0]),
        }
        for box in results[0].boxes if results[0].boxes.conf[0] > 0.8
    ]
    return jsonify({"detections": detections})


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
