import sqlite3

def database_connection():
    conn = sqlite3.connect("student.db")
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()
    return conn, cur

def grade_table():
    conn, cur = database_connection()
    cur.execute("""
    CREATE TABLE IF NOT EXISTS grades_table (
    grade_id INTEGER PRIMARY KEY AUTOINCREMENT,
    grade TEXT NOT NULL
    );
    """)

    grades = [8, 9, 10, 11, 12]
    for grade in grades:
        cur.execute("""
        IF NOT EXISTS grades_table INSERT INTO grades_table (grade) VALUES (?)
        """, (grade,))

    conn.commit()
    conn.close()