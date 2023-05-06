import { popup } from ".//popup.js";

let leftArrMax = document.querySelector('.left-max');
let leftArrOne = document.querySelector('.left-one');
let numberEl = document.querySelector('.number');
let rightArrOne = document.querySelector('.right-one');
let rightArrMax = document.querySelector('.right-max');
const currCards = document.querySelectorAll('.card');

let firstGen = [];
let secondGen = [];
let finalGen = [];
let currentPageNum = 1;
let lastIndex;
let id;
let last;

// Шафл
function shuffle(arr) {
    let length = arr.length;
    let j = 0; 

    for(let i=0; i<length; i++) {
    j = Math.floor(Math.random() * (i + 1));  
    [arr[i],arr[j]] = [arr[j],arr[i]];
    }
    return arr;
}

// Шафл массивово в массиве
function generatePagintaion() {
    for(let i=0; i<6; i++) {
        secondGen.forEach(sub => {
            finalGen.push(...shuffle(sub));
        })
    }
}

// Генерация итогового массива
function generate() {
    let i = 0;
    let random = 0;
    let num = 8;
    while(i!=num) {
        random = Math.floor(Math.random()*8);
        if(!firstGen.includes(random)) {
            firstGen.push(random);
            i++;
        }       
    }
    for(let count=0; count<num; count++) {
        if(count%3 == 0 && count!=0) {
            secondGen.push(firstGen.slice(count-3,count));
        }
        else if(count==num-1) {
            secondGen.push(firstGen.slice(count-1,count+1));
        }
    }
    
    generatePagintaion();
    lastIndex = 48/getMax();
    console.log(finalGen);
}

generate();

// узнать максимальную длину пагинации
function getMax() {
    let width = window.innerWidth;
    return width > 768 ? 6 : width > 585 ? 8 : 16;
}

// Клики по кнопкам
function pagination() {
    leftArrMax.addEventListener("click", function(event) {
        currentPageNum = 1;
        numberEl.textContent = currentPageNum;
        // если слева есть куда идти
        if(!leftArrMax.classList.contains('unactive')) {
            maxLeft();
            numberEl.textContent = currentPageNum;
            leftArrOne.classList.add('unactive');
            leftArrMax.classList.add('unactive');
        }
        if(leftArrMax.classList.contains('unactive')) {
            rightArrOne.classList.remove('unactive');
            rightArrMax.classList.remove('unactive');
        }
    });
    leftArrOne.addEventListener("click", function(event) {
        if(currentPageNum > 1) {
            currentPageNum--;
            backCards();
            numberEl.textContent = currentPageNum;
            rightArrOne.classList.remove('unactive');
            rightArrMax.classList.remove('unactive');
        }
        if(currentPageNum == 1) {
            leftArrOne.classList.add('unactive');
            leftArrMax.classList.add('unactive');
        }
    });
    rightArrOne.addEventListener("click", function(event) {
        if(currentPageNum != getMax()) {
            currentPageNum++;
            nextCards();
            numberEl.textContent = currentPageNum;
        }
        if(currentPageNum == getMax()) {
            rightArrOne.classList.add('unactive');
            rightArrMax.classList.add('unactive');
        }
        if(currentPageNum!=1) {
            leftArrOne.classList.remove('unactive');
            leftArrMax.classList.remove('unactive');
        }
    });
    rightArrMax.addEventListener("click", function(event) {
        currentPageNum = getMax();
        // если и так максимум
        if(!rightArrMax.classList.contains('unactive')) {
            maxRight();
            numberEl.textContent = currentPageNum;
            rightArrOne.classList.add('unactive');
            rightArrMax.classList.add('unactive');
        }
        if(leftArrMax.classList.contains('unactive')) {
            leftArrOne.classList.remove('unactive');
            leftArrMax.classList.remove('unactive');
        }
    })
    firstLook();
}
pagination();

// Заполнение первой страницы
function firstLook() {
    let cardsVisible = 48/getMax();
    let id = finalGen.slice(0,cardsVisible);

    for(let i=0; i<cardsVisible; i++) {
        createCard(currCards[i], id[i]);
    }
}

// Листание вправо
function nextCards() {
    let cardsVisible = 48/getMax();

    id = finalGen.slice(lastIndex, lastIndex+cardsVisible);    
    lastIndex = lastIndex+cardsVisible;   
    last = 'right';

    for(let i=0; i<cardsVisible; i++) {
        createCard(currCards[i], id[i]);
    }
}

// Листание влево
function backCards() {
    let cardsVisible = 48/getMax();

    // если перед этим была нажата направо
    if(last=='right' && (lastIndex - cardsVisible > 0)) {
        lastIndex -= cardsVisible;
        id = finalGen.slice(lastIndex-cardsVisible, lastIndex);    
        lastIndex = lastIndex; 
    }
    else {
        last = 'left';
        id = finalGen.slice(lastIndex-cardsVisible, lastIndex);    
        lastIndex = lastIndex-cardsVisible; 
    }

    
    for(let i=0; i<cardsVisible; i++) {
        createCard(currCards[i], id[i]);
    }
}

// Максимальное листание вправо
function maxRight() {
    let cardsVisible = 48/getMax();

    id = finalGen.slice(finalGen.length-cardsVisible, finalGen.length);       
    lastIndex = finalGen.length-cardsVisible;


    for(let i=0; i<cardsVisible; i++) {
        createCard(currCards[i], id[i]);
    }
}

// Максимальное листание влево
function maxLeft() {
    let cardsVisible = 48/getMax();

    id = finalGen.slice(0, cardsVisible);       
    lastIndex = cardsVisible;

    for(let i=0; i<cardsVisible; i++) {
        createCard(currCards[i], id[i]);
    }
}

// заполнение карточки 
async function createCard(card,id) {
    const base = 'files/pets.json';
    const res = await fetch(base);
    const data = await res.json();
    
    // чтобы странитца не моргала, 
    const img = card.children[0].children[0];
    const name = card.children[1].children[0];

    img.setAttribute('src', data[id].img);
    name.textContent = data[id].name;

    // получение новых созданных карточек
    let popupLinks = document.querySelectorAll('.popup-link');
    popup(popupLinks);
}

// смена максимального числа*
window.addEventListener('resize',(e) => {
    numberEl.textContent = 1;
    firstLook();
});

