from flask import Flask, render_template, request, flash, get_flashed_messages, redirect, url_for, abort
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

        if student_name and student_date_of_birth and student_grade and student_subjects:
            flash(f"{student_name} has been added.", "success")
            create_student(student_name, student_date_of_birth, student_grade, student_subjects, created_at)
            return redirect(url_for("add_student_route"))
        
        else: 
            flash(f"Invalid input", "error")

    return render_template("add_student.html", students=students)


@app.route("/edit/student/<int:student_id>", methods=["GET", "POST"])
def edit_student_details_route(student_id):
    
    students = load_students()
    student = next((item for item in students if item.get("student_id") == student_id), None)

    if student is None:
        abort(404)

    if request.method == "POST":
        name = request.form.get("student_name", "")
        date_of_birth = request.form.get("date_of_birth", "")
        grade = request.form.get("grade", "")
        subjects = request.form.get("subjects", "")

        if name and date_of_birth and grade and subjects:
            update_student_details(name, date_of_birth, grade, subjects, student_id)
            flash('Successfully updated.', 'success')
            return redirect(url_for('edit_student_details_route', student_id=student_id))
        
        else: 
            flash('Invalid Input!', 'error')
    return render_template('edit_student.html', student=student)


@app.route("/delete/student/<int:student_id>")
def delete_student_route(student_id):
    students = load_students()
    student = next((item for item in students if item.get("student_id") == student_id), None)

    if student is None:
        abort(404)

    delete_student(student_id)
    flash(f'{student["name"]} successfully deleted', 'success')
    return redirect(url_for('add_student_route'))

if __name__ == "__main__":
    app.run(debug=True)
