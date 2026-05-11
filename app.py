from flask import Flask, render_template, request, flash, get_flashed_messages, redirect, url_for, abort, jsonify
from models.students import students_table, load_students, create_student, update_student_details, delete_student
import os
from dotenv import load_dotenv
import time
import json

load_dotenv()

app = Flask(__name__)

app.secret_key = os.environ.get("SECRET_KEY")


subject_options = ["English", "Mathematics", "Afrikaans", "Life Orientation", "Physical Education", "Natural Sciences", "Social Sciences"]

students_table()


def serialize_subjects(subjects):
    return json.dumps([subject.strip() for subject in subjects if subject.strip()])


def deserialize_subjects(subjects):
    try:
        parsed_subjects = json.loads(subjects)
    except (TypeError, json.JSONDecodeError):
        parsed_subjects = subjects

    if isinstance(parsed_subjects, list):
        return [subject.strip() for subject in parsed_subjects if subject.strip()]

    if isinstance(parsed_subjects, str):
        return [subject.strip() for subject in parsed_subjects.split(",") if subject.strip()]

    return []


@app.route("/")
@app.route("/home")
def home_page():
    return render_template("home.html")


@app.route("/students")
def students_page():
    return render_template("students.html")


@app.route("/api/students", methods=["GET"])
def load_students_route():
    students = load_students()
    return jsonify(students)


@app.route("/add_student")
def add_student_page():
    return render_template("add_student.html", subject_options=subject_options)


@app.route("/api/add_student", methods=["POST"])
def add_student_route():
    data = request.get_json()

    student_name = data.get("student_name")
    student_date_of_birth = data.get("student_date_of_birth")
    student_grade = data.get("student_grade")
    student_subjects = serialize_subjects(data.get("student_subjects", []))
    created_at = time.strftime("%Y-%m-%d %H:%M:%S")

    if student_name and student_date_of_birth and student_grade and deserialize_subjects(student_subjects):
        flash(f"{student_name} has been added.", "success")
        create_student(student_name, student_date_of_birth, student_grade, student_subjects, created_at)
        return jsonify({"message": "Student added successfully."}), 201
    
    return jsonify({"error": "Failed to add student"})


@app.route("/api/student/edit/<int:student_id>", methods=["GET", "POST"])
def edit_student_route(student_id):
    
    students = load_students()
    student = next((item for item in students if item.get("student_id") == student_id), None)

    if student is None:
        abort(404)

    if request.method == "POST":
        name = request.form.get("student_name", "")
        date_of_birth = request.form.get("date_of_birth", "")
        grade = request.form.get("grade", "")
        subjects = serialize_subjects(request.form.getlist("subjects"))

        if name and date_of_birth and grade and deserialize_subjects(subjects):
            update_student_details(name, date_of_birth, grade, subjects, student_id)
            flash('Successfully updated.', 'success')
            return redirect(url_for('edit_student_route', student_id=student_id))
        
        else: 
            flash('Invalid Input!', 'error')
    selected_subjects = deserialize_subjects(student["subjects"])

    return render_template('edit_student.html', student=student, selected_subjects=selected_subjects, subject_options=subject_options)


@app.route("/api/student/delete/<int:student_id>", methods=["POST"])
def delete_student_route(student_id):
    students = load_students()
    student = next((item for item in students if item.get("student_id") == student_id), None)

    if student is None:
        abort(404)

    delete_student(student_id)
    flash(f'{student["name"]} successfully deleted', 'success')

    return redirect(url_for('students_page'))

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
