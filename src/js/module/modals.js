export function modals() {
  const modalBtns = document.querySelectorAll("._modal-open");
  const modals = document.querySelectorAll("._modal");

  const body = document.querySelector(".body");

  function openModal(elem) {
    elem.classList.add("_active");
    body.classList.add("_lock");
  }

  function closeModal(event) {
    if (
      event.target.classList.contains("modal__close") ||
      event.target.closest(".modal__close") ||
      event.target.classList.contains("modal__bg")
    ) {
      event.target.closest("._modal").classList.remove("_active");
      body.classList.remove("_lock");
    }
  }

  modalBtns.forEach((btn) => {
    btn.addEventListener("click", (event) => {
      let data = event.target.dataset.modalOpen;

      modals.forEach((modal) => {
        if (
          modal.dataset.modal == data ||
          modal.dataset.modal ==
            event.target.closest("._modal-open").dataset.modalOpen
        ) {
          openModal(modal);
        }
      });
    });
  });

  modals.forEach((modal) => {
    modal.addEventListener("click", (event) => closeModal(event));
  });

  window.addEventListener("keydown", (event) => {
    modals.forEach((modal) => {
      if (event.key === "Escape" && modal.classList.contains("_active")) {
        modal.classList.remove("_active");
        body.classList.remove("_lock");
      }
    });
  });
}
