import sqlite3

def database_connection():
    conn = sqlite3.connect("students.db")
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()
    return conn, cur    


def create_subjects_table():
    conn, cur = database_connection()
    cur.execute("""
    CREATE TABLE IF NOT EXISTS subjects_table (
    subject_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
    );
    """)

    conn.commit()
    conn.close()