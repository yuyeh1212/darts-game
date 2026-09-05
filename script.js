let score = 0;
let highScore = parseInt(localStorage.getItem("dartsHighScore")) || 0;
let arrowsLeft = 10;
let combo = 0;
let isPaused = false;
let currentDifficulty = "normal";

const difficultySpeeds = {
  easy: 4,
  normal: 2,
  hard: 1,
};

const scoreValues = {
  ring1: 10,
  ring2: 8,
  ring3: 5,
  ring4: 2,
  ring5: 1,
};

function updateDisplay() {
  $(".score").text("分數: " + score);
  $(".high-score").text(highScore);
  $(".arrows-left").text(arrowsLeft);
  $(".combo").text(combo);
}

function showScorePopup(x, y, points) {
  const popup = $('<div class="score-popup">+' + points + "</div>");
  popup.css({ left: x + "px", top: y + "px" });
  $(".game-container").append(popup);
  setTimeout(() => popup.remove(), 1000);
}

function endGame() {
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("dartsHighScore", highScore);
  }
  $(".final-score").text(score);
  $(".final-high-score").text(highScore);
  $(".game-over").addClass("show");
}

function resetGame() {
  score = 0;
  arrowsLeft = 10;
  combo = 0;
  $(".spot").remove();
  $(".target").removeClass("moving");
  $(".game-over").removeClass("show");
  updateDisplay();
}

function registerHit(el, ringClass, evt) {
  const points = scoreValues[ringClass];
  const bonusPoints = points * (1 + combo * 0.1);
  const finalPoints = Math.floor(bonusPoints);

  score += finalPoints;
  arrowsLeft--;
  combo++;

  updateDisplay();
  showScorePopup(evt.pageX, evt.pageY, finalPoints);

  // 添加箭矢標記
  const spot = $('<div class="spot"></div>');
  const offsetX = evt.pageX - $(el).offset().left;
  const offsetY = evt.pageY - $(el).offset().top;
  spot.css({
    left: offsetX + "px",
    top: offsetY + "px",
    transform: "translate(-50%, -50%)",
  });
  $(el).append(spot);

  if (arrowsLeft <= 0) {
    setTimeout(endGame, 500);
  }
}

$("[class^=ring]").click(function (evt) {
  if (isPaused || arrowsLeft <= 0) return;
  evt.stopPropagation();
  const ringClass = $(this).attr("class").split(" ")[0];
  registerHit(this, ringClass, evt);
});

$(".target-hitzone").click(function (evt) {
  if (isPaused || arrowsLeft <= 0) return;
  evt.stopPropagation();
  registerHit(this, "ring5", evt);
});

function setDifficulty(level) {
  currentDifficulty = level;
  $(".difficulty-btn").removeClass("active");
  $(`.difficulty-btn[data-difficulty="${level}"]`).addClass("active");
  $(".target").css("animation-duration", difficultySpeeds[level] + "s");
}

$(".difficulty-btn").click(function () {
  setDifficulty($(this).data("difficulty"));
});

$(".target").click(function (evt) {
  if ($(evt.target).is("[class^=ring]")) return;
  combo = 0;
  updateDisplay();
});

$(window).keydown(function (evt) {
  if (evt.key.toLowerCase() === "r") {
    resetGame();
  }
  if (evt.key.toLowerCase() === "k") {
    $(".target").toggleClass("moving");
  }
  if (evt.key === " ") {
    evt.preventDefault();
    isPaused = !isPaused;
    if (isPaused) {
      $(".target").css("animation-play-state", "paused");
    } else {
      $(".target").css("animation-play-state", "running");
    }
  }
});

$(window).mousemove(function (evt) {
  $(".crosshair").css({
    left: evt.pageX + "px",
    top: evt.pageY + "px",
  });
});

// 初始化
setDifficulty(currentDifficulty);
updateDisplay();
