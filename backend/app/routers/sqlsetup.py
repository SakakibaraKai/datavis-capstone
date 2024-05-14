import pymysql

rds_host = 'capstone-database.c5ys4ks8sbyz.us-west-2.rds.amazonaws.com'
rds_port = 3306
rds_user = 'admin'  # 사용자명 입력
rds_password = 'capstone'  # 비밀번호 입력
rds_database = 'capstone'  # 데이터베이스 이름 입력

conn = pymysql.connect(
    host=rds_host,
    port=rds_port,
    user=rds_user,
    password=rds_password,
    database=rds_database
)

def execute_query(query, params=None):
    with conn.cursor() as cursor:
        try:
            cursor.execute(query, params)
            if query.strip().upper().startswith('INSERT') or query.strip().upper().startswith('UPDATE') or query.strip().upper().startswith('DELETE'):
                conn.commit()
                return False, "successfull query"
            else:
                result = cursor.fetchall()
                return result
        except pymysql.Error as e:
            return True, f"Error type: {type(e).__name__}"

        
#CREATE USER TABLE IF IT DOESN'T ALREADY EXIST
execute_query(
    """
        CREATE TABLE IF NOT EXISTS user (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            name VARCHAR(255),
            password VARCHAR(255)
        )
    """
)

    
