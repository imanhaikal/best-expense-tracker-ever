// Authentication logic will go here. 

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('#login-form');
    const registerForm = document.querySelector('#register-form');
    const errorContainer = document.querySelector('#error-container');

    /**
     * Displays an error message in the error container.
     * @param {string} message - The error message to display.
     */
    const showAuthError = (message) => {
        errorContainer.textContent = message;
        errorContainer.style.display = 'block';
    };

    /**
     * Handles the registration form submission.
     * @param {Event} e - The form submission event.
     */
    const handleRegister = async (e) => {
        e.preventDefault();
        const username = registerForm.username.value;
        const email = registerForm.email.value;
        const password = registerForm.password.value;
        const confirmPassword = registerForm['confirm-password'].value;

        if (!username || !email || !password || !confirmPassword) {
            return showAuthError('All fields are required.');
        }
        if (password !== confirmPassword) {
            return showAuthError('Passwords do not match.');
        }

        try {
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;

            await user.updateProfile({
                displayName: username
            });

            await db.collection('users').doc(user.uid).set({
                uid: user.uid,
                username: username,
                email: user.email,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            window.location.href = 'app.html';
        } catch (error) {
            showAuthError(error.message);
        }
    };

    /**
     * Handles the login form submission.
     * @param {Event} e - The form submission event.
     */
    const handleLogin = async (e) => {
        e.preventDefault();
        const email = loginForm.email.value;
        const password = loginForm.password.value;

        if (!email || !password) {
            return showAuthError('Please enter email and password.');
        }

        try {
            await auth.signInWithEmailAndPassword(email, password);
            window.location.href = 'app.html';
        } catch (error) {
            showAuthError(error.message);
        }
    };

    /**
     * Handles the Google Sign-In button click.
     */
    const handleGoogleSignIn = async () => {
        try {
            const result = await auth.signInWithPopup(googleProvider);
            const user = result.user;
            const additionalUserInfo = result.additionalUserInfo;

            if (additionalUserInfo.isNewUser) {
                await db.collection('users').doc(user.uid).set({
                    uid: user.uid,
                    username: user.displayName,
                    email: user.email,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            }
            window.location.href = 'app.html';
        } catch (error) {
            showAuthError(error.message);
        }
    };

    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
        const googleSignInBtn = document.querySelector('#google-signin-btn');
        googleSignInBtn.addEventListener('click', handleGoogleSignIn);
    }
}); 