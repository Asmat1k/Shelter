import { popup } from ".//popup.js";

let btnLeft = document.querySelector('.btn-left');
let btnRight = document.querySelector('.btn-right');
const carousel = document.querySelector('.carousel');

let checkMas = [];
let pastArr = [], currArr = [], nextArr= [];

// Создание стартовых массивов
function initArr() {
    let length = 3;
    pastArr = generateMas(length);
    currArr = generateMas(length);
    nextArr = generateMas(length);
    if(!compareArr(currArr,pastArr)) {
        while(!compareArr(currArr,pastArr)) {
            pastArr = generateMas(3);
        }
    }
    if(!compareArr(currArr,nextArr)) {
        while(!compareArr(currArr,nextArr)) {
            nextArr = generateMas(3);
        }
    }
    checkMas = [pastArr, currArr, nextArr];

    console.log(`START - ${pastArr} ${currArr} ${nextArr}`);
}
initArr();

// последовательность карточек
function generateMas(num) {
    let i = 0;
    let arr = [];
    let random;
    while(i!=num) {
        random = Math.floor(Math.random()*8);
        if(!arr.includes(random)) {
            arr.push(random);
            i++;
        }
    }
    return arr;
}

// сравнение 2ух массивов
function compareArr(first,second) {
    if(second.length == 0 || second == undefined) return true;
    const length = first.length;
    for(let i=0; i<length; i++) {
        if(second.includes(first[i]))
            return false;
    }
    return true;
}

// узнать ширину экрана
function knowWidth() {
    let width = window.innerWidth;
    return width > 979 ? 3 : width > 719 ? 2 : 1;
}

// сдвиг вправо
function moveRight() {
    const itemRight = document.querySelector('.item-right');
    itemRight.innerHTML = '';

    carousel.classList.add('transition-right');
    btnLeft.removeEventListener("click", moveLeft);
    btnRight.removeEventListener("click", moveRight);

    // создание карточек
    for(let i=0; i<3; i++) {
        const card = createTemplate();
        createCard(card,itemRight, nextArr[i]);
    }
    pastArr = [];
    pastArr = currArr;
    currArr = [];
    currArr = nextArr;
    if(!compareArr(nextArr,currArr)) {
        while(!compareArr(nextArr,currArr)) {
            nextArr = generateMas(3);
        }
    }
    
}

// сдвиг влево
function moveLeft()  {
    const itemLeft = document.querySelector('.item-left');
    itemLeft.innerHTML = '';
    
    carousel.classList.add('transition-left');
    btnLeft.removeEventListener("click", moveLeft);
    btnRight.removeEventListener("click", moveRight);

    // создание карточек
    for(let i=0; i<3; i++) {
        const card = createTemplate();
        createCard(card,itemLeft,pastArr[i]);
    }
    nextArr = [];
    nextArr = currArr;
    currArr = [];
    currArr = pastArr;
    if(!compareArr(pastArr,currArr)) {
        while(!compareArr(pastArr,currArr)) {
            pastArr = generateMas(3);
        }
    }
}

// нажатие на кнопки
function carouselMain() {
    if(btnLeft && btnRight) {
        btnLeft.addEventListener("click", moveLeft);
        btnRight.addEventListener("click", moveRight);
    }
    if(window.innerWidth<=460) {
        btnLeft = document.querySelector('.left');
        btnRight = document.querySelector('.right');
        btnLeft.addEventListener("click", moveLeft);
        btnRight.addEventListener("click", moveRight);
    }
}

// конец анимации
carousel.addEventListener("animationend", (event) => {
    const itemLeft = document.querySelector('.item-left');
    const itemRight = document.querySelector('.item-right');
    // что меняется
    if(event.animationName === 'moveL') {
        carousel.classList.remove("transition-left");
        //changedItem = itemLeft;
        document.querySelector(".item-active").innerHTML = itemLeft.innerHTML;
    }
    else {
        carousel.classList.remove("transition-right");
        //changedItem = itemRight;
        document.querySelector(".item-active").innerHTML = itemRight.innerHTML;
    }

    // получение новых карточек
    const popupLinks = document.querySelectorAll('.popup-link');
    popup(popupLinks);

    // клик по стрелкам
    btnLeft.addEventListener("click", moveLeft);
    btnRight.addEventListener("click", moveRight);
});

// создание кaрточки
function createTemplate() {
    const card = document.createElement("div");
    card.classList.add("card");
    return card;
}

// создание блков с карточками
function createCardsBlock() {
    let length = 3;
    checkMas = [pastArr, currArr, nextArr];
    for(let block=0; block<3; block++) {

        const cardsBlock = document.createElement("div");
        cardsBlock.classList.add("cards");

        switch(block) {
            case 0: {cardsBlock.classList.add("item-left"); break;}
            case 1: {cardsBlock.classList.add("item-active"); break;}
            case 2: {cardsBlock.classList.add("item-right"); break;}
        }
        for(let cardID=0; cardID<length; cardID++) {
            let temp = checkMas[block];
            const card = createTemplate();
            createCard(card,cardsBlock,temp[cardID]);
        }
        carousel.appendChild(cardsBlock);
    }
}

// заполнение карточки 
async function createCard(card,changedItem, id) {
    const base = 'files/pets.json';
    const res = await fetch(base);
    const data = await res.json();
    card.innerHTML = `
                    <div class="card__figure">
                        <img src=${data[id].img} alt="animal-3" class="card-img">
                    </div>
                    <div class="card__body">
                        <div class="card__title">${data[id].name}</div>
                        <a href="#" class="card__button">Learn more</a>
                    </div>
                    `;
    card.classList.add("popup-link");
    // получение новых карточек
    changedItem.appendChild(card);
    // получение новых созданных карточек
    let popupLinks = document.querySelectorAll('.popup-link');
    popup(popupLinks);
}

window.addEventListener('resize',(e) => {
    let size = window.innerWidth
    if(size<=460) {
        btnLeft = document.querySelector('.left');
        btnRight = document.querySelector('.right');
        carouselMain();
    }
});

carouselMain();
// создание блоков с карточками
createCardsBlock();
