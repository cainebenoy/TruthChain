from fastapi import FastAPI, UploadFile, File
from transformers import pipeline
from PIL import Image
import io
import logging

app = FastAPI()


@app.get("/")
def read_root():
    return {"Hello": "TruthChain AI"}


# We'll lazy-load the model pipeline on the first request to avoid long startup
# times and ensure the worker that handles the request has the model available.
logging.basicConfig(level=logging.INFO)
model_pipeline = None


@app.post("/detect")
async def detect(file: UploadFile = File(...)):
    """Deepfake detection endpoint.

    Reads uploaded image bytes, runs the model pipeline if available, and
    returns a JSON response with is_fake, confidence, and label.
    """
    # Lazy-load model on first request so the worker handling this request
    # will have the pipeline available.
    global model_pipeline
    if model_pipeline is None:
        print("--- LAZY-LOADING DEEPFAKE MODEL (this should only happen once) ---")
        model_pipeline = pipeline("image-classification", model="prithivMLmods/Deep-Fake-Detector-v2-Model")
        print("--- MODEL LOADED SUCCESSFULLY ---")

    # Read bytes from the uploaded file
    contents = await file.read()

    # Try to open as an image
    try:
        image = Image.open(io.BytesIO(contents)).convert("RGB")
    except Exception as e:
        return {"error": "Invalid image file", "detail": str(e)}

    # Run the AI model (which is now guaranteed to be loaded)
    results = model_pipeline(image)
    top_result = results[0]
    label = top_result["label"]
    score = top_result["score"]

    # Return the real result
    if label == "Deepfake":
        return {"is_fake": True, "confidence": score, "label": label}
    else:
        return {"is_fake": False, "confidence": score, "label": label}
