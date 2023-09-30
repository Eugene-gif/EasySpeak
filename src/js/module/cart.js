export function cart() {
  const url = "https://api.es.dev.emitlab.ru";
  const btnPay = document.querySelector(".btn-pay");
  const heroBtn = document.querySelectorAll(".cart-elem__btn");
  const btnFillCart = document.querySelectorAll(".cart-fill-up");
  const block = document.querySelector(".shopping-cart__list");

  const cart = {
    list: [],
    listDivs: [],
    btns: document.querySelectorAll(".cart-elem__btn"),
    btnsOnePay: document.querySelectorAll(".hero-buy-now"),
    displaysCountHero: document.querySelectorAll(".cart-count"),
    displaysCountHeroWord: document.querySelectorAll(".cart-count-word"),
    displayTotalCost: document.querySelector(".cart-cost-total"),
    totalCost: 0,
    totalHeroes: 0,
    basket: document.querySelector(".basket"),
    sale: () => {
      return (cart.totalCost = Math.floor(cart.totalCost * 0.8));
    },
    add: (btn) => {
      let data = btn.dataset;
      if (data.price > 0) {
        btn.classList.add("filled");
        btn.textContent = "Добавлено";
        cart.list.push(data);
        cart.totalCost += +data.price;
        cart.totalHeroes = cart.list.length;
        cart.displaysCountHero.forEach((count) => {
          count.textContent = cart.totalHeroes;
        });
        cart.displayTotalCost.textContent = cart.totalCost;
        cart.word();

        let template = `
          <div class="card-item__block-title">
            <div class="card-item__img-wrapper">
              <div class="card-item__img">
                <img src="${data.src}" alt="Изображение героя">
              </div>
            </div>
            <div>
              <h3 class="card-item__title">${data.title}</h3>
              <div class="card-item__cost active">
                <span>${data.price}</span>
                <span>рублей</span>
              </div>
            </div>
          </div>
          <div class="card-item__block-info">
            <div class="card-item__date component-link">
              <img class="component-link__icon" src="${data.src}" viewBox="0 0 10 10" width="20" height="20">
              12.10.2022 12:19
            </div>
            <button class="card-item__btn btn del-cart-item" data-id-del="${data.id}">Удалить</button>
          </div>
        `;

        const newDiv = document.createElement("DIV");
        newDiv.innerHTML = template;
        newDiv.classList.add("card-item", "template");
        newDiv.classList.add(`card-item-${data.id}`);
        newDiv
          .querySelector(".del-cart-item")
          .addEventListener("click", (event) => {
            event.preventDefault();
            cart.remove(btn);
          });
        block.appendChild(newDiv);
        cart.cartEmpty();

        if (cart.displaysCountHero[1].innerHTML >= 1) {
          cart.basket.classList.add("fixed");
        }
      }
    },
    remove: (btn) => {
      let data = btn.dataset;
      btn.classList.remove("filled");
      btn.textContent = "Купить";

      const div = document.querySelector(`.card-item-${data.id}`);
      cart.totalCost = 0;

      let index;
      cart.list.forEach((item, ind) => {
        if (item.id === data.id) {
          index = ind;
        } else {
          cart.totalCost += parseInt(item.price, 10);
        }
      });

      cart.list.splice(index, 1);

      div.parentNode.removeChild(div);
      cart.totalHeroes = cart.list.length;
      cart.displaysCountHero.forEach((count) => {
        count.textContent = cart.totalHeroes;
      });
      cart.displayTotalCost.textContent = cart.totalCost;
      cart.word();
      cart.cartEmpty();
      if (cart.displaysCountHero[1].innerHTML == 0) {
        cart.basket.classList.remove("fixed");
      }
    },

    clear: () => {
      heroBtn.forEach((btn) => {
        btn.classList.remove("filled");
        btn.textContent = "В корзину";
      });
      cart.list.length = 0;
      cart.listDivs.length = 0;
      cart.totalHeroes = 0;
      cart.totalCost = 0;
      cart.displaysCountHero.forEach((count) => {
        count.textContent = cart.totalHeroes;
      });
      cart.displayTotalCost.textContent = cart.totalCost;
      cart.word();
      heroBtn.forEach((btn) => {
        btn.classList.remove("filled");
        btn.textContent = "В корзину";
      });
    },
    fill: () => {
      cart.clear();
      heroBtn.forEach((btn) => {
        cart.add(btn);
      });
      cart.sale();
      cart.displayTotalCost.textContent = cart.totalCost;
    },
    word: () => {
      let str = "герой";
      if (cart.totalHeroes === 1 || cart.totalHeroes === 21) {
        str = "герой";
      } else if (cart.totalHeroes >= 2 && cart.totalHeroes <= 4) {
        str = "героя";
      } else {
        str = "героев";
      }
      cart.displaysCountHeroWord.forEach((word) => {
        word.textContent = str;
      });
    },
    cartEmpty: () => {
      let block = document.querySelectorAll(".shopping-cart__cost");
      if (cart.totalHeroes > 0) {
        block[0].classList.add("active");
        block[1].classList.remove("active");
      } else {
        block[0].classList.remove("active");
        block[1].classList.add("active");
      }
    },
  };

  btnFillCart.forEach((btn) => {
    btn.addEventListener("click", fillAll);
  });

  heroBtn.forEach((btn) => {
    btn.addEventListener("click", (event) => {
      let data = event.target.dataset;

      let index = -1;
      cart.list.forEach((item, ind) => {
        if (item.id === data.id) {
          index = ind;
        }
      });

      if (index === -1) {
        cart.add(btn);
      } else {
        cart.remove(btn);
      }
    });
  });

  function fillAll() {
    removeAll();
    cart.fill();
  }

  function removeAll() {
    let cartList = document.querySelectorAll(".card-item.template");
    cartList.forEach((item) => {
      item.parentNode.removeChild(item);
    });
  }

  // _____ Pay _____

  function pay(data) {
    return fetch(url + "/bill/create", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      return response.json();
    });
  }

  if (btnPay) {
    btnPay.addEventListener("click", () => {
      let dataPay = {};
      dataPay.heroes = cart.list;
      dataPay.cost = cart.totalCost;
      const res = pay(dataPay);

      res.then((response) => {
        window.location.href = response.result.item.redirectUrl;
      });
    });
  }
  cart.btnsOnePay.forEach((btn) => {
    btn.addEventListener("click", () => {
      cart.clear();
      let dataPay = {};
      dataPay.heroes = [];
      dataPay.heroes.push({ id: +btn.dataset.id });
      dataPay.cost = +btn.dataset.price;
      const res = pay(dataPay);
      res.then((response) => {
        window.location.href = response.result.item.redirectUrl;
      });
    });
  });

  //  _____ /Pay _____
}
