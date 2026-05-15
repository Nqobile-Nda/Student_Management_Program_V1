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
    grade TEXT NOT NULL UNIQUE,
    grade_student_count TEXT NOT NULL
    );
    """)


    grades = [8, 9, 10, 11, 12]
    for grade in grades:

        cur.execute("""
        INSERT OR IGNORE INTO grades_table (grade) VALUES (?)
        """, (grade,))

    conn.commit()
    conn.close()


def load_grades():
    conn, cur = database_connection()
    cur.execute("""
    SELECT * FROM grades_table
    """)
    grade_options = [dict(row) for row in cur.fetchall()]

    conn.close()
    return grade_options