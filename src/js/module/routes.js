// __________ Show Content  __________
export function routes() {
  // _____ show-content _____

  function contents() {
    const buttons = document.querySelectorAll("._btn-content");
    const contents = document.querySelectorAll("._content");

    buttons.forEach((btn) => {
      btn.addEventListener("click", (event) => {
        let data = event.target.dataset.screenOpen;
        
        contents.forEach((screen) => {
          if(screen.dataset.screen == data) {
            document.querySelector("._show").classList.remove("_show");
            screen.classList.add("_show");
            window.scrollTo(0, 0);
          }
        })  
      });
    });
  }
  // _____ /show-content _____
  
  
  
  // _____ show-hero _____
  function router() {
    const btnHeroes = document.querySelectorAll(".hero__btn");
    const heroes = document.querySelectorAll(".hero");
    
    btnHeroes.forEach((btn) => {
      btn.addEventListener("click", (event) => {
        let data = event.target.dataset.heroOpen;
        
        heroes.forEach((hero) => {
          if (hero.dataset.index == data) {
            document.querySelector("._show").classList.remove("_show");
            hero.classList.add("_show");
            window.scrollTo(0, 0);
          }
        });
      });
    });
  }
  
  router();
  
  contents();
  //  _____ /show-hero _____
}
