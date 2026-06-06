import pytesseract
from PIL import Image
import cv2

# Set this path if needed (Windows)
pytesseract.pytesseract.tesseract_cmd = r"D:\Tesseract-OCR\tesseract.exe"


def preprocess_image(image_path):
    try:
        img = cv2.imread(image_path)
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        blur = cv2.medianBlur(gray, 3)
        _, thresh = cv2.threshold(blur, 150, 255, cv2.THRESH_BINARY)
        return thresh
    except Exception:
        return None


def extract_text(image_path):
    try:
        processed = preprocess_image(image_path)

        if processed is None:
            return "OCR_ERROR: preprocessing failed"

        text = pytesseract.image_to_string(processed, config='--psm 6')

        # clean output
        text = text.strip()

        if len(text) == 0:
            return "NO_TEXT_DETECTED"

        return text

    except Exception as e:
        return f"OCR_ERROR: {str(e)}"