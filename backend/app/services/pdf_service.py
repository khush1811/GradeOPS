from pdf2image import convert_from_path
import os

POPPLER_PATH = r"D:\poppler\poppler-26.02.0\Library\bin"  # adjust if needed

def pdf_to_images(pdf_path, output_folder):

    images = convert_from_path(
        pdf_path,
        poppler_path=POPPLER_PATH
    )

    paths = []

    for i, img in enumerate(images):
        path = os.path.join(output_folder, f"page_{i}.png")
        img.save(path, "PNG")
        paths.append(path)

    return paths