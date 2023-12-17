from flask import Flask, jsonify
from flask_cors import CORS
import requests
import random

app = Flask(__name__)
CORS(app)

def fetch_question():
    try:
        api_url = 'https://opentdb.com/api.php?amount=1&type=multiple'
        response = requests.get(api_url)
        response.raise_for_status()  #raises an error

        data = response.json()
        question_data = data['results'][0]

        question = question_data['question']
        incorrect_answers = question_data['incorrect_answers']
        correct_answer = question_data['correct_answer']

        answer_choices = random.sample(incorrect_answers + [correct_answer], k=4)

        return {
            'question': question,
            'answer_choices': answer_choices,
            'correct_answer': correct_answer
        }
    except requests.exceptions.RequestException as e:
        return {'error': f"Request error: {str(e)}"}

@app.route('/get_question', methods=['GET'])
def get_question():
    question_data = fetch_question()
    return jsonify(question_data)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
