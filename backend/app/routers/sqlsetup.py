import pymysql

conn = pymysql.connect(
    host = 'localhost',
    # host='host.docker.internal',
    user='root',
    password='admin',
    charset='utf8mb4',
    db="dataplatform"
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
    