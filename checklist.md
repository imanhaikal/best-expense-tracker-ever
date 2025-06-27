# Authentication Feature Checklist

### 1. Foundation & Setup
- [ ] Set up Firebase Authentication (Email/Password and Google).
- [ ] Create `login.html` with a form for email and password.
- [ ] Create `register.html` with a form for username, email, and password.
- [ ] Create `public/css/auth.css` for authentication pages styling.
- [ ] Create `public/js/auth.js` for authentication logic.
- [ ] Link `auth.css` and `auth.js` in `login.html` and `register.html`.

### 2. Registration Functionality
- [ ] In `register.html`, build the registration form with fields for username, email, and password.
- [ ] In `auth.js`, create a `handleRegister` function.
- [ ] Implement user creation with `firebase.auth().createUserWithEmailAndPassword()`.
- [ ] Store additional user information (username) in a `users` collection in Firestore, linking it with the user's UID.
- [ ] Add client-side validation for registration form inputs (e.g., password match, email format).
- [ ] Redirect to `app.html` upon successful registration.

### 3. Login Functionality
- [ ] In `login.html`, build the login form with email and password fields.
- [ ] Add a "Sign in with Google" button.
- [ ] In `auth.js`, create a `handleLogin` function.
- [ ] Implement user sign-in with `firebase.auth().signInWithEmailAndPassword()`.
- [ ] In `auth.js`, create a `handleGoogleSignIn` function using `signInWithPopup`.
- [ ] Redirect to `app.html` upon successful login.

### 4. Application Integration & State Management
- [ ] In `app.html`, add a "Logout" button.
- [ ] In `app.js`, create a `handleLogout` function using `firebase.auth().signOut()`.
- [ ] In `app.js`, implement `firebase.auth().onAuthStateChanged` listener.
- [ ] If a user is not authenticated, redirect from `app.html` to `login.html`.
- [ ] Modify Firestore service functions to be user-aware (e.g., `getTransactions(userId)`). All data should be tied to the user's UID.
- [ ] Display logged-in user's information (e.g., username or email) on the main app page.
