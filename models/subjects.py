import sqlite3

def database_connection():
    conn = sqlite3.connect("student.db")
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()
    return conn, cur    


def subjects_table():
    conn, cur = database_connection()
    cur.execute("""
    CREATE TABLE IF NOT EXISTS subjects_table (
    subject_id INTEGER PRIMARY KEY AUTOINCREMENT,
    subject_name TEXT NOT NULL
    );
    """)

    conn.commit()
    conn.close()


def load_subjects():
    conn, cur = database_connection()
    cur.execute("""
    SELECT * FROM subjects_table
    """)
    subject_options = [dict(row) for row in cur.fetchall()]
    conn.close()
    return subject_options


def add_subject(subject_name):
    conn, cur = database_connection()
    cur.execute("""
    INSERT INTO subjects_table (subject_name) VALUES (?)
    """, (subject_name,))

    conn.commit()
    conn.close()

