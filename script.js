/*
====================================================
 NOVA COLLEGE - MAIN SCRIPT
====================================================

FLOW:

Admission
   ↓
POST /api/register
   ↓
MongoDB
   ↓
Login
   ↓
POST /api/login
   ↓
localStorage
   ↓
Student Dashboard

STUDENT INFORMATION:

Student Information Page
   ↓
GET /api/student-information
   ↓
MongoDB

Add / Edit / Delete
   ↓
Student Information
====================================================
*/


document.addEventListener("DOMContentLoaded", function () {

    console.log("Nova College JavaScript loaded");


    /*
    ====================================================
    ADMISSION FORM
    ====================================================
    */

    const admissionForm =
        document.getElementById("admissionForm");


    if (admissionForm) {

        admissionForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


                const submitButton =
                    admissionForm.querySelector(
                        'button[type="submit"]'
                    );


                if (submitButton) {

                    submitButton.disabled = true;

                    submitButton.textContent =
                        "Submitting...";

                }


                try {

                    const formData =
                        new FormData(admissionForm);


                    const name =
                        formData.get("name")?.trim();

                    const email =
                        formData.get("email")?.trim().toLowerCase();

                    const password =
                        formData.get("password");


                    /*
                    Basic validation
                    */

                    if (!name || !email || !password) {

                        throw new Error(
                            "Name, email and password are required."
                        );

                    }


                    /*
                    Send admission to Node.js
                    */

                    const response = await fetch(
                        "/api/register",
                        {
                            method: "POST",
                            body: formData
                        }
                    );


                    const data =
                        await response.json();


                    if (!response.ok || !data.success) {

                        throw new Error(
                            data.message ||
                            "Admission submission failed."
                        );

                    }


                    console.log(
                        "Admission successful:",
                        data
                    );


                    alert(
                        "Admission submitted successfully!\n\n" +
                        "You can now login to your student account."
                    );


                    /*
                    Go to login
                    */

                    window.location.href =
                        "/loginform.html?registered=1";


                } catch (error) {

                    console.error(
                        "Admission error:",
                        error
                    );


                    alert(
                        error.message ||
                        "Admission failed. Please try again."
                    );


                    if (submitButton) {

                        submitButton.disabled = false;

                        submitButton.textContent =
                            "Submit Admission";

                    }

                }

            }
        );

    }



    /*
    ====================================================
    PAYMENT FORM
    ====================================================
    */

    const paymentForm =
        document.getElementById("paymentForm");


    if (paymentForm) {

        paymentForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


                const paymentButton =
                    paymentForm.querySelector(
                        'button[type="submit"]'
                    );


                if (paymentButton) {

                    paymentButton.disabled = true;

                    paymentButton.textContent =
                        "Processing...";

                }


                try {

                    const formData =
                        new FormData(paymentForm);


                    const paymentData = {

                        name:
                            formData.get("name") ||
                            formData.get("fullName") ||
                            "",

                        email:
                            formData.get("email") ||
                            "",

                        phone:
                            formData.get("phone") ||
                            formData.get("mobile") ||
                            "",

                        amount:
                            formData.get("amount") ||
                            "",

                        paymentMethod:
                            formData.get("paymentMethod") ||
                            ""

                    };


                    const response = await fetch(
                        "/api/payment",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(paymentData)
                        }
                    );


                    const data =
                        await response.json();


                    if (!response.ok || !data.success) {

                        throw new Error(
                            data.message ||
                            "Payment request failed."
                        );

                    }


                    alert(
                        data.message ||
                        "Payment request created successfully."
                    );


                    console.log(
                        "Payment:",
                        data
                    );


                } catch (error) {

                    console.error(
                        "Payment error:",
                        error
                    );


                    alert(
                        error.message ||
                        "Payment failed."
                    );

                } finally {

                    if (paymentButton) {

                        paymentButton.disabled = false;

                        paymentButton.textContent =
                            "Pay Now";

                    }

                }

            }
        );

    }



    /*
    ====================================================
    STUDENT DASHBOARD
    ====================================================
    */

    const studentDashboard =
        document.getElementById("studentDashboard");


    if (studentDashboard) {

        loadStudentDashboard();

    }



    /*
    ====================================================
    LOGOUT
    ====================================================
    */

    const logoutButton =
        document.getElementById("logoutButton");


    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            function () {

                localStorage.removeItem("student");

                window.location.replace(
                    "/loginform.html"
                );

            }
        );

    }



    /*
    ====================================================
    STUDENT INFORMATION PAGE
    ====================================================
    */

    const studentForm =
        document.getElementById("studentForm");


    const studentTableBody =
        document.getElementById("studentTableBody");


    /*
    If student-information.html is open,
    load all students.
    */

    if (studentForm || studentTableBody) {

        loadStudentInformation();

    }



    /*
    ====================================================
    STUDENT INFORMATION FORM
    ====================================================
    */

    if (studentForm) {

        studentForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();

                await saveStudentInformation();

            }
        );

    }

});



/*
====================================================
 LOAD STUDENT DASHBOARD
====================================================
*/

async function loadStudentDashboard() {

    const message =
        document.getElementById("dashboardMessage");


    try {

        const rawStudent =
            localStorage.getItem("student");


        /*
        User is not logged in
        */

        if (!rawStudent) {

            if (message) {

                message.innerHTML =
                    'Please login first. <a href="/loginform.html">Login here</a>.';

            }

            return;

        }


        let student;


        try {

            student =
                JSON.parse(rawStudent);

        } catch (error) {

            console.error(
                "Invalid student data:",
                error
            );


            localStorage.removeItem("student");


            window.location.replace(
                "/loginform.html"
            );


            return;

        }


        /*
        Student identifier
        */

        const studentId =
            student._id ||
            student.id ||
            student.studentId ||
            student.email;


        if (!studentId) {

            throw new Error(
                "Student account information is missing."
            );

        }


        /*
        First display information
        immediately from localStorage.
        */

        displayStudentData(student);


        /*
        Then get latest information
        from MongoDB through Node.js.
        */

        const response = await fetch(
            "/api/student/dashboard?student=" +
            encodeURIComponent(studentId)
        );


        if (!response.ok) {

            console.warn(
                "Dashboard API returned:",
                response.status
            );

            return;

        }


        const data =
            await response.json();


        if (!data.success) {

            console.warn(
                "Dashboard API:",
                data.message
            );

            return;

        }


        /*
        Update localStorage with
        latest student data.
        */

        if (data.student) {

            localStorage.setItem(
                "student",
                JSON.stringify(data.student)
            );


            displayStudentData(
                data.student
            );

        }


        /*
        Display additional dashboard data
        */

        if (data.dashboard) {

            displayDashboardInfo(
                data.dashboard
            );

        }


    } catch (error) {

        console.error(
            "Dashboard error:",
            error
        );


        if (message) {

            message.textContent =
                "Unable to load some dashboard information.";

        }

    }

}



/*
====================================================
 DISPLAY STUDENT DATA
====================================================
*/

function displayStudentData(student) {

    const name =
        student.name ||
        student.fullName ||
        student.studentName ||
        "Student";


    const email =
        student.email ||
        "Not available";


    const phone =
        student.phone ||
        student.mobile ||
        "Not available";


    const course =
        student.course ||
        student.program ||
        student.programName ||
        "Not available";


    const studentId =
        student.studentId ||
        student.rollNumber ||
        student.rollNo ||
        student._id ||
        student.id ||
        "Not assigned";


    /*
    Welcome name
    */

    const studentName =
        document.getElementById("studentName");


    if (studentName) {

        studentName.textContent =
            name;

    }


    /*
    Profile name
    */

    const profileName =
        document.getElementById("profileName");


    if (profileName) {

        profileName.textContent =
            name;

    }


    /*
    Email
    */

    const profileEmail =
        document.getElementById("profileEmail");


    if (profileEmail) {

        profileEmail.textContent =
            email;

    }


    /*
    Phone
    */

    const profilePhone =
        document.getElementById("profilePhone");


    if (profilePhone) {

        profilePhone.textContent =
            phone;

    }


    /*
    Course
    */

    const profileCourse =
        document.getElementById("profileCourse");


    if (profileCourse) {

        profileCourse.textContent =
            course;

    }


    /*
    Student ID
    */

    const profileId =
        document.getElementById("profileId");


    if (profileId) {

        profileId.textContent =
            studentId;

    }


    /*
    Avatar initials
    */

    const studentInitials =
        document.getElementById(
            "studentInitials"
        );


    if (studentInitials) {

        const initials =
            name
                .trim()
                .split(/\s+/)
                .slice(0, 2)
                .map(function (word) {

                    return word.charAt(0);

                })
                .join("")
                .toUpperCase();


        studentInitials.textContent =
            initials || "N";

    }

}



/*
====================================================
 DISPLAY DASHBOARD INFORMATION
====================================================
*/

function displayDashboardInfo(dashboard) {


    /*
    Attendance
    */

    const attendance =
        document.querySelector(
            "#attendance .big-number"
        );


    if (
        attendance &&
        dashboard.attendance !== undefined &&
        dashboard.attendance !== null
    ) {

        attendance.textContent =
            dashboard.attendance + "%";

    }


    /*
    GPA
    */

    const gpa =
        document.querySelector(
            "#results .big-number"
        );


    if (
        gpa &&
        dashboard.gpa !== undefined &&
        dashboard.gpa !== null
    ) {

        gpa.textContent =
            dashboard.gpa;

    }


    /*
    Fee balance
    */

    const fees =
        document.querySelector(
            "#fees .big-number"
        );


    if (
        fees &&
        dashboard.feeBalance !== undefined &&
        dashboard.feeBalance !== null
    ) {

        fees.textContent =
            "Rs. " +
            Number(dashboard.feeBalance).toLocaleString();

    }

}



/*
====================================================
 STUDENT INFORMATION
====================================================

This section works with:

GET
/api/student-information

POST
/api/student-information

PUT
/api/student-information/:id

DELETE
/api/student-information/:id

====================================================
*/



/*
====================================================
 LOAD STUDENT INFORMATION
====================================================
*/

async function loadStudentInformation() {

    const tableBody =
        document.getElementById(
            "studentTableBody"
        );


    if (!tableBody) {

        return;

    }


    tableBody.innerHTML = `
        <tr>
            <td colspan="8" class="loading">
                Loading students...
            </td>
        </tr>
    `;


    try {

        const response =
            await fetch(
                "/api/student-information"
            );


        const data =
            await response.json();


        if (!response.ok || !data.success) {

            throw new Error(
                data.message ||
                "Unable to load students."
            );

        }


        tableBody.innerHTML = "";


        if (
            !data.students ||
            data.students.length === 0
        ) {

            tableBody.innerHTML = `
                <tr>
                    <td colspan="8" class="loading">
                        No students found.
                    </td>
                </tr>
            `;

            return;

        }


        data.students.forEach(
            function (student) {

                const row =
                    document.createElement("tr");


                row.innerHTML = `

                    <td>
                        ${escapeHtml(
                            student.name || ""
                        )}
                    </td>

                    <td>
                        ${escapeHtml(
                            student.email || ""
                        )}
                    </td>

                    <td>
                        ${escapeHtml(
                            student.phone || "-"
                        )}
                    </td>

                    <td>
                        ${escapeHtml(
                            student.course || "-"
                        )}
                    </td>

                    <td>
                        ${student.attendance ?? 0}%
                    </td>

                    <td>
                        ${student.gpa ?? 0}
                    </td>

                    <td>
                        Rs.
                        ${Number(
                            student.feeBalance || 0
                        ).toLocaleString()}
                    </td>

                    <td>

                        <button
                            type="button"
                            class="edit-btn"
                            onclick="editStudentInformation('${student._id}')"
                        >
                            Edit
                        </button>

                        <button
                            type="button"
                            class="delete-btn"
                            onclick="deleteStudentInformation('${student._id}')"
                        >
                            Delete
                        </button>

                    </td>

                `;


                tableBody.appendChild(row);

            }
        );


    } catch (error) {

        console.error(
            "Student information error:",
            error
        );


        tableBody.innerHTML = `
            <tr>
                <td colspan="8" class="loading">
                    ${escapeHtml(
                        error.message
                    )}
                </td>
            </tr>
        `;

    }

}



/*
====================================================
 SAVE STUDENT INFORMATION
====================================================
*/

async function saveStudentInformation() {

    const studentId =
        document.getElementById(
            "studentId"
        )?.value;


    const name =
        document.getElementById(
            "name"
        )?.value.trim();


    const email =
        document.getElementById(
            "email"
        )?.value.trim().toLowerCase();


    const phone =
        document.getElementById(
            "phone"
        )?.value.trim();


    const course =
        document.getElementById(
            "course"
        )?.value.trim();


    const attendance =
        Number(
            document.getElementById(
                "attendance"
            )?.value
        ) || 0;


    const gpa =
        Number(
            document.getElementById(
                "gpa"
            )?.value
        ) || 0;


    const feeBalance =
        Number(
            document.getElementById(
                "feeBalance"
            )?.value
        ) || 0;


    /*
    Validation
    */

    if (!name || !email) {

        showStudentMessage(
            "Name and email are required.",
            "error"
        );

        return;

    }


    if (
        attendance < 0 ||
        attendance > 100
    ) {

        showStudentMessage(
            "Attendance must be between 0 and 100.",
            "error"
        );

        return;

    }


    if (
        gpa < 0 ||
        gpa > 4
    ) {

        showStudentMessage(
            "GPA must be between 0 and 4.",
            "error"
        );

        return;

    }


    if (feeBalance < 0) {

        showStudentMessage(
            "Fee balance cannot be negative.",
            "error"
        );

        return;

    }


    const studentData = {

        name: name,

        email: email,

        phone: phone || "",

        course: course || "",

        attendance: attendance,

        gpa: gpa,

        feeBalance: feeBalance

    };


    const saveButton =
        document.getElementById(
            "saveBtn"
        );


    if (saveButton) {

        saveButton.disabled = true;

        saveButton.textContent =
            studentId
                ? "Updating..."
                : "Saving...";

    }


    try {

        let url =
            "/api/student-information";


        let method =
            "POST";


        /*
        Existing student = UPDATE
        */

        if (studentId) {

            url =
                "/api/student-information/" +
                encodeURIComponent(studentId);

            method =
                "PUT";

        }


        const response =
            await fetch(
                url,
                {

                    method: method,

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            studentData
                        )

                }
            );


        const data =
            await response.json();


        if (!response.ok || !data.success) {

            throw new Error(
                data.message ||
                "Unable to save student."
            );

        }


        showStudentMessage(

            studentId
                ? "Student information updated successfully."
                : "Student information saved successfully.",

            "success"

        );


        clearStudentInformationForm();


        await loadStudentInformation();


    } catch (error) {

        console.error(
            "Save student error:",
            error
        );


        showStudentMessage(
            error.message ||
            "Unable to save student.",
            "error"
        );


    } finally {

        if (saveButton) {

            saveButton.disabled = false;

            saveButton.textContent =
                "Save Student";

        }

    }

}



/*
====================================================
 EDIT STUDENT INFORMATION
====================================================
*/

async function editStudentInformation(id) {

    try {

        const response =
            await fetch(
                "/api/student-information/" +
                encodeURIComponent(id)
            );


        const data =
            await response.json();


        if (!response.ok || !data.success) {

            throw new Error(
                data.message ||
                "Student not found."
            );

        }


        const student =
            data.student;


        const studentIdInput =
            document.getElementById(
                "studentId"
            );


        const nameInput =
            document.getElementById(
                "name"
            );


        const emailInput =
            document.getElementById(
                "email"
            );


        const phoneInput =
            document.getElementById(
                "phone"
            );


        const courseInput =
            document.getElementById(
                "course"
            );


        const attendanceInput =
            document.getElementById(
                "attendance"
            );


        const gpaInput =
            document.getElementById(
                "gpa"
            );


        const feeBalanceInput =
            document.getElementById(
                "feeBalance"
            );


        if (studentIdInput) {

            studentIdInput.value =
                student._id || "";

        }


        if (nameInput) {

            nameInput.value =
                student.name || "";

        }


        if (emailInput) {

            emailInput.value =
                student.email || "";

        }


        if (phoneInput) {

            phoneInput.value =
                student.phone || "";

        }


        if (courseInput) {

            courseInput.value =
                student.course || "";

        }


        if (attendanceInput) {

            attendanceInput.value =
                student.attendance ?? 0;

        }


        if (gpaInput) {

            gpaInput.value =
                student.gpa ?? 0;

        }


        if (feeBalanceInput) {

            feeBalanceInput.value =
                student.feeBalance ?? 0;

        }


        const formTitle =
            document.getElementById(
                "formTitle"
            );


        if (formTitle) {

            formTitle.textContent =
                "Edit Student Information";

        }


        const saveButton =
            document.getElementById(
                "saveBtn"
            );


        if (saveButton) {

            saveButton.textContent =
                "Update Student";

        }


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });


    } catch (error) {

        console.error(
            "Edit student error:",
            error
        );


        showStudentMessage(
            error.message ||
            "Unable to edit student.",
            "error"
        );

    }

}



/*
====================================================
 DELETE STUDENT INFORMATION
====================================================
*/

async function deleteStudentInformation(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this student?"
        );


    if (!confirmed) {

        return;

    }


    try {

        const response =
            await fetch(
                "/api/student-information/" +
                encodeURIComponent(id),
                {
                    method: "DELETE"
                }
            );


        const data =
            await response.json();


        if (!response.ok || !data.success) {

            throw new Error(
                data.message ||
                "Unable to delete student."
            );

        }


        showStudentMessage(
            "Student deleted successfully.",
            "success"
        );


        await loadStudentInformation();


    } catch (error) {

        console.error(
            "Delete student error:",
            error
        );


        showStudentMessage(
            error.message ||
            "Unable to delete student.",
            "error"
        );

    }

}



/*
====================================================
 CLEAR STUDENT INFORMATION FORM
====================================================
*/

function clearStudentInformationForm() {

    const form =
        document.getElementById(
            "studentForm"
        );


    if (form) {

        form.reset();

    }


    const studentId =
        document.getElementById(
            "studentId"
        );


    if (studentId) {

        studentId.value = "";

    }


    const formTitle =
        document.getElementById(
            "formTitle"
        );


    if (formTitle) {

        formTitle.textContent =
            "Add Student Information";

    }


    const saveButton =
        document.getElementById(
            "saveBtn"
        );


    if (saveButton) {

        saveButton.textContent =
            "Save Student";

    }

}



/*
====================================================
 SHOW STUDENT INFORMATION MESSAGE
====================================================
*/

function showStudentMessage(
    text,
    type
) {

    const message =
        document.getElementById(
            "message"
        );


    if (!message) {

        alert(text);

        return;

    }


    message.textContent =
        text;


    message.className =
        "message " + type;


    setTimeout(
        function () {

            message.className =
                "message";

            message.textContent =
                "";

        },
        4000
    );

}



/*
====================================================
 ESCAPE HTML
====================================================
*/

function escapeHtml(value) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}



/*
====================================================
 PASSWORD TOGGLE
====================================================
*/

function togglePassword(
    inputId,
    buttonId
) {

    const input =
        document.getElementById(
            inputId
        );


    const button =
        document.getElementById(
            buttonId
        );


    if (!input) return;


    if (input.type === "password") {

        input.type = "text";


        if (button) {

            button.textContent =
                "Hide";

        }

    } else {

        input.type = "password";


        if (button) {

            button.textContent =
                "Show";

        }

    }

}