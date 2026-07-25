import psycopg2

try:
    conn = psycopg2.connect(
        host="127.0.0.1",
        port="5433",
        database="pharma_complaint_db",
        user="postgres",
        password="Dhawan00@"
    )

    print("✅ Connected Successfully!")

    conn.close()

except Exception as e:
    print("❌ Connection Failed")
    print(e)