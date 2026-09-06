// =====================================
// validation.js
// Client Side Validation
// =====================================

export function validateName(name) {

    if (name.length < 3) {

        alert(
            "Name must contain minimum 3 characters"
        );

        return false;
    }

    return true;
}


export function validateEmail(email) {

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {

        alert("Enter valid email address");

        return false;
    }

    return true;
}


export function validatePassword(password) {

    if (password.length < 6) {

        alert(
            "Password must contain minimum 6 characters"
        );

        return false;
    }

    return true;
}


export function validateConfirmPassword(
    password,
    confirmPassword
) {

    if (password !== confirmPassword) {

        alert("Passwords do not match");

        return false;
    }

    return true;
}
