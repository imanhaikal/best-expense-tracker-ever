document.addEventListener('DOMContentLoaded', () => {
    // This script can be used for any animations or dynamic content on the landing page.
    // For now, it will handle the auth-aware links.

    const navGoToAppBtn = document.getElementById('nav-cta-btn');
    const heroGetStartedBtn = document.querySelector('.hero .btn-primary');

    if (typeof firebase !== 'undefined') {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                // User is logged in, redirect to the app
                window.location.href = 'app.html';
            } else {
                // User is not logged in, update links to point to the login/register page
                navGoToAppBtn.href = 'login.html';
                navGoToAppBtn.textContent = 'Login';
                heroGetStartedBtn.href = 'register.html';
            }
        });
    } else {
        // Fallback if Firebase is not loaded
        navGoToAppBtn.href = 'login.html';
        navGoToAppBtn.textContent = 'Login';
        heroGetStartedBtn.href = 'register.html';
    }

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    const featureItems = document.querySelectorAll('.feature-item');
    featureItems.forEach(item => {
        observer.observe(item);
    });
});
