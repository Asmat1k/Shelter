const popupBlock = document.querySelector('.popup');
const body = document.body;

let unlock = true;
const TIME = 800;

export function popup(popupLinks) {
    const _length = popupLinks.length;
    if(popupLinks.length > 0) {
        for(let i=0; i < _length; i++) {
            popupLinks[i].addEventListener("click", function(event) {
                popupOpen(event);
            });
        }
    }
}

// Открытие
function popupOpen(event) {
    getPet(event);
    if(unlock) {
        bodyLock();
    }
    popupBlock.classList.add('open');
    document.body.addEventListener("click", function(e) {
        if(e.target.classList.contains('popup__body') || e.target.classList.contains('popup__close')) {
            popupClose();
        }
    })
}

// Закртыие
function popupClose() {
    if(unlock){
        popupBlock.classList.remove('open');
        bodyUnLock();
    }
}

// Блокировка скролла + фикс дергания экрана
function bodyLock() {
    const lockPaddingValue = window.innerWidth - document.querySelector('.main-wrapper').offsetWidth + 'px';

    body.style.paddingRight = lockPaddingValue;
    body.classList.add('locked');

    unlock = false;
    setTimeout(function() {
        unlock = true;
    }, TIME);
}

// Разблокировка
function bodyUnLock() {
    setTimeout(function() {
        body.style.paddingRight = "0px";
        body.classList.remove('locked');
    }, TIME);

    unlock = false;
    setTimeout(function() {
        unlock = true;
    }, TIME);
}

// получение животного на которого было нажатие
async function getPet(event) {
    const base = 'files/pets.json';
    const res = await fetch(base);
    const data = await res.json();
    const length = data.length;

    const card = event.target.closest('.card');
    const name = card.querySelector('.card__title').textContent;
    for(let i=0; i<length; i++) {
        if(data[i].name === name)
            fillPopup(data[i])
    }
}

// заполнение карточки
function fillPopup(info) {
    const img = document.querySelector('.pet-img');
    const title = document.querySelector('.popup__title');
    const subtitle = document.querySelector('.popup__subtitle');
    const description = document.querySelector('.popup__desctiption');
    const age = document.querySelector('.age');
    const inoculations = document.querySelector('.inoculations');
    const diseases = document.querySelector('.diseases');
    const parasites = document.querySelector('.parasites');

    const content = document.querySelector('.popup__content');

    // заполнение карточки
    
    title.textContent = info.name;
    img.src = info.img;
    subtitle.textContent = `${info.type} - ${info.breed}`;
    description.textContent = info.description;
    age.textContent = info.age;
    inoculations.textContent = info.inoculations.join(', ');
    diseases.textContent = info.diseases.join(', ');
    parasites.textContent = info.parasites.join(', ');
}