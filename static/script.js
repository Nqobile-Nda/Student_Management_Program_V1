document.addEventListener("DOMContentLoaded", async () => {

    async function loadStudents() {
        const response = await fetch('/api/students');
        const students = await response.json();
        return students;
    }


    async function loadStudent(studentId) {
        const response = await fetch(`/api/student/edit/${studentId}`);
        const student = await response.json();
        return student;
    }


    function parseSubjects(subjects) {
        return JSON.parse(subjects);
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
                    <td>${parseSubjects(student.subjects).join(", ")}</td>
                    <td>${student.created_at}</td>
                    <td><a href="/student/edit/${student.student_id}">Edit</a></td>
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

        if (subjectDisplay && subjectDialog && modalConfirmSubjectsBtn && modalCloseSubjectsBtn) {

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


    const editStudentForm = document.getElementById("edit-student-form");
    const editSubjectDisplay = document.getElementById("edit-subject-display");
    const editStudentSubjectModal = document.getElementById("edit-student-subject-modal");
    const editModalConfirmSubjectsBtn = document.getElementById("edit-modal-confirm-subjects-btn");
    const editModalCloseSubjectsBtn = document.getElementById("edit-modal-close-subjects-btn");
 
    if (editStudentForm) {   
        const studentId = editStudentForm.dataset.studentId;
        const editSubjects = document.querySelectorAll('[name="student_subjects"]');

        function selectedEditedSubjects() {
            return Array.from(editSubjects)
                .filter((checkbox) => checkbox.checked)
                .map((checkbox) => checkbox.value);
        }

        const student = await loadStudent(studentId);
        const studentSubjects = parseSubjects(student.subjects);

        editStudentForm.student_id.value = student.student_id;
        editStudentForm.student_name.value = student.name;
        editStudentForm.student_date_of_birth.value = student.date_of_birth;
        editStudentForm.student_grade.value = student.grade;
        editStudentForm.created_at.value = student.created_at;
        editSubjectDisplay.value = studentSubjects.join(", ");

        editSubjects.forEach((checkbox) => {
            checkbox.checked = studentSubjects.includes(checkbox.value);
        });
        
        editSubjectDisplay.addEventListener("click", () => {
            editStudentSubjectModal.showModal();
        });

        editModalConfirmSubjectsBtn.addEventListener("click", () => {
            const selected = selectedEditedSubjects();

            editSubjectDisplay.value = selected.join(", ");
            editStudentSubjectModal.close();
        });

        editModalCloseSubjectsBtn.addEventListener("click", () => {
            editStudentSubjectModal.close();
        });

        editStudentForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const data = {
                student_name: editStudentForm.student_name.value,
                student_date_of_birth: editStudentForm.student_date_of_birth.value,
                student_grade: editStudentForm.student_grade.value,
                student_subjects: selectedEditedSubjects()
            };

            const response = await fetch(`/api/student/edit/${studentId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                window.location.href = "/students";
            }
        });
    }

    const addSubjectButton = document.getElementById("add-subject-button");

    if (addSubjectButton) {
        addSubjectButton.addEventListener("click", () => {
            window.location.href = "/add_subject";
        });
    }

    const addSubjectForm = document.getElementById("add-subject-form");
    const subjectNames = document.querySelector("[name='subject_input']");

    if (addSubjectForm) {
        addSubjectForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const data = {
                "subject": addSubjectForm.subject_input.value
            };

            const response = await fetch("/api/add_subject", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });
        });
    }
    await renderStudents();
});
