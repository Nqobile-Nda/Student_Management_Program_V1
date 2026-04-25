from flask import Flask, render_template, request, flash, get_flashed_messages
from models.students import students_table, load_students, create_student, update_student_details, delete_student
import os
from dotenv import load_dotenv
import time

load_dotenv()

app = Flask(__name__)

app.secret_key = os.environ.get("SECRET_KEY")

@app.route("/", methods=["GET", "POST"])
def add_student_route():
    students = load_students()

    if request.method == "POST":
        student_name = request.form.get("student_name", "")
        student_date_of_birth = request.form.get("student_date_of_birth", "")
        student_grade =  request.form.get("student_grade", "")
        student_subjects = request.form.get("student_subjects")
        created_at = time.strftime("%Y-%m-%d %H:%M:%S")

        if student_name:
            flash(f"{student_name} has been added.", "success")
            create_student(student_name, student_date_of_birth, student_grade, student_subjects, created_at)
        else: 
            flash(f"No nam entered", "error")

    return render_template("add_student.html", students=students)


app.run(debug=True)