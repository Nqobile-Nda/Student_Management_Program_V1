document.addEventListener("DOMContentLoaded", async () => {
    const flashContainer = document.getElementById("flash-container");
    const studentsTableBody = document.getElementById("students-table-body");

    if (flashContainer) {
        setTimeout(() => {
            flashContainer.style.display = "none";
        }, 3000);
    }


    async function load_students() {
        const response = await fetch('/api/students');
        const students = await response.json();
        return students;
    }

    const students = await load_students();


    const students_table_body = document.getElementById("students-table-body");
    function studentTable(students) {
        if (!students.length) {
            students_table_body.innerHTML = `
            <tr>
                <td colspan="8">No students added.</td>
            </tr>
            `;
            return;
        }

        students_table_body.innerHTML = students.map((student) => `
            <tr>
                <td>${student.student_id}</td>
                <td>${student.name}</td>
                <td>${student.date_of_birth}</td>
                <td>${student.grade}</td>
                <td>${student.subjects}</td>
                <td>${student.created_at}</td>
                <td><a href="/student/edit/${student.student_id}">Edit</a></td>
                <td><a href="/student/delete/${student.student_id}">Delete</a></td>
            </tr>
        `).join("");
    }
    
    studentTable(students);
});
