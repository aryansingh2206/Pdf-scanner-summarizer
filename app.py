from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline
import PyPDF2

app = Flask(__name__)
CORS(app)  # Allows frontend to access backend

# Home route to check if the API is running
@app.route("/", methods=["GET"])
def home():
    return "PDF Summarization API is running!"

# PDF Summarization Endpoint
@app.route("/summarize", methods=["POST"])
def summarize_pdf():
    try:
        if "pdf" not in request.files:
            return jsonify({"error": "No file uploaded"}), 400

        pdf_file = request.files["pdf"]

        # Read and extract text from the PDF
        pdf_reader = PyPDF2.PdfReader(pdf_file)
        text = "".join([page.extract_text() for page in pdf_reader.pages if page.extract_text()])

        if not text.strip():
            return jsonify({"error": "No extractable text found in the PDF"}), 400

        # Initialize the summarization model
        summarizer = pipeline("summarization", model="t5-small")
        summary = summarizer(text, max_length=150, min_length=50, do_sample=False)[0]["summary_text"]

        return jsonify({"summary": summary})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
