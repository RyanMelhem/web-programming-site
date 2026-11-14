document.documentElement.classList.add('js');
const button = document.querySelector('.nav-toggle');
const nav = document.getElementById('site-nav');
button.addEventListener('click', function () {
    const isOpen = nav.classList.toggle('is-open');
    button.setAttribute('aria-expanded',isOpen);
});
