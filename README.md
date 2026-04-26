# Student Management Program

A small Flask web app for creating, viewing, editing, and deleting student records with SQLite.

## Overview

This project provides a simple student management workflow through a browser-based interface. Student records are stored locally in `student.db`, and the application creates the database table automatically when the app starts.

## Features

- Add new students
- View all students in a table
- Edit existing student records
- Delete student records
- Flash success and error messages
- Return `404` for invalid student edit or delete links

## Tech Stack

- Python
- Flask
- SQLite
- Jinja2
- `python-dotenv`

## Project Structure

```text
Student_management_program/
|-- app.py
|-- models/
|   `-- students.py
|-- static/
|   |-- script.js
|   `-- style.css
|-- templates/
|   |-- add_student.html
|   |-- base.html
|   `-- edit_student.html
|-- requirements.txt
|-- .env
|-- .gitignore
`-- student.db
```

## Requirements

- Python 3.x
- `pip`

## Setup

1. Clone the repository or open the project folder.
2. Create a virtual environment:

```powershell
python -m venv venv
```

3. Activate the virtual environment:

```powershell
.\venv\Scripts\Activate.ps1
```

4. Install dependencies:

```powershell
pip install -r requirements.txt
```

5. Create a `.env` file in the project root:

```env
SECRET_KEY=your-secret-key
```

## Running the App

Start the Flask app with:

```powershell
python app.py
```

Then open:

```text
http://127.0.0.1:5000
```

## Routes

- `/`
  Displays the add-student form and the full student list.
- `/edit/student/<student_id>`
  Opens the edit page for a student and saves updates.
- `/delete/student/<student_id>`
  Deletes the selected student record.

## Data Model

Each student record contains:

- `student_id`
- `name`
- `date_of_birth`
- `grade`
- `subjects`
- `created_at`

## Notes

- The app uses a local SQLite database file: `student.db`.
- `student.db` is ignored by Git.
- `.env` is ignored by Git and should not be committed.
- The app currently runs in debug mode for local development.
- The subject field requires the user to choose a valid subject before submission.
- Static frontend assets live in the `static/` folder.

## Current Limitations

- Delete is still handled through a GET route instead of a POST form.
- There are no automated tests yet.
- The UI is functional but still minimal.

## Future Improvements

- Move delete actions to POST with CSRF protection
- Improve styling and layout
- Add stronger validation messages
- Add automated tests for routes and database behavior
- Add search and filtering for student records
