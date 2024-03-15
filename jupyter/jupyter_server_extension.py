

# 요청 처리 코드
def handle_request(request):
    # 데이터 추출
    data = request.json()

    # 데이터 처리
    # ...

    # 응답 생성
    response = {"status": "success"}

    # 응답 반환
    return json.dumps(response)

# 확장자 등록
app = jupyter_server_proxy.JupyterServerProxyApp()
app.add_route("/api/data", handle_request)
app.start()