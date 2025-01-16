const $start = document.getElementById('start');
const $info = document.getElementById('info');
const $main = document.getElementById('main');
const $next = document.getElementById('next');
const $clear = document.getElementById('clear');
const $turndisp = document.getElementById('turndisp');
const $cardContainer = document.querySelector('.buttonContainer');

const music = new Audio('crap.mp3');

const cardsNum = 30;

// 区間[0, x)の整数を返す
const random = (x) => {
    return Math.floor(Math.random() * x);
}

let model = [];
for(let i=1; i<=cardsNum/3; i++){
    for(let j=0; j<3; j++){
        model.push(i);
    }
}

let num = [];
for(let i=0; i<cardsNum; i++){
    let j = random(model.length);
    num.push(model[j]);
    model.splice(j,1);
}

// init
$start.addEventListener('click',() => {
    $info.classList.toggle('hidden');
    $main.classList.toggle('hidden');
    for(let i=0; i<cardsNum; i++) createCards();
    $cards = document.getElementsByClassName('card');
    clickcheck($cards);
})

const createCards = () => {
    const card = document.createElement('button');
    card.classList.add('card');
    $cardContainer.appendChild(card);
}

const clickcheck = () => {
    for(let i=0; i<$cards.length; i++){
        $cards[i].addEventListener('click',(e) => {
            clicked_handler(e);
        })
    }
}

// turnState = 0, 1, 2
let turnState = 0;
let pickedPos = [-1, -1, -1];

const clicked_handler = (elm) => {
    if(elm.target.classList.contains('finished') || elm.target.disabled) return;
    for(let i=0; i<3; i++){
        if($cards[pickedPos[i]] === elm.target) return;
    }

    elm.target.disabled = "true";
    elm.target.classList.toggle('opened');

    const pos = Array.prototype.indexOf.call($cards, elm.target);

    window.setTimeout(function(){
        elm.target.textContent = num[pos];
    }, 300);

    pickedPos[turnState] = pos;
    turnState++;

    if(turnState === 3) {
        for(let i=0; i<cardsNum; i++) $cards[i].disabled = true;
        window.setTimeout(function(){change_phase_handler()}, 1300);
        turnState = 0;
    }
}

let finishedCnt = 0;
let operationCnt = 0;

function change_phase_handler() {
    let pickedNum = [num[pickedPos[0]], num[pickedPos[1]], num[pickedPos[2]]];
    if(pickedNum[0] == pickedNum[1] && pickedNum[1] == pickedNum[2]) {
        music.pause();
        music.currentTime = 0;
        music.play();
        finishedCnt += 3;
        for(let i=0; i<3; i++) $cards[pickedPos[i]].classList.add('finished');
    } else {
        for(let i=0; i<3; i++) $cards[pickedPos[i]].classList.toggle('opened');
        window.setTimeout(function(){
            for(let i=0; i<3; i++) $cards[pickedPos[i]].textContent = '';
            pickedPos = [-1, -1, -1];
        }, 300);
    }

    operationCnt++;

    window.setTimeout(function(){
        for(let i=0; i<cardsNum; i++) $cards[i].disabled = false;
    }, 300);

    if(finishedCnt === cardsNum){
        $main.classList.toggle('hidden');
        $clear.classList.toggle('hidden');
        $turndisp.textContent = "かかったターン数:" + operationCnt;
    }
}
