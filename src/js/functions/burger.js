const menuBtn = document.querySelector('.menu__icon');
const menu = document.querySelector('.header__menu');
const shadow = document.querySelector('.shadow');

export function burger() {
    window.addEventListener('click', function(event){
        if(event.target.classList.contains('menu__line'))
            open(menuBtn,menu);
        document.body.addEventListener('click', function(eventIN) {
            if(eventIN.target.classList.contains('header-nav__link') || !eventIN.target.classList.contains('header__menu'))
                close(menuBtn,menu);
        })
    })
}

function open(button,menu) {
    button.classList.toggle('active');
    menu.classList.toggle('active');
    document.body.classList.toggle('lock');
    shadow.classList.toggle('active');
}

function close(button,menu) {
    button.classList.remove('active');
    menu.classList.remove('active');
    document.body.classList.remove('lock');
    shadow.classList.remove('active');
}
