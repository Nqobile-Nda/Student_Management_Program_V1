document.addEventListener("DOMContentLoaded", async () => {
    const flashContainer = document.getElementById("flash-container");

    if (flashContainer) {
        setTimeout(() => {
            flashContainer.style.display = "none";
        }, 3000);
    }


    async function loadStudents() {
        const response = await fetch('/api/students');
        const students = await response.json();
        return students;
    }


    const addStudentForm = document.getElementById("add-student-form");
    if (addStudentForm) {
    addStudentForm.addEventListener("submit", (event) => {
        event.preventDefault();
    });
    }

    const subjectOptionsDisplay = document.getElementById("subject-options-display");
    const subjectOptionsDialog = document.getElementById("subject-options-dialog");
    const submitSubjectOptions = document.getElementById("submit-subject-options");
    const closeSubjectOptions = document.getElementById("close-subject-options");

    if (
        subjectOptionsDisplay &&
        subjectOptionsDialog &&
        submitSubjectOptions &&
        closeSubjectOptions
    ) {
        const subjectCheckboxes = subjectOptionsDialog.querySelectorAll('input[name="student_subjects"]');

        function updateSubjectDisplay() {
            const selectedSubjects = Array.from(subjectCheckboxes)
                .filter((checkbox) => checkbox.checked)
                .map((checkbox) => checkbox.value);

            subjectOptionsDisplay.value = selectedSubjects.join(", ");
        }

        subjectOptionsDisplay.addEventListener("click", () => {
            subjectOptionsDialog.showModal();
        });

        submitSubjectOptions.addEventListener("click", () => {
            updateSubjectDisplay();
            subjectOptionsDialog.close();
        });

        closeSubjectOptions.addEventListener("click", () => {
            subjectOptionsDialog.close();
        });

        subjectCheckboxes.forEach((checkbox) => {
            checkbox.addEventListener("change", updateSubjectDisplay);
        });
    }


    const studentsTableBody = document.getElementById("students-table-body");
    const studentCount = document.getElementById("student-count");

    if (studentCount && studentsTableBody) {
        const students = await loadStudents();
        studentCount.innerHTML = `Students(${students.length})`

        if (!students.length) {
            studentsTableBody.innerHTML = `
            <tr>
                <td colspan="8">No students added.</td>
            </tr>
            `;
            return;
        }

        studentsTableBody.innerHTML = students.map((student) => `
            <tr>
                <td>${student.student_id}</td>
                <td>${student.name}</td>
                <td>${student.date_of_birth}</td>
                <td>${student.grade}</td>
                <td>${student.subjects}</td>
                <td>${student.created_at}</td>
                <td><a href="/api/student/edit/${student.student_id}">Edit</a></td>
                <td>
                    <form method="POST" action="/api/student/delete/${student.student_id}">
                        <button type="submit">Delete</button>
                    </form>
                </td>
            </tr>
        `).join("");
    }

});
