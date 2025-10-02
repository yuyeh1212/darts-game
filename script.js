var score = 0;

$("[class^=cir]").click(function (evt) {
  var num = $(this).attr("data-label");
  console.log(num);
  score += parseInt(num * 10);
  $(".score").text("Score: " + score);
});

function updateGame() {
  $(".score").text("Score: " + score);
}

function resetGame() {
  score = 0;
  $(".spot").remove();
  $(".target").removeClass("moving");
  updateGame();
}

$(window).keydown(function (evt) {
  console.log(evt.key);
  if (evt.key == "r") {
    resetGame();
  }
  if (evt.key == "k") {
    $(".target").toggleClass("moving");
  }
});

$(window).mousemove(function (evt) {
  $(".mouseText").text(evt.pageX + "," + evt.pageY);
  $(".mouseSymbol")
    .css("left", evt.pageX + "px")
    .css("top", evt.pageY + "px");
});

$(".target").click(function (evt) {
  var spot = $("<div class='spot'></div>");
  spot
    .css("left", evt.pageX - $(this).offset().left + "px")
    .css("top", evt.pageY - $(this).offset().top + "px");
  $(this).append(spot);
  console.log(spot);
});
