//stars
let stars = document.querySelector('.stars');
let starsList = stars.getElementsByTagName('li');

function checkStars() {
  let createLi = document.createElement('li');
  let createItem = document.createElement('i');
  createItem.className = "fa fa-star";
  createLi.appendChild(createItem.cloneNode(true));

  for (let i = starsList.length; 3 > i; i++) {
    stars.appendChild(createLi.cloneNode(true));
  }
}

//timer
function startTimer() {
  timeCounter++;
  timer.textContent = formatElapsedTime(timeCounter);
}

function formatElapsedTime(time) {
  let date = new Date(null);
  date.setSeconds(time);
  return date.toISOString().substr(11, 8);
}

function stopTimer() {
  if (counterIntervalId) {
    clearInterval(counterIntervalId);
    counterIntervalId = null;
  }
}

//restart
let restart = document.querySelector('.restart');
restart.addEventListener('click', onRestartClick);

function onRestartClick() {
  mismatchCounter = 1;
  matchCounter = 0;
  moveCounter = 0;
  timeCounter = 0;
  stopTimer();
  checkStars();
  document.querySelector('.moves').textContent = moveCounter;
  timer.textContent = formatElapsedTime(timeCounter);
  let newList = shuffle([...list]);

  while (deck.hasChildNodes()) {
    deck.removeChild(deck.lastChild);
  }

  for (let i = 0; newList.length > i; i++) {
    newList[i].className = "card";
    newList[i].addEventListener('click', onCardClick);
    deck.appendChild(newList[i]);
  }

  deck.style.display = "";
  won.style.display = "none";
  lose.style.display = "none";
}


//play again playButton
let playButtonList = document.getElementsByClassName('playButton');
for (let i = 0; playButtonList.length > i; i++) {
  playButtonList[i].addEventListener('click', onRestartClick);
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  let currentIndex = array.length,
    temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

//onCardClick
function onCardClick(event) {
  event.preventDefault();
  if (cardCanShow) {
    if (moveCounter === 0) {
      counterIntervalId = setInterval(startTimer, 1000);
    }

    moveCounter++;
    if (moveCounter % 2 !== 0) {
      lastCard = event.target;
      lastCard.className = "card open show";
    } else {
      document.querySelector('.moves').textContent = moveCounter / 2;
      if (lastCard.querySelector('i').className === event.target.querySelector('i').className) {
        lastCard.className = "card match";
        event.target.className = "card match";

        matchCounter++;
        if (matchCounter === 8) {
          stopTimer();
          deck.style.display = "none";
          won.style.display = "";
          let score = document.querySelector('.score');
          let matchResult = document.querySelector('.matchResult');
          let endTime = performance.now();
          score.textContent = "With: " + moveCounter / 2 + " Moves and " + starsList.length + " Stars in " + timeCounter + " seconds";
        }
      } else {
        cardCanShow = false;
        lastCard.className = "card mismatch";
        event.target.className = "card mismatch";

        mismatchCounter++;
        if (starsList.length > 0 && mismatchCounter / 5 >= 1) {
          mismatchCounter = mismatchCounter / 5;
          starsList[0].remove();
          if (starsList.length === 0) {
            stopTimer();
            deck.style.display = "none";
            lose.style.display = "";
          }
        }

        setTimeout(function closeCards() {
          lastCard.className = "card";
          event.target.className = "card";
          cardCanShow = true;
        }, 1000);

      }
    }
  }
}


//global variables
let cardCanShow = true;
let mismatchCounter = 1;
let matchCounter = 0;
let moveCounter = 0;
let lastCard;

let timeCounter = 0;
let counterIntervalId = null;

let deck = document.querySelector('.deck');
let won = document.querySelector('.won');
let lose = document.querySelector('.lost');
let list = deck.getElementsByTagName('li');
let timer = document.querySelector(".timer");
onRestartClick();


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
