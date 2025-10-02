let score = 0;
let highScore = parseInt(localStorage.getItem("archeryHighScore")) || 0;
let arrowsLeft = 10;
let combo = 0;
let isPaused = false;

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
    localStorage.setItem("archeryHighScore", highScore);
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

$("[class^=ring]").click(function (evt) {
  if (isPaused || arrowsLeft <= 0) return;

  evt.stopPropagation();

  const ringClass = $(this).attr("class").split(" ")[0];
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
  const offsetX = evt.pageX - $(this).offset().left;
  const offsetY = evt.pageY - $(this).offset().top;
  spot.css({
    left: offsetX + "px",
    top: offsetY + "px",
    transform: "translate(-50%, -50%)",
  });
  $(this).append(spot);

  if (arrowsLeft <= 0) {
    setTimeout(endGame, 500);
  }
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
updateDisplay();
