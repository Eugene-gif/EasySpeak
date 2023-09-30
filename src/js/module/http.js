export function http() {
  // const url = "https://api.es.dev.emitlab.ru";
  // const url = "https://f1e1-85-174-200-110.eu.ngrok.io/web/auth/login";
  const url = "https://api.es.dev.emitlab.ru";
  let userCode;
  const METHODS = {
    GET: "GET",
    POST: "POST",
    PUT: "PUT",
    DELETE: "DELETE",
  };

  const details = {
    logout: document.querySelector(".modal__exit"),
    delete: document.querySelector(".btn__delete"),
    loginBtn: document.querySelectorAll(".login__btn"),
    inputEmail: document.querySelector(".login__input"),
    inputs: document.querySelectorAll(".access__input"),
    accessBack: document.querySelector(".access__back"),
    codeError: document.querySelector(".access__error"),
    newCode: document.querySelector(".access__new-code"),
    btnDelEmail: document.querySelector("._clear-email"),
  };

  // _____ Validation email _____
  const EMAIL_REGEXP =
    /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;

  function onInput() {
    const errorText = document.querySelector("._error-text");

    if (isEmailValid(details.inputEmail.value)) {
      details.inputEmail.style.borderColor = "green";
      errorText.classList.add("hidden");
      details.loginBtn.forEach((btn) => {
        btn.removeAttribute("disabled");
      });
    } else {
      details.inputEmail.style.borderColor = "#FF521C";
      errorText.classList.remove("hidden");
      details.loginBtn.forEach((btn) => {
        btn.setAttribute("disabled", true);
      });
    }
  }

  function isEmailValid(value) {
    return EMAIL_REGEXP.test(value);
  }

  details.inputEmail.addEventListener("input", onInput);
  details.inputEmail.addEventListener("click", onInput);
  // _____ /Validation email _____

  let data = {};
  const formEmail = document.querySelector(".login__form");
  formEmail.addEventListener("submit", function (event) {
    event.preventDefault();
    data.email = formEmail.querySelector(".login__input").value;

    const res = auth(data);

    res.then((response) => {
      if (!response.ok) {
        error();
      } else {
        errorDel();
        return response.json();
      }
    });
  });

  details.inputs.forEach((input, key) => {
    input.addEventListener("keyup", function () {
      if (input.value) {
        if (key) {
          userCode = [...details.inputs].map((input) => input.value).join("");

          if (userCode.length === 5) {
            data.confirm_code = userCode;

            const res = auth(data);

            res
              .then((response) => {
                if (!response.ok) {
                  error();
                } else {
                  return response.json();
                }
              })
              .then((r) => {
                window.location.href = `/${r.result.data.token}`;
              });
          } else {
            error();
          }
        }
      }
    });
  });

  details.accessBack.addEventListener("click", () => {
    errorDel();
    data = {};
    errorText.classList.remove("hidden");
    details.loginBtn.forEach((btn) => {
      btn.setAttribute("disabled", true);
    });
    details.inputs.forEach((input) => {
      input.value = "";
    });
  });
  // _____ auth _____

  details.newCode.addEventListener("click", (event) => {
    let payload = {};

    errorDel();
    event.preventDefault();
    console.log("Повторно отправить код");
    payload.email = formEmail.querySelector(".login__input").value;

    const res = auth(payload);

    res.then((response) => {
      if (!response.ok) {
        error();
      } else {
        return response.json();
      }
    });
  });

  function auth(data) {
    return fetch(url + "/web/auth/login", {
      method: METHODS.POST,
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  // _____ /auth _____

  // _____ logout _____

  details.logout.addEventListener("click", loader);

  function logout() {
    return fetch(url + "/user/logout", {
      method: METHODS.GET,
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((resp) => {
        JSON.stringify(resp);
        console.log("loading...");
      })
      .then(() => {
        window.location.href = "/";
      });
  }
  // _____ /logout _____

  // _____ delUser _____
  details.delete.addEventListener("click", delUser);

  function delUser() {
    return fetch(url + "/user/delete", {
      method: METHODS.DELETE,
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((resp) => {
        JSON.stringify(resp);
      })
      .then(() => {
        window.location.href = `/`;
      });
  }

  function error() {
    console.error("Error");
    details.codeError.classList.remove("hidden");
    details.inputs.forEach((input) => {
      input.style.border = "1px solid #FF521C";
    });
  }

  function errorDel() {
    details.codeError.classList.add("hidden");
    details.inputs.forEach((input) => {
      input.style.border = "1px solid #ededed";
      input.value = "";
    });
  }

  details.btnDelEmail.addEventListener("click", clearEmail);
  function clearEmail() {
    const errorText = document.querySelector("._error-text");
    console.log(details.inputEmail.value);
    details.inputEmail.value = "";
    details.inputEmail.style.border = "1px solid #ededed";
    errorText.classList.add("hidden");
    details.loginBtn.forEach((btn) => {
      btn.setAttribute("disabled", true);
    });
  }

  function loader() {
    let text = document.querySelector("._loader-text");
    text.replaceChildren();
    text.innerHTML = "Ожидайте...";
    text.style.fontSize = "32px";
    text.style.fontWeight = "600";
    text.style.padding = "60px";
    console.log(text);
    console.log("Loading...");
    logout();
  }
  // _____ /delUser _____
}
