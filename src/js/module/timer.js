export function timer() {
  const timerShow = document.querySelector(".timer_show");
  const newCode = document.querySelector(".access__new-code"); 

  //__________ Timer __________
  const btnsRunTimer = document.querySelectorAll(".btn-run-timer");
  const btnsClearTimer = document.querySelectorAll("btn-clear-timer");
  let timeSecond = 10;

  btnsRunTimer.forEach((btn) => {
    btn.addEventListener("click", startTimer);
  });

  btnsClearTimer.forEach((btn) => {
    btn.addEventListener("click", clearTimer);
  });

  let timer;

  function setZero(num) {
    return num > 9 ? num : `0${num}`;
  }

  function startTimer() {
    clearTimer();
    timeSecond = 60;
    timer = setInterval(function () {
      let seconds = timeSecond % 60; 
      let minutes = parseInt((timeSecond / 60) % 60, 10);

      newCode.setAttribute("disabled", true);
      if (timeSecond <= 0) {
        clearTimer();
      } else {
        let strTimer = `${setZero(minutes)}:${setZero(seconds)}`;
        timerShow.innerHTML = strTimer;
      }
      --timeSecond;
    }, 1000);
  }

  function clearTimer() {
    clearInterval(timer);
    timerShow.innerHTML = `00:00`;
    newCode.removeAttribute("disabled");
  }
  //__________ /Functions __________
}
