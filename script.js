// initialie all of the variables
var mario = document.getElementById("mario");
var pipe = document.getElementById("pipe");
var mushroom = document.getElementById("mushroom");
var backgroundMusic = document.getElementById("background-music");
var jumpSound = document.getElementById("jump-sound");
var startBtn = document.getElementById("start-btn");

startBtn.addEventListener("click", function () {
  backgroundMusic.play();
  startBtn.style.display = "none";
  document.getElementById("game-container").style.display = "block";
  startGame();
});

function startGame() {
  var marioJumping = false;
  var marioMovingRight = false;
  var marioMovingLeft = false;
  var obstacles = [pipe, mushroom];
  var gameScore = 0;
  var gameContainerWidth =
    document.getElementById("game-container").offsetWidth;
  var marioPosition = 50;

  function jump() {
    if (!marioJumping) {
      marioJumping = true;
      jumpSound.play();

      var startPos = 32;
      var endPos = 153;
      var speed = 5;

      var jumpInterval = setInterval(function () {
        if (startPos < endPos) {
          startPos += speed;
          mario.style.bottom = startPos + "px";
        } else {
          clearInterval(jumpInterval);
          fall();
        }
      }, 20);
    }

    function fall() {
      var startPos = 153;
      var endPos = 32;
      var speed = 5;

      var fallInterval = setInterval(function () {
        if (startPos > endPos) {
          startPos -= speed;
          mario.style.bottom = startPos + "px";
        } else {
          clearInterval(fallInterval);
          marioJumping = false;
        }
      }, 20);
    }
  }

  function moveMario(direction) {
    var proposedPosition = marioPosition + (direction === "right" ? 20 : -20);
    var maxPosition = gameContainerWidth - mario.offsetWidth;
    if (proposedPosition >= -30 && proposedPosition <= maxPosition + 60) {
      marioPosition = proposedPosition;
      mario.style.left = marioPosition + "px";
      if (direction === "right") {
        mario.classList.remove("flipped");
      } else {
        mario.classList.add("flipped");
      }
    } else {
      var startPos = 32;
      var endPos = -300;
      var speed = 8;

      var fallInterval = setInterval(function () {
        if (startPos > endPos) {
          startPos -= speed;
          mario.style.bottom = startPos + "px";
        } else {
          clearInterval(fallInterval);
          marioJumping = false;
        }
      }, 20);
    }
  }

  function checkCollision(obstaclePos) {
    return obstaclePos < marioPosition + 30 && obstaclePos > marioPosition;
  }
  function moveObstacle(obstacle) {
    var obstaclePos = gameContainerWidth;
    obstacle.style.left = obstaclePos + "px";

    var obstacleTimer = setInterval(function () {
      if (obstaclePos < 0) {
        obstacle.style.display = "none";
        obstaclePos = gameContainerWidth;
        setTimeout(() => {
          obstacle.style.display = "block";
        }, 100);
        gameScore++;
        score.innerText = gameScore;
      } else if (checkCollision(obstaclePos) && marioJumping) {
        obstaclePos -= 10; // increase speed
      } else if (checkCollision(obstaclePos) && !marioJumping) {
        clearInterval(obstacleTimer);
        score.innerText = "Game Over! Score: " + gameScore;
        obstacles.forEach(function (obstacle) {
          obstacle.style.animationPlayState = "paused";
        });
        if (confirm("Game Over!")) {
          location.reload();
        } else {
          location.reload();
        }
      } else {
        obstaclePos -= 10;
      }
      obstacle.style.left = obstaclePos + "px";
    }, Math.random() * (200 - 50) + 50);
  }

  window.addEventListener("keydown", function (event) {
    switch (event.key) {
      case " ":
        jump();
        break;
      case "ArrowRight" || "d":
        marioMovingRight = true;
        break;
      case "ArrowLeft" || "a":
        marioMovingLeft = true;
        break;
    }
  });

  window.addEventListener("keyup", function (event) {
    switch (event.key) {
      case "ArrowRight" || "d":
        marioMovingRight = false;
        break;
      case "ArrowLeft" || "a":
        marioMovingLeft = false;
        break;
    }
  });

  setInterval(function () {
    if (marioMovingRight) {
      moveMario("right");
    } else if (marioMovingLeft) {
      moveMario("left");
    }
  }, 100);

  obstacles.forEach(function (obstacle, index) {
    setTimeout(function () {
      obstacle.style.display = "block";
      moveObstacle(obstacle);
    }, index * 2000);
  });

  // Start Game
}
