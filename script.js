"use strict";

/* =========================================================
   NOVA COLLEGE — MAIN JAVASCRIPT

   FEATURES:
   ✓ Admission registration
   ✓ Payment form
   ✓ Student dashboard
   ✓ JWT authentication
   ✓ Student information CRUD
   ✓ Mobile navigation
   ✓ Welcome screen
   ✓ Scroll animations
   ✓ Active navigation
   ✓ Back-to-top button
   ✓ Smooth scrolling
   ✓ Toast notifications
   ✓ LAN / PC / PHONE compatible API URLs
========================================================= */


/* =========================================================
   GLOBAL HELPERS
========================================================= */

const API_BASE_URL = "";


/* =========================================================
   AUTHENTICATION STORAGE HELPERS
========================================================= */

function getAuthToken() {
    return (
        localStorage.getItem("token") ||
        sessionStorage.getItem("token") ||
        ""
    );
}


function getStoredUser() {
    const localUser =
        localStorage.getItem("user");

    const sessionUser =
        sessionStorage.getItem("user");

    const localStudent =
        localStorage.getItem("student");

    const sessionStudent =
        sessionStorage.getItem("student");

    const raw =
        localUser ||
        sessionUser ||
        localStudent ||
        sessionStudent;

    if (!raw) {
        return null;
    }

    try {
        return JSON.parse(raw);
    } catch (error) {
        console.error(
            "Invalid stored user data:",
            error
        );

        localStorage.removeItem("user");
        localStorage.removeItem("student");

        sessionStorage.removeItem("user");
        sessionStorage.removeItem("student");

        return null;
    }
}


function authHeaders(extraHeaders = {}) {
    const token =
        getAuthToken();

    const headers = {
        ...extraHeaders
    };

    if (token) {
        headers.Authorization =
            `Bearer ${token}`;
    }

    return headers;
}


function clearAuthStorage() {
    localStorage.removeItem("token");
    localStorage.removeItem("student");
    localStorage.removeItem("user");

    sessionStorage.removeItem("token");
    sessionStorage.removeItem("student");
    sessionStorage.removeItem("user");
}


/* =========================================================
   DOM READY
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "Nova College JavaScript loaded successfully."
        );


        /* -------------------------------------------------
           WELCOME SCREEN
        ------------------------------------------------- */

        initWelcomeScreen();


        /* -------------------------------------------------
           MOBILE NAVIGATION
        ------------------------------------------------- */

        initMobileNavigation();


        /* -------------------------------------------------
           SMOOTH SCROLLING
        ------------------------------------------------- */

        initSmoothScrolling();


        /* -------------------------------------------------
           SCROLL REVEAL
        ------------------------------------------------- */

        initScrollReveal();


        /* -------------------------------------------------
           ACTIVE NAVIGATION
        ------------------------------------------------- */

        initActiveNavigation();


        /* -------------------------------------------------
           BACK TO TOP
        ------------------------------------------------- */

        initBackToTop();


        /* -------------------------------------------------
           ADMISSION FORM
        ------------------------------------------------- */

        initAdmissionForm();


        /* -------------------------------------------------
           PAYMENT FORM
        ------------------------------------------------- */

        initPaymentForm();


        /* -------------------------------------------------
           STUDENT DASHBOARD
        ------------------------------------------------- */

        const studentDashboard =
            document.getElementById(
                "studentDashboard"
            );

        /*
         * The new dashboard.html may not have
         * #studentDashboard because it loads its
         * own dashboard code.
         *
         * Only load the old dashboard handler
         * when that element exists.
         */

        if (studentDashboard) {
            loadStudentDashboard();
        }


        /* -------------------------------------------------
           LOGOUT
        ------------------------------------------------- */

        initLogout();


        /* -------------------------------------------------
           STUDENT INFORMATION
        ------------------------------------------------- */

        const studentForm =
            document.getElementById(
                "studentForm"
            );

        const studentTableBody =
            document.getElementById(
                "studentTableBody"
            );

        /*
         * Student Information CRUD is ADMIN ONLY
         * on the backend.
         *
         * Do not automatically call it for normal
         * student pages.
         */

        const storedUser =
            getStoredUser();

        const isAdmin =
            storedUser &&
            storedUser.role === "admin";

        if (
            isAdmin &&
            (
                studentForm ||
                studentTableBody
            )
        ) {
            loadStudentInformation();
        }


        /* -------------------------------------------------
           STUDENT INFORMATION FORM
        ------------------------------------------------- */

        if (studentForm) {

            studentForm.addEventListener(
                "submit",
                async function (event) {

                    event.preventDefault();

                    await saveStudentInformation();

                }
            );

        }


        /* -------------------------------------------------
           BUTTON EFFECTS
        ------------------------------------------------- */

        initButtonEffects();

    }
);


/* =========================================================
   WELCOME SCREEN
========================================================= */

function initWelcomeScreen() {

    const welcomeScreen =
        document.getElementById(
            "welcome-screen"
        );

    if (!welcomeScreen) {
        return;
    }

    setTimeout(
        function () {

            welcomeScreen.classList.add(
                "hide"
            );

            setTimeout(
                function () {

                    welcomeScreen.style.display =
                        "none";

                },
                850
            );

        },
        2700
    );
}


/* =========================================================
   MOBILE NAVIGATION
========================================================= */

function initMobileNavigation() {

    const menuToggle =
        document.querySelector(
            ".menu-toggle"
        );

    const navMenu =
        document.querySelector(
            ".nav-menu"
        );

    if (
        !menuToggle ||
        !navMenu
    ) {
        return;
    }


    menuToggle.addEventListener(
        "click",
        function () {

            navMenu.classList.toggle(
                "open"
            );

            const opened =
                navMenu.classList.contains(
                    "open"
                );

            menuToggle.setAttribute(
                "aria-expanded",
                opened
                    ? "true"
                    : "false"
            );

        }
    );


    navMenu
        .querySelectorAll("a")
        .forEach(
            function (link) {

                link.addEventListener(
                    "click",
                    function () {

                        navMenu.classList.remove(
                            "open"
                        );

                        menuToggle.setAttribute(
                            "aria-expanded",
                            "false"
                        );

                    }
                );

            }
        );


    document.addEventListener(
        "click",
        function (event) {

            if (
                !navMenu.contains(
                    event.target
                ) &&
                !menuToggle.contains(
                    event.target
                )
            ) {

                navMenu.classList.remove(
                    "open"
                );

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

            }

        }
    );

}


/* =========================================================
   SMOOTH SCROLLING
========================================================= */

function initSmoothScrolling() {

    document
        .querySelectorAll(
            'a[href^="#"]'
        )
        .forEach(
            function (link) {

                link.addEventListener(
                    "click",
                    function (event) {

                        const targetId =
                            this.getAttribute(
                                "href"
                            );

                        if (
                            !targetId ||
                            targetId === "#"
                        ) {
                            return;
                        }

                        const target =
                            document.querySelector(
                                targetId
                            );

                        if (!target) {
                            return;
                        }

                        event.preventDefault();

                        const navbar =
                            document.querySelector(
                                ".main-navbar"
                            );

                        const navHeight =
                            navbar
                                ? navbar.offsetHeight
                                : 0;

                        const targetPosition =
                            target.getBoundingClientRect()
                                .top +
                            window.scrollY -
                            navHeight -
                            15;

                        window.scrollTo({
                            top:
                                targetPosition,
                            behavior:
                                "smooth"
                        });

                    }
                );

            }
        );

}


/* =========================================================
   SCROLL REVEAL
========================================================= */

function initScrollReveal() {

    const revealElements =
        document.querySelectorAll(
            ".reveal"
        );

    if (
        !revealElements.length
    ) {
        return;
    }


    if (
        !(
            "IntersectionObserver"
            in window
        )
    ) {

        revealElements.forEach(
            function (element) {

                element.classList.add(
                    "visible"
                );

            }
        );

        return;
    }


    const observer =
        new IntersectionObserver(
            function (entries) {

                entries.forEach(
                    function (entry) {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.classList.add(
                                "visible"
                            );

                            observer.unobserve(
                                entry.target
                            );

                        }

                    }
                );

            },
            {
                threshold: 0.12
            }
        );


    revealElements.forEach(
        function (element) {

            observer.observe(
                element
            );

        }
    );

}


/* =========================================================
   ACTIVE NAVIGATION
========================================================= */

function initActiveNavigation() {

    const navLinks =
        document.querySelectorAll(
            '.nav-menu a[href^="#"]'
        );

    if (!navLinks.length) {
        return;
    }


    const sections =
        document.querySelectorAll(
            "section[id]"
        );

    if (!sections.length) {
        return;
    }


    function updateActiveLink() {

        const scrollPosition =
            window.scrollY + 160;

        let currentSection = "";


        sections.forEach(
            function (section) {

                const top =
                    section.offsetTop;

                const height =
                    section.offsetHeight;


                if (
                    scrollPosition >= top &&
                    scrollPosition <
                        top + height
                ) {

                    currentSection =
                        section.id;

                }

            }
        );


        navLinks.forEach(
            function (link) {

                const href =
                    link.getAttribute(
                        "href"
                    );

                link.classList.toggle(
                    "active",
                    href ===
                        "#" +
                        currentSection
                );

            }
        );

    }


    window.addEventListener(
        "scroll",
        updateActiveLink,
        {
            passive: true
        }
    );


    updateActiveLink();

}


/* =========================================================
   BACK TO TOP
========================================================= */

function initBackToTop() {

    let backToTop =
        document.querySelector(
            ".back-to-top"
        );


    if (!backToTop) {

        backToTop =
            document.createElement(
                "button"
            );

        backToTop.className =
            "back-to-top";

        backToTop.type =
            "button";

        backToTop.setAttribute(
            "aria-label",
            "Back to top"
        );

        backToTop.innerHTML =
            "↑";

        document.body.appendChild(
            backToTop
        );

    }


    window.addEventListener(
        "scroll",
        function () {

            if (
                window.scrollY > 500
            ) {

                backToTop.classList.add(
                    "show"
                );

            } else {

                backToTop.classList.remove(
                    "show"
                );

            }

        },
        {
            passive: true
        }
    );


    backToTop.addEventListener(
        "click",
        function () {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }
    );

}


/* =========================================================
   BUTTON EFFECTS
========================================================= */

function initButtonEffects() {

    document
        .querySelectorAll(
            ".gold-btn, .white-btn, .outline-btn, .ad-btn, .portal-btn"
        )
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        this.classList.add(
                            "button-clicked"
                        );


                        setTimeout(
                            () => {

                                this.classList.remove(
                                    "button-clicked"
                                );

                            },
                            180
                        );

                    }
                );

            }
        );

}


/* =========================================================
   ADMISSION FORM
========================================================= */

function initAdmissionForm() {

    const admissionForm =
        document.getElementById(
            "admissionForm"
        );

    if (!admissionForm) {
        return;
    }


    admissionForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const submitButton =
                admissionForm.querySelector(
                    'button[type="submit"]'
                );


            const originalButtonText =
                submitButton
                    ? submitButton.textContent
                    : "Submit Application & Pay";


            if (submitButton) {

                submitButton.disabled =
                    true;

                submitButton.textContent =
                    "Submitting...";

            }


            try {

                const formData =
                    new FormData(
                        admissionForm
                    );


                const name =
                    String(
                        formData.get(
                            "name"
                        ) || ""
                    ).trim();


                const email =
                    String(
                        formData.get(
                            "email"
                        ) || ""
                    )
                        .trim()
                        .toLowerCase();


                const password =
                    String(
                        formData.get(
                            "password"
                        ) || ""
                    );


                const phone =
                    String(
                        formData.get(
                            "phone"
                        ) || ""
                    ).trim();


                const course =
                    String(
                        formData.get(
                            "course"
                        ) || ""
                    ).trim();


                const paymentMethod =
                    String(
                        formData.get(
                            "paymentMethod"
                        ) || ""
                    ).trim();


                const amount =
                    String(
                        formData.get(
                            "amount"
                        ) || ""
                    ).trim();


                if (
                    !name ||
                    !email ||
                    !password
                ) {

                    throw new Error(
                        "Name, email and password are required."
                    );

                }


                /* -------------------------------------------------
                   STRONG PASSWORD VALIDATION
                   Matches the backend requirements.
                ------------------------------------------------- */

                if (
                    password.length < 8
                ) {

                    throw new Error(
                        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character."
                    );

                }


                if (
                    !/[A-Z]/.test(
                        password
                    )
                ) {

                    throw new Error(
                        "Password must contain at least one uppercase letter."
                    );

                }


                if (
                    !/[a-z]/.test(
                        password
                    )
                ) {

                    throw new Error(
                        "Password must contain at least one lowercase letter."
                    );

                }


                if (
                    !/[0-9]/.test(
                        password
                    )
                ) {

                    throw new Error(
                        "Password must contain at least one number."
                    );

                }


                if (
                    !/[^A-Za-z0-9]/.test(
                        password
                    )
                ) {

                    throw new Error(
                        "Password must contain at least one special character."
                    );

                }


                const emailPattern =
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


                if (
                    !emailPattern.test(
                        email
                    )
                ) {

                    throw new Error(
                        "Please enter a valid email address."
                    );

                }


                const response =
                    await fetch(
                        API_BASE_URL +
                            "/api/register",
                        {
                            method:
                                "POST",

                            headers: {
                                "Content-Type":
                                    "application/json",

                                "Accept":
                                    "application/json"
                            },

                            body:
                                JSON.stringify({
                                    name:
                                        name,

                                    email:
                                        email,

                                    password:
                                        password,

                                    phone:
                                        phone,

                                    course:
                                        course,

                                    paymentMethod:
                                        paymentMethod,

                                    amount:
                                        amount
                                })
                        }
                    );


                const data =
                    await readJsonResponse(
                        response
                    );


                if (
                    !response.ok ||
                    !data.success
                ) {

                    throw new Error(
                        data.message ||
                            "Admission submission failed."
                    );

                }


                console.log(
                    "Admission successful:",
                    data
                );


                showToast(
                    "Admission submitted successfully!",
                    "success"
                );


                setTimeout(
                    function () {

                        window.location.href =
                            "/loginform.html?registered=1";

                    },
                    900
                );


            } catch (error) {

                console.error(
                    "Admission error:",
                    error
                );


                let errorMessage =
                    error.message ||
                    "Unable to submit admission.";


                if (
                    error instanceof
                    TypeError
                ) {

                    errorMessage =
                        "Cannot connect to the server. Please make sure Node.js is running.";

                }


                showToast(
                    errorMessage,
                    "error"
                );


                if (submitButton) {

                    submitButton.disabled =
                        false;

                    submitButton.textContent =
                        originalButtonText;

                }

            }

        }
    );

}


/* =========================================================
   PAYMENT FORM
========================================================= */

function initPaymentForm() {

    const paymentForm =
        document.getElementById(
            "paymentForm"
        );

    if (!paymentForm) {
        return;
    }


    paymentForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const paymentButton =
                paymentForm.querySelector(
                    'button[type="submit"]'
                );


            const originalText =
                paymentButton
                    ? paymentButton.textContent
                    : "Pay Now";


            if (paymentButton) {

                paymentButton.disabled =
                    true;

                paymentButton.textContent =
                    "Processing...";

            }


            try {

                const token =
                    getAuthToken();


                if (!token) {

                    throw new Error(
                        "Please login before making a payment."
                    );

                }


                const formData =
                    new FormData(
                        paymentForm
                    );


                const paymentData = {

                    name:
                        formData.get(
                            "name"
                        ) ||
                        formData.get(
                            "fullName"
                        ) ||
                        "",

                    email:
                        formData.get(
                            "email"
                        ) ||
                        "",

                    phone:
                        formData.get(
                            "phone"
                        ) ||
                        formData.get(
                            "mobile"
                        ) ||
                        "",

                    amount:
                        formData.get(
                            "amount"
                        ) ||
                        "",

                    paymentMethod:
                        formData.get(
                            "paymentMethod"
                        ) ||
                        ""

                };


                const response =
                    await fetch(
                        API_BASE_URL +
                            "/api/payment/create",
                        {
                            method:
                                "POST",

                            headers:
                                authHeaders({
                                    "Content-Type":
                                        "application/json",

                                    "Accept":
                                        "application/json"
                                }),

                            body:
                                JSON.stringify(
                                    paymentData
                                )
                        }
                    );


                const data =
                    await readJsonResponse(
                        response
                    );


                if (
                    !response.ok ||
                    !data.success
                ) {

                    throw new Error(
                        data.message ||
                            "Payment request failed."
                    );

                }


                console.log(
                    "Payment:",
                    data
                );


                showToast(
                    data.message ||
                        "Payment request created successfully.",
                    "success"
                );


            } catch (error) {

                console.error(
                    "Payment error:",
                    error
                );


                showToast(
                    error.message ||
                        "Payment failed.",
                    "error"
                );


            } finally {

                if (paymentButton) {

                    paymentButton.disabled =
                        false;

                    paymentButton.textContent =
                        originalText;

                }

            }

        }
    );

}


/* =========================================================
   SAFE JSON RESPONSE
========================================================= */

async function readJsonResponse(
    response
) {

    const contentType =
        response.headers.get(
            "content-type"
        ) || "";


    const text =
        await response.text();


    if (!text) {

        throw new Error(
            "The server returned an empty response."
        );

    }


    if (
        contentType
            .toLowerCase()
            .includes(
                "application/json"
            )
    ) {

        try {

            return JSON.parse(
                text
            );

        } catch (error) {

            console.error(
                "Invalid JSON:",
                text
            );

            throw new Error(
                "The server returned invalid JSON."
            );

        }

    }


    console.error(
        "Non-JSON server response:",
        text
    );


    if (
        text
            .trim()
            .toLowerCase()
            .startsWith(
                "<!doctype"
            ) ||
        text
            .trim()
            .toLowerCase()
            .startsWith(
                "<html"
            )
    ) {

        throw new Error(
            "The server returned an HTML page instead of an API response. Make sure you opened the website through http://localhost:5000/ and that the API route exists."
        );

    }


    throw new Error(
        "The server returned an invalid response."
    );

}


/* =========================================================
   STUDENT DASHBOARD
========================================================= */

async function loadStudentDashboard() {

    const message =
        document.getElementById(
            "dashboardMessage"
        );


    try {

        const token =
            getAuthToken();


        /*
         * JWT is the real authentication source.
         * Stored student data is NOT required.
         */

        if (!token) {

            if (message) {

                message.innerHTML =
                    'Please login first. <a href="/loginform.html">Login here</a>.';

            }


            setTimeout(
                function () {

                    window.location.replace(
                        "/loginform.html"
                    );

                },
                1200
            );

            return;
        }


        /*
         * Display stored information immediately
         * if it exists.
         */

        const storedUser =
            getStoredUser();


        if (storedUser) {

            displayStudentData(
                storedUser
            );

        }


        /*
         * Backend determines the authenticated
         * student's information from the JWT.
         */

        const response =
            await fetch(
                API_BASE_URL +
                    "/api/student/dashboard",
                {
                    method:
                        "GET",

                    headers:
                        authHeaders({
                            "Accept":
                                "application/json"
                        })
                }
            );


        /*
         * Invalid or expired JWT.
         */

        if (
            response.status === 401 ||
            response.status === 403
        ) {

            clearAuthStorage();


            if (message) {

                message.innerHTML =
                    'Your login session has expired. <a href="/loginform.html">Login again</a>.';

            }


            setTimeout(
                function () {

                    window.location.replace(
                        "/loginform.html"
                    );

                },
                1200
            );


            return;
        }


        const data =
            await readJsonResponse(
                response
            );


        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.message ||
                    "Unable to load dashboard."
            );

        }


        /*
         * Update stored student data.
         */

        if (data.student) {

            const studentJson =
                JSON.stringify(
                    data.student
                );


            if (
                localStorage.getItem(
                    "token"
                )
            ) {

                localStorage.setItem(
                    "student",
                    studentJson
                );

                localStorage.setItem(
                    "user",
                    studentJson
                );

            } else {

                sessionStorage.setItem(
                    "student",
                    studentJson
                );

                sessionStorage.setItem(
                    "user",
                    studentJson
                );

            }


            displayStudentData(
                data.student
            );

        }


        /*
         * Display dashboard information.
         */

        if (data.dashboard) {

            displayDashboardInfo(
                data.dashboard
            );

        }


        if (message) {

            message.textContent =
                "";

        }


    } catch (error) {

        console.error(
            "Dashboard error:",
            error
        );


        if (message) {

            message.textContent =
                error.message ||
                "Unable to load some dashboard information.";

        }

    }

}


/* =========================================================
   DISPLAY STUDENT DATA
========================================================= */

function displayStudentData(
    student
) {

    if (!student) {
        return;
    }


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


    const studentName =
        document.getElementById(
            "studentName"
        );


    if (studentName) {

        studentName.textContent =
            name;

    }


    const profileName =
        document.getElementById(
            "profileName"
        );


    if (profileName) {

        profileName.textContent =
            name;

    }


    const profileEmail =
        document.getElementById(
            "profileEmail"
        );


    if (profileEmail) {

        profileEmail.textContent =
            email;

    }


    const profilePhone =
        document.getElementById(
            "profilePhone"
        );


    if (profilePhone) {

        profilePhone.textContent =
            phone;

    }


    const profileCourse =
        document.getElementById(
            "profileCourse"
        );


    if (profileCourse) {

        profileCourse.textContent =
            course;

    }


    const profileId =
        document.getElementById(
            "profileId"
        );


    if (profileId) {

        profileId.textContent =
            studentId;

    }


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
                .map(
                    function (word) {

                        return word.charAt(0);

                    }
                )
                .join("")
                .toUpperCase();


        studentInitials.textContent =
            initials || "N";

    }

}


/* =========================================================
   DISPLAY DASHBOARD INFORMATION
========================================================= */

function displayDashboardInfo(
    dashboard
) {

    if (!dashboard) {
        return;
    }


    const attendance =
        document.querySelector(
            "#attendance .big-number"
        );


    if (
        attendance &&
        dashboard.attendance !==
            undefined &&
        dashboard.attendance !==
            null
    ) {

        const attendanceValue =
            String(
                dashboard.attendance
            );


        attendance.textContent =
            attendanceValue.includes("%")
                ? attendanceValue
                : attendanceValue + "%";

    }


    const gpa =
        document.querySelector(
            "#results .big-number"
        );


    if (
        gpa &&
        dashboard.gpa !==
            undefined &&
        dashboard.gpa !==
            null
    ) {

        gpa.textContent =
            dashboard.gpa;

    }


    const fees =
        document.querySelector(
            "#fees .big-number"
        );


    if (
        fees &&
        dashboard.feeBalance !==
            undefined &&
        dashboard.feeBalance !==
            null
    ) {

        fees.textContent =
            "Rs. " +
            Number(
                dashboard.feeBalance
            ).toLocaleString();

    }

}


/* =========================================================
   LOGOUT
========================================================= */

function initLogout() {

    const logoutButton =
        document.getElementById(
            "logoutButton"
        );


    if (!logoutButton) {
        return;
    }


    logoutButton.addEventListener(
        "click",
        async function () {

            const token =
                getAuthToken();


            /*
             * Tell backend to revoke JWT
             * before clearing browser data.
             */

            if (token) {

                try {

                    await fetch(
                        API_BASE_URL +
                            "/api/logout",
                        {
                            method:
                                "POST",

                            headers:
                                authHeaders({
                                    "Accept":
                                        "application/json"
                                })
                        }
                    );

                } catch (error) {

                    console.warn(
                        "Logout API request failed:",
                        error
                    );

                }

            }


            clearAuthStorage();


            window.location.replace(
                "/loginform.html"
            );

        }
    );

}


/* =========================================================
   STUDENT INFORMATION
========================================================= */

/*
 * These endpoints are ADMIN ONLY:
 *
 * GET
 * /api/student-information
 *
 * POST
 * /api/student-information
 *
 * PUT
 * /api/student-information/:id
 *
 * DELETE
 * /api/student-information/:id
 */


/* =========================================================
   LOAD STUDENT INFORMATION
========================================================= */

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

        const token =
            getAuthToken();


        if (!token) {

            throw new Error(
                "Please login as administrator to manage student information."
            );

        }


        const user =
            getStoredUser();


        if (
            !user ||
            user.role !== "admin"
        ) {

            throw new Error(
                "Administrator access is required."
            );

        }


        const response =
            await fetch(
                API_BASE_URL +
                    "/api/student-information",
                {
                    method:
                        "GET",

                    headers:
                        authHeaders({
                            "Accept":
                                "application/json"
                        })
                }
            );


        if (
            response.status === 401 ||
            response.status === 403
        ) {

            throw new Error(
                "Administrator access is required."
            );

        }


        const data =
            await readJsonResponse(
                response
            );


        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.message ||
                    "Unable to load students."
            );

        }


        tableBody.innerHTML =
            "";


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
                    document.createElement(
                        "tr"
                    );


                const studentId =
                    student._id || "";


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
                        ${escapeHtml(
                            student.attendance ?? 0
                        )}%
                    </td>

                    <td>
                        ${escapeHtml(
                            student.gpa ?? 0
                        )}
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
                            onclick="editStudentInformation('${escapeHtml(studentId)}')"
                        >
                            Edit
                        </button>

                        <button
                            type="button"
                            class="delete-btn"
                            onclick="deleteStudentInformation('${escapeHtml(studentId)}')"
                        >
                            Delete
                        </button>

                    </td>

                `;


                tableBody.appendChild(
                    row
                );

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


/* =========================================================
   SAVE STUDENT INFORMATION
========================================================= */

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
        )?.value
            .trim()
            .toLowerCase();


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


    if (
        !name ||
        !email
    ) {

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

        name:
            name,

        email:
            email,

        phone:
            phone || "",

        course:
            course || "",

        attendance:
            attendance,

        gpa:
            gpa,

        feeBalance:
            feeBalance

    };


    const saveButton =
        document.getElementById(
            "saveBtn"
        );


    if (saveButton) {

        saveButton.disabled =
            true;

        saveButton.textContent =
            studentId
                ? "Updating..."
                : "Saving...";

    }


    try {

        const token =
            getAuthToken();


        if (!token) {

            throw new Error(
                "Please login as administrator first."
            );

        }


        const user =
            getStoredUser();


        if (
            !user ||
            user.role !== "admin"
        ) {

            throw new Error(
                "Administrator access is required."
            );

        }


        let url =
            API_BASE_URL +
            "/api/student-information";


        let method =
            "POST";


        if (studentId) {

            url =
                API_BASE_URL +
                "/api/student-information/" +
                encodeURIComponent(
                    studentId
                );

            method =
                "PUT";

        }


        const response =
            await fetch(
                url,
                {
                    method:
                        method,

                    headers:
                        authHeaders({
                            "Content-Type":
                                "application/json",

                            "Accept":
                                "application/json"
                        }),

                    body:
                        JSON.stringify(
                            studentData
                        )
                }
            );


        const data =
            await readJsonResponse(
                response
            );


        if (
            !response.ok ||
            !data.success
        ) {

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

            saveButton.disabled =
                false;

            saveButton.textContent =
                "Save Student";

        }

    }

}


/* =========================================================
   EDIT STUDENT INFORMATION
========================================================= */

async function editStudentInformation(
    id
) {

    try {

        const token =
            getAuthToken();


        if (!token) {

            throw new Error(
                "Please login as administrator first."
            );

        }


        const user =
            getStoredUser();


        if (
            !user ||
            user.role !== "admin"
        ) {

            throw new Error(
                "Administrator access is required."
            );

        }


        const response =
            await fetch(
                API_BASE_URL +
                    "/api/student-information/" +
                    encodeURIComponent(
                        id
                    ),
                {
                    method:
                        "GET",

                    headers:
                        authHeaders({
                            "Accept":
                                "application/json"
                        })
                }
            );


        const data =
            await readJsonResponse(
                response
            );


        if (
            !response.ok ||
            !data.success
        ) {

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
                student.attendance ??
                0;

        }


        if (gpaInput) {

            gpaInput.value =
                student.gpa ??
                0;

        }


        if (feeBalanceInput) {

            feeBalanceInput.value =
                student.feeBalance ??
                0;

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


/* =========================================================
   DELETE STUDENT INFORMATION
========================================================= */

async function deleteStudentInformation(
    id
) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this student?"
        );


    if (!confirmed) {
        return;
    }


    try {

        const token =
            getAuthToken();


        if (!token) {

            throw new Error(
                "Please login as administrator first."
            );

        }


        const user =
            getStoredUser();


        if (
            !user ||
            user.role !== "admin"
        ) {

            throw new Error(
                "Administrator access is required."
            );

        }


        const response =
            await fetch(
                API_BASE_URL +
                    "/api/student-information/" +
                    encodeURIComponent(
                        id
                    ),
                {
                    method:
                        "DELETE",

                    headers:
                        authHeaders({
                            "Accept":
                                "application/json"
                        })
                }
            );


        const data =
            await readJsonResponse(
                response
            );


        if (
            !response.ok ||
            !data.success
        ) {

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


/* =========================================================
   CLEAR STUDENT INFORMATION FORM
========================================================= */

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

        studentId.value =
            "";

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


/* =========================================================
   STUDENT MESSAGE
========================================================= */

function showStudentMessage(
    text,
    type
) {

    const message =
        document.getElementById(
            "message"
        );


    if (!message) {

        showToast(
            text,
            type
        );

        return;

    }


    message.textContent =
        text;


    message.className =
        "message " +
        type;


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


/* =========================================================
   TOAST NOTIFICATION
========================================================= */

function showToast(
    message,
    type = "success"
) {

    let container =
        document.getElementById(
            "novaToastContainer"
        );


    if (!container) {

        container =
            document.createElement(
                "div"
            );

        container.id =
            "novaToastContainer";


        container.style.position =
            "fixed";

        container.style.top =
            "25px";

        container.style.right =
            "25px";

        container.style.zIndex =
            "100000";


        container.style.display =
            "flex";

        container.style.flexDirection =
            "column";

        container.style.gap =
            "12px";


        document.body.appendChild(
            container
        );

    }


    const toast =
        document.createElement(
            "div"
        );


    toast.textContent =
        message;


    toast.style.minWidth =
        "280px";

    toast.style.maxWidth =
        "420px";

    toast.style.padding =
        "15px 18px";

    toast.style.borderRadius =
        "12px";

    toast.style.fontFamily =
        "Inter, Arial, sans-serif";

    toast.style.fontSize =
        "13px";

    toast.style.fontWeight =
        "600";

    toast.style.lineHeight =
        "1.5";

    toast.style.boxShadow =
        "0 15px 40px rgba(0,0,0,.18)";

    toast.style.color =
        "#ffffff";

    toast.style.opacity =
        "0";

    toast.style.transform =
        "translateY(-10px)";

    toast.style.transition =
        "all .3s ease";


    if (type === "error") {

        toast.style.background =
            "#b42318";

    } else {

        toast.style.background =
            "#07152f";

    }


    container.appendChild(
        toast
    );


    requestAnimationFrame(
        function () {

            toast.style.opacity =
                "1";

            toast.style.transform =
                "translateY(0)";

        }
    );


    setTimeout(
        function () {

            toast.style.opacity =
                "0";

            toast.style.transform =
                "translateY(-10px)";


            setTimeout(
                function () {

                    toast.remove();

                },
                350
            );

        },
        4000
    );

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHtml(
    value
) {

    return String(
        value ?? ""
    )
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


/* =========================================================
   PASSWORD TOGGLE
========================================================= */

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


    if (!input) {
        return;
    }


    if (
        input.type ===
        "password"
    ) {

        input.type =
            "text";


        if (button) {

            button.textContent =
                "Hide";

        }

    } else {

        input.type =
            "password";


        if (button) {

            button.textContent =
                "Show";

        }

    }

}


/* =========================================================
   OPTIONAL GLOBAL FUNCTIONS
   Useful for HTML onclick attributes
========================================================= */

window.editStudentInformation =
    editStudentInformation;


window.deleteStudentInformation =
    deleteStudentInformation;


window.togglePassword =
    togglePassword;


window.loadStudentDashboard =
    loadStudentDashboard;


window.loadStudentInformation =
    loadStudentInformation;


window.clearStudentInformationForm =
    clearStudentInformationForm;