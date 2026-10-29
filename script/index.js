document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('main--header');

    const handleScroll = () => {
        if (window.scrollY > 0) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
});