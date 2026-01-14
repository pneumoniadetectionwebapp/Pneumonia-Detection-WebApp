from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.preprocess import preprocess_image
from app.inference import predict

app = FastAPI(
    title="Pneumonia Detection API",
    description="ONNX model ile akciğer röntgeninden normal/pnömoni tahmini yapan servis.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "Pneumonia Detection API çalışıyor."}

@app.post("/predict")
async def predict_image(file: UploadFile = File(...)):

    try:
        image_tensor = preprocess_image(file.file)

        result = predict(image_tensor)

        return {
            "label": result["label"],
            "confidence": result["confidence"],
            "filename": file.filename
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
