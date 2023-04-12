const menuBtn = document.querySelector('.menu__icon');
const menu = document.querySelector('.header__menu');
const shadow = document.querySelector('.shadow');

function burger() {
    window.addEventListener('click', function(event){
        if(event.target.classList.contains('menu__line'))
            open(menuBtn,menu);
        document.body.addEventListener('click', function(eventIN) {
            if(eventIN.target.classList.contains('header-nav__link') || !eventIN.target.classList.contains('header__menu'))
                close(menuBtn,menu);
        })
    })
}

burger();

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

//------------------------------------------------------------------------

if(window.location.pathname==='/index.html') {
    let btnLeft = document.querySelector('.btn-left');
    let btnRight = document.querySelector('.btn-right');
    const carousel = document.querySelector('.carousel');

    //let mas = [];
    //let last = [];
    let checkMas = [];
    let pastArr = [], currArr = [], nextArr= [];

    let countL = 0, countR = 0;

    // Создание стартовых массивов
    function initArr() {
        let length = knowWidth();
        pastArr = generateMas(length);
        currArr = generateMas(length);
        nextArr = generateMas(length);
        if(!compareArr(currArr,pastArr)) {
            while(!compareArr(currArr,pastArr)) {
                pastArr = generateMas(knowWidth());
            }
        }
        if(!compareArr(currArr,nextArr)) {
            while(!compareArr(currArr,nextArr)) {
                nextArr = generateMas(knowWidth());
            }
        }
        checkMas = [pastArr, currArr, nextArr];

        //console.log(`START - ${pastArr} ${currArr} ${nextArr}`);
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

        if(!countR && countL) {
            changeToLeft();
        }
        else {
            pastArr = [];
            pastArr = currArr;
            currArr = [];
            currArr = nextArr;
            if(!compareArr(nextArr,currArr)) {
                while(!compareArr(nextArr,currArr)) {
                    nextArr = generateMas(knowWidth());
                }
            }
                
            // создание карточек
            for(let i=0; i<knowWidth(); i++) {
                const card = createTemplate();
                createCard(card,itemRight, nextArr[i]);
            }
        }
        //countR++;
        //countL = 0;

        //console.log(`mvR - ${pastArr} ${currArr} new:${nextArr}`);
        //console.log(countL + ' ' + countR);
    }

    // сдвиг влево
    function moveLeft()  {
        const itemLeft = document.querySelector('.item-left');
        itemLeft.innerHTML = '';
        
        carousel.classList.add('transition-left');
        btnLeft.removeEventListener("click", moveLeft);
        btnRight.removeEventListener("click", moveRight);

        if(!countL && countR) {
            changeToRight();
        }
        else {
            nextArr = [];
            nextArr = currArr;
            currArr = [];
            currArr = pastArr;
            if(!compareArr(pastArr,currArr)) {
                while(!compareArr(pastArr,currArr)) {
                    pastArr = generateMas(knowWidth());
                }
            }
            // создание карточек
            // console.log(currArr);
            for(let i=0; i<knowWidth(); i++) {
                const card = createTemplate();
                createCard(card,itemLeft,currArr[i]);
            }
        }
        //countL++;
        //countR = 0;

        //console.log(`mvL - new:${pastArr} ${currArr} ${nextArr}`);
        //console.log(countL + ' ' + countR);
    }

    // Вернуться к предыдущему вправо
    function changeToRight() {  
        const act = document.querySelector('.item-left');

        let temp = pastArr;
        pastArr = currArr;
        currArr = temp;

        if(!compareArr(nextArr,currArr))
            while(!compareArr(nextArr,currArr)) {
                nextArr = generateMas(knowWidth());
            }
        // console.log(nextArr);
        // создание карточек
        for(let i=0; i<3; i++) {
            const card = createTemplate();
            createCard(card,act,nextArr[i]);
        }
        
        // console.log(`chR - ${pastArr} ${currArr} ${nextArr}`);
    }

    // Вернуться к предыдущему влево
    function changeToLeft() {
        const act = document.querySelector('.item-left');

        let temp = nextArr;
        nextArr = currArr;
        currArr = temp;
        // создание массива
        pastArr = [];
        while(!compareArr(pastArr,currArr) && !compareArr(pastArr,nextArr)) {
            pastArr = generateMas(knowWidth());
        }
        // создание карточек
        for(let i=0; i<3; i++) {
            const card = createTemplate();
            createCard(card,act,pastArr[i]);
        }

        //console.log(`chL - ${pastArr} ${currArr} ${nextArr}`);
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

    carouselMain();

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
        
        /*
        changedItem.innerHTML = "";
        mas = generateMas(knowWidth());
        if(!compareArr(mas,last)) {
            while(!compareArr(mas,last)) {
                mas = generateMas(knowWidth());
            }
        }
        last = mas;

        // получение ширины экрана и кол-ва генерируемых карточек
        let length = knowWidth();
        // создание карточек
        for(let i=0; i<length; i++) {
            const card = createTemplate();
            createCard(card,changedItem, mas[i]);
        }
        */

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
        let length = knowWidth();
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
                //console.log(temp);
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
        if(window.innerWidth<=460) {
            btnLeft = document.querySelector('.left');
            btnRight = document.querySelector('.right');
            carouselMain();
        }
    });

    // создание блоков с карточками
    createCardsBlock();

    console.log('Привет, я не разобрался со сборщиком (как в него засунуть 2 js файла), поэтому все пришлось заносить в файл в ручную, поэтому возможны ошибки, если что напиши');

}

//----------------------------------------------------------------------------

if(window.location.pathname==='/pets.html') {

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
}

// ----------------------------------------------------------------------------------------

const popupBlock = document.querySelector('.popup');
const body = document.body;

let unlock = true;
const TIME = 800;

function popup(popupLinks) {
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

