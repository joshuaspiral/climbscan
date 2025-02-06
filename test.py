from ultralytics import YOLO
from PIL import Image

# Load YOLOv8 model
model = YOLO("climbscan/model.pt")  # Replace with your model path

# Load an image
image_path = "/home/joshua/datasets/dataset/images/train/IMG_3343.jpg"
image = Image.open(image_path)

# Perform object detection
results = model(image)
results[0].show()
