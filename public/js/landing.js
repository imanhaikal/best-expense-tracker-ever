document.addEventListener('DOMContentLoaded', () => {
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
