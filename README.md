# Student Management Program

A simple Flask application for adding and viewing student records in a local SQLite database.

## Features

- Add a student with name, date of birth, grade, and subject
- Store records in `student.db`
- Display saved students in a table on the main page
- Show flash messages after form submission

## Tech Stack

- Python
- Flask
- SQLite
- Jinja2 templates
- `python-dotenv` for environment variables

## Project Structure

```text
Student_management_program/
|-- app.py
|-- models/
|   `-- students.py
|-- templates/
|   |-- add_student.html
|   `-- base.html
|-- requirements.txt
|-- .env
`-- student.db
```

## Setup

1. Create and activate a virtual environment.

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

2. Install dependencies.

```powershell
pip install -r requirements.txt
```

3. Create a `.env` file in the project root.

```env
SECRET_KEY=your-secret-key
```

4. Run the app.

```powershell
python app.py
```

5. Open the local site in your browser.

```text
http://127.0.0.1:5000
```

## How It Works

- The `/` route displays the student form and the current student list.
- When the form is submitted, the app saves the record to SQLite.
- The database table is created automatically if it does not already exist.

## Notes

- The database file `student.db` is local and is ignored by Git.
- The `.env` file is also ignored by Git and should not be committed.
- The current app supports creating and listing students. Update and delete helpers exist in `models/students.py`, but they are not yet connected to the UI.

## Future Improvements

- Add edit and delete actions in the interface
- Improve form validation and error messages
- Add styling for a better user experience
- Add tests for routes and database logic
