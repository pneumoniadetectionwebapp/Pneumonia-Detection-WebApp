import numpy as np
import cv2

def preprocess_image(image_file):
    file_bytes = image_file.read()
    np_arr = np.frombuffer(file_bytes, np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

    if img is None:
        raise ValueError("Görüntü okunamadı")

    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

    gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    gray = clahe.apply(gray)

    img = cv2.merge([gray, gray, gray])

    img = cv2.resize(img, (224, 224), interpolation=cv2.INTER_AREA)

    img = img.astype(np.float32)


    img = img / 127.5 - 1.0   # [0,255] → [-1,1]

    img = np.expand_dims(img, axis=0)

    return img