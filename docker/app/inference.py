import numpy as np
import onnxruntime as ort

session = ort.InferenceSession("app/model/model.onnx")

CLASSES = ["Normal", "Pneumonia"]

def predict(image_tensor, threshold: float = 0.5):

    input_meta = session.get_inputs()[0]
    input_name = input_meta.name

    outputs = session.run(None, {input_name: image_tensor})

    out = outputs[0]
    out = np.array(out)

    if out.size == 1:
        p = float(out.reshape(-1)[0])

        if p >= threshold:
            label = "Pneumonia"
            confidence = p
        else:
            label = "Normal"
            confidence = 1.0 - p

        return {
            "label": label,
            "confidence": round(float(confidence), 4)
        }

    vec = out.reshape(-1)
    class_index = int(np.argmax(vec))
    confidence = float(vec[class_index])

    return {
        "label": CLASSES[class_index],
        "confidence": round(confidence, 4)
    }
