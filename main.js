let inputDir = { x: 0, y: 0 };
const foodSound = new Audio("sounds/food.mp3");
const gameOverSound = new Audio("sounds/gameover.mp3");
const moveSound = new Audio("sounds/move.mp3");
const musicSound = new Audio("sounds/music.mp3");

let speed = 5;
let lastPaintTime = 0;
let score = 0;
let snakeArr = [{ x: 13, y: 15 }];
let food = { x: 6, y: 7 };

// functions
function main(currTime) {
  window.requestAnimationFrame(main);
  //   console.log(currTime);
  if ((currTime - lastPaintTime) / 1000 < 1 / speed) {
    return;
  }
  lastPaintTime = currTime;
  gameEngine();
}

function isCollide(snakeArr) {
  // if you bump into yourself
  for (let i = 1; i < snakeArr.length; i++) {
    if (snakeArr[i].x === snakeArr[0].x && snakeArr[i].y === snakeArr[0].y) {
      return true;
    }
  }

//   if you bump into the wall
  if (snakeArr[0].x >= 18 || snakeArr[0].x <= 0 || snakeArr[0].y >= 18 || snakeArr[0].y <= 0) {
    return true;
  }
}

function gameEngine() {
  // updating the snake Array

  if (isCollide(snakeArr)) {
    gameOverSound.play();
    musicSound.pause();
    inputDir = { x: 0, y: 0 };
    setTimeout(() => {
        alert("Game over, Press OK to play again!");
        scoreBox.textContent = "Score: " + score;
    }, 100);
    snakeArr = [{ x: 13, y: 15 }];
    musicSound.loop = true;
    musicSound.play();
    score = 0;
  }

  //   if you eat the food, increase the score and regenerate the food
  if (snakeArr[0].y === food.y && snakeArr[0].x === food.x) {
    score++;
    if (score > highScoreValue) {
        highScoreValue = score;
        localStorage.setItem("highScore", JSON.stringify(highScoreValue));
        highScoreBox.innerHTML = "High Score: " + highScoreValue;
    }
    scoreBox.innerHTML = "score: " + score;
    foodSound.play();
    snakeArr.unshift({
      x: snakeArr[0].x + inputDir.x,
      y: snakeArr[0].y + inputDir.y,
    });
    let a = 2; // show the distance of the generated food
    let b = 16; // show the distance of the generated food
    food = {
      x: Math.round(a + (b - a) * Math.random()),
      y: Math.round(a + (b - a) * Math.random()),
    };
  }

  //   moving the snake
  for (let i = snakeArr.length - 2; i >= 0; i--) {
    snakeArr[i + 1] = { ...snakeArr[i] };
  }
  snakeArr[0].x += inputDir.x;
  snakeArr[0].y += inputDir.y;

  // display snake
  board.innerHTML = "";
  snakeArr.forEach((e, i) => {
    snakeElement = document.createElement("div");
    snakeElement.style.gridRowStart = e.y;
    snakeElement.style.gridColumnStart = e.x;
    if (i === 0) {
      snakeElement.classList.add("head");
    } else {
      snakeElement.classList.add("snake");
    }
    board.appendChild(snakeElement);
  });

  // display food
  foodElement = document.createElement("div");
  foodElement.style.gridRowStart = food.y;
  foodElement.style.gridColumnStart = food.x;
  foodElement.classList.add("food");
  board.appendChild(foodElement);
}

// Main logic starts here
musicSound.play();
let highScore = localStorage.getItem("highScore");
if (highScore === null) {
    highScoreValue = 0;
    localStorage.setItem("highScore", JSON.stringify(highScoreValue));
} else {
    highScoreValue = JSON.parse(highScore);
    highScoreBox.innerHTML = "High Score: " + highScore;
}

window.requestAnimationFrame(main);
window.addEventListener("keydown", function (e) {
  inputDir = { x: 0, y: 1 }; // start the game
  moveSound.play();
  switch (e.key) {
    case "ArrowUp":
      console.log("ArrowUp");
      inputDir.x = 0;
      inputDir.y = -1;
      break;

    case "ArrowDown":
      console.log("ArrowDown");
      inputDir.x = 0;
      inputDir.y = 1;
      break;

    case "ArrowLeft":
      console.log("ArrowLeft");
      inputDir.x = -1;
      inputDir.y = 0;
      break;

    case "ArrowRight":
      console.log("ArrowRight");
      inputDir.x = 1;
      inputDir.y = 0;
      break;

    default:
      break;
  }
});
