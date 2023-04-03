function burger() {
    const menuBtn = document.querySelector('.menu__icon');
    const menu = document.querySelector('.header__menu');
    const menuLinks = document.querySelectorAll('.header-nav__link');
    menuBtn.addEventListener('click', function(event){
        menuBtn.classList.toggle('active');
        menu.classList.toggle('active');
        document.body.classList.toggle('lock');
        menuLinks.forEach(menuLink => menuLink.addEventListener('click', () => {
            menuBtn.classList.remove('active');
            menu.classList.remove('active');
            document.body.classList.remove('lock');
        }));
    })
}

burger();