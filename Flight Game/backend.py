from flask import Flask, jsonify, Response, request
from flask_cors import CORS
import requests
import random
import json
import mysql.connector

app = Flask(__name__)
CORS(app)


def connect_db():
    return mysql.connector.connect(
        host='127.0.0.1',
        port=3306,
        database='flight_game',
        user='root',
        password='Rst100',
        autocommit=True
    )


def fetch_question():
    try:
        api_url = 'https://opentdb.com/api.php?amount=1&type=multiple'
        response = requests.get(api_url)
        response.raise_for_status()  # Raise an HTTPError for bad responses

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


@app.route("/location/", methods=["GET"])
def location():
    connection = connect_db()  # Establish a database connection
    cursor = connection.cursor()
    randomNumebr = random.randint(2, 4000)

    sql = "SELECT latitude_deg, longitude_deg FROM airport"
    sql += " WHERE id = '" + str(randomNumebr) + "'"

    cursor.execute(sql)
    result_set = cursor.fetchall()

    if result_set:
        # Assuming there is only one result, you can simplify the loop
        latitude, longitude = result_set[0]
        answer = {"Latitude": latitude, "Longitude": longitude}
        response_json = json.dumps(answer)
        return Response(response=response_json, status=200, mimetype="application/json")
    else:
        return {'wrong_name': "Give me a correct name"}


if __name__ == '__main__':
    app.run(debug=True, port=5000)
