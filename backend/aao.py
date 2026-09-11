import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np
from google import genai  # <-- Google ka ekdum naya package
from dotenv import load_dotenv
from pypdf import PdfReader
import warnings

warnings.filterwarnings("ignore", category=UserWarning)
load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

app = Flask(__name__)
CORS(app)

# Naya Enterprise AI Client
if GEMINI_API_KEY:
    ai_client = genai.Client(api_key=GEMINI_API_KEY)

with open('placement_model.pkl', 'rb') as file:
    model = pickle.load(file)

@app.route('/')
def home():
    return "Enterprise Placement API is Running!"

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.form
        
        # 1. Feature Extraction
        features = [
            float(data.get('gender', 1)), float(data.get('ssc_p', 0)), float(data.get('ssc_b', 0)), 
            float(data.get('hsc_p', 0)), float(data.get('hsc_b', 0)), float(data.get('hsc_s', 2)), 
            float(data.get('degree_p', 0)), float(data.get('degree_t', 2)), float(data.get('workex', 0)), 
            float(data.get('etest_p', 0)), float(data.get('specialisation', 0)), float(data.get('mba_p', 0))
        ]
        final_features = [np.array(features)]
        
        # 2. Prediction
        prediction = model.predict(final_features)
        probability = model.predict_proba(final_features)[0]
        confidence_score = round(probability[1] * 100, 2) 
        result = "Placed" if prediction[0] == 1 else "Not Placed"
        
        # 3. PDF Parsing
        resume_text = ""
        if 'resume' in request.files:
            resume_file = request.files['resume']
            if resume_file.filename != '':
                reader = PdfReader(resume_file)
                for page in reader.pages:
                    resume_text += page.extract_text() + " "
                    
        # 4. New Google GenAI Call
        ai_tips = ""
        try:
            if not GEMINI_API_KEY:
                raise ValueError("API Key missing")
            
            if resume_text.strip():
                prompt = f"A student has a {confidence_score}% placement chance. Here is their resume text: {resume_text[:1500]}. Analyze this resume and give 3 short, bulleted actionable tips to improve their placement chances based on their skills."
            else:
                prompt = f"A student with {data.get('degree_p')}% in degree, {data.get('mba_p')}% in MBA, and employability score of {data.get('etest_p')}% has a {confidence_score}% chance to be '{result}' for campus placement. Give 3 very short, bulleted, and personalized career tips."
            
           # Using the absolute latest Enterprise Model (Gemini 3.6 Flash)
            response = ai_client.models.generate_content(
                model='gemini-3.6-flash',
                contents=prompt
            )
            ai_tips = response.text
        except Exception as e:
            print(f"Gemini status: {e}")
            ai_tips = "• Master core data structures and problem-solving.\n• Build practical projects.\n• Practice mock interviews."
        
        return jsonify({
            'status': 'success', 
            'prediction': result, 
            'confidence_score': confidence_score,
            'resume_text': resume_text,
            'ai_recommendations': ai_tips
        })
        
    except Exception as e:
        print(f"Main Error: {e}")
        return jsonify({'status': 'error', 'message': str(e)})

if __name__ == '__main__':
    app.run(debug=True, port=5000)