from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # CORS 활성화


@app.route('/mao', methods=['POST'])
def process_data():
    data = request.json
    # 받은 데이터 처리
    table = data.get('table', None)
    # 데이터 처리 로직 추가

    # 처리된 데이터 응답
    response_data = {'processed_table': table}
    return jsonify(response_data)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)

# http://127.0.0.1:8000/mao