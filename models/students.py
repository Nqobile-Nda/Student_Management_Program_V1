import sqlite3

def database_connection():
    conn = sqlite3.connect("student.db")
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()
    return conn, cur


def students_table():
    conn, cur = database_connection()
    cur.execute("""
    CREATE TABLE IF NOT EXISTS students_table (
    student_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    date_of_birth TEXT NOT NULL,
    grade TEXT NOT NULL,
    subjects TEXT NOT NULL,
    created_at TEXT NOT NULL
    );
    """)

    conn.commit()
    conn.close()


def load_students():
    students_table()
    conn, cur = database_connection()
    cur.execute("SELECT * FROM students_table")
    students = [dict(row) for row in cur.fetchall()]

    conn.close()
    return students
    

def create_student(name, date_of_birth, grade, subjects, created_at):
    students_table()
    conn, cur = database_connection()
    cur.execute("""
    INSERT INTO students_table (name, date_of_birth, grade, subjects, created_at) VALUES (?,?,?,?,?)
    """, (name, date_of_birth, grade, subjects, created_at))

    conn.commit()
    conn.close()


def update_student_details(name, date_of_birth, grade, subjects, student_id):
    students_table()
    conn, cur = database_connection()
    cur.execute("""
    UPDATE students_table SET name=?, date_of_birth=?, grade=?, subjects=? WHERE student_id=?
    """, (name, date_of_birth, grade, subjects, student_id))

    conn.commit()
    conn.close()


def delete_student(student_id):
    students_table()
    conn, cur = database_connection()
    cur.execute("""
    DELETE FROM students_table WHERE student_id=?
    """, (student_id,))

    conn.commit()
    conn.close()