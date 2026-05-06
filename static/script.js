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

    async function renderStudents() {
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
    }


    const studentForm = document.getElementById("student-form");
    if (studentForm) {
 
        const subjectDisplay = document.getElementById("subject-display");
        const subjectDialog = document.getElementById("subject-dialog");
        const modalConfirmSubjectsBtn = document.getElementById("modal-confirm-subjects-btn");
        const modalCloseSubjectsBtn = document.getElementById("modal-close-subjects-btn");

        if (
            subjectDisplay &&
            subjectDialog &&
            modalConfirmSubjectsBtn &&
            modalCloseSubjectsBtn
        ) {
            const subjects = document.querySelectorAll('[name="student_subjects"]');

            function selectedSubjects() {
                const selectedSubjects = Array.from(subjects)
                    .filter((checkbox) => checkbox.checked)
                    .map((checkbox) => checkbox.value);
                return selectedSubjects;
            }

            subjectDisplay.addEventListener("click", () => {
                subjectDialog.showModal();
            });

            modalConfirmSubjectsBtn.addEventListener("click", () => {

                const selected = selectedSubjects();
                subjectDisplay.value = selected.join(", ");
                subjectDialog.close();
            });

            modalCloseSubjectsBtn.addEventListener("click", () => {
                subjectDialog.close();
            });

            async function addStudent() {
                const data = {
                    student_name: studentForm.student_name.value,
                    student_date_of_birth: studentForm.student_date_of_birth.value,
                    student_grade: studentForm.student_grade.value,
                    student_subjects: selectedSubjects()
                };

                const response = await fetch("/api/add_student", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
                });
                return response;
            };

            studentForm.addEventListener("submit", async (event) => {
                event.preventDefault();

                await addStudent();
                
                studentForm.reset();
                await renderStudents();
            });
        }
    }
    await renderStudents();
});
